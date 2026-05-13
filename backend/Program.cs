using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Dapper;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Npgsql;
using ShkruajShpejt.Api;

Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;

LoadDotEnv();

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

var supabaseUrl = Environment.GetEnvironmentVariable("SUPABASE_URL") ?? builder.Configuration["SUPABASE_URL"];
var supabaseJwtSecret = Environment.GetEnvironmentVariable("SUPABASE_JWT_SECRET") ?? builder.Configuration["SUPABASE_JWT_SECRET"];
var jwtSigningSecret = string.IsNullOrWhiteSpace(supabaseJwtSecret)
    ? "local-development-secret-change-before-use-32"
    : supabaseJwtSecret;
var jwksProvider = new SupabaseJwksProvider(supabaseUrl);
var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL") ?? builder.Configuration["DATABASE_URL"];
var port = Environment.GetEnvironmentVariable("PORT");
var corsOrigins = (Environment.GetEnvironmentVariable("CORS_ALLOWED_ORIGINS") ?? "")
    .Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries);

if (builder.Environment.IsProduction())
{
    var missing = new List<string>();
    if (string.IsNullOrWhiteSpace(databaseUrl)) missing.Add("DATABASE_URL");
    if (string.IsNullOrWhiteSpace(supabaseUrl)) missing.Add("SUPABASE_URL");
    if (string.IsNullOrWhiteSpace(supabaseJwtSecret)) missing.Add("SUPABASE_JWT_SECRET");
    if (corsOrigins.Length == 0) missing.Add("CORS_ALLOWED_ORIGINS");

    if (missing.Count > 0)
    {
        throw new InvalidOperationException($"Production config mungon: {string.Join(", ", missing)}");
    }
}

if (!string.IsNullOrWhiteSpace(port) && string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("ASPNETCORE_URLS")))
{
    builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
}

if (args.Any(arg => string.Equals(arg, "--setup-db", StringComparison.OrdinalIgnoreCase)))
{
    await RunDatabaseSetup(databaseUrl);
    return;
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("app", policy =>
    {
        policy
            .WithOrigins(corsOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.MapInboundClaims = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSigningSecret)),
            IssuerSigningKeyResolver = (_, _, kid, _) =>
            {
                var keys = new List<SecurityKey>
                {
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSigningSecret))
                };

                keys.AddRange(jwksProvider.GetSigningKeys());

                if (string.IsNullOrWhiteSpace(kid))
                {
                    return keys;
                }

                var matchingKeys = keys.Where(key => string.Equals(key.KeyId, kid, StringComparison.Ordinal)).ToArray();
                return matchingKeys.Length > 0 ? matchingKeys : keys;
            },
            ValidateIssuer = !string.IsNullOrWhiteSpace(supabaseUrl),
            ValidIssuers = string.IsNullOrWhiteSpace(supabaseUrl)
                ? null
                : [$"{supabaseUrl.TrimEnd('/')}/auth/v1", "supabase"],
            ValidateAudience = false,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(2),
            NameClaimType = "sub",
            RoleClaimType = "role"
        };
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                context.HttpContext.RequestServices
                    .GetRequiredService<ILoggerFactory>()
                    .CreateLogger("SupabaseJwt")
                    .LogWarning(context.Exception, "Supabase JWT validation failed");
                return Task.CompletedTask;
            },
            OnChallenge = async context =>
            {
                context.HandleResponse();
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsJsonAsync(new { message = "Hyrja nuk u verifikua. Dil dhe kycu perseri." });
            }
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddHttpClient();
builder.Services.AddSingleton<PaymentProviderFactory>();

var app = builder.Build();

app.UseExceptionHandler(exceptionApp =>
{
    exceptionApp.Run(async context =>
    {
        var exception = context.Features.Get<IExceptionHandlerPathFeature>()?.Error;
        if (exception is not null)
        {
            context.RequestServices
                .GetRequiredService<ILoggerFactory>()
                .CreateLogger("UnhandledApiError")
                .LogError(exception, "Unhandled API error for {Method} {Path}", context.Request.Method, context.Request.Path);

            await WriteRuntimeError(exception);
        }

        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { message = "Gabim ne server" });
    });
});

app.UseCors("app");
app.UseAuthentication();
app.UseAuthorization();
app.Use(async (context, next) =>
{
    if (!RequiresLegalAcceptanceCheck(context))
    {
        await next();
        return;
    }

    var userId = TryGetUserId(context.User);
    if (userId is null)
    {
        await next();
        return;
    }

    await using var db = await OpenConnection(databaseUrl);
    await UpsertProfileFromClaims(db, context.User);
    if (await UserMustAcceptTerms(db, userId.Value))
    {
        context.Response.StatusCode = StatusCodes.Status428PreconditionRequired;
        await context.Response.WriteAsJsonAsync(new { message = "Duhet te pranosh kushtet per te vazhduar" });
        return;
    }

    await next();
});

app.MapGet("/api/health", async () =>
{
    var databaseConfigured = !string.IsNullOrWhiteSpace(databaseUrl);
    var supabaseConfigured = !string.IsNullOrWhiteSpace(supabaseUrl) &&
        !string.IsNullOrWhiteSpace(supabaseJwtSecret);
    var databaseReachable = databaseConfigured && await CheckDatabaseReachable(databaseUrl);

    return Results.Ok(new HealthDto(
        databaseReachable && supabaseConfigured ? "ok" : "degraded",
        databaseConfigured,
        databaseReachable,
        supabaseConfigured,
        DateTimeOffset.UtcNow));
});

app.MapGet("/api/auth/status", () =>
{
    var publicKeys = jwksProvider.GetSigningKeys()
        .Select(key => new { kid = key.KeyId, type = key.GetType().Name })
        .ToArray();

    return Results.Ok(new
    {
        supabaseUrlConfigured = !string.IsNullOrWhiteSpace(supabaseUrl),
        jwtSecretConfigured = !string.IsNullOrWhiteSpace(supabaseJwtSecret),
        jwksKeys = publicKeys
    });
});

app.MapGet("/api/billing/status", async (HttpContext context) =>
{
    var userId = GetUserId(context.User);
    await using var db = await OpenConnection(databaseUrl);
    var status = await LoadBillingStatus(db, userId);
    return Results.Ok(status);
}).RequireAuthorization();

app.MapPost("/api/billing/create-checkout", async (
    HttpContext context,
    CreateCheckoutRequest request,
    PaymentProviderFactory providerFactory,
    CancellationToken cancellationToken) =>
{
    var userId = GetUserId(context.User);
    if (!BillingPlans.IsSelfServePlan(request.Plan))
    {
        return Results.BadRequest(new { message = "Plan i pavlefshem" });
    }

    await using var db = await OpenConnection(databaseUrl);
    var profile = await UpsertProfileFromClaims(db, context.User);
    var provider = providerFactory.Create();
    var siteUrl = ResolveSiteUrl(context);

    try
    {
        var checkout = await provider.CreateCheckoutSession(
            new BillingUser(userId, profile.Email, profile.FullName),
            request.Plan,
            siteUrl,
            cancellationToken);

        return Results.Ok(checkout);
    }
    catch (BillingNotConfiguredException exception)
    {
        return Results.Json(new { message = exception.Message }, statusCode: StatusCodes.Status503ServiceUnavailable);
    }
}).RequireAuthorization();

app.MapPost("/api/billing/webhook", async (
    HttpContext context,
    PaymentProviderFactory providerFactory,
    CancellationToken cancellationToken) =>
{
    var provider = providerFactory.Create();
    var signature = context.Request.Headers["Paddle-Signature"].FirstOrDefault() ??
        context.Request.Headers["X-Signature"].FirstOrDefault() ??
        context.Request.Headers["X-Lemon-Signature"].FirstOrDefault();

    using var reader = new StreamReader(context.Request.Body, Encoding.UTF8);
    var payload = await reader.ReadToEndAsync(cancellationToken);

    try
    {
        var result = await provider.HandleWebhook(payload, signature, cancellationToken);
        await using var db = await OpenConnection(databaseUrl);
        await SavePaymentEvent(db, provider.Name, result.EventId, result.EventType, payload);

        if (result.UserId is not null &&
            !string.IsNullOrWhiteSpace(result.Plan) &&
            !string.IsNullOrWhiteSpace(result.Status))
        {
            await UpsertSubscription(
                db,
                result.UserId.Value,
                provider.Name,
                result.ProviderCustomerId,
                result.ProviderSubscriptionId,
                result.Plan!,
                result.Status!,
                result.CurrentPeriodStart,
                result.CurrentPeriodEnd,
                result.CancelAtPeriodEnd,
                result.Lifetime);
        }

        return Results.Ok(new { received = true });
    }
    catch (UnauthorizedAccessException)
    {
        return Results.Unauthorized();
    }
    catch (BillingNotConfiguredException exception)
    {
        return Results.Json(new { message = exception.Message }, statusCode: StatusCodes.Status503ServiceUnavailable);
    }
});

app.MapPost("/api/billing/manual-activate", async (HttpContext context, ManualActivateRequest request) =>
{
    var adminToken = Environment.GetEnvironmentVariable("BILLING_ADMIN_TOKEN") ?? builder.Configuration["BILLING_ADMIN_TOKEN"];
    var requestToken = context.Request.Headers["X-Billing-Admin-Token"].FirstOrDefault();
    if (string.IsNullOrWhiteSpace(adminToken) || !string.Equals(adminToken, requestToken, StringComparison.Ordinal))
    {
        return Results.Unauthorized();
    }

    if (!BillingPlans.IsPaidPlan(request.Plan))
    {
        return Results.BadRequest(new { message = "Plan i pavlefshem" });
    }

    await using var db = await OpenConnection(databaseUrl);
    await UpsertSubscription(
        db,
        request.UserId,
        "manual",
        null,
        null,
        request.Plan,
        string.IsNullOrWhiteSpace(request.Status) ? "active" : request.Status,
        request.CurrentPeriodStart ?? DateTimeOffset.UtcNow,
        request.CurrentPeriodEnd,
        false,
        request.Lifetime || string.Equals(request.Plan, BillingPlans.Lifetime, StringComparison.OrdinalIgnoreCase));

    return Results.Ok(new { activated = true });
});

app.MapGet("/api/me", async (HttpContext context) =>
{
    var userId = GetUserId(context.User);
    await using var db = await OpenConnection(databaseUrl);

    var profile = await db.QuerySingleOrDefaultAsync<ProfileDto>(
        """
        select
          id as "Id",
          email as "Email",
          full_name as "FullName",
          avatar_url as "AvatarUrl",
          terms_accepted_at as "TermsAcceptedAt",
          terms_version as "TermsVersion",
          privacy_accepted_at as "PrivacyAcceptedAt",
          privacy_version as "PrivacyVersion",
          (
            terms_accepted_at is null or
            privacy_accepted_at is null or
            terms_version is distinct from @CurrentTermsVersion or
            privacy_version is distinct from @CurrentPrivacyVersion
          ) as "MustAcceptTerms",
          created_at as "CreatedAt",
          updated_at as "UpdatedAt"
        from public.profiles
        where id = @UserId
        """,
        new
        {
            UserId = userId,
            CurrentTermsVersion = LegalVersions.CurrentTermsVersion,
            CurrentPrivacyVersion = LegalVersions.CurrentPrivacyVersion
        });

    profile ??= await UpsertProfileFromClaims(db, context.User);
    return Results.Ok(profile);
}).RequireAuthorization();

app.MapPost("/api/profile/sync", async (HttpContext context) =>
{
    await using var db = await OpenConnection(databaseUrl);
    var profile = await UpsertProfileFromClaims(db, context.User);
    return Results.Ok(profile);
}).RequireAuthorization();

app.MapPost("/api/legal/accept", async (HttpContext context, AcceptLegalRequest request) =>
{
    if (!string.Equals(request.TermsVersion, LegalVersions.CurrentTermsVersion, StringComparison.Ordinal) ||
        !string.Equals(request.PrivacyVersion, LegalVersions.CurrentPrivacyVersion, StringComparison.Ordinal))
    {
        return Results.BadRequest(new { message = "Versioni i kushteve nuk eshte aktual. Rifresko faqen dhe provo perseri." });
    }

    var userId = GetUserId(context.User);
    await using var db = await OpenConnection(databaseUrl);
    await UpsertProfileFromClaims(db, context.User);

    var profile = await db.QuerySingleAsync<ProfileDto>(
        """
        update public.profiles
        set
          terms_accepted_at = now(),
          terms_version = @TermsVersion,
          privacy_accepted_at = now(),
          privacy_version = @PrivacyVersion,
          updated_at = now()
        where id = @UserId
        returning
          id as "Id",
          email as "Email",
          full_name as "FullName",
          avatar_url as "AvatarUrl",
          terms_accepted_at as "TermsAcceptedAt",
          terms_version as "TermsVersion",
          privacy_accepted_at as "PrivacyAcceptedAt",
          privacy_version as "PrivacyVersion",
          false as "MustAcceptTerms",
          created_at as "CreatedAt",
          updated_at as "UpdatedAt"
        """,
        new
        {
            UserId = userId,
            TermsVersion = LegalVersions.CurrentTermsVersion,
            PrivacyVersion = LegalVersions.CurrentPrivacyVersion
        });

    return Results.Ok(profile);
}).RequireAuthorization();

app.MapGet("/api/tests", async (HttpContext context) =>
{
    var userId = GetUserId(context.User);
    await using var db = await OpenConnection(databaseUrl);

    var tests = await db.QueryAsync<TypingTestDto>(
        """
        select
          id,
          mode_seconds,
          difficulty,
          category,
          wpm,
          raw_wpm,
          accuracy,
          correct_chars,
          incorrect_chars,
          total_chars,
          errors::text as errors,
          speed_timeline::text as speed_timeline,
          created_at
        from public.typing_tests
        where user_id = @UserId
        order by created_at desc
        limit 100
        """,
        new { UserId = userId });

    return Results.Ok(tests);
}).RequireAuthorization();

app.MapPost("/api/tests", async (HttpContext context, SaveTypingTestRequest request) =>
{
    var userId = GetUserId(context.User);
    var errorsJson = JsonSerializer.Serialize(request.Errors ?? new Dictionary<string, int>());
    var timelineJson = JsonSerializer.Serialize(request.SpeedTimeline ?? Array.Empty<SpeedPointDto>());
    var practiceSeconds = NormalizePracticeSeconds(request.ElapsedSeconds, request.ModeSeconds);

    await using var db = await OpenConnection(databaseUrl);
    await UpsertProfileFromClaims(db, context.User);
    await using var tx = await db.BeginTransactionAsync();

    var testId = await db.ExecuteScalarAsync<Guid>(
        """
        insert into public.typing_tests (
          user_id,
          mode_seconds,
          difficulty,
          category,
          wpm,
          raw_wpm,
          accuracy,
          correct_chars,
          incorrect_chars,
          total_chars,
          errors,
          speed_timeline
        )
        values (
          @UserId,
          @ModeSeconds,
          @Difficulty,
          @Category,
          @Wpm,
          @RawWpm,
          @Accuracy,
          @CorrectChars,
          @IncorrectChars,
          @TotalChars,
          cast(@Errors as jsonb),
          cast(@SpeedTimeline as jsonb)
        )
        returning id
        """,
        new
        {
            UserId = userId,
            request.ModeSeconds,
            request.Difficulty,
            request.Category,
            request.Wpm,
            request.RawWpm,
            request.Accuracy,
            request.CorrectChars,
            request.IncorrectChars,
            request.TotalChars,
            Errors = errorsJson,
            SpeedTimeline = timelineJson
        },
        tx);

    await ApplyKeyStats(db, tx, userId, request.Errors, request.KeyStats);
    await IncrementDailyStats(db, tx, userId, practiceSeconds, request.Wpm, request.Accuracy, true);
    await tx.CommitAsync();

    return Results.Created($"/api/tests/{testId}", new { id = testId });
}).RequireAuthorization();

app.MapGet("/api/stats/summary", async (HttpContext context) =>
{
    var userId = GetUserId(context.User);
    await using var db = await OpenConnection(databaseUrl);

    var total = await db.QuerySingleAsync<TotalStatsRow>(
        """
        select
          count(*)::int as tests_completed,
          coalesce(max(wpm), 0) as best_wpm,
          coalesce(avg(wpm), 0) as average_wpm,
          coalesce(avg(accuracy), 0) as average_accuracy,
          coalesce((
            select sum(practice_seconds)
            from public.daily_stats
            where user_id = @UserId
          ), 0)::int as total_practice_seconds
        from public.typing_tests
        where user_id = @UserId
        """,
        new { UserId = userId });

    var today = await db.QuerySingleOrDefaultAsync<TodayStatsRow>(
        """
        select
          tests_completed as tests_today,
          practice_seconds as practice_seconds_today,
          avg_wpm as average_wpm_today,
          avg_accuracy as average_accuracy_today
        from public.daily_stats
        where user_id = @UserId and date = current_date
        """,
        new { UserId = userId }) ?? new TodayStatsRow(0, 0, 0, 0);

    var dates = (await db.QueryAsync<DateTime>(
        """
        select date
        from public.daily_stats
        where user_id = @UserId and practice_seconds > 0
        order by date desc
        limit 90
        """,
        new { UserId = userId })).Select(DateOnly.FromDateTime).ToArray();

    var streak = CalculateStreak(dates);

    return Results.Ok(new SummaryDto(
        total.TestsCompleted,
        total.BestWpm,
        total.AverageWpm,
        total.AverageAccuracy,
        total.TotalPracticeSeconds,
        streak,
        today.TestsToday,
        today.PracticeSecondsToday,
        today.AverageWpmToday,
        today.AverageAccuracyToday));
}).RequireAuthorization();

app.MapGet("/api/stats/progress", async (HttpContext context) =>
{
    var userId = GetUserId(context.User);
    await using var db = await OpenConnection(databaseUrl);

    var rows = await db.QueryAsync<ProgressPointDto>(
        """
        select
          created_at::date as date,
          round(avg(wpm), 2) as wpm,
          round(avg(accuracy), 2) as accuracy,
          count(*)::int as tests
        from public.typing_tests
        where user_id = @UserId and created_at >= now() - interval '60 days'
        group by created_at::date
        order by date
        """,
        new { UserId = userId });

    return Results.Ok(rows);
}).RequireAuthorization();

app.MapGet("/api/lessons", async (HttpContext context) =>
{
    var userId = TryGetUserId(context.User);
    await using var db = await OpenConnection(databaseUrl);
    var lessons = await LoadLessons(db, userId);
    return Results.Ok(lessons);
});

app.MapGet("/api/lessons/{slug}", async (HttpContext context, string slug) =>
{
    var userId = TryGetUserId(context.User);
    await using var db = await OpenConnection(databaseUrl);
    var lessons = await LoadLessons(db, userId);
    var lesson = lessons.FirstOrDefault(item => string.Equals(item.Slug, slug, StringComparison.OrdinalIgnoreCase));
    return lesson is null ? Results.NotFound(new { message = "Mesimi nuk u gjet" }) : Results.Ok(lesson);
});

app.MapPost("/api/lessons/{lessonId:guid}/attempt", async (HttpContext context, Guid lessonId, SaveLessonAttemptRequest request) =>
{
    var userId = GetUserId(context.User);
    await using var db = await OpenConnection(databaseUrl);
    await UpsertProfileFromClaims(db, context.User);

    var lesson = await db.QuerySingleOrDefaultAsync<LessonRequirementRow>(
        """
        select required_accuracy, required_wpm
        from public.lessons
        where id = @LessonId
        """,
        new { LessonId = lessonId });

    if (lesson is null)
    {
        return Results.NotFound(new { message = "Mesimi nuk u gjet" });
    }

    var completed = request.Completed ||
        (request.Accuracy >= lesson.RequiredAccuracy && request.Wpm >= lesson.RequiredWpm);

    await using var tx = await db.BeginTransactionAsync();

    await db.ExecuteAsync(
        """
        insert into public.lesson_progress (
          user_id,
          lesson_id,
          best_wpm,
          best_accuracy,
          completed,
          attempts
        )
        values (
          @UserId,
          @LessonId,
          @Wpm,
          @Accuracy,
          @Completed,
          1
        )
        on conflict (user_id, lesson_id) do update set
          best_wpm = greatest(public.lesson_progress.best_wpm, excluded.best_wpm),
          best_accuracy = greatest(public.lesson_progress.best_accuracy, excluded.best_accuracy),
          completed = public.lesson_progress.completed or excluded.completed,
          attempts = public.lesson_progress.attempts + 1,
          updated_at = now()
        """,
        new
        {
            UserId = userId,
            LessonId = lessonId,
            request.Wpm,
            request.Accuracy,
            Completed = completed
        },
        tx);

    await ApplyKeyStats(db, tx, userId, request.Errors, request.KeyStats);
    await IncrementDailyStats(db, tx, userId, request.DurationSeconds, request.Wpm, request.Accuracy, false);
    await tx.CommitAsync();

    return Results.Ok(new { completed });
}).RequireAuthorization();

app.MapGet("/api/weak-keys", async (HttpContext context) =>
{
    var userId = GetUserId(context.User);
    await using var db = await OpenConnection(databaseUrl);
    var weakKeys = await LoadWeakKeys(db, userId);
    return Results.Ok(weakKeys);
}).RequireAuthorization();

app.MapPost("/api/weak-keys/practice", async (HttpContext context) =>
{
    var userId = GetUserId(context.User);
    await using var db = await OpenConnection(databaseUrl);
    var weakKeys = await LoadWeakKeys(db, userId);
    var text = PracticeTextGenerator.Generate(weakKeys.Select(item => item.Key));
    return Results.Ok(new PracticeTextResponse(text));
}).RequireAuthorization();

app.Run();

static async Task<NpgsqlConnection> OpenConnection(string? connectionString)
{
    if (string.IsNullOrWhiteSpace(connectionString))
    {
        throw new InvalidOperationException("DATABASE_URL mungon");
    }

    var connection = new NpgsqlConnection(connectionString);
    await connection.OpenAsync();
    return connection;
}

static bool RequiresLegalAcceptanceCheck(HttpContext context)
{
    if (!HttpMethods.IsGet(context.Request.Method) &&
        !HttpMethods.IsPost(context.Request.Method) &&
        !HttpMethods.IsPut(context.Request.Method) &&
        !HttpMethods.IsPatch(context.Request.Method) &&
        !HttpMethods.IsDelete(context.Request.Method))
    {
        return false;
    }

    var path = context.Request.Path;
    if (!path.StartsWithSegments("/api"))
    {
        return false;
    }

    return !path.StartsWithSegments("/api/health") &&
        !path.StartsWithSegments("/api/auth/debug") &&
        !path.StartsWithSegments("/api/me") &&
        !path.StartsWithSegments("/api/profile/sync") &&
        !path.StartsWithSegments("/api/legal/accept");
}

static async Task<bool> UserMustAcceptTerms(NpgsqlConnection db, Guid userId)
{
    return await db.QuerySingleAsync<bool>(
        """
        select
          terms_accepted_at is null or
          privacy_accepted_at is null or
          terms_version is distinct from @CurrentTermsVersion or
          privacy_version is distinct from @CurrentPrivacyVersion
        from public.profiles
        where id = @UserId
        """,
        new
        {
            UserId = userId,
            CurrentTermsVersion = LegalVersions.CurrentTermsVersion,
            CurrentPrivacyVersion = LegalVersions.CurrentPrivacyVersion
        });
}

static async Task<bool> CheckDatabaseReachable(string? connectionString)
{
    try
    {
        await using var db = await OpenConnection(connectionString);
        await db.ExecuteScalarAsync<int>("select 1");
        return true;
    }
    catch
    {
        return false;
    }
}

static async Task<BillingStatusDto> LoadBillingStatus(NpgsqlConnection db, Guid userId)
{
    var row = await db.QuerySingleOrDefaultAsync<SubscriptionRow>(
        """
        select
          plan as "Plan",
          status as "Status",
          current_period_start as "CurrentPeriodStart",
          current_period_end as "CurrentPeriodEnd",
          cancel_at_period_end as "CancelAtPeriodEnd",
          lifetime as "Lifetime"
        from public.subscriptions
        where user_id = @UserId
        order by
          case when lifetime then 0 else 1 end,
          current_period_end desc nulls first,
          updated_at desc
        limit 1
        """,
        new { UserId = userId });

    if (row is null)
    {
        return new BillingStatusDto(
            BillingPlans.Free,
            "free",
            false,
            false,
            false,
            null,
            null,
            []);
    }

    var features = BillingPlans.FeaturesFor(row.Plan, row.Status, row.Lifetime, row.CurrentPeriodEnd);
    return new BillingStatusDto(
        row.Plan,
        row.Status,
        features.Count > 0,
        row.Lifetime,
        row.CancelAtPeriodEnd,
        row.CurrentPeriodStart,
        row.CurrentPeriodEnd,
        features);
}

static async Task SavePaymentEvent(NpgsqlConnection db, string provider, string eventId, string eventType, string payload)
{
    await db.ExecuteAsync(
        """
        insert into public.payment_events (provider, event_id, event_type, payload)
        values (@Provider, @EventId, @EventType, cast(@Payload as jsonb))
        on conflict (event_id) do nothing
        """,
        new
        {
            Provider = provider,
            EventId = eventId,
            EventType = eventType,
            Payload = string.IsNullOrWhiteSpace(payload) ? "{}" : payload
        });
}

static async Task UpsertSubscription(
    NpgsqlConnection db,
    Guid userId,
    string provider,
    string? providerCustomerId,
    string? providerSubscriptionId,
    string plan,
    string status,
    DateTimeOffset? currentPeriodStart,
    DateTimeOffset? currentPeriodEnd,
    bool cancelAtPeriodEnd,
    bool lifetime)
{
    var affected = 0;
    if (!string.IsNullOrWhiteSpace(providerSubscriptionId))
    {
        affected = await db.ExecuteAsync(
            """
            update public.subscriptions set
              user_id = @UserId,
              provider_customer_id = @ProviderCustomerId,
              plan = @Plan,
              status = @Status,
              current_period_start = @CurrentPeriodStart,
              current_period_end = @CurrentPeriodEnd,
              cancel_at_period_end = @CancelAtPeriodEnd,
              lifetime = @Lifetime,
              updated_at = now()
            where provider = @Provider and provider_subscription_id = @ProviderSubscriptionId
            """,
            new
            {
                UserId = userId,
                Provider = provider,
                ProviderCustomerId = providerCustomerId,
                ProviderSubscriptionId = providerSubscriptionId,
                Plan = plan,
                Status = status,
                CurrentPeriodStart = currentPeriodStart,
                CurrentPeriodEnd = currentPeriodEnd,
                CancelAtPeriodEnd = cancelAtPeriodEnd,
                Lifetime = lifetime
            });
    }
    else
    {
        affected = await db.ExecuteAsync(
            """
            update public.subscriptions set
              provider_customer_id = @ProviderCustomerId,
              plan = @Plan,
              status = @Status,
              current_period_start = @CurrentPeriodStart,
              current_period_end = @CurrentPeriodEnd,
              cancel_at_period_end = @CancelAtPeriodEnd,
              lifetime = @Lifetime,
              updated_at = now()
            where user_id = @UserId and provider = @Provider and plan = @Plan and provider_subscription_id is null
            """,
            new
            {
                UserId = userId,
                Provider = provider,
                ProviderCustomerId = providerCustomerId,
                Plan = plan,
                Status = status,
                CurrentPeriodStart = currentPeriodStart,
                CurrentPeriodEnd = currentPeriodEnd,
                CancelAtPeriodEnd = cancelAtPeriodEnd,
                Lifetime = lifetime
            });
    }

    if (affected > 0)
    {
        return;
    }

    await db.ExecuteAsync(
        """
        insert into public.subscriptions (
          user_id,
          provider,
          provider_customer_id,
          provider_subscription_id,
          plan,
          status,
          current_period_start,
          current_period_end,
          cancel_at_period_end,
          lifetime
        )
        values (
          @UserId,
          @Provider,
          @ProviderCustomerId,
          @ProviderSubscriptionId,
          @Plan,
          @Status,
          @CurrentPeriodStart,
          @CurrentPeriodEnd,
          @CancelAtPeriodEnd,
          @Lifetime
        )
        """,
        new
        {
            UserId = userId,
            Provider = provider,
            ProviderCustomerId = providerCustomerId,
            ProviderSubscriptionId = providerSubscriptionId,
            Plan = plan,
            Status = status,
            CurrentPeriodStart = currentPeriodStart,
            CurrentPeriodEnd = currentPeriodEnd,
            CancelAtPeriodEnd = cancelAtPeriodEnd,
            Lifetime = lifetime
        });
}

static string ResolveSiteUrl(HttpContext context)
{
    var configured = Environment.GetEnvironmentVariable("FRONTEND_SITE_URL") ??
        Environment.GetEnvironmentVariable("SITE_URL");
    if (!string.IsNullOrWhiteSpace(configured))
    {
        return configured.TrimEnd('/');
    }

    var origin = context.Request.Headers.Origin.FirstOrDefault();
    if (!string.IsNullOrWhiteSpace(origin))
    {
        return origin.TrimEnd('/');
    }

    var cors = Environment.GetEnvironmentVariable("CORS_ALLOWED_ORIGINS")
        ?.Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries)
        .FirstOrDefault();

    if (!string.IsNullOrWhiteSpace(cors))
    {
        return cors.TrimEnd('/');
    }

    throw new InvalidOperationException("FRONTEND_SITE_URL mungon");
}

static async Task WriteRuntimeError(Exception exception)
{
    try
    {
        var path = Path.Combine(Directory.GetCurrentDirectory(), "backend", "runtime-errors.log");
        if (string.Equals(Path.GetFileName(Directory.GetCurrentDirectory()), "backend", StringComparison.OrdinalIgnoreCase))
        {
            path = Path.Combine(Directory.GetCurrentDirectory(), "runtime-errors.log");
        }

        var directory = Path.GetDirectoryName(path);
        if (!string.IsNullOrWhiteSpace(directory))
        {
            Directory.CreateDirectory(directory);
        }

        await File.AppendAllTextAsync(
            path,
            $"[{DateTimeOffset.UtcNow:O}]{Environment.NewLine}{exception}{Environment.NewLine}{Environment.NewLine}");
    }
    catch
    {
        // Logging must never replace the original API error.
    }
}

static async Task RunDatabaseSetup(string? connectionString)
{
    var databaseDirectory = FindDatabaseDirectory();
    var files = new[] { "schema.sql", "indexes.sql", "seed.sql", "rls-policies.sql" };

    await using var db = await OpenConnection(connectionString);

    foreach (var file in files)
    {
        var path = Path.Combine(databaseDirectory, file);
        var sql = await File.ReadAllTextAsync(path);
        await using var command = new NpgsqlCommand(sql, db);
        command.CommandTimeout = 120;
        await command.ExecuteNonQueryAsync();
        Console.WriteLine($"Applied {file}");
    }
}

static string FindDatabaseDirectory()
{
    var candidates = new[]
    {
        Path.Combine(Directory.GetCurrentDirectory(), "database"),
        Path.Combine(Directory.GetCurrentDirectory(), "..", "database"),
        Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "database")
    };

    var path = candidates.Select(Path.GetFullPath).FirstOrDefault(Directory.Exists);
    if (path is null)
    {
        throw new DirectoryNotFoundException("database folder nuk u gjet");
    }

    return path;
}

static void LoadDotEnv()
{
    var candidatePaths = new[]
    {
        Path.Combine(Directory.GetCurrentDirectory(), ".env"),
        Path.Combine(Directory.GetCurrentDirectory(), "backend", ".env"),
        Path.Combine(Directory.GetCurrentDirectory(), "frontend", ".env"),
        Path.Combine(AppContext.BaseDirectory, ".env")
    };

    foreach (var path in candidatePaths.Where(File.Exists))
    {
        foreach (var rawLine in File.ReadAllLines(path))
        {
            var line = rawLine.Trim();
            if (line.Length == 0 || line.StartsWith('#'))
            {
                continue;
            }

            var separator = line.IndexOf('=');
            if (separator <= 0)
            {
                continue;
            }

            var key = line[..separator].Trim();
            var value = line[(separator + 1)..].Trim().Trim('"');
            if (Environment.GetEnvironmentVariable(key) is null)
            {
                Environment.SetEnvironmentVariable(key, value);
            }
        }
    }
}

static Guid GetUserId(ClaimsPrincipal user)
{
    var value = user.FindFirstValue("sub") ?? user.FindFirstValue(ClaimTypes.NameIdentifier);
    if (Guid.TryParse(value, out var userId))
    {
        return userId;
    }

    throw new UnauthorizedAccessException("JWT nuk ka user id te vlefshem");
}

static Guid? TryGetUserId(ClaimsPrincipal user)
{
    if (user.Identity?.IsAuthenticated != true)
    {
        return null;
    }

    var value = user.FindFirstValue("sub") ?? user.FindFirstValue(ClaimTypes.NameIdentifier);
    return Guid.TryParse(value, out var userId) ? userId : null;
}

static string? ClaimValue(ClaimsPrincipal user, string claimType)
{
    return user.FindFirstValue(claimType);
}

static string? MetadataValue(ClaimsPrincipal user, string key)
{
    var json = user.FindFirstValue("user_metadata");
    if (string.IsNullOrWhiteSpace(json))
    {
        return null;
    }

    try
    {
        using var document = JsonDocument.Parse(json);
        return document.RootElement.TryGetProperty(key, out var value) ? value.GetString() : null;
    }
    catch (JsonException)
    {
        return null;
    }
}

static async Task<ProfileDto> UpsertProfileFromClaims(NpgsqlConnection db, ClaimsPrincipal user)
{
    var userId = GetUserId(user);
    var email = ClaimValue(user, "email");
    var fullName = MetadataValue(user, "full_name") ??
                   MetadataValue(user, "name") ??
                   ClaimValue(user, "name") ??
                   email?.Split('@')[0];
    var avatarUrl = MetadataValue(user, "avatar_url") ??
                    MetadataValue(user, "picture") ??
                    ClaimValue(user, "picture");

    return await db.QuerySingleAsync<ProfileDto>(
        """
        insert into public.profiles (id, email, full_name, avatar_url)
        values (@UserId, @Email, @FullName, @AvatarUrl)
        on conflict (id) do update set
          email = excluded.email,
          full_name = excluded.full_name,
          avatar_url = excluded.avatar_url,
          updated_at = now()
        returning
          id as "Id",
          email as "Email",
          full_name as "FullName",
          avatar_url as "AvatarUrl",
          terms_accepted_at as "TermsAcceptedAt",
          terms_version as "TermsVersion",
          privacy_accepted_at as "PrivacyAcceptedAt",
          privacy_version as "PrivacyVersion",
          (
            terms_accepted_at is null or
            privacy_accepted_at is null or
            terms_version is distinct from @CurrentTermsVersion or
            privacy_version is distinct from @CurrentPrivacyVersion
          ) as "MustAcceptTerms",
          created_at as "CreatedAt",
          updated_at as "UpdatedAt"
        """,
        new
        {
            UserId = userId,
            Email = email,
            FullName = fullName,
            AvatarUrl = avatarUrl,
            CurrentTermsVersion = LegalVersions.CurrentTermsVersion,
            CurrentPrivacyVersion = LegalVersions.CurrentPrivacyVersion
        });
}

static async Task ApplyKeyStats(
    NpgsqlConnection db,
    NpgsqlTransaction tx,
    Guid userId,
    Dictionary<string, int>? errors,
    Dictionary<string, KeyStatDelta>? keyStats)
{
    var deltas = new Dictionary<string, KeyStatDelta>(StringComparer.OrdinalIgnoreCase);

    if (keyStats is not null)
    {
        foreach (var (key, delta) in keyStats)
        {
            var normalized = NormalizeKey(key);
            if (normalized.Length == 0)
            {
                continue;
            }

            deltas[normalized] = delta;
        }
    }

    if ((keyStats is null || keyStats.Count == 0) && errors is not null)
    {
        foreach (var (key, count) in errors)
        {
            var normalized = NormalizeKey(key);
            if (normalized.Length == 0)
            {
                continue;
            }

            if (deltas.TryGetValue(normalized, out var existing))
            {
                deltas[normalized] = existing with { Errors = existing.Errors + count };
            }
            else
            {
                deltas[normalized] = new KeyStatDelta(0, count);
            }
        }
    }

    foreach (var (key, delta) in deltas)
    {
        await db.ExecuteAsync(
            """
            insert into public.key_stats (user_id, key, correct_count, error_count)
            values (@UserId, @Key, @CorrectCount, @ErrorCount)
            on conflict (user_id, key) do update set
              correct_count = public.key_stats.correct_count + excluded.correct_count,
              error_count = public.key_stats.error_count + excluded.error_count,
              updated_at = now()
            """,
            new
            {
                UserId = userId,
                Key = key,
                CorrectCount = Math.Max(delta.Correct, 0),
                ErrorCount = Math.Max(delta.Errors, 0)
            },
            tx);
    }
}

static string NormalizeKey(string key)
{
    if (string.IsNullOrWhiteSpace(key))
    {
        return key == " " ? "space" : "";
    }

    return key == " " ? "space" : key.Trim().ToLowerInvariant();
}

static int NormalizePracticeSeconds(int? elapsedSeconds, int modeSeconds)
{
    var fallback = modeSeconds > 0 ? modeSeconds : 1;
    var seconds = elapsedSeconds is > 0 ? elapsedSeconds.Value : fallback;
    var maxSeconds = modeSeconds > 0 ? modeSeconds : seconds;
    return Math.Clamp(seconds, 1, maxSeconds);
}

static async Task IncrementDailyStats(
    NpgsqlConnection db,
    NpgsqlTransaction tx,
    Guid userId,
    int practiceSeconds,
    decimal wpm,
    decimal accuracy,
    bool incrementTests)
{
    if (incrementTests)
    {
        await db.ExecuteAsync(
            """
            insert into public.daily_stats (
              user_id,
              date,
              tests_completed,
              practice_seconds,
              avg_wpm,
              avg_accuracy
            )
            values (@UserId, current_date, 1, @PracticeSeconds, @Wpm, @Accuracy)
            on conflict (user_id, date) do update set
              tests_completed = public.daily_stats.tests_completed + 1,
              practice_seconds = public.daily_stats.practice_seconds + excluded.practice_seconds,
              avg_wpm = (
                select coalesce(avg(wpm), 0)
                from public.typing_tests
                where user_id = @UserId and created_at::date = current_date
              ),
              avg_accuracy = (
                select coalesce(avg(accuracy), 0)
                from public.typing_tests
                where user_id = @UserId and created_at::date = current_date
              )
            """,
            new { UserId = userId, PracticeSeconds = Math.Max(practiceSeconds, 0), Wpm = wpm, Accuracy = accuracy },
            tx);
    }
    else
    {
        await db.ExecuteAsync(
            """
            insert into public.daily_stats (
              user_id,
              date,
              tests_completed,
              practice_seconds,
              avg_wpm,
              avg_accuracy
            )
            values (@UserId, current_date, 0, @PracticeSeconds, 0, 0)
            on conflict (user_id, date) do update set
              practice_seconds = public.daily_stats.practice_seconds + excluded.practice_seconds
            """,
            new { UserId = userId, PracticeSeconds = Math.Max(practiceSeconds, 0) },
            tx);
    }
}

static int CalculateStreak(IReadOnlyCollection<DateOnly> dates)
{
    if (dates.Count == 0)
    {
        return 0;
    }

    var unique = dates.ToHashSet();
    var cursor = DateOnly.FromDateTime(DateTime.UtcNow);
    if (!unique.Contains(cursor))
    {
        cursor = cursor.AddDays(-1);
    }

    var streak = 0;
    while (unique.Contains(cursor))
    {
        streak++;
        cursor = cursor.AddDays(-1);
    }

    return streak;
}

static async Task<IReadOnlyList<LessonDto>> LoadLessons(NpgsqlConnection db, Guid? userId)
{
    var rows = await db.QueryAsync<LessonRow>(
        """
        select
          l.id,
          l.slug,
          l.title,
          l.description,
          l.target_keys,
          l.exercise_text,
          l.order_index,
          l.required_accuracy,
          l.required_wpm,
          coalesce(lp.best_wpm, 0) as best_wpm,
          coalesce(lp.best_accuracy, 0) as best_accuracy,
          coalesce(lp.completed, false) as completed,
          coalesce(lp.attempts, 0) as attempts
        from public.lessons l
        left join public.lesson_progress lp
          on lp.lesson_id = l.id and lp.user_id = @UserId
        order by l.order_index
        """,
        new { UserId = userId });

    var previousCompleted = true;
    var lessons = new List<LessonDto>();

    foreach (var row in rows.OrderBy(item => item.OrderIndex))
    {
        var unlocked = previousCompleted;
        var progress = row.Completed ? 100 : CalculateLessonProgress(row);
        lessons.Add(new LessonDto(
            row.Id,
            row.Slug,
            row.Title,
            row.Description,
            row.TargetKeys,
            row.ExerciseText,
            row.OrderIndex,
            row.RequiredAccuracy,
            row.RequiredWpm,
            row.BestWpm,
            row.BestAccuracy,
            row.Completed,
            row.Attempts,
            unlocked,
            progress));

        previousCompleted = row.Completed;
    }

    return lessons;
}

static int CalculateLessonProgress(LessonRow row)
{
    var accuracyPart = row.RequiredAccuracy <= 0 ? 50 : Math.Min(row.BestAccuracy / row.RequiredAccuracy * 50, 50);
    var wpmPart = row.RequiredWpm <= 0 ? 50 : Math.Min(row.BestWpm / row.RequiredWpm * 50, 50);
    return (int)Math.Clamp(Math.Round(accuracyPart + wpmPart), 0, 99);
}

static async Task<IReadOnlyList<WeakKeyDto>> LoadWeakKeys(NpgsqlConnection db, Guid userId)
{
    var keys = await db.QueryAsync<WeakKeyDto>(
        """
        select
          key,
          correct_count,
          error_count,
          round(error_count::numeric * 100 / greatest(correct_count + error_count, 1), 2) as error_rate
        from public.key_stats
        where user_id = @UserId and error_count > 0
        order by error_rate desc, error_count desc
        limit 12
        """,
        new { UserId = userId });

    return keys.ToArray();
}

public partial class Program;

internal sealed class SupabaseJwksProvider
{
    private static readonly HttpClient Client = new()
    {
        Timeout = TimeSpan.FromSeconds(8)
    };

    private readonly string? supabaseUrl;
    private readonly object syncRoot = new();
    private IReadOnlyList<SecurityKey> cachedKeys = [];
    private DateTimeOffset expiresAt = DateTimeOffset.MinValue;

    public SupabaseJwksProvider(string? supabaseUrl)
    {
        this.supabaseUrl = supabaseUrl;
    }

    public IReadOnlyList<SecurityKey> GetSigningKeys()
    {
        if (string.IsNullOrWhiteSpace(supabaseUrl))
        {
            return [];
        }

        lock (syncRoot)
        {
            if (cachedKeys.Count > 0 && expiresAt > DateTimeOffset.UtcNow)
            {
                return cachedKeys;
            }

            try
            {
                var url = $"{supabaseUrl.TrimEnd('/')}/auth/v1/.well-known/jwks.json";
                var json = Client.GetStringAsync(url).GetAwaiter().GetResult();
                cachedKeys = ParseSigningKeys(json);
                expiresAt = DateTimeOffset.UtcNow.AddMinutes(10);
            }
            catch (Exception)
            {
                if (cachedKeys.Count == 0)
                {
                    cachedKeys = LoadFallbackKeys();
                }

                expiresAt = DateTimeOffset.UtcNow.AddSeconds(30);
            }

            return cachedKeys;
        }
    }

    private static IReadOnlyList<SecurityKey> LoadFallbackKeys()
    {
        var envJson = Environment.GetEnvironmentVariable("SUPABASE_JWKS_JSON");
        if (!string.IsNullOrWhiteSpace(envJson))
        {
            return ParseSigningKeys(envJson);
        }

        var candidatePaths = new[]
        {
            Path.Combine(Directory.GetCurrentDirectory(), "backend", "supabase-jwks.json"),
            Path.Combine(Directory.GetCurrentDirectory(), "supabase-jwks.json"),
            Path.Combine(AppContext.BaseDirectory, "supabase-jwks.json"),
            Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "supabase-jwks.json")
        };

        foreach (var path in candidatePaths.Select(Path.GetFullPath).Where(File.Exists))
        {
            return ParseSigningKeys(File.ReadAllText(path));
        }

        return [];
    }

    private static IReadOnlyList<SecurityKey> ParseSigningKeys(string json)
    {
        var jwks = new JsonWebKeySet(json);
        return jwks.GetSigningKeys().ToArray();
    }
}

internal sealed record TotalStatsRow(
    int TestsCompleted,
    decimal BestWpm,
    decimal AverageWpm,
    decimal AverageAccuracy,
    int TotalPracticeSeconds);

internal sealed record TodayStatsRow(
    int TestsToday,
    int PracticeSecondsToday,
    decimal AverageWpmToday,
    decimal AverageAccuracyToday);

internal sealed record LessonRequirementRow(decimal RequiredAccuracy, decimal RequiredWpm);

internal sealed class SubscriptionRow
{
    public string Plan { get; set; } = BillingPlans.Free;
    public string Status { get; set; } = "free";
    public DateTimeOffset? CurrentPeriodStart { get; set; }
    public DateTimeOffset? CurrentPeriodEnd { get; set; }
    public bool CancelAtPeriodEnd { get; set; }
    public bool Lifetime { get; set; }
}

internal sealed class LessonRow
{
    public Guid Id { get; set; }
    public string Slug { get; set; } = "";
    public string Title { get; set; } = "";
    public string? Description { get; set; }
    public string[] TargetKeys { get; set; } = [];
    public string ExerciseText { get; set; } = "";
    public int OrderIndex { get; set; }
    public decimal RequiredAccuracy { get; set; }
    public decimal RequiredWpm { get; set; }
    public decimal BestWpm { get; set; }
    public decimal BestAccuracy { get; set; }
    public bool Completed { get; set; }
    public int Attempts { get; set; }
}

using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace ShkruajShpejt.Api;

public static class BillingPlans
{
    public const string Free = "free";
    public const string ProMonthly = "pro_monthly";
    public const string ProYearly = "pro_yearly";
    public const string Lifetime = "lifetime";
    public const string SchoolBasic = "school_basic";
    public const string SchoolPro = "school_pro";
    public const string SchoolCustom = "school_custom";

    public static readonly string[] ProFeatures =
    [
        "advanced_stats",
        "unlimited_lessons",
        "weak_keys_analysis",
        "bigram_advanced",
        "custom_practice",
        "premium_themes",
        "certificates",
        "cloud_sync"
    ];

    public static bool IsPaidPlan(string? plan) => plan is ProMonthly or ProYearly or Lifetime or SchoolBasic or SchoolPro or SchoolCustom;

    public static bool IsSelfServePlan(string? plan) => plan is ProMonthly or ProYearly or Lifetime;

    public static bool IsActiveStatus(string? status) => status is "active" or "trialing" or "paid";

    public static IReadOnlyList<string> FeaturesFor(string? plan, string? status, bool lifetime, DateTimeOffset? currentPeriodEnd)
    {
        if (!HasAccess(plan, status, lifetime, currentPeriodEnd))
        {
            return [];
        }

        return ProFeatures;
    }

    public static bool HasAccess(string? plan, string? status, bool lifetime, DateTimeOffset? currentPeriodEnd)
    {
        if (!IsPaidPlan(plan) || !IsActiveStatus(status))
        {
            return false;
        }

        if (lifetime)
        {
            return true;
        }

        return currentPeriodEnd is null || currentPeriodEnd.Value > DateTimeOffset.UtcNow;
    }
}

public sealed record BillingStatusDto(
    string Plan,
    string Status,
    bool IsPro,
    bool Lifetime,
    bool CancelAtPeriodEnd,
    DateTimeOffset? CurrentPeriodStart,
    DateTimeOffset? CurrentPeriodEnd,
    IReadOnlyList<string> Features);

public sealed record CreateCheckoutRequest(string Plan);

public sealed record CheckoutResponse(string CheckoutUrl, string Provider, string Plan);

public sealed record ManualActivateRequest(
    Guid UserId,
    string Plan,
    string Status,
    DateTimeOffset? CurrentPeriodStart,
    DateTimeOffset? CurrentPeriodEnd,
    bool Lifetime);

public sealed record PaymentWebhookResult(
    string EventId,
    string EventType,
    Guid? UserId,
    string? ProviderCustomerId,
    string? ProviderSubscriptionId,
    string? Plan,
    string? Status,
    DateTimeOffset? CurrentPeriodStart,
    DateTimeOffset? CurrentPeriodEnd,
    bool Lifetime,
    bool CancelAtPeriodEnd);

public sealed record BillingUser(Guid Id, string? Email, string? FullName);

public interface IPaymentProvider
{
    string Name { get; }
    bool IsConfigured { get; }
    Task<CheckoutResponse> CreateCheckoutSession(BillingUser user, string plan, string siteUrl, CancellationToken cancellationToken);
    Task<PaymentWebhookResult> HandleWebhook(string payload, string? signature, CancellationToken cancellationToken);
    Task<string?> GetCustomerPortalUrl(BillingUser user, CancellationToken cancellationToken);
}

public sealed class PaymentProviderFactory
{
    private readonly IConfiguration configuration;
    private readonly IHttpClientFactory httpClientFactory;

    public PaymentProviderFactory(IConfiguration configuration, IHttpClientFactory httpClientFactory)
    {
        this.configuration = configuration;
        this.httpClientFactory = httpClientFactory;
    }

    public IPaymentProvider Create()
    {
        var provider = (Environment.GetEnvironmentVariable("PAYMENT_PROVIDER") ?? configuration["PAYMENT_PROVIDER"] ?? "manual").Trim().ToLowerInvariant();
        return provider switch
        {
            "paddle" => new PaddlePaymentProvider(configuration, httpClientFactory),
            "lemonsqueezy" or "lemon_squeezy" => new LemonSqueezyPaymentProvider(configuration, httpClientFactory),
            _ => new ManualPaymentProvider(configuration)
        };
    }
}

internal sealed class ManualPaymentProvider : IPaymentProvider
{
    public ManualPaymentProvider(IConfiguration configuration)
    {
        IsConfigured = !string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("BILLING_ADMIN_TOKEN") ?? configuration["BILLING_ADMIN_TOKEN"]);
    }

    public string Name => "manual";
    public bool IsConfigured { get; }

    public Task<CheckoutResponse> CreateCheckoutSession(BillingUser user, string plan, string siteUrl, CancellationToken cancellationToken)
    {
        throw new BillingNotConfiguredException("Pagesat nuk jane konfiguruar ende. Na kontakto per qasje Pro.");
    }

    public Task<PaymentWebhookResult> HandleWebhook(string payload, string? signature, CancellationToken cancellationToken)
    {
        throw new BillingNotConfiguredException("Webhook manual nuk eshte aktiv.");
    }

    public Task<string?> GetCustomerPortalUrl(BillingUser user, CancellationToken cancellationToken) => Task.FromResult<string?>(null);
}

internal sealed class PaddlePaymentProvider : IPaymentProvider
{
    private readonly IConfiguration configuration;
    private readonly IHttpClientFactory httpClientFactory;

    public PaddlePaymentProvider(IConfiguration configuration, IHttpClientFactory httpClientFactory)
    {
        this.configuration = configuration;
        this.httpClientFactory = httpClientFactory;
        IsConfigured = !string.IsNullOrWhiteSpace(ApiKey) &&
            !string.IsNullOrWhiteSpace(WebhookSecret) &&
            !string.IsNullOrWhiteSpace(PriceFor(BillingPlans.ProMonthly)) &&
            !string.IsNullOrWhiteSpace(PriceFor(BillingPlans.ProYearly)) &&
            !string.IsNullOrWhiteSpace(PriceFor(BillingPlans.Lifetime));
    }

    public string Name => "paddle";
    public bool IsConfigured { get; }
    private string? ApiKey => Environment.GetEnvironmentVariable("PADDLE_API_KEY") ?? configuration["PADDLE_API_KEY"];
    private string? WebhookSecret => Environment.GetEnvironmentVariable("PADDLE_WEBHOOK_SECRET") ?? configuration["PADDLE_WEBHOOK_SECRET"];

    public async Task<CheckoutResponse> CreateCheckoutSession(BillingUser user, string plan, string siteUrl, CancellationToken cancellationToken)
    {
        if (!IsConfigured)
        {
            throw new BillingNotConfiguredException("Pagesat nuk jane konfiguruar ende. Na kontakto per qasje Pro.");
        }

        var priceId = PriceFor(plan);
        if (string.IsNullOrWhiteSpace(priceId))
        {
            throw new ArgumentException("Plan i pavlefshem");
        }

        var client = httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", ApiKey);

        var body = JsonSerializer.Serialize(new
        {
            items = new[] { new { price_id = priceId, quantity = 1 } },
            custom_data = new { user_id = user.Id, plan },
            customer = string.IsNullOrWhiteSpace(user.Email) ? null : new { email = user.Email },
            checkout = new
            {
                url = $"{siteUrl.TrimEnd('/')}/settings/billing?checkout=success"
            }
        });

        using var response = await client.PostAsync(
            "https://api.paddle.com/transactions",
            new StringContent(body, Encoding.UTF8, "application/json"),
            cancellationToken);

        var json = await response.Content.ReadAsStringAsync(cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            throw new InvalidOperationException($"Paddle checkout deshtoi: {response.StatusCode}");
        }

        using var document = JsonDocument.Parse(json);
        var checkoutUrl = document.RootElement.GetProperty("data").GetProperty("checkout").GetProperty("url").GetString();
        if (string.IsNullOrWhiteSpace(checkoutUrl))
        {
            throw new InvalidOperationException("Paddle nuk ktheu checkout URL.");
        }

        return new CheckoutResponse(checkoutUrl, Name, plan);
    }

    public Task<PaymentWebhookResult> HandleWebhook(string payload, string? signature, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(WebhookSecret) || !VerifyPaddleSignature(payload, signature, WebhookSecret))
        {
            throw new UnauthorizedAccessException("Paddle webhook signature nuk u verifikua.");
        }

        using var document = JsonDocument.Parse(payload);
        var root = document.RootElement;
        var eventId = root.TryGetProperty("event_id", out var id) ? id.GetString() : Guid.NewGuid().ToString();
        var eventType = root.TryGetProperty("event_type", out var type) ? type.GetString() : "unknown";
        var data = root.TryGetProperty("data", out var dataElement) ? dataElement : root;

        var customData = data.TryGetProperty("custom_data", out var custom) ? custom : default;
        var userIdText = customData.ValueKind == JsonValueKind.Object && customData.TryGetProperty("user_id", out var userIdElement)
            ? userIdElement.GetString()
            : null;
        var plan = customData.ValueKind == JsonValueKind.Object && customData.TryGetProperty("plan", out var planElement)
            ? planElement.GetString()
            : null;

        var status = data.TryGetProperty("status", out var statusElement) ? NormalizeStatus(statusElement.GetString()) : "active";
        var subscriptionId = data.TryGetProperty("subscription_id", out var subscriptionElement) ? subscriptionElement.GetString() : null;
        var customerId = data.TryGetProperty("customer_id", out var customerElement) ? customerElement.GetString() : null;
        var end = TryReadDate(data, "current_billing_period", "ends_at") ?? TryReadDate(data, "billing_period", "ends_at");
        var start = TryReadDate(data, "current_billing_period", "starts_at") ?? TryReadDate(data, "billing_period", "starts_at");

        return Task.FromResult(new PaymentWebhookResult(
            eventId ?? Guid.NewGuid().ToString(),
            eventType ?? "unknown",
            Guid.TryParse(userIdText, out var parsedUserId) ? parsedUserId : null,
            customerId,
            subscriptionId,
            plan,
            status,
            start,
            end,
            string.Equals(plan, BillingPlans.Lifetime, StringComparison.OrdinalIgnoreCase),
            false));
    }

    public Task<string?> GetCustomerPortalUrl(BillingUser user, CancellationToken cancellationToken) => Task.FromResult<string?>(null);

    private string? PriceFor(string plan) => plan switch
    {
        BillingPlans.ProMonthly => Environment.GetEnvironmentVariable("PADDLE_PRICE_PRO_MONTHLY") ?? configuration["PADDLE_PRICE_PRO_MONTHLY"],
        BillingPlans.ProYearly => Environment.GetEnvironmentVariable("PADDLE_PRICE_PRO_YEARLY") ?? configuration["PADDLE_PRICE_PRO_YEARLY"],
        BillingPlans.Lifetime => Environment.GetEnvironmentVariable("PADDLE_PRICE_LIFETIME") ?? configuration["PADDLE_PRICE_LIFETIME"],
        _ => null
    };

    private static bool VerifyPaddleSignature(string payload, string? signatureHeader, string secret)
    {
        if (string.IsNullOrWhiteSpace(signatureHeader))
        {
            return false;
        }

        var parts = signatureHeader.Split(';', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries);
        var timestamp = parts.FirstOrDefault(part => part.StartsWith("ts=", StringComparison.OrdinalIgnoreCase))?.Split('=', 2)[1];
        var signature = parts.FirstOrDefault(part => part.StartsWith("h1=", StringComparison.OrdinalIgnoreCase))?.Split('=', 2)[1];
        if (string.IsNullOrWhiteSpace(timestamp) || string.IsNullOrWhiteSpace(signature))
        {
            return false;
        }

        var signedPayload = $"{timestamp}:{payload}";
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret));
        var hash = Convert.ToHexString(hmac.ComputeHash(Encoding.UTF8.GetBytes(signedPayload))).ToLowerInvariant();
        return CryptographicOperations.FixedTimeEquals(Encoding.UTF8.GetBytes(hash), Encoding.UTF8.GetBytes(signature));
    }

    private static DateTimeOffset? TryReadDate(JsonElement data, string objectName, string propertyName)
    {
        if (data.TryGetProperty(objectName, out var obj) &&
            obj.ValueKind == JsonValueKind.Object &&
            obj.TryGetProperty(propertyName, out var prop) &&
            DateTimeOffset.TryParse(prop.GetString(), out var value))
        {
            return value;
        }

        return null;
    }

    private static string NormalizeStatus(string? status) => status switch
    {
        "completed" => "active",
        "paid" => "active",
        "active" => "active",
        "trialing" => "trialing",
        "canceled" => "canceled",
        "past_due" => "past_due",
        _ => status ?? "active"
    };
}

internal sealed class LemonSqueezyPaymentProvider : IPaymentProvider
{
    private readonly IConfiguration configuration;
    private readonly IHttpClientFactory httpClientFactory;

    public LemonSqueezyPaymentProvider(IConfiguration configuration, IHttpClientFactory httpClientFactory)
    {
        this.configuration = configuration;
        this.httpClientFactory = httpClientFactory;
        IsConfigured = !string.IsNullOrWhiteSpace(ApiKey) &&
            !string.IsNullOrWhiteSpace(StoreId) &&
            !string.IsNullOrWhiteSpace(WebhookSecret) &&
            !string.IsNullOrWhiteSpace(VariantFor(BillingPlans.ProMonthly)) &&
            !string.IsNullOrWhiteSpace(VariantFor(BillingPlans.ProYearly)) &&
            !string.IsNullOrWhiteSpace(VariantFor(BillingPlans.Lifetime));
    }

    public string Name => "lemonsqueezy";
    public bool IsConfigured { get; }
    private string? ApiKey => Environment.GetEnvironmentVariable("LEMONSQUEEZY_API_KEY") ?? configuration["LEMONSQUEEZY_API_KEY"];
    private string? StoreId => Environment.GetEnvironmentVariable("LEMONSQUEEZY_STORE_ID") ?? configuration["LEMONSQUEEZY_STORE_ID"];
    private string? WebhookSecret => Environment.GetEnvironmentVariable("LEMONSQUEEZY_WEBHOOK_SECRET") ?? configuration["LEMONSQUEEZY_WEBHOOK_SECRET"];

    public async Task<CheckoutResponse> CreateCheckoutSession(BillingUser user, string plan, string siteUrl, CancellationToken cancellationToken)
    {
        if (!IsConfigured)
        {
            throw new BillingNotConfiguredException("Pagesat nuk jane konfiguruar ende. Na kontakto per qasje Pro.");
        }

        var variantId = VariantFor(plan);
        if (string.IsNullOrWhiteSpace(variantId) || string.IsNullOrWhiteSpace(StoreId))
        {
            throw new ArgumentException("Plan i pavlefshem");
        }

        var client = httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", ApiKey);
        client.DefaultRequestHeaders.Accept.ParseAdd("application/vnd.api+json");

        var body = JsonSerializer.Serialize(new
        {
            data = new
            {
                type = "checkouts",
                attributes = new
                {
                    checkout_data = new
                    {
                        email = user.Email,
                        custom = new { user_id = user.Id.ToString(), plan }
                    },
                    product_options = new
                    {
                        redirect_url = $"{siteUrl.TrimEnd('/')}/settings/billing?checkout=success"
                    }
                },
                relationships = new
                {
                    store = new { data = new { type = "stores", id = StoreId } },
                    variant = new { data = new { type = "variants", id = variantId } }
                }
            }
        });

        using var response = await client.PostAsync(
            "https://api.lemonsqueezy.com/v1/checkouts",
            new StringContent(body, Encoding.UTF8, "application/vnd.api+json"),
            cancellationToken);

        var json = await response.Content.ReadAsStringAsync(cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            throw new InvalidOperationException($"Lemon Squeezy checkout deshtoi: {response.StatusCode}");
        }

        using var document = JsonDocument.Parse(json);
        var checkoutUrl = document.RootElement.GetProperty("data").GetProperty("attributes").GetProperty("url").GetString();
        if (string.IsNullOrWhiteSpace(checkoutUrl))
        {
            throw new InvalidOperationException("Lemon Squeezy nuk ktheu checkout URL.");
        }

        return new CheckoutResponse(checkoutUrl, Name, plan);
    }

    public Task<PaymentWebhookResult> HandleWebhook(string payload, string? signature, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(WebhookSecret) || !VerifyHmac(payload, signature, WebhookSecret))
        {
            throw new UnauthorizedAccessException("Lemon Squeezy webhook signature nuk u verifikua.");
        }

        using var document = JsonDocument.Parse(payload);
        var root = document.RootElement;
        var meta = root.TryGetProperty("meta", out var metaElement) ? metaElement : default;
        var data = root.TryGetProperty("data", out var dataElement) ? dataElement : root;
        var attributes = data.TryGetProperty("attributes", out var attrElement) ? attrElement : data;
        var custom = meta.ValueKind == JsonValueKind.Object && meta.TryGetProperty("custom_data", out var customElement) ? customElement : default;

        var userIdText = custom.ValueKind == JsonValueKind.Object && custom.TryGetProperty("user_id", out var userIdElement) ? userIdElement.GetString() : null;
        var plan = custom.ValueKind == JsonValueKind.Object && custom.TryGetProperty("plan", out var planElement) ? planElement.GetString() : null;
        var eventType = meta.ValueKind == JsonValueKind.Object && meta.TryGetProperty("event_name", out var eventName) ? eventName.GetString() : "unknown";
        var eventId = meta.ValueKind == JsonValueKind.Object && meta.TryGetProperty("webhook_id", out var webhookId) ? webhookId.GetString() : Guid.NewGuid().ToString();
        var status = attributes.TryGetProperty("status", out var statusElement) ? NormalizeStatus(statusElement.GetString()) : "active";
        var subscriptionId = data.TryGetProperty("id", out var idElement) ? idElement.GetString() : null;
        var customerId = attributes.TryGetProperty("customer_id", out var customerElement) ? customerElement.GetRawText() : null;
        var end = attributes.TryGetProperty("renews_at", out var renewsAt) && DateTimeOffset.TryParse(renewsAt.GetString(), out var renews) ? renews : (DateTimeOffset?)null;

        return Task.FromResult(new PaymentWebhookResult(
            eventId ?? Guid.NewGuid().ToString(),
            eventType ?? "unknown",
            Guid.TryParse(userIdText, out var parsedUserId) ? parsedUserId : null,
            customerId,
            subscriptionId,
            plan,
            status,
            null,
            end,
            string.Equals(plan, BillingPlans.Lifetime, StringComparison.OrdinalIgnoreCase),
            false));
    }

    public Task<string?> GetCustomerPortalUrl(BillingUser user, CancellationToken cancellationToken) => Task.FromResult<string?>(null);

    private string? VariantFor(string plan) => plan switch
    {
        BillingPlans.ProMonthly => Environment.GetEnvironmentVariable("LEMONSQUEEZY_VARIANT_PRO_MONTHLY") ?? configuration["LEMONSQUEEZY_VARIANT_PRO_MONTHLY"],
        BillingPlans.ProYearly => Environment.GetEnvironmentVariable("LEMONSQUEEZY_VARIANT_PRO_YEARLY") ?? configuration["LEMONSQUEEZY_VARIANT_PRO_YEARLY"],
        BillingPlans.Lifetime => Environment.GetEnvironmentVariable("LEMONSQUEEZY_VARIANT_LIFETIME") ?? configuration["LEMONSQUEEZY_VARIANT_LIFETIME"],
        _ => null
    };

    private static bool VerifyHmac(string payload, string? signature, string secret)
    {
        if (string.IsNullOrWhiteSpace(signature))
        {
            return false;
        }

        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret));
        var hash = Convert.ToHexString(hmac.ComputeHash(Encoding.UTF8.GetBytes(payload))).ToLowerInvariant();
        return CryptographicOperations.FixedTimeEquals(Encoding.UTF8.GetBytes(hash), Encoding.UTF8.GetBytes(signature));
    }

    private static string NormalizeStatus(string? status) => status switch
    {
        "active" => "active",
        "paid" => "active",
        "cancelled" => "canceled",
        "expired" => "canceled",
        "past_due" => "past_due",
        _ => status ?? "active"
    };
}

public sealed class BillingNotConfiguredException : InvalidOperationException
{
    public BillingNotConfiguredException(string message) : base(message)
    {
    }
}

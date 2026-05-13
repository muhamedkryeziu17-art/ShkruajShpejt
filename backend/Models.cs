namespace ShkruajShpejt.Api;

public sealed record ProfileDto(
    Guid Id,
    string? Email,
    string? FullName,
    string? AvatarUrl,
    DateTimeOffset? TermsAcceptedAt,
    string? TermsVersion,
    DateTimeOffset? PrivacyAcceptedAt,
    string? PrivacyVersion,
    bool MustAcceptTerms,
    DateTime CreatedAt,
    DateTime UpdatedAt);

public sealed record AcceptLegalRequest(string TermsVersion, string PrivacyVersion);

public sealed record SpeedPointDto(int Second, decimal Wpm, decimal Accuracy);

public sealed record KeyStatDelta(int Correct, int Errors);

public sealed record SaveTypingTestRequest(
    int ModeSeconds,
    int? ElapsedSeconds,
    string Difficulty,
    string Category,
    decimal Wpm,
    decimal RawWpm,
    decimal Accuracy,
    int CorrectChars,
    int IncorrectChars,
    int TotalChars,
    Dictionary<string, int>? Errors,
    IReadOnlyList<SpeedPointDto>? SpeedTimeline,
    Dictionary<string, KeyStatDelta>? KeyStats);

public sealed record TypingTestDto(
    Guid Id,
    int ModeSeconds,
    string Difficulty,
    string Category,
    decimal Wpm,
    decimal RawWpm,
    decimal Accuracy,
    int CorrectChars,
    int IncorrectChars,
    int TotalChars,
    string Errors,
    string SpeedTimeline,
    DateTime CreatedAt);

public sealed record LessonDto(
    Guid Id,
    string Slug,
    string Title,
    string? Description,
    string[] TargetKeys,
    string ExerciseText,
    int OrderIndex,
    decimal RequiredAccuracy,
    decimal RequiredWpm,
    decimal BestWpm,
    decimal BestAccuracy,
    bool Completed,
    int Attempts,
    bool Unlocked,
    int Progress);

public sealed record SaveLessonAttemptRequest(
    decimal Wpm,
    decimal Accuracy,
    int DurationSeconds,
    bool Completed,
    Dictionary<string, int>? Errors,
    Dictionary<string, KeyStatDelta>? KeyStats);

public sealed record WeakKeyDto(string Key, int CorrectCount, int ErrorCount, decimal ErrorRate);

public sealed record PracticeTextResponse(string Text);

public sealed record SummaryDto(
    int TestsCompleted,
    decimal BestWpm,
    decimal AverageWpm,
    decimal AverageAccuracy,
    int TotalPracticeSeconds,
    int DailyStreak,
    int TestsToday,
    int PracticeSecondsToday,
    decimal AverageWpmToday,
    decimal AverageAccuracyToday);

public sealed record ProgressPointDto(DateTime Date, decimal Wpm, decimal Accuracy, int Tests);

public sealed record HealthDto(
    string Status,
    bool DatabaseConfigured,
    bool DatabaseReachable,
    bool SupabaseConfigured,
    DateTimeOffset Time);

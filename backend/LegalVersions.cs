namespace ShkruajShpejt.Api;

public static class LegalVersions
{
    public const string CurrentTermsVersion = "2026-05-13";
    public const string CurrentPrivacyVersion = "2026-05-13";

    public static bool MustAccept(
        DateTimeOffset? termsAcceptedAt,
        string? termsVersion,
        DateTimeOffset? privacyAcceptedAt,
        string? privacyVersion)
    {
        return termsAcceptedAt is null ||
            privacyAcceptedAt is null ||
            !string.Equals(termsVersion, CurrentTermsVersion, StringComparison.Ordinal) ||
            !string.Equals(privacyVersion, CurrentPrivacyVersion, StringComparison.Ordinal);
    }
}

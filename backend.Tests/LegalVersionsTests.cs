using ShkruajShpejt.Api;
using Xunit;

namespace Backend.Tests;

public sealed class LegalVersionsTests
{
    [Fact]
    public void MustAcceptReturnsTrueWhenAcceptanceIsMissing()
    {
        Assert.True(LegalVersions.MustAccept(null, null, null, null));
    }

    [Fact]
    public void MustAcceptReturnsFalseForCurrentAcceptedVersions()
    {
        var acceptedAt = DateTimeOffset.UtcNow;

        Assert.False(LegalVersions.MustAccept(
            acceptedAt,
            LegalVersions.CurrentTermsVersion,
            acceptedAt,
            LegalVersions.CurrentPrivacyVersion));
    }

    [Fact]
    public void MustAcceptReturnsTrueWhenVersionChanges()
    {
        var acceptedAt = DateTimeOffset.UtcNow;

        Assert.True(LegalVersions.MustAccept(
            acceptedAt,
            "2026-01-01",
            acceptedAt,
            LegalVersions.CurrentPrivacyVersion));
    }
}

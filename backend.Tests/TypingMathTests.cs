using ShkruajShpejt.Api;
using Xunit;

namespace Backend.Tests;

public sealed class TypingMathTests
{
    [Fact]
    public void Calculate_UsesCorrectCharactersForWpm()
    {
        var stats = TypingMath.Calculate(correctChars: 25, totalTypedChars: 30, elapsedSeconds: 60);

        Assert.Equal(5, stats.Wpm);
        Assert.Equal(6, stats.RawWpm);
        Assert.Equal(83.33, stats.Accuracy);
    }

    [Fact]
    public void Calculate_HandlesEmptyTypingAsFullAccuracy()
    {
        var stats = TypingMath.Calculate(correctChars: 0, totalTypedChars: 0, elapsedSeconds: 60);

        Assert.Equal(0, stats.Wpm);
        Assert.Equal(0, stats.RawWpm);
        Assert.Equal(100, stats.Accuracy);
    }
}

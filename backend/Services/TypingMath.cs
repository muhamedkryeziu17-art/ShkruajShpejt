namespace ShkruajShpejt.Api;

public static class TypingMath
{
    public static TypingStats Calculate(int correctChars, int totalTypedChars, double elapsedSeconds)
    {
        var minutes = Math.Max(elapsedSeconds, 1) / 60.0;
        var wpm = correctChars / 5.0 / minutes;
        var rawWpm = totalTypedChars / 5.0 / minutes;
        var accuracy = totalTypedChars <= 0 ? 100 : correctChars * 100.0 / totalTypedChars;

        return new TypingStats(
            Math.Round(wpm, 2),
            Math.Round(rawWpm, 2),
            Math.Round(accuracy, 2));
    }
}

public sealed record TypingStats(double Wpm, double RawWpm, double Accuracy);

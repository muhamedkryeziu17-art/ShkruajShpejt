using System.Text;
using System.Text.RegularExpressions;

namespace ShkruajShpejt.Api;

public static partial class PracticeTextGenerator
{
    private static readonly string[] BaseWords =
    [
        "une", "ti", "ne", "me", "pa", "po", "te", "ke", "se", "sa",
        "pune", "mesim", "fokus", "test", "ritem", "fjale", "tast",
        "kodi", "libri", "ora", "dita", "plani", "ide", "rruga", "shkolla"
    ];

    public static string Generate(IEnumerable<string> keys, int targetWords = 80)
    {
        var cleanKeys = keys
            .Select(k => k.Trim().ToLowerInvariant())
            .Where(k => k.Length > 0)
            .Where(k => SafeKeyRegex().IsMatch(k))
            .Distinct()
            .Take(10)
            .ToArray();

        if (cleanKeys.Length == 0)
        {
            return string.Join(' ', BaseWords.Take(40));
        }

        var words = new List<string>();
        var index = 0;

        while (words.Count < targetWords)
        {
            var key = cleanKeys[index % cleanKeys.Length];
            var baseWord = BaseWords[index % BaseWords.Length];

            if (key == "space")
            {
                words.Add(baseWord);
            }
            else if (key.Length == 1 && char.IsLetterOrDigit(key[0]))
            {
                words.Add($"{key}{baseWord}");
                words.Add($"{baseWord}{key}");
            }
            else
            {
                words.Add(baseWord);
            }

            index++;
        }

        var builder = new StringBuilder();
        foreach (var word in words.Take(targetWords))
        {
            if (builder.Length > 0)
            {
                builder.Append(' ');
            }
            builder.Append(word);
        }

        return builder.ToString();
    }

    [GeneratedRegex("^[a-z0-9@#_.?!\\-]+$|^space$")]
    private static partial Regex SafeKeyRegex();
}

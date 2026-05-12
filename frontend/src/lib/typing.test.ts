import { describe, expect, it } from "vitest";
import { calculateTypingResult } from "./typing";

describe("calculateTypingResult", () => {
  it("llogarit WPM sipas karaktereve te sakta", () => {
    const result = calculateTypingResult("abcde abcde", "abcde abcde", 60);
    expect(result.wpm).toBe(2.2);
    expect(result.rawWpm).toBe(2.2);
    expect(result.accuracy).toBe(100);
  });

  it("llogarit saktesine kur ka gabime", () => {
    const result = calculateTypingResult("abcde", "abxde", 30);
    expect(result.correctChars).toBe(4);
    expect(result.incorrectChars).toBe(1);
    expect(result.mistakeCount).toBe(1);
    expect(result.wpm).toBe(1.6);
    expect(result.rawWpm).toBe(2);
    expect(result.accuracy).toBe(80);
  });

  it("ruan gabimet sipas tastit te pritur", () => {
    const result = calculateTypingResult("test", "tent", 60);
    expect(result.errors.s).toBe(1);
    expect(result.keyStats.s.errors).toBe(1);
  });

  it("ruan gabimet e korrigjuara per statistika", () => {
    const result = calculateTypingResult("abc", "abc", 60, [], { b: 1 }, { b: { correct: 1, errors: 1 } });
    expect(result.wpm).toBe(0.6);
    expect(result.accuracy).toBe(100);
    expect(result.incorrectChars).toBe(0);
    expect(result.mistakeCount).toBe(1);
    expect(result.errors.b).toBe(1);
    expect(result.keyStats.b.errors).toBe(1);
  });
});

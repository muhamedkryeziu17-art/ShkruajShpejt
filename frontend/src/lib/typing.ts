export type SpeedPoint = {
  second: number;
  wpm: number;
  accuracy: number;
};

export type KeyStatDelta = {
  correct: number;
  errors: number;
};

export type TypingResult = {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  mistakeCount: number;
  totalChars: number;
  errors: Record<string, number>;
  keyStats: Record<string, KeyStatDelta>;
  speedTimeline: SpeedPoint[];
  elapsedSeconds: number;
};

export function calculateTypingResult(
  reference: string,
  typed: string,
  elapsedSeconds: number,
  speedTimeline: SpeedPoint[] = [],
  trackedErrors?: Record<string, number>,
  trackedKeyStats?: Record<string, KeyStatDelta>
): TypingResult {
  const elapsedMinutes = Math.max(elapsedSeconds, 1) / 60;
  let correctChars = 0;
  const finalErrors: Record<string, number> = {};
  const finalKeyStats: Record<string, KeyStatDelta> = {};

  for (let index = 0; index < typed.length; index++) {
    const expected = reference[index] ?? "";
    const actual = typed[index];
    const key = normalizeKey(expected || actual);

    if (!finalKeyStats[key]) {
      finalKeyStats[key] = { correct: 0, errors: 0 };
    }

    if (actual === expected) {
      correctChars++;
      finalKeyStats[key].correct++;
    } else {
      finalErrors[key] = (finalErrors[key] ?? 0) + 1;
      finalKeyStats[key].errors++;
    }
  }

  const totalChars = typed.length;
  const incorrectChars = Math.max(totalChars - correctChars, 0);
  const errors = hasEntries(trackedErrors) ? cloneErrors(trackedErrors) : finalErrors;
  const keyStats = hasEntries(trackedKeyStats) ? cloneKeyStats(trackedKeyStats) : finalKeyStats;
  const mistakeCount = Object.values(errors).reduce((sum, value) => sum + value, 0);
  const wpm = correctChars / 5 / elapsedMinutes;
  const rawWpm = totalChars / 5 / elapsedMinutes;
  const accuracy = totalChars === 0 ? 100 : (correctChars / totalChars) * 100;

  return {
    wpm: roundStat(wpm),
    rawWpm: roundStat(rawWpm),
    accuracy: roundStat(accuracy),
    correctChars,
    incorrectChars,
    mistakeCount,
    totalChars,
    errors,
    keyStats,
    speedTimeline,
    elapsedSeconds: Math.max(1, Math.round(elapsedSeconds))
  };
}

export function normalizeKey(key: string) {
  if (key === " ") return "space";
  return key.toLowerCase();
}

export function roundStat(value: number) {
  return Math.round(value * 100) / 100;
}

export function topWeakKeys(errors: Record<string, number>, limit = 8) {
  return Object.entries(errors)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key]) => key);
}

export function liveStats(reference: string, typed: string, elapsedSeconds: number) {
  return calculateTypingResult(reference, typed, elapsedSeconds);
}

function hasEntries<T>(value: Record<string, T> | undefined): value is Record<string, T> {
  return value !== undefined && Object.keys(value).length > 0;
}

function cloneErrors(errors: Record<string, number>) {
  return Object.fromEntries(Object.entries(errors).map(([key, value]) => [key, value]));
}

function cloneKeyStats(keyStats: Record<string, KeyStatDelta>) {
  return Object.fromEntries(
    Object.entries(keyStats).map(([key, value]) => [
      key,
      {
        correct: value.correct,
        errors: value.errors
      }
    ])
  );
}

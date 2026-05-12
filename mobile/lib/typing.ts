import type { KeyStatDelta, SpeedPoint, TypingResult } from "./types";

export function normalizeKey(key: string) {
  return key === " " ? "space" : key.toLowerCase();
}

export function calculateLiveStats(text: string, typed: string, elapsedSeconds: number) {
  const totalTyped = typed.length;
  const correctChars = countCorrectChars(text, typed);
  const incorrectChars = Math.max(totalTyped - correctChars, 0);
  const minutes = Math.max(elapsedSeconds / 60, 1 / 60);
  const wpm = Math.round(correctChars / 5 / minutes);
  const rawWpm = Math.round(totalTyped / 5 / minutes);
  const accuracy = totalTyped === 0 ? 100 : Math.round((correctChars / totalTyped) * 100);

  return { wpm, rawWpm, accuracy, correctChars, incorrectChars, totalChars: totalTyped };
}

export function buildTypingResult(params: {
  text: string;
  typed: string;
  elapsedSeconds: number;
  modeSeconds: number;
  difficulty: string;
  category: string;
  errors: Record<string, number>;
  keyStats: Record<string, KeyStatDelta>;
  timeline: SpeedPoint[];
}): TypingResult {
  const stats = calculateLiveStats(params.text, params.typed, Math.max(params.elapsedSeconds, 1));
  return {
    modeSeconds: params.modeSeconds,
    elapsedSeconds: Math.max(1, Math.round(params.elapsedSeconds)),
    difficulty: params.difficulty,
    category: params.category,
    text: params.text,
    ...stats,
    mistakeCount: Object.values(params.errors).reduce((sum, value) => sum + value, 0),
    errors: params.errors,
    keyStats: params.keyStats,
    speedTimeline: params.timeline
  };
}

export function topWeakKeys(errors: Record<string, number>, limit = 6) {
  return Object.entries(errors)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, count]) => ({ key, count }));
}

export function formatDuration(seconds: number) {
  const safe = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(safe / 60);
  const rest = safe % 60;
  if (minutes === 0) return `${rest}s`;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

function countCorrectChars(text: string, typed: string) {
  let correct = 0;
  for (let index = 0; index < typed.length; index++) {
    if (typed[index] === text[index]) {
      correct++;
    }
  }
  return correct;
}

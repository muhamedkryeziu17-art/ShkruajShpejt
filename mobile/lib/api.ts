import type { Session } from "@supabase/supabase-js";
import { TERMS_VERSION, PRIVACY_VERSION } from "../constants/legal";
import type { LegalProfile, Lesson, ProgressPoint, RecentTest, Summary, TypingResult, WeakKey } from "./types";

export const apiBaseUrl = (process.env.EXPO_PUBLIC_API_BASE_URL || "").trim().replace(/\/+$/, "");

type ApiOptions = RequestInit & {
  session?: Session | null;
};

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  if (!apiBaseUrl) {
    throw new ApiError("Adresa e API mungon. Ploteso EXPO_PUBLIC_API_BASE_URL.", 0);
  }

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (options.session?.access_token) {
    headers.set("Authorization", `Bearer ${options.session.access_token}`);
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const body = await response.text();
    throw new ApiError(readErrorMessage(body) || `Kerkesa deshtoi (${response.status})`, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function loadSummary(session: Session | null) {
  return apiRequest<Summary>("/api/stats/summary", { session });
}

export function loadProgress(session: Session | null) {
  return apiRequest<ProgressPoint[]>("/api/stats/progress", { session });
}

export function loadRecentTests(session: Session | null) {
  return apiRequest<RecentTest[]>("/api/tests", { session });
}

export function loadLessons(session: Session | null) {
  return apiRequest<Lesson[]>("/api/lessons", { session });
}

export function loadWeakKeys(session: Session | null) {
  return apiRequest<WeakKey[]>("/api/weak-keys", { session });
}

export function loadProfile(session: Session | null) {
  return apiRequest<LegalProfile>("/api/me", { session });
}

export function acceptLegal(session: Session) {
  return apiRequest<LegalProfile>("/api/legal/accept", {
    method: "POST",
    session,
    body: JSON.stringify({
      termsVersion: TERMS_VERSION,
      privacyVersion: PRIVACY_VERSION
    })
  });
}

export function saveTypingResult(session: Session, result: TypingResult) {
  return apiRequest<{ id: string }>("/api/tests", {
    method: "POST",
    session,
    body: JSON.stringify({
      modeSeconds: result.modeSeconds,
      elapsedSeconds: result.elapsedSeconds,
      difficulty: result.difficulty,
      category: result.category,
      wpm: result.wpm,
      rawWpm: result.rawWpm,
      accuracy: result.accuracy,
      correctChars: result.correctChars,
      incorrectChars: result.incorrectChars,
      totalChars: result.totalChars,
      errors: result.errors,
      speedTimeline: result.speedTimeline,
      keyStats: result.keyStats
    })
  });
}

export function saveLessonAttempt(
  session: Session,
  lessonId: string,
  result: TypingResult,
  completed: boolean
) {
  return apiRequest<{ completed: boolean }>(`/api/lessons/${lessonId}/attempt`, {
    method: "POST",
    session,
    body: JSON.stringify({
      wpm: result.wpm,
      accuracy: result.accuracy,
      durationSeconds: result.elapsedSeconds,
      completed,
      errors: result.errors,
      keyStats: result.keyStats
    })
  });
}

function readErrorMessage(body: string) {
  if (!body) return "";
  try {
    const parsed = JSON.parse(body) as { message?: string; error?: string; title?: string };
    return parsed.message || parsed.error || parsed.title || body;
  } catch {
    return body;
  }
}

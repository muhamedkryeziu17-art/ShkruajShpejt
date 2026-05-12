import type { Session } from "@supabase/supabase-js";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").trim().replace(/\/+$/, "");

type RequestOptions = RequestInit & {
  session?: Session | null;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!apiBaseUrl) {
    throw new Error("Adresa e API mungon. Ploteso VITE_API_BASE_URL.");
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
    throw new Error(readErrorMessage(body) || `Kerkesa deshtoi (${response.status})`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const apiUrl = apiBaseUrl;

function readErrorMessage(body: string) {
  if (!body) return "";

  try {
    const parsed = JSON.parse(body) as { message?: string; error?: string; title?: string };
    return parsed.message || parsed.error || parsed.title || body;
  } catch {
    return body;
  }
}

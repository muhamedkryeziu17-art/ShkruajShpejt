import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  if (minutes <= 0) {
    return `${rest}s`;
  }
  return `${minutes}:${rest.toString().padStart(2, "0")}`;
}

export function toKeyLabel(key: string) {
  if (key === " ") return "Hapesire";
  if (key === "space") return "Hapesire";
  return key.toUpperCase();
}

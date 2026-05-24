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

const monthLabels = ["Jan", "Shk", "Mar", "Pri", "Maj", "Qer", "Kor", "Gus", "Sht", "Tet", "Nen", "Dhj"];

export function formatChartDate(value: unknown) {
  const raw = String(value ?? "");
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (match) {
    const monthIndex = Number(match[2]) - 1;
    const day = Number(match[3]);
    const month = monthLabels[monthIndex];
    return month && day > 0 ? `${day} ${month}` : raw;
  }

  const date = new Date(raw);
  if (!Number.isNaN(date.getTime())) {
    return `${date.getDate()} ${monthLabels[date.getMonth()]}`;
  }

  return raw;
}

export function toKeyLabel(key: string) {
  if (key === " ") return "Hapesire";
  if (key === "space") return "Hapesire";
  return key.toUpperCase();
}

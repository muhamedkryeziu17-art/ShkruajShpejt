export type ThemeMode = "dark" | "light";

export type AppTheme = {
  mode: ThemeMode;
  background: string;
  backgroundSoft: string;
  card: string;
  cardStrong: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  primaryText: string;
  cyan: string;
  emerald: string;
  violet: string;
  rose: string;
  warning: string;
};

export const themes: Record<ThemeMode, AppTheme> = {
  dark: {
    mode: "dark",
    background: "#07111f",
    backgroundSoft: "#101b2d",
    card: "rgba(15, 23, 42, 0.78)",
    cardStrong: "#111c31",
    text: "#f8fafc",
    textMuted: "#a7b3c7",
    border: "rgba(148, 163, 184, 0.22)",
    primary: "#22d3ee",
    primaryText: "#03131b",
    cyan: "#22d3ee",
    emerald: "#34d399",
    violet: "#a78bfa",
    rose: "#fb7185",
    warning: "#fbbf24"
  },
  light: {
    mode: "light",
    background: "#f7fbff",
    backgroundSoft: "#eaf2ff",
    card: "rgba(255, 255, 255, 0.88)",
    cardStrong: "#ffffff",
    text: "#07111f",
    textMuted: "#526178",
    border: "rgba(71, 85, 105, 0.16)",
    primary: "#0891b2",
    primaryText: "#ffffff",
    cyan: "#0891b2",
    emerald: "#059669",
    violet: "#7c3aed",
    rose: "#e11d48",
    warning: "#b45309"
  }
};

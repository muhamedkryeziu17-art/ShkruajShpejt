import { Moon, Sun } from "lucide-react";
import { useTheme } from "../state/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-300/70 bg-white/75 px-3 text-sm font-semibold text-slate-700 shadow-soft transition hover:-translate-y-0.5 hover:border-cyan-400/70 dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
      aria-label={isDark ? "Kalo ne drite" : "Kalo ne erresire"}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span>{isDark ? "Drite" : "Erresire"}</span>
    </button>
  );
}

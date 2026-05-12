import { LogIn, Menu, UserCircle, X } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../state/AuthProvider";
import { ButtonLink } from "./Button";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { to: "/dashboard", label: "Paneli" },
  { to: "/test", label: "Test" },
  { to: "/lessons", label: "Mesime" },
  { to: "/weak-keys", label: "Tastet e Dobeta" },
  { to: "/bigrams", label: "Cifte" },
  { to: "/stats", label: "Statistika" },
  { to: "/pricing", label: "Cmimet" }
];

export function AppShell() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen text-slate-950 dark:text-white">
      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/72 backdrop-blur-2xl dark:border-white/10 dark:bg-navy/72">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <NavLink to="/" className="flex items-center gap-3 font-black tracking-normal">
            <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-ink shadow-glow ring-1 ring-white/20">
              <img src="/shkruajshpejt-icon-512.png" alt="" className="h-full w-full object-cover" />
            </span>
            <span className="text-lg">ShkruajShpejt</span>
          </NavLink>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "rounded-2xl px-3 py-2 text-sm font-semibold transition",
                    isActive
                      ? "bg-slate-900 text-white dark:bg-white dark:text-ink"
                      : "text-slate-600 hover:bg-slate-900/5 dark:text-slate-300 dark:hover:bg-white/10"
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <ThemeToggle />
            {user ? (
              <ButtonLink to="/settings" variant="secondary" icon={<UserCircle className="h-4 w-4" />}>
                Profili
              </ButtonLink>
            ) : (
              <ButtonLink to="/login" icon={<LogIn className="h-4 w-4" />}>
                Kycu
              </ButtonLink>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-soft dark:border-white/10 dark:bg-white/10 dark:text-white lg:hidden"
            aria-label="Hap menune"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open ? (
          <div className="border-t border-slate-200/60 bg-white/95 px-4 py-4 dark:border-white/10 dark:bg-navy/95 lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    [
                      "rounded-2xl px-3 py-3 text-sm font-semibold",
                      isActive ? "bg-slate-900 text-white dark:bg-white dark:text-ink" : "text-slate-700 dark:text-slate-200"
                    ].join(" ")
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="mt-2 flex flex-wrap gap-2">
                <ThemeToggle />
                <ButtonLink to={user ? "/settings" : "/login"} onClick={() => setOpen(false)}>
                  {user ? "Profili" : "Kycu"}
                </ButtonLink>
              </div>
            </div>
          </div>
        ) : null}
      </header>

      <Outlet />
    </div>
  );
}

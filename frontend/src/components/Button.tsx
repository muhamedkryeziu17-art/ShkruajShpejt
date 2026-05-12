import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";
import { cn } from "../lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-white shadow-glow hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-ink dark:hover:bg-slate-100",
  secondary:
    "border border-slate-300/70 bg-white/80 text-slate-900 shadow-soft hover:-translate-y-0.5 hover:border-cyan-400/70 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:border-cyan-300/50",
  ghost:
    "text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/10",
  danger:
    "bg-rose-500 text-white shadow-soft hover:-translate-y-0.5 hover:bg-rose-600"
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base"
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: keyof typeof sizes;
  icon?: ReactNode;
};

export function Button({ className, variant = "primary", size = "md", icon, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-55",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}

type ButtonLinkProps = LinkProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    variant?: Variant;
    size?: keyof typeof sizes;
    icon?: ReactNode;
  };

export function ButtonLink({ className, variant = "primary", size = "md", icon, children, ...props }: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-transparent",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </Link>
  );
}

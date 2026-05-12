import type { ReactNode } from "react";
import { cn } from "../lib/utils";

export function StatCard({
  label,
  value,
  detail,
  icon,
  className
}: {
  label: string;
  value: ReactNode;
  detail?: string;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("glass-panel rounded-2xl p-4", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-300">{label}</p>
        {icon ? <div className="text-cyan-500 dark:text-cyan-300">{icon}</div> : null}
      </div>
      <div className="text-2xl font-bold text-slate-950 dark:text-white">{value}</div>
      {detail ? <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{detail}</p> : null}
    </div>
  );
}

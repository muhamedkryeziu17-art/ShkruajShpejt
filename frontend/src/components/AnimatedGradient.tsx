import { cn } from "../lib/utils";

export function AnimatedGradient({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      <div className="mesh-gradient animate-mesh" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,rgba(248,250,252,0.84)_72%)] dark:bg-[radial-gradient(circle_at_center,transparent,rgba(7,17,31,0.9)_74%)]" />
    </div>
  );
}

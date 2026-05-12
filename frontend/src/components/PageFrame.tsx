import { useEffect, useRef } from "react";
import anime from "animejs/lib/anime.es.js";
import { cn } from "../lib/utils";

export function PageFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    anime({
      targets: ref.current,
      opacity: [0, 1],
      translateY: [12, 0],
      duration: 420,
      easing: "easeOutQuad"
    });
  }, []);

  return (
    <main ref={ref} className={cn("mx-auto min-h-[calc(100vh-5rem)] w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8", className)}>
      {children}
    </main>
  );
}

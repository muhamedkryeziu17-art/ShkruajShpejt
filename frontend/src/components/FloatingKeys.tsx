import { useEffect, useRef } from "react";
import anime from "animejs/lib/anime.es.js";

const keys = ["A", "S", "D", "F", "J", "K", "L", "T", "E", "R", "N", "M"];

export function FloatingKeys() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const animation = anime({
      targets: ref.current.querySelectorAll("[data-floating-key]"),
      translateY: () => anime.random(-18, 18),
      translateX: () => anime.random(-10, 10),
      rotate: () => anime.random(-7, 7),
      delay: anime.stagger(120),
      duration: 2600,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine"
    });

    return () => animation.pause();
  }, []);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 hidden sm:block" aria-hidden="true">
      {keys.map((key, index) => (
        <span
          key={key}
          data-floating-key
          className="absolute flex h-12 w-12 items-center justify-center rounded-2xl border border-white/25 bg-white/16 text-sm font-bold text-white shadow-glow backdrop-blur-md"
          style={{
            left: `${8 + ((index * 13) % 80)}%`,
            top: `${16 + ((index * 19) % 58)}%`
          }}
        >
          {key}
        </span>
      ))}
    </div>
  );
}

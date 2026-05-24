import { useEffect, useRef } from "react";
import anime from "animejs/lib/anime.es.js";

const keys = [
  { value: "A", left: "8%" },
  { value: "S", left: "17%" },
  { value: "D", left: "27%" },
  { value: "F", left: "38%" },
  { value: "J", left: "58%" },
  { value: "K", left: "69%" },
  { value: "L", left: "80%" },
  { value: "E", left: "91%" },
  { value: "T", left: "22%" },
  { value: "R", left: "47%" },
  { value: "N", left: "74%" },
  { value: "M", left: "88%" }
];

export function FloatingKeys() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const height = ref.current.offsetHeight || window.innerHeight;
    const animation = anime({
      targets: ref.current.querySelectorAll("[data-floating-key]"),
      translateY: [-72, height + 72],
      translateX: [0, 0],
      rotate: (_el: Element, index: number) => (index % 2 === 0 ? 8 : -8),
      opacity: [
        { value: 0, duration: 0 },
        { value: 0.85, duration: 420 },
        { value: 0.85, duration: 2200 },
        { value: 0, duration: 480 }
      ],
      scale: [
        { value: 0.86, duration: 0 },
        { value: 1, duration: 420 },
        { value: 0.92, duration: 480 }
      ],
      delay: anime.stagger(320),
      duration: 4200,
      loop: true,
      easing: "linear"
    });

    return () => animation.pause();
  }, []);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 hidden sm:block" aria-hidden="true">
      {keys.map((key, index) => (
        <span
          key={`${key.value}-${index}`}
          data-floating-key
          className="absolute top-0 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/25 bg-white/16 text-sm font-bold text-white opacity-0 shadow-glow backdrop-blur-md will-change-transform"
          style={{
            left: key.left
          }}
        >
          {key.value}
        </span>
      ))}
    </div>
  );
}

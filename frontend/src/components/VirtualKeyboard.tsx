import { useEffect } from "react";
import anime from "animejs/lib/anime.es.js";
import { cn, toKeyLabel } from "../lib/utils";

const rows = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"],
  ["space"]
];

const zoneMap: Record<string, string> = {
  q: "bg-rose-500/12",
  a: "bg-rose-500/12",
  z: "bg-rose-500/12",
  w: "bg-orange-500/12",
  s: "bg-orange-500/12",
  x: "bg-orange-500/12",
  e: "bg-amber-500/12",
  d: "bg-amber-500/12",
  c: "bg-amber-500/12",
  r: "bg-emerald-500/12",
  f: "bg-emerald-500/12",
  v: "bg-emerald-500/12",
  t: "bg-emerald-500/12",
  g: "bg-emerald-500/12",
  b: "bg-emerald-500/12",
  y: "bg-cyan-500/12",
  h: "bg-cyan-500/12",
  n: "bg-cyan-500/12",
  u: "bg-cyan-500/12",
  j: "bg-cyan-500/12",
  m: "bg-cyan-500/12",
  i: "bg-violet-500/12",
  k: "bg-violet-500/12",
  o: "bg-fuchsia-500/12",
  l: "bg-fuchsia-500/12",
  p: "bg-rose-500/12",
  space: "bg-slate-500/10"
};

const legend = [
  { label: "Gishti i vogel", className: "bg-rose-500" },
  { label: "Gishti i unazes", className: "bg-orange-500" },
  { label: "Gishti i mesem", className: "bg-amber-500" },
  { label: "Gishti tregues", className: "bg-emerald-500" },
  { label: "Gishti i madh", className: "bg-slate-500" }
];

function normalize(key?: string | null) {
  if (!key) return "";
  return key === " " ? "space" : key.toLowerCase();
}

export function VirtualKeyboard({
  currentKey,
  wrongKey,
  pressedKey
}: {
  currentKey?: string | null;
  wrongKey?: string | null;
  pressedKey?: string | null;
}) {
  const active = normalize(currentKey);
  const wrong = normalize(wrongKey);
  const pressed = normalize(pressedKey);

  useEffect(() => {
    if (!pressed || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const element = document.querySelector(`[data-key="${pressed}"]`);
    if (!element) return;
    anime({
      targets: element,
      scale: [1, 0.92, 1],
      duration: 180,
      easing: "easeOutQuad"
    });
  }, [pressed]);

  return (
    <div className="space-y-4" aria-label="Tastiere virtuale">
      <div className="overflow-x-auto pb-2">
        <div className="mx-auto flex min-w-[36rem] flex-col items-center gap-2">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-2">
              {row.map((key) => {
                const isSpace = key === "space";
                return (
                  <div
                    key={key}
                    data-key={key}
                    className={cn(
                      "keyboard-key flex select-none items-center justify-center rounded-xl text-xs font-bold uppercase transition",
                      zoneMap[key],
                      isSpace && "w-72",
                      active === key && "keyboard-key-active",
                      wrong === key && "keyboard-key-wrong"
                    )}
                  >
                    {toKeyLabel(key)}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-500 dark:text-slate-300">
        {legend.map((item) => (
          <span key={item.label} className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/60 px-3 py-1 dark:border-white/10 dark:bg-white/5">
            <span className={cn("h-2.5 w-2.5 rounded-full", item.className)} />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

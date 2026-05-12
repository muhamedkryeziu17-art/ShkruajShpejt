import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import anime from "animejs/lib/anime.es.js";
import { Activity, Clock, RotateCcw, ShieldCheck, Target, Zap } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  calculateTypingResult,
  liveStats,
  normalizeKey,
  topWeakKeys,
  type KeyStatDelta,
  type SpeedPoint,
  type TypingResult
} from "../lib/typing";
import { formatDuration, toKeyLabel } from "../lib/utils";
import { Button } from "./Button";
import { Card } from "./Card";
import { StatCard } from "./StatCard";
import { VirtualKeyboard } from "./VirtualKeyboard";

type TypingSurfaceProps = {
  title: string;
  subtitle?: string;
  text: string;
  durationSeconds: number;
  category: string;
  difficulty: string;
  requiredAccuracy?: number;
  requiredWpm?: number;
  onComplete?: (result: TypingResult) => void | Promise<void>;
  resultAction?: (result: TypingResult) => React.ReactNode;
};

export function TypingSurface({
  title,
  subtitle,
  text,
  durationSeconds,
  category,
  difficulty,
  requiredAccuracy,
  requiredWpm,
  onComplete,
  resultAction
}: TypingSurfaceProps) {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const textViewportRef = useRef<HTMLDivElement | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const typedRef = useRef("");
  const finishedRef = useRef(false);
  const timelineRef = useRef<SpeedPoint[]>([]);
  const lastTimelineSecondRef = useRef(0);
  const attemptErrorsRef = useRef<Record<string, number>>({});
  const attemptKeyStatsRef = useRef<Record<string, KeyStatDelta>>({});

  const [typed, setTyped] = useState("");
  const [started, setStarted] = useState(false);
  const [remaining, setRemaining] = useState(durationSeconds);
  const [tick, setTick] = useState(0);
  const [wrongKey, setWrongKey] = useState<string | null>(null);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [result, setResult] = useState<TypingResult | null>(null);

  useEffect(() => {
    reset();
  }, [text, durationSeconds]);

  const elapsedSeconds = useMemo(() => {
    if (!started || !startTimeRef.current) return 0;
    return Math.min(durationSeconds, (Date.now() - startTimeRef.current) / 1000);
  }, [durationSeconds, started, tick]);

  const stats = useMemo(() => liveStats(text, typed, elapsedSeconds || 1), [elapsedSeconds, text, typed]);
  const liveMistakeCount = useMemo(
    () => Object.values(attemptErrorsRef.current).reduce((sum, value) => sum + value, 0),
    [typed]
  );
  const visibleStats = result ?? stats;
  const visibleMistakeCount = result ? result.mistakeCount : liveMistakeCount;
  const visibleTime = result ? formatDuration(result.elapsedSeconds) : formatDuration(remaining);
  const currentKey = text[typed.length] ?? null;
  const wordChunks = useMemo(() => buildWordChunks(text), [text]);
  const currentWordIndex = useMemo(() => {
    if (wordChunks.length === 0) return 0;
    const index = wordChunks.findIndex((word) => typed.length < word.end);
    return index === -1 ? wordChunks.length - 1 : index;
  }, [typed.length, wordChunks]);
  const visibleWords = useMemo(() => {
    const start = Math.max(0, currentWordIndex - 6);
    return wordChunks.slice(start, start + 56);
  }, [currentWordIndex, wordChunks]);

  const finish = useCallback(
    (snapshot: string, elapsed: number) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      const finalStats = calculateTypingResult(
        text,
        snapshot,
        Math.max(elapsed, 1),
        timelineRef.current,
        attemptErrorsRef.current,
        attemptKeyStatsRef.current
      );
      setResult(finalStats);
      setStarted(false);
      onComplete?.(finalStats);
    },
    [onComplete, text]
  );

  useEffect(() => {
    if (!started || result) return;

    const interval = window.setInterval(() => {
      if (!startTimeRef.current) return;
      const elapsed = Math.min(durationSeconds, (Date.now() - startTimeRef.current) / 1000);
      const seconds = Math.floor(elapsed);
      setRemaining(Math.max(durationSeconds - seconds, 0));
      setTick((value) => value + 1);

      if (seconds > 0 && seconds !== lastTimelineSecondRef.current) {
        lastTimelineSecondRef.current = seconds;
        const point = liveStats(text, typedRef.current, elapsed);
        timelineRef.current = [
          ...timelineRef.current,
          { second: seconds, wpm: point.wpm, accuracy: point.accuracy }
        ].slice(-180);
      }

      if (elapsed >= durationSeconds) {
        finish(typedRef.current, durationSeconds);
      }
    }, 250);

    return () => window.clearInterval(interval);
  }, [durationSeconds, finish, result, started, text]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [result]);

  useEffect(() => {
    const viewport = textViewportRef.current;
    if (!viewport || result) return;

    const currentIndex = Math.min(typed.length, text.length - 1);
    const currentChar = viewport.querySelector<HTMLElement>(`[data-char-index="${currentIndex}"]`);
    if (!currentChar) return;

    const viewportRect = viewport.getBoundingClientRect();
    const currentRect = currentChar.getBoundingClientRect();
    const isBelowView = currentRect.bottom > viewportRect.bottom - 80;
    const isAboveView = currentRect.top < viewportRect.top + 48;

    if (!isBelowView && !isAboveView) return;

    const targetTop = currentChar.offsetTop - viewport.clientHeight * 0.42;
    const maxTop = Math.max(0, viewport.scrollHeight - viewport.clientHeight);
    const nextTop = Math.min(Math.max(targetTop, 0), maxTop);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    viewport.scrollTo({
      top: nextTop,
      behavior: reducedMotion ? "auto" : "smooth"
    });
  }, [result, text.length, typed.length]);

  function reset() {
    typedRef.current = "";
    timelineRef.current = [];
    lastTimelineSecondRef.current = 0;
    attemptErrorsRef.current = {};
    attemptKeyStatsRef.current = {};
    startTimeRef.current = null;
    finishedRef.current = false;
    setTyped("");
    setStarted(false);
    setRemaining(durationSeconds);
    setTick(0);
    setWrongKey(null);
    setPressedKey(null);
    setResult(null);
    textViewportRef.current?.scrollTo({ top: 0, behavior: "auto" });
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  function startIfNeeded(nextValue: string) {
    if (!started && nextValue.length > 0) {
      startTimeRef.current = Date.now();
      setStarted(true);
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    if (result) return;
    const nextValue = event.target.value.slice(0, text.length);
    startIfNeeded(nextValue);
    typedRef.current = nextValue;
    setTyped(nextValue);

    if (nextValue.length >= text.length) {
      const elapsed = startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 : 1;
      finish(nextValue, elapsed);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.ctrlKey || event.metaKey) && ["v", "c", "x"].includes(event.key.toLowerCase())) {
      event.preventDefault();
      return;
    }

    if (!result && event.key.length === 1 && typedRef.current.length < text.length) {
      const expected = text[typedRef.current.length] ?? "";
      const actualKey = normalizeKey(event.key);
      const statKey = normalizeKey(expected || event.key);
      const isCorrectKey = Boolean(expected) && event.key === expected;

      if (!attemptKeyStatsRef.current[statKey]) {
        attemptKeyStatsRef.current[statKey] = { correct: 0, errors: 0 };
      }

      if (isCorrectKey) {
        attemptKeyStatsRef.current[statKey].correct++;
      } else {
        attemptKeyStatsRef.current[statKey].errors++;
        attemptErrorsRef.current[statKey] = (attemptErrorsRef.current[statKey] ?? 0) + 1;
      }

      setPressedKey(actualKey);
      window.setTimeout(() => setPressedKey(null), 180);

      if (expected && event.key !== expected) {
        setWrongKey(actualKey);
        window.setTimeout(() => setWrongKey(null), 320);
      }
    }
  }

  const weakKeys = result ? topWeakKeys(result.errors) : [];

  return (
    <div className="space-y-5">
      <Card className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">{title}</h2>
            {subtitle ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">{subtitle}</p> : null}
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-cyan-700 dark:text-cyan-200">{category}</span>
              <span className="rounded-full bg-violet-500/10 px-3 py-1 text-violet-700 dark:text-violet-200">{difficulty}</span>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-700 dark:text-emerald-200">{formatDuration(durationSeconds)}</span>
            </div>
          </div>
          <Button type="button" variant="secondary" onClick={reset} icon={<RotateCcw className="h-4 w-4" />}>
            Provo Perseri
          </Button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="WPM" value={visibleStats.wpm.toFixed(0)} icon={<Zap className="h-5 w-5" />} />
          <StatCard label="Raw WPM" value={visibleStats.rawWpm.toFixed(0)} icon={<Activity className="h-5 w-5" />} />
          <StatCard label="Saktesia" value={`${visibleStats.accuracy.toFixed(0)}%`} icon={<ShieldCheck className="h-5 w-5" />} />
          <StatCard label="Gabimet" value={visibleMistakeCount} icon={<Target className="h-5 w-5" />} />
          <StatCard label="Koha" value={visibleTime} icon={<Clock className="h-5 w-5" />} />
        </div>
      </Card>

      <Card className="relative overflow-hidden p-0">
        <button
          type="button"
          className="block w-full cursor-text p-5 text-left focus:outline-none sm:p-7"
          onClick={() => inputRef.current?.focus()}
        >
          <p className="mb-4 text-sm font-semibold text-slate-500 dark:text-slate-300">
            {started ? "Shkruaj me ritem te qendrueshem" : "Shtyp tastin e pare per te nisur"}
          </p>
          <div
            ref={textViewportRef}
            className="max-h-[20rem] overflow-hidden scroll-smooth text-xl font-semibold leading-10 text-slate-400 dark:text-slate-500 sm:text-2xl sm:leading-[3rem]"
          >
            <div className="transition-transform duration-200 ease-out">
              {visibleWords.map((word) => (
                <span key={word.start} className="mr-[0.35em] inline-flex whitespace-nowrap align-baseline">
                  {word.chars.map(({ char, index }) => {
                    const actual = typed[index];
                    const isCurrent = index === typed.length && !result;
                    const isTyped = index < typed.length;
                    const isCorrect = isTyped && actual === char;
                    const isWrong = isTyped && actual !== char;

                    return (
                      <span
                        key={`${char}-${index}`}
                        data-char-index={index}
                        className={[
                          "typing-char whitespace-pre-wrap",
                          char === " " ? "inline-block min-w-[0.35em]" : "",
                          isCurrent ? "typing-char-current bg-cyan-500/10 text-slate-950 dark:text-white" : "",
                          isCorrect ? "text-emerald-600 dark:text-emerald-300" : "",
                          isWrong ? "bg-rose-500/15 text-rose-600 dark:text-rose-300" : ""
                        ].join(" ")}
                      >
                        {char}
                      </span>
                    );
                  })}
                </span>
              ))}
            </div>
          </div>
        </button>

        <textarea
          ref={inputRef}
          value={typed}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={(event) => event.preventDefault()}
          aria-label="Zona e shkrimit"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className="absolute left-0 top-0 h-px w-px opacity-0"
        />
      </Card>

      <Card>
        <VirtualKeyboard currentKey={currentKey} wrongKey={wrongKey} pressedKey={pressedKey} />
      </Card>

      {result ? (
        <Card className="relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-violet-500 to-emerald-400" />
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h3 className="text-2xl font-bold text-slate-950 dark:text-white">U krye</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Shiko rezultatin dhe zgjidh hapin tjeter.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {resultAction?.(result)}
              <Button type="button" variant="secondary" onClick={reset} icon={<RotateCcw className="h-4 w-4" />}>
                Provo Perseri
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ResultStat label="WPM" value={result.wpm} />
            <ResultStat label="Raw WPM" value={result.rawWpm} />
            <ResultStat label="Saktesia" value={result.accuracy} suffix="%" />
            <ResultStat label="Gabime" value={result.mistakeCount} />
            <ResultStat label="Karaktere te sakta" value={result.correctChars} />
            <ResultStat label="Karaktere te gabuara" value={result.incorrectChars} />
            <ResultStat label="Koha" value={result.elapsedSeconds} suffix="s" />
            <ResultStat label="Tastet e dobeta" value={weakKeys.length} />
          </div>

          {requiredAccuracy || requiredWpm ? (
            <div className="mt-5 rounded-2xl border border-slate-200/70 bg-white/60 p-4 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
              Synimi: {requiredWpm ? `${requiredWpm} WPM` : ""} {requiredAccuracy ? `${requiredAccuracy}% saktesi` : ""}
            </div>
          ) : null}

          <div className="mt-6 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
            <div className="rounded-2xl border border-slate-200/70 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-bold text-slate-800 dark:text-white">Shpejtesia ne kohe</p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">WPM</p>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={result.speedTimeline.length ? result.speedTimeline : [{ second: 0, wpm: result.wpm, accuracy: result.accuracy }]}>
                    <XAxis dataKey="second" stroke="currentColor" tickLine={false} axisLine={false} />
                    <YAxis stroke="currentColor" tickLine={false} axisLine={false} width={34} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 16,
                        border: "1px solid rgba(148,163,184,0.25)",
                        background: "rgba(15,23,42,0.92)",
                        color: "white"
                      }}
                    />
                    <Line type="monotone" dataKey="wpm" name="WPM" stroke="#06b6d4" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="accuracy" name="Saktesia" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/70 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
              <p className="text-sm font-bold text-slate-800 dark:text-white">Tastet e dobeta</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {weakKeys.length ? (
                  weakKeys.map((key) => (
                    <span key={key} className="rounded-xl bg-rose-500/10 px-3 py-2 text-sm font-bold text-rose-600 dark:text-rose-200">
                      {toKeyLabel(key)}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-300">Nuk ka gabime te mjaftueshme per analize.</p>
                )}
              </div>
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
}

function buildWordChunks(text: string) {
  const chunks: Array<{ start: number; end: number; chars: Array<{ char: string; index: number }> }> = [];
  const regex = /\S+\s*/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const start = match.index;
    const token = match[0];
    chunks.push({
      start,
      end: start + token.length,
      chars: Array.from(token).map((char, offset) => ({
        char,
        index: start + offset
      }))
    });
  }

  return chunks;
}

function ResultStat({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
      <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{label}</p>
      <div className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
        <CountUp value={value} suffix={suffix} />
      </div>
    </div>
  );
}

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }

    const counter = { value: 0 };
    const animation = anime({
      targets: counter,
      value,
      duration: 700,
      easing: "easeOutQuad",
      update: () => setDisplay(counter.value)
    });

    return () => animation.pause();
  }, [value]);

  const rounded = value % 1 === 0 ? Math.round(display).toString() : display.toFixed(1);
  return (
    <>
      {rounded}
      {suffix}
    </>
  );
}

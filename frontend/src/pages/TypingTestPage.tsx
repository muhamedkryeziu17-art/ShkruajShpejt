import { RefreshCcw, Save } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../components/Button";
import { Card, SectionHeader } from "../components/Card";
import { PageFrame } from "../components/PageFrame";
import { TypingSurface } from "../components/TypingSurface";
import { apiRequest } from "../lib/api";
import { categories, difficulties, durations, generateTestText, type Difficulty, type TestCategory } from "../lib/content";
import type { TypingResult } from "../lib/typing";
import { cn } from "../lib/utils";
import { useAuth } from "../state/AuthProvider";

export function TypingTestPage() {
  const { session } = useAuth();
  const [duration, setDuration] = useState(durations[1]);
  const [difficulty, setDifficulty] = useState<Difficulty>("Mesatar");
  const [category, setCategory] = useState<TestCategory>("Fjale te zakonshme");
  const [seed, setSeed] = useState(1);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("");

  const text = useMemo(() => generateTestText(category, difficulty, 120 + seed), [category, difficulty, seed]);

  async function saveResult(result: TypingResult) {
    if (!session) return;
    setSaveState("saving");
    setSaveMessage("");
    try {
      await apiRequest("/api/tests", {
        method: "POST",
        session,
        body: JSON.stringify({
          modeSeconds: duration.seconds,
          elapsedSeconds: result.elapsedSeconds,
          difficulty,
          category,
          wpm: result.wpm,
          rawWpm: result.rawWpm,
          accuracy: result.accuracy,
          correctChars: result.correctChars,
          incorrectChars: result.incorrectChars,
          totalChars: result.totalChars,
          errors: result.errors,
          speedTimeline: result.speedTimeline,
          keyStats: result.keyStats
        })
      });
      setSaveState("saved");
      setSaveMessage("Rezultati u ruajt me sukses.");
    } catch (error) {
      setSaveState("error");
      setSaveMessage(error instanceof Error ? error.message : "Rezultati nuk u ruajt.");
    }
  }

  function resetText() {
    setSaveState("idle");
    setSaveMessage("");
    setSeed((value) => value + 1);
  }

  return (
    <PageFrame>
      <SectionHeader
        title="Test Shkrimi"
        description="Zgjidh kohe, nivel dhe kategori. Koha nis vetem pas tastit te pare."
        action={
          <Button type="button" variant="secondary" onClick={resetText} icon={<RefreshCcw className="h-4 w-4" />}>
            Gjenero tekst te ri
          </Button>
        }
      />

      <Card className="mb-5 grid gap-4 lg:grid-cols-[1fr_0.8fr_1.1fr]">
        <ControlGroup label="Koha">
          {durations.map((item) => (
            <ControlButton key={item.seconds} active={duration.seconds === item.seconds} onClick={() => setDuration(item)}>
              {item.label}
            </ControlButton>
          ))}
        </ControlGroup>

        <ControlGroup label="Niveli">
          {difficulties.map((item) => (
            <ControlButton key={item} active={difficulty === item} onClick={() => setDifficulty(item)}>
              {item}
            </ControlButton>
          ))}
        </ControlGroup>

        <ControlGroup label="Kategoria">
          {categories.map((item) => (
            <ControlButton key={item} active={category === item} onClick={() => setCategory(item)}>
              {item}
            </ControlButton>
          ))}
        </ControlGroup>
      </Card>

      <TypingSurface
        key={`${duration.seconds}-${difficulty}-${category}-${seed}`}
        title="Test Shkrimi"
        subtitle={session ? "Rezultati ruhet automatikisht pas perfundimit." : "Menyra mysafir lejon testim pa ruajtje te perhershme."}
        text={text}
        durationSeconds={duration.seconds}
        category={category}
        difficulty={difficulty}
        onComplete={saveResult}
        resultAction={(result) =>
          session ? (
            <div className="flex flex-col items-start gap-2">
              <Button
                type="button"
                variant={saveState === "error" ? "danger" : "primary"}
                onClick={() => saveResult(result)}
                disabled={saveState === "saving" || saveState === "saved"}
                icon={<Save className="h-4 w-4" />}
              >
                {saveState === "saving" ? "Duke ruajtur..." : saveState === "saved" ? "U ruajt" : "Ruaj Rezultatin"}
              </Button>
              {saveMessage ? (
                <p className={cn("max-w-xs text-xs font-semibold", saveState === "error" ? "text-rose-600 dark:text-rose-300" : "text-emerald-600 dark:text-emerald-300")}>
                  {saveMessage}
                </p>
              ) : null}
            </div>
          ) : (
            <span className="rounded-2xl border border-slate-200/70 bg-white/60 px-4 py-3 text-sm font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              Rezultati i mysafirit nuk ruhet
            </span>
          )
        }
      />
    </PageFrame>
  );
}

function ControlGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-200">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function ControlButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-2xl border px-3 py-2 text-sm font-semibold transition",
        active
          ? "border-cyan-400 bg-cyan-400/15 text-cyan-700 dark:text-cyan-200"
          : "border-slate-200/70 bg-white/60 text-slate-600 hover:border-cyan-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
      )}
    >
      {children}
    </button>
  );
}

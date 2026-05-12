import { RefreshCcw, Save } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../components/Button";
import { Card, SectionHeader } from "../components/Card";
import { PageFrame } from "../components/PageFrame";
import { TypingSurface } from "../components/TypingSurface";
import { apiRequest } from "../lib/api";
import { commonBigrams, generateBigramText } from "../lib/content";
import type { TypingResult } from "../lib/typing";
import { useAuth } from "../state/AuthProvider";

export function BigramsPage() {
  const { session } = useAuth();
  const [seed, setSeed] = useState(1);
  const [saved, setSaved] = useState(false);
  const text = useMemo(() => generateBigramText(8 + seed), [seed]);

  async function saveResult(result: TypingResult) {
    if (!session) return;
    await apiRequest("/api/tests", {
      method: "POST",
      session,
      body: JSON.stringify({
        modeSeconds: 300,
        elapsedSeconds: result.elapsedSeconds,
        difficulty: "Mesatar",
        category: "Cifte Shkronjash",
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
    setSaved(true);
  }

  return (
    <PageFrame>
      <SectionHeader
        title="Cifte Shkronjash"
        description="Praktiko kombinime dy shkronjash per rithem me te mire dhe gabime me te pakta."
        action={
          <Button type="button" variant="secondary" onClick={() => { setSaved(false); setSeed((value) => value + 1); }} icon={<RefreshCcw className="h-4 w-4" />}>
            Gjenero perseri
          </Button>
        }
      />

      <Card className="mb-5">
        <div className="flex flex-wrap gap-2">
          {commonBigrams.map((bigram) => (
            <span key={bigram} className="rounded-xl bg-violet-500/10 px-3 py-2 text-sm font-black text-violet-700 dark:text-violet-200">
              {bigram}
            </span>
          ))}
        </div>
      </Card>

      <TypingSurface
        key={seed}
        title="Praktike me Cifte"
        subtitle={session ? "Rezultati ruhet si ushtrim bigrami." : "Mund te praktikosh pa llogari, por rezultati nuk ruhet."}
        text={text}
        durationSeconds={300}
        category="Cifte Shkronjash"
        difficulty="Mesatar"
        onComplete={(result) => saveResult(result).catch(() => undefined)}
        resultAction={(result) =>
          session ? (
            <Button type="button" onClick={() => saveResult(result)} disabled={saved} icon={<Save className="h-4 w-4" />}>
              {saved ? "U ruajt" : "Ruaj Rezultatin"}
            </Button>
          ) : null
        }
      />
    </PageFrame>
  );
}

import { Play, RefreshCcw, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, ButtonLink } from "../components/Button";
import { Card, SectionHeader } from "../components/Card";
import { PageFrame } from "../components/PageFrame";
import { TypingSurface } from "../components/TypingSurface";
import { apiRequest } from "../lib/api";
import type { TypingResult } from "../lib/typing";
import { toKeyLabel } from "../lib/utils";
import { useAuth } from "../state/AuthProvider";

type WeakKey = {
  key: string;
  correctCount: number;
  errorCount: number;
  errorRate: number;
};

export function WeakKeysPage() {
  const { session } = useAuth();
  const [weakKeys, setWeakKeys] = useState<WeakKey[]>([]);
  const [practiceText, setPracticeText] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!session) return;
    apiRequest<WeakKey[]>("/api/weak-keys", { session })
      .then(setWeakKeys)
      .catch(() => setMessage("Tastet e dobeta nuk u ngarkuan"));
  }, [session]);

  async function generatePractice() {
    if (!session) return;
    setMessage("");
    try {
      const response = await apiRequest<{ text: string }>("/api/weak-keys/practice", {
        method: "POST",
        session,
        body: JSON.stringify({})
      });
      setPracticeText(response.text);
    } catch {
      setMessage("Ushtrimi nuk u krijua");
    }
  }

  async function savePractice(result: TypingResult) {
    if (!session) return;
    await apiRequest("/api/tests", {
      method: "POST",
      session,
      body: JSON.stringify({
        modeSeconds: 300,
        elapsedSeconds: result.elapsedSeconds,
        difficulty: "Mesatar",
        category: "Tastet e Dobeta",
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
    }).catch(() => undefined);
  }

  if (!session) {
    return (
      <PageFrame>
        <SectionHeader title="Tastet e Dobeta" description="Ky seksion perdor gabimet e ruajtura nga testet e tua." />
        <Card>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">Kycu per te pare tastet me norme gabimi me te larte dhe per te krijuar ushtrime personale.</p>
          <ButtonLink to="/login" className="mt-5">
            Kycu me Google
          </ButtonLink>
        </Card>
      </PageFrame>
    );
  }

  return (
    <PageFrame>
      <SectionHeader
        title="Tastet e Dobeta"
        description="Analize e tastave ku gabimet perseriten me shpesh."
        action={
          <Button type="button" onClick={generatePractice} icon={<RefreshCcw className="h-4 w-4" />}>
            Gjenero Ushtrim
          </Button>
        }
      />

      {message ? (
        <div className="mb-5 rounded-2xl border border-amber-300/70 bg-amber-50 p-4 text-sm font-semibold text-amber-800 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200">
          {message}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1fr_0.65fr]">
        <Card>
          <h2 className="text-xl font-black text-slate-950 dark:text-white">Gabimet sipas tastit</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {weakKeys.length ? (
              weakKeys.map((item) => (
                <div key={item.key} className="rounded-2xl border border-slate-200/70 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-slate-950 dark:text-white">{toKeyLabel(item.key)}</span>
                    <Target className="h-5 w-5 text-rose-500" />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-300">Norma e gabimeve {Math.round(item.errorRate)}%</p>
                  <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-white/10">
                    <div className="h-full rounded-full bg-rose-500" style={{ width: `${Math.min(item.errorRate, 100)}%` }} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-300">Nuk ka te dhena ende. Kryej disa teste per te krijuar analizen.</p>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-black text-slate-950 dark:text-white">Rekomandime</h2>
          <div className="mt-4 space-y-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <p className="rounded-2xl bg-cyan-500/10 p-4">Praktiko kete tast 5 minuta</p>
            <p className="rounded-2xl bg-emerald-500/10 p-4">Fokusohu ne saktesi para shpejtesise</p>
            <p className="rounded-2xl bg-violet-500/10 p-4">Pusho pak kur gabimet rriten</p>
          </div>
          <Button type="button" className="mt-5" onClick={generatePractice} icon={<Play className="h-4 w-4" />}>
            Fillo Ushtrimin
          </Button>
        </Card>
      </div>

      {practiceText ? (
        <div className="mt-6">
          <TypingSurface
            title="Ushtrim per Tastet e Dobeta"
            subtitle="Teksti krijohet nga tastet ku gabon me shpesh."
            text={practiceText}
            durationSeconds={300}
            category="Tastet e Dobeta"
            difficulty="Personal"
            onComplete={savePractice}
          />
        </div>
      ) : null}
    </PageFrame>
  );
}

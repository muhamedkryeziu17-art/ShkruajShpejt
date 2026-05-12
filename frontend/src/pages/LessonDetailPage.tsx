import { Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { Card, SectionHeader } from "../components/Card";
import { PageFrame } from "../components/PageFrame";
import { Paywall } from "../components/Paywall";
import { TypingSurface } from "../components/TypingSurface";
import { apiRequest } from "../lib/api";
import { hasFeature } from "../lib/billingPlans";
import { localLessons, type Lesson } from "../lib/lessons";
import type { TypingResult } from "../lib/typing";
import { useAuth } from "../state/AuthProvider";
import { useBilling } from "../state/BillingProvider";

export function LessonDetailPage() {
  const { slug } = useParams();
  const { session } = useAuth();
  const { billing } = useBilling();
  const [lesson, setLesson] = useState<Lesson | null>(() => localLessons.find((item) => item.slug === slug) ?? null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    if (!slug) return;
    apiRequest<Lesson>(`/api/lessons/${slug}`, { session })
      .then(setLesson)
      .catch(() => setLesson(localLessons.find((item) => item.slug === slug) ?? null));
  }, [session, slug]);

  const text = useMemo(() => {
    if (!lesson) return "";
    return `${lesson.exerciseText} ${lesson.exerciseText}`;
  }, [lesson]);
  const lessonIndex = localLessons.findIndex((item) => item.slug === slug);
  const lockedByPlan = lessonIndex > 2 && !hasFeature(billing, "unlimited_lessons");

  async function saveAttempt(result: TypingResult) {
    if (!session || !lesson || lesson.id.startsWith("local-")) return;
    setSaveState("saving");
    try {
      await apiRequest(`/api/lessons/${lesson.id}/attempt`, {
        method: "POST",
        session,
        body: JSON.stringify({
          wpm: result.wpm,
          accuracy: result.accuracy,
          durationSeconds: result.elapsedSeconds,
          completed: result.accuracy >= lesson.requiredAccuracy && result.wpm >= lesson.requiredWpm,
          errors: result.errors,
          keyStats: result.keyStats
        })
      });
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  if (!lesson) {
    return (
      <PageFrame>
        <Card>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Mesimi nuk u gjet.</p>
          <Link to="/lessons" className="mt-4 inline-flex text-sm font-bold text-cyan-600 dark:text-cyan-300">
            Kthehu te mesimet
          </Link>
        </Card>
      </PageFrame>
    );
  }

  return (
    <PageFrame>
      <SectionHeader
        title={lesson.title}
        description={`${lesson.description} Synimi: ${lesson.requiredWpm} WPM dhe ${lesson.requiredAccuracy}% saktesi.`}
      />

      {lockedByPlan ? (
        <Paywall />
      ) : (
        <>

      <Card className="mb-5">
        <div className="flex flex-wrap gap-2">
          {lesson.targetKeys.map((key) => (
            <span key={key} className="rounded-xl bg-cyan-500/10 px-3 py-2 text-sm font-black uppercase text-cyan-700 dark:text-cyan-200">
              {key}
            </span>
          ))}
        </div>
      </Card>

      <TypingSurface
        title="Ushtrim Mesimi"
        subtitle={session ? "Perparimi ruhet pasi te perfundosh ushtrimin." : "Kycu per te ruajtur perparimin e mesimit."}
        text={text}
        durationSeconds={300}
        category="Mesim"
        difficulty="Synim"
        requiredAccuracy={lesson.requiredAccuracy}
        requiredWpm={lesson.requiredWpm}
        onComplete={saveAttempt}
        resultAction={(result) =>
          session ? (
            <Button
              type="button"
              onClick={() => saveAttempt(result)}
              disabled={saveState === "saving" || saveState === "saved"}
              variant={saveState === "error" ? "danger" : "primary"}
              icon={<Save className="h-4 w-4" />}
            >
              {saveState === "saving" ? "Duke ruajtur..." : saveState === "saved" ? "U ruajt" : "Ruaj perparimin"}
            </Button>
          ) : (
            <span className="rounded-2xl border border-slate-200/70 bg-white/60 px-4 py-3 text-sm font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              Progresi ruhet pas hyrjes
            </span>
          )
        }
      />
        </>
      )}
    </PageFrame>
  );
}

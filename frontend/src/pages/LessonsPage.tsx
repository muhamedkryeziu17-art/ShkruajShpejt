import { CheckCircle2, Lock, Play, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { ButtonLink } from "../components/Button";
import { Card, SectionHeader } from "../components/Card";
import { PageFrame } from "../components/PageFrame";
import { apiRequest } from "../lib/api";
import { localLessons, type Lesson } from "../lib/lessons";
import { hasFeature } from "../lib/billingPlans";
import { useAuth } from "../state/AuthProvider";
import { useBilling } from "../state/BillingProvider";

const groups = [
  "Rreshti baze",
  "Dora e majte",
  "Dora e djathte",
  "Rreshti i siperm",
  "Rreshti i poshtem",
  "Numrat",
  "Simbolet",
  "Fjale te shkurtra",
  "Fjali te plota",
  "Shpejtesi dhe saktesi"
];

export function LessonsPage() {
  const { session } = useAuth();
  const { billing } = useBilling();
  const [lessons, setLessons] = useState<Lesson[]>(localLessons);
  const [error, setError] = useState("");
  const unlimitedLessons = hasFeature(billing, "unlimited_lessons");

  useEffect(() => {
    apiRequest<Lesson[]>("/api/lessons", { session })
      .then(setLessons)
      .catch(() => {
        setLessons(localLessons);
        setError("Po shfaqen mesimet lokale. Lidhja me API nuk eshte gati.");
      });
  }, [session]);

  return (
    <PageFrame>
      <SectionHeader
        title="Mesimet"
        description="Praktiko rreshta, duar, fjale dhe fjali me synime te qarta per WPM dhe saktesi."
      />

      {error ? (
        <div className="mb-5 rounded-2xl border border-amber-300/70 bg-amber-50 p-4 text-sm font-semibold text-amber-800 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {lessons.map((lesson, index) => {
          const lockedByPlan = !unlimitedLessons && index > 2;
          const canOpen = lesson.unlocked && !lockedByPlan;
          return (
          <Card key={lesson.slug} className="flex min-h-[18rem] flex-col">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase text-cyan-600 dark:text-cyan-300">{groups[index] ?? "Praktike"}</p>
                <h2 className="mt-2 text-xl font-black text-slate-950 dark:text-white">{lesson.title}</h2>
              </div>
              {lesson.completed ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              ) : canOpen ? (
                <Target className="h-6 w-6 text-cyan-500" />
              ) : (
                <Lock className="h-6 w-6 text-slate-400" />
              )}
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{lesson.description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {lesson.targetKeys.slice(0, 12).map((key) => (
                <span key={key} className="rounded-xl border border-slate-200/70 bg-white/70 px-2.5 py-1 text-xs font-bold uppercase text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                  {key}
                </span>
              ))}
            </div>

            <div className="mt-5">
              <div className="mb-2 flex justify-between text-xs font-bold text-slate-500 dark:text-slate-300">
                <span>Perparimi</span>
                <span>{lesson.progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200 dark:bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" style={{ width: `${lesson.progress}%` }} />
              </div>
            </div>

            <div className="mt-auto pt-5">
              {canOpen ? (
                <ButtonLink to={`/lessons/${lesson.slug}`} icon={<Play className="h-4 w-4" />}>
                  Fillo Mesimin
                </ButtonLink>
              ) : lockedByPlan ? (
                <ButtonLink to="/pricing" variant="secondary">
                  Merr Pro
                </ButtonLink>
              ) : (
                <span className="inline-flex h-11 items-center rounded-2xl border border-slate-200/70 bg-white/60 px-4 text-sm font-semibold text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                  I bllokuar
                </span>
              )}
            </div>
          </Card>
        );})}
      </div>
    </PageFrame>
  );
}

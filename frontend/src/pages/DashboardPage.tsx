import { BarChart3, BookOpen, Gauge, Keyboard, LineChart as LineChartIcon, Target, Timer, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ButtonLink } from "../components/Button";
import { Card, SectionHeader } from "../components/Card";
import { PageFrame } from "../components/PageFrame";
import { StatCard } from "../components/StatCard";
import { apiRequest } from "../lib/api";
import { formatDuration } from "../lib/utils";
import { useAuth } from "../state/AuthProvider";

type Summary = {
  testsCompleted: number;
  bestWpm: number;
  averageWpm: number;
  averageAccuracy: number;
  totalPracticeSeconds: number;
  dailyStreak: number;
  testsToday: number;
  practiceSecondsToday: number;
  averageWpmToday: number;
  averageAccuracyToday: number;
};

type ProgressPoint = {
  date: string;
  wpm: number;
  accuracy: number;
  tests: number;
};

type RecentTest = {
  id: string;
  modeSeconds: number;
  difficulty: string;
  category: string;
  wpm: number;
  accuracy: number;
  incorrectChars: number;
  errors?: string | Record<string, number>;
  createdAt: string;
};

const emptySummary: Summary = {
  testsCompleted: 0,
  bestWpm: 0,
  averageWpm: 0,
  averageAccuracy: 0,
  totalPracticeSeconds: 0,
  dailyStreak: 0,
  testsToday: 0,
  practiceSecondsToday: 0,
  averageWpmToday: 0,
  averageAccuracyToday: 0
};

export function DashboardPage() {
  const { user, session, loading } = useAuth();
  const [summary, setSummary] = useState<Summary>(emptySummary);
  const [progress, setProgress] = useState<ProgressPoint[]>([]);
  const [recent, setRecent] = useState<RecentTest[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session) return;

    let active = true;
    setError("");

    async function loadDashboard() {
      try {
        await apiRequest("/api/profile/sync", {
          method: "POST",
          session,
          body: JSON.stringify({})
        });

        const [summaryResult, progressResult, testsResult] = await Promise.allSettled([
          apiRequest<Summary>("/api/stats/summary", { session }),
          apiRequest<ProgressPoint[]>("/api/stats/progress", { session }),
          apiRequest<RecentTest[]>("/api/tests", { session })
        ]);

        if (!active) return;

        if (summaryResult.status === "fulfilled") {
          setSummary(summaryResult.value);
        }

        if (progressResult.status === "fulfilled") {
          setProgress(progressResult.value);
        }

        if (testsResult.status === "fulfilled") {
          setRecent(testsResult.value.slice(0, 8));
        }

        if ([summaryResult, progressResult, testsResult].some((item) => item.status === "rejected")) {
          setError("Disa statistika nuk u ngarkuan. Rifresko faqen ose kycu perseri nese sesioni ka skaduar.");
        }
      } catch (error) {
        if (!active) return;
        setSummary(emptySummary);
        setProgress([]);
        setRecent([]);
        setError(error instanceof Error ? error.message : "Te dhenat nuk u ngarkuan. Kycu perseri dhe provo prape.");
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, [session]);

  const name = useMemo(() => {
    return (user?.user_metadata?.full_name as string | undefined) || user?.email?.split("@")[0] || "mysafir";
  }, [user]);

  if (loading) {
    return (
      <PageFrame>
        <Card>Po ngarkohet...</Card>
      </PageFrame>
    );
  }

  return (
    <PageFrame>
      <SectionHeader
        title={`Mire se erdhe, ${name}`}
        description={user ? "Paneli yt i perparimit dhe ushtrimeve te sotme." : "Je ne menyre mysafir. Rezultatet nuk ruhen pa hyrje ne llogari."}
        action={!user ? <ButtonLink to="/login">Kycu me Google</ButtonLink> : null}
      />

      {error ? (
        <div className="mb-5 rounded-2xl border border-rose-300/70 bg-rose-50 p-4 text-sm font-semibold text-rose-700 dark:border-rose-400/30 dark:bg-rose-400/10 dark:text-rose-200">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="WPM mesatar" value={summary.averageWpm.toFixed(0)} icon={<Gauge className="h-5 w-5" />} />
        <StatCard label="Saktesia mesatare" value={`${summary.averageAccuracy.toFixed(0)}%`} icon={<Target className="h-5 w-5" />} />
        <StatCard label="Teste sot" value={summary.testsToday} icon={<Zap className="h-5 w-5" />} />
        <StatCard label="Minuta ushtrim" value={Math.round(summary.practiceSecondsToday / 60)} icon={<Timer className="h-5 w-5" />} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.45fr_0.55fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950 dark:text-white">Perparimi</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">WPM dhe saktesia ne kohe</p>
            </div>
            <LineChartIcon className="h-5 w-5 text-cyan-500" />
          </div>
          <div className="h-72">
            {progress.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progress}>
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickFormatter={(value) => String(value).slice(5)} />
                  <YAxis tickLine={false} axisLine={false} width={36} />
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
            ) : (
              <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-300/80 bg-white/40 p-6 text-center text-sm font-semibold text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                Nuk ka te dhena ende. Kryej nje test per te pare perparimin.
              </div>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">Veprime te shpejta</h2>
          <div className="mt-4 grid gap-3">
            <ButtonLink to="/test" variant="secondary" icon={<Keyboard className="h-4 w-4" />}>
              Test i Shpejte
            </ButtonLink>
            <ButtonLink to="/lessons" variant="secondary" icon={<BookOpen className="h-4 w-4" />}>
              Vazhdo Mesimin
            </ButtonLink>
            <ButtonLink to="/weak-keys" variant="secondary" icon={<Target className="h-4 w-4" />}>
              Praktiko Tastet e Dobeta
            </ButtonLink>
            <ButtonLink to="/stats" variant="secondary" icon={<BarChart3 className="h-4 w-4" />}>
              Shiko Statistikat
            </ButtonLink>
          </div>
        </Card>
      </div>

      <Card className="mt-6 overflow-hidden">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">Testet e fundit</h2>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-300">{formatDuration(summary.totalPracticeSeconds)} gjithsej</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[42rem] text-left text-sm">
            <thead className="text-xs uppercase text-slate-500 dark:text-slate-400">
              <tr>
                <th className="py-3">Kategoria</th>
                <th className="py-3">Niveli</th>
                <th className="py-3">Koha</th>
                <th className="py-3">WPM</th>
                <th className="py-3">Saktesia</th>
                <th className="py-3">Gabime</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-white/10">
              {recent.length ? (
                recent.map((test) => (
                  <tr key={test.id} className="text-slate-700 dark:text-slate-200">
                    <td className="py-3 font-semibold">{test.category}</td>
                    <td className="py-3">{test.difficulty}</td>
                    <td className="py-3">{formatDuration(test.modeSeconds)}</td>
                    <td className="py-3 font-bold">{Math.round(test.wpm)}</td>
                    <td className="py-3">{Math.round(test.accuracy)}%</td>
                    <td className="py-3">{countTestErrors(test)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm font-semibold text-slate-500 dark:text-slate-300">
                    Nuk ka teste te ruajtura ende.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </PageFrame>
  );
}

function countTestErrors(test: RecentTest) {
  const errors = parseErrors(test.errors);
  if (!errors) return test.incorrectChars;
  return Object.values(errors).reduce((sum, value) => sum + value, 0);
}

function parseErrors(errors: RecentTest["errors"]) {
  if (!errors) return null;
  if (typeof errors !== "string") return errors;

  try {
    const parsed = JSON.parse(errors) as Record<string, number>;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

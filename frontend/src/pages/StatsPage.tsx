import { Activity, CalendarDays, Clock, Gauge, Target, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ButtonLink } from "../components/Button";
import { Card, SectionHeader } from "../components/Card";
import { PageFrame } from "../components/PageFrame";
import { Paywall } from "../components/Paywall";
import { StatCard } from "../components/StatCard";
import { apiRequest } from "../lib/api";
import { hasFeature } from "../lib/billingPlans";
import { formatChartDate, formatDuration, toKeyLabel } from "../lib/utils";
import { useAuth } from "../state/AuthProvider";
import { useBilling } from "../state/BillingProvider";

type Summary = {
  testsCompleted: number;
  bestWpm: number;
  averageWpm: number;
  averageAccuracy: number;
  totalPracticeSeconds: number;
  dailyStreak: number;
};

type ProgressPoint = {
  date: string;
  wpm: number;
  accuracy: number;
  tests: number;
};

type WeakKey = {
  key: string;
  correctCount: number;
  errorCount: number;
  errorRate: number;
};

const emptySummary: Summary = {
  testsCompleted: 0,
  bestWpm: 0,
  averageWpm: 0,
  averageAccuracy: 0,
  totalPracticeSeconds: 0,
  dailyStreak: 0
};

export function StatsPage() {
  const { session } = useAuth();
  const { billing } = useBilling();
  const [summary, setSummary] = useState<Summary>(emptySummary);
  const [progress, setProgress] = useState<ProgressPoint[]>([]);
  const [weakKeys, setWeakKeys] = useState<WeakKey[]>([]);

  useEffect(() => {
    if (!session) return;

    Promise.all([
      apiRequest<Summary>("/api/stats/summary", { session }),
      apiRequest<ProgressPoint[]>("/api/stats/progress", { session }),
      apiRequest<WeakKey[]>("/api/weak-keys", { session })
    ])
      .then(([summaryData, progressData, weakData]) => {
        setSummary(summaryData);
        setProgress(progressData);
        setWeakKeys(weakData);
      })
      .catch(() => undefined);
  }, [session]);

  if (!session) {
    return (
      <PageFrame>
        <SectionHeader title="Statistikat" description="Hyr ne llogari per te pare progresin ne kohe." />
        <Card>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">Statistikat ruhen vetem per perdoruesit e kycur.</p>
          <ButtonLink to="/login" className="mt-5">
            Kycu me Google
          </ButtonLink>
        </Card>
      </PageFrame>
    );
  }

  return (
    <PageFrame>
      <SectionHeader title="Statistikat" description="Mat shpejtesine, saktesine, serine ditore dhe tastet qe po permiresohen." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Teste" value={summary.testsCompleted} icon={<Activity className="h-5 w-5" />} />
        <StatCard label="WPM me i mire" value={Math.round(summary.bestWpm)} icon={<Trophy className="h-5 w-5" />} />
        <StatCard label="WPM mesatar" value={Math.round(summary.averageWpm)} icon={<Gauge className="h-5 w-5" />} />
        <StatCard label="Saktesia mesatare" value={`${Math.round(summary.averageAccuracy)}%`} icon={<Target className="h-5 w-5" />} />
        <StatCard label="Koha totale" value={formatDuration(summary.totalPracticeSeconds)} icon={<Clock className="h-5 w-5" />} />
        <StatCard label="Seria ditore" value={summary.dailyStreak} icon={<CalendarDays className="h-5 w-5" />} />
      </div>

      {!hasFeature(billing, "advanced_stats") ? (
        <div className="mt-6">
          <Paywall />
        </div>
      ) : (
        <>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="text-xl font-black text-slate-950 dark:text-white">WPM ne kohe</h2>
          <div className="mt-4 h-72">
            {progress.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progress}>
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickFormatter={formatChartDate} />
                  <YAxis tickLine={false} axisLine={false} width={36} />
                  <Tooltip contentStyle={tooltipStyle} labelFormatter={formatChartDate} />
                  <Area type="monotone" dataKey="wpm" name="WPM" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.16} strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart />
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-black text-slate-950 dark:text-white">Saktesia ne kohe</h2>
          <div className="mt-4 h-72">
            {progress.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progress}>
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickFormatter={formatChartDate} />
                  <YAxis tickLine={false} axisLine={false} width={36} />
                  <Tooltip contentStyle={tooltipStyle} labelFormatter={formatChartDate} />
                  <Area type="monotone" dataKey="accuracy" name="Saktesia" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.16} strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart />
            )}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="text-xl font-black text-slate-950 dark:text-white">Tastet me te dobeta</h2>
          <div className="mt-4 h-72">
            {weakKeys.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weakKeys}>
                  <XAxis dataKey="key" tickFormatter={toKeyLabel} tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} width={36} />
                  <Tooltip contentStyle={tooltipStyle} labelFormatter={toKeyLabel} />
                  <Bar dataKey="errorRate" name="Gabime" fill="#f43f5e" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart />
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-black text-slate-950 dark:text-white">Tastet me permiresim</h2>
          <div className="mt-4 space-y-3">
            {weakKeys.length ? (
              weakKeys.slice().reverse().slice(0, 6).map((item) => (
                <div key={item.key} className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
                  <span className="text-lg font-black text-slate-950 dark:text-white">{toKeyLabel(item.key)}</span>
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">{Math.max(0, 100 - Math.round(item.errorRate))}% stabilitet</span>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300/80 bg-white/40 p-6 text-center text-sm font-semibold text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                Nuk ka te dhena ende.
              </div>
            )}
          </div>
        </Card>
      </div>
        </>
      )}
    </PageFrame>
  );
}

const tooltipStyle = {
  borderRadius: 16,
  border: "1px solid rgba(148,163,184,0.25)",
  background: "rgba(15,23,42,0.92)",
  color: "white"
};

function EmptyChart() {
  return (
    <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-300/80 bg-white/40 p-6 text-center text-sm font-semibold text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
      Nuk ka te dhena ende. Kryej disa teste per te pare grafikun.
    </div>
  );
}

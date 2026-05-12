import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { AppText } from "../../components/app-text";
import { Card } from "../../components/card";
import { Screen } from "../../components/screen";
import { StatCard } from "../../components/stat-card";
import { TinyChart } from "../../components/tiny-chart";
import { loadProgress, loadSummary, loadWeakKeys } from "../../lib/api";
import type { ProgressPoint, Summary, WeakKey } from "../../lib/types";
import { formatDuration } from "../../lib/typing";
import { useAuth } from "../../hooks/use-auth";
import { useTheme } from "../../hooks/use-theme";

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

export default function StatsScreen() {
  const { session } = useAuth();
  const { theme } = useTheme();
  const [summary, setSummary] = useState(emptySummary);
  const [progress, setProgress] = useState<ProgressPoint[]>([]);
  const [weakKeys, setWeakKeys] = useState<WeakKey[]>([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!session) return;
    try {
      setError("");
      const [nextSummary, nextProgress, nextWeakKeys] = await Promise.all([
        loadSummary(session),
        loadProgress(session),
        loadWeakKeys(session)
      ]);
      setSummary(nextSummary);
      setProgress(nextProgress);
      setWeakKeys(nextWeakKeys);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Statistikat nuk u ngarkuan");
    }
  }, [session]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Screen>
      <AppText variant="title">Statistikat</AppText>
      {!session ? <AppText variant="body" muted>Kycu per te pare statistikat personale</AppText> : null}
      {error ? <AppText selectable variant="caption" style={{ color: theme.rose }}>{error}</AppText> : null}
      <View style={styles.grid}>
        <StatCard label="WPM me i mire" value={Math.round(summary.bestWpm)} accent="cyan" />
        <StatCard label="WPM mesatar" value={Math.round(summary.averageWpm)} accent="violet" />
        <StatCard label="Saktesia mesatare" value={`${Math.round(summary.averageAccuracy)}%`} accent="emerald" />
        <StatCard label="Teste totale" value={summary.testsCompleted} accent="warning" />
        <StatCard label="Koha totale" value={formatDuration(summary.totalPracticeSeconds)} accent="cyan" />
        <StatCard label="Seria ditore" value={summary.dailyStreak} accent="emerald" />
      </View>

      <Card>
        <AppText variant="subtitle">WPM ne kohe</AppText>
        <TinyChart values={progress.map((item) => item.wpm)} color={theme.cyan} />
      </Card>

      <Card>
        <AppText variant="subtitle">Saktesia ne kohe</AppText>
        <TinyChart values={progress.map((item) => item.accuracy)} color={theme.emerald} />
      </Card>

      <Card>
        <AppText variant="subtitle">Tastet me te dobeta</AppText>
        {weakKeys.length ? weakKeys.slice(0, 8).map((item) => (
          <AppText key={item.key} variant="body">
            {item.key} / {Math.round(item.errorRate)}% gabime
          </AppText>
        )) : (
          <AppText variant="body" muted>Nuk ka te dhena ende</AppText>
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  }
});

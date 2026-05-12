import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Link } from "expo-router";
import { AppText } from "../../components/app-text";
import { Button } from "../../components/button";
import { Card } from "../../components/card";
import { Screen } from "../../components/screen";
import { StatCard } from "../../components/stat-card";
import { TinyChart } from "../../components/tiny-chart";
import { loadProgress, loadSummary } from "../../lib/api";
import type { ProgressPoint, Summary } from "../../lib/types";
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

export default function HomeScreen() {
  const { session, user } = useAuth();
  const { theme } = useTheme();
  const [summary, setSummary] = useState(emptySummary);
  const [progress, setProgress] = useState<ProgressPoint[]>([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!session) {
      setSummary(emptySummary);
      setProgress([]);
      return;
    }

    try {
      setError("");
      const [nextSummary, nextProgress] = await Promise.all([
        loadSummary(session),
        loadProgress(session)
      ]);
      setSummary(nextSummary);
      setProgress(nextProgress);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Te dhenat nuk u ngarkuan");
    }
  }, [session]);

  useEffect(() => {
    load();
  }, [load]);

  const name = (user?.user_metadata?.full_name as string | undefined) || user?.email?.split("@")[0] || "mysafir";

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="title">Mire se erdhe</AppText>
        <AppText variant="body" muted>{session ? name : "Je ne menyre mysafir"}</AppText>
      </View>

      {error ? <AppText selectable variant="caption" style={{ color: theme.rose }}>{error}</AppText> : null}

      <View style={styles.statsGrid}>
        <StatCard label="WPM Mesatar" value={Math.round(summary.averageWpm)} accent="cyan" />
        <StatCard label="Saktesia" value={`${Math.round(summary.averageAccuracy)}%`} accent="emerald" />
        <StatCard label="Teste Sot" value={summary.testsToday} accent="violet" />
        <StatCard label="Minuta Ushtrim" value={Math.round(summary.practiceSecondsToday / 60)} accent="warning" />
      </View>

      <Card>
        <AppText variant="subtitle">Veprime te shpejta</AppText>
        <View style={styles.actions}>
          <Link href="/test" asChild><Button>Test i Shpejte</Button></Link>
          <Link href="/lessons" asChild><Button variant="secondary">Vazhdo Mesimin</Button></Link>
          <Link href="/weak-keys" asChild><Button variant="secondary">Tastet e Dobeta</Button></Link>
          <Link href="/bigrams" asChild><Button variant="secondary">Cifte Shkronjash</Button></Link>
        </View>
      </Card>

      <Card>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <AppText variant="subtitle">Perparimi i fundit</AppText>
            <AppText variant="caption" muted>
              {progress.length ? "WPM gjate diteve te fundit" : "Nuk ka te dhena ende"}
            </AppText>
          </View>
          <AppText variant="caption" muted>Seria {summary.dailyStreak}</AppText>
        </View>
        <TinyChart values={progress.map((item) => item.wpm)} color={theme.cyan} />
        <AppText variant="caption" muted>
          Koha totale: {formatDuration(summary.totalPracticeSeconds)}
        </AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 6,
    paddingTop: 8
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  actions: {
    gap: 10
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  }
});

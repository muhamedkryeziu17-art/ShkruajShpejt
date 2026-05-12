import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Link } from "expo-router";
import { AppText } from "../../components/app-text";
import { Button } from "../../components/button";
import { Card } from "../../components/card";
import { ProgressBar } from "../../components/progress-bar";
import { Screen } from "../../components/screen";
import { loadLessons } from "../../lib/api";
import { localLessons } from "../../lib/lessons";
import type { Lesson } from "../../lib/types";
import { useAuth } from "../../hooks/use-auth";
import { useTheme } from "../../hooks/use-theme";

export default function LessonsScreen() {
  const { session } = useAuth();
  const { theme } = useTheme();
  const [lessons, setLessons] = useState<Lesson[]>(localLessons);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      const remote = await loadLessons(session);
      if (remote.length) setLessons(remote);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mesimet lokale jane aktive");
      setLessons(localLessons);
    }
  }, [session]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Screen>
      <AppText variant="title">Mesimet</AppText>
      {error ? <AppText selectable variant="caption" style={{ color: theme.warning }}>{error}</AppText> : null}
      {lessons.map((lesson) => (
        <Card key={lesson.slug}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <AppText variant="subtitle">{lesson.title}</AppText>
              <AppText variant="caption" muted>{lesson.description || "Ushtrim per tastiere"}</AppText>
            </View>
            <AppText variant="caption" style={{ color: lesson.completed ? theme.emerald : lesson.unlocked ? theme.primary : theme.textMuted }}>
              {lesson.completed ? "U krye" : lesson.unlocked ? "Hapur" : "Mbyllur"}
            </AppText>
          </View>
          <ProgressBar value={lesson.progress} />
          <View style={styles.meta}>
            <AppText variant="caption" muted>WPM {lesson.requiredWpm}</AppText>
            <AppText variant="caption" muted>Saktesia {lesson.requiredAccuracy}%</AppText>
          </View>
          <Link href={`/lessons/${lesson.slug}`} asChild>
            <Button variant={lesson.unlocked ? "primary" : "secondary"} disabled={!lesson.unlocked}>
              Hape Mesimin
            </Button>
          </Link>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  meta: {
    flexDirection: "row",
    gap: 12
  }
});

import { useEffect, useMemo, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { AppText } from "../../components/app-text";
import { Card } from "../../components/card";
import { Screen } from "../../components/screen";
import { TypingTrainer } from "../../components/typing-trainer";
import { loadLessons, saveLessonAttempt } from "../../lib/api";
import { localLessons } from "../../lib/lessons";
import type { Lesson, TypingResult } from "../../lib/types";
import { useAuth } from "../../hooks/use-auth";
import { useTheme } from "../../hooks/use-theme";
import { Button } from "../../components/button";

export default function LessonDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { session } = useAuth();
  const { theme } = useTheme();
  const [lessons, setLessons] = useState<Lesson[]>(localLessons);
  const [message, setMessage] = useState("");
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    loadLessons(session).then(setLessons).catch(() => setLessons(localLessons));
  }, [session]);

  const lesson = useMemo(() => lessons.find((item) => item.slug === slug) ?? localLessons.find((item) => item.slug === slug), [lessons, slug]);

  async function handleComplete(result: TypingResult) {
    if (!lesson) return;
    const passed = result.accuracy >= lesson.requiredAccuracy && result.wpm >= lesson.requiredWpm;
    setComplete(passed);
    if (!session || lesson.id.startsWith("local-")) {
      setMessage(session ? "Mesimi lokal nuk ruhet ne databaze" : "Kycu per te ruajtur mesimin");
      return;
    }
    try {
      await saveLessonAttempt(session, lesson.id, result, passed);
      setMessage(passed ? "Mesimi u ruajt dhe u krye" : "Perparimi u ruajt");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Mesimi nuk u ruajt");
    }
  }

  if (!lesson) {
    return (
      <Screen>
        <Card>
          <AppText variant="subtitle">Mesimi nuk u gjet</AppText>
          <Button onPress={() => router.replace("/lessons")}>Kthehu te Mesimet</Button>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen>
      <AppText variant="title">{lesson.title}</AppText>
      <Card>
        <AppText variant="body" muted>{lesson.description || "Praktiko me kujdes"}</AppText>
        <AppText variant="label">Tastet</AppText>
        <AppText variant="body">{lesson.targetKeys.join("  ")}</AppText>
        <AppText variant="caption" muted>Kerkohet WPM {lesson.requiredWpm} dhe saktesi {lesson.requiredAccuracy}%</AppText>
        {message ? <AppText selectable variant="caption" style={{ color: complete ? theme.emerald : theme.warning }}>{message}</AppText> : null}
      </Card>
      <TypingTrainer
        title="Ushtrim Mesimi"
        text={lesson.exerciseText}
        durationSeconds={60}
        difficulty="Mesim"
        category={lesson.title}
        onComplete={handleComplete}
      />
    </Screen>
  );
}

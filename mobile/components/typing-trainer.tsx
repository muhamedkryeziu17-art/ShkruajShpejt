import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import * as Haptics from "expo-haptics";
import { AppText } from "./app-text";
import { Button } from "./button";
import { Card } from "./card";
import { StatCard } from "./stat-card";
import { buildTypingResult, calculateLiveStats, formatDuration, normalizeKey } from "../lib/typing";
import type { KeyStatDelta, SpeedPoint, TypingResult } from "../lib/types";
import { useTheme } from "../hooks/use-theme";

type TypingTrainerProps = {
  title: string;
  text: string;
  durationSeconds: number;
  difficulty: string;
  category: string;
  onComplete: (result: TypingResult) => void;
};

export function TypingTrainer({ title, text, durationSeconds, difficulty, category, onComplete }: TypingTrainerProps) {
  const { theme, hapticsEnabled } = useTheme();
  const inputRef = useRef<TextInput | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const typedRef = useRef("");
  const finishedRef = useRef(false);
  const timelineRef = useRef<SpeedPoint[]>([]);
  const lastTimelineSecondRef = useRef(0);
  const errorsRef = useRef<Record<string, number>>({});
  const keyStatsRef = useRef<Record<string, KeyStatDelta>>({});

  const [typed, setTyped] = useState("");
  const [started, setStarted] = useState(false);
  const [remaining, setRemaining] = useState(durationSeconds);
  const [tick, setTick] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    reset();
  }, [text, durationSeconds]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [text]);

  const elapsedSeconds = useMemo(() => {
    if (!started || !startTimeRef.current) return 0;
    return Math.min(durationSeconds, (Date.now() - startTimeRef.current) / 1000);
  }, [durationSeconds, started, tick]);

  const stats = useMemo(() => calculateLiveStats(text, typed, elapsedSeconds || 1), [elapsedSeconds, text, typed]);
  const mistakeCount = useMemo(() => Object.values(errorsRef.current).reduce((sum, value) => sum + value, 0), [typed]);

  const finish = useCallback((snapshot: string, elapsed: number) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setStarted(false);
    const result = buildTypingResult({
      text,
      typed: snapshot,
      elapsedSeconds: Math.max(elapsed, 1),
      modeSeconds: durationSeconds,
      difficulty,
      category,
      errors: errorsRef.current,
      keyStats: keyStatsRef.current,
      timeline: timelineRef.current
    });
    if (hapticsEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
    }
    onComplete(result);
  }, [category, difficulty, durationSeconds, hapticsEnabled, onComplete, text]);

  useEffect(() => {
    if (!started || finishedRef.current) return;

    const interval = setInterval(() => {
      if (!startTimeRef.current) return;
      const elapsed = Math.min(durationSeconds, (Date.now() - startTimeRef.current) / 1000);
      const whole = Math.floor(elapsed);
      setRemaining(Math.max(durationSeconds - whole, 0));
      setTick((value) => value + 1);

      if (whole > 0 && whole !== lastTimelineSecondRef.current) {
        lastTimelineSecondRef.current = whole;
        const point = calculateLiveStats(text, typedRef.current, elapsed);
        timelineRef.current = [
          ...timelineRef.current,
          { second: whole, wpm: point.wpm, accuracy: point.accuracy }
        ].slice(-240);
      }

      if (elapsed >= durationSeconds) {
        finish(typedRef.current, durationSeconds);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [durationSeconds, finish, started, text]);

  function reset() {
    typedRef.current = "";
    startTimeRef.current = null;
    finishedRef.current = false;
    timelineRef.current = [];
    lastTimelineSecondRef.current = 0;
    errorsRef.current = {};
    keyStatsRef.current = {};
    setTyped("");
    setStarted(false);
    setRemaining(durationSeconds);
    setTick(0);
    setMessage("");
    setTimeout(() => inputRef.current?.focus(), 60);
  }

  function startIfNeeded(next: string) {
    if (!started && next.length > 0) {
      startTimeRef.current = Date.now();
      setStarted(true);
    }
  }

  function trackAttempt(next: string) {
    const previous = typedRef.current;
    if (next.length !== previous.length + 1) return;
    const index = previous.length;
    const expected = text[index] ?? "";
    const actual = next[index] ?? "";
    const statKey = normalizeKey(expected || actual);

    if (!keyStatsRef.current[statKey]) {
      keyStatsRef.current[statKey] = { correct: 0, errors: 0 };
    }

    if (actual === expected) {
      keyStatsRef.current[statKey].correct += 1;
    } else {
      keyStatsRef.current[statKey].errors += 1;
      errorsRef.current[statKey] = (errorsRef.current[statKey] ?? 0) + 1;
      if (hapticsEnabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
      }
    }
  }

  function handleChangeText(nextValue: string) {
    if (finishedRef.current) return;

    if (nextValue.length > typedRef.current.length + 1) {
      setMessage("Ngjitja e tekstit nuk lejohet");
      return;
    }

    const next = nextValue.slice(0, text.length);
    setMessage("");
    startIfNeeded(next);
    trackAttempt(next);
    typedRef.current = next;
    setTyped(next);

    if (next.length >= text.length) {
      const elapsed = startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 : 1;
      finish(next, elapsed);
    }
  }

  return (
    <View style={styles.wrap}>
      <Card>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <AppText variant="subtitle">{title}</AppText>
            <AppText variant="caption" muted>{category} / {difficulty}</AppText>
          </View>
          <Button variant="secondary" onPress={reset}>Rifillo</Button>
        </View>
        <View style={styles.stats}>
          <StatCard label="WPM" value={stats.wpm} accent="cyan" />
          <StatCard label="Saktesia" value={`${stats.accuracy}%`} accent="emerald" />
          <StatCard label="Koha" value={formatDuration(remaining)} accent="violet" />
          <StatCard label="Gabime" value={mistakeCount} accent="rose" />
        </View>
      </Card>

      <Card>
        <ScrollView style={styles.textBox} nestedScrollEnabled>
          <Text style={styles.textLine}>
            {Array.from(text).map((char, index) => {
              const typedChar = typed[index];
              const isDone = index < typed.length;
              const isCorrect = isDone && typedChar === char;
              const isWrong = isDone && typedChar !== char;
              const isCurrent = index === typed.length;
              return (
                <Text
                  key={`${char}-${index}`}
                  style={[
                    styles.char,
                    { color: theme.textMuted },
                    isCorrect ? { color: theme.emerald } : null,
                    isWrong ? { color: theme.rose, backgroundColor: `${theme.rose}22` } : null,
                    isCurrent ? { color: theme.primary, backgroundColor: `${theme.primary}22` } : null
                  ]}
                >
                  {char}
                </Text>
              );
            })}
          </Text>
        </ScrollView>
        <TextInput
          ref={inputRef}
          value={typed}
          onChangeText={handleChangeText}
          autoFocus
          multiline
          autoCapitalize="none"
          autoCorrect={false}
          contextMenuHidden
          spellCheck={false}
          keyboardAppearance={theme.mode}
          placeholder="Shkruaj ketu"
          placeholderTextColor={theme.textMuted}
          style={[
            styles.input,
            {
              color: theme.text,
              borderColor: theme.border,
              backgroundColor: theme.mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.85)"
            }
          ]}
        />
        {message ? <AppText variant="caption" style={{ color: theme.warning }}>{message}</AppText> : null}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 14
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  textBox: {
    maxHeight: 220
  },
  textLine: {
    fontSize: 21,
    lineHeight: 35,
    fontWeight: "700",
    letterSpacing: 0
  },
  char: {
    borderRadius: 7
  },
  input: {
    minHeight: 112,
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600",
    textAlignVertical: "top"
  }
});

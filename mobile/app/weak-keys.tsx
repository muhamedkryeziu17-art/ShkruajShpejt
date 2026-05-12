import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { AppText } from "../components/app-text";
import { Button } from "../components/button";
import { Card } from "../components/card";
import { Screen } from "../components/screen";
import { TypingTrainer } from "../components/typing-trainer";
import { generateWeakKeyText } from "../lib/content";
import { loadWeakKeys } from "../lib/api";
import type { TypingResult, WeakKey } from "../lib/types";
import { useAuth } from "../hooks/use-auth";
import { useTheme } from "../hooks/use-theme";

export default function WeakKeysScreen() {
  const { session } = useAuth();
  const { theme } = useTheme();
  const [weakKeys, setWeakKeys] = useState<WeakKey[]>([]);
  const [practiceText, setPracticeText] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    if (!session) {
      setWeakKeys([]);
      setPracticeText(generateWeakKeyText([]));
      return;
    }
    try {
      const keys = await loadWeakKeys(session);
      setWeakKeys(keys);
      setPracticeText(generateWeakKeyText(keys.map((item) => item.key)));
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Tastet nuk u ngarkuan");
      setPracticeText(generateWeakKeyText([]));
    }
  }, [session]);

  useEffect(() => {
    load();
  }, [load]);

  const topKeys = useMemo(() => weakKeys.slice(0, 8), [weakKeys]);

  function handleComplete(result: TypingResult) {
    setMessage(`U krye me ${result.wpm} WPM dhe ${result.accuracy}% saktesi`);
  }

  return (
    <Screen>
      <AppText variant="title">Tastet e Dobeta</AppText>
      <Card>
        <AppText variant="body" muted>
          Fokusohu ne saktesi para shpejtesise
        </AppText>
        <AppText variant="body" muted>
          Praktiko kete tast 5 minuta
        </AppText>
        {session ? null : <AppText variant="caption" style={{ color: theme.warning }}>Kycu per analiza personale</AppText>}
        {message ? <AppText selectable variant="caption" style={{ color: theme.primary }}>{message}</AppText> : null}
        <View style={styles.badges}>
          {topKeys.length ? topKeys.map((item) => (
            <AppText key={item.key} variant="caption" style={[styles.badge, { borderColor: theme.border }]}>
              {item.key} {Math.round(item.errorRate)}%
            </AppText>
          )) : (
            <AppText variant="caption" muted>Nuk ka gabime te ruajtura ende</AppText>
          )}
        </View>
        <Button variant="secondary" onPress={() => setPracticeText(generateWeakKeyText(topKeys.map((item) => item.key)))}>
          Gjenero Ushtrim
        </Button>
      </Card>

      {practiceText ? (
        <TypingTrainer
          title="Ushtrim me taste"
          text={practiceText}
          durationSeconds={60}
          difficulty="Personal"
          category="Tastet e Dobeta"
          onComplete={handleComplete}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  badge: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6
  }
});

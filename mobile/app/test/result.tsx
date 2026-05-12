import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Link, router } from "expo-router";
import { AppText } from "../../components/app-text";
import { Button } from "../../components/button";
import { Card } from "../../components/card";
import { Screen } from "../../components/screen";
import { StatCard } from "../../components/stat-card";
import { TinyChart } from "../../components/tiny-chart";
import { saveTypingResult } from "../../lib/api";
import { formatDuration, topWeakKeys } from "../../lib/typing";
import { useAuth } from "../../hooks/use-auth";
import { useTestResult } from "../../hooks/use-test-result";
import { useTheme } from "../../hooks/use-theme";

export default function ResultScreen() {
  const { result, clearResult } = useTestResult();
  const { session } = useAuth();
  const { theme } = useTheme();
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!result || !session || saveState !== "idle") return;
    save();
  }, [result, session, saveState]);

  async function save() {
    if (!result || !session) return;
    setSaveState("saving");
    setMessage("");
    try {
      await saveTypingResult(session, result);
      setSaveState("saved");
      setMessage("Rezultati u ruajt");
    } catch (err) {
      setSaveState("error");
      setMessage(err instanceof Error ? err.message : "Rezultati nuk u ruajt");
    }
  }

  if (!result) {
    return (
      <Screen>
        <Card>
          <AppText variant="subtitle">Nuk ka rezultat</AppText>
          <Link href="/test" asChild><Button>Kthehu te Testi</Button></Link>
        </Card>
      </Screen>
    );
  }

  const weakKeys = topWeakKeys(result.errors);

  return (
    <Screen>
      <AppText variant="title">Rezultati</AppText>
      <View style={styles.grid}>
        <StatCard label="WPM" value={result.wpm} accent="cyan" />
        <StatCard label="WPM bruto" value={result.rawWpm} accent="violet" />
        <StatCard label="Saktesia" value={`${result.accuracy}%`} accent="emerald" />
        <StatCard label="Gabime" value={result.mistakeCount} accent="rose" />
        <StatCard label="Karaktere te sakta" value={result.correctChars} accent="emerald" />
        <StatCard label="Karaktere te gabuara" value={result.incorrectChars} accent="rose" />
        <StatCard label="Koha" value={formatDuration(result.elapsedSeconds)} accent="warning" />
      </View>

      <Card>
        <AppText variant="subtitle">Grafiku i shpejtesise</AppText>
        <TinyChart values={result.speedTimeline.map((item) => item.wpm)} />
      </Card>

      <Card>
        <AppText variant="subtitle">Tastet e dobeta</AppText>
        {weakKeys.length ? (
          <View style={styles.badges}>
            {weakKeys.map((item) => (
              <AppText key={item.key} variant="caption" style={[styles.badge, { color: theme.text, borderColor: theme.border }]}>
                {item.key}: {item.count}
              </AppText>
            ))}
          </View>
        ) : (
          <AppText variant="body" muted>Nuk ka gabime te dukshme</AppText>
        )}
        {!session ? <AppText variant="caption" style={{ color: theme.warning }}>Kycu per te ruajtur progresin</AppText> : null}
        {message ? <AppText selectable variant="caption" style={{ color: saveState === "error" ? theme.rose : theme.emerald }}>{message}</AppText> : null}
      </Card>

      <View style={styles.actions}>
        <Button onPress={() => router.replace("/test")}>Provo Perseri</Button>
        <Button variant="secondary" onPress={save} disabled={!session || saveState === "saving" || saveState === "saved"}>
          Ruaj Rezultatin
        </Button>
        <Button
          variant="ghost"
          onPress={() => {
            clearResult();
            router.replace("/home");
          }}
        >
          Kthehu ne Balline
        </Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
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
  },
  actions: {
    gap: 10
  }
});

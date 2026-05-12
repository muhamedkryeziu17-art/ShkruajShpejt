import { useMemo, useState } from "react";
import { AppText } from "../components/app-text";
import { Button } from "../components/button";
import { Card } from "../components/card";
import { Screen } from "../components/screen";
import { TypingTrainer } from "../components/typing-trainer";
import { commonBigrams } from "../constants/options";
import { generateBigramText } from "../lib/content";
import type { TypingResult } from "../lib/types";
import { useTheme } from "../hooks/use-theme";

export default function BigramsScreen() {
  const { theme } = useTheme();
  const [seed, setSeed] = useState(1);
  const [message, setMessage] = useState("");
  const text = useMemo(() => generateBigramText(7 + seed), [seed]);

  function handleComplete(result: TypingResult) {
    setMessage(`Shpejtesia ${result.wpm} WPM, saktesia ${result.accuracy}%`);
  }

  return (
    <Screen>
      <AppText variant="title">Cifte Shkronjash</AppText>
      <Card>
        <AppText variant="body" muted>
          {commonBigrams.join("  ")}
        </AppText>
        {message ? <AppText selectable variant="caption" style={{ color: theme.primary }}>{message}</AppText> : null}
        <Button variant="secondary" onPress={() => setSeed((value) => value + 1)}>
          Gjenero Tekst
        </Button>
      </Card>
      <TypingTrainer
        key={seed}
        title="Praktike Bigram"
        text={text}
        durationSeconds={60}
        difficulty="Mesatar"
        category="Cifte Shkronjash"
        onComplete={handleComplete}
      />
    </Screen>
  );
}

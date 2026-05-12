import { useMemo, useState } from "react";
import { router } from "expo-router";
import { Card } from "../../components/card";
import { Screen } from "../../components/screen";
import { SegmentedControl } from "../../components/segmented-control";
import { TypingTrainer } from "../../components/typing-trainer";
import { AppText } from "../../components/app-text";
import { categories, difficulties, durations, type Difficulty, type TestCategory } from "../../constants/options";
import { generateTestText } from "../../lib/content";
import type { TypingResult } from "../../lib/types";
import { useTestResult } from "../../hooks/use-test-result";

type DurationLabel = typeof durations[number]["label"];

export default function TestScreen() {
  const [durationLabel, setDurationLabel] = useState<DurationLabel>("1 minute");
  const [difficulty, setDifficulty] = useState<Difficulty>("Mesatar");
  const [category, setCategory] = useState<TestCategory>("Fjale te zakonshme");
  const [seed, setSeed] = useState(1);
  const { setResult } = useTestResult();

  const duration = durations.find((item) => item.label === durationLabel) ?? durations[1];
  const text = useMemo(() => generateTestText(category, difficulty, 80 + seed), [category, difficulty, seed]);

  function handleComplete(result: TypingResult) {
    setResult(result);
    router.push("/test/result");
    setSeed((value) => value + 1);
  }

  return (
    <Screen scroll>
      <AppText variant="title">Testi</AppText>
      <Card>
        <SegmentedControl label="Koha" value={durationLabel} options={durations.map((item) => item.label)} onChange={setDurationLabel} />
        <SegmentedControl label="Niveli" value={difficulty} options={difficulties} onChange={setDifficulty} />
        <SegmentedControl label="Kategoria" value={category} options={categories} onChange={setCategory} />
      </Card>
      <TypingTrainer
        key={`${duration.seconds}-${difficulty}-${category}-${seed}`}
        title="Test Shkrimi"
        text={text}
        durationSeconds={duration.seconds}
        difficulty={difficulty}
        category={category}
        onComplete={handleComplete}
      />
    </Screen>
  );
}

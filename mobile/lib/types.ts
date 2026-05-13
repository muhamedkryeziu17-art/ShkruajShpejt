import type { Difficulty, TestCategory } from "../constants/options";

export type SpeedPoint = {
  second: number;
  wpm: number;
  accuracy: number;
};

export type KeyStatDelta = {
  correct: number;
  errors: number;
};

export type TypingResult = {
  modeSeconds: number;
  elapsedSeconds: number;
  difficulty: Difficulty | string;
  category: TestCategory | string;
  text: string;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  mistakeCount: number;
  errors: Record<string, number>;
  keyStats: Record<string, KeyStatDelta>;
  speedTimeline: SpeedPoint[];
};

export type Summary = {
  testsCompleted: number;
  bestWpm: number;
  averageWpm: number;
  averageAccuracy: number;
  totalPracticeSeconds: number;
  dailyStreak: number;
  testsToday: number;
  practiceSecondsToday: number;
  averageWpmToday: number;
  averageAccuracyToday: number;
};

export type ProgressPoint = {
  date: string;
  wpm: number;
  accuracy: number;
  tests: number;
};

export type RecentTest = {
  id: string;
  modeSeconds: number;
  difficulty: string;
  category: string;
  wpm: number;
  accuracy: number;
  incorrectChars: number;
  createdAt: string;
};

export type Lesson = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  targetKeys: string[];
  exerciseText: string;
  orderIndex: number;
  requiredAccuracy: number;
  requiredWpm: number;
  bestWpm: number;
  bestAccuracy: number;
  completed: boolean;
  attempts: number;
  unlocked: boolean;
  progress: number;
};

export type WeakKey = {
  key: string;
  correctCount: number;
  errorCount: number;
  errorRate: number;
};

export type LegalProfile = {
  id: string;
  email: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  termsAcceptedAt: string | null;
  termsVersion: string | null;
  privacyAcceptedAt: string | null;
  privacyVersion: string | null;
  mustAcceptTerms: boolean;
};

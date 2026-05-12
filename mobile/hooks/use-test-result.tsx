import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { TypingResult } from "../lib/types";

type TestResultContextValue = {
  result: TypingResult | null;
  setResult: (result: TypingResult | null) => void;
  clearResult: () => void;
};

const TestResultContext = createContext<TestResultContextValue | null>(null);

export function TestResultProvider({ children }: { children: React.ReactNode }) {
  const [result, setResultState] = useState<TypingResult | null>(null);

  const setResult = useCallback((next: TypingResult | null) => {
    setResultState(next);
  }, []);

  const clearResult = useCallback(() => {
    setResultState(null);
  }, []);

  const value = useMemo(() => ({ result, setResult, clearResult }), [clearResult, result, setResult]);

  return <TestResultContext.Provider value={value}>{children}</TestResultContext.Provider>;
}

export function useTestResult() {
  const value = useContext(TestResultContext);
  if (!value) {
    throw new Error("TestResultProvider mungon");
  }
  return value;
}

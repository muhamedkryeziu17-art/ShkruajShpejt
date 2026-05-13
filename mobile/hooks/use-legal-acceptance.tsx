import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { acceptLegal, loadProfile } from "../lib/api";
import type { LegalProfile } from "../lib/types";
import { useAuth } from "./use-auth";

type LegalAcceptanceValue = {
  profile: LegalProfile | null;
  loading: boolean;
  accepting: boolean;
  error: string;
  mustAcceptTerms: boolean;
  refresh: () => Promise<void>;
  acceptLatestTerms: () => Promise<void>;
};

const LegalAcceptanceContext = createContext<LegalAcceptanceValue | null>(null);

export function LegalAcceptanceProvider({ children }: { children: React.ReactNode }) {
  const { session, isGuest } = useAuth();
  const [profile, setProfile] = useState<LegalProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    if (!session || isGuest) {
      setProfile(null);
      setLoading(false);
      setError("");
      return;
    }

    setLoading(true);
    setError("");
    try {
      setProfile(await loadProfile(session));
    } catch (err) {
      setProfile(null);
      setError(err instanceof Error ? err.message : "Te dhenat ligjore nuk u ngarkuan");
    } finally {
      setLoading(false);
    }
  }, [isGuest, session]);

  const acceptLatestTerms = useCallback(async () => {
    if (!session) return;

    setAccepting(true);
    setError("");
    try {
      setProfile(await acceptLegal(session));
    } catch {
      setError("Nuk mundem ta ruaj pranimin. Provo perseri.");
    } finally {
      setAccepting(false);
    }
  }, [session]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<LegalAcceptanceValue>(() => ({
    profile,
    loading,
    accepting,
    error,
    mustAcceptTerms: Boolean(session && !isGuest && profile?.mustAcceptTerms),
    refresh,
    acceptLatestTerms
  }), [acceptLatestTerms, accepting, error, isGuest, loading, profile, refresh, session]);

  return <LegalAcceptanceContext.Provider value={value}>{children}</LegalAcceptanceContext.Provider>;
}

export function useLegalAcceptance() {
  const value = useContext(LegalAcceptanceContext);
  if (!value) {
    throw new Error("LegalAcceptanceProvider mungon");
  }
  return value;
}

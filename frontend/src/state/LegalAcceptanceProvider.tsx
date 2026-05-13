import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { TERMS_VERSION, PRIVACY_VERSION } from "../config/legal";
import { apiRequest } from "../lib/api";
import { useAuth } from "./AuthProvider";

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

type LegalAcceptanceContextValue = {
  profile: LegalProfile | null;
  loading: boolean;
  accepting: boolean;
  error: string;
  mustAcceptTerms: boolean;
  refresh: () => Promise<void>;
  acceptLatestTerms: () => Promise<void>;
};

const LegalAcceptanceContext = createContext<LegalAcceptanceContextValue | null>(null);

export function LegalAcceptanceProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const [profile, setProfile] = useState<LegalProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    if (!session) {
      setProfile(null);
      setError("");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await apiRequest<LegalProfile>("/api/me", { session });
      setProfile(data);
    } catch (error) {
      setProfile(null);
      setError(error instanceof Error ? error.message : "Te dhenat ligjore nuk u ngarkuan.");
    } finally {
      setLoading(false);
    }
  }, [session]);

  const acceptLatestTerms = useCallback(async () => {
    if (!session) return;

    setAccepting(true);
    setError("");
    try {
      const data = await apiRequest<LegalProfile>("/api/legal/accept", {
        method: "POST",
        session,
        body: JSON.stringify({
          termsVersion: TERMS_VERSION,
          privacyVersion: PRIVACY_VERSION
        })
      });
      setProfile(data);
      window.dispatchEvent(new Event("legal-accepted"));
    } catch {
      setError("Nuk mundem ta ruaj pranimin. Provo perseri.");
    } finally {
      setAccepting(false);
    }
  }, [session]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<LegalAcceptanceContextValue>(() => ({
    profile,
    loading,
    accepting,
    error,
    mustAcceptTerms: Boolean(session && profile?.mustAcceptTerms),
    refresh,
    acceptLatestTerms
  }), [acceptLatestTerms, accepting, error, loading, profile, refresh, session]);

  return <LegalAcceptanceContext.Provider value={value}>{children}</LegalAcceptanceContext.Provider>;
}

export function useLegalAcceptance() {
  const value = useContext(LegalAcceptanceContext);
  if (!value) {
    throw new Error("LegalAcceptanceProvider mungon");
  }
  return value;
}

import type { Session, User } from "@supabase/supabase-js";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const hasSupabaseConfig = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

async function getSupabaseClient() {
  const module = await import("../lib/supabase");
  return module.supabase;
}

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | null = null;

    if (!hasSupabaseConfig) {
      setLoading(false);
      return () => {
        active = false;
      };
    }

    getSupabaseClient()
      .then((supabase) => {
        if (!active) return;

        supabase.auth.getSession().then(({ data }) => {
          if (!active) return;
          setSession(data.session);
          setLoading(false);
        });

        const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
          setSession(nextSession);
          setLoading(false);
        });

        unsubscribe = () => data.subscription.unsubscribe();
      })
      .catch(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!hasSupabaseConfig) {
      throw new Error("Konfigurimi i Supabase mungon");
    }

    const supabase = await getSupabaseClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin.replace(/\/+$/, "")}/dashboard`
      }
    });

    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    const supabase = await getSupabaseClient();
    await supabase.auth.signOut();
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    return {
      session,
      user: session?.user ?? null,
      loading,
      isConfigured: hasSupabaseConfig,
      signInWithGoogle,
      signOut
    };
  }, [loading, session, signInWithGoogle, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("AuthProvider mungon");
  }
  return value;
}

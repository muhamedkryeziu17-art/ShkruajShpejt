import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../lib/api";
import { emptyBillingStatus, type BillingStatus } from "../lib/billingPlans";
import { useAuth } from "./AuthProvider";

type BillingContextValue = {
  billing: BillingStatus;
  loading: boolean;
  refresh: () => Promise<void>;
};

const BillingContext = createContext<BillingContextValue | null>(null);

export function BillingProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const [billing, setBilling] = useState<BillingStatus>(emptyBillingStatus);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!session) {
      setBilling(emptyBillingStatus());
      return;
    }

    setLoading(true);
    try {
      const data = await apiRequest<BillingStatus>("/api/billing/status", { session });
      setBilling(data);
    } catch {
      setBilling(emptyBillingStatus());
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(() => ({ billing, loading, refresh }), [billing, loading, refresh]);
  return <BillingContext.Provider value={value}>{children}</BillingContext.Provider>;
}

export function useBilling() {
  const value = useContext(BillingContext);
  if (!value) {
    throw new Error("BillingProvider mungon");
  }
  return value;
}

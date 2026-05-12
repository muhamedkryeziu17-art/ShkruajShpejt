import { type BillingFeature, hasFeature } from "../lib/billingPlans";
import { useBilling } from "../state/BillingProvider";
import { Paywall } from "./Paywall";

export function FeatureGate({ feature, children }: { feature: BillingFeature; children: React.ReactNode }) {
  const { billing, loading } = useBilling();

  if (loading) {
    return null;
  }

  if (!hasFeature(billing, feature)) {
    return <Paywall />;
  }

  return <>{children}</>;
}

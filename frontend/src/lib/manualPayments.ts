import type { BillingPlan } from "./billingPlans";
import { supportEmail } from "./legal";

export const manualPaymentProvider = (import.meta.env.VITE_PAYMENT_PROVIDER || "manual").trim().toLowerCase();

export const manualPaymentsEnabled =
  manualPaymentProvider === "manual" ||
  manualPaymentProvider === "paysera_manual" ||
  manualPaymentProvider === "paysera-manual";

export const manualPaymentDetails = {
  payeeName: (import.meta.env.VITE_MANUAL_PAYMENT_PAYEE_NAME || "ShkruajShpejt").trim(),
  payseraEmail: (import.meta.env.VITE_MANUAL_PAYMENT_PAYSERA_EMAIL || "").trim(),
  iban: (import.meta.env.VITE_MANUAL_PAYMENT_IBAN || "").trim(),
  bankName: (import.meta.env.VITE_MANUAL_PAYMENT_BANK_NAME || "Paysera").trim(),
  currency: "EUR",
  supportEmail
};

export const manualPaymentPrices: Record<BillingPlan, number> = {
  free: 0,
  pro_monthly: 3.99,
  pro_yearly: 24.99,
  lifetime: 49.99,
  school_basic: 99,
  school_pro: 199,
  school_custom: 299
};

export function manualPaymentReference(userId: string | undefined, plan: BillingPlan) {
  const userPart = userId ? userId.slice(0, 8).toUpperCase() : "GUEST";
  return `SHSH-${plan.toUpperCase()}-${userPart}`;
}

export function manualPaymentSubject(plan: BillingPlan, reference: string) {
  return `Pagesa ${plan} ${reference}`;
}

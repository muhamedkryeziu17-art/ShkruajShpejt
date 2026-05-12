import { Check, Copy, GraduationCap, Landmark, Mail, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, ButtonLink } from "../components/Button";
import { Card, SectionHeader } from "../components/Card";
import { PageFrame } from "../components/PageFrame";
import { apiRequest } from "../lib/api";
import { billingPlans, getPlanLabel, schoolPlans, type BillingPlan } from "../lib/billingPlans";
import { mailTo } from "../lib/legal";
import {
  manualPaymentDetails,
  manualPaymentPrices,
  manualPaymentReference,
  manualPaymentSubject,
  manualPaymentsEnabled
} from "../lib/manualPayments";
import { useAuth } from "../state/AuthProvider";

const paymentsEnabled = import.meta.env.VITE_ENABLE_PAYMENTS === "true";

export function PricingPage() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loadingPlan, setLoadingPlan] = useState<BillingPlan | "">("");
  const [manualPlan, setManualPlan] = useState<BillingPlan | null>(null);

  const manualReference = manualPlan ? manualPaymentReference(session?.user.id, manualPlan) : "";
  const manualAmount = manualPlan ? manualPaymentPrices[manualPlan].toFixed(2) : "0.00";
  const manualEmailSubject = manualPlan ? manualPaymentSubject(manualPlan, manualReference) : "Pagesa ShkruajShpejt";
  const manualEmailBody = manualPlan
    ? [
        `Plani: ${getPlanLabel(manualPlan)}`,
        `Shuma: ${manualAmount} ${manualPaymentDetails.currency}`,
        `Referenca: ${manualReference}`,
        `Email llogarie: ${session?.user.email ?? ""}`,
        "",
        "Kam kryer pagesen manuale dhe dua aktivizim Pro."
      ].join("\n")
    : "";
  const manualMailHref = `mailto:${manualPaymentDetails.supportEmail}?subject=${encodeURIComponent(manualEmailSubject)}&body=${encodeURIComponent(manualEmailBody)}`;

  async function startCheckout(plan: BillingPlan) {
    setMessage("");
    setManualPlan(null);

    if (plan === "free") {
      navigate("/test");
      return;
    }

    if (!session) {
      navigate("/login");
      return;
    }

    if (manualPaymentsEnabled) {
      setManualPlan(plan);
      setMessage("Kryej pagesen manuale me Paysera ose banke, pastaj dergo konfirmimin per aktivizim Pro.");
      return;
    }

    if (!paymentsEnabled) {
      setMessage("Pagesat nuk jane konfiguruar ende. Na kontakto per qasje Pro.");
      return;
    }

    setLoadingPlan(plan);
    try {
      const response = await apiRequest<{ checkoutUrl: string }>("/api/billing/create-checkout", {
        method: "POST",
        session,
        body: JSON.stringify({ plan })
      });
      window.location.href = response.checkoutUrl;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Pagesat nuk jane konfiguruar ende. Na kontakto per qasje Pro.");
    } finally {
      setLoadingPlan("");
    }
  }

  function copyValue(value: string) {
    if (!value || !navigator.clipboard) return;
    void navigator.clipboard.writeText(value);
  }

  return (
    <PageFrame>
      <SectionHeader
        title="Cmimet"
        description="Zgjidh planin qe i pershtatet ushtrimit tend. Fillo falas dhe perditeso kur te duhen analiza me te thella."
      />

      {message ? (
        <div className="mb-5 rounded-2xl border border-amber-300/70 bg-amber-50 p-4 text-sm font-semibold text-amber-800 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200">
          {message}
          <a href={mailTo("Qasje Pro ShkruajShpejt")} className="ml-2 underline">
            Kontakt
          </a>
        </div>
      ) : null}

      {manualPlan ? (
        <Card className="mb-8 border-emerald-400/60">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-200">
                  <Landmark className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-bold uppercase text-slate-500 dark:text-slate-300">Pagesa manuale Paysera</p>
                  <h2 className="text-2xl font-black text-slate-950 dark:text-white">{getPlanLabel(manualPlan)}</h2>
                </div>
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                Dergo pagesen me Paysera ose transfer bankar. Shkruaj referencen sakte, pastaj dergo konfirmimin ne email. Qasja Pro aktivizohet pasi pagesa te verifikohet.
              </p>
            </div>
            <a
              href={manualMailHref}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-ink px-4 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 dark:bg-white dark:text-ink"
            >
              <Mail className="h-4 w-4" />
              Dergo konfirmimin
            </a>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <ManualInfo label="Shuma" value={`${manualAmount} ${manualPaymentDetails.currency}`} onCopy={copyValue} />
            <ManualInfo label="Referenca" value={manualReference} onCopy={copyValue} />
            <ManualInfo label="Perfituesi" value={manualPaymentDetails.payeeName} onCopy={copyValue} />
            <ManualInfo label="Banka" value={manualPaymentDetails.bankName} onCopy={copyValue} />
            <ManualInfo label="Paysera email" value={manualPaymentDetails.payseraEmail || "Vendose ne Vercel env"} onCopy={copyValue} />
            <ManualInfo label="IBAN" value={manualPaymentDetails.iban || "Vendose ne Vercel env"} onCopy={copyValue} />
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200/70 bg-white/60 p-4 text-sm leading-6 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
            Hapat: paguaj shumen, vendos referencen, dergo screenshot ose konfirmim ne email. Admini aktivizon planin ne Supabase pas kontrollit.
          </div>
        </Card>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-4">
        {billingPlans.map((plan) => (
          <Card key={plan.id} className={plan.highlighted ? "relative border-cyan-400/70 shadow-glow" : "relative"}>
            {plan.highlighted ? (
              <span className="absolute right-4 top-4 rounded-full bg-cyan-400 px-3 py-1 text-xs font-black text-ink">Me i miri</span>
            ) : null}
            <div className="flex min-h-[22rem] flex-col">
              <h2 className="text-xl font-black text-slate-950 dark:text-white">{plan.label}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{plan.description}</p>
              <div className="mt-5">
                <span className="text-3xl font-black text-slate-950 dark:text-white">{plan.price}</span>
                <span className="ml-2 text-sm font-semibold text-slate-500 dark:text-slate-300">{plan.cadence}</span>
              </div>
              <div className="mt-5 space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    <Check className="mt-0.5 h-4 w-4 text-emerald-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                className="mt-auto"
                variant={plan.highlighted ? "primary" : "secondary"}
                onClick={() => startCheckout(plan.id)}
                disabled={loadingPlan === plan.id}
                icon={plan.id === "free" ? undefined : <Sparkles className="h-4 w-4" />}
              >
                {loadingPlan === plan.id ? "Duke hapur..." : plan.cta}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <SectionHeader title="Per Shkolla" description="Plane per mesues, klasa dhe organizata qe duan raporte per nxenes." />
        <div className="grid gap-5 lg:grid-cols-3">
          {schoolPlans.map((plan) => (
            <Card key={plan.id}>
              <div className="flex items-center gap-3">
                <span className="rounded-2xl bg-violet-500/10 p-3 text-violet-600 dark:text-violet-200">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-xl font-black text-slate-950 dark:text-white">{plan.label}</h2>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-300">{plan.price} / {plan.cadence}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{plan.description}</p>
              <div className="mt-5 space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    <Check className="mt-0.5 h-4 w-4 text-emerald-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <ButtonLink to="/contact?type=school" className="mt-6" variant="secondary">
                Kerko Oferte
              </ButtonLink>
            </Card>
          ))}
        </div>
      </div>
    </PageFrame>
  );
}

function ManualInfo({ label, value, onCopy }: { label: string; value: string; onCopy: (value: string) => void }) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
      <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">{label}</p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="break-all text-sm font-bold text-slate-950 dark:text-white">{value}</p>
        <Button type="button" variant="ghost" size="sm" onClick={() => onCopy(value)} icon={<Copy className="h-4 w-4" />}>
          Kopjo
        </Button>
      </div>
    </div>
  );
}

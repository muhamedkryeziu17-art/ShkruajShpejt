import { CalendarDays, CreditCard, Mail, RefreshCcw } from "lucide-react";
import { Button, ButtonLink } from "../components/Button";
import { Card, SectionHeader } from "../components/Card";
import { PageFrame } from "../components/PageFrame";
import { getPlanLabel } from "../lib/billingPlans";
import { mailTo } from "../lib/legal";
import { useAuth } from "../state/AuthProvider";
import { useBilling } from "../state/BillingProvider";

export function BillingPage() {
  const { session } = useAuth();
  const { billing, loading, refresh } = useBilling();

  if (!session) {
    return (
      <PageFrame>
        <SectionHeader title="Pagesat" description="Kycu per te pare planin dhe statusin e abonimit." />
        <Card>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">Plani dhe faturimi shfaqen vetem per perdoruesit e kycur.</p>
          <ButtonLink to="/login" className="mt-5">Kycu me Google</ButtonLink>
        </Card>
      </PageFrame>
    );
  }

  return (
    <PageFrame>
      <SectionHeader title="Pagesat" description="Menaxho planin, statusin dhe qasjen Pro." />

      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-600 dark:text-cyan-200">
              <CreditCard className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold uppercase text-slate-500 dark:text-slate-300">Plani aktual</p>
              <h2 className="text-2xl font-black text-slate-950 dark:text-white">{getPlanLabel(billing.plan)}</h2>
            </div>
          </div>

          <div className="mt-6 grid gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <InfoRow label="Statusi" value={billing.status} />
            <InfoRow label="Rinovohet me" value={billing.currentPeriodEnd ? formatDate(billing.currentPeriodEnd) : billing.lifetime ? "Lifetime" : "Nuk ka"} />
            <InfoRow label="Qasje Pro" value={billing.isPro ? "Aktive" : "Jo aktive"} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button type="button" variant="secondary" onClick={() => refresh()} disabled={loading} icon={<RefreshCcw className="h-4 w-4" />}>
              Rifresko
            </Button>
            <ButtonLink to="/pricing">Perditeso planin</ButtonLink>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-black text-slate-950 dark:text-white">Menaxhimi</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Portali i pagesave aktivizohet pasi te konfigurohet Paddle ose Lemon Squeezy. Deri atehere, kontakto supportin per qasje Pro ose ndryshim plani.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button type="button" variant="secondary" icon={<CalendarDays className="h-4 w-4" />} onClick={() => alert("Menaxhimi i pageses aktivizohet pasi te konfigurohet provider-i.")}>
              Menaxho pagesen
            </Button>
            <a
              href={mailTo("Billing ShkruajShpejt")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-300/70 bg-white/80 px-4 text-sm font-semibold text-slate-900 shadow-soft transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/10 dark:text-white"
            >
              <Mail className="h-4 w-4" />
              Kontakt supporti
            </a>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200/70 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
            <p className="text-sm font-bold text-slate-800 dark:text-white">Feature aktive</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {billing.features.length ? billing.features.map((feature) => (
                <span key={feature} className="rounded-xl bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-700 dark:text-emerald-200">
                  {feature}
                </span>
              )) : (
                <span className="text-sm text-slate-500 dark:text-slate-300">Nuk ka feature Pro aktive.</span>
              )}
            </div>
          </div>
        </Card>
      </div>
    </PageFrame>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/70 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
      <span>{label}</span>
      <span className="font-black text-slate-950 dark:text-white">{value}</span>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("sq-AL", { dateStyle: "medium" }).format(new Date(value));
}

import { Lock } from "lucide-react";
import { ButtonLink } from "./Button";
import { Card } from "./Card";

export function Paywall({ onContinue }: { onContinue?: () => void }) {
  return (
    <Card className="mx-auto max-w-2xl text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-200">
        <Lock className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-2xl font-black text-slate-950 dark:text-white">Merr Pro</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
        Shkyc statistika te avancuara, mesime pa limit dhe analize te tasteve te dobeta.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <ButtonLink to="/pricing">Shiko Planet</ButtonLink>
        {onContinue ? (
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-300/70 bg-white/80 px-4 text-sm font-semibold text-slate-900 shadow-soft transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/10 dark:text-white"
          >
            Vazhdo Falas
          </button>
        ) : (
          <ButtonLink to="/dashboard" variant="secondary">Vazhdo Falas</ButtonLink>
        )}
      </div>
    </Card>
  );
}

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { TERMS_VERSION, PRIVACY_VERSION } from "../config/legal";
import { useAuth } from "../state/AuthProvider";
import { useLegalAcceptance } from "../state/LegalAcceptanceProvider";
import { Button } from "./Button";
import { Card } from "./Card";

const publicPaths = new Set([
  "/",
  "/login",
  "/privacy",
  "/terms",
  "/refund",
  "/contact",
  "/delete-account",
  "/about"
]);

export function isPublicLegalPath(pathname: string) {
  return publicPaths.has(pathname);
}

export function TermsAcceptanceGate() {
  const { session, signOut } = useAuth();
  const { loading, accepting, error, mustAcceptTerms, refresh, acceptLatestTerms } = useLegalAcceptance();
  const [checked, setChecked] = useState(false);
  const location = useLocation();

  if (!session || isPublicLegalPath(location.pathname)) {
    return null;
  }

  if (loading) {
    return (
      <BlockingLayer>
        <Card className="max-w-lg">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Duke kontrolluar kushtet...</p>
        </Card>
      </BlockingLayer>
    );
  }

  if (error && !mustAcceptTerms) {
    return (
      <BlockingLayer>
        <Card className="max-w-lg">
          <h2 className="text-xl font-black text-slate-950 dark:text-white">Kushtet nuk u verifikuan</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{error}</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button type="button" onClick={() => void refresh()}>Provo perseri</Button>
            <Button type="button" variant="secondary" onClick={() => void signOut()}>Dil nga llogaria</Button>
          </div>
        </Card>
      </BlockingLayer>
    );
  }

  if (!mustAcceptTerms) {
    return null;
  }

  async function accept() {
    if (!checked || accepting) return;
    await acceptLatestTerms();
  }

  return (
    <BlockingLayer>
      <Card className="max-w-2xl">
        <div className="flex items-start gap-4">
          <span className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-600 dark:text-cyan-200">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-300">Versioni {TERMS_VERSION}</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">Kushtet dhe Rregullat</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Per te vazhduar, duhet te pranosh Kushtet dhe Rregullat dhe Politiken e Privatise.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold">
          <Link className="rounded-2xl bg-slate-900/5 px-4 py-2 text-cyan-700 dark:bg-white/10 dark:text-cyan-200" to="/terms">
            Lexo Kushtet
          </Link>
          <Link className="rounded-2xl bg-slate-900/5 px-4 py-2 text-cyan-700 dark:bg-white/10 dark:text-cyan-200" to="/privacy">
            Lexo Politiken e Privatise
          </Link>
        </div>

        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/70 p-4 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
          <input
            type="checkbox"
            checked={checked}
            onChange={(event) => setChecked(event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-400"
          />
          <span>
            Pranoj Kushtet dhe Rregullat dhe Politiken e Privatise.
            <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
              Kushtet: {TERMS_VERSION} / Privatesia: {PRIVACY_VERSION}
            </span>
          </span>
        </label>

        {error ? (
          <p className="mt-4 rounded-2xl border border-rose-300/70 bg-rose-50 p-3 text-sm font-semibold text-rose-700 dark:border-rose-400/30 dark:bg-rose-400/10 dark:text-rose-200">
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button type="button" onClick={accept} disabled={!checked || accepting}>
            {accepting ? "Duke ruajtur..." : "Pranoj dhe vazhdo"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => void signOut()}>
            Dil nga llogaria
          </Button>
        </div>
      </Card>
    </BlockingLayer>
  );
}

function BlockingLayer({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xl">
      {children}
    </div>
  );
}

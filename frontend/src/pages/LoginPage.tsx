import { Chrome } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, ButtonLink } from "../components/Button";
import { Card, SectionHeader } from "../components/Card";
import { PageFrame } from "../components/PageFrame";
import { useAuth } from "../state/AuthProvider";

export function LoginPage() {
  const { signInWithGoogle, isConfigured } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleGoogle() {
    setLoading(true);
    setError("");
    if (!isConfigured) {
      setError("Hyrja me Google nuk eshte lidhur ende. Ploteso te dhenat e Supabase ne frontend/.env.");
      setLoading(false);
      return;
    }

    try {
      await signInWithGoogle();
    } catch (err) {
      setError(formatLoginError(err));
      setLoading(false);
    }
  }

  return (
    <PageFrame className="grid place-items-center">
      <div className="w-full max-w-xl">
        <SectionHeader title="Hyr ne llogari" description="Ruaj rezultatet, mesimet dhe statistikat me Supabase Auth." />
        <Card className="p-6 sm:p-8">
          <div className="mb-6 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-ink shadow-glow ring-1 ring-white/20">
            <img src="/shkruajshpejt-icon-512.png" alt="" className="h-full w-full object-cover" />
          </div>
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">ShkruajShpejt</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Mund te vazhdosh edhe si mysafir, por progresi ruhet vetem pas hyrjes.</p>

          {error ? (
            <div className="mt-5 rounded-2xl border border-rose-300/70 bg-rose-50 p-4 text-sm font-semibold text-rose-700 dark:border-rose-400/30 dark:bg-rose-400/10 dark:text-rose-200">
              {error}
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button type="button" onClick={handleGoogle} disabled={loading} icon={<Chrome className="h-4 w-4" />}>
              {loading ? "Duke hapur..." : "Kycu me Google"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate("/test")}>
              Vazhdo si mysafir
            </Button>
          </div>

          <div className="mt-6 border-t border-slate-200/70 pt-5 text-sm text-slate-600 dark:border-white/10 dark:text-slate-300">
            <ButtonLink to="/lessons" variant="ghost" className="px-0">
              Shiko Mesimet
            </ButtonLink>
          </div>
        </Card>
      </div>
    </PageFrame>
  );
}

function formatLoginError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes("Unsupported provider") || message.includes("provider is not enabled")) {
    return "Google nuk eshte aktivizuar ne Supabase. Aktivizo Google te Auth Providers.";
  }

  return "Kycu me Google deshtoi. Kontrollo Supabase dhe provo perseri.";
}

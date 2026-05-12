import { LogOut, Shield, UserCircle } from "lucide-react";
import { Button, ButtonLink } from "../components/Button";
import { Card, SectionHeader } from "../components/Card";
import { PageFrame } from "../components/PageFrame";
import { ThemeToggle } from "../components/ThemeToggle";
import { apiUrl } from "../lib/api";
import { hasSupabaseConfig } from "../lib/supabase";
import { useAuth } from "../state/AuthProvider";

export function SettingsPage() {
  const { user, signOut } = useAuth();
  const name = (user?.user_metadata?.full_name as string | undefined) || user?.email?.split("@")[0] || "mysafir";

  return (
    <PageFrame>
      <SectionHeader title="Profili" description="Menaxho temen, hyrjen dhe lidhjet e aplikacionit." />

      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <div className="flex items-center gap-4">
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url as string} alt="Foto profili" className="h-16 w-16 rounded-2xl object-cover" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-200">
                <UserCircle className="h-8 w-8" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-black text-slate-950 dark:text-white">{name}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-300">{user?.email ?? "Mysafir"}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {user ? (
              <Button type="button" variant="danger" onClick={signOut} icon={<LogOut className="h-4 w-4" />}>
                Dil nga llogaria
              </Button>
            ) : (
              <ButtonLink to="/login">Kycu me Google</ButtonLink>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-black text-slate-950 dark:text-white">Cilesimet</h2>
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/70 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
              <div>
                <p className="font-bold text-slate-800 dark:text-white">Tema</p>
                <p className="text-sm text-slate-500 dark:text-slate-300">Nderro mes pamjes se erret dhe te ndritur.</p>
              </div>
              <ThemeToggle />
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-500" />
                <p className="font-bold text-slate-800 dark:text-white">Lidhjet</p>
              </div>
              <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
                <p>API: {apiUrl}</p>
                <p>Supabase: {hasSupabaseConfig ? "Aktive" : "Mungon"}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
              <p className="font-bold text-slate-800 dark:text-white">Ligjore</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <ButtonLink to="/privacy" variant="secondary" size="sm">Privatesia</ButtonLink>
                <ButtonLink to="/terms" variant="secondary" size="sm">Kushtet</ButtonLink>
                <ButtonLink to="/refund" variant="secondary" size="sm">Rimbursimi</ButtonLink>
                <ButtonLink to="/contact" variant="secondary" size="sm">Kontakt</ButtonLink>
                <ButtonLink to="/delete-account" variant="secondary" size="sm">Fshi llogarine</ButtonLink>
                <ButtonLink to="/settings/billing" variant="secondary" size="sm">Pagesat</ButtonLink>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PageFrame>
  );
}

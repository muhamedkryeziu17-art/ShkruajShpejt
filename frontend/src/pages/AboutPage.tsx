import { Keyboard, Mail, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, SectionHeader } from "../components/Card";
import { PageFrame } from "../components/PageFrame";
import { mailTo, supportEmail } from "../lib/legal";

const values = [
  {
    title: "Shpejtesi me kontroll",
    body: "Testet matin WPM, saktesi, gabime dhe ritmin e shkrimit pa e bere ushtrimin te rende."
  },
  {
    title: "Mesim me hapa",
    body: "Mesimet jane ndare ne grupe qe ndihmojne rreshtin baze, tastet e dobeta, bigramet dhe fjali te plota."
  },
  {
    title: "Progres i qarte",
    body: "User-at e kycur mund te ruajne rezultate, te shohin statistika dhe te ndjekin permiresimin me kohe."
  }
];

export function AboutPage() {
  return (
    <PageFrame>
      <SectionHeader
        title="About"
        description="Informata per ShkruajShpejt, supportin dhe qellimin e app-it."
      />

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden">
          <div className="relative rounded-2xl border border-white/20 bg-ink p-6 text-white shadow-glow">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.32),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.26),transparent_36%)]" />
            <div className="relative">
              <span className="inline-flex rounded-2xl bg-white/10 p-3 text-cyan-100">
                <Keyboard className="h-6 w-6" />
              </span>
              <h1 className="mt-5 text-3xl font-black tracking-normal sm:text-4xl">ShkruajShpejt</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200">
                ShkruajShpejt eshte app per te mesuar shkrim me te shpejte dhe me te sakte. App-i kombinon teste, mesime,
                statistika, tastet e dobeta dhe ushtrime te fokusuara per perdorues qe duan progres real.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {values.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200/70 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
                <h2 className="text-sm font-black text-slate-950 dark:text-white">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.body}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-5">
          <Card>
            <div className="flex items-start gap-3">
              <span className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-600 dark:text-cyan-200">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold uppercase text-slate-500 dark:text-slate-300">Support</p>
                <h2 className="mt-1 text-xl font-black text-slate-950 dark:text-white">Na kontakto</h2>
                <a className="mt-3 inline-flex break-all text-sm font-black text-cyan-700 dark:text-cyan-200" href={mailTo("Support ShkruajShpejt")}>
                  {supportEmail}
                </a>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-3">
              <span className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-200">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold uppercase text-slate-500 dark:text-slate-300">Vendodhja</p>
                <h2 className="mt-1 text-xl font-black text-slate-950 dark:text-white">Prizren / Kosovo</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  App-i ndertohet per perdorues shqipfoles dhe per kedo qe do te ushtroje tastiere me tekst latin.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-3">
              <span className="rounded-2xl bg-violet-500/10 p-3 text-violet-600 dark:text-violet-200">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold uppercase text-slate-500 dark:text-slate-300">Privatesi</p>
                <h2 className="mt-1 text-xl font-black text-slate-950 dark:text-white">Te dhenat e tua</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Rezultatet ruhen vetem kur je i kycur. Mysafiret mund te ushtrojne pa ruajtje te perhershme.
                </p>
                <Link className="mt-3 inline-flex text-sm font-black text-cyan-700 dark:text-cyan-200" to="/privacy">
                  Shiko politiken
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card className="mt-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-black uppercase text-slate-500 dark:text-slate-300">
              <Sparkles className="h-4 w-4 text-cyan-500" />
              Qellimi
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              Qellimi eshte te krijohet nje trainer modern per shkrim, me dizajn te paster, matje te sakta dhe ushtrime qe e bejne progresin me te lehte per tu ndjekur.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-ink px-4 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 dark:bg-white dark:text-ink"
          >
            Kontakt
          </Link>
        </div>
      </Card>
    </PageFrame>
  );
}

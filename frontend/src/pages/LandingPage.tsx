import { ArrowRight, BarChart3, Clock, Flame, Gauge, ShieldCheck } from "lucide-react";
import { AnimatedGradient } from "../components/AnimatedGradient";
import { ButtonLink } from "../components/Button";
import { Card } from "../components/Card";
import { FloatingKeys } from "../components/FloatingKeys";
import { PageFrame } from "../components/PageFrame";
import { StatCard } from "../components/StatCard";

export function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden">
        <AnimatedGradient />
        <FloatingKeys />
        <PageFrame className="relative flex min-h-[calc(100vh-5rem)] items-center py-10">
          <div className="grid w-full items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-black leading-[1.02] tracking-normal text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
                Mesohu te shkruash me shpejt
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700 dark:text-slate-200">
                Teste, mesime dhe statistika per te permiresuar shpejtesine dhe saktesine tende.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink to="/test" size="lg" icon={<ArrowRight className="h-5 w-5" />}>
                  Fillo Tani
                </ButtonLink>
                <ButtonLink to="/lessons" size="lg" variant="secondary">
                  Shiko Mesimet
                </ButtonLink>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard label="WPM" value="72" icon={<Gauge className="h-5 w-5" />} />
                <StatCard label="Saktesia" value="96%" icon={<ShieldCheck className="h-5 w-5" />} />
                <StatCard label="Koha" value="10m" icon={<Clock className="h-5 w-5" />} />
                <StatCard label="Seria Ditore" value="12" icon={<Flame className="h-5 w-5" />} />
              </div>
            </div>

            <Card className="relative overflow-hidden p-5 sm:p-6">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
              <div className="relative">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-300">Test i Shpejte</p>
                    <h2 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">Ritem i qarte</h2>
                  </div>
                  <BarChart3 className="h-8 w-8 text-cyan-500" />
                </div>
                <div className="space-y-3 rounded-2xl border border-slate-200/70 bg-white/65 p-4 dark:border-white/10 dark:bg-white/5">
                  {["une jam duke mesuar", "te shkruaj me shpejt", "dhe me sakte cdo dite"].map((line, index) => (
                    <div key={line} className="flex flex-wrap gap-1 text-xl font-bold">
                      {line.split("").map((char, charIndex) => (
                        <span
                          key={`${char}-${charIndex}`}
                          className={[
                            "rounded-md px-0.5",
                            index === 0 ? "text-emerald-500" : "",
                            index === 1 && charIndex < 8 ? "text-emerald-500" : "",
                            index === 1 && charIndex === 8 ? "bg-cyan-500/20 text-slate-950 dark:text-white" : "",
                            index === 2 ? "text-slate-400 dark:text-slate-500" : ""
                          ].join(" ")}
                        >
                          {char === " " ? String.fromCharCode(160) : char}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {["A", "S", "D", "F", "J", "K", "L", "Hapesire", "Hyr"].map((key) => (
                    <div key={key} className="rounded-2xl border border-slate-200/70 bg-white/70 px-3 py-3 text-center text-sm font-black text-slate-700 shadow-soft dark:border-white/10 dark:bg-white/10 dark:text-white">
                      {key}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </PageFrame>
      </section>

      <section className="border-y border-slate-200/70 bg-white/65 py-12 dark:border-white/10 dark:bg-white/[0.03]">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          <Card>
            <h3 className="text-lg font-bold text-slate-950 dark:text-white">Teste me kohe</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Zgjidh kohezgjatje, nivel dhe kategori per te matur ritmin tend real.</p>
          </Card>
          <Card>
            <h3 className="text-lg font-bold text-slate-950 dark:text-white">Mesime te strukturuara</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Ndiq rreshtat e tastieres, synimet dhe progresin deri ne perfundim.</p>
          </Card>
          <Card>
            <h3 className="text-lg font-bold text-slate-950 dark:text-white">Statistika te qarta</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Shiko WPM, saktesi, gabime, seri ditore dhe tastet qe kerkojne pune.</p>
          </Card>
        </div>
      </section>
    </div>
  );
}

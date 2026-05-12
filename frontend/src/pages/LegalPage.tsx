import { Mail, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, SectionHeader } from "../components/Card";
import { PageFrame } from "../components/PageFrame";
import { legalUrls, mailTo, supportEmail } from "../lib/legal";

type LegalSection = {
  title: string;
  body: string[];
};

const updatedAt = "11 maj 2026";

const privacySections: LegalSection[] = [
  {
    title: "Statusi i dokumentit",
    body: [
      "Kjo Politike e Privatesise eshte draft per ShkruajShpejt dhe duhet te rishikohet para publikimit publik.",
      "Kjo faqe nuk eshte keshille ligjore. Ajo duhet te pershtatet me menyren reale si aplikacioni trajton te dhenat."
    ]
  },
  {
    title: "Te dhenat qe mund te mbledhim",
    body: [
      "Kur kycesh me Google, mund te ruajme email, emer, dhe avatar nese keto jepen nga Google.",
      "Kur perdor testet dhe mesimet, mund te ruajme rezultatet e shkrimit, WPM, saktesi, gabime, tastet e dobeta, perparim mesimi, statistika ditore dhe historikun e ushtrimeve.",
      "Mysafiret mund ta perdorin aplikacionin pa ruajtje te perhershme te progresit."
    ]
  },
  {
    title: "Si perdoren te dhenat",
    body: [
      "Te dhenat perdoren per te ofruar hyrje ne llogari, ruajtje progresi, statistika, mesime, testim shkrimi dhe ushtrime te personalizuara.",
      "Te dhenat mund te perdoren per te permiresuar stabilitetin, sigurine dhe pervojen e aplikacionit."
    ]
  },
  {
    title: "Ofrues te paleve te treta",
    body: [
      "Supabase perdoret per autentikim, databaze dhe ruajtje te profilit/progresit.",
      "Google perdoret si ofrues hyrjeje kur zgjedh Kycu me Google.",
      "Nese shtohen pagesa ose abonime me vone, ofruesi i pagesave do te shtohet ne kete politike para publikimit.",
      "Nese shtohen crash reports ose analytics me vone, kjo politike dhe store disclosures duhet te perditesohen."
    ]
  },
  {
    title: "Siguria dhe ruajtja",
    body: [
      "Synimi eshte qe te dhenat te dergohen me lidhje te sigurta HTTPS.",
      "Ruajme vetem te dhenat qe duhen per llogarine, progresin dhe funksionet kryesore te aplikacionit."
    ]
  },
  {
    title: "Fshirja e te dhenave",
    body: [
      `Mund te kerkosh fshirjen e te dhenave duke derguar email ne ${supportEmail}.`,
      "Disa te dhena faturimi ose ligjore mund te ruhen nese kerkohet nga ligji ose nga ofruesit e pagesave."
    ]
  }
];

const termsSections: LegalSection[] = [
  {
    title: "Statusi i dokumentit",
    body: [
      "Keto Kushte Sherbimi jane draft per ShkruajShpejt dhe duhet te rishikohen para publikimit publik.",
      "Duke perdorur aplikacionin, pranon keto kushte ne masen qe zbatohen."
    ]
  },
  {
    title: "Perdorimi i pranueshem",
    body: [
      "Nuk lejohet perdorimi i aplikacionit per abuzim, sulme, kopjim te paautorizuar, nderhyrje ne sistem, ose veprime qe demtojne sherbimin.",
      "Duhet te respektosh ligjet dhe rregullat qe zbatohen ne vendin tend."
    ]
  },
  {
    title: "Llogaria dhe mysafiret",
    body: [
      "Je pergjegjes per sigurine e llogarise tende Google dhe pajisjeve ku perdor aplikacionin.",
      "Mysafiret mund te ushtrojne, por progresi i tyre nuk ruhet ne menyre te perhershme.",
      "Perdoruesit e kycur mund te ruajne rezultate, mesime, statistika dhe progres."
    ]
  },
  {
    title: "Rezultatet dhe permiresimi",
    body: [
      "ShkruajShpejt ofron mjete ushtrimi, por nuk garanton rritje te caktuar te shpejtesise ose saktesise.",
      "Rezultatet varen nga pajisja, praktika, fokusi dhe menyra e perdorimit."
    ]
  },
  {
    title: "Planet me pagese",
    body: [
      "Nese shtohen plane me pagese, cmimet, anulimet dhe rimbursimet do te shfaqen para blerjes.",
      "Planet mund te perfshijne Pro Mujor, Pro Vjetor, blerje Lifetime dhe plane per shkolla.",
      "Blerja Lifetime jep qasje Pro sipas kushteve aktive te produktit dhe nuk eshte garanci qe cdo feature e ardhshme do te perfshihet pa kufizim.",
      "Per rimbursime shiko Politiken e Rimbursimit."
    ]
  },
  {
    title: "Pergjegjesia",
    body: [
      "Aplikacioni ofrohet si mjet ushtrimi dhe mund te kete nderprerje, gabime ose ndryshime.",
      "Kufizimi i pergjegjesise duhet te rishikohet nga keshilltar ligjor para publikimit."
    ]
  }
];

const refundSections: LegalSection[] = [
  {
    title: "Statusi i dokumentit",
    body: [
      "Kjo Politike Rimbursimi eshte draft dhe duhet te rishikohet para se te aktivizohen pagesat."
    ]
  },
  {
    title: "Blerjet ne web",
    body: [
      "Nese shtohen blerje ne web, ato do te trajtohen nga ofruesi i pagesave i zgjedhur per web, si Paddle, Lemon Squeezy ose ofrues tjeter.",
      "Abonimet Pro Mujor dhe Pro Vjetor rinovohen sipas kushteve qe shfaqen ne checkout.",
      "Blerja Lifetime eshte pagese nje here per qasje Pro sipas kushteve aktive ne momentin e blerjes.",
      `Per pyetje faturimi ne web, kontakto ${supportEmail}.`
    ]
  },
  {
    title: "Blerjet ne mobile",
    body: [
      "Nese shtohen abonime ose blerje ne iOS ose Android, rimbursimet trajtohen sipas rregullave te Apple App Store ose Google Play.",
      "Per blerje mobile, perdoruesi duhet te kerkoje rimbursim nga store ku eshte bere blerja."
    ]
  }
];

const deleteSections: LegalSection[] = [
  {
    title: "Si te kerkosh fshirje",
    body: [
      `Dergo email ne ${supportEmail} me subjektin Fshirje llogarie.`,
      "Perfshi email-in e llogarise qe perdor per ShkruajShpejt, qe te mund te gjejme te dhenat e tua."
    ]
  },
  {
    title: "Te dhena qe mund te fshihen",
    body: [
      "Mund te kerkohet fshirja e profilit, testeve te shkrimit, progresit te mesimeve, statistikave te tasteve, statistikave ditore dhe te dhenave te progresit.",
      "Nese shtohen pagesa me vone, statusi i abonimit mund te fshihet ose anonimizohet aty ku lejohet ligjerisht."
    ]
  },
  {
    title: "Te dhena qe mund te ruhen",
    body: [
      "Disa rekorde faturimi, sigurie ose ligjore mund te ruhen nese kerkohen nga ligji, store-t, ose ofruesit e pagesave.",
      "Ne pergjigje do te tregojme cfare u fshi dhe cfare nuk mund te fshihet menjehere."
    ]
  }
];

export function PrivacyPage() {
  return (
    <LegalLayout
      title="Politika e Privatesise"
      description="Draft per menyren si ShkruajShpejt mbledh, perdor dhe ruan te dhenat."
      sections={privacySections}
    />
  );
}

export function TermsPage() {
  return (
    <LegalLayout
      title="Kushtet e Sherbimit"
      description="Draft rregullash per perdorimin e ShkruajShpejt."
      sections={termsSections}
    />
  );
}

export function RefundPage() {
  return (
    <LegalLayout
      title="Politika e Rimbursimit"
      description="Draft per rimbursime ne web, App Store dhe Google Play."
      sections={refundSections}
    />
  );
}

export function DeleteAccountPage() {
  return (
    <LegalLayout
      title="Fshirja e Llogarise"
      description="Udhezime per kerkese fshirjeje te llogarise dhe te dhenave."
      sections={deleteSections}
      actionLabel="Dergo kerkese"
      actionHref={mailTo("Fshirje llogarie")}
    />
  );
}

export function ContactPage() {
  return (
    <PageFrame>
      <SectionHeader title="Kontakt" description="Na shkruaj per ndihme, raportim gabimi ose kerkesa per te dhena." />
      <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <Card className="space-y-5">
          <div className="flex items-start gap-3">
            <span className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-600 dark:text-cyan-200">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-black text-slate-950 dark:text-white">Email supporti</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Nuk ka forme kontakti ne backend per momentin. Perdore email-in me poshte.
              </p>
              <a
                className="mt-3 inline-flex font-bold text-cyan-700 dark:text-cyan-200"
                href={mailTo("Support ShkruajShpejt")}
                target="_blank"
                rel="noreferrer"
              >
                {supportEmail}
              </a>
            </div>
          </div>
          <a
            href={mailTo("Support ShkruajShpejt")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-ink px-4 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 dark:bg-white dark:text-ink"
          >
            Hap email
          </a>
        </Card>

        <Card>
          <h2 className="text-xl font-black text-slate-950 dark:text-white">Arsyet e kontaktit</h2>
          <div className="mt-4 grid gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            {["Llogaria", "Faturimi", "Raportim gabimi", "Fshirje te dhenash", "Feedback"].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200/70 bg-white/60 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                {item}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageFrame>
  );
}

function LegalLayout({
  title,
  description,
  sections,
  actionLabel,
  actionHref
}: {
  title: string;
  description: string;
  sections: LegalSection[];
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <PageFrame>
      <SectionHeader title={title} description={description} />
      <div className="grid gap-5 lg:grid-cols-[1fr_18rem]">
        <Card className="space-y-7">
          <div className="flex items-center gap-3 rounded-2xl border border-amber-300/40 bg-amber-100/70 p-4 text-amber-950 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-100">
            <ShieldCheck className="h-5 w-5 shrink-0" />
            <p className="text-sm leading-6">
              Ky dokument eshte draft dhe duhet te rishikohet para publikimit publik. Perditesuar: {updatedAt}.
            </p>
          </div>

          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-black text-slate-950 dark:text-white">{section.title}</h2>
              <div className="mt-3 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}

          {actionHref ? (
            <a
              href={actionHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-ink px-4 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 dark:bg-white dark:text-ink"
            >
              {actionLabel}
            </a>
          ) : null}
        </Card>

        <Card className="h-fit">
          <h2 className="text-lg font-black text-slate-950 dark:text-white">Lidhje ligjore</h2>
          <nav className="mt-4 grid gap-2 text-sm font-semibold">
            <Link className="rounded-2xl px-3 py-2 hover:bg-slate-900/5 dark:hover:bg-white/10" to="/privacy">
              Politika e Privatesise
            </Link>
            <Link className="rounded-2xl px-3 py-2 hover:bg-slate-900/5 dark:hover:bg-white/10" to="/terms">
              Kushtet e Sherbimit
            </Link>
            <Link className="rounded-2xl px-3 py-2 hover:bg-slate-900/5 dark:hover:bg-white/10" to="/refund">
              Politika e Rimbursimit
            </Link>
            <Link className="rounded-2xl px-3 py-2 hover:bg-slate-900/5 dark:hover:bg-white/10" to="/contact">
              Kontakt
            </Link>
            <Link className="rounded-2xl px-3 py-2 hover:bg-slate-900/5 dark:hover:bg-white/10" to="/delete-account">
              Fshirja e Llogarise
            </Link>
          </nav>
          <div className="mt-5 rounded-2xl border border-slate-200/70 bg-white/60 p-3 text-xs leading-5 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
            URL baze: {legalUrls.base}
          </div>
        </Card>
      </div>
    </PageFrame>
  );
}

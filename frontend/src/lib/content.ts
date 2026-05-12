export type Difficulty = "Lehte" | "Mesatar" | "Veshtire";

export type TestCategory =
  | "Fjale te zakonshme"
  | "Teknologji"
  | "Shkolle"
  | "Biznes"
  | "Kodim"
  | "Histori te shkurtra"
  | "Fjali te perziera";

export const durations = [
  { label: "30 sekonda", seconds: 30 },
  { label: "1 minute", seconds: 60 },
  { label: "2 minuta", seconds: 120 },
  { label: "3 minuta", seconds: 180 },
  { label: "5 minuta", seconds: 300 },
  { label: "10 minuta", seconds: 600 }
];

export const difficulties: Difficulty[] = ["Lehte", "Mesatar", "Veshtire"];

export const categories: TestCategory[] = [
  "Fjale te zakonshme",
  "Teknologji",
  "Shkolle",
  "Biznes",
  "Kodim",
  "Histori te shkurtra",
  "Fjali te perziera"
];

export const sampleText: Record<TestCategory, Record<Difficulty, string[]>> = {
  "Fjale te zakonshme": {
    Lehte: [
      "une ti ai ajo ne ju ata ato jam je eshte kemi keni kane",
      "sot mire pune dite kohe fjale tast ritem shpejt sakte qete",
      "dora majte dora djathte syte te teksti mendja te rreshti",
      "shkruaj pak ngadal por sakte pastaj rrit ritmin me kujdes"
    ],
    Mesatar: [
      "une jam duke mesuar te shkruaj me shpejt dhe me sakte",
      "dita nis me plan te qarte pune fokus dhe rithem te mire",
      "fjala e sakte vjen nga ushtrim i qete dhe vemendje e plote",
      "tastet levizin me kujdes kur mendja mban nje ritem te qendrueshem"
    ],
    Veshtire: [
      "perqendrimi i vazhdueshem, ritmi i barabarte dhe korrigjimi i menjehershem krijojne shkrim me te paster.",
      "kur nxitimi rritet, gabimet e vogla shumohen; prandaj ruaj distance, lexo perpara dhe mos humb kontrollin.",
      "seria 1, seria 2 dhe seria 3 matin saktesi, shpejtesi, gabime dhe qendrueshmeri ne cdo rresht.",
      "nje perdorues i kujdesshem dallon modelin e gabimeve, ndryshon ritmin dhe vazhdon pa u ndalur."
    ]
  },
  Teknologji: {
    Lehte: [
      "kompjuter telefon ekran tastier maus rrjet faqe app kod",
      "server klient skedar folder lidhje login profil foto email",
      "hap faqen ruaj te dhena dergo mesazh merr pergjigje",
      "programi punon shpejt kur kodi eshte i paster"
    ],
    Mesatar: [
      "kompjuteri eshte mjet i rendesishem per pune dhe mesim",
      "rrjeti ruan lidhjen mes ideve te ekipeve dhe sherbimeve moderne",
      "aplikacioni duhet te jete i shpejte i sigurt dhe i lehte per perdorim",
      "te dhenat ruhen me kujdes dhe lexohen nga sisteme te besueshme"
    ],
    Veshtire: [
      "arkitektura e aplikacionit lidh frontend, backend, databaze dhe autentikim ne nje rrjedhe te kontrolluar.",
      "monitorimi i vonesave, cache-i i zgjuar dhe indeksat e sakte e bejne sistemin me te qendrueshem.",
      "deploy-i prodhues kerkon variabla mjedisi, certifikata, migrime dhe kontroll te gabimeve para publikimit.",
      "kur API kthen status 401 ose 500, log-et, token-at dhe query-t duhet te analizohen me radhe."
    ]
  },
  Shkolle: {
    Lehte: [
      "liber fletore laps klase ore test mesim detyre nxenes",
      "lexo shkruaj meso pyet provo prape mbaj shenime",
      "sot mesoj fjale te reja dhe shkruaj me kujdes",
      "ne klase ka qetesi pune plan dhe kohe"
    ],
    Mesatar: [
      "nxenesi lexon detyren planifikon kohen dhe shkruan pergjigjen me kujdes",
      "mesuesi kerkon pune te rregullt saktesi dhe perseritje te qendrueshme",
      "biblioteka eshte vend i qete per lexim mesim dhe ide te reja",
      "projekti ne grup kerkon ndarje detyrash komunikim dhe pergjegjesi"
    ],
    Veshtire: [
      "gjate prezantimit, nxenesi duhet te shpjegoje burimet, metoden, perfundimin dhe arsyenimin kryesor.",
      "plani javor perfshin lexim, ushtrime, perseritje, testim dhe vleresim te qarte te rezultateve.",
      "kur detyra ka shume hapa, nda procesin ne pjese te vogla dhe kontrollo secilen per gabime.",
      "nje ese e mire ka hyrje te sakte, argumente te lidhura dhe mbyllje qe permbledh idene."
    ]
  },
  Biznes: {
    Lehte: [
      "shitje kosto fitim klient ekip takim plan pune",
      "raport cmim treg porosi kontrate afat pagese",
      "ekipi flet qarte dhe merr vendim me kohe",
      "klienti kerkon sherbim te shpejte dhe te sakte"
    ],
    Mesatar: [
      "ekipi vendos objektiva te qarta mat rezultatet dhe permireson procesin",
      "raporti ditor tregon shitje kosto klienta dhe hapa te ardhshem",
      "takimi i mire ka agjende te shkurter vendime te qarta dhe afate reale",
      "klienti vlereson sherbim te shpejte komunikim te hapur dhe zgjidhje te sakta"
    ],
    Veshtire: [
      "strategjia tremujore bashkon buxhetin, rritjen, rrezikun, tregun dhe pergjegjesite e secilit ekip.",
      "negociata kerkon degjim aktiv, propozim te matur, dokumentim te sakte dhe afat te pranueshem.",
      "kur marzhi bie nen plan, menaxheri kontrollon cmimet, furnizimin, shpenzimet dhe ciklin e pagesave.",
      "raporti ekzekutiv duhet te jete i shkurter, i verifikueshem dhe i lidhur me veprime konkrete."
    ]
  },
  Kodim: {
    Lehte: [
      "var let const file test build run fix log data",
      "funksion input output list map filter return value",
      "kodi lexohet me lehte kur emrat jane te qarte",
      "testi i vogel kap gabimin para deploy"
    ],
    Mesatar: [
      "programimi kerkon fokus logjike dhe praktike te vazhdueshme",
      "funksioni merr te dhena i kontrollon dhe kthen nje rezultat te lexueshem",
      "testet ndihmojne ekipin te gjeje gabime para se kodi te shkoje ne prodhim",
      "komponentet e vegjel jane me te lehte per lexim riperdorim dhe mirembajtje"
    ],
    Veshtire: [
      "const result = items.filter(item => item.active).map(item => item.name).join(', ');",
      "nese validimi deshton, API kthen 400; nese tokeni mungon, middleware kthen 401.",
      "refaktorizimi i kujdesshem ruan kontraten publike, teston rastet skajore dhe zvogelon dublikimin.",
      "debug-u i mire nis me riprodhim, log te qarte, hipoteze te vogel dhe ndryshim te kontrolluar."
    ]
  },
  "Histori te shkurtra": {
    Lehte: [
      "ana hapi deren dhe pa diten e re plot drite",
      "beni mori librin u ul prane dritares dhe lexoi",
      "nora shkroi tri fjale pastaj qeshi dhe vazhdoi",
      "ne fund te dites ekipi mbylli punen me qetesi"
    ],
    Mesatar: [
      "ne mengjes arta hapi laptopin dhe nisi te shkruaje nje plan per diten e re",
      "era e lehte levizi perdet ndersa ekipi mbaroi versionin e pare te projektit",
      "pas shkolles beni u ul prane dritares dhe praktikoi tastet per pesembedhjete minuta",
      "kur ora shenoi nente grupi dergoi raportin dhe ruajti te gjitha shenimet"
    ],
    Veshtire: [
      "ne stacionin e qete, arta numeronte minutat, kontrollonte mesazhet dhe mendonte per prezantimin.",
      "projekti dukej i veshtire ne fillim, por cdo prove zbuloi nje rruge me te thjeshte perpara.",
      "kur drita u fik per pak caste, ekipi vazhdoi punen me bateri dhe ruajti versionin final.",
      "pas nje dite te gjate, beni krahasoi rezultatet, shenoi gabimet dhe premtoi ushtrim me te rregullt."
    ]
  },
  "Fjali te perziera": {
    Lehte: [
      "shkruaj me qete dhe shiko tekstin para duarve",
      "nje fjale e sakte vlen me shume se nxitimi",
      "rreshti leviz ndersa ti mban ritmin tend",
      "gabimi tregon ku duhet me shume praktike"
    ],
    Mesatar: [
      "shkrimi i shpejte nuk vjen nga nxitimi por nga ritmi saktesia dhe qetesia",
      "nje test i shkurter cdo dite mund te tregoje perparim te qarte ne kohe",
      "kur gabimet perseriten sistemi sugjeron ushtrime te vogla per tastet e dobeta",
      "perdoruesi zgjedh kohe nivel dhe tekst pastaj fokusohet vetem te rreshti aktiv"
    ],
    Veshtire: [
      "ne 30 sekonda, qellimi nuk eshte vetem WPM i larte, por edhe saktesi mbi 95 perqind.",
      "ndrysho nivelin, krahaso gabimet, shiko tastet e dobeta dhe krijo nje plan ushtrimi me te mire.",
      "nese fjala e pare te ndal, mos e fshi krejt rreshtin; korrigjo, vazhdo dhe ruaj ritmin.",
      "testi i veshtire perzien shenja, fjale te gjata, numra dhe fjali qe kerkojne me shume fokus."
    ]
  }
};

export const commonBigrams = [
  "te",
  "ne",
  "me",
  "ke",
  "pa",
  "se",
  "la",
  "ra",
  "tr",
  "pr",
  "st",
  "sh",
  "th",
  "nj",
  "gj",
  "ll",
  "rr"
];

export function generateTestText(category: TestCategory, difficulty: Difficulty, wordsTarget = 150) {
  const source = sampleText[category][difficulty].join(" ").split(/\s+/);
  const multiplier = difficulty === "Lehte" ? 0.9 : difficulty === "Mesatar" ? 1.25 : 1.55;
  const target = Math.round(wordsTarget * multiplier);
  const words: string[] = [];

  for (let index = 0; words.length < target; index++) {
    words.push(source[index % source.length]);
  }

  return words.join(" ");
}

export function generateBigramText(rounds = 18) {
  const parts: string[] = [];
  for (let index = 0; index < rounds; index++) {
    for (const bigram of commonBigrams) {
      parts.push(bigram, `${bigram}a`, `a${bigram}`);
    }
  }
  return parts.join(" ");
}

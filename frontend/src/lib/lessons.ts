export type Lesson = {
  id: string;
  slug: string;
  title: string;
  description: string;
  targetKeys: string[];
  exerciseText: string;
  orderIndex: number;
  requiredAccuracy: number;
  requiredWpm: number;
  bestWpm: number;
  bestAccuracy: number;
  completed: boolean;
  attempts: number;
  unlocked: boolean;
  progress: number;
};

export const localLessons: Lesson[] = [
  {
    id: "local-rreshti-baze",
    slug: "rreshti-baze",
    title: "Rreshti baze: A S D F J K L",
    description: "Nderto kujtese muskulore me tastet e qendres.",
    targetKeys: ["a", "s", "d", "f", "j", "k", "l"],
    exerciseText: "a s d f j k l a s d f j k l fa la sa da ka ja al as ad af la ja ka fa",
    orderIndex: 1,
    requiredAccuracy: 90,
    requiredWpm: 12,
    bestWpm: 0,
    bestAccuracy: 0,
    completed: false,
    attempts: 0,
    unlocked: true,
    progress: 0
  },
  {
    id: "local-dora-e-majte",
    slug: "dora-e-majte",
    title: "Ushtrim me doren e majte",
    description: "Forco levizjet e dores se majte pa humbur saktesi.",
    targetKeys: ["q", "w", "e", "r", "t", "a", "s", "d", "f", "g", "z", "x", "c", "v", "b"],
    exerciseText: "as de fr gt sa fa da re te ve be ne me re sa da fa ga ta va ba",
    orderIndex: 2,
    requiredAccuracy: 90,
    requiredWpm: 14,
    bestWpm: 0,
    bestAccuracy: 0,
    completed: false,
    attempts: 0,
    unlocked: false,
    progress: 0
  },
  {
    id: "local-dora-e-djathte",
    slug: "dora-e-djathte",
    title: "Ushtrim me doren e djathte",
    description: "Balanco ritmin me doren e djathte.",
    targetKeys: ["y", "u", "i", "o", "p", "h", "j", "k", "l", "n", "m"],
    exerciseText: "ju ki lo po jo ku li mi ni mu nu hi ji ko lu po jo ki li mu",
    orderIndex: 3,
    requiredAccuracy: 90,
    requiredWpm: 14,
    bestWpm: 0,
    bestAccuracy: 0,
    completed: false,
    attempts: 0,
    unlocked: false,
    progress: 0
  },
  {
    id: "local-rreshti-i-siperm",
    slug: "rreshti-i-siperm",
    title: "Rreshti i siperm",
    description: "Praktiko levizje te shpejta drejt tastave te siperm.",
    targetKeys: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    exerciseText: "te ne me re po jo ku ti py ro we qi ui op te re ty ui po ne me",
    orderIndex: 4,
    requiredAccuracy: 91,
    requiredWpm: 16,
    bestWpm: 0,
    bestAccuracy: 0,
    completed: false,
    attempts: 0,
    unlocked: false,
    progress: 0
  },
  {
    id: "local-rreshti-i-poshtem",
    slug: "rreshti-i-poshtem",
    title: "Rreshti i poshtem",
    description: "Ushtrim per kthim te qarte nga rreshti i poshtem.",
    targetKeys: ["z", "x", "c", "v", "b", "n", "m"],
    exerciseText: "za xa ca va ba na ma me ne be ve ca xa za ma na ba va ca",
    orderIndex: 5,
    requiredAccuracy: 91,
    requiredWpm: 16,
    bestWpm: 0,
    bestAccuracy: 0,
    completed: false,
    attempts: 0,
    unlocked: false,
    progress: 0
  },
  {
    id: "local-numrat",
    slug: "numrat",
    title: "Numrat",
    description: "Shkruaj numra me ritem te qendrueshem.",
    targetKeys: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    exerciseText: "12 34 56 78 90 2026 15 30 45 60 120 300 5173 8080 12345",
    orderIndex: 6,
    requiredAccuracy: 92,
    requiredWpm: 15,
    bestWpm: 0,
    bestAccuracy: 0,
    completed: false,
    attempts: 0,
    unlocked: false,
    progress: 0
  },
  {
    id: "local-simbolet",
    slug: "simbolet",
    title: "Simbolet",
    description: "Meso simbole qe perdoren shpesh ne pune dhe kodim.",
    targetKeys: [".", ",", ";", "/", "-", "_", "@", "#", "!", "?"],
    exerciseText: "email@test.com api/v1 lista-item vlera_1 #tag !ok ?po fund. test, provim; kod",
    orderIndex: 7,
    requiredAccuracy: 92,
    requiredWpm: 15,
    bestWpm: 0,
    bestAccuracy: 0,
    completed: false,
    attempts: 0,
    unlocked: false,
    progress: 0
  },
  {
    id: "local-fjale-te-shkurtra",
    slug: "fjale-te-shkurtra",
    title: "Fjale te shkurtra",
    description: "Rrit shpejtesine me fjale te perdorura shpesh.",
    targetKeys: ["t", "e", "n", "m", "p", "r", "s", "h"],
    exerciseText: "une ti ne me pa po se sa te ke la ra rruga puna libri kodi testi ora",
    orderIndex: 8,
    requiredAccuracy: 93,
    requiredWpm: 20,
    bestWpm: 0,
    bestAccuracy: 0,
    completed: false,
    attempts: 0,
    unlocked: false,
    progress: 0
  },
  {
    id: "local-fjali-te-plota",
    slug: "fjali-te-plota",
    title: "Fjali te lehta",
    description: "Kalimi nga fjale te vecanta ne fjali te plota.",
    targetKeys: ["a", "e", "i", "o", "u", "n", "r", "t", "s", "h"],
    exerciseText: "une jam duke mesuar te shkruaj me shpejt dhe me sakte per pune shkolle dhe ide te reja",
    orderIndex: 9,
    requiredAccuracy: 94,
    requiredWpm: 22,
    bestWpm: 0,
    bestAccuracy: 0,
    completed: false,
    attempts: 0,
    unlocked: false,
    progress: 0
  },
  {
    id: "local-shpejtesi-saktesi",
    slug: "shpejtesi-saktesi",
    title: "Praktike per saktesi",
    description: "Mbyll ciklin me tekst me te gjate dhe fokus te larte.",
    targetKeys: ["a", "s", "d", "f", "j", "k", "l", "e", "r", "t", "n", "m"],
    exerciseText: "programimi kerkon fokus logjike dhe praktike te vazhdueshme kompjuteri eshte mjet i rendesishem per pune dhe mesim",
    orderIndex: 10,
    requiredAccuracy: 95,
    requiredWpm: 25,
    bestWpm: 0,
    bestAccuracy: 0,
    completed: false,
    attempts: 0,
    unlocked: false,
    progress: 0
  }
];

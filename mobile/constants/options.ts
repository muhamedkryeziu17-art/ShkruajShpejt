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
] as const;

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

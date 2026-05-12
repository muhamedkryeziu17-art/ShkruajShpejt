export type BillingPlan =
  | "free"
  | "pro_monthly"
  | "pro_yearly"
  | "lifetime"
  | "school_basic"
  | "school_pro"
  | "school_custom";

export type BillingFeature =
  | "advanced_stats"
  | "unlimited_lessons"
  | "weak_keys_analysis"
  | "bigram_advanced"
  | "custom_practice"
  | "premium_themes"
  | "certificates"
  | "cloud_sync";

export type BillingStatus = {
  plan: BillingPlan;
  status: string;
  isPro: boolean;
  lifetime: boolean;
  cancelAtPeriodEnd: boolean;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  features: BillingFeature[];
};

export type BillingPlanConfig = {
  id: BillingPlan;
  label: string;
  price: string;
  cadence: string;
  description: string;
  cta: string;
  highlighted?: boolean;
  contact?: boolean;
  features: string[];
};

export const proFeatures: BillingFeature[] = [
  "advanced_stats",
  "unlimited_lessons",
  "weak_keys_analysis",
  "bigram_advanced",
  "custom_practice",
  "premium_themes",
  "certificates",
  "cloud_sync"
];

export const billingPlans: BillingPlanConfig[] = [
  {
    id: "free",
    label: "Falas",
    price: "0 EUR",
    cadence: "gjithmone",
    description: "Per testim baze dhe ushtrim pa pagese.",
    cta: "Fillo Falas",
    features: ["Teste baze", "Mesime te limituara", "Statistika baze", "Mysafir", "Dark dhe light mode"]
  },
  {
    id: "pro_monthly",
    label: "Pro Mujor",
    price: "3.99 EUR",
    cadence: "ne muaj",
    description: "Per ushtrim serioz me analiza dhe mesime pa limit.",
    cta: "Perditeso ne Pro",
    features: ["Statistika te avancuara", "Mesime pa limit", "Analize e tasteve te dobeta", "Cloud sync"]
  },
  {
    id: "pro_yearly",
    label: "Pro Vjetor",
    price: "24.99 EUR",
    cadence: "ne vit",
    description: "Vlera me e mire per perdorim gjate vitit.",
    cta: "Merr Pro Vjetor",
    highlighted: true,
    features: ["Gjithcka ne Pro", "Kursim ndaj planit mujor", "Certifikata", "Tema premium"]
  },
  {
    id: "lifetime",
    label: "Lifetime",
    price: "49.99 EUR",
    cadence: "nje here",
    description: "Qasje Pro pa abonim mujor ose vjetor.",
    cta: "Merr Lifetime",
    features: ["Qasje e perhershme Pro", "Mesime pa limit", "Statistika te avancuara", "Cloud sync"]
  }
];

export const schoolPlans: BillingPlanConfig[] = [
  {
    id: "school_basic",
    label: "Basic School",
    price: "99 EUR",
    cadence: "ne vit",
    description: "Per klasa te vogla dhe mesues qe duan raporte baze.",
    cta: "Kerko Oferte",
    contact: true,
    features: ["Dashboard per mesues", "Raporte per nxenes", "Klasa dhe grupe"]
  },
  {
    id: "school_pro",
    label: "Pro School",
    price: "199 EUR",
    cadence: "ne vit",
    description: "Per shkolla qe duan ndjekje me te plote te progresit.",
    cta: "Kerko Oferte",
    contact: true,
    features: ["Gjithcka ne Basic", "Raporte me te avancuara", "Eksport CSV/PDF ne te ardhmen"]
  },
  {
    id: "school_custom",
    label: "Custom",
    price: "299 EUR+",
    cadence: "ne vit",
    description: "Per nevoja te personalizuara, klasa te medha ose organizata.",
    cta: "Kerko Oferte",
    contact: true,
    features: ["Paketa sipas nevojes", "Prioritet supporti", "Integrime ne te ardhmen"]
  }
];

export function isProUser(subscription?: BillingStatus | null) {
  return Boolean(subscription?.isPro);
}

export function hasFeature(subscription: BillingStatus | null | undefined, feature: BillingFeature) {
  return Boolean(subscription?.features?.includes(feature));
}

export function getPlanLabel(plan: BillingPlan | string) {
  return [...billingPlans, ...schoolPlans].find((item) => item.id === plan)?.label ?? "Falas";
}

export function getUpgradeUrl(plan: BillingPlan = "pro_yearly") {
  return `/pricing?plan=${plan}`;
}

export function emptyBillingStatus(): BillingStatus {
  return {
    plan: "free",
    status: "free",
    isPro: false,
    lifetime: false,
    cancelAtPeriodEnd: false,
    currentPeriodStart: null,
    currentPeriodEnd: null,
    features: []
  };
}

import type { ProvinceSchema } from "@/schemas/types";
import { newBrunswickSchema } from "@/schemas/new-brunswick";
import { quebecSchema } from "@/schemas/quebec";

export type ProvinceContent = {
  slug: string;
  code: string;
  nameEn: string;
  nameFr: string;
  available: boolean;
  formCode?: string;
  priceCad?: number;
  /** Short line shown in hero badge / benefits fast-turnaround etc. */
  turnaround?: { en: string; fr: string };
  /** Bullet list shown in pricing card. */
  pricingFeatures?: { en: string[]; fr: string[] };
  /** Intake form schema; present iff the province is available and active. */
  schema?: ProvinceSchema;
};

export const provinces = {
  "new-brunswick": {
    slug: "new-brunswick",
    code: "NB",
    nameEn: "New Brunswick",
    nameFr: "Nouveau-Brunswick",
    available: true,
    formCode: "DL-1",
    priceCad: 80,
    turnaround: {
      en: "Form delivered by email within 24 hours",
      fr: "Formulaire livré par courriel dans les 24 heures",
    },
    pricingFeatures: {
      en: [
        "Complete your DL-1 driver medical questionnaire online",
        "Review by a licensed physician or nurse in New Brunswick",
        "Official signed DL-1 form delivered digitally",
        "Secure PDF emailed to you, ready to submit",
        "Same-day processing when you qualify",
        "PIPEDA-compliant, encrypted intake",
        "Support available 7 days a week",
      ],
      fr: [
        "Complétez votre questionnaire médical de conducteur DL-1 en ligne",
        "Révision par un médecin ou une infirmière autorisés au Nouveau-Brunswick",
        "Formulaire DL-1 signé officiellement et livré en format numérique",
        "PDF sécurisé envoyé par courriel, prêt à soumettre",
        "Traitement le jour même lorsque vous êtes admissible",
        "Dossier d'admission chiffré et conforme à la LPRPDE",
        "Support disponible 7 jours sur 7",
      ],
    },
    schema: newBrunswickSchema,
  },
  quebec: {
    slug: "quebec",
    code: "QC",
    nameEn: "Quebec",
    nameFr: "Québec",
    available: true,
    formCode: "M-28",
    priceCad: 199,
    turnaround: {
      en: "In-person visit and form completed within 72 hours",
      fr: "Visite en personne et formulaire complété dans les 72 heures",
    },
    pricingFeatures: {
      en: [
        "Complete your M-28 commercial driver medical questionnaire online",
        "Review by a licensed physician or nurse in Quebec",
        "In-person visit required for the vision (eye) examination",
        "Our clinic will call you within 72 hours to schedule your in-person appointment, depending on your availability",
        "Official signed M-28 form aligned with SAAQ requirements",
        "Secure PDF emailed to you, ready to submit",
        "Same-day processing when you qualify",
        "PIPEDA-compliant, encrypted intake",
        "Support available 7 days a week",
      ],
      fr: [
        "Complétez votre questionnaire médical de conducteur commercial M-28 en ligne",
        "Révision par un médecin ou une infirmière autorisés au Québec",
        "Une visite en personne est requise pour l'examen de la vision (yeux)",
        "Notre clinique vous appellera dans les 72 heures pour planifier votre rendez-vous en personne, selon vos disponibilités",
        "Formulaire M-28 signé officiellement, conforme aux exigences de la SAAQ",
        "PDF sécurisé envoyé par courriel, prêt à soumettre",
        "Traitement le jour même lorsque vous êtes admissible",
        "Dossier d'admission chiffré et conforme à la LPRPDE",
        "Support disponible 7 jours sur 7",
      ],
    },
    schema: quebecSchema,
  },
  ontario: { slug: "ontario", code: "ON", nameEn: "Ontario", nameFr: "Ontario", available: false },
  alberta: { slug: "alberta", code: "AB", nameEn: "Alberta", nameFr: "Alberta", available: false },
  "british-columbia": { slug: "british-columbia", code: "BC", nameEn: "British Columbia", nameFr: "Colombie-Britannique", available: false },
  manitoba: { slug: "manitoba", code: "MB", nameEn: "Manitoba", nameFr: "Manitoba", available: false },
  saskatchewan: { slug: "saskatchewan", code: "SK", nameEn: "Saskatchewan", nameFr: "Saskatchewan", available: false },
  "nova-scotia": { slug: "nova-scotia", code: "NS", nameEn: "Nova Scotia", nameFr: "Nouvelle-Écosse", available: false },
  "prince-edward-island": { slug: "prince-edward-island", code: "PE", nameEn: "Prince Edward Island", nameFr: "Île-du-Prince-Édouard", available: false },
  newfoundland: { slug: "newfoundland", code: "NL", nameEn: "Newfoundland and Labrador", nameFr: "Terre-Neuve-et-Labrador", available: false },
} as const satisfies Record<string, ProvinceContent>;

export type ProvinceSlug = keyof typeof provinces;
/** Provinces the site actively serves (have schema + pricing). */
export type ActiveProvinceSlug = {
  [K in ProvinceSlug]: typeof provinces[K] extends { schema: ProvinceSchema } ? K : never;
}[ProvinceSlug];

/** Ordered list for UI rendering. Insertion order preserved. */
export const provinceList: readonly ProvinceContent[] = Object.values(provinces);

export function getProvince(slug: string | null | undefined): ProvinceContent | null {
  if (!slug) return null;
  return (provinces as Record<string, ProvinceContent>)[slug] ?? null;
}

export function isValidProvince(slug: string | null | undefined): boolean {
  const p = getProvince(slug);
  return p != null && p.available && p.schema != null;
}

export function getProvinceSchema(slug: string | null | undefined): ProvinceSchema | null {
  return getProvince(slug)?.schema ?? null;
}

/** True iff this slug is a province we actively serve (has pricing + schema). */
export function isActiveProvince(slug: string | null | undefined): slug is ActiveProvinceSlug {
  const p = getProvince(slug);
  return p != null && p.available && p.schema != null && typeof p.priceCad === "number";
}

/** Parse `?province=` from URL into an active slug, or null. */
export function parseProvinceSearchParam(
  raw: string | string[] | null | undefined,
): ActiveProvinceSlug | null {
  const s = Array.isArray(raw) ? raw[0] : raw;
  if (!s || typeof s !== "string") return null;
  const n = s.trim().toLowerCase();
  return isActiveProvince(n) ? n : null;
}

export const HOME_PROVINCE_QUERY_KEY = "province";

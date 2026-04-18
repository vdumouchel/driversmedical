export const SITE_NAME = "DriversMedical.clinic";
export const SITE_DOMAIN = "driversmedical.clinic";
export const SITE_DESCRIPTION =
  "Licensed physicians and nurses help complete your provincial driver's medical form online. Most of the process is remote; some provinces require an in-person vision examination. Available across Canada.";

export const PROVINCES = [
  { slug: "new-brunswick", code: "NB", name: "New Brunswick", nameEn: "New Brunswick", nameFr: "Nouveau-Brunswick", available: true, formCode: "DL-1" },
  { slug: "quebec", code: "QC", name: "Quebec", nameEn: "Quebec", nameFr: "Québec", available: true, formCode: "M-28" },
  { slug: "ontario", code: "ON", name: "Ontario", nameEn: "Ontario", nameFr: "Ontario", available: false },
  { slug: "alberta", code: "AB", name: "Alberta", nameEn: "Alberta", nameFr: "Alberta", available: false },
  { slug: "british-columbia", code: "BC", name: "British Columbia", nameEn: "British Columbia", nameFr: "Colombie-Britannique", available: false },
  { slug: "manitoba", code: "MB", name: "Manitoba", nameEn: "Manitoba", nameFr: "Manitoba", available: false },
  { slug: "saskatchewan", code: "SK", name: "Saskatchewan", nameEn: "Saskatchewan", nameFr: "Saskatchewan", available: false },
  { slug: "nova-scotia", code: "NS", name: "Nova Scotia", nameEn: "Nova Scotia", nameFr: "Nouvelle-Écosse", available: false },
  { slug: "prince-edward-island", code: "PE", name: "Prince Edward Island", nameEn: "Prince Edward Island", nameFr: "Île-du-Prince-Édouard", available: false },
  { slug: "newfoundland", code: "NL", name: "Newfoundland and Labrador", nameEn: "Newfoundland and Labrador", nameFr: "Terre-Neuve-et-Labrador", available: false },
] as const;

export type ProvinceSlug = (typeof PROVINCES)[number]["slug"];

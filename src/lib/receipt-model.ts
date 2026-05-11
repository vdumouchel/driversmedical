import type { Transaction, User, Intake } from "@/db/schema";
import { brand } from "@/config/brand";
import { getProvince } from "@/config/provinces";
import { getProvinceTaxes } from "@/lib/province-taxes";
import { resolveLS } from "@/lib/i18n-utils";

// ─── Types ──────────────────────────────────────────────────────────────────

export type ReceiptTaxLine = {
  label: string;
  ratePct: string;
  amountFormatted: string;
};

export type ReceiptModel = {
  lang: string;
  isFr: boolean;

  siteName: string;
  siteEmail: string;
  fromLines: readonly string[];

  receiptNumber: string;
  dateFormatted: string;
  description: string;

  billToName: string;
  billToStreet: string | null;
  billToCityLine: string;
  billToEmail: string | null;
  billToPhone: string | null;

  subtotalFormatted: string;
  taxLines: ReceiptTaxLine[];
  totalFormatted: string;

  paidLine: string;
  paidDateFormatted: string | null;

  nextSteps: string | null;
  supportIntro: string;
  supportBody: string;

  /** Absolute URL to the web receipt — for "View receipt" links in emails. */
  receiptUrl: string;

  labels: {
    title: string;
    receiptNumber: string;
    date: string;
    from: string;
    billTo: string;
    description: string;
    amount: string;
    subtotal: string;
    total: string;
    amountPaid: string;
    whatHappensNext: string;
    printBtn: string;
  };
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmtMoney(cents: number, lang: string): string {
  return (cents / 100).toLocaleString(lang === "fr" ? "fr-CA" : "en-CA", {
    style: "currency",
    currency: "CAD",
  });
}

function fmtDate(d: Date | null, lang: string): string {
  if (!d) return "—";
  return d.toLocaleDateString(lang === "fr" ? "fr-CA" : "en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function cardBrandLabel(b: string | null): string {
  switch ((b ?? "").toLowerCase()) {
    case "visa":
      return "Visa";
    case "mastercard":
      return "Mastercard";
    case "amex":
      return "American Express";
    case "discover":
      return "Discover";
    default:
      return b ? b.charAt(0).toUpperCase() + b.slice(1) : "Card";
  }
}

function formatLicenseClass(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const m = /^class[_\s-]?(.+)$/i.exec(trimmed);
  if (m?.[1]) return m[1].toUpperCase();
  return trimmed;
}

// ─── Builder ────────────────────────────────────────────────────────────────

export function buildReceiptModel(
  txn: Transaction,
  user: User,
  intake: Intake | null,
  lang: string,
): ReceiptModel {
  const isFr = lang === "fr";
  const lk = isFr ? "fr" : "en";

  const province = getProvince(txn.provinceRequired);
  const provinceLabel = province
    ? isFr
      ? province.nameFr
      : province.nameEn
    : txn.provinceRequired;

  // ── Bill-to ─────────────────────────────────────────────────────────────
  const answers = (intake?.answers ?? {}) as Record<string, unknown>;
  const pickStr = (k: string): string | null => {
    const v = answers[k];
    return typeof v === "string" && v.trim() ? v : null;
  };
  const street = pickStr("address") ?? pickStr("street_address");
  const cityLine = (() => {
    const cityProv = [user.city, provinceLabel].filter(Boolean).join(", ");
    return [cityProv, user.postalCode].filter(Boolean).join(" ");
  })();

  // ── Tax lines ───────────────────────────────────────────────────────────
  const rawTaxes = getProvinceTaxes(txn.provinceRequired).map((t) => ({
    ...t,
    amountCents: Math.round(txn.subtotalAmount * t.rate),
  }));
  if (rawTaxes.length > 0) {
    const linesSum = rawTaxes.reduce((s, l) => s + l.amountCents, 0);
    const drift = txn.taxesTotalAmount - linesSum;
    if (drift !== 0) rawTaxes[rawTaxes.length - 1].amountCents += drift;
  }
  const taxLines: ReceiptTaxLine[] = rawTaxes.map((l) => ({
    label: `${isFr ? l.labelFr : l.label} (${parseFloat((l.rate * 100).toFixed(3))}%)`,
    ratePct: parseFloat((l.rate * 100).toFixed(3)).toString(),
    amountFormatted: fmtMoney(l.amountCents, lang),
  }));

  // ── Description line ────────────────────────────────────────────────────
  const meta = (txn.metadata ?? {}) as { formCode?: string; licenseClass?: string };
  const cls = formatLicenseClass(meta.licenseClass ?? null);
  const description = isFr
    ? `Formulaire médical de conducteur — ${provinceLabel}${meta.formCode ? ` (${meta.formCode})` : ""}${cls ? ` — Classe ${cls}` : ""}`
    : `Driver's medical form — ${provinceLabel}${meta.formCode ? ` (${meta.formCode})` : ""}${cls ? ` — Class ${cls}` : ""}`;

  // ── Paid line ───────────────────────────────────────────────────────────
  const paidLine =
    txn.paymentMethodBrand && txn.paymentMethodLast4
      ? isFr
        ? `Payé via ${cardBrandLabel(txn.paymentMethodBrand)} •••• ${txn.paymentMethodLast4}`
        : `Paid via ${cardBrandLabel(txn.paymentMethodBrand)} •••• ${txn.paymentMethodLast4}`
      : isFr
        ? "Payé"
        : "Paid";

  // ── Next-steps ──────────────────────────────────────────────────────────
  const patientPhone =
    pickStr("phone") ??
    pickStr("phone_number") ??
    pickStr("telephone") ??
    user.phoneNumber ??
    null;
  const selectedClinicId =
    typeof answers["clinic_selection"] === "string"
      ? (answers["clinic_selection"] as string)
      : null;
  const selectedClinic =
    selectedClinicId && province?.inPersonAppointments
      ? province.inPersonAppointments.find((c) => c.id === selectedClinicId) ?? null
      : null;
  const clinicName = selectedClinic ? resolveLS(selectedClinic.name, lang) : null;
  const clinicAddr = selectedClinic ? resolveLS(selectedClinic.address, lang) : null;

  const showInPerson = Boolean(
    clinicName && clinicAddr && patientPhone &&
    province?.inPersonAppointments && province.inPersonAppointments.length > 0,
  );
  const showDigital = txn.provinceRequired === "new-brunswick" && !showInPerson;

  let nextSteps: string | null = null;
  if (showInPerson && clinicName && clinicAddr && patientPhone) {
    nextSteps = isFr
      ? `Un administrateur de ${clinicName} (${clinicAddr}) vous appellera au ${patientPhone} dans les 72 heures pour planifier votre examen visuel en personne et finaliser votre formulaire.`
      : `An administrator from ${clinicName} (${clinicAddr}) will call you at ${patientPhone} within 72 hours to schedule your in-person eye examination and finalize your form.`;
  } else if (showDigital) {
    nextSteps = isFr
      ? `Votre paiement est confirmé. Un clinicien autorisé analysera votre questionnaire et vous enverra par courriel votre formulaire médical de conducteur signé en PDF sécurisé, habituellement dans les 24 heures. Vérifiez votre boîte de réception et le dossier pourriel.`
      : `Your payment is confirmed. A licensed clinician will review your questionnaire and email your signed driver medical form as a secure PDF, usually within 24 hours. Check your inbox and spam folder.`;
  }

  const supportHours = brand.contact.hoursLabel[lk];

  // ── Receipt URL ─────────────────────────────────────────────────────────
  const origin =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.RECEIPT_SITE_ORIGIN ??
    `https://${brand.siteDomain}`;
  const receiptUrl = `${origin}/${lang}/receipts/${txn.receiptNumber}`;

  return {
    lang,
    isFr,
    siteName: brand.siteName,
    siteEmail: brand.contact.email,
    fromLines: brand.address[lk],
    receiptNumber: txn.receiptNumber ?? "",
    dateFormatted: fmtDate(txn.paidAt ?? txn.createdAt, lang),
    description,
    billToName: `${user.firstName} ${user.lastName}`,
    billToStreet: street,
    billToCityLine: cityLine,
    billToEmail: user.email ?? null,
    billToPhone: user.phoneNumber ?? null,
    subtotalFormatted: fmtMoney(txn.subtotalAmount, lang),
    taxLines,
    totalFormatted: fmtMoney(txn.totalAmount, lang),
    paidLine,
    paidDateFormatted: txn.paidAt ? fmtDate(txn.paidAt, lang) : null,
    nextSteps,
    supportIntro: isFr ? "Besoin d'aide?" : "Need help?",
    supportBody: isFr
      ? `Écrivez-nous à ${brand.contact.email}. Disponibilité du soutien : ${supportHours}. Indiquez votre numéro de reçu ci-dessus pour que nous puissions vous aider plus vite.`
      : `Email us at ${brand.contact.email}. Support hours: ${supportHours}. Include your receipt number above so we can assist you faster.`,
    receiptUrl,
    labels: {
      title: isFr ? "Reçu" : "Receipt",
      receiptNumber: isFr ? "Numéro de reçu" : "Receipt number",
      date: "Date",
      from: isFr ? "De" : "From",
      billTo: isFr ? "Facturé à" : "Bill to",
      description: "Description",
      amount: isFr ? "Montant" : "Amount",
      subtotal: isFr ? "Sous-total" : "Subtotal",
      total: "Total",
      amountPaid: isFr ? "Montant payé" : "Amount paid",
      whatHappensNext: isFr ? "Ce qui se passe ensuite" : "What happens next",
      printBtn: isFr ? "Imprimer / Enregistrer en PDF" : "Print / Save as PDF",
    },
  };
}

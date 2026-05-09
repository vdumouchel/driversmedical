import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { transactions, intakes, users } from "@/db/schema";
import { brand } from "@/config/brand";
import { getProvince } from "@/config/provinces";
import { getProvinceTaxes } from "@/lib/province-taxes";
import { PrintButton } from "./print-button";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ lang: string; receiptNumber: string }>;
}

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

function brandColor(brand: string | null): string {
  switch ((brand ?? "").toLowerCase()) {
    case "visa":
      return "Visa";
    case "mastercard":
      return "Mastercard";
    case "amex":
      return "American Express";
    case "discover":
      return "Discover";
    default:
      return brand ? brand.charAt(0).toUpperCase() + brand.slice(1) : "Card";
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

export default async function ReceiptPage({ params }: PageProps) {
  const { lang, receiptNumber } = await params;
  const isFr = lang === "fr";

  const rows = await db
    .select({ txn: transactions, intake: intakes, user: users })
    .from(transactions)
    .leftJoin(intakes, eq(intakes.id, transactions.intakeId))
    .leftJoin(users, eq(users.id, transactions.userId))
    .where(eq(transactions.receiptNumber, receiptNumber))
    .limit(1);

  const row = rows[0];
  if (!row || !row.user) notFound();

  const txn = row.txn;
  const user = row.user;
  const intake = row.intake;
  const province = getProvince(txn.provinceRequired);
  const provinceLabel = province
    ? isFr
      ? province.nameFr
      : province.nameEn
    : txn.provinceRequired;

  // Bill-to address composed from the intake answers (street) + the user
  // record (city, postal). Province falls back to the form's province.
  const answers = (intake?.answers ?? {}) as Record<string, unknown>;
  const pickStr = (k: string): string | null => {
    const v = answers[k];
    return typeof v === "string" && v.trim() ? v : null;
  };
  const street = pickStr("address") ?? pickStr("street_address");
  // Canadian convention: "City, Province PostalCode" — comma between city
  // and province, single space between province and postal code.
  const cityLine = (() => {
    const cityProv = [user.city, provinceLabel].filter(Boolean).join(", ");
    return [cityProv, user.postalCode].filter(Boolean).join(" ");
  })();

  const clinicAddressLines = brand.address[isFr ? "fr" : "en"];
  const selectedClinicId =
    typeof answers["clinic_selection"] === "string"
      ? (answers["clinic_selection"] as string)
      : null;
  const selectedClinic =
    selectedClinicId && province?.inPersonAppointments
      ? province.inPersonAppointments.find((c) => c.id === selectedClinicId) ?? null
      : null;
  const selectedClinicName = selectedClinic
    ? isFr
      ? selectedClinic.name.fr
      : selectedClinic.name.en
    : null;
  const selectedClinicAddress = selectedClinic
    ? isFr
      ? selectedClinic.address.fr
      : selectedClinic.address.en
    : null;
  const patientPhone =
    pickStr("phone") ??
    pickStr("phone_number") ??
    pickStr("telephone") ??
    user.phoneNumber ??
    null;

  // Compute the tax breakdown from our shared province table — the source
  // of truth for what we charged and what shows on the receipt.
  const taxes = getProvinceTaxes(txn.provinceRequired);
  const taxLines = taxes.map((t) => ({
    ...t,
    amountCents: Math.round(txn.subtotalAmount * t.rate),
  }));
  // Reconcile any ±1¢ rounding drift between per-line and stored total: put
  // the leftover on the last line so subtotal + lines = totalAmount exactly.
  if (taxLines.length > 0) {
    const linesSum = taxLines.reduce((s, l) => s + l.amountCents, 0);
    const drift = txn.taxesTotalAmount - linesSum;
    if (drift !== 0) {
      taxLines[taxLines.length - 1].amountCents += drift;
    }
  }

  // ── Localized strings ────────────────────────────────────────────────────
  const t = isFr
    ? {
        title: "Reçu",
        receiptNumber: "Numéro de reçu",
        date: "Date",
        from: "De",
        billTo: "Facturé à",
        description: "Description",
        amount: "Montant",
        subtotal: "Sous-total",
        total: "Total",
        amountPaid: "Montant payé",
        paidVia: (b: string, last4: string) => `Payé via ${b} •••• ${last4}`,
        paidViaUnknown: "Payé",
        printBtn: "Imprimer / Enregistrer en PDF",
        whatHappensNext: "Ce qui se passe ensuite",
        nextStepsInPerson: (name: string, addr: string, ph: string) =>
          `Un administrateur de ${name} (${addr}) vous appellera au ${ph} dans les 72 heures pour planifier votre examen visuel en personne et finaliser votre formulaire.`,
        nextStepsDigital: () =>
          `Votre paiement est confirmé. Un clinicien autorisé analysera votre questionnaire et vous enverra par courriel votre formulaire DL-1 signé en PDF sécurisé, habituellement dans les 24 heures. Vérifiez votre boîte de réception et le dossier pourriel.`,
        supportContactIntro: "Besoin d'aide?",
        supportContactLines: (email: string, hours: string) =>
          `Écrivez-nous à ${email}. Disponibilité du soutien : ${hours}. Indiquez votre numéro de reçu ci-dessus pour que nous puissions vous aider plus vite.`,
        formLine: (p: string, code: string | null, cls: string | null) =>
          `Formulaire médical de conducteur — ${p}${code ? ` (${code})` : ""}${cls ? ` — Classe ${cls}` : ""}`,
      }
    : {
        title: "Receipt",
        receiptNumber: "Receipt number",
        date: "Date",
        from: "From",
        billTo: "Bill to",
        description: "Description",
        amount: "Amount",
        subtotal: "Subtotal",
        total: "Total",
        amountPaid: "Amount paid",
        paidVia: (b: string, last4: string) => `Paid via ${b} •••• ${last4}`,
        paidViaUnknown: "Paid",
        printBtn: "Print / Save as PDF",
        whatHappensNext: "What happens next",
        nextStepsInPerson: (name: string, addr: string, ph: string) =>
          `An administrator from ${name} (${addr}) will call you at ${ph} within 72 hours to schedule your in-person eye examination and finalize your form.`,
        nextStepsDigital: () =>
          `Your payment is confirmed. A licensed clinician will review your questionnaire and email your signed DL-1 form as a secure PDF, usually within 24 hours. Check your inbox and spam folder.`,
        supportContactIntro: "Need help?",
        supportContactLines: (email: string, hours: string) =>
          `Email us at ${email}. Support hours: ${hours}. Include your receipt number above so we can assist you faster.`,
        formLine: (p: string, code: string | null, cls: string | null) =>
          `Driver's medical form — ${p}${code ? ` (${code})` : ""}${cls ? ` — Class ${cls}` : ""}`,
      };

  const meta = (txn.metadata ?? {}) as { formCode?: string; licenseClass?: string };
  const readableLicenseClass = formatLicenseClass(meta.licenseClass ?? null);
  const description = t.formLine(
    provinceLabel,
    meta.formCode ?? null,
    readableLicenseClass
  );
  const shouldShowInPersonNextSteps = Boolean(
    selectedClinicName &&
      selectedClinicAddress &&
      patientPhone &&
      province?.inPersonAppointments &&
      province.inPersonAppointments.length > 0
  );

  const shouldShowDigitalNextSteps =
    txn.provinceRequired === "new-brunswick" && !shouldShowInPersonNextSteps;

  const paidLine =
    txn.paymentMethodBrand && txn.paymentMethodLast4
      ? t.paidVia(brandColor(txn.paymentMethodBrand), txn.paymentMethodLast4)
      : t.paidViaUnknown;

  const supportHours = brand.contact.hoursLabel[isFr ? "fr" : "en"];

  const whatsNextSupportBlock = (
    <div className="mt-4 border-t border-border pt-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {t.supportContactIntro}
      </p>
      <p className="mt-2 text-sm text-foreground leading-relaxed">
        {t.supportContactLines(brand.contact.email, supportHours)}
      </p>
    </div>
  );

  return (
    <>
      {/* Print-optimized styles. We avoid Tailwind's print: utilities here
          because the print stylesheet must override Tailwind's screen
          defaults (max-width, padding, etc.) deterministically. */}
      <style>{`
        @page { size: letter; margin: 0.5in; }
        @media print {
          html, body { background: white !important; }
          .no-print { display: none !important; }
          .receipt-shell {
            box-shadow: none !important;
            border: none !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-muted/30 px-4 py-10 print:bg-white print:p-0">
        {/* Floating Print button — hidden when actually printing. */}
        <div className="no-print mx-auto mb-6 flex max-w-3xl justify-end">
          <PrintButton label={t.printBtn} />
        </div>

        <article
          className="receipt-shell mx-auto max-w-3xl rounded-2xl border border-border bg-card p-10 shadow-sm print:rounded-none print:shadow-none"
          aria-label={t.title}
        >
          {/* Header */}
          <header className="mb-10 flex items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {brand.siteName}
              </h1>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t.title}
              </p>
              <p className="mt-1 font-mono text-sm font-semibold text-foreground">
                {txn.receiptNumber}
              </p>
              <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">
                {t.date}
              </p>
              <p className="mt-1 text-sm text-foreground">
                {fmtDate(txn.paidAt ?? txn.createdAt, lang)}
              </p>
            </div>
          </header>

          {/* From / Bill-to.
              Layout per side:
                Name (bold)
                Street
                City, Province PostalCode
                (blank)
                Email
                Phone
          */}
          <section className="mb-10 grid grid-cols-2 gap-8 border-t border-border pt-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t.from}
              </p>
              {clinicAddressLines.map((line, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "mt-2 text-sm font-semibold text-foreground"
                      : "text-sm text-muted-foreground"
                  }
                >
                  {line}
                </p>
              ))}
              <p className="mt-2 text-sm text-muted-foreground">
                {brand.contact.email}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t.billTo}
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {user.firstName} {user.lastName}
              </p>
              {street && (
                <p className="text-sm text-muted-foreground">{street}</p>
              )}
              {cityLine && (
                <p className="text-sm text-muted-foreground">{cityLine}</p>
              )}
              {(user.email || user.phoneNumber) && (
                <div className="mt-2">
                  {user.email && (
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  )}
                  {user.phoneNumber && (
                    <p className="text-sm text-muted-foreground">
                      {user.phoneNumber}
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Line items table */}
          <section className="mb-10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t.description}
                  </th>
                  <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t.amount}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-3 text-foreground">{description}</td>
                  <td className="py-3 text-right text-foreground">
                    {fmtMoney(txn.subtotalAmount, lang)}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td className="pt-4 text-right text-sm text-muted-foreground">
                    {t.subtotal}
                  </td>
                  <td className="pt-4 text-right text-sm text-foreground">
                    {fmtMoney(txn.subtotalAmount, lang)}
                  </td>
                </tr>
                {taxLines.map((line) => (
                  <tr key={line.label}>
                    <td className="pt-1 text-right text-sm text-muted-foreground">
                      {(isFr ? line.labelFr : line.label)} (
                      {(line.rate * 100).toFixed(line.rate * 100 % 1 ? 3 : 0)}%)
                    </td>
                    <td className="pt-1 text-right text-sm text-foreground">
                      {fmtMoney(line.amountCents, lang)}
                    </td>
                  </tr>
                ))}
                <tr className="border-t border-border">
                  <td className="pt-3 text-right text-sm font-semibold text-foreground">
                    {t.total}
                  </td>
                  <td className="pt-3 text-right text-base font-bold text-foreground">
                    {fmtMoney(txn.totalAmount, lang)}
                  </td>
                </tr>
                <tr>
                  <td className="pt-1 text-right text-sm font-semibold text-foreground">
                    {t.amountPaid}
                  </td>
                  <td className="pt-1 text-right text-base font-bold text-foreground">
                    {fmtMoney(txn.totalAmount, lang)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </section>

          {shouldShowInPersonNextSteps && selectedClinicName && selectedClinicAddress && patientPhone && (
            <section className="mb-10 rounded-lg border border-border bg-card p-5 print:break-inside-avoid">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t.whatHappensNext}
              </p>
              <p className="mt-2 text-sm text-foreground leading-relaxed">
                {t.nextStepsInPerson(selectedClinicName, selectedClinicAddress, patientPhone)}
              </p>
              {whatsNextSupportBlock}
            </section>
          )}

          {shouldShowDigitalNextSteps && (
            <section className="mb-10 rounded-lg border border-border bg-card p-5 print:break-inside-avoid">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t.whatHappensNext}
              </p>
              <p className="mt-2 text-sm text-foreground leading-relaxed">
                {t.nextStepsDigital()}
              </p>
              {whatsNextSupportBlock}
            </section>
          )}

          {/* Payment method */}
          <section className="mb-10 rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">
            {paidLine}
            {txn.paidAt ? ` — ${fmtDate(txn.paidAt, lang)}` : ""}
          </section>
        </article>
      </div>
    </>
  );
}


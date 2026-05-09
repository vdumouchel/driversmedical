// Canadian provincial sales-tax table. Used both client-side (checkout panel
// computes the line breakdown shown to the user) and server-side (webhook
// applies these as proper Stripe TaxRate objects on the Invoice so the PDF
// renders "HST 15%" / "GST 5%" lines after subtotal — not as a generic
// "Taxes" line item).

export type ProvinceTax = {
  /** Display name on receipts/invoices (e.g. "HST", "GST"). */
  label: string;
  /** French display name (e.g. "TVH", "TPS"). */
  labelFr: string;
  /** Decimal rate, e.g. 0.15 = 15%. */
  rate: number;
  /** ISO-3166-2 jurisdiction code Stripe records on the TaxRate object. */
  jurisdiction: string;
};

export const PROVINCE_TAXES: Record<string, ProvinceTax[]> = {
  "new-brunswick": [
    { label: "HST", labelFr: "TVH", rate: 0.15, jurisdiction: "CA-NB" },
  ],
  quebec: [
    { label: "GST", labelFr: "TPS", rate: 0.05, jurisdiction: "CA" },
    { label: "QST", labelFr: "TVQ", rate: 0.09975, jurisdiction: "CA-QC" },
  ],
};

export function getProvinceTaxes(provinceSlug: string): ProvinceTax[] {
  return PROVINCE_TAXES[provinceSlug] ?? [];
}

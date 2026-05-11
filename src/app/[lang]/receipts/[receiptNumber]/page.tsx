import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { transactions, intakes, users } from "@/db/schema";
import { buildReceiptModel } from "@/lib/receipt-model";
import { PrintButton } from "./print-button";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ lang: string; receiptNumber: string }>;
}

export default async function ReceiptPage({ params }: PageProps) {
  const { lang, receiptNumber } = await params;

  const rows = await db
    .select({ txn: transactions, intake: intakes, user: users })
    .from(transactions)
    .leftJoin(intakes, eq(intakes.id, transactions.intakeId))
    .leftJoin(users, eq(users.id, transactions.userId))
    .where(eq(transactions.receiptNumber, receiptNumber))
    .limit(1);

  const row = rows[0];
  if (!row || !row.user) notFound();

  const m = buildReceiptModel(row.txn, row.user, row.intake, lang);

  return (
    <>
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
        <div className="no-print mx-auto mb-6 flex max-w-3xl justify-end">
          <PrintButton label={m.labels.printBtn} />
        </div>

        <article
          className="receipt-shell mx-auto max-w-3xl rounded-2xl border border-border bg-card p-10 shadow-sm print:rounded-none print:shadow-none"
          aria-label={m.labels.title}
        >
          {/* Header */}
          <header className="mb-10 flex items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {m.siteName}
              </h1>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {m.labels.title}
              </p>
              <p className="mt-1 font-mono text-sm font-semibold text-foreground">
                {m.receiptNumber}
              </p>
              <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">
                {m.labels.date}
              </p>
              <p className="mt-1 text-sm text-foreground">
                {m.dateFormatted}
              </p>
            </div>
          </header>

          {/* From / Bill-to */}
          <section className="mb-10 grid grid-cols-2 gap-8 border-t border-border pt-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {m.labels.from}
              </p>
              {m.fromLines.map((line, i) => (
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
                {m.siteEmail}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {m.labels.billTo}
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {m.billToName}
              </p>
              {m.billToStreet && (
                <p className="text-sm text-muted-foreground">{m.billToStreet}</p>
              )}
              {m.billToCityLine && (
                <p className="text-sm text-muted-foreground">{m.billToCityLine}</p>
              )}
              {(m.billToEmail || m.billToPhone) && (
                <div className="mt-2">
                  {m.billToEmail && (
                    <p className="text-sm text-muted-foreground">{m.billToEmail}</p>
                  )}
                  {m.billToPhone && (
                    <p className="text-sm text-muted-foreground">{m.billToPhone}</p>
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
                    {m.labels.description}
                  </th>
                  <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {m.labels.amount}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-3 text-foreground">{m.description}</td>
                  <td className="py-3 text-right text-foreground">
                    {m.subtotalFormatted}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td className="pt-4 text-right text-sm text-muted-foreground">
                    {m.labels.subtotal}
                  </td>
                  <td className="pt-4 text-right text-sm text-foreground">
                    {m.subtotalFormatted}
                  </td>
                </tr>
                {m.taxLines.map((line) => (
                  <tr key={line.label}>
                    <td className="pt-1 text-right text-sm text-muted-foreground">
                      {line.label}
                    </td>
                    <td className="pt-1 text-right text-sm text-foreground">
                      {line.amountFormatted}
                    </td>
                  </tr>
                ))}
                <tr className="border-t border-border">
                  <td className="pt-3 text-right text-sm font-semibold text-foreground">
                    {m.labels.total}
                  </td>
                  <td className="pt-3 text-right text-base font-bold text-foreground">
                    {m.totalFormatted}
                  </td>
                </tr>
                <tr>
                  <td className="pt-1 text-right text-sm font-semibold text-foreground">
                    {m.labels.amountPaid}
                  </td>
                  <td className="pt-1 text-right text-base font-bold text-foreground">
                    {m.totalFormatted}
                  </td>
                </tr>
              </tfoot>
            </table>
          </section>

          {m.nextSteps && (
            <section className="mb-10 rounded-lg border border-border bg-card p-5 print:break-inside-avoid">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {m.labels.whatHappensNext}
              </p>
              <p className="mt-2 text-sm text-foreground leading-relaxed">
                {m.nextSteps}
              </p>
              <div className="mt-4 border-t border-border pt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {m.supportIntro}
                </p>
                <p className="mt-2 text-sm text-foreground leading-relaxed">
                  {m.supportBody}
                </p>
              </div>
            </section>
          )}

          {/* Payment method */}
          <section className="mb-10 rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">
            {m.paidLine}
            {m.paidDateFormatted ? ` — ${m.paidDateFormatted}` : ""}
          </section>
        </article>
      </div>
    </>
  );
}

import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import Stripe from "stripe";
import { db } from "@/db";
import { transactions } from "@/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Lightweight status endpoint polled by the summary page after Stripe confirms
 * payment. Two responsibilities:
 *
 *   1. Tell the client whether the row is "ready" to render the confirmation
 *      page (status='succeeded' AND payment-method details captured so the
 *      self-rendered receipt can show "Paid via Visa •••• 4242").
 *   2. Backfill `paymentMethodBrand` / `paymentMethodLast4` / `paidAt` from
 *      Stripe on demand when the webhook event was missed (e.g. a previous
 *      deploy returned 500 for `charge.succeeded` / `charge.updated`).
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const pi = url.searchParams.get("pi");
  if (!pi) {
    return NextResponse.json({ error: "missing pi" }, { status: 400 });
  }

  const rows = await db
    .select({
      status: transactions.status,
      receiptNumber: transactions.receiptNumber,
      paymentMethodLast4: transactions.paymentMethodLast4,
      paidAt: transactions.paidAt,
      stripeChargeId: transactions.stripeChargeId,
    })
    .from(transactions)
    .where(eq(transactions.transactionId, pi))
    .limit(1);

  const row = rows[0];
  if (!row) {
    // Webhook may not have inserted/updated the row yet on the very first poll.
    return NextResponse.json({ ready: false, status: null });
  }

  let { paymentMethodLast4, paidAt } = row;

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (
    stripeKey &&
    row.status === "succeeded" &&
    (!paymentMethodLast4 || !paidAt)
  ) {
    try {
      const stripe = new Stripe(stripeKey);
      let charge: Stripe.Charge | null = null;

      if (row.stripeChargeId) {
        charge = await stripe.charges.retrieve(row.stripeChargeId);
      } else {
        const list = await stripe.charges.list({ payment_intent: pi, limit: 1 });
        charge = list.data[0] ?? null;
      }

      if (charge) {
        const liveLast4 = charge.payment_method_details?.card?.last4 ?? null;
        const liveBrand = charge.payment_method_details?.card?.brand ?? null;
        const livePaidAt = charge.created
          ? new Date(charge.created * 1000)
          : null;
        const updates: Partial<typeof transactions.$inferInsert> = {};
        if (!paymentMethodLast4 && liveLast4) updates.paymentMethodLast4 = liveLast4;
        if (liveBrand) updates.paymentMethodBrand = liveBrand;
        if (!paidAt && livePaidAt) updates.paidAt = livePaidAt;
        if (!row.stripeChargeId) updates.stripeChargeId = charge.id;
        if (Object.keys(updates).length > 0) {
          updates.updatedAt = new Date();
          await db
            .update(transactions)
            .set(updates)
            .where(eq(transactions.transactionId, pi));
          if (updates.paymentMethodLast4)
            paymentMethodLast4 = updates.paymentMethodLast4 as string;
          if (updates.paidAt) paidAt = updates.paidAt as Date;
          console.log(
            `[transaction-status] backfilled PI ${pi} from Stripe:`,
            Object.keys(updates).join(", ")
          );
        }
      }
    } catch (err) {
      console.error("[transaction-status] Stripe backfill failed:", err);
    }
  }

  // Ready when the charge has settled and the payment-method last4 is on
  // file (the receipt page needs it to render the "Paid via Visa •••• 4242"
  // line). receiptNumber is generated at PI-creation so it's always present.
  const ready =
    row.status === "succeeded" && !!row.receiptNumber && !!paymentMethodLast4;

  return NextResponse.json({
    ready,
    status: row.status,
    receiptNumber: row.receiptNumber,
  });
}

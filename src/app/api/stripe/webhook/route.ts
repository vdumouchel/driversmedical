import Stripe from "stripe";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

// Stripe requires the RAW body to verify the signature; do not parse JSON.
export async function POST(req: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook not configured" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(secret);
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("[stripe-webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  console.log(`[stripe-webhook] ${event.type} ${event.id}`);

  try {
    switch (event.type) {
      // Mark the transaction succeeded as soon as the PI completes. Fees may
      // not be ready yet (balance_transaction is generated slightly later) so
      // we only update status here — fee fields are filled by charge.succeeded
      // / charge.updated below.
      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        const result = await db
          .update(transactions)
          .set({ status: "succeeded", updatedAt: new Date() })
          .where(eq(transactions.transactionId, pi.id))
          .returning({ id: transactions.id });
        console.log(
          `[stripe-webhook] PI succeeded ${pi.id} → updated ${result.length} row(s)`
        );
        // Best-effort try fee settlement now in case balance_transaction is
        // already populated; if not, charge.succeeded will fill it shortly.
        await settleFees(stripe, pi.id);
        break;
      }

      // The charge events are where balance_transaction reliably exists. Both
      // succeeded and updated can carry the fee data — handle both so we don't
      // miss the moment Stripe finalizes the BT.
      case "charge.succeeded":
      case "charge.updated": {
        const charge = event.data.object as Stripe.Charge;
        const piId =
          typeof charge.payment_intent === "string"
            ? charge.payment_intent
            : charge.payment_intent?.id;
        if (!piId) {
          console.log(
            `[stripe-webhook] ${event.type} ${charge.id} has no payment_intent — skipping`
          );
          break;
        }
        await applyChargeFees(stripe, piId, charge);
        break;
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        await db
          .update(transactions)
          .set({ status: "failed", updatedAt: new Date() })
          .where(eq(transactions.transactionId, pi.id));
        break;
      }

      case "payment_intent.canceled": {
        const pi = event.data.object as Stripe.PaymentIntent;
        await db
          .update(transactions)
          .set({ status: "canceled", updatedAt: new Date() })
          .where(eq(transactions.transactionId, pi.id));
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const piId =
          typeof charge.payment_intent === "string"
            ? charge.payment_intent
            : charge.payment_intent?.id;
        if (piId) {
          await db
            .update(transactions)
            .set({ status: "refunded", updatedAt: new Date() })
            .where(eq(transactions.transactionId, piId));
        }
        break;
      }

      default:
        // No-op for everything else.
        break;
    }
  } catch (err) {
    console.error("[stripe-webhook] handler error:", err);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

/**
 * Pull the BalanceTransaction off a charge (expanding if necessary) and write
 * fee/net data onto our transaction row. Safe to call repeatedly — the values
 * never change after settlement.
 */
async function applyChargeFees(
  stripe: Stripe,
  piId: string,
  chargeFromEvent: Stripe.Charge
) {
  let charge = chargeFromEvent;

  // The event payload usually has balance_transaction as a string ID, not the
  // expanded object. If it's a string (or absent), retrieve the charge fresh
  // with expand to get the full BT inline.
  const btField = charge.balance_transaction;
  if (!btField || typeof btField === "string") {
    charge = await stripe.charges.retrieve(charge.id, {
      expand: ["balance_transaction"],
    });
  }

  const bt = charge.balance_transaction as Stripe.BalanceTransaction | null;

  if (!bt) {
    console.log(
      `[stripe-webhook] charge ${charge.id} has no balance_transaction yet — skipping fee write`
    );
    // Still record the charge id (and any receipt fields Stripe may already
    // have populated) so we have a trail.
    const r = await db
      .update(transactions)
      .set({
        stripeChargeId: charge.id,
        receiptUrl: charge.receipt_url ?? null,
        paymentMethodBrand: charge.payment_method_details?.card?.brand ?? null,
        paymentMethodLast4: charge.payment_method_details?.card?.last4 ?? null,
        paidAt: charge.created ? new Date(charge.created * 1000) : null,
        updatedAt: new Date(),
      })
      .where(eq(transactions.transactionId, piId))
      .returning({ id: transactions.id });
    console.log(`[stripe-webhook]   charge-id-only update → ${r.length} row(s)`);
    return;
  }

  const result = await db
    .update(transactions)
    .set({
      stripeChargeId: charge.id,
      stripeBalanceTransactionId: bt.id,
      stripeFeesAmount: bt.fee,
      availableAmountAfterStripeFees: bt.net,
      receiptUrl: charge.receipt_url ?? null,
      paymentMethodBrand: charge.payment_method_details?.card?.brand ?? null,
      paymentMethodLast4: charge.payment_method_details?.card?.last4 ?? null,
      paidAt: charge.created ? new Date(charge.created * 1000) : null,
      updatedAt: new Date(),
    })
    .where(eq(transactions.transactionId, piId))
    .returning({ id: transactions.id });

  console.log(
    `[stripe-webhook] settled PI ${piId}: fee=${bt.fee} net=${bt.net} bt=${bt.id} → ${result.length} row(s)`
  );
}

/**
 * Best-effort fee settlement at PI-succeeded time. Looks up the latest charge
 * via either `latest_charge` or charges.list.
 */
async function settleFees(stripe: Stripe, piId: string) {
  const pi = await stripe.paymentIntents.retrieve(piId, {
    expand: ["latest_charge.balance_transaction"],
  });

  let charge: Stripe.Charge | null =
    typeof pi.latest_charge === "object" ? (pi.latest_charge as Stripe.Charge) : null;

  if (!charge) {
    const list = await stripe.charges.list({
      payment_intent: piId,
      limit: 1,
      expand: ["data.balance_transaction"],
    });
    charge = list.data[0] ?? null;
  }

  if (!charge) {
    console.log(`[stripe-webhook] no charge for PI ${piId} yet`);
    return;
  }

  await applyChargeFees(stripe, piId, charge);
}

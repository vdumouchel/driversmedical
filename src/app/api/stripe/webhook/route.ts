import Stripe from "stripe";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { transactions, intakes, users } from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { buildReceiptModel } from "@/lib/receipt-model";
import { renderReceiptEmailHtml } from "@/lib/receipt-email";
import { getResend, getResendFrom } from "@/lib/resend";
import { brand } from "@/config/brand";
import { generateFormForPaymentIntent } from "@/lib/forms/generate-form";

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

        // Fire-and-forget: generate the filled PDF form via Anvil.
        void generateFormForPaymentIntent(pi.id).catch((err) =>
          console.error(`[stripe-webhook] form generation failed for PI ${pi.id}:`, err)
        );
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

  // Fire-and-forget: send a branded receipt email now that card details are known.
  void sendReceiptEmailIfNeeded(piId).catch((err) =>
    console.error(`[stripe-webhook] receipt email failed for PI ${piId}:`, err)
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

/**
 * Send a branded receipt email via Resend. Idempotent: skips if
 * `receipt_email_sent_at` is already set or the user has no email.
 * Reads the locale from the PI metadata so the email matches the
 * language the customer used at checkout.
 */
async function sendReceiptEmailIfNeeded(piId: string) {
  const resend = getResend();
  if (!resend) return;

  // Atomically claim the "not yet sent" slot: only the first caller for this
  // PI will get a row back; subsequent retries see receiptEmailSentAt != null.
  const rows = await db
    .select({
      txn: transactions,
      intake: intakes,
      user: users,
    })
    .from(transactions)
    .leftJoin(intakes, eq(intakes.id, transactions.intakeId))
    .leftJoin(users, eq(users.id, transactions.userId))
    .where(
      and(
        eq(transactions.transactionId, piId),
        isNull(transactions.receiptEmailSentAt),
      ),
    )
    .limit(1);

  const row = rows[0];
  if (!row?.user) return;

  const email = row.user.email;
  if (!email) {
    console.log(`[receipt-email] PI ${piId}: user has no email — skipping`);
    return;
  }

  // Resolve locale from PI metadata (set by create-payment-intent).
  const txnMeta = (row.txn.metadata ?? {}) as Record<string, unknown>;
  const lang = txnMeta.locale === "fr" ? "fr" : "en";

  const model = buildReceiptModel(row.txn, row.user, row.intake, lang);
  const html = renderReceiptEmailHtml(model);

  const subject = lang === "fr"
    ? `${brand.siteName} — Reçu ${model.receiptNumber}`
    : `${brand.siteName} — Receipt ${model.receiptNumber}`;

  await resend.emails.send({
    from: getResendFrom(),
    to: email,
    subject,
    html,
  });

  await db
    .update(transactions)
    .set({ receiptEmailSentAt: new Date(), updatedAt: new Date() })
    .where(
      and(
        eq(transactions.transactionId, piId),
        isNull(transactions.receiptEmailSentAt),
      ),
    );

  console.log(`[receipt-email] sent receipt to ${email} for PI ${piId}`);
}

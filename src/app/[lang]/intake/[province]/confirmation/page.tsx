import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { eq } from "drizzle-orm";
import Stripe from "stripe";
import { db } from "@/db";
import { transactions, intakes } from "@/db/schema";
import { getProvince } from "@/config/provinces";
import { resolveLS } from "@/lib/i18n-utils";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ lang: string; province: string }>;
  searchParams: Promise<{ pi?: string }>;
}

type IntakeAnswers = Record<string, unknown>;

function pickStr(obj: IntakeAnswers, ...keys: string[]): string | null {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.trim()) return v;
  }
  return null;
}

export default async function ConfirmationPage({
  params,
  searchParams,
}: PageProps) {
  const { lang, province: provinceSlug } = await params;
  const { pi } = await searchParams;
  const isFr = lang === "fr";

  const province = getProvince(provinceSlug);

  // Fetch transaction + intake for the receipt + clinic info.
  let txn: typeof transactions.$inferSelect | null = null;
  let intake: typeof intakes.$inferSelect | null = null;
  if (pi) {
    const rows = await db
      .select({ txn: transactions, intake: intakes })
      .from(transactions)
      .leftJoin(intakes, eq(intakes.transactionId, transactions.transactionId))
      .where(eq(transactions.transactionId, pi))
      .limit(1);
    if (rows[0]) {
      txn = rows[0].txn;
      intake = rows[0].intake ?? null;
    }
  }

  // Self-heal: if the webhook event was lost, fetch the live charge from
  // Stripe and backfill the payment-method + paid-at fields the receipt
  // page needs to render. (We no longer rely on Stripe receipts/invoices —
  // we render our own at /[lang]/receipts/[receiptNumber].)
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (
    stripeKey &&
    txn &&
    txn.status === "succeeded" &&
    (!txn.paymentMethodLast4 || !txn.paidAt)
  ) {
    try {
      const stripe = new Stripe(stripeKey);
      let charge: Stripe.Charge | null = null;
      if (txn.stripeChargeId) {
        charge = await stripe.charges.retrieve(txn.stripeChargeId);
      } else if (txn.transactionId) {
        const list = await stripe.charges.list({
          payment_intent: txn.transactionId,
          limit: 1,
        });
        charge = list.data[0] ?? null;
      }
      if (charge) {
        const updates: Partial<typeof transactions.$inferInsert> = {};
        if (!txn.stripeChargeId) updates.stripeChargeId = charge.id;
        if (!txn.paymentMethodBrand)
          updates.paymentMethodBrand =
            charge.payment_method_details?.card?.brand ?? null;
        if (!txn.paymentMethodLast4)
          updates.paymentMethodLast4 =
            charge.payment_method_details?.card?.last4 ?? null;
        if (!txn.paidAt && charge.created)
          updates.paidAt = new Date(charge.created * 1000);

        if (Object.keys(updates).length > 0) {
          updates.updatedAt = new Date();
          await db
            .update(transactions)
            .set(updates)
            .where(eq(transactions.transactionId, txn.transactionId));
          txn = { ...txn, ...updates } as typeof txn;
        }
      }
    } catch (err) {
      console.error("[confirmation] Stripe backfill failed:", err);
    }
  }

  const answers: IntakeAnswers =
    (intake?.answers as IntakeAnswers | undefined) ?? {};
  const email = pickStr(answers, "email");
  const phone = pickStr(answers, "phone", "phone_number");

  // Quebec: resolve the picked clinic.
  const clinicId = pickStr(answers, "clinic_selection");
  const clinic =
    province?.inPersonAppointments?.find((c) => c.id === clinicId) ?? null;
  const clinicName = clinic ? resolveLS(clinic.name, lang) : null;
  const clinicAddress = clinic ? resolveLS(clinic.address, lang) : null;

  // Our own receipt number — the customer-facing identifier customer service
  // uses to discuss this transaction.
  const receiptId = txn?.receiptNumber ?? null;
  // URL of the self-rendered HTML receipt page. The "Download" button opens
  // it in a new tab where the user can save-as-PDF or print.
  const receiptUrl = txn?.receiptNumber
    ? `/${lang}/receipts/${txn.receiptNumber}`
    : null;
  const receiptReady = !!receiptUrl;
  const stillProcessing = !!txn && txn.status !== "succeeded";
  const noTxnFound = !txn && !!pi;

  // ─── Localized strings ─────────────────────────────────────────────────────
  const t = isFr
    ? {
        title: "Commande confirmée",
        thankYou:
          "Merci d'avoir complété votre admission. Un médecin ou une infirmière autorisé(e) examinera vos informations et complétera votre formulaire médical de conducteur.",
        confirmationNumber: "Numéro de confirmation",
        nextSteps: "Prochaines étapes",
        nextStepsNb: (em: string) =>
          `Un professionnel de la santé autorisé (médecin ou infirmière) examinera votre demande et enverra votre formulaire complété par courriel à ${em} dans les 24 heures.`,
        nextStepsNbNoEmail:
          "Un professionnel de la santé autorisé (médecin ou infirmière) examinera votre demande et vous enverra votre formulaire complété par courriel dans les 24 heures.",
        nextStepsQc: (name: string, addr: string, ph: string) =>
          `Un administrateur de ${name} (${addr}) vous appellera au ${ph} dans les 72 heures pour planifier votre examen visuel en personne et finaliser votre formulaire.`,
        nextStepsQcNoClinic:
          "L'équipe de la clinique vous appellera dans les 72 heures pour planifier votre examen visuel en personne et finaliser votre formulaire.",
        downloadReceipt: "Télécharger le reçu",
        printReceipt: "Imprimer le reçu",
        backHome: "Retour à l'accueil",
        processing:
          "Votre paiement a été reçu. Nous finalisons votre reçu — il sera disponible dans quelques instants.",
        notFound:
          "Nous n'avons pas pu trouver votre transaction. Veuillez vérifier votre courriel pour le reçu.",
      }
    : {
        title: "Order confirmed",
        thankYou:
          "Thank you for completing your intake. A licensed physician or nurse will review your information and complete your driver's medical form.",
        confirmationNumber: "Confirmation number",
        nextSteps: "What happens next",
        nextStepsNb: (em: string) =>
          `A licensed healthcare provider (physician or nurse) will review your request and email your completed form to ${em} within 24 hours.`,
        nextStepsNbNoEmail:
          "A licensed healthcare provider (physician or nurse) will review your request and email your completed form within 24 hours.",
        nextStepsQc: (name: string, addr: string, ph: string) =>
          `An administrator from ${name} (${addr}) will call you at ${ph} within 72 hours to schedule your in-person eye examination and finalize your form.`,
        nextStepsQcNoClinic:
          "The clinic's admin team will call you within 72 hours to schedule your in-person eye examination and finalize your form.",
        downloadReceipt: "Download receipt",
        printReceipt: "Print receipt",
        backHome: "Back to home",
        processing:
          "Your payment has been received. We're finalizing your receipt — it will appear here in a moment.",
        notFound:
          "We couldn't locate your transaction. Please check your email for the receipt.",
      };

  // Province-specific next-steps message.
  let nextStepsMessage = "";
  if (provinceSlug === "quebec") {
    nextStepsMessage =
      clinicName && clinicAddress && phone
        ? t.nextStepsQc(clinicName, clinicAddress, phone)
        : t.nextStepsQcNoClinic;
  } else if (provinceSlug === "new-brunswick") {
    nextStepsMessage = email ? t.nextStepsNb(email) : t.nextStepsNbNoEmail;
  }

  return (
    <div className="flex-1 px-4 py-12">
      <div className="mx-auto w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            {t.title}
          </h1>
        </div>

        {/* Confirmation number card */}
        {receiptId && (
          <div className="rounded-2xl border border-border bg-card p-5 mb-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              {t.confirmationNumber}
            </p>
            <p className="text-lg font-mono font-semibold text-foreground">
              {receiptId}
            </p>
          </div>
        )}

        {/* Processing / not-found notice */}
        {stillProcessing && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-50 dark:bg-amber-950/20 p-4 mb-5 text-sm text-amber-900 dark:text-amber-200">
            {t.processing}
          </div>
        )}
        {noTxnFound && (
          <div className="rounded-2xl border border-border bg-muted/40 p-4 mb-5 text-sm text-muted-foreground">
            {t.notFound}
          </div>
        )}

        {/* Province-specific next steps */}
        {nextStepsMessage && (
          <div className="rounded-2xl border border-border bg-card p-5 mb-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              {t.nextSteps}
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {nextStepsMessage}
            </p>
          </div>
        )}

        {/* Embedded business invoice — Stripe-generated PDF with logo,
            Bill-to block, line items + tax breakdown. We never embed the
            bare charge receipt here. */}
        {receiptReady ? (
          <>
            {/* Embed the self-rendered branded receipt page inline. The
                receipt page has its own "Print / Save as PDF" button in the
                iframe, so we don't repeat a download button out here. */}
            <div className="mb-8 overflow-hidden rounded-2xl border border-border bg-card">
              <iframe
                src={receiptUrl ?? undefined}
                title={isFr ? "Reçu" : "Receipt"}
                className="block h-[80vh] w-full bg-white"
              />
            </div>
          </>
        ) : (
          // Invoice still being generated by the webhook — show a friendly
          // placeholder instead of the minimal Stripe charge receipt, and
          // auto-refresh until the invoice URL appears.
          <>
            <meta httpEquiv="refresh" content="3" />
            <div className="mb-8 rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
              {isFr
                ? "Préparation de votre facture… Cette page se mettra à jour dans quelques instants."
                : "Preparing your invoice… This page will update in a moment."}
            </div>
          </>
        )}

        {/* Back home */}
        <div className="text-center">
          <Link
            href={`/${lang}`}
            className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {t.backHome}
          </Link>
        </div>
      </div>
    </div>
  );
}

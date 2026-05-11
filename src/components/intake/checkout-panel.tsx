"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Shield, Lock } from "lucide-react";
import { useIntakeStore } from "@/stores/intake-store";

// ─── Tax configuration ────────────────────────────────────────────────────────
// The province → tax-rate table is shared with the Stripe webhook (which
// applies these as Stripe TaxRate objects on the Invoice so the PDF renders
// proper "HST 15%" / "GST 5%" lines after subtotal). See
// `src/lib/province-taxes.ts`.

import { getProvinceTaxes } from "@/lib/province-taxes";

function computeOrder(priceCad: number, provinceSlug: string) {
  const taxes = getProvinceTaxes(provinceSlug);
  const taxLines = taxes.map((t) => ({
    ...t,
    amount: Math.round(priceCad * t.rate * 100) / 100,
  }));
  const totalTax =
    Math.round(taxLines.reduce((s, t) => s + t.amount, 0) * 100) / 100;
  const total = Math.round((priceCad + totalTax) * 100) / 100;
  return { subtotal: priceCad, taxLines, total };
}

function fmt(n: number) {
  return n.toLocaleString("en-CA", { style: "currency", currency: "CAD" });
}

function ratePct(rate: number) {
  return parseFloat((rate * 100).toFixed(3)).toString();
}

// ─── Stripe setup ─────────────────────────────────────────────────────────────
// Initialized lazily on mount so SSR never evaluates it (avoids hydration mismatch).
// NEXT_PUBLIC_ vars are inlined by Next.js at build time, available on client.
let _stripePromise: ReturnType<typeof loadStripe> | null = null;
function getStripePromise() {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) return null;
  if (!_stripePromise) _stripePromise = loadStripe(key);
  return _stripePromise;
}

// ─── Inner payment form (inside Elements) ─────────────────────────────────────

function StripePaymentForm({
  lang,
  canSubmit,
  returnUrl,
  paymentIntentId,
  onSuccess,
}: {
  lang: string;
  canSubmit: boolean;
  returnUrl: string;
  paymentIntentId: string | null;
  onSuccess: (paymentIntentId: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const isFr = lang === "fr";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements || !canSubmit) return;
    setSubmitting(true);
    setPayError(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
      redirect: "if_required",
    });

    if (error) {
      setPayError(
        error.message ?? (isFr ? "Paiement échoué." : "Payment failed.")
      );
      setSubmitting(false);
    } else {
      onSuccess(paymentIntent?.id ?? paymentIntentId ?? "");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement
        options={{
          layout: "accordion",
          defaultValues: { billingDetails: { address: { country: "CA" } } },
        }}
      />
      {payError && (
        <p className="text-sm text-destructive">{payError}</p>
      )}
      <button
        type="submit"
        disabled={!stripe || !canSubmit || submitting}
        className="w-full rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {submitting
          ? isFr
            ? "Traitement en cours…"
            : "Processing…"
          : isFr
            ? "Compléter la commande"
            : "Complete Order"}
      </button>
    </form>
  );
}

// ─── CheckoutPanel ────────────────────────────────────────────────────────────

export interface CheckoutPanelProps {
  provinceSlug: string;
  provinceName: string;
  formTitle: string;
  formCode?: string;
  priceCad: number;
  lang: string;
  isQuebec: boolean;
  onSuccess: (paymentIntentId: string) => void;
}

export function CheckoutPanel({
  provinceSlug,
  provinceName,
  formTitle,
  formCode,
  priceCad,
  lang,
  isQuebec,
  onSuccess,
}: CheckoutPanelProps) {
  const isFr = lang === "fr";
  const { subtotal, taxLines, total } = computeOrder(priceCad, provinceSlug);
  const totalCents = Math.round(total * 100);
  const subtotalCents = Math.round(subtotal * 100);
  const taxesCents = Math.round((total - subtotal) * 100);

  // Pull the collected answers from the intake store so we can persist the
  // full submission alongside the Stripe payment.
  const answers = useIntakeStore((s) => s.answers);

  const returnUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname.replace(
          "/summary",
          "/confirmation"
        )}`
      : "";

  // Stripe — initialized on mount (client only)
  const [stripePromise, setStripePromise] = useState<ReturnType<typeof loadStripe> | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    setStripePromise(getStripePromise());
  }, []);

  useEffect(() => {
    if (!stripePromise) return;
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        province: provinceSlug,
        amount: totalCents,
        subtotal: subtotalCents,
        taxes: taxesCents,
        formCode,
        lang,
        licenseClass:
          typeof answers["licence_class"] === "string"
            ? (answers["licence_class"] as string)
            : typeof answers["license_class"] === "string"
              ? (answers["license_class"] as string)
              : undefined,
        answers,
      }),
    })
      .then((r) => r.json())
      .then((data: { clientSecret?: string }) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
          // clientSecret format: `pi_<id>_secret_<token>` — extract the PI id
          // so we can append it to the confirmation redirect URL.
          const piId = data.clientSecret.split("_secret_")[0] ?? null;
          setPaymentIntentId(piId);
        }
        else
          setFetchError(
            isFr
              ? "Impossible d'initialiser le paiement."
              : "Unable to initialize payment."
          );
      })
      .catch(() =>
        setFetchError(
          isFr
            ? "Impossible d'initialiser le paiement."
            : "Unable to initialize payment."
        )
      );
    // answers/subtotal/taxes/formCode are intentionally omitted — they change
    // every render (object identity / derived) and we only want to create the
    // PaymentIntent once per (province, amount) tuple.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stripePromise, provinceSlug, totalCents, isFr]);

  // Legal checkboxes
  const [declaration, setDeclaration] = useState(false);
  const [saaqConsent, setSaaqConsent] = useState(false);
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);

  const canSubmit =
    declaration &&
    terms &&
    privacy &&
    (!isQuebec || saaqConsent);

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden sticky top-8">
      {/* ── Order summary ──────────────────────────────────────────────────── */}
      <div className="px-6 py-5 border-b border-border">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          {isFr ? "Résumé de la commande" : "Order Summary"}
        </p>

        {/* Line item */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground leading-snug">
              {formTitle}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {provinceName}
              {formCode ? ` · ${formCode}` : ""}
            </p>
          </div>
          <span className="text-sm font-medium text-foreground shrink-0">
            {fmt(subtotal)}
          </span>
        </div>

        {/* Tax lines */}
        <div className="space-y-1.5 pt-3 border-t border-border/60">
          {taxLines.map((t) => (
            <div key={t.label} className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {isFr ? t.labelFr : t.label} ({ratePct(t.rate)}%)
              </span>
              <span className="text-muted-foreground">{fmt(t.amount)}</span>
            </div>
          ))}
          <div className="flex justify-between text-base font-semibold text-foreground pt-2 border-t border-border">
            <span>{isFr ? "Total" : "Total"}</span>
            <span>{fmt(total)}</span>
          </div>
        </div>
      </div>

      {/* ── Legal checkboxes ───────────────────────────────────────────────── */}
      <div className="px-6 py-5 border-b border-border space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          {isFr ? "Déclarations" : "Declarations"}
        </p>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={declaration}
            onChange={(e) => setDeclaration(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-input accent-primary cursor-pointer"
          />
          <span className="text-sm text-foreground leading-snug">
            {isFr
              ? "Je confirme que les informations fournies sont exactes et complètes au meilleur de ma connaissance."
              : "I confirm that the information provided is accurate and complete to the best of my knowledge."}
          </span>
        </label>

        {isQuebec && (
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={saaqConsent}
              onChange={(e) => setSaaqConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-input accent-primary cursor-pointer"
            />
            <span className="text-sm text-foreground leading-snug">
              {isFr
                ? "J'autorise la SAAQ à discuter, au besoin, des renseignements médicaux me concernant avec le professionnel de la santé qui remplit ce formulaire."
                : "I authorize the SAAQ to discuss, when necessary, medical information concerning me with the health care professional who completes this form."}
            </span>
          </label>
        )}

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-input accent-primary cursor-pointer"
          />
          <span className="text-sm text-muted-foreground leading-snug">
            {isFr ? "J'accepte les " : "I agree to the "}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              {isFr ? "conditions d'utilisation" : "Terms & Conditions"}
            </a>
            .
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={privacy}
            onChange={(e) => setPrivacy(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-input accent-primary cursor-pointer"
          />
          <span className="text-sm text-muted-foreground leading-snug">
            {isFr ? "J'ai lu et j'accepte la " : "I have read and agree to the "}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              {isFr ? "politique de confidentialité" : "Privacy Policy"}
            </a>
            .
          </span>
        </label>
      </div>

      {/* ── Payment ────────────────────────────────────────────────────────── */}
      <div className="px-6 py-5 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {isFr ? "Paiement sécurisé" : "Secure Payment"}
        </p>

        {fetchError ? (
          <p className="text-sm text-destructive">{fetchError}</p>
        ) : !stripePromise ? (
          /* Stripe not configured — placeholder */
          <div className="space-y-4">
            <div className="rounded-lg border border-dashed border-border bg-muted/30 p-5 text-center">
              <Lock className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {isFr
                  ? "Paiement en ligne bientôt disponible."
                  : "Online payment coming soon."}
              </p>
            </div>
            <button
              disabled={!canSubmit}
              onClick={canSubmit ? () => onSuccess("") : undefined}
              className="w-full rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isFr ? "Compléter la commande" : "Complete Order"}
            </button>
          </div>
        ) : clientSecret ? (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
                variables: {
                  borderRadius: "8px",
                  colorPrimary: "oklch(var(--primary))",
                },
              },
              locale: isFr ? "fr-CA" : "en-CA",
            }}
          >
            <StripePaymentForm
              lang={lang}
              canSubmit={canSubmit}
              returnUrl={returnUrl}
              paymentIntentId={paymentIntentId}
              onSuccess={onSuccess}
            />
          </Elements>
        ) : (
          /* Loading skeleton */
          <div className="space-y-3">
            <div className="h-10 rounded-lg bg-muted animate-pulse" />
            <div className="h-10 rounded-lg bg-muted animate-pulse w-3/4" />
            <div className="h-12 rounded-full bg-muted animate-pulse mt-2" />
          </div>
        )}

        {/* Security badge */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pt-1">
          <Shield className="h-3.5 w-3.5 shrink-0" />
          <span>
            {isFr
              ? "Paiement sécurisé par Stripe. Données chiffrées."
              : "Secured by Stripe. Your data is encrypted."}
          </span>
        </div>
      </div>
    </div>
  );
}

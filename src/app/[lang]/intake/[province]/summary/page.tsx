"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useIntakeStore } from "@/stores/intake-store";
import { SummaryView } from "@/components/intake/summary-view";
import { CheckoutPanel } from "@/components/intake/checkout-panel";
import { getProvinceSchema, getProvince } from "@/config/provinces";
import { motion } from "framer-motion";
import { useLocalePath, useLang } from "@/lib/i18n-hooks";

// Poll cadence + ceiling for the post-payment "finalizing" state. Stripe's
// charge.succeeded webhook usually fires within 1–3 seconds; we keep checking
// for up to 60s before falling through to the confirmation page anyway (the
// page itself handles the "still processing" fallback).
const POLL_INTERVAL_MS = 1500;
const POLL_TIMEOUT_MS = 60_000;

export default function SummaryPage() {
  const params = useParams<{ province: string }>();
  const router = useRouter();
  const lp = useLocalePath();
  const lang = useLang();
  const isFr = lang === "fr";
  const { fields } = useIntakeStore();

  // ─── Post-payment finalization state ────────────────────────────────────
  const [finalizing, setFinalizing] = useState(false);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollDeadlineRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    };
  }, []);

  const schema = getProvinceSchema(params.province);
  const province = getProvince(params.province);

  if (!schema || !province || fields.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            {isFr
              ? "Aucune donnée d'admission trouvée. Veuillez recommencer."
              : "No intake data found. Please start over."}
          </p>
          <button
            onClick={() => router.push(lp("/intake"))}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {isFr ? "Recommencer" : "Start Over"}
          </button>
        </div>
      </div>
    );
  }

  function goToConfirmation(paymentIntentId: string) {
    const qs = paymentIntentId ? `?pi=${encodeURIComponent(paymentIntentId)}` : "";
    router.push(lp(`/intake/${params.province}/confirmation${qs}`));
  }

  // Poll the status endpoint until the Stripe webhook has populated
  // `receipt_id` + `receipt_url`. While polling, we keep the page mounted and
  // overlay a "finalizing" spinner so the user never sees a half-rendered
  // confirmation page.
  function pollUntilReady(paymentIntentId: string) {
    const tick = async () => {
      try {
        const res = await fetch(
          `/api/transaction-status?pi=${encodeURIComponent(paymentIntentId)}`,
          { cache: "no-store" },
        );
        const data = (await res.json()) as { ready?: boolean };
        if (data.ready) {
          goToConfirmation(paymentIntentId);
          return;
        }
      } catch {
        // network blip — fall through and retry on the next interval
      }

      if (Date.now() >= pollDeadlineRef.current) {
        // Give up waiting and let the confirmation page render its own
        // "still processing" fallback.
        goToConfirmation(paymentIntentId);
        return;
      }
      pollTimerRef.current = setTimeout(tick, POLL_INTERVAL_MS);
    };
    pollDeadlineRef.current = Date.now() + POLL_TIMEOUT_MS;
    tick();
  }

  function handleSuccess(paymentIntentId: string) {
    if (!paymentIntentId) {
      // Stripe-not-configured path (placeholder button) — skip polling.
      goToConfirmation("");
      return;
    }
    setFinalizing(true);
    pollUntilReady(paymentIntentId);
  }

  return (
    <div className="flex-1 px-4 py-10 sm:py-14">
      {/* Post-payment finalization overlay — keeps the user here while we
          wait for the Stripe webhook to write the receipt fields. */}
      {finalizing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="mx-4 max-w-sm rounded-2xl border border-border bg-card p-8 text-center shadow-lg">
            <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-primary" />
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {isFr ? "Finalisation de votre commande" : "Finalizing your order"}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isFr
                ? "Paiement reçu. Nous préparons votre reçu — ne fermez pas cette fenêtre."
                : "Payment received. We're preparing your receipt — please don't close this window."}
            </p>
          </div>
        </div>
      )}
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              {isFr ? "Retour" : "Back"}
            </button>

            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
              {isFr ? "Révisez vos réponses" : "Review Your Answers"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isFr
                ? `Vérifiez vos informations avant de soumettre votre formulaire médical du ${schema.provinceName}.`
                : `Please review your information before submitting your ${schema.provinceName} driver's medical form.`}
            </p>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px]">
            {/* Left — answers summary */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <SummaryView />
            </div>

            {/* Right — checkout panel */}
            <div>
              <CheckoutPanel
                provinceSlug={params.province}
                provinceName={province.nameFr && isFr ? province.nameFr : province.nameEn}
                formTitle={schema.formTitle}
                formCode={schema.metadata?.formCode}
                priceCad={province.priceCad ?? 0}
                lang={lang}
                isQuebec={params.province === "quebec"}
                onSuccess={handleSuccess}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

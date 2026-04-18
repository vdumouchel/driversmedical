export const pricing = {
  en: {
    badge: "All-Inclusive Price",
    selectLabel: "Select your province",
    geoHint: "We matched your location to show the right price. Change the province above if needed.",
    tagline: "One simple price. No hidden fees or surprises.",
    cta: "Get Started",
    disclaimer:
      "Secure payment processed after intake completion. Full refund if one of our providers cannot complete your form.",
    soonAvailableBadge: "Soon available",
  },
  fr: {
    badge: "Prix tout inclus",
    selectLabel: "Sélectionnez votre province",
    geoHint:
      "Nous avons utilisé votre emplacement pour afficher le bon prix. Modifiez la province ci-dessus au besoin.",
    tagline: "Un prix simple. Aucuns frais cachés ni surprises.",
    cta: "Commencer",
    disclaimer:
      "Paiement sécurisé traité après la complétion de l'admission. Remboursement complet si un de nos professionels de la santé ne peut pas compléter votre formulaire.",
    soonAvailableBadge: "Bientôt disponible",
  },
} as const;

export type PricingContent = (typeof pricing)["en"];

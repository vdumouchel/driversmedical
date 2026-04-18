export const site = {
  en: {
    nav: {
      howItWorks: "How It Works",
      benefits: "Benefits",
      testimonials: "Testimonials",
      faq: "FAQ",
      getStarted: "Get Started",
    },
    footer: {
      service: "Service",
      legal: "Legal",
      contact: "Contact",
      links: {
        howItWorks: "How It Works",
        benefits: "Benefits",
        pricing: "Pricing",
        faq: "FAQ",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
        consent: "Telehealth Consent",
      },
      allRightsReserved: "All rights reserved.",
    },
  },
  fr: {
    nav: {
      howItWorks: "Comment ça marche",
      benefits: "Avantages",
      testimonials: "Témoignages",
      faq: "FAQ",
      getStarted: "Commencer",
    },
    footer: {
      service: "Service",
      legal: "Légal",
      contact: "Contact",
      links: {
        howItWorks: "Comment ça marche",
        benefits: "Avantages",
        pricing: "Tarification",
        faq: "FAQ",
        privacy: "Politique de confidentialité",
        terms: "Conditions d'utilisation",
        consent: "Consentement à la télésanté",
      },
      allRightsReserved: "Tous droits réservés.",
    },
  },
} as const;

export type SiteContent = (typeof site)["en"];

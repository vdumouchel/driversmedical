import { Home, Clock, Shield, FileText } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type BenefitItem = {
  icon: LucideIcon;
  titleKey: "online" | "licensed" | "fastTurnaround" | "emailDelivery";
};

/** Benefit items keyed by an id so copy can be localized while icons stay shared. */
export const benefitItems: readonly BenefitItem[] = [
  { icon: Home, titleKey: "online" },
  { icon: Clock, titleKey: "licensed" },
  { icon: Shield, titleKey: "fastTurnaround" },
  { icon: FileText, titleKey: "emailDelivery" },
] as const;

export const benefits = {
  en: {
    heading: "Why drivers choose us",
    subheading: "Everything you need for your driver medical form",
    items: {
      online: {
        title: "Online Form",
        description:
          "Complete your entire medical form from your phone, tablet, or computer. *In person visits required depending on your province.*",
      },
      licensed: {
        title: "Licensed physicians and nurses",
        description:
          "Every form is reviewed and signed by a physician or nurse licensed to practice in your province.",
      },
      fastTurnaround: {
        title: "Fast turnaround",
        /** Used as a generic fallback when no province-specific turnaround copy is available. */
        description:
          "Get your completed form delivered to your email, typically within 24 hours.",
      },
      emailDelivery: {
        title: "Email delivery",
        description:
          "Your completed form is sent directly to your email in PDF format, ready to submit.",
      },
    },
  },
  fr: {
    heading: "Pourquoi les conducteurs nous choisissent",
    subheading: "Tout ce dont vous avez besoin pour votre formulaire médical de conducteur",
    items: {
      online: {
        title: "En ligne",
        description:
          "Complétez votre formulaire médical complet depuis votre téléphone, tablette ou ordinateur. *Visites en personne requises selon votre province.*",
      },
      licensed: {
        title: "Médecins et infirmières certifiés",
        description:
          "Chaque formulaire est révisé et signé par un médecin ou infirmière autorisé à exercer dans votre province.",
      },
      fastTurnaround: {
        title: "Délai rapide",
        description:
          "Recevez votre formulaire complété par courriel, généralement dans les 24 heures.",
      },
      emailDelivery: {
        title: "Livraison par courriel",
        description:
          "Votre formulaire complété est envoyé directement à votre courriel en format PDF, prêt à soumettre.",
      },
    },
  },
} as const;

export type BenefitsContent = (typeof benefits)["en"];

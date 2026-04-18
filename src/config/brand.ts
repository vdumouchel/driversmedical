import { TruckElectric } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type LocalizedString = { en: string; fr: string };

export const brand = {
  siteName: "DriversMedical.clinic",
  siteDomain: "driversmedical.clinic",
  logoIcon: TruckElectric satisfies LucideIcon,
  metadata: {
    title: {
      en: "DriversMedical.clinic — Get Your Driver's Medical Form Online",
      fr: "DriversMedical.clinic — Obtenez votre formulaire médical de conducteur en ligne",
    },
    description: {
      en: "Licensed physicians and nurses help complete your provincial driver's medical form online. Most of the process is remote; some provinces require an in-person vision examination. Available across Canada.",
      fr: "Des médecins et infirmières agréés complètent votre formulaire médical provincial de conducteur en ligne. La majeure partie du processus se fait à distance; certaines provinces exigent un examen de la vision en personne. Disponible partout au Canada.",
    },
  },
  contact: {
    email: "support@driversmedical.clinic",
    hoursLabel: {
      en: "Mon-Sun: 8am - 10pm EST",
      fr: "Lun-Dim: 8h - 22h HNE",
    } satisfies LocalizedString,
  },
  footer: {
    tagline: {
      en: "Online driver medical exams by licensed Canadian physicians. Fast, secure, and convenient.",
      fr: "Examens médicaux de conducteur en ligne par des médecins canadiens agréés. Rapide, sécurisé et pratique.",
    } satisfies LocalizedString,
    bottomNote: {
      en: "Telehealth services provided by licensed Canadian physicians.",
      fr: "Services de télésanté fournis par des médecins canadiens agréés.",
    } satisfies LocalizedString,
  },
} as const;

export type Brand = typeof brand;

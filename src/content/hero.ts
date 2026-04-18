export const hero = {
  en: {
    eyebrow: "Telehealth Service",
    eyebrowSub: "Licensed Canadian Physicians and Nurses",
    titleLine1: "Driver's Medical.",
    titleLine2: "Done Online.",
    body: "Get your commercial driver medical form completed online with licensed Canadian physicians and nurses—fast turnaround and your form sent straight to your email. Some provinces require an in-person vision examination; we help coordinate it when yours does.",
    ctaPrimary: "See If I'm Eligible",
    imageAlt: "Commercial driver completing an online driver medical form",
    imageOverlay: "Medical Exam Online",
    /** Default (shown when no province is matched) */
    turnaroundDefault: {
      title: "Form delivered by email",
      sub: "Within 24 hours",
    },
    bullets: [
      "Online Form",
      "Province-specific forms",
      "Licensed physicians and nurses",
    ],
  },
  fr: {
    eyebrow: "Service de télésanté",
    eyebrowSub: "Médecins et infirmières canadiens certifiés",
    titleLine1: "Rapport  médical.",
    titleLine2: "En ligne.",
    body: "Complétez votre formulaire médical pour conducteur commercial en ligne avec des médecins et infirmières canadiens agréés — délai rapide et envoi direct du formulaire par courriel. Certaines provinces exigent un examen de la vision en personne ; nous vous aidons à le coordonner lorsque c'est le cas pour vous.",
    ctaPrimary: "Vérifier mon admissibilité",
    imageAlt: "Conducteur commercial remplissant un formulaire médical de conducteur en ligne",
    imageOverlay: "Examen médical en ligne",
    turnaroundDefault: {
      title: "Formulaire livré par courriel",
      sub: "Dans les 24 heures",
    },
    bullets: [
      "En ligne",
      "Spécifiques à la province",
      "Médecins et infirmières certifiés",
    ],
  },
} as const;

export type HeroContent = (typeof hero)["en"];

export const howItWorks = {
  en: {
    heading: "How it works",
    subheading: "Get your driver medical form completed in 4 simple steps.",
    steps: [
      {
        number: "01",
        timing: "Start here",
        title: "Select your province",
        description:
          "Choose your province so we load the correct driver medical form and questions for your jurisdiction.",
      },
      {
        number: "02",
        timing: "10-15 minutes",
        title: "Complete your medical form online",
        description:
          "Fill out your complete medical history, health conditions, and required information through our secure online form.",
      },
      {
        number: "03",
        timing: "Within 24 hours",
        title: "A provider reviews your case",
        description:
          "A licensed Canadian physician or nurse reviews your information and completes your official driver medical form.",
      },
      {
        number: "04",
        timing: "PDF format",
        title: "Receive your signed form",
        description:
          "Your completed and signed driver medical form is delivered directly to your email, ready to submit to your licensing authority.",
      },
    ],
  },
  fr: {
    heading: "Comment ça marche",
    subheading: "Obtenez votre formulaire médical de conducteur en 4 étapes simples.",
    steps: [
      {
        number: "01",
        timing: "Commencez ici",
        title: "Sélectionnez votre province",
        description:
          "Choisissez votre province pour que nous chargions le bon formulaire médical et les bonnes questions pour votre juridiction.",
      },
      {
        number: "02",
        timing: "10-15 minutes",
        title: "Complétez votre formulaire médical en ligne",
        description:
          "Remplissez votre historique médical complet, vos conditions de santé et les informations requises via notre formulaire en ligne sécurisé.",
      },
      {
        number: "03",
        timing: "Dans les 24 heures",
        title: "Un professionel de la santé examine votre dossier",
        description:
          "Un médecin ou infirmière canadien certifié examine vos informations et complète votre formulaire médical officiel de conducteur.",
      },
      {
        number: "04",
        timing: "Format PDF",
        title: "Recevez votre formulaire signé",
        description:
          "Votre formulaire médical de conducteur complété et signé est livré directement à votre courriel, prêt à soumettre à votre autorité de permis.",
      },
    ],
  },
} as const;

export type HowItWorksContent = (typeof howItWorks)["en"];

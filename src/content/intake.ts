export const intake = {
  en: {
    provinceSelect: {
      heading: "Which province is your driver's medical form for?",
      subheading: "We'll load the right form and questions for your province.",
      formPrefix: "Form",
      comingSoon: "Coming Soon",
    },
    summary: {
      heading: "Review Your Answers",
      body: "Please review your information for the {provinceName} driver's medical form before submitting.",
      missing: "No intake data found. Please start over.",
      startOver: "Start Over",
      goBack: "Go Back",
      submit: "Submit Application",
    },
    homeProvinceSelect: {
      ariaLabel: "Choose province for personalized content",
      placeholder: "Select your province",
      provinceLabel: "Province",
      soonAvailable: "Soon available",
    },
  },
  fr: {
    provinceSelect: {
      heading: "Pour quelle province est votre formulaire médical de conducteur?",
      subheading: "Nous chargerons le bon formulaire et les bonnes questions pour votre province.",
      formPrefix: "Formulaire",
      comingSoon: "Bientôt disponible",
    },
    summary: {
      heading: "Révisez vos réponses",
      body: "Veuillez réviser vos informations pour le formulaire médical de conducteur du {provinceName} avant de soumettre.",
      missing: "Aucune donnée d'admission trouvée. Veuillez recommencer.",
      startOver: "Recommencer",
      goBack: "Retour",
      submit: "Soumettre la demande",
    },
    homeProvinceSelect: {
      ariaLabel: "Choisissez la province pour un contenu personnalisé",
      placeholder: "Sélectionnez votre province",
      provinceLabel: "Province",
      soonAvailable: "Bientôt disponible",
    },
  },
} as const;

export type IntakeContent = (typeof intake)["en"];

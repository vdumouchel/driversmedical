export type FaqItem = { question: string; answer: string };

export const faq = {
  en: {
    heading: "Frequently asked questions",
    subheading: "Everything you need to know about our online driver medical exam service.",
    items: [
      {
        question: "What is DriversMedical.clinic?",
        answer:
          "DriversMedical.clinic is a telemedicine platform that allows commercial drivers to get their required driver medical forms completed online. You fill out a secure online intake, a licensed physician or nurse reviews your information, and your completed form is delivered digitally.",
      },
      {
        question: "Is the medical form accepted by provincial licensing authorities?",
        answer:
          "Yes. Our physicians are licensed in Canada and authorized to complete driver medical forms. The forms we provide are province-specific and meet all provincial requirements.",
      },
      {
        question: "How long does the entire process take?",
        answer:
          "The online intake takes about 10-15 minutes. Once submitted, a physician or nurse reviews your case and completes your form, typically within 24 hours. Your completed and signed form is then delivered to your email in PDF format.",
      },
      {
        question: "Which provinces are supported?",
        answer:
          "We currently support New Brunswick and Quebec, with more provinces being added soon. Each province has its own specific medical form, and our platform handles the correct form for your jurisdiction.",
      },
      {
        question: "Will it require an in-person appointment?",
        answer:
          "Whether you need an in-person visit depends on your province and what is required to complete your examination—for example, some provinces require an in-person vision (eye) examination.\n\nIf an in-person visit is required, our clinic will call you the same day to schedule an appointment at one of our clinics, within 72 hours.",
      },
      {
        question: "What if the physician needs more information?",
        answer:
          "If the reviewing physician needs clarification or additional information, they will request it through the platform. In some cases, a brief online consultation may be required. You will be notified by email.",
      },
      {
        question: "Is my personal health information secure?",
        answer:
          "Absolutely. Our platform is fully PIPEDA-compliant, and all data is encrypted at rest and in transit. Your health information is stored securely and never shared without your explicit consent.",
      },
      {
        question: "What types of driver medical exams do you offer?",
        answer:
          "We support medical examinations for commercial driver licence (Class 1-4) renewals and new applications. The specific form and questions are tailored to your province.",
      },
      {
        question: "What if the physician cannot complete my medical form?",
        answer:
          "In rare cases where a physician cannot complete your form due to medical concerns requiring in-person evaluation, you will receive a full refund. The physician will provide guidance on next steps.",
      },
    ] satisfies readonly FaqItem[],
  },
  fr: {
    heading: "Questions fréquemment posées",
    subheading: "Tout ce que vous devez savoir sur notre service d'examen médical de conducteur en ligne.",
    items: [
      {
        question: "Qu'est-ce que DriversMedical.clinic?",
        answer:
          "DriversMedical.clinic est une plateforme de télémédecine qui permet aux conducteurs commerciaux d'obtenir leurs formulaires médicaux requis en ligne. Vous remplissez un questionnaire en ligne sécurisé, un médecin ou infirmière agréé examine vos informations et votre formulaire complété est livré numériquement.",
      },
      {
        question: "Le formulaire médical est-il accepté par les autorités provinciales?",
        answer:
          "Oui. Nos médecins sont agréés au Canada et autorisés à remplir les formulaires médicaux de conducteur. Les formulaires que nous fournissons sont spécifiques à la province et répondent à toutes les exigences provinciales.",
      },
      {
        question: "Combien de temps dure le processus complet?",
        answer:
          "Le questionnaire en ligne prend environ 10 à 15 minutes. Une fois soumis, un médecin ou infirmière examine votre dossier et complète votre formulaire, généralement dans les 24 heures. Votre formulaire complété et signé est ensuite livré à votre courriel en format PDF.",
      },
      {
        question: "Quelles provinces sont supportées?",
        answer:
          "Nous supportons actuellement le Nouveau-Brunswick et le Québec, avec d'autres provinces à venir bientôt. Chaque province a son propre formulaire médical spécifique, et notre plateforme gère le bon formulaire pour votre juridiction.",
      },
      {
        question: "Une visite en personne sera-t-elle requise?",
        answer:
          "Le besoin d'une visite en personne dépend de votre province et de ce qui est requis pour compléter votre examen — par exemple, certaines provinces exigent un examen de la vision (yeux) en personne.\n\nSi une visite en personne est requise, notre clinique vous appellera le jour même pour fixer un rendez-vous dans l'une de nos cliniques, dans les 72 heures.",
      },
      {
        question: "Que se passe-t-il si le médecin a besoin de plus d'informations?",
        answer:
          "Si le médecin réviseur a besoin de précisions ou d'informations supplémentaires, il les demandera via la plateforme. Dans certains cas, une brève consultation en ligne pourrait être nécessaire. Vous serez notifié par courriel.",
      },
      {
        question: "Mes informations personnelles de santé sont-elles sécurisées?",
        answer:
          "Absolument. Notre plateforme est entièrement conforme à la LPRPDE, et toutes les données sont chiffrées au repos et en transit. Vos informations de santé sont stockées de manière sécurisée et jamais partagées sans votre consentement explicite.",
      },
      {
        question: "Quels types d'examens médicaux de conducteur offrez-vous?",
        answer:
          "Nous supportons les examens médicaux pour les renouvellements et nouvelles demandes de permis de conducteur commercial (Classe 1-4). Le formulaire spécifique et les questions sont adaptés à votre province.",
      },
      {
        question: "Que se passe-t-il si le médecin ne peut pas compléter mon formulaire?",
        answer:
          "Dans les rares cas où un médecin ne peut pas compléter votre formulaire en raison de préoccupations médicales nécessitant une évaluation en personne, vous recevrez un remboursement complet. Le médecin vous fournira des conseils sur les prochaines étapes.",
      },
    ] satisfies readonly FaqItem[],
  },
} as const;

export type FaqContent = (typeof faq)["en"];

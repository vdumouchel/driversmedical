export const doctor = {
  en: {
    heading: "Examinations by certified Canadian healthcare specialists",
    body: "Every driver medical examination is conducted by physicians licensed to practice in Canada and authorized to complete driver medical forms.",
    imageSrc: "/images/doctor.webp",
    imageAlt: "Licensed Canadian physician",
    imageOverlay: "Licensed Physician",
    badge: {
      title: "Licensed Physicians and Nurses",
      sub: "Certified in Canada",
    },
    bullets: [
      "Licensed and registered with provincial medical colleges",
      "Experienced in completing commercial driver medical forms",
      "Thorough examinations following provincial guidelines",
    ],
    cta: "Get Started",
    /** Accent color for this section's background. Change per thematic. */
    accentColor: "#AA7B3E",
  },
  fr: {
    heading: "Examens par des spécialistes canadiens certifiés en santé",
    body: "Chaque examen médical de conducteur est effectué par des médecins autorisés à exercer au Canada et habilités à remplir les formulaires médicaux de conducteur.",
    imageSrc: "/images/doctor.webp",
    imageAlt: "Médecin canadien certifié",
    imageOverlay: "Médecin certifié",
    badge: {
      title: "Médecins et infirmières certifiés",
      sub: "Certifiés au Canada",
    },
    bullets: [
      "Certifiés et inscrits auprès des collèges de médecins provinciaux",
      "Expérimentés dans la complétion des formulaires médicaux pour conducteurs commerciaux",
      "Examens approfondis selon les directives provinciales",
    ],
    cta: "Commencer",
    accentColor: "#AA7B3E",
  },
} as const;

export type DoctorContent = (typeof doctor)["en"];

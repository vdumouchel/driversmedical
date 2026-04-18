export type TestimonialItem = {
  name: string;
  role: string;
  location: string;
  photo?: string;
  rating: number;
  content: string;
};

export const testimonials = {
  en: {
    heading: "Trusted by drivers across Canada",
    subheading: "See what other drivers are saying about their experience.",
    items: [
      {
        name: "Marc T.",
        role: "Long-Haul Trucker, Class 1",
        location: "New Brunswick",
        photo: "/images/testimonial-1.jpg",
        rating: 5,
        content:
          "After 20 years on the road, I know how hard it is to schedule appointments around my routes. Filled out the online form at a rest stop, and had my medical in my email before my next delivery. This is how it should be done.",
      },
      {
        name: "Lisa M.",
        role: "Owner-Operator",
        location: "Quebec",
        photo: "/images/testimonial-2.jpg",
        rating: 5,
        content:
          "As an owner-operator, every day off the road costs me money. DriversMedical let me renew my medical without losing a load. The online form covered everything, and I had my form the next day.",
      },
      {
        name: "James R.",
        role: "Fleet Driver, Class 3",
        location: "Ontario",
        rating: 5,
        content:
          "My dispatcher told me about DriversMedical when my medical was expiring. Did the whole thing from my phone during my mandatory rest period. Professional doctor, quick process, and my company accepted the form no problem.",
      },
    ] satisfies readonly TestimonialItem[],
  },
  fr: {
    heading: "La confiance des conducteurs partout au Canada",
    subheading: "Découvrez ce que les autres conducteurs disent de leur expérience.",
    items: [
      {
        name: "Marc T.",
        role: "Camionneur longue distance, Classe 1",
        location: "Nouveau-Brunswick",
        photo: "/images/testimonial-1.jpg",
        rating: 5,
        content:
          "Après 20 ans sur la route, je sais à quel point c'est difficile de planifier des rendez-vous autour de mes trajets. J'ai rempli le formulaire en ligne à une halte routière et j'avais mon médical dans mon courriel avant ma prochaine livraison. C'est comme ça que ça devrait se faire.",
      },
      {
        name: "Lisa M.",
        role: "Propriétaire-exploitante",
        location: "Québec",
        photo: "/images/testimonial-2.jpg",
        rating: 5,
        content:
          "En tant que propriétaire-exploitante, chaque jour hors de la route me coûte de l'argent. DriversMedical m'a permis de renouveler mon médical sans perdre un chargement. Le formulaire en ligne couvrait tout, et j'avais mon formulaire le lendemain.",
      },
      {
        name: "James R.",
        role: "Conducteur de flotte, Classe 3",
        location: "Ontario",
        rating: 5,
        content:
          "Mon répartiteur m'a parlé de DriversMedical quand mon médical allait expirer. J'ai fait tout ça depuis mon téléphone pendant ma période de repos obligatoire. Médecin professionnel, processus rapide, et ma compagnie a accepté le formulaire sans problème.",
      },
    ] satisfies readonly TestimonialItem[],
  },
} as const;

export type TestimonialsContent = (typeof testimonials)["en"];

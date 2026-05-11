import type { ProvinceSchema } from "./types";

export const newBrunswickSchema: ProvinceSchema = {
  provinceSlug: "new-brunswick",
  provinceName: "New Brunswick",
  formTitle: "New Brunswick Medical Fitness Report",
  version: "2.0.0",
  metadata: {
    estimatedMinutes: 5,
    regulatoryBody: "Department of Justice and Public Safety — Motor Vehicle Branch",
  },
  groups: [
    {
      id: "personal_info",
      title: { en: "Your personal information", fr: "Vos informations personnelles" },
      description: {
        en: "We'll use this to prepare your Medical Fitness Report.",
        fr: "Nous utiliserons ces informations pour préparer votre rapport d'état de santé.",
      },
      columns: 2,
    },
    {
      id: "musculoskeletal_detail",
      title: { en: "Musculoskeletal & Motor Function", fr: "Système musculo-squelettique et motricité" },
      description: {
        en: "Answer Yes or No for each question. Leave blank if unsure — your physician will confirm.",
        fr: "Répondez Oui ou Non à chaque question. Laissez vide si vous n'êtes pas sûr — votre médecin confirmera.",
      },
      columns: 1,
    },
    {
      id: "diabetes_detail",
      title: { en: "Diabetes", fr: "Diabète" },
      description: {
        en: "Answer Yes or No.",
        fr: "Répondez Oui ou Non.",
      },
      columns: 1,
    },
    {
      id: "cardiovascular_detail",
      title: { en: "Heart & Lung Conditions", fr: "Maladies cardiaques et pulmonaires" },
      description: {
        en: "Answer Yes or No for each question.",
        fr: "Répondez Oui ou Non à chaque question.",
      },
      columns: 1,
    },
    {
      id: "hearing_detail",
      title: { en: "Hearing", fr: "Audition" },
      description: {
        en: "Answer Yes or No.",
        fr: "Répondez Oui ou Non.",
      },
      columns: 1,
    },
    {
      id: "consciousness_detail",
      title: { en: "Loss of Consciousness", fr: "Perte de conscience" },
      description: {
        en: "Answer Yes or No.",
        fr: "Répondez Oui ou Non.",
      },
      columns: 1,
    },
    {
      id: "medications_detail",
      title: { en: "Prescribed Medications", fr: "Médicaments prescrits" },
      description: {
        en: "Answer Yes or No.",
        fr: "Répondez Oui ou Non.",
      },
      columns: 1,
    },
    {
      id: "substance_detail",
      title: { en: "Substance Use", fr: "Consommation de substances" },
      description: {
        en: "Answer Yes or No.",
        fr: "Répondez Oui ou Non.",
      },
      columns: 1,
    },
    {
      id: "psychiatric_detail",
      title: { en: "Psychiatric & Mental Health", fr: "Troubles psychiatriques et santé mentale" },
      description: {
        en: "Answer Yes or No.",
        fr: "Répondez Oui ou Non.",
      },
      columns: 1,
    },
    {
      id: "other_conditions_detail",
      title: { en: "Other Conditions", fr: "Autres conditions médicales" },
      description: {
        en: "Answer Yes or No.",
        fr: "Répondez Oui ou Non.",
      },
      columns: 1,
    },
  ],
  fields: [
    // ─── PERSONAL INFORMATION ─────────────────────────────────────────────────
    {
      id: "first_name",
      type: "text",
      section: { en: "Personal Information", fr: "Informations personnelles" },
      groupId: "personal_info",
      label: { en: "First name", fr: "Prénom" },
      placeholder: { en: "First name", fr: "Prénom" },
      validation: [{ type: "required", message: { en: "First name is required", fr: "Le prénom est requis" } }],
    },
    {
      id: "last_name",
      type: "text",
      section: { en: "Personal Information", fr: "Informations personnelles" },
      groupId: "personal_info",
      label: { en: "Last name", fr: "Nom de famille" },
      placeholder: { en: "Last name", fr: "Nom de famille" },
      validation: [{ type: "required", message: { en: "Last name is required", fr: "Le nom de famille est requis" } }],
    },
    {
      id: "email",
      type: "email",
      section: { en: "Personal Information", fr: "Informations personnelles" },
      groupId: "personal_info",
      label: { en: "Email address", fr: "Adresse courriel" },
      placeholder: { en: "you@example.com", fr: "vous@exemple.com" },
      validation: [{ type: "required", message: { en: "Email is required", fr: "L'adresse courriel est requise" } }],
    },
    {
      id: "date_of_birth",
      type: "date",
      section: { en: "Personal Information", fr: "Informations personnelles" },
      groupId: "personal_info",
      label: { en: "Date of birth", fr: "Date de naissance" },
      validation: [{ type: "required", message: { en: "Date of birth is required", fr: "La date de naissance est requise" } }],
    },
    {
      id: "address",
      type: "text",
      section: { en: "Personal Information", fr: "Informations personnelles" },
      groupId: "personal_info",
      label: { en: "Street address", fr: "Adresse" },
      placeholder: { en: "123 Main Street, Apt 4", fr: "123, rue Principale, app. 4" },
      validation: [{ type: "required", message: { en: "Address is required", fr: "L'adresse est requise" } }],
    },
    {
      id: "city",
      type: "text",
      section: { en: "Personal Information", fr: "Informations personnelles" },
      groupId: "personal_info",
      label: { en: "City", fr: "Ville" },
      placeholder: { en: "Fredericton", fr: "Fredericton" },
      validation: [{ type: "required", message: { en: "City is required", fr: "La ville est requise" } }],
    },
    {
      id: "postal_code",
      type: "text",
      section: { en: "Personal Information", fr: "Informations personnelles" },
      groupId: "personal_info",
      label: { en: "Postal code", fr: "Code postal" },
      mask: "A1A 1A1",
      validation: [{ type: "required", message: { en: "Postal code is required", fr: "Le code postal est requis" } }],
    },
    {
      id: "phone",
      type: "phone",
      section: { en: "Personal Information", fr: "Informations personnelles" },
      groupId: "personal_info",
      label: { en: "Phone where to reach you", fr: "Téléphone où vous joindre" },
      placeholder: { en: "(506) 000-0000", fr: "(506) 000-0000" },
      validation: [
        { type: "required", message: { en: "Phone number is required", fr: "Le numéro de téléphone est requis" } },
        { type: "pattern", value: "^\\+?1?[\\s.\\-]?\\(?\\d{3}\\)?[\\s.\\-]?\\d{3}[\\s.\\-]?\\d{4}$", message: { en: "Enter a valid phone number, e.g. (506) 555-1234", fr: "Entrez un numéro valide, ex. (506) 555-1234" } },
      ],
    },
    {
      id: "licence_number",
      type: "text",
      section: { en: "Personal Information", fr: "Informations personnelles" },
      groupId: "personal_info",
      label: { en: "Driver's licence number", fr: "Numéro de permis de conduire" },
      mask: "XXXXXXX",
      validation: [{ type: "required", message: { en: "Licence number is required", fr: "Le numéro de permis est requis" } }],
    },
    {
      id: "licence_class",
      type: "option-select",
      section: { en: "Personal Information", fr: "Informations personnelles" },
      groupId: "personal_info",
      label: { en: "Licence class applied for", fr: "Classe de permis demandée" },
      placeholder: { en: "Select a class", fr: "Sélectionner une classe" },
      options: [
        { label: { en: "Class 1", fr: "Classe 1" }, value: "class_1", description: { en: "Semi-trailer trucks", fr: "Camions semi-remorques" } },
        { label: { en: "Class 2", fr: "Classe 2" }, value: "class_2", description: { en: "Buses", fr: "Autobus" } },
        { label: { en: "Class 3", fr: "Classe 3" }, value: "class_3", description: { en: "Large trucks", fr: "Gros camions" } },
        { label: { en: "Class 4", fr: "Classe 4" }, value: "class_4", description: { en: "Ambulances, small buses", fr: "Ambulances, minibus" } },
        { label: { en: "Class 5", fr: "Classe 5" }, value: "class_5", description: { en: "Regular passenger vehicles", fr: "Véhicules de tourisme" } },
      ],
      validation: [{ type: "required", message: { en: "Licence class is required", fr: "La classe de permis est requise" } }],
    },

    // ─── Q1 & Q2 — MUSCULOSKELETAL ────────────────────────────────────────────
    {
      id: "limb_impairment",
      type: "yes-no",
      section: { en: "Medical History", fr: "Antécédents médicaux" },
      groupId: "musculoskeletal_detail",
      label: {
        en: "1. Do you have an amputation, weakness, or loss of use of a limb (arm, leg, hand, or foot), or any condition that limits your movement or coordination in a way that could affect your ability to drive safely?",
        fr: "1. Avez-vous une amputation, une faiblesse ou une perte d'usage d'un membre (bras, jambe, main ou pied), ou une condition limitant votre mobilité ou votre coordination de façon à nuire à votre conduite sécuritaire?",
      },
    },
    {
      id: "musculoskeletal_nervous",
      type: "yes-no",
      section: { en: "Medical History", fr: "Antécédents médicaux" },
      groupId: "musculoskeletal_detail",
      label: {
        en: "2. Do you have any muscle, bone, or nerve condition (other than mentioned above) that could make it unsafe for you to drive?",
        fr: "2. Avez-vous une condition musculaire, osseuse ou nerveuse (autre que mentionnée ci-dessus) pouvant rendre la conduite dangereuse pour vous?",
      },
    },
    {
      id: "musculoskeletal_medications",
      type: "medication-table",
      section: { en: "Medical History", fr: "Antécédents médicaux" },
      groupId: "musculoskeletal_detail",
      label: { en: "Medications", fr: "Médicaments" },
    },

    // ─── Q3 — DIABETES ────────────────────────────────────────────────────────
    {
      id: "diabetes_controlled",
      type: "yes-no",
      section: { en: "Medical History", fr: "Antécédents médicaux" },
      groupId: "diabetes_detail",
      label: {
        en: "3. Do you have diabetes that requires insulin injections or blood sugar-lowering pills (oral medication) to manage?",
        fr: "3. Avez-vous un diabète nécessitant des injections d'insuline ou des médicaments oraux (comprimés) pour contrôler votre glycémie?",
      },
    },
    {
      id: "diabetes_treatment_type",
      type: "checkboxes",
      section: { en: "Medical History", fr: "Antécédents médicaux" },
      groupId: "diabetes_detail",
      label: { en: "Treatment used (select all that apply):", fr: "Traitement utilisé (sélectionnez tout ce qui s'applique) :" },
      options: [
        { label: { en: "Insulin injections", fr: "Injections d'insuline" }, value: "insulin" },
        { label: { en: "Oral hypoglycemic agents (blood sugar lowering pills)", fr: "Hypoglycémiants oraux (comprimés pour réduire la glycémie)" }, value: "oral_agents" },
      ],
      conditions: [{ field: "diabetes_controlled", operator: "eq", value: "yes" }],
    },
    {
      id: "diabetes_medications",
      type: "medication-table",
      section: { en: "Medical History", fr: "Antécédents médicaux" },
      groupId: "diabetes_detail",
      label: { en: "Medications", fr: "Médicaments" },
    },

    // ─── Q4–Q6 — HEART & LUNG ─────────────────────────────────────────────────
    {
      id: "cardiac_event",
      type: "yes-no",
      section: { en: "Medical History", fr: "Antécédents médicaux" },
      groupId: "cardiovascular_detail",
      label: {
        en: "4. Have you ever had a heart attack, chest pain (angina), blocked heart arteries (coronary insufficiency), or a blood clot in the heart (thrombosis)?",
        fr: "4. Avez-vous déjà subi une crise cardiaque, des douleurs thoraciques (angine de poitrine), des artères coronaires bloquées (insuffisance coronarienne) ou un caillot sanguin au cœur (thrombose)?",
      },
    },
    {
      id: "cardiac_first_fully_recovered",
      type: "option-select",
      section: { en: "Medical History", fr: "Antécédents médicaux" },
      groupId: "cardiovascular_detail",
      label: {
        en: "If this was your first such episode — have you fully recovered?",
        fr: "Si c'était votre premier épisode de ce type — êtes-vous complètement rétabli?",
      },
      options: [
        { label: { en: "Yes, fully recovered", fr: "Oui, complètement rétabli" }, value: "yes" },
        { label: { en: "No, not fully recovered", fr: "Non, pas complètement rétabli" }, value: "no" },
        { label: { en: "Not a first incidence", fr: "Pas une première fois" }, value: "not_first" },
      ],
      conditions: [{ field: "cardiac_event", operator: "eq", value: "yes" }],
    },
    {
      id: "heart_lung_disease",
      type: "yes-no",
      section: { en: "Medical History", fr: "Antécédents médicaux" },
      groupId: "cardiovascular_detail",
      label: {
        en: "5. Do you have a heart or lung condition, such as an irregular heartbeat (arrhythmia), breathing difficulties, or any other respiratory problem that affects your daily life?",
        fr: "5. Avez-vous une maladie cardiaque ou pulmonaire, comme un rythme cardiaque irrégulier (arythmie), des difficultés respiratoires ou tout autre problème pulmonaire affectant votre quotidien?",
      },
    },
    {
      id: "hypertension_hypotension",
      type: "yes-no",
      section: { en: "Medical History", fr: "Antécédents médicaux" },
      groupId: "cardiovascular_detail",
      label: {
        en: "6. Do you have high blood pressure (hypertension) and experience dizziness or lightheadedness when you stand up, especially while taking medication for it?",
        fr: "6. Avez-vous de l'hypertension artérielle (haute pression) et ressentez-vous des étourdissements ou des vertiges lorsque vous vous levez, surtout lorsque vous prenez un traitement pour celle-ci?",
      },
    },
    {
      id: "cardiovascular_medications",
      type: "medication-table",
      section: { en: "Medical History", fr: "Antécédents médicaux" },
      groupId: "cardiovascular_detail",
      label: { en: "Medications", fr: "Médicaments" },
    },

    // ─── Q7 — HEARING ─────────────────────────────────────────────────────────
    {
      id: "hearing_assistance",
      type: "yes-no",
      section: { en: "Medical History", fr: "Antécédents médicaux" },
      groupId: "hearing_detail",
      label: {
        en: "7. Do you need a hearing aid to hear properly?",
        fr: "7. Avez-vous besoin d'un appareil auditif pour bien entendre?",
      },
    },

    // ─── Q8 — LOSS OF CONSCIOUSNESS ───────────────────────────────────────────
    {
      id: "loss_of_consciousness",
      type: "yes-no",
      section: { en: "Medical History", fr: "Antécédents médicaux" },
      groupId: "consciousness_detail",
      label: {
        en: "8. Have you ever blacked out, had a seizure, or fainted due to a long-term or recurring medical condition (e.g. epilepsy, fainting spells)?",
        fr: "8. Avez-vous déjà perdu connaissance, eu une crise épileptique ou vous êtes-vous évanoui en raison d'une condition médicale chronique ou récurrente (ex. épilepsie, épisodes de syncope)?",
      },
    },
    {
      id: "loss_of_consciousness_last_date",
      type: "date",
      section: { en: "Medical History", fr: "Antécédents médicaux" },
      groupId: "consciousness_detail",
      label: { en: "Date of most recent episode", fr: "Date du dernier épisode" },
      conditions: [{ field: "loss_of_consciousness", operator: "eq", value: "yes" }],
    },
    {
      id: "consciousness_medications",
      type: "medication-table",
      section: { en: "Medical History", fr: "Antécédents médicaux" },
      groupId: "consciousness_detail",
      label: { en: "Medications", fr: "Médicaments" },
    },

    // ─── Q9 — PRESCRIBED MEDICATIONS AFFECTING DRIVING ───────────────────────
    {
      id: "prescribed_meds_impair",
      type: "yes-no",
      section: { en: "Medical History", fr: "Antécédents médicaux" },
      groupId: "medications_detail",
      label: {
        en: "9. Are you regularly taking a prescribed medication that, even at the recommended dose, could make it unsafe for you to drive (e.g. strong painkillers, sleep aids, anti-anxiety medications, sedatives)?",
        fr: "9. Prenez-vous régulièrement un médicament prescrit qui, même à la dose recommandée, pourrait nuire à votre capacité à conduire de façon sécuritaire (ex. analgésiques puissants, somnifères, médicaments contre l'anxiété, sédatifs)?",
      },
    },
    {
      id: "impairing_medications_list",
      type: "medication-table",
      section: { en: "Medical History", fr: "Antécédents médicaux" },
      groupId: "medications_detail",
      label: { en: "If yes, list the medication(s) that may impair driving:", fr: "Si oui, listez le(s) médicament(s) pouvant nuire à la conduite :" },
    },

    // ─── Q10 — SUBSTANCE USE ──────────────────────────────────────────────────
    {
      id: "substance_addiction",
      type: "yes-no",
      section: { en: "Medical History", fr: "Antécédents médicaux" },
      groupId: "substance_detail",
      label: {
        en: "10. Have you been clinically diagnosed with alcohol or drug addiction (substance use disorder)?",
        fr: "10. Avez-vous reçu un diagnostic clinique de dépendance à l'alcool ou à une drogue (trouble lié à l'utilisation de substances)?",
      },
    },
    {
      id: "substance_medications",
      type: "medication-table",
      section: { en: "Medical History", fr: "Antécédents médicaux" },
      groupId: "substance_detail",
      label: { en: "Medications", fr: "Médicaments" },
    },

    // ─── Q11 — PSYCHIATRIC ────────────────────────────────────────────────────
    {
      id: "psychiatric_disorder",
      type: "yes-no",
      section: { en: "Medical History", fr: "Antécédents médicaux" },
      groupId: "psychiatric_detail",
      label: {
        en: "11. Do you have a long-term psychiatric condition confirmed by a doctor — particularly severe depression, thoughts of self-harm, or a history of impulsive or aggressive behaviour?",
        fr: "11. Avez-vous une condition psychiatrique persistante confirmée par un médecin — notamment une dépression sévère, des pensées suicidaires ou des antécédents de comportements impulsifs ou agressifs?",
      },
    },
    {
      id: "psychiatric_medications",
      type: "medication-table",
      section: { en: "Medical History", fr: "Antécédents médicaux" },
      groupId: "psychiatric_detail",
      label: { en: "Medications", fr: "Médicaments" },
    },

    // ─── Q12 — OTHER CONDITIONS ───────────────────────────────────────────────
    {
      id: "other_impairment",
      type: "yes-no",
      section: { en: "Medical History", fr: "Antécédents médicaux" },
      groupId: "other_conditions_detail",
      label: {
        en: "12. Do you have any other physical or mental condition not mentioned above that could significantly affect your ability to drive safely?",
        fr: "12. Avez-vous une autre condition physique ou mentale non mentionnée ci-dessus qui pourrait nuire considérablement à votre capacité à conduire de façon sécuritaire?",
      },
    },
    {
      id: "other_impairment_description",
      type: "textarea",
      section: { en: "Medical History", fr: "Antécédents médicaux" },
      groupId: "other_conditions_detail",
      label: { en: "Please briefly describe the condition:", fr: "Veuillez décrire brièvement la condition :" },
      placeholder: { en: "Condition name and how it may affect driving", fr: "Nom de la condition et comment elle peut affecter la conduite" },
      conditions: [{ field: "other_impairment", operator: "eq", value: "yes" }],
    },
    {
      id: "other_medications",
      type: "medication-table",
      section: { en: "Medical History", fr: "Antécédents médicaux" },
      groupId: "other_conditions_detail",
      label: { en: "Medications", fr: "Médicaments" },
    },

  ],
};

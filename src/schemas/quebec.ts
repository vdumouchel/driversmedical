import type { InPersonAppointment } from "@/config/provinces";
import type { ProvinceSchema } from "./types";

/**
 * Praxis clinics where Quebec applicants can book their mandatory in-person
 * eye examination. Strings are inline `{ en, fr }` literals — same shape as
 * every other province-specific string. Most values are identical between
 * locales (proper nouns, civic addresses); the FR variant is provided
 * verbatim so resolveLS() returns a stable string regardless of locale.
 */
// Authored alphabetically by clinic city so the option-select dropdown
// renders in a stable, predictable order without runtime sorting.
export const quebecClinics: InPersonAppointment[] = [
  {
    id: "praxis_blainville",
    name: { en: "Clinique Praxis Blainville", fr: "Clinique Praxis Blainville" },
    address: {
      en: "794 Bd du Curé-Labelle, Suite 201, Blainville, QC J7C 2K5",
      fr: "794 Bd du Curé-Labelle, Suite 201, Blainville, QC J7C 2K5",
    },
    label: {
      en: "Clinique Praxis Blainville — 794 Bd du Curé-Labelle, Suite 201, Blainville, QC J7C 2K5",
      fr: "Clinique Praxis Blainville — 794 Bd du Curé-Labelle, Suite 201, Blainville, QC J7C 2K5",
    },
  },
  {
    id: "praxis_brossard",
    name: { en: "Clinique Praxis Brossard", fr: "Clinique Praxis Brossard" },
    address: {
      en: "8000 Bd Taschereau, Brossard, QC J4X 1C2",
      fr: "8000 Bd Taschereau, Brossard, QC J4X 1C2",
    },
    label: {
      en: "Clinique Praxis Brossard — 8000 Bd Taschereau, Brossard, QC J4X 1C2",
      fr: "Clinique Praxis Brossard — 8000 Bd Taschereau, Brossard, QC J4X 1C2",
    },
  },
  {
    id: "praxis_gatineau",
    name: { en: "Clinique Praxis Gatineau", fr: "Clinique Praxis Gatineau" },
    address: {
      en: "920 Bd Saint-Joseph, Gatineau, QC J8Z 1S9",
      fr: "920 Bd Saint-Joseph, Gatineau, QC J8Z 1S9",
    },
    label: {
      en: "Clinique Praxis Gatineau — 920 Bd Saint-Joseph, Gatineau, QC J8Z 1S9",
      fr: "Clinique Praxis Gatineau — 920 Bd Saint-Joseph, Gatineau, QC J8Z 1S9",
    },
  },
  {
    id: "praxis_laval",
    name: { en: "Clinique Praxis Laval", fr: "Clinique Praxis Laval" },
    address: {
      en: "3131 Bd de la Concorde E, Laval, QC H7E 4W4",
      fr: "3131 Bd de la Concorde E, Laval, QC H7E 4W4",
    },
    label: {
      en: "Clinique Praxis Laval — 3131 Bd de la Concorde E, Laval, QC H7E 4W4",
      fr: "Clinique Praxis Laval — 3131 Bd de la Concorde E, Laval, QC H7E 4W4",
    },
  },
  {
    id: "praxis_longueuil",
    name: { en: "Clinique Praxis Longueuil", fr: "Clinique Praxis Longueuil" },
    address: {
      en: "1111 Rue Saint-Charles O, Longueuil, QC J4K 5G4",
      fr: "1111 Rue Saint-Charles O, Longueuil, QC J4K 5G4",
    },
    label: {
      en: "Clinique Praxis Longueuil — 1111 Rue Saint-Charles O, Longueuil, QC J4K 5G4",
      fr: "Clinique Praxis Longueuil — 1111 Rue Saint-Charles O, Longueuil, QC J4K 5G4",
    },
  },
  {
    id: "praxis_montreal",
    name: { en: "Clinique Praxis Montréal", fr: "Clinique Praxis Montréal" },
    address: {
      en: "1100 Bd Crémazie E, Suite 110, Montréal, QC H2P 2X2",
      fr: "1100 Bd Crémazie E, Suite 110, Montréal, QC H2P 2X2",
    },
    label: {
      en: "Clinique Praxis Montréal — 1100 Bd Crémazie E, Suite 110, Montréal, QC H2P 2X2",
      fr: "Clinique Praxis Montréal — 1100 Bd Crémazie E, Suite 110, Montréal, QC H2P 2X2",
    },
  },
  {
    id: "praxis_quebec",
    name: { en: "Clinique Praxis Québec", fr: "Clinique Praxis Québec" },
    address: {
      en: "2600 Bd Laurier, Québec, QC G1V 4T3",
      fr: "2600 Bd Laurier, Québec, QC G1V 4T3",
    },
    label: {
      en: "Clinique Praxis Québec — 2600 Bd Laurier, Québec, QC G1V 4T3",
      fr: "Clinique Praxis Québec — 2600 Bd Laurier, Québec, QC G1V 4T3",
    },
  },
  {
    id: "praxis_sherbrooke",
    name: { en: "Clinique Praxis Sherbrooke", fr: "Clinique Praxis Sherbrooke" },
    address: {
      en: "2050 Rue King O, Sherbrooke, QC J1J 2E8",
      fr: "2050 Rue King O, Sherbrooke, QC J1J 2E8",
    },
    label: {
      en: "Clinique Praxis Sherbrooke — 2050 Rue King O, Sherbrooke, QC J1J 2E8",
      fr: "Clinique Praxis Sherbrooke — 2050 Rue King O, Sherbrooke, QC J1J 2E8",
    },
  },
];

export const quebecInPersonCopy = {
  en: "Quebec driver's medical assessments require an in-person eye examination. After payment, the clinic's admin staff will call you within 72 hours to schedule your appointment.",
  fr: "L'évaluation médicale des conducteurs au Québec nécessite un examen visuel en personne. Après le paiement, le personnel administratif de la clinique vous appellera dans les 72 heures pour planifier votre rendez-vous.",
};

export const quebecInPersonStepLabel = {
  en: "Choose your preferred Clinique Praxis location",
  fr: "Choisissez votre Clinique Praxis préférée",
};

export const quebecSchema: ProvinceSchema = {
  provinceSlug: "quebec",
  provinceName: "Québec",
  formTitle: "SAAQ Medical Examination Report — Form 28",
  version: "1.0.0",
  metadata: {
    estimatedMinutes: 15,
    formCode: "Form 28",
    regulatoryBody: "Société de l'assurance automobile du Québec (SAAQ)",
  },
  groups: [
    {
      id: "identification",
      title: { en: "Your personal information", fr: "Vos informations personnelles" },
      description: {
        en: "We will use this to prepare your SAAQ Form 28.",
        fr: "Nous utiliserons ces informations pour préparer votre formulaire 28 de la SAAQ.",
      },
      columns: 2,
    },
    {
      id: "vision_detail",
      title: { en: "Visual Disorders", fr: "Troubles visuels" },
      description: { en: "Check all that apply. Leave blank if none.", fr: "Cochez tout ce qui s'applique. Laissez vide si aucun." },
      columns: 1,
    },
    {
      id: "hearing_detail",
      title: { en: "Hearing Disorders", fr: "Troubles auditifs" },
      description: { en: "Check all that apply. Leave blank if none.", fr: "Cochez tout ce qui s'applique. Laissez vide si aucun." },
      columns: 1,
    },
    {
      id: "neurological_detail",
      title: { en: "Neurological Disorders", fr: "Troubles neurologiques" },
      description: { en: "Check all that apply. Leave blank if none.", fr: "Cochez tout ce qui s'applique. Laissez vide si aucun." },
      columns: 1,
    },
    {
      id: "epilepsy_detail",
      title: { en: "Epilepsy and Seizures", fr: "Épilepsie et convulsions" },
      description: { en: "Check all that apply. Leave blank if none.", fr: "Cochez tout ce qui s'applique. Laissez vide si aucun." },
      columns: 2,
    },
    {
      id: "cardiovascular_detail",
      title: { en: "Heart and Vascular Disorders", fr: "Troubles cardiaques et vasculaires" },
      description: { en: "Check all that apply. Leave blank if none.", fr: "Cochez tout ce qui s'applique. Laissez vide si aucun." },
      columns: 1,
    },
    { id: "cardiovascular_syncopes_detail", columns: 2 },
    {
      id: "respiratory_detail",
      title: { en: "Respiratory Disorders", fr: "Troubles respiratoires" },
      description: { en: "Check all that apply. Leave blank if none.", fr: "Cochez tout ce qui s'applique. Laissez vide si aucun." },
      columns: 1,
    },
    {
      id: "diabetes_detail",
      title: { en: "Diabetes", fr: "Diabète" },
      description: { en: "Complete only if you have diabetes. Leave blank if none.", fr: "Complétez seulement si vous avez le diabète. Laissez vide si aucun." },
      columns: 1,
    },
    {
      id: "psychiatric_detail",
      title: { en: "Psychiatric Disorders", fr: "Troubles psychiatriques" },
      description: { en: "Check all that apply. Leave blank if none.", fr: "Cochez tout ce qui s'applique. Laissez vide si aucun." },
      columns: 1,
    },
    {
      id: "substance_detail",
      title: { en: "Substance Use Disorders", fr: "Troubles liés à l'utilisation de substances" },
      description: { en: "Check all that apply. Leave blank if none.", fr: "Cochez tout ce qui s'applique. Laissez vide si aucun." },
      columns: 1,
    },
    {
      id: "functional_detail",
      title: { en: "Functional Limitations", fr: "Limitations fonctionnelles" },
      description: { en: "Check all that apply. Leave blank if none.", fr: "Cochez tout ce qui s'applique. Laissez vide si aucun." },
      columns: 1,
    },
    {
      id: "medications_group",
      title: { en: "Current Medications", fr: "Médicaments actuels" },
      description: { en: "List all medications you are currently taking.", fr: "Listez tous les médicaments que vous prenez actuellement." },
      columns: 1,
    },
    {
      id: "in_person_appointment",
      title: {
        en: "In person visit to complete examination and form",
        fr: "Visite en personne pour compléter l'examen et le formulaire",
      },
      columns: 1,
    },
  ],
  fields: [
    // ─── IDENTIFICATION ───────────────────────────────────────────────────────
    {
      id: "first_name",
      type: "text",
      section: { en: "Personal Information", fr: "Informations personnelles" },
      groupId: "identification",
      label: { en: "First name", fr: "Prénom" },
      placeholder: { en: "First name", fr: "Prénom" },
      validation: [{ type: "required", message: { en: "First name is required", fr: "Le prénom est requis" } }],
    },
    {
      id: "last_name",
      type: "text",
      section: { en: "Personal Information", fr: "Informations personnelles" },
      groupId: "identification",
      label: { en: "Last name", fr: "Nom de famille" },
      placeholder: { en: "Last name", fr: "Nom de famille" },
      validation: [{ type: "required", message: { en: "Last name is required", fr: "Le nom de famille est requis" } }],
    },
    {
      id: "email",
      type: "email",
      section: { en: "Personal Information", fr: "Informations personnelles" },
      groupId: "identification",
      label: { en: "Email address", fr: "Adresse courriel" },
      placeholder: { en: "you@example.com", fr: "vous@exemple.com" },
      validation: [{ type: "required", message: { en: "Email is required", fr: "L'adresse courriel est requise" } }],
    },
    {
      id: "date_of_birth",
      type: "date",
      section: { en: "Personal Information", fr: "Informations personnelles" },
      groupId: "identification",
      label: { en: "Date of birth", fr: "Date de naissance" },
      validation: [{ type: "required", message: { en: "Date of birth is required", fr: "La date de naissance est requise" } }],
    },
    {
      id: "address",
      type: "text",
      section: { en: "Personal Information", fr: "Informations personnelles" },
      groupId: "identification",
      label: { en: "Street address", fr: "Adresse" },
      placeholder: { en: "123 Main Street, Apt 4", fr: "123, rue Principale, app. 4" },
      validation: [{ type: "required", message: { en: "Address is required", fr: "L'adresse est requise" } }],
    },
    {
      id: "city",
      type: "text",
      section: { en: "Personal Information", fr: "Informations personnelles" },
      groupId: "identification",
      label: { en: "City", fr: "Ville" },
      placeholder: { en: "Montreal", fr: "Montréal" },
      validation: [{ type: "required", message: { en: "City is required", fr: "La ville est requise" } }],
    },
    {
      id: "postal_code",
      type: "text",
      section: { en: "Personal Information", fr: "Informations personnelles" },
      groupId: "identification",
      label: { en: "Postal code", fr: "Code postal" },
      mask: "A1A 1A1",
      validation: [{ type: "required", message: { en: "Postal code is required", fr: "Le code postal est requis" } }],
    },
    {
      id: "phone",
      type: "phone",
      section: { en: "Personal Information", fr: "Informations personnelles" },
      groupId: "identification",
      label: { en: "Phone where to reach you", fr: "Téléphone où vous joindre" },
      placeholder: { en: "(514) 000-0000", fr: "(514) 000-0000" },
      validation: [
        { type: "required", message: { en: "Phone number is required", fr: "Le numéro de téléphone est requis" } },
        { type: "pattern", value: "^\\+?1?[\\s.\\-]?\\(?\\d{3}\\)?[\\s.\\-]?\\d{3}[\\s.\\-]?\\d{4}$", message: { en: "Enter a valid phone number, e.g. (514) 555-1234", fr: "Entrez un numéro valide, ex. (514) 555-1234" } },
      ],
    },
    {
      id: "licence_number",
      type: "text",
      section: { en: "Personal Information", fr: "Informations personnelles" },
      groupId: "identification",
      label: { en: "Driver's licence number", fr: "Numéro de permis de conduire" },
      mask: "AXXXX-XXXXXX-XX",
      validation: [{ type: "required", message: { en: "Licence number is required", fr: "Le numéro de permis est requis" } }],
    },
    {
      id: "licence_class",
      type: "option-select",
      section: { en: "Personal Information", fr: "Informations personnelles" },
      groupId: "identification",
      label: { en: "Licence class applied for", fr: "Classe de permis demandée" },
      placeholder: { en: "Select a class", fr: "Sélectionner une classe" },
      options: [
        { label: { en: "Class 1", fr: "Classe 1" }, value: "class_1", description: { en: "Semi-trailer trucks (combination vehicles)", fr: "Camions semi-remorques (véhicules en combinaison)" } },
        { label: { en: "Class 2", fr: "Classe 2" }, value: "class_2", description: { en: "Buses (more than 24 passengers)", fr: "Autobus (plus de 24 passagers)" } },
        { label: { en: "Class 3", fr: "Classe 3" }, value: "class_3", description: { en: "Large trucks (rigid trucks)", fr: "Gros camions (camions rigides)" } },
        { label: { en: "Class 4A", fr: "Classe 4A" }, value: "class_4a", description: { en: "Ambulances", fr: "Ambulances" } },
        { label: { en: "Class 4B", fr: "Classe 4B" }, value: "class_4b", description: { en: "Small buses (up to 24 passengers)", fr: "Minibus (jusqu'à 24 passagers)" } },
      ],
      validation: [{ type: "required", message: { en: "Licence class is required", fr: "La classe de permis est requise" } }],
    },

    // ─── SECTION 1 — VISUAL DISORDERS ─────────────────────────────────────────
    {
      id: "wears_corrective_lenses",
      type: "yes-no",
      section: { en: "Section 1 — Visual Disorders", fr: "Section 1 — Troubles visuels" },
      groupId: "vision_detail",
      label: { en: "Do you wear corrective lenses (glasses or contacts)?", fr: "Portez-vous des lentilles correctrices (lunettes ou verres de contact)?" },
    },
    {
      id: "vision_conditions",
      type: "checkboxes",
      section: { en: "Section 1 — Visual Disorders", fr: "Section 1 — Troubles visuels" },
      groupId: "vision_detail",
      label: { en: "Select all that apply:", fr: "Sélectionnez tout ce qui s'applique :" },
      options: [
        { label: { en: "Bilateral cataracts (clouding of the lens in both eyes)", fr: "Cataractes bilatérales (opacification du cristallin des deux yeux)" }, value: "bilateral_cataracts" },
        { label: { en: "Pseudophakia (artificial lens implant after cataract removal)", fr: "Pseudophakie (implant de lentille artificielle après extraction de la cataracte)" }, value: "pseudophakia" },
        { label: { en: "Age-related macular degeneration (AMD)", fr: "Dégénérescence maculaire liée à l'âge (DMLA)" }, value: "amd" },
        { label: { en: "Glaucoma (increased eye pressure damaging the optic nerve)", fr: "Glaucome (pression oculaire élevée endommageant le nerf optique)" }, value: "glaucoma" },
        { label: { en: "Retinopathy (damage to the retina's blood vessels)", fr: "Rétinopathie (lésions des vaisseaux sanguins de la rétine)" }, value: "retinopathy" },
        { label: { en: "Visual field defect (loss of part of the field of vision)", fr: "Déficit du champ visuel (perte d'une partie du champ de vision)" }, value: "visual_field_defect" },
        { label: { en: "Diplopia (double vision) within the central visual field", fr: "Diplopie (vision double) dans le champ visuel central" }, value: "diplopia" },
      ],
    },
    {
      id: "vision_medications",
      type: "medication-table",
      section: { en: "Section 1 — Visual Disorders", fr: "Section 1 — Troubles visuels" },
      groupId: "vision_detail",
      label: { en: "Medications", fr: "Médicaments" },
    },

    // ─── SECTION 2 — HEARING DISORDERS ────────────────────────────────────────
    {
      id: "hearing_conditions",
      type: "checkboxes",
      section: { en: "Section 2 — Hearing Disorders", fr: "Section 2 — Troubles auditifs" },
      groupId: "hearing_detail",
      label: { en: "Select all that apply:", fr: "Sélectionnez tout ce qui s'applique :" },
      options: [
        { label: { en: "Hearing disorder that requires or would require a hearing aid", fr: "Trouble auditif qui nécessite ou nécessiterait un appareil auditif" }, value: "hearing_aid_required" },
      ],
    },
    {
      id: "hearing_medications",
      type: "medication-table",
      section: { en: "Section 2 — Hearing Disorders", fr: "Section 2 — Troubles auditifs" },
      groupId: "hearing_detail",
      label: { en: "Medications", fr: "Médicaments" },
    },

    // ─── SECTION 3 — NEUROLOGICAL DISORDERS ───────────────────────────────────
    {
      id: "neurological_conditions",
      type: "checkboxes",
      section: { en: "Section 3 — Neurological Disorders", fr: "Section 3 — Troubles neurologiques" },
      groupId: "neurological_detail",
      label: { en: "Select all that apply:", fr: "Sélectionnez tout ce qui s'applique :" },
      options: [
        { label: { en: "Cerebrovascular accident (stroke)", fr: "Accident vasculaire cérébral (AVC)" }, value: "cva" },
        { label: { en: "Parkinson's disease", fr: "Maladie de Parkinson" }, value: "parkinsons" },
        { label: { en: "Multiple sclerosis (MS)", fr: "Sclérose en plaques (SP)" }, value: "ms" },
        { label: { en: "Head trauma (traumatic brain injury)", fr: "Traumatisme crânien (lésion cérébrale traumatique)" }, value: "head_trauma" },
        { label: { en: "Brain tumour", fr: "Tumeur cérébrale" }, value: "brain_tumour" },
        { label: { en: "Other neurological condition", fr: "Autre trouble neurologique" }, value: "other_neurological" },
      ],
    },
    {
      id: "neurological_diagnosis_date",
      type: "date",
      section: { en: "Section 3 — Neurological Disorders", fr: "Section 3 — Troubles neurologiques" },
      groupId: "neurological_detail",
      label: { en: "Date of diagnosis", fr: "Date du diagnostic" },
    },
    {
      id: "neurological_medications",
      type: "medication-table",
      section: { en: "Section 3 — Neurological Disorders", fr: "Section 3 — Troubles neurologiques" },
      groupId: "neurological_detail",
      label: { en: "Medications", fr: "Médicaments" },
    },

    // ─── SECTION 4 — EPILEPSY ─────────────────────────────────────────────────
    {
      id: "epilepsy_types",
      type: "checkboxes",
      section: { en: "Section 4 — Epilepsy and Seizures", fr: "Section 4 — Épilepsie et convulsions" },
      groupId: "epilepsy_detail",
      label: { en: "Types of epileptic seizures (select all that apply):", fr: "Types de crises épileptiques (sélectionnez tout ce qui s'applique) :" },
      options: [
        { label: { en: "Generalized, focal impaired awareness (complex partial) and absence seizures", fr: "Crises généralisées, focales avec altération de la conscience (partielles complexes) et absences" }, value: "generalized" },
        { label: { en: "Nocturnal (nighttime) seizures", fr: "Crises nocturnes (pendant le sommeil)" }, value: "nocturnal" },
        { label: { en: "Focal aware seizures (simple partial)", fr: "Crises focales conscientes (partielles simples)" }, value: "focal_aware" },
      ],
    },
    {
      id: "epilepsy_first_seizure_date",
      type: "date",
      section: { en: "Section 4 — Epilepsy and Seizures", fr: "Section 4 — Épilepsie et convulsions" },
      groupId: "epilepsy_detail",
      label: { en: "Date of first seizure", fr: "Date de la première crise" },
    },
    {
      id: "epilepsy_last_seizure_date",
      type: "date",
      section: { en: "Section 4 — Epilepsy and Seizures", fr: "Section 4 — Épilepsie et convulsions" },
      groupId: "epilepsy_detail",
      label: { en: "Date of last seizure", fr: "Date de la dernière crise" },
    },
    {
      id: "nonepileptic_cause",
      type: "text",
      section: { en: "Section 4 — Epilepsy and Seizures", fr: "Section 4 — Épilepsie et convulsions" },
      groupId: "epilepsy_detail",
      label: { en: "Cause of non-epileptic seizures (if applicable)", fr: "Cause des convulsions non épileptiques (si applicable)" },
      placeholder: { en: "e.g. fever, medication, metabolic disorder", fr: "ex. fièvre, médicament, trouble métabolique" },
    },
    {
      id: "nonepileptic_last_seizure_date",
      type: "date",
      section: { en: "Section 4 — Epilepsy and Seizures", fr: "Section 4 — Épilepsie et convulsions" },
      groupId: "epilepsy_detail",
      label: { en: "Date of last non-epileptic seizure (if applicable)", fr: "Date de la dernière convulsion non épileptique (si applicable)" },
    },
    {
      id: "epilepsy_medications",
      type: "medication-table",
      section: { en: "Section 4 — Epilepsy and Seizures", fr: "Section 4 — Épilepsie et convulsions" },
      groupId: "epilepsy_detail",
      label: { en: "Medications", fr: "Médicaments" },
    },

    // ─── SECTION 5 — HEART AND VASCULAR DISORDERS ─────────────────────────────
    {
      id: "cardiovascular_conditions",
      type: "checkboxes",
      section: { en: "Section 5 — Heart and Vascular Disorders", fr: "Section 5 — Troubles cardiaques et vasculaires" },
      groupId: "cardiovascular_detail",
      label: { en: "Select all that apply:", fr: "Sélectionnez tout ce qui s'applique :" },
      options: [
        { label: { en: "Heart disorder that severely limits physical activity", fr: "Trouble cardiaque limitant sévèrement l'activité physique" }, value: "severe_limitation" },
        { label: { en: "Arrhythmia (heart rhythm disorder)", fr: "Arythmie (trouble du rythme cardiaque)" }, value: "arrhythmia" },
        { label: { en: "Implanted cardiac defibrillator (ICD — device implanted in the chest to correct dangerous heart rhythms)", fr: "Défibrillateur cardiaque implantable (DCI — dispositif implanté dans la poitrine pour corriger les rythmes cardiaques dangereux)" }, value: "defibrillator" },
        { label: { en: "Aortic aneurysm (enlargement of the main artery) requiring surgery", fr: "Anévrisme aortique (élargissement de l'artère principale) nécessitant une chirurgie" }, value: "aortic_aneurysm" },
        { label: { en: "Fainting episodes (syncopes) in the last 12 months", fr: "Épisodes de syncopes (évanouissements) au cours des 12 derniers mois" }, value: "syncopes" },
      ],
    },
    {
      id: "cardiovascular_medications",
      type: "medication-table",
      section: { en: "Section 5 — Heart and Vascular Disorders", fr: "Section 5 — Troubles cardiaques et vasculaires" },
      groupId: "cardiovascular_detail",
      label: { en: "Medications", fr: "Médicaments" },
    },
    {
      id: "cardiovascular_functional_class",
      type: "option-select",
      section: { en: "Section 5 — Heart and Vascular Disorders", fr: "Section 5 — Troubles cardiaques et vasculaires" },
      label: { en: "How severely does your heart condition limit your physical activity?", fr: "Dans quelle mesure votre trouble cardiaque limite-t-il votre activité physique?" },
      conditions: [{ field: "cardiovascular_conditions", operator: "includes", value: "severe_limitation" }],
      options: [
        { label: { en: "Class III", fr: "Classe III" }, value: "class_3", description: { en: "Marked limitation — comfortable only at rest; ordinary activity causes symptoms", fr: "Limitation marquée — à l'aise seulement au repos; l'activité ordinaire provoque des symptômes" } },
        { label: { en: "Class IV", fr: "Classe IV" }, value: "class_4", description: { en: "Must be at complete rest — symptoms occur even at rest", fr: "Doit être au repos complet — les symptômes surviennent même au repos" } },
      ],
    },
    {
      id: "cardiovascular_syncopes_count",
      type: "number",
      section: { en: "Section 5 — Heart and Vascular Disorders", fr: "Section 5 — Troubles cardiaques et vasculaires" },
      groupId: "cardiovascular_syncopes_detail",
      label: { en: "Number of fainting episodes in the last 12 months", fr: "Nombre d'épisodes de syncopes au cours des 12 derniers mois" },
      placeholder: { en: "e.g. 2", fr: "ex. 2" },
      conditions: [{ field: "cardiovascular_conditions", operator: "includes", value: "syncopes" }],
    },
    {
      id: "cardiovascular_syncopes_last_date",
      type: "date",
      section: { en: "Section 5 — Heart and Vascular Disorders", fr: "Section 5 — Troubles cardiaques et vasculaires" },
      groupId: "cardiovascular_syncopes_detail",
      label: { en: "Date of last fainting episode", fr: "Date du dernier épisode de syncope" },
      conditions: [{ field: "cardiovascular_conditions", operator: "includes", value: "syncopes" }],
    },

    // ─── SECTION 6 — RESPIRATORY DISORDERS ────────────────────────────────────
    {
      id: "respiratory_conditions",
      type: "checkboxes",
      section: { en: "Section 6 — Respiratory Disorders", fr: "Section 6 — Troubles respiratoires" },
      groupId: "respiratory_detail",
      label: { en: "Select all that apply:", fr: "Sélectionnez tout ce qui s'applique :" },
      options: [
        { label: { en: "Respiratory disease that limits physical activities", fr: "Maladie respiratoire limitant les activités physiques" }, value: "activity_limiting" },
        { label: { en: "You require oxygen therapy", fr: "Vous avez besoin d'oxygénothérapie" }, value: "oxygenotherapy" },
        { label: { en: "Sleep apnea (repeated breathing interruptions during sleep)", fr: "Apnée du sommeil (interruptions respiratoires répétées pendant le sommeil)" }, value: "sleep_apnea" },
      ],
    },
    {
      id: "respiratory_medications",
      type: "medication-table",
      section: { en: "Section 6 — Respiratory Disorders", fr: "Section 6 — Troubles respiratoires" },
      groupId: "respiratory_detail",
      label: { en: "Medications", fr: "Médicaments" },
    },
    {
      id: "respiratory_severity",
      type: "option-select",
      section: { en: "Section 6 — Respiratory Disorders", fr: "Section 6 — Troubles respiratoires" },
      label: { en: "How does your respiratory condition limit you?", fr: "Dans quelle mesure votre condition respiratoire vous limite-t-elle?" },
      conditions: [{ field: "respiratory_conditions", operator: "includes", value: "activity_limiting" }],
      options: [
        { label: { en: "Class III", fr: "Classe III" }, value: "class_3", description: { en: "Shortness of breath walking on flat terrain or climbing stairs", fr: "Essoufflement en marchant sur terrain plat ou en montant des escaliers" } },
        { label: { en: "Class IV", fr: "Classe IV" }, value: "class_4", description: { en: "Shortness of breath after walking 100 metres on flat terrain at own pace", fr: "Essoufflement après avoir marché 100 mètres sur terrain plat à son propre rythme" } },
        { label: { en: "Class V", fr: "Classe V" }, value: "class_5", description: { en: "Shortness of breath when dressing, undressing, or speaking", fr: "Essoufflement en s'habillant, se déshabillant ou en parlant" } },
      ],
    },
    {
      id: "sleep_apnea_treated",
      type: "yes-no",
      section: { en: "Section 6 — Respiratory Disorders", fr: "Section 6 — Troubles respiratoires" },
      label: { en: "Is your sleep apnea currently being treated effectively (e.g. with a continuous positive airway pressure (CPAP) device)?", fr: "Votre apnée du sommeil est-elle actuellement traitée efficacement (ex. avec un appareil à pression positive continue (PPC))?" },
      conditions: [{ field: "respiratory_conditions", operator: "includes", value: "sleep_apnea" }],
    },

    // ─── SECTION 7 — DIABETES ──────────────────────────────────────────────────
    {
      id: "diabetes_treatment",
      type: "checkboxes",
      section: { en: "Section 7 — Diabetes", fr: "Section 7 — Diabète" },
      groupId: "diabetes_detail",
      label: { en: "Current treatment (select all that apply):", fr: "Traitement actuel (sélectionnez tout ce qui s'applique) :" },
      options: [
        { label: { en: "Insulin injections", fr: "Injections d'insuline" }, value: "insulin" },
        { label: { en: "Oral hypoglycemic agents (blood sugar lowering pills)", fr: "Hypoglycémiants oraux (comprimés pour réduire la glycémie)" }, value: "hypoglycemic_agent" },
        { label: { en: "Diet and lifestyle only (no medication)", fr: "Alimentation et hygiène de vie seulement (sans médicament)" }, value: "diet_only" },
      ],
    },
    {
      id: "diabetes_hypoglycemia",
      type: "yes-no",
      section: { en: "Section 7 — Diabetes", fr: "Section 7 — Diabète" },
      groupId: "diabetes_detail",
      label: { en: "In the last 6 months, have you had a low blood sugar episode (hypoglycemia) that caused a loss of consciousness and required help from another person?", fr: "Au cours des 6 derniers mois, avez-vous eu un épisode d'hypoglycémie (faible taux de sucre dans le sang) ayant causé une perte de conscience et nécessité l'aide d'une autre personne?" },
    },
    {
      id: "diabetes_medications",
      type: "medication-table",
      section: { en: "Section 7 — Diabetes", fr: "Section 7 — Diabète" },
      groupId: "diabetes_detail",
      label: { en: "Medications", fr: "Médicaments" },
    },

    // ─── SECTION 8 — PSYCHIATRIC DISORDERS ────────────────────────────────────
    {
      id: "psychiatric_conditions",
      type: "checkboxes",
      section: { en: "Section 8 — Psychiatric Disorders", fr: "Section 8 — Troubles psychiatriques" },
      groupId: "psychiatric_detail",
      label: { en: "Select all that apply:", fr: "Sélectionnez tout ce qui s'applique :" },
      options: [
        { label: { en: "Depression", fr: "Dépression" }, value: "depression" },
        { label: { en: "Anxiety disorder", fr: "Trouble anxieux" }, value: "anxiety" },
        { label: { en: "Bipolar disorder (manic-depressive illness)", fr: "Trouble bipolaire (maladie maniaco-dépressive)" }, value: "bipolar" },
        { label: { en: "Psychotic disorder (e.g. schizophrenia)", fr: "Trouble psychotique (ex. schizophrénie)" }, value: "psychosis" },
        { label: { en: "Other psychiatric condition", fr: "Autre trouble psychiatrique" }, value: "other_psychiatric" },
      ],
    },
    {
      id: "psychiatric_self_judgment",
      type: "yes-no",
      section: { en: "Section 8 — Psychiatric Disorders", fr: "Section 8 — Troubles psychiatriques" },
      groupId: "psychiatric_detail",
      label: { en: "Do you feel you have the necessary judgment and self-awareness to drive safely?", fr: "Estimez-vous avoir le jugement et la conscience de soi nécessaires pour conduire de façon sécuritaire?" },
    },
    {
      id: "psychiatric_episode_count",
      type: "option-select",
      section: { en: "Section 8 — Psychiatric Disorders", fr: "Section 8 — Troubles psychiatriques" },
      groupId: "psychiatric_detail",
      label: { en: "Number of psychotic episodes or acute manic episodes in the last 12 months:", fr: "Nombre d'épisodes psychotiques ou maniaques aigus au cours des 12 derniers mois :" },
      options: [
        { label: { en: "None", fr: "Aucun" }, value: "none" },
        { label: { en: "1 episode", fr: "1 épisode" }, value: "one" },
        { label: { en: "2 or more episodes", fr: "2 épisodes ou plus" }, value: "two_or_more" },
      ],
    },
    {
      id: "psychiatric_medications",
      type: "medication-table",
      section: { en: "Section 8 — Psychiatric Disorders", fr: "Section 8 — Troubles psychiatriques" },
      groupId: "psychiatric_detail",
      label: { en: "Medications", fr: "Médicaments" },
    },

    // ─── SECTION 9 — SUBSTANCE USE DISORDERS ──────────────────────────────────
    {
      id: "substance_types",
      type: "checkboxes",
      section: { en: "Section 9 — Substance Use Disorders", fr: "Section 9 — Troubles liés à l'utilisation de substances" },
      groupId: "substance_detail",
      label: { en: "Select all that apply:", fr: "Sélectionnez tout ce qui s'applique :" },
      options: [
        { label: { en: "Alcohol", fr: "Alcool" }, value: "alcohol" },
        { label: { en: "Drugs (illicit or prescription misuse)", fr: "Drogues (utilisation illicite ou mauvaise utilisation de médicaments prescrits)" }, value: "drugs" },
        { label: { en: "Other substance", fr: "Autre substance" }, value: "other_substance" },
      ],
    },
    {
      id: "substance_severity",
      type: "option-select",
      section: { en: "Section 9 — Substance Use Disorders", fr: "Section 9 — Troubles liés à l'utilisation de substances" },
      groupId: "substance_detail",
      label: { en: "Severity of the substance use disorder:", fr: "Sévérité du trouble lié à l'utilisation de substances :" },
      options: [
        { label: { en: "Mild", fr: "Léger" }, value: "mild", description: { en: "2–3 diagnostic criteria", fr: "2–3 critères diagnostiques" } },
        { label: { en: "Moderate", fr: "Modéré" }, value: "moderate", description: { en: "4–5 diagnostic criteria", fr: "4–5 critères diagnostiques" } },
        { label: { en: "Severe", fr: "Sévère" }, value: "severe", description: { en: "6 or more diagnostic criteria", fr: "6 critères diagnostiques ou plus" } },
      ],
    },
    {
      id: "substance_in_remission",
      type: "yes-no",
      section: { en: "Section 9 — Substance Use Disorders", fr: "Section 9 — Troubles liés à l'utilisation de substances" },
      groupId: "substance_detail",
      label: { en: "Are you currently in remission?", fr: "Êtes-vous actuellement en rémission?" },
    },
    {
      id: "substance_medications",
      type: "medication-table",
      section: { en: "Section 9 — Substance Use Disorders", fr: "Section 9 — Troubles liés à l'utilisation de substances" },
      groupId: "substance_detail",
      label: { en: "Medications", fr: "Médicaments" },
    },
    {
      id: "substance_remission_date",
      type: "date",
      section: { en: "Section 9 — Substance Use Disorders", fr: "Section 9 — Troubles liés à l'utilisation de substances" },
      label: { en: "Remission start date", fr: "Date de début de la rémission" },
      conditions: [{ field: "substance_in_remission", operator: "eq", value: "yes" }],
    },

    // ─── SECTION 10 — FUNCTIONAL LIMITATIONS ──────────────────────────────────
    {
      id: "functional_conditions",
      type: "checkboxes",
      section: { en: "Section 10 — Functional Limitations", fr: "Section 10 — Limitations fonctionnelles" },
      groupId: "functional_detail",
      label: { en: "Select all that apply:", fr: "Sélectionnez tout ce qui s'applique :" },
      options: [
        { label: { en: "Physical limitation (e.g. limb impairment, loss of strength or coordination)", fr: "Limitation physique (ex. atteinte des membres, perte de force ou de coordination)" }, value: "physical" },
        { label: { en: "Cognitive limitation (e.g. difficulties with memory, attention, or judgment)", fr: "Limitation cognitive (ex. difficultés de mémoire, d'attention ou de jugement)" }, value: "cognitive" },
        { label: { en: "Diagnosis of dementia (e.g. Alzheimer's disease)", fr: "Diagnostic de démence (ex. maladie d'Alzheimer)" }, value: "dementia" },
      ],
    },
    {
      id: "functional_medications",
      type: "medication-table",
      section: { en: "Section 10 — Functional Limitations", fr: "Section 10 — Limitations fonctionnelles" },
      groupId: "functional_detail",
      label: { en: "Medications", fr: "Médicaments" },
    },

    // ─── SECTION 11 — CURRENT MEDICATIONS ─────────────────────────────────────
    {
      id: "medications_list",
      type: "medication-table",
      section: { en: "Section 11 — Current Medications", fr: "Section 11 — Médicaments actuels" },
      groupId: "medications_group",
      label: { en: "All current medications", fr: "Tous les médicaments actuels" },
    },

    // ─── IN-PERSON APPOINTMENT ────────────────────────────────────────────────
    {
      id: "clinic_selection",
      type: "option-select",
      section: { en: "In-person appointment", fr: "Rendez-vous en personne" },
      groupId: "in_person_appointment",
      label: quebecInPersonStepLabel,
      description: quebecInPersonCopy,
      options: quebecClinics.map((c) => ({ value: c.id, label: c.label })),
      validation: [
        {
          type: "required",
          message: { en: "Please choose a clinic", fr: "Veuillez choisir une clinique" },
        },
      ],
    },
  ],
};

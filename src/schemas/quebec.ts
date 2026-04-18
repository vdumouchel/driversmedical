import type { ProvinceSchema } from "./types";

export const quebecSchema: ProvinceSchema = {
  provinceSlug: "quebec",
  provinceName: "Quebec",
  formTitle: "Quebec SAAQ Medical Assessment Report",
  version: "1.0.0",
  metadata: {
    estimatedMinutes: 15,
    formCode: "M-28",
    regulatoryBody: "SAAQ — Société de l'assurance automobile du Québec",
  },
  fields: [
    // --- Identification ---
    {
      id: "full_name",
      type: "text",
      section: "Identification",
      label: "What is your full legal name?",
      placeholder: "First and last name",
      validation: [{ type: "required", message: "Your full name is required" }],
    },
    {
      id: "date_of_birth",
      type: "date",
      section: "Identification",
      label: "What is your date of birth?",
      validation: [{ type: "required", message: "Date of birth is required" }],
    },
    {
      id: "address",
      type: "text",
      section: "Identification",
      label: "What is your mailing address?",
      placeholder: "Street, city, province, postal code",
      validation: [{ type: "required", message: "Address is required" }],
    },
    {
      id: "phone",
      type: "text",
      section: "Identification",
      label: "What is your phone number?",
      placeholder: "(514) 000-0000",
      validation: [{ type: "required", message: "Phone number is required" }],
    },
    {
      id: "ramq_number",
      type: "text",
      section: "Identification",
      label: "What is your RAMQ (health insurance) number?",
      placeholder: "XXXX 0000 0000",
      validation: [{ type: "required", message: "RAMQ number is required" }],
    },
    {
      id: "licence_number",
      type: "text",
      section: "Identification",
      label: "What is your driver's licence number?",
      placeholder: "Enter your licence number",
      validation: [{ type: "required", message: "Licence number is required" }],
    },
    {
      id: "licence_class",
      type: "option-select",
      section: "Identification",
      label: "What class of licence are you applying for?",
      options: [
        { label: "Class 1", value: "class_1", description: "Heavy trucks and trailers" },
        { label: "Class 2", value: "class_2", description: "Buses (24+ passengers)" },
        { label: "Class 3", value: "class_3", description: "Heavy vehicles" },
        { label: "Class 4A", value: "class_4a", description: "Emergency vehicles" },
        { label: "Class 4B", value: "class_4b", description: "Minibuses" },
      ],
      validation: [{ type: "required", message: "Licence class is required" }],
    },

    // --- Vision ---
    {
      id: "has_vision_disorder",
      type: "yes-no",
      section: "Vision",
      label: "Do you have any visual disorders?",
      description: "Including reduced acuity, field loss, double vision, or colour blindness",
    },
    {
      id: "wears_corrective_lenses",
      type: "yes-no",
      section: "Vision",
      label: "Do you wear corrective lenses (glasses or contacts)?",
      conditions: [{ field: "has_vision_disorder", operator: "eq", value: "yes" }],
    },
    {
      id: "vision_condition_details",
      type: "textarea",
      section: "Vision",
      label: "Please describe your visual condition.",
      placeholder: "Include diagnosis, severity, and any treatment",
      conditions: [{ field: "has_vision_disorder", operator: "eq", value: "yes" }],
      validation: [{ type: "required", message: "Please provide details" }],
    },

    // --- Hearing ---
    {
      id: "has_hearing_disorder",
      type: "yes-no",
      section: "Hearing",
      label: "Do you have any hearing disorders?",
      description: "Including partial deafness or tinnitus",
    },
    {
      id: "uses_hearing_aid",
      type: "yes-no",
      section: "Hearing",
      label: "Do you use a hearing aid?",
      conditions: [{ field: "has_hearing_disorder", operator: "eq", value: "yes" }],
    },
    {
      id: "hearing_details",
      type: "textarea",
      section: "Hearing",
      label: "Please describe your hearing condition.",
      placeholder: "Include which ear(s), severity, and treatment",
      conditions: [{ field: "has_hearing_disorder", operator: "eq", value: "yes" }],
      validation: [{ type: "required", message: "Please provide details" }],
    },

    // --- Neurological ---
    {
      id: "has_neurological_disorder",
      type: "yes-no",
      section: "Neurological Disorders",
      label: "Do you have any neurological disorders?",
      description: "Including stroke, brain injury, Parkinson's, MS, or neuropathy",
    },
    {
      id: "neurological_details",
      type: "textarea",
      section: "Neurological Disorders",
      label: "Please describe your neurological condition.",
      placeholder: "Include diagnosis, date of onset, treatment, and current status",
      conditions: [{ field: "has_neurological_disorder", operator: "eq", value: "yes" }],
      validation: [{ type: "required", message: "Please provide details" }],
    },

    // --- Epilepsy ---
    {
      id: "has_epilepsy",
      type: "yes-no",
      section: "Epilepsy & Seizures",
      label: "Have you ever had epilepsy, seizures, or non-epileptic convulsions?",
    },
    {
      id: "last_seizure_date",
      type: "date",
      section: "Epilepsy & Seizures",
      label: "When was your last seizure?",
      conditions: [{ field: "has_epilepsy", operator: "eq", value: "yes" }],
      validation: [{ type: "required", message: "Date of last seizure is required" }],
    },
    {
      id: "epilepsy_medication",
      type: "yes-no",
      section: "Epilepsy & Seizures",
      label: "Are you currently taking anti-seizure medication?",
      conditions: [{ field: "has_epilepsy", operator: "eq", value: "yes" }],
    },
    {
      id: "epilepsy_details",
      type: "textarea",
      section: "Epilepsy & Seizures",
      label: "Please describe your seizure history.",
      placeholder: "Include type, frequency, triggers, and treatment",
      conditions: [{ field: "has_epilepsy", operator: "eq", value: "yes" }],
      validation: [{ type: "required", message: "Please provide details" }],
    },

    // --- Cardiovascular ---
    {
      id: "has_cardiovascular",
      type: "yes-no",
      section: "Heart & Vascular",
      label: "Do you have any heart or vascular conditions?",
      description: "Including coronary disease, arrhythmia, heart failure, aneurysm, or hypertension",
    },
    {
      id: "cardiovascular_type",
      type: "option-select",
      section: "Heart & Vascular",
      label: "Which best describes your cardiovascular condition?",
      options: [
        { label: "Coronary artery disease", value: "coronary" },
        { label: "Arrhythmia", value: "arrhythmia" },
        { label: "Heart failure", value: "heart_failure" },
        { label: "Hypertension", value: "hypertension" },
      ],
      conditions: [{ field: "has_cardiovascular", operator: "eq", value: "yes" }],
      validation: [{ type: "required", message: "Please select a condition type" }],
    },
    {
      id: "cardiovascular_details",
      type: "textarea",
      section: "Heart & Vascular",
      label: "Please describe your cardiovascular condition.",
      placeholder: "Include diagnosis, treatment, surgical history, and current status",
      conditions: [{ field: "has_cardiovascular", operator: "eq", value: "yes" }],
      validation: [{ type: "required", message: "Please provide details" }],
    },

    // --- Respiratory ---
    {
      id: "has_respiratory",
      type: "yes-no",
      section: "Respiratory",
      label: "Do you have any respiratory disorders?",
      description: "Including COPD, asthma, or sleep apnea",
    },
    {
      id: "respiratory_details",
      type: "textarea",
      section: "Respiratory",
      label: "Please describe your respiratory condition.",
      placeholder: "Include diagnosis, severity, treatment (CPAP?), and compliance",
      conditions: [{ field: "has_respiratory", operator: "eq", value: "yes" }],
      validation: [{ type: "required", message: "Please provide details" }],
    },

    // --- Diabetes ---
    {
      id: "has_diabetes",
      type: "yes-no",
      section: "Diabetes",
      label: "Do you have diabetes?",
    },
    {
      id: "diabetes_type",
      type: "option-select",
      section: "Diabetes",
      label: "What type of diabetes do you have?",
      options: [
        { label: "Type 1", value: "type_1" },
        { label: "Type 2", value: "type_2" },
        { label: "Pre-diabetes", value: "pre_diabetes" },
      ],
      conditions: [{ field: "has_diabetes", operator: "eq", value: "yes" }],
      validation: [{ type: "required", message: "Please select your diabetes type" }],
    },
    {
      id: "uses_insulin",
      type: "yes-no",
      section: "Diabetes",
      label: "Do you use insulin?",
      conditions: [{ field: "has_diabetes", operator: "eq", value: "yes" }],
    },
    {
      id: "diabetes_details",
      type: "textarea",
      section: "Diabetes",
      label: "Please describe your diabetes management.",
      placeholder: "Include medications, HbA1c levels, and any hypoglycemic episodes",
      conditions: [{ field: "has_diabetes", operator: "eq", value: "yes" }],
      validation: [{ type: "required", message: "Please provide details" }],
    },

    // --- Psychiatric ---
    {
      id: "has_psychiatric",
      type: "yes-no",
      section: "Psychiatric Disorders",
      label: "Do you have any psychiatric disorders?",
      description: "Including depression, anxiety, bipolar disorder, or psychotic disorders",
    },
    {
      id: "psychiatric_details",
      type: "textarea",
      section: "Psychiatric Disorders",
      label: "Please describe your psychiatric condition.",
      placeholder: "Include diagnosis, medication, and current treatment",
      conditions: [{ field: "has_psychiatric", operator: "eq", value: "yes" }],
      validation: [{ type: "required", message: "Please provide details" }],
    },

    // --- Substance Use ---
    {
      id: "has_substance_use",
      type: "yes-no",
      section: "Substance Use",
      label: "Do you have a history of substance use disorders?",
      description: "Including alcohol, drugs, or medication misuse",
    },
    {
      id: "substance_details",
      type: "textarea",
      section: "Substance Use",
      label: "Please describe your substance use history.",
      placeholder: "Include substances, treatment, and recovery timeline",
      conditions: [{ field: "has_substance_use", operator: "eq", value: "yes" }],
      validation: [{ type: "required", message: "Please provide details" }],
    },

    // --- Functional Limitations ---
    {
      id: "has_functional_limitations",
      type: "yes-no",
      section: "Functional Limitations",
      label: "Do you have any physical or functional limitations?",
      description: "Including limb impairment, reduced mobility, or prosthetics",
    },
    {
      id: "functional_details",
      type: "textarea",
      section: "Functional Limitations",
      label: "Please describe your functional limitations.",
      placeholder: "Include which limbs/functions are affected and any adaptive devices",
      conditions: [{ field: "has_functional_limitations", operator: "eq", value: "yes" }],
      validation: [{ type: "required", message: "Please provide details" }],
    },

    // --- Current Medications ---
    {
      id: "takes_medications",
      type: "yes-no",
      section: "Current Medications",
      label: "Are you currently taking any medications?",
    },
    {
      id: "medications_list",
      type: "textarea",
      section: "Current Medications",
      label: "Please list all medications you are currently taking.",
      placeholder: "Include name, dosage, and frequency for each medication",
      conditions: [{ field: "takes_medications", operator: "eq", value: "yes" }],
      validation: [{ type: "required", message: "Please list your medications" }],
    },

    // --- Declaration ---
    {
      id: "consent_authorization",
      type: "checkbox",
      section: "Declaration & Consent",
      label: "I authorize the release of medical information from this assessment to the SAAQ for driver licensing purposes.",
      validation: [{ type: "required", message: "Authorization is required to proceed" }],
    },
    {
      id: "declaration",
      type: "checkbox",
      section: "Declaration & Consent",
      label: "I confirm that the information provided is accurate and complete to the best of my knowledge.",
      validation: [{ type: "required", message: "You must confirm this declaration to proceed" }],
    },
  ],
};

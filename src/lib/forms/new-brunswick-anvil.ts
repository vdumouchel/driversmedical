import type { AnvilFillPayload } from "@/lib/anvil";

export const NB_ANVIL_TEMPLATE_ID = "ydHd9pgCZQsKvKHPo00W";

/**
 * Map intake answers (keyed by field `id` from the NB schema) into the Anvil
 * payload shape for template ydHd9pgCZQsKvKHPo00W.
 *
 * Anvil field aliases come from the template configured in the Anvil dashboard.
 * Only the patient-section fields are filled here; physician/examination fields
 * are left empty — the doctor fills those on the printed form.
 */
export function buildNewBrunswickPayload(
  answers: Record<string, unknown>,
): AnvilFillPayload {
  const s = (key: string): string =>
    typeof answers[key] === "string" ? (answers[key] as string) : "";

  const yesNo = (key: string): string => {
    const v = s(key).toLowerCase();
    if (v === "yes") return `Question - Yes`;
    if (v === "no") return `Question - No`;
    return "";
  };

  const licenceClassLabel =
    {
      class_1: "Class 1",
      class_2: "Class 2",
      class_3: "Class 3",
      class_4: "Class 4",
      class_5: "Class 5",
    }[s("licence_class")] ?? s("licence_class");

  const firstName = s("first_name");
  const lastName = s("last_name");

  return {
    title: "New Brunswick CSS FOL 78 9282 E",
    fontSize: 10,
    textColor: "#333333",
    data: {
      nameOfApplicant: {
        firstName,
        mi: "",
        lastName,
      },
      dateOfBirth: s("date_of_birth"),
      address: {
        street1: s("address"),
        city: s("city"),
        state: "NB",
        zip: s("postal_code"),
        country: "CA",
      },
      licenceNumber: s("licence_number"),
      classOfLicenceAppliedFor: licenceClassLabel,

      // Questions 1–12: Anvil aliases match the template
      question1LossOrImpairmentOfLimbs: yesNo("limb_impairment"),
      question2MusculoSkeletalOrNervousSystemImpairment: yesNo(
        "musculoskeletal_nervous",
      ),
      question3DiabetesMellitus: yesNo("diabetes_controlled"),
      question4MyocardialInfarction: yesNo("cardiac_event"),
      question4FullyRecoveredFromFirstIncidence: (() => {
        const v = s("cardiac_first_fully_recovered");
        if (v === "yes") return "Question 4 - Fully recovered Yes";
        if (v === "no") return "Question 4 - Fully recovered No";
        return "";
      })(),
      question5HeartOrLungDisease: yesNo("heart_lung_disease"),
      question6HypertensionWithPosturalHypotension: yesNo(
        "hypertension_hypotension",
      ),
      question7HearingAssistanceRequirement: yesNo("hearing_assistance"),
      question8LossOfConsciousnessOrAwareness: yesNo("loss_of_consciousness"),
      question9ContinuousUseOfPrescribedDrug: yesNo("prescribed_meds_impair"),
      question10AlcoholismOrDrugAddiction: yesNo("substance_addiction"),
      question11PsychiatricDisorder: yesNo("psychiatric_disorder"),
      question12OtherPhysicalOrMentalImpairment: yesNo("other_impairment"),
    },
  };
}

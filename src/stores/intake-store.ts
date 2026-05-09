import { create } from "zustand";
import type {
  FormField,
  FieldGroup,
  Condition,
  IntakeStep,
  MedicationEntry,
} from "@/schemas/types";

export type AnswerValue = string | number | boolean | MedicationEntry[] | string[];

interface IntakeState {
  province: string | null;
  currentIndex: number;
  answers: Record<string, AnswerValue>;
  fields: FormField[];
  groups: FieldGroup[];

  setProvince: (province: string) => void;
  setSchema: (fields: FormField[], groups?: FieldGroup[]) => void;
  setAnswer: (fieldId: string, value: AnswerValue) => void;
  setAnswers: (values: Record<string, AnswerValue>) => void;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  reset: () => void;
  getVisibleFields: () => FormField[];
  getVisibleSteps: () => IntakeStep[];
  getCurrentStep: () => IntakeStep | undefined;
  getVisibleStepIndex: () => number;
  getVisibleStepCount: () => number;
}

function evaluateConditions(
  conditions: Condition[] | undefined,
  answers: Record<string, AnswerValue>
): boolean {
  if (!conditions || conditions.length === 0) return true;
  return conditions.every((c) => {
    const val = answers[c.field];
    switch (c.operator) {
      case "eq":
        return val === c.value;
      case "neq":
        return val !== c.value;
      case "exists":
        return val !== undefined && val !== "" && val !== null;
      case "in":
        return Array.isArray(c.value) && (c.value as string[]).includes(String(val));
      case "includes":
        return Array.isArray(val) && (val as string[]).includes(String(c.value));
      default:
        return true;
    }
  });
}

function getVisible(
  fields: FormField[],
  answers: Record<string, AnswerValue>
): FormField[] {
  return fields.filter((f) => evaluateConditions(f.conditions, answers));
}

function computeVisibleSteps(
  fields: FormField[],
  groups: FieldGroup[],
  answers: Record<string, AnswerValue>
): IntakeStep[] {
  const groupMeta = new Map(groups.map((g) => [g.id, g]));
  const steps: IntakeStep[] = [];

  for (let i = 0; i < fields.length; i++) {
    const f = fields[i];
    if (!evaluateConditions(f.conditions, answers)) continue;

    if (f.groupId) {
      const last = steps[steps.length - 1];
      if (last && last.kind === "group" && last.id === f.groupId) {
        last.fields.push(f);
        continue;
      }
      const meta = groupMeta.get(f.groupId);
      steps.push({
        kind: "group",
        startIndex: i,
        id: f.groupId,
        title: meta?.title,
        description: meta?.description,
        columns: meta?.columns ?? 2,
        fields: [f],
      });
    } else {
      steps.push({ kind: "field", startIndex: i, field: f });
    }
  }
  return steps;
}

function stepContainingRawIndex(
  steps: IntakeStep[],
  rawFields: FormField[],
  rawIndex: number
): number {
  const target = rawFields[rawIndex];
  if (!target) return -1;
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    if (step.kind === "field") {
      if (step.field === target) return i;
    } else {
      if (step.fields.includes(target)) return i;
    }
  }
  return -1;
}

export const useIntakeStore = create<IntakeState>((set, get) => ({
  province: null,
  currentIndex: 0,
  answers: {},
  fields: [],
  groups: [],

  setProvince: (province) => set({ province }),
  setSchema: (fields, groups = []) =>
    set({ fields, groups, currentIndex: 0, answers: {} }),
  setAnswer: (fieldId, value) =>
    set((s) => ({ answers: { ...s.answers, [fieldId]: value } })),
  setAnswers: (values) =>
    set((s) => ({ answers: { ...s.answers, ...values } })),

  next: () => {
    const { fields, groups, answers, currentIndex } = get();
    const steps = computeVisibleSteps(fields, groups, answers);
    const idx = stepContainingRawIndex(steps, fields, currentIndex);
    if (idx < 0) {
      set({ currentIndex: fields.length });
      return;
    }
    const nextStep = steps[idx + 1];
    if (!nextStep) {
      set({ currentIndex: fields.length });
      return;
    }
    set({ currentIndex: nextStep.startIndex });
  },

  prev: () => {
    const { fields, groups, answers, currentIndex } = get();
    const steps = computeVisibleSteps(fields, groups, answers);
    const idx = stepContainingRawIndex(steps, fields, currentIndex);
    if (idx <= 0) return;
    const prevStep = steps[idx - 1];
    if (!prevStep) return;
    set({ currentIndex: prevStep.startIndex });
  },

  goTo: (index) => set({ currentIndex: index }),

  reset: () =>
    set({
      province: null,
      currentIndex: 0,
      answers: {},
      fields: [],
      groups: [],
    }),

  getVisibleFields: () => {
    const { fields, answers } = get();
    return getVisible(fields, answers);
  },

  getVisibleSteps: () => {
    const { fields, groups, answers } = get();
    return computeVisibleSteps(fields, groups, answers);
  },

  getCurrentStep: () => {
    const { fields, groups, answers, currentIndex } = get();
    const steps = computeVisibleSteps(fields, groups, answers);
    const idx = stepContainingRawIndex(steps, fields, currentIndex);
    return idx >= 0 ? steps[idx] : undefined;
  },

  getVisibleStepIndex: () => {
    const { fields, groups, answers, currentIndex } = get();
    const steps = computeVisibleSteps(fields, groups, answers);
    const idx = stepContainingRawIndex(steps, fields, currentIndex);
    return idx >= 0 ? idx : steps.length;
  },

  getVisibleStepCount: () => {
    const { fields, groups, answers } = get();
    return computeVisibleSteps(fields, groups, answers).length;
  },
}));

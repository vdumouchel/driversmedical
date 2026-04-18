import { create } from "zustand";
import type { FormField, Condition } from "@/schemas/types";

interface IntakeState {
  province: string | null;
  currentIndex: number;
  answers: Record<string, string | number | boolean>;
  fields: FormField[];

  setProvince: (province: string) => void;
  setFields: (fields: FormField[]) => void;
  setAnswer: (fieldId: string, value: string | number | boolean) => void;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  reset: () => void;
  getVisibleFields: () => FormField[];
  getVisibleIndex: () => number;
  getVisibleCount: () => number;
}

function evaluateConditions(
  conditions: Condition[] | undefined,
  answers: Record<string, string | number | boolean>
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
        return Array.isArray(c.value) && c.value.includes(String(val));
      default:
        return true;
    }
  });
}

function getVisible(
  fields: FormField[],
  answers: Record<string, string | number | boolean>
): FormField[] {
  return fields.filter((f) => evaluateConditions(f.conditions, answers));
}

export const useIntakeStore = create<IntakeState>((set, get) => ({
  province: null,
  currentIndex: 0,
  answers: {},
  fields: [],

  setProvince: (province) => set({ province }),
  setFields: (fields) => set({ fields, currentIndex: 0, answers: {} }),
  setAnswer: (fieldId, value) =>
    set((s) => ({ answers: { ...s.answers, [fieldId]: value } })),

  next: () => {
    const { fields, currentIndex, answers } = get();
    const visible = getVisible(fields, answers);
    const currentField = visible[get().getVisibleIndex()];
    if (!currentField) return;

    // Find the next raw index after current that is visible
    const rawCurrentIndex = fields.indexOf(currentField);
    for (let i = rawCurrentIndex + 1; i < fields.length; i++) {
      if (evaluateConditions(fields[i].conditions, answers)) {
        set({ currentIndex: i });
        return;
      }
    }
    // No more visible fields — stay (caller should navigate to summary)
    set({ currentIndex: fields.length });
  },

  prev: () => {
    const { fields, currentIndex, answers } = get();
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (evaluateConditions(fields[i].conditions, answers)) {
        set({ currentIndex: i });
        return;
      }
    }
  },

  goTo: (index) => set({ currentIndex: index }),

  reset: () => set({ province: null, currentIndex: 0, answers: {}, fields: [] }),

  getVisibleFields: () => {
    const { fields, answers } = get();
    return getVisible(fields, answers);
  },

  getVisibleIndex: () => {
    const { fields, currentIndex, answers } = get();
    const visible = getVisible(fields, answers);
    const currentField = fields[currentIndex];
    if (!currentField) return visible.length; // past end
    return visible.indexOf(currentField);
  },

  getVisibleCount: () => {
    const { fields, answers } = get();
    return getVisible(fields, answers).length;
  },
}));

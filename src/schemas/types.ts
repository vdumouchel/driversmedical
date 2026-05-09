export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "select"
  | "radio"
  | "checkbox"
  | "yes-no"
  | "option-select"
  | "info"
  | "medication-table"
  | "phone"
  | "email"
  | "checkboxes";

export interface MedicationEntry {
  name: string;
  dosage: string;
  frequency: string;
}

import type { MessageDescriptor } from "@lingui/core";

/**
 * Localizable string. Two authoring shapes are supported:
 *
 *   - `{ en: "Hello", fr: "Bonjour" }` — inline literal (legacy / quick), used
 *     widely in existing schemas. Resolved by indexing the active locale.
 *   - A Lingui `MessageDescriptor` (produced by `msg\`Hello\`` from
 *     `@lingui/core/macro`). Authored once in source, extracted to .po by
 *     `pnpm lingui:extract`, translations filled manually. Resolved through the
 *     active i18n catalog.
 *
 * `resolveLS()` in `src/lib/i18n-utils.ts` handles both transparently.
 */
export type LocalizedString = { en: string; fr: string } | MessageDescriptor;

export interface FieldOption {
  label: LocalizedString;
  value: string;
  description?: LocalizedString;
}

export interface Condition {
  field: string;
  operator: "eq" | "neq" | "in" | "exists" | "includes";
  value: string | number | boolean | string[];
}

export interface ValidationRule {
  type: "required" | "minLength" | "maxLength" | "pattern" | "min" | "max";
  value?: string | number | boolean;
  message: LocalizedString;
}

export interface FormField {
  id: string;
  type: FieldType;
  section: LocalizedString;
  label: LocalizedString;
  description?: LocalizedString;
  placeholder?: LocalizedString;
  options?: FieldOption[];
  validation?: ValidationRule[];
  conditions?: Condition[];
  defaultValue?: string | number | boolean;
  groupId?: string;
  mask?: string;
}

export interface FieldGroup {
  id: string;
  title?: LocalizedString;
  description?: LocalizedString;
  columns?: 1 | 2;
}

export interface ProvinceSchema {
  provinceSlug: string;
  provinceName: string;
  formTitle: string;
  version: string;
  fields: FormField[];
  groups?: FieldGroup[];
  metadata: {
    estimatedMinutes: number;
    formCode?: string;
    regulatoryBody?: string;
  };
}

export type IntakeStep =
  | { kind: "field"; startIndex: number; field: FormField }
  | {
      kind: "group";
      startIndex: number;
      id: string;
      title?: LocalizedString;
      description?: LocalizedString;
      columns: 1 | 2;
      fields: FormField[];
    };

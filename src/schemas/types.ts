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
  | "info";

export interface FieldOption {
  label: string;
  value: string;
  description?: string;
}

export interface Condition {
  field: string;
  operator: "eq" | "neq" | "in" | "exists";
  value: string | number | boolean | string[];
}

export interface ValidationRule {
  type: "required" | "minLength" | "maxLength" | "pattern" | "min" | "max";
  value?: string | number | boolean;
  message: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  section: string;
  label: string;
  description?: string;
  placeholder?: string;
  options?: FieldOption[];
  validation?: ValidationRule[];
  conditions?: Condition[];
  defaultValue?: string | number | boolean;
}

export interface ProvinceSchema {
  provinceSlug: string;
  provinceName: string;
  formTitle: string;
  version: string;
  fields: FormField[];
  metadata: {
    estimatedMinutes: number;
    formCode?: string;
    regulatoryBody?: string;
  };
}

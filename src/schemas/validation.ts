import { z } from "zod/v4";
import type { FormField, ValidationRule } from "./types";

function buildFieldSchema(field: FormField): z.ZodType {
  const rules = field.validation ?? [];
  const isRequired = rules.some((r) => r.type === "required");

  if (field.type === "checkbox") {
    if (isRequired) {
      return z.literal(true, {
        error: rules.find((r) => r.type === "required")?.message ?? "Required",
      });
    }
    return z.boolean().optional();
  }

  if (field.type === "number") {
    let schema = z.number();
    for (const rule of rules) {
      if (rule.type === "min" && typeof rule.value === "number") {
        schema = schema.min(rule.value, rule.message);
      }
      if (rule.type === "max" && typeof rule.value === "number") {
        schema = schema.max(rule.value, rule.message);
      }
    }
    return isRequired ? schema : schema.optional();
  }

  // String-based fields
  let schema = z.string();
  for (const rule of rules) {
    if (rule.type === "required") {
      schema = schema.min(1, rule.message);
    }
    if (rule.type === "minLength" && typeof rule.value === "number") {
      schema = schema.min(rule.value, rule.message);
    }
    if (rule.type === "maxLength" && typeof rule.value === "number") {
      schema = schema.max(rule.value, rule.message);
    }
    if (rule.type === "pattern" && typeof rule.value === "string") {
      schema = schema.regex(new RegExp(rule.value), rule.message);
    }
  }

  return isRequired ? schema : schema.optional();
}

export function buildFieldValidator(field: FormField): z.ZodType {
  return buildFieldSchema(field);
}

export function validateField(
  field: FormField,
  value: unknown
): { valid: boolean; error?: string } {
  const schema = buildFieldSchema(field);
  const result = schema.safeParse(value);
  if (result.success) return { valid: true };
  return { valid: false, error: result.error.issues[0]?.message ?? "Invalid" };
}

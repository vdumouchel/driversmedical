import { z } from "zod/v4";
import type { FormField, ValidationRule } from "./types";
import { resolveLS } from "@/lib/i18n-utils";

function buildFieldSchema(field: FormField, lang: string): z.ZodType {
  const rules = field.validation ?? [];
  const isRequired = rules.some((r) => r.type === "required");

  function msg(rule: ValidationRule) {
    return resolveLS(rule.message, lang);
  }

  if (field.type === "checkbox") {
    if (isRequired) {
      const rule = rules.find((r) => r.type === "required");
      return z.literal(true, { error: rule ? msg(rule) : "Required" });
    }
    return z.boolean().optional();
  }

  if (field.type === "number") {
    let schema = z.number();
    for (const rule of rules) {
      if (rule.type === "min" && typeof rule.value === "number") {
        schema = schema.min(rule.value, msg(rule));
      }
      if (rule.type === "max" && typeof rule.value === "number") {
        schema = schema.max(rule.value, msg(rule));
      }
    }
    return isRequired ? schema : schema.optional();
  }

  let schema = z.string();

  // Email gets the built-in zod email format check baked in. Required messaging
  // still flows through the rules array.
  if (field.type === "email") {
    const requiredRule = rules.find((r) => r.type === "required");
    schema = z.string().email(
      lang === "fr"
        ? "Veuillez saisir une adresse courriel valide."
        : "Please enter a valid email address."
    );
    if (isRequired) {
      schema = schema.min(1, requiredRule ? msg(requiredRule) : "Required");
    }
    return isRequired ? schema : schema.optional();
  }

  for (const rule of rules) {
    if (rule.type === "required") {
      schema = schema.min(1, msg(rule));
    }
    if (rule.type === "minLength" && typeof rule.value === "number") {
      schema = schema.min(rule.value, msg(rule));
    }
    if (rule.type === "maxLength" && typeof rule.value === "number") {
      schema = schema.max(rule.value, msg(rule));
    }
    if (rule.type === "pattern" && typeof rule.value === "string") {
      schema = schema.regex(new RegExp(rule.value), msg(rule));
    }
  }

  return isRequired ? schema : schema.optional();
}

export function buildFieldValidator(field: FormField, lang = "en"): z.ZodType {
  return buildFieldSchema(field, lang);
}

export function validateField(
  field: FormField,
  value: unknown,
  lang = "en"
): { valid: boolean; error?: string } {
  const schema = buildFieldSchema(field, lang);
  const result = schema.safeParse(value);
  if (result.success) return { valid: true };
  return { valid: false, error: result.error.issues[0]?.message ?? "Invalid" };
}

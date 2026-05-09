"use client";

import { useState } from "react";
import type { FormField, IntakeStep, MedicationEntry } from "@/schemas/types";
import type { AnswerValue } from "@/stores/intake-store";
import { validateField } from "@/schemas/validation";
import { resolveLS } from "@/lib/i18n-utils";
import { useLang } from "@/lib/i18n-hooks";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { OptionButton } from "./option-button";

// Native <input type="date"> in some browsers (Chrome) accepts 5+ digit years.
// Clamp to 4 digits so the year segment auto-advances to month/day after 4
// numbers and we never store an absurd year like "12345-06-07".
function clampDateYear(value: string): string {
  // Match YYYY...-MM-DD where the year portion may have 5+ digits.
  const m = /^(\d+)(-\d{2}-\d{2})$/.exec(value);
  if (!m) return value;
  const [, year, rest] = m;
  if (year.length <= 4) return value;
  return year.slice(0, 4) + rest;
}

// ─── Medication table ──────────────────────────────────────────────────────────

const EMPTY_ROW: MedicationEntry = { name: "", dosage: "", frequency: "" };

function MedicationTableInput({
  fieldId,
  value,
  onChange,
  lang,
}: {
  fieldId: string;
  value: MedicationEntry[];
  onChange: (rows: MedicationEntry[]) => void;
  lang: string;
}) {
  const rows = value.length > 0 ? value : [{ ...EMPTY_ROW }];

  const labels =
    lang === "fr"
      ? { name: "Médicament", dosage: "Dose", freq: "Fréquence", add: "+ Ajouter un médicament", title: "Médicaments" }
      : { name: "Medication Name", dosage: "Dosage", freq: "Frequency", add: "+ Add medication", title: "Medications" };

  function updateRow(idx: number, key: keyof MedicationEntry, val: string) {
    const next = rows.map((r, i) => (i === idx ? { ...r, [key]: val } : r));
    onChange(next);
  }

  function addRow() {
    onChange([...rows, { ...EMPTY_ROW }]);
  }

  function removeRow(idx: number) {
    const next = rows.filter((_, i) => i !== idx);
    onChange(next.length > 0 ? next : [{ ...EMPTY_ROW }]);
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-foreground">{labels.title}</p>
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-3 py-2 font-medium text-muted-foreground w-[40%]">{labels.name}</th>
              <th className="text-left px-3 py-2 font-medium text-muted-foreground w-[25%]">{labels.dosage}</th>
              <th className="text-left px-3 py-2 font-medium text-muted-foreground w-[25%]">{labels.freq}</th>
              <th className="w-[10%]" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="border-t border-border/50">
                <td className="px-2 py-1.5">
                  <Input
                    id={idx === 0 ? fieldId : undefined}
                    value={row.name}
                    onChange={(e) => updateRow(idx, "name", e.target.value)}
                    placeholder={lang === "fr" ? "Nom du médicament" : "Medication name"}
                    className="h-8 text-sm border-0 shadow-none focus-visible:ring-0 px-1"
                  />
                </td>
                <td className="px-2 py-1.5">
                  <Input
                    value={row.dosage}
                    onChange={(e) => updateRow(idx, "dosage", e.target.value)}
                    placeholder={lang === "fr" ? "ex. 10 mg" : "e.g. 10 mg"}
                    className="h-8 text-sm border-0 shadow-none focus-visible:ring-0 px-1"
                  />
                </td>
                <td className="px-2 py-1.5">
                  <Input
                    value={row.frequency}
                    onChange={(e) => updateRow(idx, "frequency", e.target.value)}
                    placeholder={lang === "fr" ? "ex. 2x/jour" : "e.g. 2x/day"}
                    className="h-8 text-sm border-0 shadow-none focus-visible:ring-0 px-1"
                  />
                </td>
                <td className="px-2 py-1.5 text-center">
                  {rows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRow(idx)}
                      className="text-muted-foreground hover:text-destructive transition-colors text-base leading-none"
                      aria-label="Remove row"
                    >
                      ×
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={addRow}
        className="text-sm text-primary hover:underline"
      >
        {labels.add}
      </button>
    </div>
  );
}

// ─── Mask utilities ───────────────────────────────────────────────────────────

function applyMask(input: string, mask: string): string {
  const chars = input.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  let result = "";
  let ci = 0;

  for (let mi = 0; mi < mask.length; mi++) {
    if (ci >= chars.length) break;
    const m = mask[mi];
    if (m === "A") {
      if (/[A-Z]/.test(chars[ci])) result += chars[ci++];
      else break;
    } else if (m === "X" || /^[0-9]$/.test(m)) {
      // X or a mask digit (e.g. "A1A 1A1") — digit slot; don't paste the template digit
      if (/[0-9]/.test(chars[ci])) result += chars[ci++];
      else break;
    } else {
      result += m; // literal — auto-insert, don't consume input char
    }
  }
  return result;
}

function maskToRegex(mask: string): RegExp {
  const pattern = mask
    .split("")
    .map((ch) => {
      if (ch === "A") return "[A-Z]";
      if (ch === "X" || /^[0-9]$/.test(ch)) return "[0-9]";
      return ch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    })
    .join("");
  return new RegExp(`^${pattern}$`);
}

// ─── Phone formatter ──────────────────────────────────────────────────────────

function formatPhoneInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

// ─── GroupStep ─────────────────────────────────────────────────────────────────

interface GroupStepProps {
  step: Extract<IntakeStep, { kind: "group" }>;
  answers: Record<string, AnswerValue>;
  onSubmit: (values: Record<string, AnswerValue>) => void;
}

type TextValues = Record<string, string>;
type MedValues = Record<string, MedicationEntry[]>;
type CheckValues = Record<string, string[]>;

function initTextValues(fields: FormField[], answers: GroupStepProps["answers"]): TextValues {
  const out: TextValues = {};
  for (const f of fields) {
    if (f.type === "medication-table" || f.type === "checkboxes") continue;
    const v = answers[f.id];
    out[f.id] = v === undefined || v === null || Array.isArray(v) ? "" : String(v);
  }
  return out;
}

function initMedValues(fields: FormField[], answers: GroupStepProps["answers"]): MedValues {
  const out: MedValues = {};
  for (const f of fields) {
    if (f.type !== "medication-table") continue;
    const v = answers[f.id];
    out[f.id] = Array.isArray(v) && (v.length === 0 || typeof (v as unknown[])[0] === "object")
      ? (v as MedicationEntry[])
      : [{ ...EMPTY_ROW }];
  }
  return out;
}

function initCheckValues(fields: FormField[], answers: GroupStepProps["answers"]): CheckValues {
  const out: CheckValues = {};
  for (const f of fields) {
    if (f.type !== "checkboxes") continue;
    const v = answers[f.id];
    out[f.id] = Array.isArray(v) && (v.length === 0 || typeof v[0] === "string")
      ? (v as string[])
      : [];
  }
  return out;
}

export function GroupStep({ step, answers, onSubmit }: GroupStepProps) {
  const lang = useLang();

  const [textValues, setTextValues] = useState<TextValues>(() =>
    initTextValues(step.fields, answers)
  );
  const [medValues, setMedValues] = useState<MedValues>(() =>
    initMedValues(step.fields, answers)
  );
  const [checkValues, setCheckValues] = useState<CheckValues>(() =>
    initCheckValues(step.fields, answers)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleTextChange(fieldId: string, v: string, mask?: string) {
    const val = mask ? applyMask(v, mask) : v;
    setTextValues((prev) => ({ ...prev, [fieldId]: val }));
    if (errors[fieldId]) setErrors((prev) => { const { [fieldId]: _, ...rest } = prev; return rest; });
  }

  function handlePhoneChange(fieldId: string, raw: string) {
    setTextValues((prev) => ({ ...prev, [fieldId]: formatPhoneInput(raw) }));
    if (errors[fieldId]) setErrors((prev) => { const { [fieldId]: _, ...rest } = prev; return rest; });
  }

  function handleMedChange(fieldId: string, rows: MedicationEntry[]) {
    setMedValues((prev) => ({ ...prev, [fieldId]: rows }));
  }

  function handleCheckChange(fieldId: string, value: string, checked: boolean) {
    setCheckValues((prev) => {
      const current = prev[fieldId] ?? [];
      const next = checked ? [...current, value] : current.filter((v) => v !== value);
      return { ...prev, [fieldId]: next };
    });
    if (errors[fieldId]) setErrors((prev) => { const { [fieldId]: _, ...rest } = prev; return rest; });
  }

  function handleContinue() {
    const nextErrors: Record<string, string> = {};
    const normalized: Record<string, AnswerValue> = {};

    for (const f of step.fields) {
      if (f.type === "checkboxes") {
        const vals = checkValues[f.id] ?? [];
        normalized[f.id] = vals;
        if (f.validation?.some((r) => r.type === "required") && vals.length === 0) {
          const rule = f.validation.find((r) => r.type === "required")!;
          nextErrors[f.id] = resolveLS(rule.message, lang);
        }
        continue;
      }

      if (f.type === "medication-table") {
        const rows = medValues[f.id] ?? [];
        // keep only rows with at least a name filled
        normalized[f.id] = rows.filter((r) => r.name.trim() !== "");
        continue;
      }
      const raw = textValues[f.id] ?? "";
      const value: string | number = f.type === "number" ? Number(raw) : raw;

      if (f.mask && !maskToRegex(f.mask).test(String(value))) {
        nextErrors[f.id] = lang === "fr"
          ? `Format requis\u00a0: ${f.mask}`
          : `Required format: ${f.mask}`;
        continue;
      }

      const result = validateField(f, value, lang);
      if (!result.valid) {
        nextErrors[f.id] = result.error ?? "Invalid";
      } else {
        normalized[f.id] = value;
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit(normalized);
  }

  const columns = step.columns;
  const gridClass =
    columns === 2
      ? "grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5"
      : "grid grid-cols-1 gap-y-5";

  const title = step.title ? resolveLS(step.title, lang) : undefined;
  const description = step.description ? resolveLS(step.description, lang) : undefined;

  return (
    <div className="w-full max-w-2xl">
      {(title || description) && (
        <div className="text-center mb-8">
          {title && (
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2 leading-snug">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-muted-foreground text-sm max-w-md mx-auto">{description}</p>
          )}
        </div>
      )}

      <div className={gridClass}>
        {step.fields.map((field) => {
          const fieldLabel = resolveLS(field.label, lang);
          const fieldDesc = field.description ? resolveLS(field.description, lang) : undefined;
          const fieldPlaceholder = field.placeholder ? resolveLS(field.placeholder, lang) : undefined;
          const isMedTable = field.type === "medication-table";
          const spanFull =
            field.type === "textarea" ||
            field.type === "info" ||
            field.type === "checkboxes" ||
            isMedTable;

          return (
            <div
              key={field.id}
              className={`flex flex-col gap-2 text-left ${
                columns === 2 && spanFull ? "sm:col-span-2" : ""
              }`}
            >
              {!isMedTable && (
                <Label htmlFor={field.id} className="text-sm text-foreground">
                  {fieldLabel}
                </Label>
              )}

              {isMedTable ? (
                <MedicationTableInput
                  fieldId={field.id}
                  value={medValues[field.id] ?? [{ ...EMPTY_ROW }]}
                  onChange={(rows) => handleMedChange(field.id, rows)}
                  lang={lang}
                />
              ) : field.type === "textarea" ? (
                <Textarea
                  id={field.id}
                  rows={5}
                  placeholder={fieldPlaceholder}
                  value={textValues[field.id] ?? ""}
                  onChange={(e) => handleTextChange(field.id, e.target.value)}
                />
              ) : field.type === "date" ? (
                <Input
                  id={field.id}
                  type="date"
                  max="9999-12-31"
                  value={textValues[field.id] ?? ""}
                  onChange={(e) =>
                    handleTextChange(field.id, clampDateYear(e.target.value))
                  }
                />
              ) : field.type === "number" ? (
                <Input
                  id={field.id}
                  type="number"
                  placeholder={fieldPlaceholder}
                  value={textValues[field.id] ?? ""}
                  onChange={(e) => handleTextChange(field.id, e.target.value)}
                />
              ) : field.type === "phone" ? (
                <Input
                  id={field.id}
                  type="tel"
                  inputMode="numeric"
                  placeholder={fieldPlaceholder ?? "(XXX) XXX-XXXX"}
                  value={textValues[field.id] ?? ""}
                  onChange={(e) => handlePhoneChange(field.id, e.target.value)}
                />
              ) : field.type === "option-select" || field.type === "select" ? (
                <select
                  id={field.id}
                  value={textValues[field.id] ?? ""}
                  onChange={(e) => handleTextChange(field.id, e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                >
                  <option value="" disabled>
                    {fieldPlaceholder ?? (lang === "fr" ? "Sélectionner" : "Select an option")}
                  </option>
                  {(field.options ?? []).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {resolveLS(opt.label, lang)}
                      {opt.description ? ` — ${resolveLS(opt.description, lang)}` : ""}
                    </option>
                  ))}
                </select>
              ) : field.type === "checkboxes" ? (
                <div className="space-y-2.5">
                  {(field.options ?? []).map((opt) => (
                    <label key={opt.value} className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={(checkValues[field.id] ?? []).includes(opt.value)}
                        onChange={(e) => handleCheckChange(field.id, opt.value, e.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-input accent-primary cursor-pointer"
                      />
                      <span className="text-sm text-foreground leading-snug">
                        {resolveLS(opt.label, lang)}
                      </span>
                    </label>
                  ))}
                </div>
              ) : field.type === "yes-no" ? (
                <div className="space-y-2.5">
                  <OptionButton
                    label={lang === "fr" ? "Oui" : "Yes"}
                    selected={textValues[field.id] === "yes"}
                    onClick={() => handleTextChange(field.id, "yes")}
                  />
                  <OptionButton
                    label={lang === "fr" ? "Non" : "No"}
                    selected={textValues[field.id] === "no"}
                    onClick={() => handleTextChange(field.id, "no")}
                  />
                </div>
              ) : field.type === "email" ? (
                <Input
                  id={field.id}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder={fieldPlaceholder ?? "you@example.com"}
                  value={textValues[field.id] ?? ""}
                  onChange={(e) => handleTextChange(field.id, e.target.value)}
                />
              ) : (
                <Input
                  id={field.id}
                  type="text"
                  placeholder={field.mask ?? fieldPlaceholder}
                  value={textValues[field.id] ?? ""}
                  onChange={(e) => handleTextChange(field.id, e.target.value, field.mask)}
                />
              )}

              {fieldDesc && !isMedTable && !errors[field.id] && (
                <p className="text-xs text-muted-foreground">{fieldDesc}</p>
              )}
              {errors[field.id] && (
                <p className="text-xs text-destructive">{errors[field.id]}</p>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={handleContinue}
        className="mt-8 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        {lang === "fr" ? "Continuer" : "Continue"}
      </button>
    </div>
  );
}

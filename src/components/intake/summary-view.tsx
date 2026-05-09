"use client";

import { useMemo } from "react";
import { useIntakeStore } from "@/stores/intake-store";
import { resolveLS } from "@/lib/i18n-utils";
import { useLang } from "@/lib/i18n-hooks";
import type { FormField, MedicationEntry } from "@/schemas/types";

interface SectionGroup {
  sectionKey: string;
  sectionLabel: string;
  fields: (FormField & { answer: unknown })[];
}

function isMedicationArray(v: unknown): v is MedicationEntry[] {
  return Array.isArray(v) && (v.length === 0 || (typeof (v as unknown[])[0] === "object" && (v as unknown[])[0] !== null && "name" in ((v as unknown[])[0] as object)));
}

function formatAnswer(field: FormField, value: unknown, lang: string): string {
  if (field.type === "yes-no") {
    return value === "yes" ? (lang === "fr" ? "Oui" : "Yes") : (lang === "fr" ? "Non" : "No");
  }
  if (field.type === "checkbox") {
    return value ? (lang === "fr" ? "Confirmé" : "Confirmed") : (lang === "fr" ? "Non confirmé" : "Not confirmed");
  }
  if ((field.type === "option-select" || field.type === "select") && field.options) {
    const opt = field.options.find((o) => o.value === value);
    return opt ? resolveLS(opt.label, lang) : String(value);
  }
  if (field.type === "checkboxes" && Array.isArray(value)) {
    const selected = value as string[];
    if (selected.length === 0) return lang === "fr" ? "Aucune sélection" : "None selected";
    if (!field.options) return selected.join(", ");
    return selected
      .map((v) => {
        const opt = field.options!.find((o) => o.value === v);
        return opt ? resolveLS(opt.label, lang) : v;
      })
      .join("\n");
  }
  if (isMedicationArray(value)) return ""; // rendered separately
  return String(value);
}

export function SummaryView() {
  const lang = useLang();
  const { fields, answers, getVisibleFields } = useIntakeStore();

  const sections = useMemo(() => {
    const visible = getVisibleFields();
    const groups: SectionGroup[] = [];
    let currentSection: SectionGroup | null = null;

    for (const field of visible) {
      const val = answers[field.id];
      if (val === undefined) continue;
      // Hide medication-table fields when the user added no rows — no point
      // showing an empty header or a "None" placeholder.
      if (isMedicationArray(val) && val.length === 0) continue;

      // Use the resolved English label as a stable grouping key. Works for
      // both `{ en, fr }` literals and Lingui MessageDescriptors.
      const sectionKey = resolveLS(field.section, "en");
      const sectionLabel = resolveLS(field.section, lang);

      if (!currentSection || currentSection.sectionKey !== sectionKey) {
        currentSection = { sectionKey, sectionLabel, fields: [] };
        groups.push(currentSection);
      }
      currentSection.fields.push({ ...field, answer: val });
    }

    // Drop sections that ended up with nothing to show.
    return groups.filter((g) => g.fields.length > 0);
  }, [fields, answers, getVisibleFields, lang]);

  return (
    <div className="space-y-8">
      {sections.map((group) => (
        <div key={group.sectionKey}>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            {group.sectionLabel}
          </h3>
          <div className="space-y-3">
            {group.fields.map((field) => {
              const isMedTable = isMedicationArray(field.answer);
              const meds = isMedTable ? (field.answer as unknown as MedicationEntry[]) : [];
              const medHeaders =
                lang === "fr"
                  ? ["Médicament", "Dose", "Fréquence"]
                  : ["Medication", "Dosage", "Frequency"];

              return (
                <div
                  key={field.id}
                  className="py-3 border-b border-border/50 last:border-0"
                >
                  <span className="text-sm text-foreground font-medium block mb-1">
                    {resolveLS(field.label, lang)}
                  </span>
                  {field.type === "checkboxes" && Array.isArray(field.answer) ? (
                    (field.answer as string[]).length === 0 ? (
                      <span className="text-sm text-muted-foreground">{lang === "fr" ? "Aucune sélection" : "None selected"}</span>
                    ) : (
                      <ul className="space-y-0.5 mt-1">
                        {(field.answer as string[]).map((v) => {
                          const opt = field.options?.find((o) => o.value === v);
                          return (
                            <li key={v} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground/50 shrink-0" />
                              {opt ? resolveLS(opt.label, lang) : v}
                            </li>
                          );
                        })}
                      </ul>
                    )
                  ) : isMedTable ? (
                    meds.length === 0 ? (
                      <span className="text-sm text-muted-foreground">
                        {lang === "fr" ? "Aucun médicament" : "None"}
                      </span>
                    ) : (
                      <table className="w-full text-sm mt-1">
                        <thead>
                          <tr className="text-muted-foreground">
                            {medHeaders.map((h) => (
                              <th key={h} className="text-left font-normal pb-1 pr-4">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {meds.map((row, i) => (
                            <tr key={i}>
                              <td className="pr-4 py-0.5">{row.name}</td>
                              <td className="pr-4 py-0.5">{row.dosage}</td>
                              <td className="py-0.5">{row.frequency}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {formatAnswer(field, field.answer, lang)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

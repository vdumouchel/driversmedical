"use client";

import { useMemo } from "react";
import { useIntakeStore } from "@/stores/intake-store";
import type { FormField } from "@/schemas/types";

interface SectionGroup {
  section: string;
  fields: (FormField & { answer: string | number | boolean })[];
}

function formatAnswer(field: FormField, value: string | number | boolean): string {
  if (field.type === "yes-no") {
    return value === "yes" ? "Yes" : "No";
  }
  if (field.type === "checkbox") {
    return value ? "Confirmed" : "Not confirmed";
  }
  if (field.type === "option-select" && field.options) {
    const opt = field.options.find((o) => o.value === value);
    return opt?.label ?? String(value);
  }
  return String(value);
}

export function SummaryView() {
  const { fields, answers, getVisibleFields } = useIntakeStore();

  const sections = useMemo(() => {
    const visible = getVisibleFields();
    const groups: SectionGroup[] = [];
    let currentSection: SectionGroup | null = null;

    for (const field of visible) {
      const val = answers[field.id];
      if (val === undefined) continue;

      if (!currentSection || currentSection.section !== field.section) {
        currentSection = { section: field.section, fields: [] };
        groups.push(currentSection);
      }
      currentSection.fields.push({ ...field, answer: val });
    }

    return groups;
  }, [fields, answers, getVisibleFields]);

  return (
    <div className="space-y-8">
      {sections.map((group) => (
        <div key={group.section}>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            {group.section}
          </h3>
          <div className="space-y-3">
            {group.fields.map((field) => (
              <div
                key={field.id}
                className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 py-3 border-b border-border/50 last:border-0"
              >
                <span className="text-sm text-foreground font-medium">
                  {field.label}
                </span>
                <span className="text-sm text-muted-foreground sm:text-right max-w-xs">
                  {formatAnswer(field, field.answer)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

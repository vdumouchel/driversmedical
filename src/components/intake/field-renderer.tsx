"use client";

import { useState } from "react";
import type { FormField } from "@/schemas/types";
import { validateField } from "@/schemas/validation";
import { resolveLS } from "@/lib/i18n-utils";
import { useLang } from "@/lib/i18n-hooks";
import { OptionButton } from "./option-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

// Clamp <input type="date"> year to 4 digits so it auto-advances to month/day.
function clampDateYear(value: string): string {
  const m = /^(\d+)(-\d{2}-\d{2})$/.exec(value);
  if (!m) return value;
  const [, year, rest] = m;
  if (year.length <= 4) return value;
  return year.slice(0, 4) + rest;
}

interface FieldRendererProps {
  field: FormField;
  value: string | number | boolean | undefined;
  onSubmit: (value: string | number | boolean) => void;
  error?: string;
}

export function FieldRenderer({
  field,
  value,
  onSubmit,
  error,
}: FieldRendererProps) {
  const lang = useLang();
  const label = resolveLS(field.label, lang);
  const description = field.description ? resolveLS(field.description, lang) : undefined;
  const placeholder = field.placeholder ? resolveLS(field.placeholder, lang) : undefined;

  const [localValue, setLocalValue] = useState<string>(
    value !== undefined ? String(value) : ""
  );

  function handleContinue() {
    if (field.type === "number") {
      onSubmit(Number(localValue));
    } else {
      onSubmit(localValue);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && localValue.trim()) {
      e.preventDefault();
      handleContinue();
    }
  }

  if (field.type === "yes-no") {
    const yes = lang === "fr" ? "Oui" : "Yes";
    const no = lang === "fr" ? "Non" : "No";
    return (
      <div className="space-y-3 w-full max-w-md">
        <OptionButton label={yes} selected={value === "yes"} onClick={() => onSubmit("yes")} />
        <OptionButton label={no} selected={value === "no"} onClick={() => onSubmit("no")} />
      </div>
    );
  }

  if (field.type === "option-select" && field.options) {
    return (
      <div className="space-y-3 w-full max-w-md">
        {field.options.map((opt) => (
          <OptionButton
            key={opt.value}
            label={resolveLS(opt.label, lang)}
            description={opt.description ? resolveLS(opt.description, lang) : undefined}
            selected={value === opt.value}
            onClick={() => onSubmit(opt.value)}
          />
        ))}
      </div>
    );
  }

  if (field.type === "checkbox") {
    return (
      <div className="w-full max-w-md">
        <label className="flex items-start gap-3 cursor-pointer">
          <Checkbox
            checked={value === true}
            onCheckedChange={(checked) => onSubmit(!!checked)}
            className="mt-0.5"
          />
          <span className="text-sm text-foreground leading-relaxed">{label}</span>
        </label>
        {value === true && (
          <button
            onClick={handleContinue}
            className="mt-6 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {lang === "fr" ? "Continuer" : "Continue"}
          </button>
        )}
        {error && <p className="text-sm text-destructive mt-2">{error}</p>}
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div className="w-full max-w-md">
        <Textarea
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder={placeholder}
          rows={6}
          className="text-base"
        />
        {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        <button
          onClick={handleContinue}
          disabled={!localValue.trim()}
          className="mt-6 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {lang === "fr" ? "Continuer" : "Continue"}
        </button>
      </div>
    );
  }

  if (field.type === "date") {
    return (
      <div className="w-full max-w-md">
        <Input type="date" max="9999-12-31" value={localValue} onChange={(e) => setLocalValue(clampDateYear(e.target.value))} className="text-base" />
        {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        <button
          onClick={handleContinue}
          disabled={!localValue}
          className="mt-6 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {lang === "fr" ? "Continuer" : "Continue"}
        </button>
      </div>
    );
  }

  if (field.type === "number") {
    return (
      <div className="w-full max-w-md">
        <Input
          type="number"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="text-base"
        />
        {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        <button
          onClick={handleContinue}
          disabled={!localValue}
          className="mt-6 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {lang === "fr" ? "Continuer" : "Continue"}
        </button>
      </div>
    );
  }

  if (field.type === "info") {
    return (
      <div className="w-full max-w-md">
        <p className="text-muted-foreground leading-relaxed">{description}</p>
        <button
          onClick={() => onSubmit(true)}
          className="mt-6 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          {lang === "fr" ? "Continuer" : "Continue"}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <Input
        type={field.type === "email" ? "email" : "text"}
        inputMode={field.type === "email" ? "email" : undefined}
        autoComplete={field.type === "email" ? "email" : undefined}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="text-base"
        autoFocus
      />
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
      <button
        onClick={handleContinue}
        disabled={!localValue.trim()}
        className="mt-6 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {lang === "fr" ? "Continuer" : "Continue"}
      </button>
    </div>
  );
}

"use client";

import { useState } from "react";
import type { FormField } from "@/schemas/types";
import { OptionButton } from "./option-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

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

  // Yes/No — two large buttons, auto-advance
  if (field.type === "yes-no") {
    return (
      <div className="space-y-3 w-full max-w-md">
        <OptionButton
          label="Yes"
          selected={value === "yes"}
          onClick={() => onSubmit("yes")}
        />
        <OptionButton
          label="No"
          selected={value === "no"}
          onClick={() => onSubmit("no")}
        />
      </div>
    );
  }

  // Option select — multiple buttons, auto-advance
  if (field.type === "option-select" && field.options) {
    return (
      <div className="space-y-3 w-full max-w-md">
        {field.options.map((opt) => (
          <OptionButton
            key={opt.value}
            label={opt.label}
            description={opt.description}
            selected={value === opt.value}
            onClick={() => onSubmit(opt.value)}
          />
        ))}
      </div>
    );
  }

  // Checkbox
  if (field.type === "checkbox") {
    return (
      <div className="w-full max-w-md">
        <label className="flex items-start gap-3 cursor-pointer">
          <Checkbox
            checked={value === true}
            onCheckedChange={(checked) => {
              onSubmit(!!checked);
            }}
            className="mt-0.5"
          />
          <span className="text-sm text-foreground leading-relaxed">
            {field.label}
          </span>
        </label>
        {value === true && (
          <button
            onClick={handleContinue}
            className="mt-6 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Continue
          </button>
        )}
        {error && <p className="text-sm text-destructive mt-2">{error}</p>}
      </div>
    );
  }

  // Textarea
  if (field.type === "textarea") {
    return (
      <div className="w-full max-w-md">
        <Textarea
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder={field.placeholder}
          rows={4}
          className="text-base"
        />
        {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        <button
          onClick={handleContinue}
          disabled={!localValue.trim()}
          className="mt-6 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    );
  }

  // Date
  if (field.type === "date") {
    return (
      <div className="w-full max-w-md">
        <Input
          type="date"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          className="text-base"
        />
        {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        <button
          onClick={handleContinue}
          disabled={!localValue}
          className="mt-6 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    );
  }

  // Number
  if (field.type === "number") {
    return (
      <div className="w-full max-w-md">
        <Input
          type="number"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={field.placeholder}
          className="text-base"
        />
        {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        <button
          onClick={handleContinue}
          disabled={!localValue}
          className="mt-6 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    );
  }

  // Info block
  if (field.type === "info") {
    return (
      <div className="w-full max-w-md">
        <p className="text-muted-foreground leading-relaxed">
          {field.description}
        </p>
        <button
          onClick={() => onSubmit(true)}
          className="mt-6 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Continue
        </button>
      </div>
    );
  }

  // Default: text input
  return (
    <div className="w-full max-w-md">
      <Input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={field.placeholder}
        className="text-base"
        autoFocus
      />
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
      <button
        onClick={handleContinue}
        disabled={!localValue.trim()}
        className="mt-6 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </div>
  );
}

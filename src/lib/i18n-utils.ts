import { i18n } from "@lingui/core";
import type { MessageDescriptor } from "@lingui/core";

type LocalizedString = { en: string; fr: string } | MessageDescriptor;

function isInlineLocalized(v: unknown): v is { en: string; fr: string } {
  return (
    typeof v === "object" &&
    v !== null &&
    "en" in v &&
    "fr" in v &&
    typeof (v as { en: unknown }).en === "string"
  );
}

/**
 * Resolve a localized string for the given language.
 * Accepts either an inline `{ en, fr }` literal or a Lingui `MessageDescriptor`.
 * Lingui descriptors are resolved against the global i18n instance, which is
 * activated per-request via `setI18n()` in `src/app/[lang]/layout.tsx`.
 *
 * Server-safe: this module has no client-only imports. The `useLang` /
 * `useLocalePath` hooks live in `./i18n-hooks` (marked `"use client"`).
 */
export function resolveLS(value: LocalizedString, lang: string): string {
  if (isInlineLocalized(value)) {
    return (value as Record<string, string>)[lang] ?? value.en;
  }
  return i18n._(value as MessageDescriptor);
}

import type { Locale } from "@/lib/i18n";

/**
 * Utility for picking the localized variant from content shaped as `{ en, fr }`.
 * All content modules in this directory export that shape.
 */
export function pickLocale<T>(value: { en: T; fr: T }, lang: string): T {
  return (value as Record<string, T>)[lang] ?? value.en;
}

export type LocalizedContent<T> = Record<Locale, T>;

export { site } from "./site";
export { hero } from "./hero";
export { benefits } from "./benefits";
export { howItWorks } from "./how-it-works";
export { doctor } from "./doctor";
export { testimonials } from "./testimonials";
export { faq } from "./faq";
export { pricing } from "./pricing";
export { intake } from "./intake";

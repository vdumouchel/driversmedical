import type { Locale } from "@/lib/i18n";

/**
 * Utility for picking the localized variant from content shaped as `{ en, fr }`.
 * All content modules in this directory export that shape.
 *
 * `en` and `fr` may differ structurally at the type level (e.g. `as const` string
 * literals); callers receive the union of both branch types.
 */
export function pickLocale<TEn, TFr>(
  value: { en: TEn; fr: TFr },
  lang: string,
): TEn | TFr {
  return lang === "fr" ? value.fr : value.en;
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

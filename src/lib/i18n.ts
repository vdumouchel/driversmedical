import { type I18n, setupI18n } from "@lingui/core";

export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

const catalogCache: Record<string, I18n> = {};

export async function getI18nInstance(locale: string): Promise<I18n> {
  if (catalogCache[locale]) return catalogCache[locale];

  const { messages } = await import(`../locales/${locale}.po`);
  const i18n = setupI18n({
    locale,
    messages: { [locale]: messages },
  });
  i18n.activate(locale);
  catalogCache[locale] = i18n;
  return i18n;
}

/**
 * Activate the global i18n singleton for server-side rendering.
 * The SWC plugin transforms t`` macros to use the global i18n from @lingui/core.
 */
export async function activateGlobalI18n(locale: string) {
  const { i18n } = await import("@lingui/core");
  const { messages } = await import(`../locales/${locale}.po`);
  i18n.load(locale, messages);
  i18n.activate(locale);
}

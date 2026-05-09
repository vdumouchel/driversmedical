"use client";

import { useParams } from "next/navigation";
import { type Locale } from "./i18n";

export function useLang(): Locale {
  // Reads from the route's [lang] segment. Safe in client components — server
  // components should read params directly from their props.
  const params = useParams<{ lang: string }>();
  return (params.lang as Locale) || "en";
}

/** Build a locale-prefixed path. Client-only (uses useParams). */
export function useLocalePath() {
  const lang = useLang();
  return (path: string) => `/${lang}${path}`;
}

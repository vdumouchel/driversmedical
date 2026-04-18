"use client";

import { useParams } from "next/navigation";
import { type Locale } from "./i18n";

export function useLang(): Locale {
  const params = useParams<{ lang: string }>();
  return (params.lang as Locale) || "en";
}

/** Build a locale-prefixed path */
export function useLocalePath() {
  const lang = useLang();
  return (path: string) => `/${lang}${path}`;
}


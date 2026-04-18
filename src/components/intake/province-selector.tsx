"use client";

import { useRouter } from "next/navigation";
import { provinceList } from "@/config/provinces";
import { useIntakeStore } from "@/stores/intake-store";
import { motion } from "framer-motion";
import { useLocalePath, useLang } from "@/lib/i18n-utils";
import { intake } from "@/content/intake";
import { pickLocale } from "@/content";

export function ProvinceSelector() {
  const router = useRouter();
  const setProvince = useIntakeStore((s) => s.setProvince);
  const lp = useLocalePath();
  const lang = useLang();
  const c = pickLocale(intake, lang).provinceSelect;

  const available = provinceList.filter((p) => p.available);
  const unavailable = provinceList.filter((p) => !p.available);

  function handleSelect(slug: string) {
    setProvince(slug);
    router.push(lp(`/intake/${slug}`));
  }

  function labelFor(p: (typeof provinceList)[number]) {
    return lang === "fr" ? p.nameFr : p.nameEn;
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg text-center"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
          {c.heading}
        </h1>
        <p className="text-muted-foreground mb-10">{c.subheading}</p>

        <div className="space-y-3">
          {available.map((p) => (
            <button
              key={p.slug}
              onClick={() => handleSelect(p.slug)}
              className="w-full rounded-xl border border-border bg-card px-6 py-4 text-left hover:border-primary hover:bg-primary/[0.02] transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {labelFor(p)}
                  </p>
                  {p.formCode && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {c.formPrefix} {p.formCode}
                    </p>
                  )}
                </div>
                <svg
                  className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>
          ))}
        </div>

        {unavailable.length > 0 && (
          <div className="mt-8">
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide font-medium">
              {c.comingSoon}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {unavailable.map((p) => (
                <div
                  key={p.slug}
                  className="rounded-lg border border-border/50 bg-muted/20 px-4 py-2.5 text-sm text-muted-foreground"
                >
                  {labelFor(p)}
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

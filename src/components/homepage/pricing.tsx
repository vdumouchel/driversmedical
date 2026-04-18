"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { buttonVariants } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useLingui } from "@lingui/react/macro";
import { PROVINCES, type ProvinceSlug } from "@/lib/constants";
import { isGeoProvince, PRICING_CAD_BY_PROVINCE } from "../../lib/pricing";
import {
  HOME_PROVINCE_QUERY_KEY,
  parseGeoProvinceSearchParam,
} from "@/lib/province-from-geo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocalePath, useLang } from "@/lib/i18n-utils";
import { cn } from "@/lib/utils";

export function Pricing({
  initialProvince,
  initialGeoHint,
}: {
  initialProvince: ProvinceSlug | null;
  initialGeoHint: boolean;
}) {
  const { t } = useLingui();
  const lang = useLang();
  const lp = useLocalePath();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlProvince = useMemo(
    () =>
      parseGeoProvinceSearchParam(
        searchParams.get(HOME_PROVINCE_QUERY_KEY),
      ),
    [searchParams],
  );
  const province: ProvinceSlug | null = urlProvince ?? initialProvince;
  const geoHint = urlProvince == null && initialGeoHint;

  const price =
    province && isGeoProvince(province)
      ? PRICING_CAD_BY_PROVINCE[province]
      : undefined;

  const features = useMemo(() => {
    if (!province || !isGeoProvince(province)) return [];
    if (province === "new-brunswick") {
      return [
        t`Complete your DL-1 driver medical questionnaire online`,
        t`Review by a licensed physician or nurse in New Brunswick`,
        t`Official signed DL-1 form delivered digitally`,
        t`Secure PDF emailed to you, ready to submit`,
        t`Same-day processing when you qualify`,
        t`PIPEDA-compliant, encrypted intake`,
        t`Support available 7 days a week`,
      ];
    }
    return [
      t`Complete your M-28 commercial driver medical questionnaire online`,
      t`Review by a licensed physician or nurse in Quebec`,
      t`In-person visit required for the vision (eye) examination`,
      t`Our clinic will call you within 72 hours to schedule your in-person appointment, depending on your availability`,
      t`Official signed M-28 form aligned with SAAQ requirements`,
      t`Secure PDF emailed to you, ready to submit`,
      t`Same-day processing when you qualify`,
      t`PIPEDA-compliant, encrypted intake`,
      t`Support available 7 days a week`,
    ];
  }, [province, t]);

  const intakeHref = province ? lp(`/intake/${province}`) : lp("/intake");

  const firstUnavailableIndex = PROVINCES.findIndex((p) => !p.available);

  function labelFor(p: (typeof PROVINCES)[number]) {
    return lang === "fr" ? p.nameFr : p.nameEn;
  }

  return (
    <div id="get-started">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        <div className="relative p-8 sm:p-12">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5">
              <span className="text-xs font-medium text-primary">
                {t`All-Inclusive Price`}
              </span>
            </div>

            <div className="mt-6 w-full max-w-xs">
              <Select
                value={province}
                onValueChange={(v) => {
                  const slug = (v ?? null) as ProvinceSlug | null;
                  if (slug && isGeoProvince(slug)) {
                    const next = new URLSearchParams(searchParams.toString());
                    next.set(HOME_PROVINCE_QUERY_KEY, slug);
                    router.replace(`${pathname}?${next.toString()}`, {
                      scroll: false,
                    });
                  }
                }}
              >
                <SelectTrigger
                  size="default"
                  className="h-10 w-full min-w-0 max-w-none justify-between border-input bg-background px-3 data-[size=default]:h-10"
                  aria-label={t`Select your province`}
                >
                  <SelectValue placeholder={t`Select your province`}>
                    {(slug: string | null) => {
                      if (!slug) return t`Select your province`;
                      const p = PROVINCES.find((x) => x.slug === slug);
                      if (!p) return slug;
                      return (
                        <span className="flex min-w-0 items-center gap-2">
                          <span className="font-semibold tabular-nums">
                            {p.code}
                          </span>
                          <span className="text-muted-foreground">·</span>
                          <span className="truncate">{labelFor(p)}</span>
                        </span>
                      );
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="min-w-[var(--anchor-width)]">
                  {PROVINCES.flatMap((p, i) => {
                    const sep =
                      i === firstUnavailableIndex && i > 0 ? (
                        <SelectSeparator key={`sep-before-${p.slug}`} />
                      ) : null;
                    const item = (
                      <SelectItem
                        key={p.slug}
                        value={p.slug}
                        disabled={!p.available}
                        className={cn(
                          !p.available &&
                            "text-muted-foreground opacity-60 data-highlighted:bg-transparent data-highlighted:text-muted-foreground",
                        )}
                      >
                        {p.available ? (
                          <span className="flex w-full items-center gap-2">
                            <span className="font-semibold tabular-nums">
                              {p.code}
                            </span>
                            <span className="text-muted-foreground">·</span>
                            <span className="truncate">{labelFor(p)}</span>
                          </span>
                        ) : (
                          <span className="flex w-full min-w-0 items-center justify-between gap-3">
                            <span className="flex min-w-0 items-center gap-2">
                              <span className="font-semibold tabular-nums text-foreground/50">
                                {p.code}
                              </span>
                              <span className="text-muted-foreground">·</span>
                              <span className="truncate">{labelFor(p)}</span>
                            </span>
                            <span className="shrink-0 text-xs font-normal text-muted-foreground">
                              {t`Soon available`}
                            </span>
                          </span>
                        )}
                      </SelectItem>
                    );
                    return sep ? [sep, item] : [item];
                  })}
                </SelectContent>
              </Select>
            </div>

            {geoHint && province && isGeoProvince(province) ? (
              <p className="mt-3 max-w-md text-xs text-muted-foreground">
                {t`We matched your location to show the right price. Change the province above if needed.`}
              </p>
            ) : null}

            <div className="mt-6 flex min-h-[4.5rem] items-center justify-center">
              {price != null ? (
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-foreground sm:text-6xl">
                    ${price}
                  </span>
                  <span className="text-xl text-muted-foreground">CAD</span>
                </div>
              ) : null}
            </div>

            <p className="mt-4 text-lg text-muted-foreground">
              {t`One simple price. No hidden fees or surprises.`}
            </p>

            {features.length > 0 ? (
              <div className="mt-8 grid w-full gap-3 sm:grid-cols-2">
                {features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 text-left"
                  >
                    <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}

            <div
              className={cn(
                "flex w-full flex-col gap-4 sm:flex-row sm:justify-center",
                features.length > 0 ? "mt-10" : "mt-8",
              )}
            >
              <Link
                href={intakeHref}
                className={buttonVariants({
                  size: "lg",
                  className: "text-base sm:px-12",
                })}
              >
                {t`Get Started`}
              </Link>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              {t`Secure payment processed after intake completion. Full refund if one of our providers cannot complete your form.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

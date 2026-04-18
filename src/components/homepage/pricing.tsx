"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { buttonVariants } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import {
  provinceList,
  getProvince,
  isActiveProvince,
  parseProvinceSearchParam,
  HOME_PROVINCE_QUERY_KEY,
  type ActiveProvinceSlug,
  type ProvinceContent,
} from "@/config/provinces";
import { pricing } from "@/content/pricing";
import { pickLocale } from "@/content";
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
  initialProvince: ActiveProvinceSlug | null;
  initialGeoHint: boolean;
}) {
  const lang = useLang();
  const c = pickLocale(pricing, lang);
  const lp = useLocalePath();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlProvince = useMemo(
    () => parseProvinceSearchParam(searchParams.get(HOME_PROVINCE_QUERY_KEY)),
    [searchParams],
  );
  const province: ActiveProvinceSlug | null = urlProvince ?? initialProvince;
  const geoHint = urlProvince == null && initialGeoHint;

  const provinceData = getProvince(province);
  const price = provinceData?.priceCad;
  const features =
    provinceData?.pricingFeatures != null
      ? pickLocale(provinceData.pricingFeatures, lang)
      : [];

  const intakeHref = province ? lp(`/intake/${province}`) : lp("/intake");

  const firstUnavailableIndex = provinceList.findIndex((p) => !p.available);

  function labelFor(p: ProvinceContent) {
    return lang === "fr" ? p.nameFr : p.nameEn;
  }

  return (
    <div id="get-started">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        <div className="relative p-8 sm:p-12">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5">
              <span className="text-xs font-medium text-primary">{c.badge}</span>
            </div>

            <div className="mt-6 w-full max-w-xs">
              <Select
                value={province}
                onValueChange={(v) => {
                  if (v && isActiveProvince(v)) {
                    const next = new URLSearchParams(searchParams.toString());
                    next.set(HOME_PROVINCE_QUERY_KEY, v);
                    router.replace(`${pathname}?${next.toString()}`, {
                      scroll: false,
                    });
                  }
                }}
              >
                <SelectTrigger
                  size="default"
                  className="h-10 w-full min-w-0 max-w-none justify-between border-input bg-background px-3 data-[size=default]:h-10"
                  aria-label={c.selectLabel}
                >
                  <SelectValue placeholder={c.selectLabel}>
                    {(slug: string | null) => {
                      if (!slug) return c.selectLabel;
                      const p = provinceList.find((x) => x.slug === slug);
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
                  {provinceList.flatMap((p, i) => {
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
                              {c.soonAvailableBadge}
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

            {geoHint && province ? (
              <p className="mt-3 max-w-md text-xs text-muted-foreground">
                {c.geoHint}
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

            <p className="mt-4 text-lg text-muted-foreground">{c.tagline}</p>

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
                {c.cta}
              </Link>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">{c.disclaimer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

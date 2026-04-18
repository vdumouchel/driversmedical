"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLingui } from "@lingui/react/macro";
import { PROVINCES } from "@/lib/constants";
import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLang } from "@/lib/i18n-utils";
import { isGeoProvince } from "@/lib/pricing";
import type { GeoProvinceSlug } from "@/lib/province-from-geo";
import { HOME_PROVINCE_QUERY_KEY } from "@/lib/province-from-geo";
import { cn } from "@/lib/utils";

export function HomeProvinceSelect({
  province,
}: {
  province: GeoProvinceSlug | null;
}) {
  const { t } = useLingui();
  const lang = useLang();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function labelFor(p: (typeof PROVINCES)[number]) {
    return lang === "fr" ? p.nameFr : p.nameEn;
  }

  function applyProvince(slug: GeoProvinceSlug) {
    const next = new URLSearchParams(searchParams.toString());
    next.set(HOME_PROVINCE_QUERY_KEY, slug);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  const firstUnavailableIndex = PROVINCES.findIndex((p) => !p.available);

  return (
    <div className="flex w-full max-w-full flex-col gap-1.5 sm:w-auto sm:min-w-[22rem] md:min-w-[26rem]">
      <span className="text-xs font-medium text-muted-foreground sm:sr-only">
        {t`Province`}
      </span>
      <Select
        value={province ?? undefined}
        onValueChange={(v) => {
          if (isGeoProvince(v)) applyProvince(v);
        }}
      >
        <SelectTrigger
          size="default"
          aria-label={t`Choose province for personalized content`}
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-9 w-full min-w-0 max-w-none justify-between border-border px-3 font-normal sm:min-w-[22rem] md:min-w-[26rem]",
          )}
        >
          <SelectValue placeholder={t`Select your province`}>
            {(slug: string | null) => {
              if (!slug) return t`Select your province`;
              const p = PROVINCES.find((x) => x.slug === slug);
              if (!p) return slug;
              return (
                <span className="flex min-w-0 flex-1 items-center gap-2">
                  <span className="shrink-0 font-semibold tabular-nums">
                    {p.code}
                  </span>
                  <span className="shrink-0 text-muted-foreground">·</span>
                  <span className="min-w-0 truncate text-left">
                    {labelFor(p)}
                  </span>
                </span>
              );
            }}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-w-[min(100vw-1.5rem,32rem)] min-w-[max(var(--anchor-width),22rem)] sm:min-w-[26rem]">
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
                    <span className="font-semibold tabular-nums">{p.code}</span>
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
  );
}

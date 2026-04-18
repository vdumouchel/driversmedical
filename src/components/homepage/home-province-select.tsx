"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import {
  provinceList,
  isActiveProvince,
  HOME_PROVINCE_QUERY_KEY,
  type ActiveProvinceSlug,
  type ProvinceContent,
} from "@/config/provinces";
import { intake } from "@/content/intake";
import { pickLocale } from "@/content";
import { cn } from "@/lib/utils";

export function HomeProvinceSelect({
  province,
}: {
  province: ActiveProvinceSlug | null;
}) {
  const lang = useLang();
  const c = pickLocale(intake, lang).homeProvinceSelect;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function labelFor(p: ProvinceContent) {
    return lang === "fr" ? p.nameFr : p.nameEn;
  }

  function applyProvince(slug: ActiveProvinceSlug) {
    const next = new URLSearchParams(searchParams.toString());
    next.set(HOME_PROVINCE_QUERY_KEY, slug);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  const firstUnavailableIndex = provinceList.findIndex((p) => !p.available);

  return (
    <div className="flex w-full max-w-full flex-col gap-1.5 sm:w-fit sm:max-w-[15rem]">
      <span className="text-xs font-medium text-muted-foreground sm:sr-only">
        {c.provinceLabel}
      </span>
      <Select
        value={province ?? undefined}
        onValueChange={(v) => {
          if (isActiveProvince(v)) applyProvince(v);
        }}
      >
        <SelectTrigger
          size="default"
          aria-label={c.ariaLabel}
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-9 w-full min-w-0 max-w-full justify-between border-border px-3 font-normal sm:max-w-[15rem]",
          )}
        >
          <SelectValue placeholder={c.placeholder}>
            {(slug: string | null) => {
              if (!slug) return c.placeholder;
              const p = provinceList.find((x) => x.slug === slug);
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
        <SelectContent
          className={cn(
            "max-w-[min(100vw-1.5rem,32rem)] min-w-[22rem] sm:min-w-[26rem]",
            // Wider than the compact trigger; default SelectContent uses anchor width only
            "w-[max(22rem,var(--anchor-width))] sm:w-[max(26rem,var(--anchor-width))]",
          )}
        >
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
                      {c.soonAvailable}
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

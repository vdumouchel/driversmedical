import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { buttonVariants } from "@/components/ui/button";
import { CheckCircle, Stethoscope } from "lucide-react";
import { hero } from "@/content/hero";
import { pickLocale } from "@/content";
import { getProvince, type ActiveProvinceSlug } from "@/config/provinces";
import { HomeProvinceSelect } from "./home-province-select";

export async function Hero({
  lang = "en",
  province,
}: {
  lang?: string;
  province: ActiveProvinceSlug | null;
}) {
  const c = pickLocale(hero, lang);
  const lp = (path: string) => `/${lang}${path}`;

  const provinceData = getProvince(province);
  const turnaround = provinceData?.turnaround
    ? pickLocale(provinceData.turnaround, lang)
    : null;

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="mx-auto max-w-6xl px-4 pt-16 pb-4 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5">
              <span className="text-xs font-medium text-primary">{c.eyebrow}</span>
              <span className="text-xs text-muted-foreground">{c.eyebrowSub}</span>
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {c.titleLine1}
              <br />
              <span className="text-primary">{c.titleLine2}</span>
            </h1>

            <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
              {c.body}
            </p>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
              <Link
                href={lp("/intake")}
                className={buttonVariants({ size: "lg", className: "text-base" })}
              >
                {c.ctaPrimary}
              </Link>
              <Suspense
                fallback={
                  <div
                    className="h-9 w-full min-w-[13rem] animate-pulse rounded-lg bg-muted sm:w-auto"
                    aria-hidden
                  />
                }
              >
                <HomeProvinceSelect province={province} />
              </Suspense>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-muted flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center text-center p-8">
                <div>
                  <Stethoscope className="h-20 w-20 text-primary/30 mx-auto mb-4" />
                  <p className="text-lg font-medium text-primary/40">{c.imageOverlay}</p>
                </div>
              </div>
              <Image
                src="/images/hero-driver.jpg"
                alt={c.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="absolute -bottom-4 -right-4 rounded-xl border border-border bg-card p-4 shadow-lg sm:-bottom-6 sm:-right-6">
              <div className="flex items-start justify-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center self-start rounded-full bg-primary/10">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 max-w-[14rem] sm:max-w-[16rem]">
                  {turnaround ? (
                    <p className="text-sm font-medium leading-snug text-foreground">
                      {turnaround}
                    </p>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-foreground">
                        {c.turnaroundDefault.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {c.turnaroundDefault.sub}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-full flex flex-wrap justify-center gap-x-6 gap-y-2 pt-2 sm:justify-start sm:gap-x-8 md:gap-x-10 lg:pt-0">
            {c.bullets.map((bullet) => (
              <div key={bullet} className="flex shrink-0 items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                <span className="whitespace-nowrap text-sm text-muted-foreground">
                  {bullet}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

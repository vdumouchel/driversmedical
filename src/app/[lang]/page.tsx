import { Suspense } from "react";
import { headers } from "next/headers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/homepage/hero";
import { Benefits } from "@/components/homepage/benefits";
import {
  parseGeoProvinceSearchParam,
  resolveGeoProvinceFromHeaders,
} from "@/lib/province-from-geo";
import { HowItWorks } from "@/components/homepage/how-it-works";
import { DoctorSection } from "@/components/homepage/doctor-section";
import { Testimonials } from "@/components/homepage/testimonials";
import { Pricing } from "@/components/homepage/pricing";
import { FAQ } from "@/components/homepage/faq";

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { lang } = await params;
  const sp = (await searchParams) ?? {};
  const provinceFromQuery = parseGeoProvinceSearchParam(sp.province);
  const geoResult = await resolveGeoProvinceFromHeaders(await headers());
  const province = provinceFromQuery ?? geoResult.province;
  const initialGeoHint =
    provinceFromQuery == null && geoResult.province != null;

  return (
    <main className="min-h-screen">
      <Header />
      <Hero lang={lang} province={province} />
      <Benefits lang={lang} province={province} />
      <HowItWorks lang={lang} />
      <DoctorSection lang={lang} />
      <Testimonials lang={lang} />
      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-8">
            <div className="lg:w-1/2">
              <Suspense
                fallback={
                  <div
                    className="min-h-[28rem] rounded-2xl border border-border bg-muted/20 animate-pulse"
                    aria-hidden
                  />
                }
              >
                <Pricing
                  initialProvince={province}
                  initialGeoHint={initialGeoHint}
                />
              </Suspense>
            </div>
            <div className="lg:w-1/2">
              <FAQ />
            </div>
          </div>
        </div>
      </section>
      <Footer lang={lang} />
    </main>
  );
}

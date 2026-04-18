import Image from "next/image";
import Link from "next/link";
import { CheckCircle, UserCheck } from "lucide-react";
import { doctor } from "@/content/doctor";
import { pickLocale } from "@/content";

export async function DoctorSection({ lang = "en" }: { lang?: string }) {
  const c = pickLocale(doctor, lang);
  const lp = (path: string) => `/${lang}${path}`;

  return (
    <section
      className="py-20 sm:py-28"
      style={{ backgroundColor: c.accentColor }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white/10 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center text-center p-8">
                <div>
                  <UserCheck className="h-24 w-24 text-white/30 mx-auto mb-4" />
                  <p className="text-lg font-medium text-white/40">{c.imageOverlay}</p>
                </div>
              </div>
              <Image
                src={c.imageSrc}
                alt={c.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -right-4 -top-4 rounded-xl bg-white p-4 shadow-lg sm:-right-6 sm:-top-6">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: c.accentColor }}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{c.badge.title}</p>
                  <p className="text-xs text-muted-foreground">{c.badge.sub}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 flex flex-col gap-6 lg:order-2">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
              {c.heading}
            </h2>

            <p className="text-lg leading-relaxed text-white/80">{c.body}</p>

            <ul className="space-y-3">
              {c.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-white" />
                  <span className="text-white/80">{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <Link
                href={lp("/intake")}
                className="inline-flex items-center justify-center rounded-md bg-white font-semibold px-8 py-3 text-sm hover:bg-white/90 transition-colors"
                style={{ color: c.accentColor }}
              >
                {c.cta}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

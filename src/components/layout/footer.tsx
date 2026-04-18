import Link from "next/link";
import { TruckElectric } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";
import { msg } from "@lingui/core/macro";
import { getI18nInstance } from "@/lib/i18n";

export async function Footer({ lang = "en" }: { lang?: string }) {
  const i18n = await getI18nInstance(lang);
  const _ = i18n._.bind(i18n);
  const lp = (path: string) => `/${lang}${path}`;
  return (
    <footer className="bg-[#110D0A] text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href={lp("/")} className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                <TruckElectric className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-white">
                {SITE_NAME}
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              {_(msg`Online driver medical exams by licensed Canadian physicians. Fast, secure, and convenient.`)}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">{_(msg`Service`)}</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="#how-it-works"
                  className="text-sm text-white/60 hover:text-white"
                >
                  {_(msg`How It Works`)}
                </Link>
              </li>
              <li>
                <Link
                  href="#benefits"
                  className="text-sm text-white/60 hover:text-white"
                >
                  {_(msg`Benefits`)}
                </Link>
              </li>
              <li>
                <Link
                  href="#get-started"
                  className="text-sm text-white/60 hover:text-white"
                >
                  {_(msg`Pricing`)}
                </Link>
              </li>
              <li>
                <Link
                  href="#faq"
                  className="text-sm text-white/60 hover:text-white"
                >
                  {_(msg`FAQ`)}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">{_(msg`Legal`)}</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href={lp("/privacy")}
                  className="text-sm text-white/60 hover:text-white"
                >
                  {_(msg`Privacy Policy`)}
                </Link>
              </li>
              <li>
                <Link
                  href={lp("/terms")}
                  className="text-sm text-white/60 hover:text-white"
                >
                  {_(msg`Terms of Service`)}
                </Link>
              </li>
              <li>
                <Link
                  href={lp("/consent")}
                  className="text-sm text-white/60 hover:text-white"
                >
                  {_(msg`Telehealth Consent`)}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">{_(msg`Contact`)}</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="mailto:support@driversmedical.clinic"
                  className="text-sm text-white/60 hover:text-white"
                >
                  support@driversmedical.clinic
                </a>
              </li>
              <li>
                <span className="text-sm text-white/60">
                  {_(msg`Mon-Sun: 8am - 10pm EST`)}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-white/40">
              &copy; {new Date().getFullYear()} {SITE_NAME}. {_(msg`All rights reserved.`)}
            </p>
            <p className="text-xs text-white/40">
              {_(msg`Telehealth services provided by licensed Canadian physicians.`)}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

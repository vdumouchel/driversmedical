import Link from "next/link";
import { brand } from "@/config/brand";
import { site } from "@/content/site";
import { pickLocale } from "@/content";

export async function Footer({ lang = "en" }: { lang?: string }) {
  const lp = (path: string) => `/${lang}${path}`;
  const s = pickLocale(site, lang);
  const tagline = pickLocale(brand.footer.tagline, lang);
  const bottomNote = pickLocale(brand.footer.bottomNote, lang);
  const hours = pickLocale(brand.contact.hoursLabel, lang);
  const LogoIcon = brand.logoIcon;

  return (
    <footer className="bg-[#110D0A] text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href={lp("/")} className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                <LogoIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-white">
                {brand.siteName}
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              {tagline}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">{s.footer.service}</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="#how-it-works" className="text-sm text-white/60 hover:text-white">
                  {s.footer.links.howItWorks}
                </Link>
              </li>
              <li>
                <Link href="#benefits" className="text-sm text-white/60 hover:text-white">
                  {s.footer.links.benefits}
                </Link>
              </li>
              <li>
                <Link href="#get-started" className="text-sm text-white/60 hover:text-white">
                  {s.footer.links.pricing}
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-sm text-white/60 hover:text-white">
                  {s.footer.links.faq}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">{s.footer.legal}</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href={lp("/privacy")} className="text-sm text-white/60 hover:text-white">
                  {s.footer.links.privacy}
                </Link>
              </li>
              <li>
                <Link href={lp("/terms")} className="text-sm text-white/60 hover:text-white">
                  {s.footer.links.terms}
                </Link>
              </li>
              <li>
                <Link href={lp("/consent")} className="text-sm text-white/60 hover:text-white">
                  {s.footer.links.consent}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">{s.footer.contact}</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href={`mailto:${brand.contact.email}`}
                  className="text-sm text-white/60 hover:text-white"
                >
                  {brand.contact.email}
                </a>
              </li>
              <li>
                <span className="text-sm text-white/60">{hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-white/40">
              &copy; {new Date().getFullYear()} {brand.siteName}. {s.footer.allRightsReserved}
            </p>
            <p className="text-xs text-white/40">{bottomNote}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

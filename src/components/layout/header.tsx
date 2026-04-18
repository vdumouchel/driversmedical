"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Menu, TruckElectric, X } from "lucide-react";
import { useState } from "react";
import { SITE_NAME } from "@/lib/constants";
import { useLang, useLocalePath } from "@/lib/i18n-utils";
import { usePathname } from "next/navigation";
import { useLingui } from "@lingui/react/macro";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lp = useLocalePath();
  const lang = useLang();
  const pathname = usePathname();
  const otherLang = lang === "en" ? "fr" : "en";
  const switchPath = pathname.replace(`/${lang}`, `/${otherLang}`);
  const { t } = useLingui();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={lp("/")} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <TruckElectric className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">
            {SITE_NAME}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="#how-it-works"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t`How It Works`}
          </Link>
          <Link
            href="#benefits"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t`Benefits`}
          </Link>
          <Link
            href="#testimonials"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t`Testimonials`}
          </Link>
          <Link
            href="#faq"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t`FAQ`}
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href={switchPath}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {otherLang.toUpperCase()}
          </Link>
          <Link href={lp("/intake")} className={buttonVariants()}>
            {t`Get Started`}
          </Link>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t`How It Works`}
            </Link>
            <Link
              href="#benefits"
              className="text-sm font-medium text-muted-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t`Benefits`}
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium text-muted-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t`Testimonials`}
            </Link>
            <Link
              href="#faq"
              className="text-sm font-medium text-muted-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t`FAQ`}
            </Link>
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Link
                href={switchPath}
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {otherLang.toUpperCase()}
              </Link>
              <Link href={lp("/intake")} className={buttonVariants({ size: "sm" })}>
                {t`Get Started`}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

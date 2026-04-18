import { type NextRequest, NextResponse } from "next/server";

const locales = ["en", "fr"];
const defaultLocale = "en";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // App Router API routes live at /api/* — do not prefix with /en or /fr
  if (pathname === "/api" || pathname.startsWith("/api/")) return;

  // Check if pathname already has a locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (pathnameHasLocale) return;

  // Try to detect locale from Accept-Language header
  const acceptLang = request.headers.get("accept-language") ?? "";
  let locale = defaultLocale;
  if (acceptLang.includes("fr")) {
    locale = "fr";
  }

  // Redirect to locale-prefixed path
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

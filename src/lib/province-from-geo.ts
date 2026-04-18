import type { ProvinceSlug } from "@/lib/constants";

/** NB / QC: provinces we resolve from geo (and use for marketing, hero, pricing, etc.). */
export type GeoProvinceSlug = Extract<
  ProvinceSlug,
  "new-brunswick" | "quebec"
>;

export type GeoProvinceResult = {
  province: GeoProvinceSlug | null;
  /** `dev` = NODE_ENV=development + DEV_GEO_PROVINCE env override */
  source: "vercel" | "ip" | "none" | "dev";
};

/** Query key on the homepage for user-selected NB/QC (overrides IP/geo for marketing copy). */
export const HOME_PROVINCE_QUERY_KEY = "province";

/** Parse `?province=` from the URL into a supported geo slug, or null if missing/invalid. */
export function parseGeoProvinceSearchParam(
  raw: string | string[] | null | undefined,
): GeoProvinceSlug | null {
  const s = Array.isArray(raw) ? raw[0] : raw;
  if (!s || typeof s !== "string") return null;
  const n = s.trim().toLowerCase();
  if (n === "new-brunswick" || n === "quebec") return n;
  return null;
}

function geoDebugEnabled(): boolean {
  return (
    process.env.NODE_ENV === "development" || process.env.GEO_DEBUG === "1"
  );
}

function geoLog(...args: unknown[]): void {
  if (geoDebugEnabled()) console.log("[geolocation]", ...args);
}

function normalizeRegionCode(
  regionCode: string | null | undefined,
): string {
  if (!regionCode) return "";
  const u = regionCode.trim().toUpperCase();
  if (u.startsWith("CA-")) return u.slice(3);
  return u;
}

function stripDiacritics(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/** Map Canadian subdivision (ISO-style or name) to a geo-supported province slug, or null. */
export function mapCanadaToGeoProvince(
  countryCode: string | null | undefined,
  regionCode: string | null | undefined,
  regionName: string | null | undefined,
): GeoProvinceSlug | null {
  if (!countryCode || countryCode.trim().toUpperCase() !== "CA") return null;

  const code = normalizeRegionCode(regionCode);
  if (code === "NB") return "new-brunswick";
  if (code === "QC") return "quebec";

  const name = stripDiacritics((regionName ?? "").toLowerCase());
  if (name.includes("new brunswick") || name.includes("nouveau-brunswick"))
    return "new-brunswick";
  if (name === "quebec" || name.includes("quebec")) return "quebec";

  return null;
}

export function getClientIpFromHeaders(h: Headers): string | null {
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const vercelFwd = h.get("x-vercel-forwarded-for");
  if (vercelFwd) {
    const first = vercelFwd.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = h.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  const cf = h.get("cf-connecting-ip")?.trim();
  if (cf) return cf;
  return null;
}

export function isNonRoutableClientIp(ip: string): boolean {
  const v = ip.trim().toLowerCase();
  if (!v) return true;
  if (v === "::1" || v === "0:0:0:0:0:0:0:1") return true;
  if (v.startsWith("127.")) return true;
  if (v.startsWith("10.")) return true;
  if (v.startsWith("192.168.")) return true;
  if (v.startsWith("169.254.")) return true;
  if (v.startsWith("172.")) {
    const parts = v.split(".");
    const second = Number(parts[1]);
    if (second >= 16 && second <= 31) return true;
  }
  if (v.startsWith("fc") || v.startsWith("fd")) return true;
  if (v === "localhost") return true;
  return false;
}

type IpWhoPayload = {
  success?: boolean;
  country_code?: string;
  region?: string;
  region_code?: string;
};

export async function resolveGeoProvinceFromHeaders(
  h: Headers,
): Promise<GeoProvinceResult> {
  if (process.env.NODE_ENV === "development") {
    const raw =
      process.env.DEV_GEO_PROVINCE?.trim().toLowerCase() ??
      process.env.DEV_GEO_PRICED_PROVINCE?.trim().toLowerCase();
    if (raw === "quebec" || raw === "qc") {
      geoLog("DEV_GEO_PROVINCE env → quebec");
      return { province: "quebec", source: "dev" };
    }
    if (
      raw === "new-brunswick" ||
      raw === "nb" ||
      raw === "new brunswick" ||
      raw === "nouveau-brunswick"
    ) {
      geoLog("DEV_GEO_PROVINCE env → new-brunswick");
      return { province: "new-brunswick", source: "dev" };
    }
  }

  const country = h.get("x-vercel-ip-country");
  const region = h.get("x-vercel-ip-country-region");
  geoLog("Vercel headers", {
    "x-vercel-ip-country": country ?? "(missing)",
    "x-vercel-ip-country-region": region ?? "(missing)",
  });

  const fromVercel = mapCanadaToGeoProvince(country, region, null);
  if (fromVercel) {
    geoLog("resolved from Vercel headers →", fromVercel);
    return { province: fromVercel, source: "vercel" };
  }
  if (country || region) {
    geoLog(
      "Vercel subdivision present but not NB/QC; falling back to IP lookup",
    );
  }

  const ip = getClientIpFromHeaders(h);
  geoLog("client IP from request headers →", ip ?? "(none)");

  if (!ip) {
    geoLog("no public client IP in headers; cannot call ipwho.is");
    return { province: null, source: "none" };
  }
  if (isNonRoutableClientIp(ip)) {
    geoLog("client IP is loopback/private; skipping ipwho.is (expected on local dev)");
    return { province: null, source: "none" };
  }

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 4500);
  try {
    geoLog("calling ipwho.is for IP…");
    const res = await fetch(
      `https://ipwho.is/${encodeURIComponent(ip)}`,
      {
        signal: controller.signal,
        headers: { Accept: "application/json" },
        cache: "no-store",
      },
    );
    if (!res.ok) {
      geoLog("ipwho.is HTTP error", res.status, res.statusText);
      return { province: null, source: "none" };
    }

    const data = (await res.json()) as IpWhoPayload;
    if (!data.success) {
      geoLog("ipwho.is success=false", data);
      return { province: null, source: "none" };
    }

    geoLog("ipwho.is payload", {
      country_code: data.country_code,
      region_code: data.region_code,
      region: data.region,
    });

    const province = mapCanadaToGeoProvince(
      data.country_code,
      data.region_code,
      data.region,
    );
    if (province) {
      geoLog("resolved from ipwho.is →", province);
      return { province, source: "ip" };
    }
    geoLog(
      "ipwho.is location is not NB/QC (or not CA); no geo province to return",
    );
  } catch (e) {
    geoLog("ipwho.is error", e instanceof Error ? e.message : e);
  } finally {
    clearTimeout(t);
  }

  geoLog("final result → province: null, source: none");
  return { province: null, source: "none" };
}

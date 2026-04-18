import {
  isActiveProvince,
  provinceList,
  type ActiveProvinceSlug,
} from "@/config/provinces";

/** Alias preserved for existing imports. Equivalent to ActiveProvinceSlug. */
export type GeoProvinceSlug = ActiveProvinceSlug;

export type GeoProvinceResult = {
  province: GeoProvinceSlug | null;
  /** `dev` = NODE_ENV=development + DEV_GEO_PROVINCE env override */
  source: "vercel" | "ip" | "none" | "dev";
};

export { HOME_PROVINCE_QUERY_KEY, parseProvinceSearchParam as parseGeoProvinceSearchParam } from "@/config/provinces";

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

/**
 * Map Canadian subdivision (ISO-style or name) to an active province slug.
 * Only returns a slug for provinces that are actively served by this thematic.
 */
export function mapCanadaToGeoProvince(
  countryCode: string | null | undefined,
  regionCode: string | null | undefined,
  regionName: string | null | undefined,
): GeoProvinceSlug | null {
  if (!countryCode || countryCode.trim().toUpperCase() !== "CA") return null;

  const code = normalizeRegionCode(regionCode);
  if (code) {
    const match = provinceList.find(
      (p) => p.code === code && isActiveProvince(p.slug),
    );
    if (match) return match.slug as GeoProvinceSlug;
  }

  const name = stripDiacritics((regionName ?? "").toLowerCase()).trim();
  if (name) {
    const match = provinceList.find((p) => {
      if (!isActiveProvince(p.slug)) return false;
      const en = stripDiacritics(p.nameEn.toLowerCase());
      const fr = stripDiacritics(p.nameFr.toLowerCase());
      return name === en || name === fr || name.includes(en) || name.includes(fr);
    });
    if (match) return match.slug as GeoProvinceSlug;
  }

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

function parseDevGeoOverride(raw: string | undefined): GeoProvinceSlug | null {
  if (!raw) return null;
  const n = raw.trim().toLowerCase();
  if (!n) return null;
  if (isActiveProvince(n)) return n;
  // accept province code (nb, qc, ...) or display name
  const byCode = provinceList.find(
    (p) => p.code.toLowerCase() === n && isActiveProvince(p.slug),
  );
  if (byCode) return byCode.slug as GeoProvinceSlug;
  const byName = provinceList.find((p) => {
    if (!isActiveProvince(p.slug)) return false;
    const en = stripDiacritics(p.nameEn.toLowerCase());
    const fr = stripDiacritics(p.nameFr.toLowerCase());
    return stripDiacritics(n) === en || stripDiacritics(n) === fr;
  });
  if (byName) return byName.slug as GeoProvinceSlug;
  return null;
}

export async function resolveGeoProvinceFromHeaders(
  h: Headers,
): Promise<GeoProvinceResult> {
  if (process.env.NODE_ENV === "development") {
    const override =
      parseDevGeoOverride(process.env.DEV_GEO_PROVINCE) ??
      parseDevGeoOverride(process.env.DEV_GEO_PRICED_PROVINCE);
    if (override) {
      geoLog("DEV_GEO_PROVINCE env →", override);
      return { province: override, source: "dev" };
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
      "Vercel subdivision present but not an active province; falling back to IP lookup",
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
      "ipwho.is location is not an active province (or not CA); no geo province to return",
    );
  } catch (e) {
    geoLog("ipwho.is error", e instanceof Error ? e.message : e);
  } finally {
    clearTimeout(t);
  }

  geoLog("final result → province: null, source: none");
  return { province: null, source: "none" };
}

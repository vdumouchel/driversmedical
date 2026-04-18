import type { GeoProvinceSlug } from "@/lib/province-from-geo";

export const PRICING_CAD_BY_PROVINCE: Record<GeoProvinceSlug, number> = {
  "new-brunswick": 80,
  quebec: 199,
};

export function isGeoProvince(
  slug: string | null | undefined,
): slug is GeoProvinceSlug {
  return slug === "new-brunswick" || slug === "quebec";
}

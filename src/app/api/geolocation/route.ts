import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { resolveGeoProvinceFromHeaders } from "@/lib/province-from-geo";

export async function GET() {
  const h = await headers();
  const result = await resolveGeoProvinceFromHeaders(h);
  // Summary line (same conditions as lib/geoLog — terminal where `pnpm dev` runs)
  if (
    process.env.NODE_ENV === "development" ||
    process.env.GEO_DEBUG === "1"
  ) {
    console.log("[geolocation] response", JSON.stringify(result));
  }
  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
    },
  });
}

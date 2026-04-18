import type { ProvinceSchema } from "./types";
import { newBrunswickSchema } from "./new-brunswick";
import { quebecSchema } from "./quebec";

const schemas: Record<string, ProvinceSchema> = {
  "new-brunswick": newBrunswickSchema,
  quebec: quebecSchema,
};

export function getProvinceSchema(slug: string): ProvinceSchema | null {
  return schemas[slug] ?? null;
}

export function isValidProvince(slug: string): boolean {
  return slug in schemas;
}

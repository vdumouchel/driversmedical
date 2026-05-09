"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProvinceSchema, isValidProvince } from "@/config/provinces";
import { useIntakeStore } from "@/stores/intake-store";
import { QuestionFlow } from "@/components/intake/question-flow";

export default function ProvinceIntakePage() {
  const params = useParams<{ province: string }>();
  const router = useRouter();
  const { setProvince, setSchema, fields } = useIntakeStore();

  const slug = params.province;

  useEffect(() => {
    if (!isValidProvince(slug)) {
      router.replace("/intake");
      return;
    }

    const schema = getProvinceSchema(slug);
    if (!schema) {
      router.replace("/intake");
      return;
    }

    // Source of truth is the route slug: always hydrate schema from URL.
    // This avoids stale fields when province was pre-selected in the store.
    setProvince(slug);
    setSchema(schema.fields, schema.groups);
  }, [slug, setProvince, setSchema, router]);

  if (!isValidProvince(slug)) return null;

  if (fields.length === 0) return null;

  return <QuestionFlow provinceSlug={slug} />;
}

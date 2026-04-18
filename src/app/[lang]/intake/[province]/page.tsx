"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProvinceSchema, isValidProvince } from "@/config/provinces";
import { useIntakeStore } from "@/stores/intake-store";
import { QuestionFlow } from "@/components/intake/question-flow";

export default function ProvinceIntakePage() {
  const params = useParams<{ province: string }>();
  const router = useRouter();
  const { province, setProvince, setFields, fields } = useIntakeStore();

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

    // Only reset fields if switching provinces
    if (province !== slug || fields.length === 0) {
      setProvince(slug);
      setFields(schema.fields);
    }
  }, [slug, province, fields.length, setProvince, setFields, router]);

  if (!isValidProvince(slug)) return null;

  if (fields.length === 0) return null;

  return <QuestionFlow provinceSlug={slug} />;
}

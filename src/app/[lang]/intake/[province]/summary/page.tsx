"use client";

import { useParams, useRouter } from "next/navigation";
import { useIntakeStore } from "@/stores/intake-store";
import { SummaryView } from "@/components/intake/summary-view";
import { getProvinceSchema } from "@/config/provinces";
import { motion } from "framer-motion";
import { useLocalePath, useLang } from "@/lib/i18n-utils";
import { intake } from "@/content/intake";
import { pickLocale } from "@/content";

export default function SummaryPage() {
  const params = useParams<{ province: string }>();
  const router = useRouter();
  const lp = useLocalePath();
  const lang = useLang();
  const c = pickLocale(intake, lang).summary;
  const { fields } = useIntakeStore();

  const schema = getProvinceSchema(params.province);

  if (!schema || fields.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">{c.missing}</p>
          <button
            onClick={() => router.push(lp("/intake"))}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {c.startOver}
          </button>
        </div>
      </div>
    );
  }

  const provinceName = schema.provinceName;
  const body = c.body.replace("{provinceName}", provinceName);

  return (
    <div className="flex-1 flex items-start justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          {c.heading}
        </h1>
        <p className="text-muted-foreground mb-8">{body}</p>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <SummaryView />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <button
            onClick={() => router.back()}
            className="rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
          >
            {c.goBack}
          </button>
          <button
            onClick={() =>
              router.push(lp(`/intake/${params.province}/confirmation`))
            }
            className="flex-1 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {c.submit}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

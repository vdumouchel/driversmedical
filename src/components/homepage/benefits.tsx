import { Home, Clock, Shield, FileText } from "lucide-react";
import { msg } from "@lingui/core/macro";
import { getI18nInstance } from "@/lib/i18n";
import type { GeoProvinceSlug } from "@/lib/province-from-geo";
import { cn } from "@/lib/utils";

export async function Benefits({
  lang = "en",
  province,
}: {
  lang?: string;
  province: GeoProvinceSlug | null;
}) {
  const i18n = await getI18nInstance(lang);
  const _ = i18n._.bind(i18n);
  const fastTurnaroundDescription =
    province === "quebec"
      ? _(
          msg`In Quebec, your in-person visit and completed form are typically finalized within 72 hours, depending on your availability.`,
        )
      : _(
          msg`Get your completed form delivered to your email, typically within 24 hours.`,
        );

  const benefits = [
    {
      icon: Home,
      title: _(msg`Online Form`),
      description: _(msg`Complete your entire medical form from your phone, tablet, or computer. *In person visits required depending on your province.*`),
    },
    {
      icon: Clock,
      title: _(msg`Licensed physicians and nurses`),
      description: _(msg`Every form is reviewed and signed by a physician or nurse licensed to practice in your province.`),
    },
    {
      icon: Shield,
      title: _(msg`Fast turnaround`),
      description: fastTurnaroundDescription,
    },
    {
      icon: FileText,
      title: _(msg`Email delivery`),
      description: _(msg`Your completed form is sent directly to your email in PDF format, ready to submit.`),
    },
  ];

  return (
    <section id="benefits" className="bg-secondary py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            {_(msg`Why drivers choose us`)}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {_(msg`Everything you need for your driver medical form`)}
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className={cn(
                "group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg",
                // Last card sits alone on row 2 at lg — span middle column so it stays centered
                index === benefits.length - 1 && "lg:col-start-2",
              )}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <benefit.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {benefit.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

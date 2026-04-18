import { benefits, benefitItems } from "@/content/benefits";
import { pickLocale } from "@/content";
import { getProvince, type ActiveProvinceSlug } from "@/config/provinces";
import { cn } from "@/lib/utils";

export async function Benefits({
  lang = "en",
  province,
}: {
  lang?: string;
  province: ActiveProvinceSlug | null;
}) {
  const c = pickLocale(benefits, lang);
  const provinceTurnaround = getProvince(province)?.turnaround;
  const fastTurnaroundDescription = provinceTurnaround
    ? pickLocale(provinceTurnaround, lang)
    : c.items.fastTurnaround.description;

  return (
    <section id="benefits" className="bg-secondary py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            {c.heading}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {c.subheading}
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {benefitItems.map((benefit, index) => {
            const item = c.items[benefit.titleKey];
            const description =
              benefit.titleKey === "fastTurnaround"
                ? fastTurnaroundDescription
                : item.description;
            return (
              <div
                key={benefit.titleKey}
                className={cn(
                  "group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg",
                  index === benefitItems.length - 1 && "lg:col-start-2",
                )}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

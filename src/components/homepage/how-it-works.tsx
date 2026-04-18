import { howItWorks } from "@/content/how-it-works";
import { pickLocale } from "@/content";

export async function HowItWorks({ lang = "en" }: { lang?: string }) {
  const c = pickLocale(howItWorks, lang);

  return (
    <section id="how-it-works" className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            {c.heading}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {c.subheading}
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {c.steps.map((step, index) => (
            <div key={step.number} className="relative">
              {index < c.steps.length - 1 && (
                <div className="absolute left-1/2 top-8 hidden h-px w-full -translate-x-1/2 translate-y-0 bg-border lg:block" />
              )}
              <div className="relative flex flex-col items-center text-center">
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <span className="text-lg font-bold">{step.number}</span>
                </div>
                <div className="mt-2 inline-flex rounded-full bg-primary/10 px-3 py-1">
                  <span className="text-xs font-medium text-primary">
                    {step.timing}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

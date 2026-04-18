import { msg } from "@lingui/core/macro";
import { getI18nInstance } from "@/lib/i18n";

export async function HowItWorks({ lang = "en" }: { lang?: string }) {
  const i18n = await getI18nInstance(lang);
  const _ = i18n._.bind(i18n);
  const steps = [
    {
      number: "01",
      title: _(msg`Select your province`),
      description: _(msg`Choose your province so we load the correct driver medical form and questions for your jurisdiction.`),
      timing: _(msg`Start here`),
    },
    {
      number: "02",
      title: _(msg`Complete your medical form online`),
      description: _(msg`Fill out your complete medical history, health conditions, and required information through our secure online form.`),
      timing: _(msg`10-15 minutes`),
    },
    {
      number: "03",
      title: _(msg`A provider reviews your case`),
      description: _(msg`A licensed Canadian physician or nurse reviews your information and completes your official driver medical form.`),
      timing: _(msg`Within 24 hours`),
    },
    {
      number: "04",
      title: _(msg`Receive your signed form`),
      description: _(msg`Your completed and signed driver medical form is delivered directly to your email, ready to submit to your licensing authority.`),
      timing: _(msg`PDF format`),
    },
  ];

  return (
    <section id="how-it-works" className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            {_(msg`How it works`)}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {_(msg`Get your driver medical form completed in 4 simple steps.`)}
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {index < steps.length - 1 && (
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

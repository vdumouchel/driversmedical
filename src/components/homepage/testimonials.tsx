import Image from "next/image";
import { Star } from "lucide-react";
import { msg } from "@lingui/core/macro";
import { getI18nInstance } from "@/lib/i18n";

export async function Testimonials({ lang = "en" }: { lang?: string }) {
  const i18n = await getI18nInstance(lang);
  const _ = i18n._.bind(i18n);
  const testimonials = [
    {
      name: "Marc T.",
      role: "Long-Haul Trucker, Class 1",
      location: "New Brunswick",
      photo: "/images/testimonial-1.jpg",
      content: _(msg`After 20 years on the road, I know how hard it is to schedule appointments around my routes. Filled out the online form at a rest stop, and had my medical in my email before my next delivery. This is how it should be done.`),
      rating: 5,
    },
    {
      name: "Lisa M.",
      role: "Owner-Operator",
      location: "Quebec",
      photo: "/images/testimonial-2.jpg",
      content: _(msg`As an owner-operator, every day off the road costs me money. DriversMedical let me renew my medical without losing a load. The online form covered everything, and I had my form the next day.`),
      rating: 5,
    },
    {
      name: "James R.",
      role: "Fleet Driver, Class 3",
      location: "Ontario",
      content: _(msg`My dispatcher told me about DriversMedical when my medical was expiring. Did the whole thing from my phone during my mandatory rest period. Professional doctor, quick process, and my company accepted the form no problem.`),
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="bg-[#F3EEE5] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            {_(msg`Trusted by drivers across Canada`)}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {_(msg`See what other drivers are saying about their experience.`)}
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="flex flex-col rounded-xl border border-border bg-card p-6"
            >
              <div className="flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-border pt-6">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary overflow-hidden">
                  <span className="text-sm font-semibold">
                    {testimonial.name.charAt(0)}
                  </span>
                  {testimonial.photo && (
                    <Image
                      src={testimonial.photo}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role} &middot; {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

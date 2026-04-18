import Image from "next/image";
import { Star } from "lucide-react";
import { testimonials } from "@/content/testimonials";
import { pickLocale } from "@/content";

export async function Testimonials({ lang = "en" }: { lang?: string }) {
  const c = pickLocale(testimonials, lang);

  return (
    <section id="testimonials" className="bg-[#F3EEE5] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            {c.heading}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {c.subheading}
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {c.items.map((testimonial) => (
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

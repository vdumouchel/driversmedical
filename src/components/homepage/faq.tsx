"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faq } from "@/content/faq";
import { pickLocale } from "@/content";
import { useLang } from "@/lib/i18n-utils";

export function FAQ() {
  const lang = useLang();
  const c = pickLocale(faq, lang);

  return (
    <div id="faq">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {c.heading}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          {c.subheading}
        </p>

        <div className="mt-8">
          <Accordion className="w-full">
            {c.items.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-border"
              >
                <AccordionTrigger className="text-left text-foreground hover:text-foreground/80 text-sm">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-sm">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
    </div>
  );
}

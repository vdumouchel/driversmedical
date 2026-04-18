"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLingui } from "@lingui/react/macro";

export function FAQ() {
  const { t } = useLingui();

  const faqs = [
    {
      question: t`What is DriversMedical.clinic?`,
      answer: t`DriversMedical.clinic is a telemedicine platform that allows commercial drivers to get their required driver medical forms completed online. You fill out a secure online intake, a licensed physician or nurse reviews your information, and your completed form is delivered digitally.`,
    },
    {
      question: t`Is the medical form accepted by provincial licensing authorities?`,
      answer: t`Yes. Our physicians are licensed in Canada and authorized to complete driver medical forms. The forms we provide are province-specific and meet all provincial requirements.`,
    },
    {
      question: t`How long does the entire process take?`,
      answer: t`The online intake takes about 10-15 minutes. Once submitted, a physician or nurse reviews your case and completes your form, typically within 24 hours. Your completed and signed form is then delivered to your email in PDF format.`,
    },
    {
      question: t`Which provinces are supported?`,
      answer: t`We currently support New Brunswick and Quebec, with more provinces being added soon. Each province has its own specific medical form, and our platform handles the correct form for your jurisdiction.`,
    },
    {
      question: t`Will it require an in-person appointment?`,
      answer: t`Whether you need an in-person visit depends on your province and what is required to complete your examination—for example, some provinces require an in-person vision (eye) examination.

If an in-person visit is required, our clinic will call you the same day to schedule an appointment at one of our clinics, within 72 hours.`,
    },
    {
      question: t`What if the physician needs more information?`,
      answer: t`If the reviewing physician needs clarification or additional information, they will request it through the platform. In some cases, a brief online consultation may be required. You will be notified by email.`,
    },
    {
      question: t`Is my personal health information secure?`,
      answer: t`Absolutely. Our platform is fully PIPEDA-compliant, and all data is encrypted at rest and in transit. Your health information is stored securely and never shared without your explicit consent.`,
    },
    {
      question: t`What types of driver medical exams do you offer?`,
      answer: t`We support medical examinations for commercial driver licence (Class 1-4) renewals and new applications. The specific form and questions are tailored to your province.`,
    },
    {
      question: t`What if the physician cannot complete my medical form?`,
      answer: t`In rare cases where a physician cannot complete your form due to medical concerns requiring in-person evaluation, you will receive a full refund. The physician will provide guidance on next steps.`,
    },
  ];

  return (
    <div id="faq">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {t`Frequently asked questions`}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          {t`Everything you need to know about our online driver medical exam service.`}
        </p>

        <div className="mt-8">
          <Accordion className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-border"
              >
                <AccordionTrigger className="text-left text-foreground hover:text-foreground/80 text-sm">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-sm">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
    </div>
  );
}

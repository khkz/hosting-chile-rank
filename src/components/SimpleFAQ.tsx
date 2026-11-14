import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FAQ } from '@/data/wiki/terms';

interface SimpleFAQProps {
  faqs: FAQ[];
  termSlug: string;
  termTitle: string;
}

/** Preguntas frecuentes de un término: acordeón con reglas del sistema, sin tarjeta. */
const SimpleFAQ: React.FC<SimpleFAQProps> = ({ faqs }) => {
  if (!faqs || faqs.length === 0) return null;

  return (
    <Accordion type="single" collapsible className="w-full border-t border-rule">
      {faqs.map((faq, index) => (
        <AccordionItem key={index} value={`item-${index}`} className="border-rule">
          <AccordionTrigger className="min-h-11 py-4 text-left text-base font-semibold text-ink hover:no-underline">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="t-body text-ink-2">{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default SimpleFAQ;

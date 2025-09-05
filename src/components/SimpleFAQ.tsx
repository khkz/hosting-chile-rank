import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { FAQ } from '@/data/wiki/terms';

interface SimpleFAQProps {
  faqs: FAQ[];
  termSlug: string;
  termTitle: string;
}

const SimpleFAQ: React.FC<SimpleFAQProps> = ({ faqs, termSlug, termTitle }) => {
  if (!faqs || faqs.length === 0) return null;

  return (
    <Card>
      <CardContent className="p-6">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default SimpleFAQ;
import React from 'react';
import Section from '@/components/system/Section';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

/**
 * Único patrón de preguntas frecuentes de la familia «ranking»: acordeón a la
 * izquierda, pregunta en tinta y respuesta a medida de lectura. El JSON-LD de
 * cada página se mantiene donde estaba; este componente solo dibuja.
 */
export interface FaqEntry {
  question: string;
  answer: React.ReactNode;
}

interface RankingFaqProps {
  items: FaqEntry[];
  title?: React.ReactNode;
  lead?: React.ReactNode;
  id?: string;
  tone?: 'white' | 'paper';
}

export const FaqAccordion: React.FC<{ items: FaqEntry[]; idPrefix: string }> = ({ items, idPrefix }) => (
  <Accordion type="single" collapsible className="max-w-3xl border-t border-rule">
    {items.map((item, index) => (
      <AccordionItem key={index} value={`${idPrefix}-${index}`} className="border-rule">
        <AccordionTrigger className="min-h-[56px] gap-4 py-4 text-left text-base font-semibold text-ink hover:no-underline [&>svg]:text-ink-3">
          {item.question}
        </AccordionTrigger>
        <AccordionContent className="measure pb-5 text-base leading-relaxed text-ink-2">{item.answer}</AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);

const RankingFaq: React.FC<RankingFaqProps> = ({
  items,
  title = 'Preguntas frecuentes',
  lead,
  id = 'preguntas-frecuentes',
  tone = 'white',
}) => {
  if (items.length === 0) return null;
  return (
    <Section id={id} tone={tone} title={title} lead={lead}>
      <FaqAccordion items={items} idPrefix={id} />
    </Section>
  );
};

export default RankingFaq;

import React from 'react';
import { Link } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Section from '@/components/system/Section';
import { VERIFICATION_DATE_HUMAN } from '@/data/verified2026';

const textLink = 'font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink';

/**
 * Preguntas frecuentes de la portada. Las respuestas no prometen más de lo que
 * muestra la página: la nota de velocidad es editorial, lo medido está en
 * /benchmark con su fecha y la fecha de revisión es la del ranking.
 */
const faqItems: { question: string; answer: React.ReactNode }[] = [
  {
    question: '¿Cómo medimos la velocidad?',
    answer: (
      <>
        La «Nota de velocidad» del ranking es editorial: la asignamos con los pesos publicados en la{' '}
        <Link to="/metodologia" className={textLink}>
          metodología
        </Link>
        . Lo que medimos nosotros con herramientas propias (TTFB, uptime, SSL o el ASN de la IP) lleva la etiqueta
        Medido y su fecha; las mediciones de velocidad están en el{' '}
        <Link to="/benchmark" className={textLink}>
          benchmark
        </Link>
        .
      </>
    ),
  },
  {
    question: '¿Cada cuánto actualizamos el ranking?',
    answer: (
      <>
        La última revisión del ranking es del {VERIFICATION_DATE_HUMAN}. La frecuencia de cada tipo de dato (revisión
        editorial, mediciones y uptime) está publicada en la{' '}
        <Link to="/metodologia#frecuencia" className={textLink}>
          metodología
        </Link>
        , y cada dato muestra su propia fecha.
      </>
    ),
  },
  {
    question: '¿Influyen las comisiones en el ranking?',
    answer:
      'El ranking es editorial y sus pesos están publicados en la metodología. Algunos enlaces son de afiliado y el editor mantiene relación comercial con algunos proveedores listados; por eso cada dato indica si es medido por nosotros, declarado por el proveedor o criterio editorial.',
  },
  {
    question: '¿Por qué HostingPlus lidera el ranking?',
    answer: (
      <>
        <Link to="/catalogo/hostingplus" className={textLink}>
          HostingPlus
        </Link>{' '}
        combina datacenter local en Chile, tecnologías premium como LiteSpeed Enterprise y BitNinja, y un soporte técnico
        disponible 24/7 con tiempos de respuesta excepcionales.
      </>
    ),
  },
];

const FAQ = () => (
  <Section id="faq" title="Preguntas frecuentes">
    <Accordion type="single" collapsible className="max-w-3xl border-t border-rule">
      {faqItems.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`} className="border-b border-rule">
          <AccordionTrigger className="min-h-[44px] py-4 text-left text-base font-semibold text-ink hover:no-underline md:text-lg">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="measure text-base leading-relaxed text-ink-2 md:text-[15px]">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </Section>
);

export default FAQ;

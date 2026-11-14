import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { formatUptime } from '@/lib/uptime';

export interface BrandFAQItem {
  question: string;
  answer: string;
}

interface BrandFAQProps {
  companyName: string;
  items: BrandFAQItem[];
}

/**
 * Acordeón visible con las 4 FAQs propias de la ficha de empresa. La sección
 * que lo contiene pone el título. El JSON-LD FAQPage se emite aparte en la
 * página con estos mismos textos: no se reescriben aquí.
 */
const BrandFAQ: React.FC<BrandFAQProps> = ({ items }) => (
  <Accordion type="single" collapsible className="max-w-[72ch] border-t-2 border-ink">
    {items.map((item, i) => (
      <AccordionItem key={i} value={`item-${i}`} className="border-b border-rule">
        <AccordionTrigger className="min-h-[44px] gap-4 py-4 text-left text-base font-semibold text-ink hover:no-underline [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-ink-2">
          {item.question}
        </AccordionTrigger>
        <AccordionContent className="t-body max-w-[62ch] pb-5 text-ink-2">{item.answer}</AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);

export default BrandFAQ;

/**
 * Genera las 4 FAQs estándar de marca a partir de los datos verificados de la empresa.
 * Devuelve respuestas neutras y factuales (2-3 frases) con fallbacks cuando falta un dato.
 */
export function buildBrandFAQ(opts: {
  name: string;
  rating: number;
  minPrice: number | null;
  datacenter?: string | null;
  yearFounded?: number | null;
  corporateGroup?: string | null;
  uptimeGuarantee?: number | string | null;
}): BrandFAQItem[] {
  const { name, rating, minPrice, datacenter, yearFounded, corporateGroup, uptimeGuarantee } = opts;

  const priceTxt = 'bajo cotización directa con el proveedor (no publica precios estándar en su sitio público)';

  const dcTxt = datacenter && datacenter.trim().length > 0
    ? datacenter
    : 'sin datacenter declarado de forma pública';

  const yearTxt = yearFounded ? `opera desde ${yearFounded}` : 'no publica su año de fundación';
  const groupTxt = corporateGroup ? ` y pertenece al ${corporateGroup}` : '';
  const uptimeFmt = formatUptime(uptimeGuarantee);
  const uptimeTxt = uptimeFmt ? ` con garantía de uptime de ${uptimeFmt}` : '';

  return [
    {
      question: `¿Es bueno ${name}?`,
      answer: `Según nuestra evaluación editorial 2026, ${name} obtiene una nota de ${rating.toFixed(1)}/10. ${yearTxt.charAt(0).toUpperCase() + yearTxt.slice(1)}${groupTxt}${uptimeTxt}. La nota considera infraestructura, transparencia, precios y soporte; revisa también las opiniones reales de usuarios más abajo antes de decidir.`,
    },
    {
      question: `¿Cuánto cuesta ${name}?`,
      answer: `${name} ofrece planes ${priceTxt}. Los precios pueden variar según promociones, ciclo de pago anual o multianual, y servicios adicionales como dominio, SSL premium o migración asistida. Te recomendamos revisar la web oficial para confirmar el precio vigente.`,
    },
    {
      question: `¿Dónde están los servidores de ${name}?`,
      answer: `La infraestructura declarada de ${name} se ubica en: ${dcTxt}. Un datacenter en Chile reduce la latencia para visitantes locales y mejora el SEO en búsquedas desde Chile, lo que conviene para sitios cuyo público objetivo es nacional.`,
    },
    {
      question: `¿Es confiable ${name}?`,
      answer: `${name} aparece en nuestro catálogo verificado de hosting en Chile 2026 tras pasar nuestro filtro de curación (datos públicos contrastables, presencia operativa real${corporateGroup ? `, pertenencia al ${corporateGroup}` : ''}). Para una visión completa de su confiabilidad consulta el bloque de reputación y las reseñas verificadas de usuarios en esta misma ficha.`,
    },
  ];
}

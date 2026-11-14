import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface FaqItem {
  q: string;
  a: string;
}

/**
 * Preguntas frecuentes plegables. Muestra el mismo texto que publica el
 * JSON-LD FAQPage de la página: no lo reescribas aquí.
 */
const FaqList: React.FC<{ items: FaqItem[] }> = ({ items }) => (
  <div className="max-w-3xl divide-y divide-rule border-y border-rule">
    {items.map((f) => (
      <details key={f.q} className="group">
        <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-4 py-3 font-semibold text-ink [&::-webkit-details-marker]:hidden">
          <span>{f.q}</span>
          <ChevronDown aria-hidden className="h-5 w-5 shrink-0 text-ink-3 transition-transform group-open:rotate-180" />
        </summary>
        <p className="t-body measure pb-5 text-ink-2">{f.a}</p>
      </details>
    ))}
  </div>
);

export default FaqList;

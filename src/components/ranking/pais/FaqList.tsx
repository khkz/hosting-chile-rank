import React from 'react';

export interface Faq {
  q: string;
  a: string;
}

interface FaqListProps {
  items: Faq[];
  /** Transforma la respuesta solo al mostrarla (el JSON-LD conserva el texto original). */
  renderAnswer?: (a: string) => React.ReactNode;
}

/**
 * Preguntas frecuentes siempre visibles (sin acordeón): pregunta como H3 y
 * respuesta en la medida de lectura. Pensado para ir dentro de un <Section>.
 */
const FaqList: React.FC<FaqListProps> = ({ items, renderAnswer }) => (
  <div className="divide-y divide-rule border-y border-rule">
    {items.map((f, i) => (
      <div key={`${i}-${f.q}`} className="grid gap-2 py-6 lg:grid-cols-12 lg:gap-10">
        <h3 className="t-h3 text-ink lg:col-span-5">{f.q}</h3>
        <p className="t-body measure text-ink-2 lg:col-span-7">{renderAnswer ? renderAnswer(f.a) : f.a}</p>
      </div>
    ))}
  </div>
);

export default FaqList;

import React from 'react';
import type { TocItem } from '@/components/reading/ReadingLayout';

/**
 * Índice plegable dentro del cuerpo. Se usa cuando la columna lateral de
 * ReadingLayout ya está ocupada (por ejemplo, por la oferta de la wiki) y un
 * índice largo más la oferta no cabrían juntos en la columna fija.
 */
const TocInline: React.FC<{ items: TocItem[] }> = ({ items }) => {
  if (items.length < 2) return null;
  return (
    <details className="not-prose mb-10 rounded-xl border border-rule p-4">
      <summary className="flex min-h-11 cursor-pointer items-center font-semibold text-ink">En esta página</summary>
      <nav aria-label="En esta página">
        <ol className="mt-2 space-y-1">
          {items.map((it) => (
            <li key={it.id}>
              <a href={`#${it.id}`} className="block rounded-lg px-2 py-2 text-sm text-ink-2 hover:bg-paper hover:text-ink">
                {it.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  );
};

export default TocInline;

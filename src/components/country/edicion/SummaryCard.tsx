import React, { useId } from 'react';
import { cn } from '@/lib/utils';
import { ProvenanceTag, type Provenance } from '@/components/data/Provenance';

export interface SummaryItem {
  label: string;
  value: React.ReactNode;
  /** Aclaración bajo el valor: qué cubre la fecha, de qué país es. */
  note?: React.ReactNode;
  /** Procedencia del dato, si aplica. */
  kind?: Provenance;
  /** figure: cifra grande (conteos). text: fechas y textos. */
  emphasis?: 'figure' | 'text';
}

interface SummaryCardProps {
  /** Rótulo visible del resumen. */
  label: string;
  items: SummaryItem[];
  /** card: ficha en la columna de la cabecera. strip: franja bajo la cabecera (cuando hay imagen). */
  layout?: 'card' | 'strip';
  className?: string;
}

/**
 * Resumen en cifras de una edición o del índice regional. Cada fila dice qué
 * es el dato y, cuando corresponde, su procedencia y lo que cubre su fecha.
 */
const SummaryCard: React.FC<SummaryCardProps> = ({ label, items, layout = 'card', className }) => {
  const id = useId();
  const card = layout === 'card';
  return (
    <div className={cn(card && 'rounded-xl border border-rule bg-white p-5 md:p-6', className)}>
      <p id={id} className="t-label">
        {label}
      </p>
      <dl
        aria-labelledby={id}
        className={cn(
          'mt-3 tabular',
          card
            ? 'divide-y divide-rule border-t border-rule'
            : cn('grid grid-cols-2 gap-x-8 gap-y-5', items.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'),
        )}
      >
        {items.map((it) => (
          <div
            key={it.label}
            className={card ? 'flex items-baseline justify-between gap-4 py-3' : 'min-w-0 border-t border-rule pt-3'}
          >
            <dt className={cn('t-small flex items-center gap-1.5 text-ink-2', card && 'shrink-0')}>
              {it.label}
              {it.kind && <ProvenanceTag kind={it.kind} variant="glyph" />}
            </dt>
            <dd className={cn('min-w-0', card && 'text-right')}>
              <span
                className={cn(
                  'block text-ink',
                  it.emphasis === 'figure' ? 'text-2xl font-bold leading-tight' : 'font-semibold',
                )}
              >
                {it.value}
              </span>
              {it.note && <span className="t-meta block">{it.note}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default SummaryCard;

import React from 'react';
import { cn } from '@/lib/utils';
import { ProvenanceTag, type Provenance } from '@/components/data/Provenance';
import { formatToolDateTime, isoDateTime } from './dataTime';

export interface Fact {
  label: string;
  value: React.ReactNode;
  /** Procedencia del dato, si se conoce. */
  kind?: Provenance;
  /** Momento en que se obtuvo el dato (ISO). */
  date?: string | null;
}

interface FactListProps {
  facts: Fact[];
  className?: string;
}

/**
 * Lista «dato · valor · procedencia · fecha» a ancho completo.
 * En móvil apila el rótulo sobre el valor; en escritorio, dos columnas.
 */
const FactList: React.FC<FactListProps> = ({ facts, className }) => (
  <dl className={cn('divide-y divide-rule border-y border-rule', className)}>
    {facts.map((f) => (
      <div key={f.label} className="grid gap-1 py-3 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] sm:gap-6">
        <dt className="t-small text-ink-2">{f.label}</dt>
        <dd className="min-w-0">
          <div className="t-small break-words font-semibold text-ink">{f.value}</div>
          {(f.kind || f.date) && (
            <div className="t-meta mt-1 flex flex-wrap items-center gap-2">
              {f.kind && <ProvenanceTag kind={f.kind} variant="glyph" />}
              {f.date && <time dateTime={isoDateTime(f.date)}>{formatToolDateTime(f.date)}</time>}
            </div>
          )}
        </dd>
      </div>
    ))}
  </dl>
);

export default FactList;

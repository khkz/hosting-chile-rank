import React from 'react';
import { cn } from '@/lib/utils';
import { ProvenanceTag, type Provenance } from '@/components/data/Provenance';
import { formatScore, formatShortDate, isoDate } from '@/lib/format';

export interface EvidenceRow {
  label: string;
  value: React.ReactNode;
  /** Procedencia del dato. Sin procedencia conocida, se omite el símbolo. */
  kind?: Provenance;
  /** Fecha del dato (AAAA-MM-DD o ISO). */
  date?: string | null;
}

interface EvidenceCardProps {
  /** Nombre del proveedor u objeto evaluado. */
  title: React.ReactNode;
  /** Subtítulo corto: país, tipo de servicio o grupo. */
  subtitle?: React.ReactNode;
  /** Nota principal (0–10). null = sin nota. */
  score?: number | null;
  /** Procedencia de la nota. Hoy las notas son editoriales. */
  scoreKind?: Provenance;
  /** Puesto en el ranking, si aplica. */
  rank?: number;
  rows: EvidenceRow[];
  /** Pie: enlaces «Ver ficha», divulgación, fecha general. */
  footer?: React.ReactNode;
  className?: string;
}

/**
 * Ficha de evidencia: la pieza firma del sitio. Cada fila dice qué es el dato,
 * su valor, de dónde sale y de cuándo es. El rojo marca solo al puesto 1.
 */
const EvidenceCard: React.FC<EvidenceCardProps> = ({
  title,
  subtitle,
  score,
  scoreKind = 'editorial',
  rank,
  rows,
  footer,
  className,
}) => (
  <article className={cn('relative rounded-xl border border-rule bg-white p-5 md:p-6', className)}>
    {rank === 1 && <span aria-hidden className="absolute left-0 top-5 bottom-5 w-1 rounded-r bg-brand" />}
    <header className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        {rank != null && (
          <p className={cn('t-meta font-semibold', rank === 1 ? 'text-brand-ink' : 'text-ink-3')}>
            <span className="sr-only">Puesto </span>#{rank}
          </p>
        )}
        <h3 className="t-h3 truncate text-ink">{title}</h3>
        {subtitle && <p className="t-meta mt-0.5">{subtitle}</p>}
      </div>
      {score !== undefined && (
        <div className="shrink-0 text-right">
          <p className="tabular text-[2rem] font-extrabold leading-none text-ink" style={{ fontStretch: '112%' }}>
            {formatScore(score)}
            <span className="ml-0.5 text-sm font-semibold text-ink-3">/10</span>
          </p>
          <div className="mt-1.5 flex justify-end">
            <ProvenanceTag kind={scoreKind} />
          </div>
        </div>
      )}
    </header>
    {rows.length > 0 && (
      <dl className="mt-5 divide-y divide-rule border-t border-rule">
        {rows.map((r) => (
          <div key={r.label} className="flex items-baseline justify-between gap-4 py-2.5">
            <dt className="t-small shrink-0 text-ink-2">{r.label}</dt>
            <dd className="min-w-0 text-right">
              <span className="t-small tabular font-semibold text-ink">{r.value}</span>
              {(r.kind || r.date) && (
                <span className="mt-0.5 flex items-center justify-end gap-2">
                  {r.kind && <ProvenanceTag kind={r.kind} variant="glyph" />}
                  {r.date && (
                    <time dateTime={isoDate(r.date)} className="t-meta">
                      {formatShortDate(r.date)}
                    </time>
                  )}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    )}
    {footer && <footer className="mt-5 flex flex-wrap items-center gap-3">{footer}</footer>}
  </article>
);

export default EvidenceCard;

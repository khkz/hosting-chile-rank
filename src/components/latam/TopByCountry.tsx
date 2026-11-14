import React from 'react';
import Flag from '@/components/data/Flag';
import { ProvenanceTag } from '@/components/data/Provenance';
import type { LatamIndexRow } from '@/features/ranking';
import { editionHref, rankingPath } from '@/lib/countries';
import { formatScore } from '@/lib/format';

/**
 * Primeros puestos por país en /latam. Cada columna se estira a la altura de
 * la fila y deja «Ver el ranking» al pie, alineado entre países.
 * El rojo marca solo el puesto 1.
 */
const TopByCountry: React.FC<{ rows: LatamIndexRow[] }> = ({ rows }) => (
  <div className="grid gap-y-10 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-5 lg:gap-x-0 lg:divide-x lg:divide-rule">
    {rows.map((row) => (
      <section
        key={row.edition.code}
        aria-labelledby={`top-${row.edition.code}`}
        className="flex min-w-0 flex-col lg:px-5 lg:first:pl-0 lg:last:pr-0"
      >
        <h3 id={`top-${row.edition.code}`} className="flex items-center gap-2 text-base font-semibold text-ink">
          <Flag code={row.edition.code} size={20} />
          {row.edition.name}
        </h3>
        <p className="mt-1 flex min-h-[2.5rem] items-start gap-1.5 text-xs leading-snug text-ink-3">
          {row.order === 'editorial' ? (
            <>
              <ProvenanceTag kind="editorial" variant="glyph" className="mt-[3px]" />
              Orden editorial con pesos publicados
            </>
          ) : (
            <>Orden por infraestructura, red, razón social y antigüedad</>
          )}
        </p>
        {row.top.length === 0 ? (
          <p className="t-small mt-4 text-ink-2">Aún sin proveedores ordenados.</p>
        ) : (
          <ol className="mt-3 space-y-3">
            {row.top.map((p, i) => (
              <li key={p.id} className="flex items-baseline gap-3">
                <span className={`type-display w-6 shrink-0 text-2xl tabular ${i === 0 ? 'text-brand' : 'text-ink-3'}`}>
                  <span className="sr-only">Puesto </span>
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <a href={p.href} className="break-words font-semibold text-ink underline-offset-4 hover:underline">
                    {p.name}
                  </a>
                  {p.score != null && (
                    <span className="ml-2 inline-flex items-center gap-1 text-sm text-ink-2 tabular">
                      {formatScore(p.score)}
                      <ProvenanceTag kind="editorial" variant="glyph" />
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ol>
        )}
        <div className="mt-auto pt-3">
          <a
            href={editionHref(row.edition.code, rankingPath(row.edition))}
            className="inline-flex min-h-[44px] items-center text-sm font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
          >
            Ver el ranking<span className="sr-only"> de {row.edition.name}</span>
          </a>
        </div>
      </section>
    ))}
  </div>
);

export default TopByCountry;

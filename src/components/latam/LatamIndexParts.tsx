import React from 'react';
import Flag from '@/components/data/Flag';
import { ProvenanceGlyph, ProvenanceTag } from '@/components/data/Provenance';
import type { LatamIndexRow } from '@/features/ranking';
import { PUBLISHED_EDITIONS, editionHref, formatNumber, rankingPath } from '@/lib/countries';

/**
 * Tabla del índice, esqueleto de carga y primeros puestos por país de /latam.
 * Separados de la página para respetar el máximo de 400 líneas por archivo.
 */

const nf = (n: number) => formatNumber(n);
const pct = (part: number, total: number) => (total > 0 ? Math.round((part / total) * 100) : 0);
const shortDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

/** Barra de proporción con el color de la procedencia del dato. */
const ShareBar: React.FC<{ part: number; total: number; tone: 'declared' | 'measured' }> = ({ part, total, tone }) => (
  <span className="mt-1.5 block h-1 w-full max-w-[120px] overflow-hidden rounded-full bg-paper-deep" aria-hidden>
    <span
      className={`block h-full rounded-full ${tone === 'declared' ? 'bg-signal-declared' : 'bg-signal-measured'}`}
      style={{ width: `${pct(part, total)}%` }}
    />
  </span>
);

const rankingLabel = (row: LatamIndexRow) => `Ranking de ${row.edition.name}`;
const rankingHref = (row: LatamIndexRow) => editionHref(row.edition.code, rankingPath(row.edition));

export const IndexTable: React.FC<{ rows: LatamIndexRow[] }> = ({ rows }) => (
  <>
    {/* Escritorio: tabla */}
    <table className="hidden w-full border-collapse text-left md:table">
      <caption className="sr-only">Índice de hosting por país: proveedores verificados, datacenter en el país y mediciones propias</caption>
      <thead>
        <tr className="border-b-2 border-ink text-[13px] font-semibold text-ink-2">
          <th scope="col" className="py-3 pr-4 font-semibold">País</th>
          <th scope="col" className="py-3 pr-4 text-right font-semibold">Proveedores verificados</th>
          <th scope="col" className="py-3 pr-4 font-semibold">
            <span className="flex items-center justify-end gap-2">
              Datacenter en el país <ProvenanceTag kind="declared" />
            </span>
          </th>
          <th scope="col" className="py-3 pr-4 font-semibold">
            <span className="flex items-center justify-end gap-2">
              Medidos por nosotros <ProvenanceTag kind="measured" />
            </span>
          </th>
          <th scope="col" className="py-3 pr-4 text-right font-semibold">Última actualización</th>
          <th scope="col" className="py-3"><span className="sr-only">Ranking</span></th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.edition.code} className="border-b border-rule align-middle">
            <th scope="row" className="py-4 pr-4 text-left font-normal">
              <a href={editionHref(row.edition.code)} className="group inline-flex items-center gap-3">
                <Flag code={row.edition.code} size={26} />
                <span>
                  <span className="block text-[17px] font-semibold text-ink group-hover:underline underline-offset-4">{row.edition.name}</span>
                  <span className="block text-xs text-ink-3">
                    {row.edition.code === 'CL' ? 'eligetuhosting.cl' : `eligetuhosting.com/${row.edition.slug}`}
                  </span>
                </span>
              </a>
            </th>
            <td className="py-4 pr-4 text-right text-xl font-semibold text-ink tabular">{nf(row.total)}</td>
            <td className="py-4 pr-4 text-right tabular">
              <span className="text-xl font-semibold text-ink">{nf(row.localDc)}</span>
              <span className="ml-1.5 text-sm text-ink-3">{pct(row.localDc, row.total)}%</span>
              <span className="flex justify-end"><ShareBar part={row.localDc} total={row.total} tone="declared" /></span>
            </td>
            <td className="py-4 pr-4 text-right tabular">
              {row.measured == null ? (
                <span className="text-ink-3">sin dato</span>
              ) : (
                <>
                  <span className="text-xl font-semibold text-ink">{nf(row.measured)}</span>
                  <span className="ml-1.5 text-sm text-ink-3">{pct(row.measured, row.total)}%</span>
                  <span className="flex justify-end"><ShareBar part={row.measured} total={row.total} tone="measured" /></span>
                </>
              )}
            </td>
            <td className="py-4 pr-4 text-right text-sm text-ink-2 tabular">{shortDate(row.updatedAt)}</td>
            <td className="py-4 text-right">
              <a
                href={rankingHref(row)}
                className="inline-flex h-9 items-center rounded-md border border-ink/20 px-3 text-sm font-semibold text-ink hover:border-ink hover:bg-paper"
              >
                {rankingLabel(row)}
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Móvil: filas apiladas */}
    <ul className="divide-y divide-rule border-y-2 border-ink md:hidden">
      {rows.map((row) => (
        <li key={row.edition.code} className="py-4">
          <a href={editionHref(row.edition.code)} className="flex items-center gap-3">
            <Flag code={row.edition.code} size={26} />
            <span className="text-lg font-semibold text-ink">{row.edition.name}</span>
          </a>
          <dl className="mt-3 grid grid-cols-3 gap-3 text-ink tabular">
            <div>
              <dt className="text-xs text-ink-3">Verificados</dt>
              <dd className="text-lg font-semibold">{nf(row.total)}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-1 text-xs text-ink-3">
                DC en el país <ProvenanceGlyph kind="declared" />
              </dt>
              <dd className="text-lg font-semibold">{nf(row.localDc)}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-1 text-xs text-ink-3">
                Medidos <ProvenanceGlyph kind="measured" />
              </dt>
              <dd className="text-lg font-semibold">{row.measured == null ? '—' : nf(row.measured)}</dd>
            </div>
          </dl>
          <a href={rankingHref(row)} className="mt-3 inline-flex min-h-[44px] items-center text-sm font-semibold text-brand-ink underline underline-offset-4">
            {rankingLabel(row)}
          </a>
        </li>
      ))}
    </ul>
  </>
);

export const IndexSkeleton = () => (
  <div className="divide-y divide-rule border-y-2 border-ink" aria-busy="true" aria-label="Cargando el índice">
    {PUBLISHED_EDITIONS.map((e) => (
      <div key={e.code} className="flex items-center gap-4 py-5">
        <Flag code={e.code} size={26} />
        <span className="text-[17px] font-semibold text-ink">{e.name}</span>
        <span className="ml-auto h-4 w-1/2 animate-pulse rounded bg-paper-deep" />
      </div>
    ))}
  </div>
);

export const TopByCountry: React.FC<{ rows: LatamIndexRow[] }> = ({ rows }) => (
  <div className="grid gap-y-10 sm:grid-cols-2 lg:grid-cols-5 lg:divide-x lg:divide-rule">
    {rows.map((row) => (
      <section key={row.edition.code} aria-labelledby={`top-${row.edition.code}`} className="lg:px-5 lg:first:pl-0 lg:last:pr-0">
        <h3 id={`top-${row.edition.code}`} className="flex items-center gap-2 text-base font-semibold text-ink">
          <Flag code={row.edition.code} size={20} />
          {row.edition.name}
        </h3>
        <p className="mt-1 flex min-h-[2.5rem] items-start gap-1.5 text-xs leading-snug text-ink-3">
          {row.order === 'editorial' ? (
            <>
              <ProvenanceGlyph kind="editorial" className="mt-[3px]" />
              Orden editorial con pesos publicados
            </>
          ) : (
            <>Orden por infraestructura, red, razón social y antigüedad</>
          )}
        </p>
        {row.top.length === 0 ? (
          <p className="mt-4 text-sm text-ink-2">Aún sin proveedores ordenados.</p>
        ) : (
          <ol className="mt-3 space-y-3">
            {row.top.map((p, i) => (
              <li key={p.id} className="flex items-baseline gap-3">
                <span
                  className={`type-display w-6 shrink-0 text-2xl tabular ${i === 0 ? 'text-brand' : 'text-ink/35'}`}
                  aria-label={`Puesto ${i + 1}`}
                >
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <a href={p.href} className="font-semibold text-ink hover:underline underline-offset-4 break-words">
                    {p.name}
                  </a>
                  {p.score != null && (
                    <span className="ml-2 inline-flex items-center gap-1 text-sm text-ink-2 tabular">
                      {p.score.toFixed(1).replace('.', ',')}
                      <ProvenanceGlyph kind="editorial" />
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ol>
        )}
        <a href={rankingHref(row)} className="mt-4 inline-flex min-h-[40px] items-center text-sm font-semibold text-ink underline decoration-rule underline-offset-4 hover:decoration-ink">
          Ranking completo
        </a>
      </section>
    ))}
  </div>
);

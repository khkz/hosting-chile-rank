import React from 'react';
import Flag from '@/components/data/Flag';
import { ProvenanceTag } from '@/components/data/Provenance';
import type { LatamIndexRow } from '@/features/ranking';
import { PUBLISHED_EDITIONS, editionHref, rankingPath } from '@/lib/countries';
import { formatInteger, formatPercent, formatShortDate, isoDate } from '@/lib/format';

/**
 * Tabla del índice (escritorio, desde 1024 px) y lista apilada (móvil y
 * tablet) de /latam. Cada fecha dice qué cubre: «Última edición» es la ficha
 * más reciente del país; «Última medición», la medición propia más reciente.
 */

const pct = (part: number, total: number) => (total > 0 ? Math.round((part / total) * 100) : 0);
const share = (part: number, total: number) => formatPercent(pct(part, total), 0);

const DateText: React.FC<{ iso: string | null }> = ({ iso }) =>
  iso ? (
    <time dateTime={isoDate(iso)} className="whitespace-nowrap">
      {formatShortDate(iso)}
    </time>
  ) : (
    <>sin dato</>
  );

/** Barra de proporción con el color de la procedencia del dato. */
const ShareBar: React.FC<{ part: number; total: number; tone: 'declared' | 'measured' }> = ({ part, total, tone }) => (
  <span className="mt-1.5 block h-1 w-full max-w-[120px] overflow-hidden rounded-sm bg-paper-deep" aria-hidden>
    <span
      className={`block h-full rounded-sm ${tone === 'declared' ? 'bg-signal-declared' : 'bg-signal-measured'}`}
      style={{ width: `${pct(part, total)}%` }}
    />
  </span>
);

const rankingHref = (row: LatamIndexRow) => editionHref(row.edition.code, rankingPath(row.edition));
const domainLabel = (row: LatamIndexRow) =>
  row.edition.code === 'CL' ? 'eligetuhosting.cl' : `eligetuhosting.com/${row.edition.slug}`;

const IndexDesktop: React.FC<{ rows: LatamIndexRow[] }> = ({ rows }) => (
  <div className="hidden overflow-x-auto lg:block">
    <table className="w-full min-w-[56rem] border-collapse text-left">
      <caption className="sr-only">
        Índice de hosting por país: proveedores verificados, datacenter declarado en el país, mediciones propias y
        fecha de la última edición
      </caption>
      <thead>
        <tr className="border-b-2 border-ink text-[13px] text-ink-2">
          <th scope="col" className="py-3 pr-4 align-bottom font-semibold">País</th>
          <th scope="col" className="py-3 pr-4 text-right align-bottom font-semibold">Proveedores verificados</th>
          <th scope="col" className="py-3 pr-4 align-bottom font-semibold">
            <span className="flex flex-wrap items-center justify-end gap-x-2 gap-y-1">
              Datacenter en el país <ProvenanceTag kind="declared" />
            </span>
          </th>
          <th scope="col" className="py-3 pr-4 align-bottom font-semibold">
            <span className="flex flex-wrap items-center justify-end gap-x-2 gap-y-1">
              Medidos por nosotros <ProvenanceTag kind="measured" />
            </span>
          </th>
          <th scope="col" className="py-3 pr-4 text-right align-bottom font-semibold">Última edición</th>
          <th scope="col" className="py-3 align-bottom">
            <span className="sr-only">Ranking</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.edition.code} className="border-b border-rule align-baseline">
            <th scope="row" className="py-4 pr-4 text-left font-normal">
              <a href={editionHref(row.edition.code)} className="group inline-flex items-center gap-3">
                <Flag code={row.edition.code} size={26} />
                <span>
                  <span className="block text-[17px] font-semibold text-ink underline-offset-4 group-hover:underline">
                    {row.edition.name}
                  </span>
                  <span className="t-meta block">{domainLabel(row)}</span>
                </span>
              </a>
            </th>
            <td className="py-4 pr-4 text-right text-xl font-semibold text-ink tabular">{formatInteger(row.total)}</td>
            <td className="py-4 pr-4 text-right tabular">
              <span className="text-xl font-semibold text-ink">{formatInteger(row.localDc)}</span>
              <span className="ml-1.5 text-sm text-ink-3">{share(row.localDc, row.total)}</span>
              <span className="flex justify-end">
                <ShareBar part={row.localDc} total={row.total} tone="declared" />
              </span>
            </td>
            <td className="py-4 pr-4 text-right tabular">
              {row.measured == null ? (
                <span className="text-ink-3">sin dato</span>
              ) : (
                <>
                  <span className="text-xl font-semibold text-ink">{formatInteger(row.measured)}</span>
                  <span className="ml-1.5 text-sm text-ink-3">{share(row.measured, row.total)}</span>
                  <span className="flex justify-end">
                    <ShareBar part={row.measured} total={row.total} tone="measured" />
                  </span>
                  {row.measuredAt && (
                    <span className="t-meta mt-1.5 block">
                      Última medición <DateText iso={row.measuredAt} />
                    </span>
                  )}
                </>
              )}
            </td>
            <td className="py-4 pr-4 text-right text-sm text-ink-2 tabular">
              <DateText iso={row.updatedAt} />
            </td>
            <td className="py-4 text-right">
              <a
                href={rankingHref(row)}
                className="inline-flex h-9 items-center whitespace-nowrap rounded-lg border border-ink/25 bg-white px-3 text-sm font-semibold text-ink hover:border-ink hover:bg-paper"
              >
                Ver el ranking<span className="sr-only"> de {row.edition.name}</span>
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const IndexMobile: React.FC<{ rows: LatamIndexRow[] }> = ({ rows }) => (
  <ul className="divide-y divide-rule border-y-2 border-ink lg:hidden">
    {rows.map((row) => (
      <li key={row.edition.code} className="py-5">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <a href={editionHref(row.edition.code)} className="flex min-h-[44px] items-center gap-3">
            <Flag code={row.edition.code} size={26} />
            <span className="text-lg font-semibold text-ink">{row.edition.name}</span>
          </a>
          <p className="t-meta tabular">
            Última edición <DateText iso={row.updatedAt} />
          </p>
        </div>
        <dl className="mt-2 grid grid-cols-3 gap-3 text-ink tabular">
          <div>
            <dt className="text-xs text-ink-3">Verificados</dt>
            <dd className="text-lg font-semibold">{formatInteger(row.total)}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1 text-xs text-ink-3">
              DC en el país <ProvenanceTag kind="declared" variant="glyph" />
            </dt>
            <dd className="text-lg font-semibold">
              {formatInteger(row.localDc)}
              <span className="ml-1 text-sm font-normal text-ink-3">{share(row.localDc, row.total)}</span>
            </dd>
          </div>
          <div>
            <dt className="flex items-center gap-1 text-xs text-ink-3">
              Medidos <ProvenanceTag kind="measured" variant="glyph" />
            </dt>
            {row.measured == null ? (
              <dd className="text-sm text-ink-3">sin dato</dd>
            ) : (
              <dd className="text-lg font-semibold">
                {formatInteger(row.measured)}
                <span className="ml-1 text-sm font-normal text-ink-3">{share(row.measured, row.total)}</span>
                {row.measuredAt && (
                  <span className="mt-0.5 block text-xs font-normal leading-snug text-ink-3">
                    Última medición <DateText iso={row.measuredAt} />
                  </span>
                )}
              </dd>
            )}
          </div>
        </dl>
        <a
          href={rankingHref(row)}
          className="mt-2 inline-flex min-h-[44px] items-center text-sm font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
        >
          Ver el ranking de {row.edition.name}
        </a>
      </li>
    ))}
  </ul>
);

export const IndexTable: React.FC<{ rows: LatamIndexRow[] }> = ({ rows }) => (
  <>
    <IndexDesktop rows={rows} />
    <IndexMobile rows={rows} />
  </>
);

/** Estado de carga sin animación: países y un rótulo honesto. */
export const IndexSkeleton = () => (
  <div className="divide-y divide-rule border-y-2 border-ink" aria-busy="true">
    <p className="sr-only">Cargando el índice</p>
    {PUBLISHED_EDITIONS.map((e) => (
      <div key={e.code} className="flex items-center gap-4 py-5">
        <Flag code={e.code} size={26} />
        <span className="text-[17px] font-semibold text-ink">{e.name}</span>
        <span className="t-meta ml-auto" aria-hidden>
          Cargando…
        </span>
      </div>
    ))}
  </div>
);

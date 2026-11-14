import React from 'react';
import { Link } from 'react-router-dom';
import { ProvenanceTag } from '@/components/data/Provenance';
import type { BenchmarkRow } from '@/hooks/useBenchmark';
import { formatInteger, formatMs, formatPercent, formatScore, formatShortDate, isoDate } from '@/lib/format';
import ReproduceButton from './ReproduceButton';

const NONE = 'Sin medir';

const host = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

/** Detalles de Lighthouse en una línea legible, sin depender del cursor. */
const lighthouseExtra = (r: BenchmarkRow) => {
  const parts: string[] = [];
  if (r.lighthouse_seo != null) parts.push(`SEO ${formatInteger(r.lighthouse_seo)}`);
  if (r.lighthouse_a11y != null) parts.push(`accesibilidad ${formatInteger(r.lighthouse_a11y)}`);
  return parts.join(', ');
};
const vitals = (r: BenchmarkRow) => {
  const parts: string[] = [];
  if (r.lcp_ms != null) parts.push(`LCP ${formatScore(r.lcp_ms / 1000, 1)} s`);
  if (r.cls != null) parts.push(`CLS ${formatScore(r.cls, 3)}`);
  return parts.join(', ');
};

const Missing = () => <span className="text-sm font-normal text-ink-3">{NONE}</span>;

const Measured: React.FC<{ r: BenchmarkRow }> = ({ r }) =>
  r.measured_at ? (
    <time dateTime={isoDate(r.measured_at)}>{formatShortDate(r.measured_at)}</time>
  ) : (
    <Missing />
  );

const ProviderName: React.FC<{ r: BenchmarkRow }> = ({ r }) => {
  const c = r.hosting_companies;
  const url = c?.benchmark_target_url ?? '';
  return (
    <>
      {c?.slug ? (
        <Link to={`/catalogo/${c.slug}`} className="font-semibold text-ink underline-offset-4 hover:underline">
          {c.name}
        </Link>
      ) : (
        <span className="font-semibold text-ink">{c?.name ?? 'Proveedor sin nombre'}</span>
      )}
      {url && (
        <a
          href={url}
          target="_blank"
          rel="nofollow noopener"
          className="mt-0.5 block w-fit break-all text-sm font-normal text-ink-3 underline-offset-4 hover:text-ink hover:underline"
          title="Abrir la URL medida"
        >
          {host(url)}
        </a>
      )}
    </>
  );
};

/**
 * Resultados del benchmark: cada cifra visible con su detalle (p95, SEO,
 * accesibilidad, LCP, CLS) sin pasar el cursor. Tabla desde 1024 px; lista antes.
 */
const BenchmarkTable: React.FC<{ rows: BenchmarkRow[] }> = ({ rows }) => (
  <>
    <p className="t-small mb-5 flex flex-wrap items-center gap-2 text-ink-2">
      Todas las cifras son <ProvenanceTag kind="measured" /> por nosotros. «{NONE}» significa que esa medición no se completó.
    </p>

    <table className="hidden w-full border-collapse text-left text-[15px] lg:table">
      <caption className="sr-only">Resultados de la última medición, ordenados por puntaje compuesto</caption>
      <thead>
        <tr className="border-b-2 border-ink text-[13px] text-ink-2">
          <th scope="col" className="w-14 py-2.5 pr-3 font-semibold">Puesto</th>
          <th scope="col" className="py-2.5 pr-4 font-semibold">Proveedor y URL medida</th>
          <th scope="col" className="py-2.5 pr-4 text-right font-semibold">Puntaje (0 a 100)</th>
          <th scope="col" className="py-2.5 pr-4 text-right font-semibold">TTFB mediana</th>
          <th scope="col" className="py-2.5 pr-4 font-semibold">Lighthouse móvil</th>
          <th scope="col" className="py-2.5 pr-4 text-right font-semibold">Uptime 30 días</th>
          <th scope="col" className="py-2.5 pr-4 font-semibold">Servidor</th>
          <th scope="col" className="py-2.5 font-semibold">Fecha de medición</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={r.id} className="border-b border-rule align-top">
            <td className="py-3.5 pr-3 text-xl font-bold text-ink-3 tabular">{i + 1}</td>
            <th scope="row" className="py-3.5 pr-4 text-left font-normal">
              <ProviderName r={r} />
            </th>
            <td className="py-3.5 pr-4 text-right text-lg font-bold text-ink tabular">
              {r.composite_score != null ? formatScore(r.composite_score, 1) : <Missing />}
            </td>
            <td className="py-3.5 pr-4 text-right tabular text-ink">
              {r.ttfb_median_ms != null ? formatMs(r.ttfb_median_ms) : <Missing />}
              {r.ttfb_p95_ms != null && <span className="block text-sm text-ink-3">p95: {formatMs(r.ttfb_p95_ms)}</span>}
            </td>
            <td className="py-3.5 pr-4 tabular text-ink">
              {r.lighthouse_perf != null ? `Rendimiento ${formatInteger(r.lighthouse_perf)}` : <Missing />}
              {lighthouseExtra(r) && <span className="block text-sm text-ink-3">{lighthouseExtra(r)}</span>}
              {vitals(r) && <span className="block text-sm text-ink-3">{vitals(r)}</span>}
            </td>
            <td className="py-3.5 pr-4 text-right tabular text-ink">
              {r.uptime_30d_pct != null ? formatPercent(r.uptime_30d_pct, 2) : <Missing />}
            </td>
            <td className="py-3.5 pr-4 text-ink">
              {r.server_software ?? <Missing />}
              {r.has_brotli && <span className="block text-sm text-ink-3">Comprime con Brotli</span>}
            </td>
            <td className="py-3.5 text-ink tabular">
              <Measured r={r} />
              {r.hosting_companies?.benchmark_target_url && (
                <span className="block">
                  <ReproduceButton url={r.hosting_companies.benchmark_target_url} label="Reproducir" />
                </span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <ol className="divide-y divide-rule border-y-2 border-ink lg:hidden">
      {rows.map((r, i) => (
        <li key={r.id} className="py-5">
          <div className="flex items-baseline gap-3">
            <span className="w-7 shrink-0 text-xl font-bold text-ink-3 tabular">{i + 1}</span>
            <div className="min-w-0 flex-1">
              <ProviderName r={r} />
            </div>
            <span className="text-xl font-bold text-ink tabular">
              {r.composite_score != null ? formatScore(r.composite_score, 1) : <Missing />}
              <span className="sr-only"> de 100 (puntaje compuesto)</span>
            </span>
          </div>
          <dl className="ml-10 mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-[15px]">
            <div>
              <dt className="t-meta">TTFB mediana</dt>
              <dd className="tabular text-ink">
                {r.ttfb_median_ms != null ? formatMs(r.ttfb_median_ms) : <Missing />}
                {r.ttfb_p95_ms != null && <span className="block text-sm text-ink-3">p95: {formatMs(r.ttfb_p95_ms)}</span>}
              </dd>
            </div>
            <div>
              <dt className="t-meta">Uptime 30 días</dt>
              <dd className="tabular text-ink">{r.uptime_30d_pct != null ? formatPercent(r.uptime_30d_pct, 2) : <Missing />}</dd>
            </div>
            <div className="col-span-2">
              <dt className="t-meta">Lighthouse móvil</dt>
              <dd className="tabular text-ink">
                {r.lighthouse_perf != null ? `Rendimiento ${formatInteger(r.lighthouse_perf)}` : <Missing />}
                {lighthouseExtra(r) && <span className="block text-sm text-ink-3">{lighthouseExtra(r)}</span>}
                {vitals(r) && <span className="block text-sm text-ink-3">{vitals(r)}</span>}
              </dd>
            </div>
            <div>
              <dt className="t-meta">Servidor</dt>
              <dd className="text-ink">
                {r.server_software ?? <Missing />}
                {r.has_brotli && <span className="block text-sm text-ink-3">Comprime con Brotli</span>}
              </dd>
            </div>
            <div>
              <dt className="t-meta">Fecha de medición</dt>
              <dd className="tabular text-ink">
                <Measured r={r} />
              </dd>
            </div>
          </dl>
          {r.hosting_companies?.benchmark_target_url && (
            <div className="ml-10 mt-2">
              <ReproduceButton url={r.hosting_companies.benchmark_target_url} />
            </div>
          )}
        </li>
      ))}
    </ol>
  </>
);

export default BenchmarkTable;

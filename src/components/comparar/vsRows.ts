import type { CompareRow } from './CompareTable';
import type { CompareCompany } from './useCompareData';
import type { LatestBenchmarkRow } from '@/hooks/useProviderScore';
import { BENCHMARK_REGION, type SubScore } from '@/lib/rankingScore';
import { formatInteger, formatMs, formatPercent, formatScore, formatShortDate } from '@/lib/format';

/** Lo que la tabla A vs B necesita de cada lado. Todo sale de la base. */
export interface VsSideData {
  company: CompareCompany;
  bench: LatestBenchmarkRow | null | undefined;
  /** Subpuntajes de la fórmula publicada (null = sin dato). */
  subScores: SubScore[];
  /** Reseñas verificadas: get_company_reputation o, si no hay, la columna verified_reviews. */
  verifiedReviews: number | null;
}

const yesNo = (v: boolean | null) => (v == null ? null : v ? 'Sí' : 'No');
const round = (n: number | null | undefined, d = 1) => (n == null ? null : Math.round(Number(n) * 10 ** d) / 10 ** d);
const sub = (s: VsSideData, key: SubScore['key']) => s.subScores.find((x) => x.key === key)?.value ?? null;
const outOf10 = (v: number | null) => (v == null ? null : `${formatScore(v)}/10`);

/**
 * Filas de la comparación A vs B, ordenadas por lo que más pesa al decidir.
 * Cada fila declara su procedencia; nada se rellena con un valor supuesto.
 */
export function buildVsRows(sides: VsSideData[], measuring: boolean): CompareRow[] {
  const pending = measuring ? 'Cargando…' : undefined;
  return [
    {
      id: 'nota',
      label: 'Nota editorial',
      kind: 'editorial',
      empty: 'Sin nota',
      cells: sides.map((s) => ({ value: outOf10(s.company.overall_rating), raw: round(s.company.overall_rating) })),
    },
    {
      id: 'uptime',
      label: 'Disponibilidad en 30 días',
      kind: 'measured',
      empty: pending ?? 'Sin medir',
      cells: sides.map((s) => {
        const v = s.bench?.uptime_30d_pct;
        return {
          value: v != null ? formatPercent(Number(v), 2) : null,
          raw: round(v, 2),
          date: v != null ? s.bench?.measured_at : null,
        };
      }),
    },
    {
      id: 'ttfb',
      label: 'Tiempo de respuesta (TTFB)',
      kind: 'measured',
      note: `Mediana, medida desde ${BENCHMARK_REGION}`,
      empty: pending ?? 'Sin medir',
      cells: sides.map((s) => {
        const v = s.bench?.ttfb_median_ms;
        return {
          value: v != null ? formatMs(Number(v)) : null,
          raw: round(v, 0),
          date: v != null ? s.bench?.measured_at : null,
        };
      }),
    },
    {
      id: 'soporte',
      label: 'Soporte',
      kind: 'editorial',
      empty: 'Sin evaluar',
      cells: sides.map((s) => ({ value: outOf10(sub(s, 'support')), raw: round(sub(s, 'support')) })),
    },
    {
      id: 'precio-valor',
      label: 'Precio y valor',
      kind: 'editorial',
      empty: 'Sin evaluar',
      cells: sides.map((s) => ({ value: outOf10(sub(s, 'price')), raw: round(sub(s, 'price')) })),
    },
    {
      id: 'datacenter',
      label: 'Datacenter',
      kind: 'declared',
      empty: 'No informado',
      cells: sides.map((s) => ({ value: s.company.datacenter_location, raw: s.company.datacenter_location })),
    },
    {
      id: 'garantia',
      label: 'Garantía de uptime',
      kind: 'declared',
      cells: sides.map((s) => ({ value: s.company.uptime_guarantee, raw: s.company.uptime_guarantee })),
    },
    {
      id: 'ssl',
      label: 'SSL gratis',
      kind: 'declared',
      cells: sides.map((s) => ({ value: yesNo(s.company.has_ssl_free), raw: s.company.has_ssl_free })),
    },
    {
      id: 'migracion',
      label: 'Migración gratis',
      kind: 'declared',
      cells: sides.map((s) => ({ value: yesNo(s.company.has_migration_free), raw: s.company.has_migration_free })),
    },
    {
      id: 'resenas',
      label: 'Reseñas verificadas',
      kind: 'measured',
      empty: pending ?? 'Sin dato',
      cells: sides.map((s) => ({
        value: s.verifiedReviews != null ? formatInteger(s.verifiedReviews) : null,
        raw: s.verifiedReviews,
      })),
    },
    {
      id: 'fundacion',
      label: 'Año de fundación',
      kind: 'declared',
      cells: sides.map((s) => {
        const y = s.company.foundation_year ?? s.company.year_founded;
        return { value: y != null ? String(y) : null, raw: y };
      }),
    },
    {
      id: 'grupo',
      label: 'Grupo corporativo',
      kind: 'declared',
      empty: 'No declarado',
      cells: sides.map((s) => ({ value: s.company.corporate_group, raw: s.company.corporate_group })),
    },
    {
      id: 'precio',
      label: 'Precio de entrada',
      note: 'En reverificación: consulta el valor vigente en el sitio de cada proveedor.',
      cells: sides.map(() => ({ value: 'Consultar', raw: null })),
    },
    {
      id: 'actualizada',
      label: 'Ficha actualizada',
      cells: sides.map((s) => ({
        value: s.company.updated_at ? formatShortDate(s.company.updated_at) : null,
        raw: null,
      })),
    },
  ];
}

import React from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import type { BenchmarkRow } from '@/hooks/useBenchmark';
import { formatInteger, formatMs, formatPercent, formatScore } from '@/lib/format';
import { useIsMobile } from '@/hooks/use-mobile';

const INK = 'rgb(var(--ink))';
const INK3 = 'rgb(var(--ink-3))';
const RULE = 'rgb(var(--rule))';
const ROW_H = 36;

type Metric = 'composite_score' | 'ttfb_median_ms' | 'lighthouse_perf' | 'uptime_30d_pct';

interface Panel {
  key: Metric;
  title: string;
  note: string;
  /** Mayor es mejor (orden descendente) o al revés. */
  higherIsBetter: boolean;
  domain: [number, number | 'auto'];
  format: (v: number) => string;
  tick: (v: number) => string;
}

const PANELS: Panel[] = [
  {
    key: 'composite_score',
    title: 'Puntaje compuesto',
    note: 'De 0 a 100. Más es mejor.',
    higherIsBetter: true,
    domain: [0, 100],
    format: (v) => formatScore(v, 1),
    tick: (v) => formatInteger(v),
  },
  {
    key: 'ttfb_median_ms',
    title: 'TTFB mediana',
    note: 'En milisegundos. Menos es mejor.',
    higherIsBetter: false,
    domain: [0, 'auto'],
    format: (v) => formatMs(v),
    tick: (v) => formatInteger(v),
  },
  {
    key: 'lighthouse_perf',
    title: 'Lighthouse móvil: rendimiento',
    note: 'De 0 a 100. Más es mejor.',
    higherIsBetter: true,
    domain: [0, 100],
    format: (v) => formatInteger(v),
    tick: (v) => formatInteger(v),
  },
  {
    key: 'uptime_30d_pct',
    title: 'Uptime 30 días',
    note: 'Eje completo, de 0 % a 100 %: las diferencias reales son de décimas, así que lee el valor de cada barra.',
    higherIsBetter: true,
    domain: [0, 100],
    format: (v) => formatPercent(v, 2),
    tick: (v) => `${formatInteger(v)} %`,
  },
];

/** Espacio duro entre cifra y unidad: la etiqueta no se parte en dos líneas. */
const keepTogether = (s: string) => s.replace(/ /g, '\u00a0');

const ChartPanel: React.FC<{ panel: Panel; rows: BenchmarkRow[] }> = ({ panel, rows }) => {
  const isMobile = useIsMobile();
  const data = rows
    .filter((r) => r[panel.key] != null)
    .map((r) => ({ name: r.hosting_companies?.name ?? 'Sin nombre', v: Number(r[panel.key]) }))
    .sort((a, b) => (panel.higherIsBetter ? b.v - a.v : a.v - b.v));
  const missing = rows.filter((r) => r[panel.key] == null).map((r) => r.hosting_companies?.name ?? 'Sin nombre');
  const height = data.length * ROW_H + 36;

  return (
    <figure className="min-w-0 rounded-xl border border-rule bg-white p-5">
      <figcaption>
        <p className="font-semibold text-ink">{panel.title}</p>
        <p className="t-meta mt-0.5">{panel.note}</p>
      </figcaption>
      {data.length > 0 ? (
        <>
          <div aria-hidden className="mt-4" style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ top: 0, right: isMobile ? 60 : 72, bottom: 0, left: 0 }} barCategoryGap={8}>
                <CartesianGrid horizontal={false} stroke={RULE} />
                <XAxis
                  type="number"
                  domain={panel.domain}
                  tickFormatter={panel.tick}
                  tick={{ fill: INK3, fontSize: 12 }}
                  axisLine={{ stroke: RULE }}
                  tickLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  interval={0}
                  width={isMobile ? 100 : 124}
                  tick={{ fill: INK3, fontSize: isMobile ? 12 : 13 }}
                  axisLine={{ stroke: RULE }}
                  tickLine={false}
                />
                <Bar dataKey="v" fill={INK} radius={[0, 3, 3, 0]} isAnimationActive={false}>
                  <LabelList
                    dataKey="v"
                    position="right"
                    formatter={(v: number) => keepTogether(panel.format(v))}
                    style={{ fill: INK, fontSize: 13, fontWeight: 600 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ol className="sr-only">
            {data.map((d) => (
              <li key={d.name}>
                {d.name}: {panel.format(d.v)}
              </li>
            ))}
          </ol>
        </>
      ) : (
        <p className="t-small mt-4 text-ink-2">Ningún proveedor tiene esta medición en la última corrida.</p>
      )}
      {missing.length > 0 && <p className="t-meta mt-3">Sin medir: {missing.join(', ')}.</p>}
    </figure>
  );
};

/** Cuatro gráficos de barras con todos los nombres, valores escritos y ejes que parten en cero. */
const BenchmarkCharts: React.FC<{ rows: BenchmarkRow[] }> = ({ rows }) => (
  <div className="grid gap-6 md:grid-cols-2">
    {PANELS.map((p) => (
      <ChartPanel key={p.key} panel={p} rows={rows} />
    ))}
  </div>
);

export default BenchmarkCharts;

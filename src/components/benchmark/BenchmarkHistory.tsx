import React from 'react';
import { CartesianGrid, LabelList, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { BenchmarkRow } from '@/hooks/useBenchmark';
import { formatInteger, formatMs, formatScore, formatShortDate } from '@/lib/format';

const INK = 'rgb(var(--ink))';
const INK3 = 'rgb(var(--ink-3))';
const RULE = 'rgb(var(--rule))';

interface Series {
  title: string;
  note: string;
  points: { date: string; v: number }[];
  format: (v: number) => string;
  domain: [number, number | ((dataMax: number) => number)];
}

/** Techo redondo sobre el máximo, para que el punto más alto no choque con el borde. */
const roomyMax = (dataMax: number) => Math.max(100, Math.ceil((dataMax * 1.2) / 100) * 100);

const HistoryChart: React.FC<{ s: Series }> = ({ s }) => {
  const labelled = s.points.length <= 8;
  return (
    <figure className="min-w-0 rounded-xl border border-rule bg-white p-5">
      <figcaption>
        <p className="font-semibold text-ink">{s.title}</p>
        <p className="t-meta mt-0.5">{s.note}</p>
      </figcaption>
      <div aria-hidden className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={s.points} margin={{ top: 24, right: 24, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke={RULE} />
            <XAxis dataKey="date" tickFormatter={(d: string) => formatShortDate(d)} tick={{ fill: INK3, fontSize: 12 }} axisLine={{ stroke: RULE }} tickLine={false} minTickGap={24} />
            <YAxis domain={s.domain} tickFormatter={(v: number) => formatInteger(v)} tick={{ fill: INK3, fontSize: 12 }} axisLine={false} tickLine={false} width={44} />
            <Tooltip
              formatter={(v: number) => [s.format(v), s.title]}
              labelFormatter={(d: string) => formatShortDate(d)}
              contentStyle={{ borderRadius: 10, borderColor: RULE, fontSize: 13 }}
            />
            <Line type="linear" dataKey="v" stroke={INK} strokeWidth={2} dot={{ r: 3, fill: INK }} isAnimationActive={false}>
              {labelled && <LabelList dataKey="v" position="top" formatter={(v: number) => s.format(v)} style={{ fill: INK, fontSize: 12, fontWeight: 600 }} />}
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>
      <ol className="sr-only">
        {s.points.map((p) => (
          <li key={p.date}>
            {formatShortDate(p.date)}: {s.format(p.v)}
          </li>
        ))}
      </ol>
    </figure>
  );
};

interface BenchmarkHistoryProps {
  results: BenchmarkRow[];
  selected?: string;
  onSelect: (id: string) => void;
  history?: BenchmarkRow[];
}

/** Histórico de un proveedor en dos gráficos: cada uno con su unidad y su eje. */
const BenchmarkHistory: React.FC<BenchmarkHistoryProps> = ({ results, selected, onSelect, history }) => {
  const rows = history ?? [];
  const name = results.find((r) => r.company_id === selected)?.hosting_companies?.name ?? 'este proveedor';
  const ttfb = rows.filter((r) => r.ttfb_median_ms != null).map((r) => ({ date: r.measured_at, v: Number(r.ttfb_median_ms) }));
  const score = rows.filter((r) => r.composite_score != null).map((r) => ({ date: r.measured_at, v: Number(r.composite_score) }));

  return (
    <>
      <div className="max-w-sm">
        <label id="historico-proveedor" className="t-label">
          Proveedor
        </label>
        <Select value={selected} onValueChange={onSelect}>
          <SelectTrigger aria-labelledby="historico-proveedor" className="mt-2 h-11 rounded-lg border-rule text-base">
            <SelectValue placeholder="Elige un proveedor" />
          </SelectTrigger>
          <SelectContent>
            {results.map((r) => (
              <SelectItem key={r.company_id} value={r.company_id}>
                {r.hosting_companies?.name ?? 'Sin nombre'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {history === undefined ? (
        <p className="t-small mt-6 text-ink-2">Cargando el histórico…</p>
      ) : rows.length < 2 ? (
        <p className="t-small mt-6 measure text-ink-2">
          {rows.length === 1
            ? `Hay una sola medición de ${name} (${formatShortDate(rows[0].measured_at)}). El histórico aparece desde la segunda corrida mensual.`
            : `Todavía no hay mediciones de ${name}.`}
        </p>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <HistoryChart s={{ title: 'TTFB mediana', note: 'En milisegundos. Menos es mejor.', points: ttfb, format: formatMs, domain: [0, roomyMax] }} />
          <HistoryChart s={{ title: 'Puntaje compuesto', note: 'De 0 a 100. Más es mejor.', points: score, format: (v) => formatScore(v, 1), domain: [0, 100] }} />
        </div>
      )}
    </>
  );
};

export default BenchmarkHistory;

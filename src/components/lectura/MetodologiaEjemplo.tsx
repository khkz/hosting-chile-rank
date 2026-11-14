import React from 'react';
import EvidenceCard, { type EvidenceRow } from '@/components/system/EvidenceCard';
import Callout from '@/components/system/Callout';
import { RANKING_FACTORS, type RankingFactorKey } from '@/lib/rankingWeights';
import { formatPercent, formatScore } from '@/lib/format';

interface TopBreakdown {
  company: {
    name: string;
    overall_rating?: number | string | null;
    support_rating?: number | string | null;
    price_rating?: number | string | null;
  };
  benchmark?: {
    lighthouse_perf?: number | null;
    uptime_30d_pct?: number | null;
    composite_score?: number | string | null;
    measured_at?: string | null;
  } | null;
}

interface Props {
  data: TopBreakdown | null | undefined;
  isLoading: boolean;
  exportUrl: string;
}

const num = (v: unknown): number | null => {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

/** Valor de un factor del #1, con su procedencia. Sin dato: «sin medir» o «sin dato», nunca 0. */
function factorRow(key: RankingFactorKey, d: TopBreakdown): Omit<EvidenceRow, 'label'> {
  const b = d.benchmark ?? null;
  const date = b?.measured_at ?? null;
  if (key === 'speed') {
    const v = num(b?.lighthouse_perf);
    return v == null ? { value: 'sin medir' } : { value: formatScore(v / 10), kind: 'measured', date };
  }
  if (key === 'uptime') {
    const v = num(b?.uptime_30d_pct);
    return v == null ? { value: 'sin medir' } : { value: formatPercent(v, 2), kind: 'measured', date };
  }
  const raw =
    key === 'support' ? d.company.support_rating : key === 'price' ? d.company.price_rating : d.company.overall_rating;
  const v = num(raw);
  return v == null ? { value: 'sin dato' } : { value: formatScore(v), kind: 'editorial' };
}

/** Sección 5 de /metodologia: el cálculo aplicado al #1 con datos de la base. */
const MetodologiaEjemplo: React.FC<Props> = ({ data, isLoading, exportUrl }) => {
  if (isLoading) {
    return (
      <p role="status" className="t-small text-ink-3">
        Cargando el ejemplo con datos de la base…
      </p>
    );
  }

  if (!data?.company) {
    return (
      <Callout tone="note" title="No pudimos cargar el ejemplo">
        <p>
          Lo armamos con datos vivos de la base y esta vez no llegaron. Vuelve a intentarlo en unos minutos o revisa los
          últimos resultados en el{' '}
          <a href={exportUrl} className="font-semibold text-ink underline underline-offset-2">
            JSON exportable
          </a>
          .
        </p>
      </Callout>
    );
  }

  // El benchmark guarda el compuesto en escala 0-100; las notas por factor van de 0 a 10.
  const rawComposite = num(data.benchmark?.composite_score ?? data.company.overall_rating);
  const composite = rawComposite == null ? null : rawComposite > 10 ? rawComposite / 10 : rawComposite;

  const rows: EvidenceRow[] = RANKING_FACTORS.map((f) => ({
    label: `${f.label} (${formatPercent(f.weight, 0)})`,
    ...factorRow(f.key, data),
  }));
  if (composite == null) rows.push({ label: 'Puntaje compuesto', value: 'sin dato' });

  return (
    <div className="space-y-3">
      <EvidenceCard
        rank={1}
        title={data.company.name}
        subtitle="Primer lugar actual. Datos vivos desde la base de datos pública."
        score={composite ?? undefined}
        scoreKind="editorial"
        rows={rows}
      />
      <p className="t-meta">
        Todas las notas por factor y el puntaje compuesto van en escala de 0 a 10. Cuando el benchmark guarda el
        compuesto en escala de 0 a 100, lo dividimos por 10.
      </p>
    </div>
  );
};

export default MetodologiaEjemplo;

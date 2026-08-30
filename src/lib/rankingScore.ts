/**
 * Cálculo reproducible de la nota de un proveedor.
 * Regla: si un subcriterio no tiene dato medido, vale null ("sin medir").
 * Nunca se rellena con un valor supuesto.
 */
import { RANKING_FACTORS, type RankingFactorKey } from '@/lib/rankingWeights';

/** Región desde la que corre el benchmark (edge function de Supabase). */
export const BENCHMARK_REGION = 'us-east-1 (EE. UU.)';

export interface ScoreInputs {
  /** benchmark_results.uptime_30d_pct */
  uptime30dPct: number | null;
  /** benchmark_results.ttfb_median_ms */
  ttfbMedianMs: number | null;
  /** benchmark_results.lighthouse_perf (0-100) */
  lighthousePerf: number | null;
  /** hosting_companies.support_rating (0-10, 0 = sin dato) */
  supportRating: number | null;
  /** hosting_companies.price_rating (0-10, 0 = sin dato) */
  priceRating: number | null;
  /** Promedio de reseñas verificadas (0-10) y su conteo */
  verifiedReviewsAvg: number | null;
  verifiedReviewsCount: number | null;
}

export interface SubScore {
  key: RankingFactorKey;
  label: string;
  weight: number;
  /** 0-10 o null = sin medir */
  value: number | null;
  /** Dato crudo mostrado al usuario, ya formateado */
  raw: string;
  /** Cómo se obtuvo (fuente concreta) */
  source: string;
  /** true cuando el subpuntaje se calculó con parte de los insumos */
  partial?: boolean;
}

export interface ScoreBreakdownResult {
  subScores: SubScore[];
  /** Nota ponderada sobre los subcriterios medidos, o null si no hay ninguno */
  computed: number | null;
  /** Suma de pesos efectivamente medidos (0-100) */
  weightCovered: number;
  measuredCount: number;
}

const factor = (key: RankingFactorKey) =>
  RANKING_FACTORS.find((f) => f.key === key)!;

const clamp10 = (n: number) => Math.max(0, Math.min(10, n));

/** Interpolación por tramos declarada en rankingWeights. */
export const uptimeToScore = (pct: number): number => {
  const anchors: Array<[number, number]> = [
    [98, 0],
    [99.0, 5],
    [99.5, 7],
    [99.9, 9],
    [99.99, 10],
  ];
  if (pct <= 98) return 0;
  if (pct >= 99.99) return 10;
  for (let i = 1; i < anchors.length; i++) {
    const [x1, y1] = anchors[i - 1];
    const [x2, y2] = anchors[i];
    if (pct <= x2) return clamp10(y1 + ((pct - x1) / (x2 - x1)) * (y2 - y1));
  }
  return 10;
};

/** TTFB < 200 ms = 10; > 1500 ms = 0; lineal entre ambos. */
export const ttfbToScore = (ms: number): number => {
  if (ms <= 200) return 10;
  if (ms >= 1500) return 0;
  return clamp10((10 * (1500 - ms)) / 1300);
};

const fmtMs = (ms: number) => `${Math.round(ms)} ms`;

export const buildScoreBreakdown = (i: ScoreInputs): ScoreBreakdownResult => {
  const subScores: SubScore[] = [];

  // Reputación — solo con reseñas verificadas reales.
  const repCount = i.verifiedReviewsCount ?? 0;
  const repValue = repCount > 0 && i.verifiedReviewsAvg != null ? clamp10(i.verifiedReviewsAvg) : null;
  subScores.push({
    key: 'reputation',
    label: factor('reputation').label,
    weight: factor('reputation').weight,
    value: repValue,
    raw: repValue == null ? 'Sin reseñas verificadas ni reclamos medidos' : `${repValue.toFixed(1)}/10 · ${repCount} reseña(s) verificada(s)`,
    source: factor('reputation').source,
  });

  // Uptime — benchmark_results.uptime_30d_pct
  const upValue = i.uptime30dPct != null ? uptimeToScore(Number(i.uptime30dPct)) : null;
  subScores.push({
    key: 'uptime',
    label: factor('uptime').label,
    weight: factor('uptime').weight,
    value: upValue,
    raw: i.uptime30dPct == null ? 'Sin medición de disponibilidad' : `${Number(i.uptime30dPct).toFixed(2)}% en 30 días`,
    source: factor('uptime').source,
  });

  // Velocidad — TTFB (+ Lighthouse si existe)
  const ttfbScore = i.ttfbMedianMs != null ? ttfbToScore(Number(i.ttfbMedianMs)) : null;
  const lhScore = i.lighthousePerf != null ? clamp10(Number(i.lighthousePerf) / 10) : null;
  let speedValue: number | null = null;
  let speedPartial = false;
  if (ttfbScore != null && lhScore != null) speedValue = 0.6 * lhScore + 0.4 * ttfbScore;
  else if (ttfbScore != null) {
    speedValue = ttfbScore;
    speedPartial = true;
  } else if (lhScore != null) {
    speedValue = lhScore;
    speedPartial = true;
  }
  const speedRaw = [
    i.ttfbMedianMs != null ? `TTFB mediana ${fmtMs(Number(i.ttfbMedianMs))}` : 'TTFB sin medir',
    i.lighthousePerf != null ? `Lighthouse Perf ${i.lighthousePerf}/100` : 'Lighthouse sin medir',
  ].join(' · ');
  subScores.push({
    key: 'speed',
    label: factor('speed').label,
    weight: factor('speed').weight,
    value: speedValue,
    raw: speedRaw,
    source: `${factor('speed').source} — medido desde ${BENCHMARK_REGION}`,
    partial: speedPartial,
  });

  // Soporte y Precio — valores de curaduría editorial (0 = sin dato)
  const sup = i.supportRating != null && Number(i.supportRating) > 0 ? clamp10(Number(i.supportRating)) : null;
  subScores.push({
    key: 'support',
    label: factor('support').label,
    weight: factor('support').weight,
    value: sup,
    raw: sup == null ? 'Sin evaluación de soporte registrada' : `${sup.toFixed(1)}/10`,
    source: factor('support').source,
  });

  const pri = i.priceRating != null && Number(i.priceRating) > 0 ? clamp10(Number(i.priceRating)) : null;
  subScores.push({
    key: 'price',
    label: factor('price').label,
    weight: factor('price').weight,
    value: pri,
    raw: pri == null ? 'Sin evaluación de precio registrada' : `${pri.toFixed(1)}/10`,
    source: factor('price').source,
  });

  const measured = subScores.filter((s) => s.value != null);
  const weightCovered = measured.reduce((acc, s) => acc + s.weight, 0);
  const computed =
    weightCovered > 0
      ? Number(
          (
            measured.reduce((acc, s) => acc + (s.value as number) * s.weight, 0) / weightCovered
          ).toFixed(2),
        )
      : null;

  return { subScores, computed, weightCovered, measuredCount: measured.length };
};

// Pesos centrales del ranking. Cualquier cambio aquí impacta /metodologia,
// el bloque "cómo se calculó" y futura lógica de cálculo agregado.

export type RankingFactorKey =
  | "reputation"
  | "uptime"
  | "speed"
  | "support"
  | "price";

export interface RankingFactor {
  key: RankingFactorKey;
  label: string;
  weight: number; // 0-100
  source: string;
  frequency: string;
  normalization: string;
}

export const RANKING_FACTORS: RankingFactor[] = [
  {
    key: "reputation",
    label: "Reputación",
    weight: 30,
    source: "Reclamos.cl + reseñas verificadas (hosting_reviews)",
    frequency: "Sincronización semanal",
    normalization:
      "10 = 0 reclamos no resueltos último año. Resta 0.5 por cada reclamo abierto verificado.",
  },
  {
    key: "uptime",
    label: "Uptime & Disponibilidad",
    weight: 25,
    source: "Tabla uptime_pings (HEAD/GET cada hora)",
    frequency: "Cada 1 hora · agregado a 30 días",
    normalization:
      "uptime% mapeado: 99.99→10, 99.9→9, 99.5→7, 99.0→5, <98→0.",
  },
  {
    key: "speed",
    label: "Velocidad & Rendimiento",
    weight: 20,
    source: "benchmark_results: TTFB mediana + Lighthouse Perf",
    frequency: "Mensual + manual",
    normalization:
      "0.6 · score_lighthouse_perf/10 + 0.4 · score_ttfb (TTFB<200ms=10, >1500ms=0).",
  },
  {
    key: "support",
    label: "Soporte & Documentación",
    weight: 15,
    source: "Curaduría editorial + reseñas (support_rating)",
    frequency: "Revisión trimestral",
    normalization:
      "Promedio support_rating (1–5) escalado a 0–10 + bonus por docs en español.",
  },
  {
    key: "price",
    label: "Precio & Valor",
    weight: 10,
    source: "hosting_plans: relación features/precio normalizada al sector",
    frequency: "Revisión trimestral",
    normalization:
      "Percentil inverso del precio efectivo por GB+features. Mediana del mercado = 7.",
  },
];

export const RANKING_EXCLUSION_RULES = [
  "is_verified = false (proveedor no validado)",
  "is_curated = false (sin curaduría editorial)",
  "score_final < 7.0",
  "Detección de monopolio o redirección a marca distinta",
];

export const FORMULA_TEXT =
  "score_final = 0.30·reputación + 0.25·uptime + 0.20·velocidad + 0.15·soporte + 0.10·precio";

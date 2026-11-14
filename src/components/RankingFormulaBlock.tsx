import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator } from "lucide-react";
import {
  RANKING_FACTORS,
  RANKING_EXCLUSION_RULES,
  type RankingFactorKey,
} from "@/lib/rankingWeights";
import { formatPercent, formatScore } from "@/lib/format";

interface Props {
  variant?: "full" | "compact";
}

/** Nombre corto de cada factor dentro de la fórmula. */
const SHORT: Record<RankingFactorKey, string> = {
  reputation: "reputación",
  uptime: "uptime",
  speed: "velocidad",
  support: "soporte",
  price: "precio",
};

const coef = (weight: number) => formatScore(weight / 100, 2);

/** Lectura completa de la fórmula para lectores de pantalla. */
const SPOKEN = `score_final es igual a ${RANKING_FACTORS.map(
  (f) => `${coef(f.weight)} por ${SHORT[f.key]}`
).join(", más ")}.`;

/**
 * Fórmula del ranking: un término por línea, con coma decimal, para que se lea
 * completa en cualquier ancho sin desplazamiento horizontal.
 */
const RankingFormulaBlock: React.FC<Props> = ({ variant = "full" }) => (
  <div className="not-prose space-y-6">
    {variant === "compact" && (
      <h3 className="t-h3 flex items-center gap-2 text-ink">
        <Calculator className="h-5 w-5 text-ink-2" aria-hidden />
        Cómo se calculó el ranking
      </h3>
    )}
    <p className="t-body text-ink-2">Fórmula pública, datos verificables y pesos publicados.</p>

    <figure className="rounded-xl border border-rule bg-paper p-5">
      <figcaption className="t-label">Fórmula del puntaje final</figcaption>
      <p className="sr-only">{SPOKEN}</p>
      <div aria-hidden className="tabular mt-3 text-base text-ink">
        <p className="font-semibold">score_final =</p>
        <ol className="mt-2 space-y-1.5">
          {RANKING_FACTORS.map((f, i) => (
            <li key={f.key} className="flex items-baseline gap-2">
              <span className="w-4 shrink-0 text-center text-ink-3">{i === 0 ? "" : "+"}</span>
              <span className="font-semibold">{coef(f.weight)}</span>
              <span className="text-ink-3">×</span>
              <span className="min-w-0">{SHORT[f.key]}</span>
            </li>
          ))}
        </ol>
      </div>
    </figure>

    <dl className="divide-y divide-rule border-y border-rule">
      {RANKING_FACTORS.map((f) => (
        <div key={f.key} className="py-4">
          <dt className="flex items-baseline gap-3">
            <span className="tabular w-14 shrink-0 text-lg font-bold text-ink">{formatPercent(f.weight, 0)}</span>
            <span className="min-w-0 font-semibold text-ink">{f.label}</span>
          </dt>
          {variant === "full" && (
            <dd className="t-small mt-1 space-y-1 pl-[4.25rem] text-ink-2">
              <p>
                <span className="font-semibold text-ink">Fuente:</span> {f.source}
              </p>
              <p>
                <span className="font-semibold text-ink">Frecuencia:</span> {f.frequency}
              </p>
              <p>
                <span className="font-semibold text-ink">Normalización:</span> {f.normalization}
              </p>
            </dd>
          )}
        </div>
      ))}
    </dl>

    {variant === "full" && (
      <div>
        <h3 className="t-h3 text-ink">Reglas de exclusión</h3>
        <ul className="t-small mt-3 list-disc space-y-1.5 pl-5 text-ink-2 marker:text-ink-3">
          {RANKING_EXCLUSION_RULES.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>
    )}

    {variant === "compact" && (
      <Button asChild variant="outline" className="w-full">
        <Link to="/metodologia">
          Ver metodología completa
          <ArrowRight aria-hidden />
        </Link>
      </Button>
    )}
  </div>
);

export default RankingFormulaBlock;

import React from 'react';
import { Card } from '@/components/ui/card';
import { BENCHMARK_REGION } from '@/lib/rankingScore';
import { FORMULA_TEXT } from '@/lib/rankingWeights';
import { useProviderScore } from '@/hooks/useProviderScore';

interface Props {
  companyId: string;
  companyName: string;
  supportRating: number | null;
  priceRating: number | null;
  /** Nota que hoy publica la ficha (hosting_companies.overall_rating) */
  publishedRating: number | null;
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' });

/**
 * Muestra los 5 subcriterios del ranking con su valor medido, su peso y el
 * cálculo que produce la nota. Lo que no está medido se dice: "sin medir".
 */
const ScoreBreakdown: React.FC<Props> = ({
  companyId,
  companyName,
  supportRating,
  priceRating,
  publishedRating,
}) => {
  const score = useProviderScore({ companyId, supportRating, priceRating });

  return (
    <section id="subpuntajes" className="mt-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-2">
        Cómo se calcula la nota de {companyName}
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Fórmula publicada: <code className="px-1 py-0.5 bg-muted rounded">{FORMULA_TEXT}</code>
      </p>

      <Card className="p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-semibold">Subcriterio</th>
              <th className="text-left p-3 font-semibold">Peso</th>
              <th className="text-left p-3 font-semibold">Subpuntaje</th>
              <th className="text-left p-3 font-semibold">Dato medido y fuente</th>
            </tr>
          </thead>
          <tbody>
            {score.subScores.map((s) => (
              <tr key={s.key} className="border-t align-top">
                <td className="p-3 font-medium">{s.label}</td>
                <td className="p-3 whitespace-nowrap">{s.weight}%</td>
                <td className="p-3 whitespace-nowrap">
                  {s.value == null ? (
                    <span className="text-muted-foreground italic">sin medir</span>
                  ) : (
                    <span className="font-semibold">
                      {s.value.toFixed(1)}/10
                      {s.partial && (
                        <span className="ml-1 text-xs font-normal text-muted-foreground">(parcial)</span>
                      )}
                    </span>
                  )}
                </td>
                <td className="p-3 text-muted-foreground">
                  <span className="block">{s.raw}</span>
                  <span className="block text-xs mt-1">Fuente: {s.source}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="mt-4 space-y-2 text-sm">
        <p>
          <strong>Nota calculada con los datos disponibles:</strong>{' '}
          {score.computed == null ? (
            <span className="text-muted-foreground italic">sin medir (ningún subcriterio con dato)</span>
          ) : (
            <>
              {score.computed.toFixed(2)}/10 — promedio ponderado sobre {score.measuredCount} de 5
              subcriterios, que cubren {score.weightCovered}% del peso total.
            </>
          )}
        </p>
        {publishedRating != null && (
          <p className="text-muted-foreground">
            Nota editorial publicada en la ficha: {publishedRating.toFixed(1)}/10. Cuando difiere de la
            calculada, es porque parte de los subcriterios aún no tiene medición propia.
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Velocidad y disponibilidad se miden con nuestra propia sonda: el TTFB se mide desde{' '}
          <strong>{BENCHMARK_REGION}</strong>, no desde Chile, por lo que no representa la latencia real
          de un usuario chileno.{' '}
          {score.measuredAt
            ? `Última medición: ${fmtDate(score.measuredAt)}.`
            : 'Este proveedor todavía no tiene mediciones de benchmark.'}
        </p>
      </div>
    </section>
  );
};

export default ScoreBreakdown;

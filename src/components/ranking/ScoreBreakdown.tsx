import React from 'react';
import { Link } from 'react-router-dom';
import { ProvenanceTag, type Provenance } from '@/components/data/Provenance';
import { BENCHMARK_REGION, type SubScore } from '@/lib/rankingScore';
import { useProviderScore } from '@/hooks/useProviderScore';
import { formatDataDate, formatScore, isoDate } from '@/lib/format';

interface Props {
  companyId: string;
  companyName: string;
  supportRating: number | null;
  priceRating: number | null;
  /** Nota que hoy publica la ficha (hosting_companies.overall_rating). null = no se menciona. */
  publishedRating: number | null;
}

/** Procedencia de cada subcriterio: sonda propia (medido) o curaduría (editorial). */
const KIND: Partial<Record<SubScore['key'], Provenance>> = {
  uptime: 'measured',
  speed: 'measured',
  support: 'editorial',
  price: 'editorial',
};

// Los textos crudos vienen de rankingScore con punto decimal, «&» y punto medio: aquí solo se presentan.
const label = (s: SubScore) => s.label.replace(/\s*&\s*(\p{Lu})/u, (_m, c: string) => ` y ${c.toLowerCase()}`);
const rawLines = (raw: string) =>
  raw.split(' \u00B7 ').map((part) => part.replace(/(\d)\.(\d)/g, '$1,$2').replace(/(\d)%/g, '$1 %'));

const Value: React.FC<{ s: SubScore }> = ({ s }) =>
  s.value == null ? (
    <span className="text-ink-3">sin medir</span>
  ) : (
    <span className="inline-flex items-center gap-2">
      <span className="tabular font-semibold text-ink">
        {formatScore(s.value)}
        <span className="text-ink-3">/10</span>
      </span>
      {KIND[s.key] && <ProvenanceTag kind={KIND[s.key]!} variant="glyph" />}
      {s.partial && <span className="t-meta">(parcial)</span>}
    </span>
  );

const Data: React.FC<{ s: SubScore }> = ({ s }) => (
  <>
    {rawLines(s.raw).map((line) => (
      <span key={line} className="block text-ink">
        {line}
      </span>
    ))}
    <span className="mt-1 block t-meta">Fuente: {s.source}</span>
  </>
);

/**
 * Los 5 subcriterios del ranking con su dato, su peso y la nota que resulta.
 * Lo que no está medido se dice: «sin medir». La sección que lo contiene pone el título.
 */
const ScoreBreakdown: React.FC<Props> = ({ companyId, companyName, supportRating, priceRating, publishedRating }) => {
  const score = useProviderScore({ companyId, supportRating, priceRating });

  return (
    <div>
      {/* Móvil: lista */}
      <ul className="divide-y divide-rule border-y-2 border-ink md:hidden">
        {score.subScores.map((s) => (
          <li key={s.key} className="py-4">
            <div className="flex items-baseline justify-between gap-4">
              <p className="font-semibold text-ink">
                {label(s)} <span className="t-meta font-normal">{s.weight} %</span>
              </p>
              <Value s={s} />
            </div>
            <p className="mt-1.5 t-small">
              <Data s={s} />
            </p>
          </li>
        ))}
      </ul>

      {/* Escritorio: tabla */}
      <table className="hidden w-full border-collapse text-left t-small md:table">
        <caption className="sr-only">Subcriterios de la nota de {companyName}</caption>
        <thead>
          <tr className="border-b-2 border-ink text-[13px] text-ink-2">
            <th scope="col" className="py-2.5 pr-4 font-semibold">Subcriterio</th>
            <th scope="col" className="w-20 py-2.5 pr-4 text-right font-semibold">Peso</th>
            <th scope="col" className="w-44 py-2.5 pr-4 font-semibold">Subpuntaje</th>
            <th scope="col" className="py-2.5 font-semibold">Dato y fuente</th>
          </tr>
        </thead>
        <tbody>
          {score.subScores.map((s) => (
            <tr key={s.key} className="border-b border-rule align-top">
              <th scope="row" className="py-3 pr-4 font-semibold text-ink">{label(s)}</th>
              <td className="py-3 pr-4 text-right tabular text-ink">{s.weight} %</td>
              <td className="whitespace-nowrap py-3 pr-4"><Value s={s} /></td>
              <td className="py-3"><Data s={s} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 max-w-[62ch] space-y-3 t-small text-ink-2">
        <p className="text-ink">
          <strong className="font-semibold">Nota calculada con los datos disponibles:</strong>{' '}
          {score.computed == null ? (
            <span className="text-ink-3">sin medir (ningún subcriterio tiene dato todavía).</span>
          ) : (
            <>
              <span className="tabular font-semibold">{formatScore(score.computed, 2)}/10</span>, promedio ponderado
              sobre {score.measuredCount} de 5 subcriterios, que cubren el {score.weightCovered} % del peso total.
            </>
          )}
        </p>
        {publishedRating != null && publishedRating > 0 && (
          <p>
            Nota editorial publicada en la ficha: <span className="tabular font-semibold text-ink">{formatScore(publishedRating)}/10</span>.
            Cuando difiere de la calculada, es porque parte de los subcriterios aún no tiene medición propia.
          </p>
        )}
        <p>
          Velocidad y disponibilidad se miden con nuestra propia sonda. El TTFB se mide desde {BENCHMARK_REGION}, no
          desde Chile, así que no representa la latencia real de alguien que visita tu sitio desde Chile.{' '}
          {score.measuredAt ? (
            <>
              Última medición: <time dateTime={isoDate(score.measuredAt)}>{formatDataDate(score.measuredAt)}</time>.
            </>
          ) : (
            'Este proveedor todavía no tiene mediciones de nuestra sonda.'
          )}
        </p>
        <p>
          <Link to="/metodologia" className="font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
            Ver la metodología completa
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ScoreBreakdown;

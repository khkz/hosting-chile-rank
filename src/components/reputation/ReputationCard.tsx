import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ShieldAlert, ShieldX, ExternalLink, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCompanyReputation } from '@/hooks/useCompanyReputation';
import { formatDataDate, formatInteger, formatScore, isoDate } from '@/lib/format';

interface ReputationCardProps {
  companyId: string;
  companyName: string;
  /** false cuando la sección que lo contiene ya tiene título. */
  showTitle?: boolean;
}

const severityStyles: Record<string, { icon: typeof ShieldCheck; variant: 'outline' | 'ink'; label: string }> = {
  Baja: { icon: ShieldCheck, variant: 'outline', label: 'Reputación sólida' },
  Media: { icon: ShieldAlert, variant: 'outline', label: 'Reclamos moderados' },
  Alta: { icon: ShieldX, variant: 'ink', label: 'Alerta reputacional' },
};

const Stat: React.FC<{ label: string; value: string; note: string }> = ({ label, value, note }) => (
  <div className="min-w-0 py-4 sm:px-5 sm:first:pl-0">
    <dt className="t-label">{label}</dt>
    <dd className="mt-1">
      <span className="tabular text-2xl font-bold text-ink">{value}</span>
      <span className="mt-0.5 block t-meta">{note}</span>
    </dd>
  </div>
);

export function ReputationCard({ companyId, companyName, showTitle = true }: ReputationCardProps) {
  const { data, isLoading } = useCompanyReputation(companyId);

  if (isLoading) {
    return <p className="t-small text-ink-3">Cargando la reputación de {companyName}…</p>;
  }

  const hasSnapshot = !!data?.last_synced_at;
  const severityInfo = data?.severity ? severityStyles[data.severity] : null;
  const SeverityIcon = severityInfo?.icon ?? Info;
  const reviewsCount = data?.verified_reviews_count ?? 0;

  return (
    <div className="rounded-xl border border-rule bg-white p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          {showTitle && <h3 className="t-h3 text-ink">Reputación</h3>}
          <p className={showTitle ? 'mt-1 t-small text-ink-2' : 't-small text-ink-2'}>
            Qué dicen de {companyName} quienes lo usan: reclamos y reseñas con su fuente.
          </p>
        </div>
        {hasSnapshot && severityInfo && (
          <Badge variant={severityInfo.variant} className="gap-1.5 px-2.5 py-1 text-sm">
            <SeverityIcon className="h-4 w-4" aria-hidden />
            {severityInfo.label}
          </Badge>
        )}
      </div>

      {!hasSnapshot && data && reviewsCount === 0 && data.internal_complaints_12m === 0 ? (
        <div className="mt-5 flex items-start gap-3 rounded-xl bg-paper p-4 t-small text-ink-2">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-ink-2" aria-hidden />
          <div>
            <p className="font-semibold text-ink">Pendiente de auditoría externa</p>
            <p className="mt-1">
              Aún no sincronizamos el análisis automático de Reclamos.cl para este proveedor. Lo mostraremos apenas esté
              disponible. Mientras tanto, puedes revisar nuestra{' '}
              <Link to="/metodologia#reputacion" className="font-semibold text-ink underline underline-offset-4">
                metodología
              </Link>
              .
            </p>
          </div>
        </div>
      ) : (
        <dl className={`mt-4 grid divide-y divide-rule border-t border-rule sm:divide-x sm:divide-y-0 ${hasSnapshot ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
          {hasSnapshot && (
            <Stat
              label="Reclamos.cl"
              value={data?.sentiment_score ? `${formatScore(Number(data.sentiment_score))}/10` : 'sin dato'}
              note="Análisis automático"
            />
          )}
          <Stat
            label="Reclamos verificados"
            value={formatInteger(data?.internal_complaints_12m ?? 0)}
            note={`Últimos 12 meses; ${formatInteger(data?.internal_complaints_high ?? 0)} graves`}
          />
          <Stat
            label="Reseñas verificadas"
            value={data?.verified_reviews_avg ? `${formatScore(Number(data.verified_reviews_avg))}/10` : 'sin dato'}
            note={`${formatInteger(reviewsCount)} ${reviewsCount === 1 ? 'cliente confirmado' : 'clientes confirmados'}`}
          />
        </dl>
      )}

      {data && data.main_complaints.length > 0 && (
        <div className="mt-5">
          <p className="t-label text-ink">Quejas más frecuentes</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 t-small text-ink-2">
            {data.main_complaints.slice(0, 5).map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      )}

      {data && data.sources.length > 0 && (
        <div className="mt-5">
          <p className="t-label text-ink">Fuentes citadas</p>
          <ul className="mt-2 space-y-1 t-small">
            {data.sources.slice(0, 3).map((url) => (
              <li key={url}>
                <a
                  href={url}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="inline-flex min-h-[24px] items-center gap-1 break-all text-ink underline decoration-ink/30 underline-offset-2 hover:decoration-ink"
                >
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 text-ink-2" aria-hidden />
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-3 t-meta">
        <p>
          {data?.last_synced_at ? (
            <>
              Sincronizado el <time dateTime={isoDate(data.last_synced_at)}>{formatDataDate(data.last_synced_at)}</time>
            </>
          ) : (
            'Sin captura externa todavía'
          )}
        </p>
        <Link to="/metodologia#reputacion" className="font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
          Ver criterios de verificación
        </Link>
      </div>
    </div>
  );
}

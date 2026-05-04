import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldCheck, ShieldAlert, ShieldX, ExternalLink, Star, MessageSquare, AlertTriangle, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCompanyReputation } from '@/hooks/useCompanyReputation';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface ReputationCardProps {
  companyId: string;
  companyName: string;
}

const severityStyles: Record<string, { icon: typeof ShieldCheck; cls: string; label: string }> = {
  Baja: { icon: ShieldCheck, cls: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-950 dark:text-green-200', label: 'Reputación sólida' },
  Media: { icon: ShieldAlert, cls: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-200', label: 'Reclamos moderados' },
  Alta: { icon: ShieldX, cls: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-200', label: 'Alerta reputacional' },
};

export function ReputationCard({ companyId, companyName }: ReputationCardProps) {
  const { data, isLoading } = useCompanyReputation(companyId);

  if (isLoading) {
    return <Card className="p-6 animate-pulse h-48 bg-muted/30" />;
  }

  const hasSnapshot = !!data?.last_synced_at;
  const severityInfo = data?.severity ? severityStyles[data.severity] : null;
  const SeverityIcon = severityInfo?.icon ?? Info;

  return (
    <Card className="p-6 border-primary/20">
      <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
        <div>
          <h3 className="text-2xl font-bold mb-1">Reputación verificada</h3>
          <p className="text-sm text-muted-foreground">
            Cómo perciben los usuarios reales a {companyName}
          </p>
        </div>
        {hasSnapshot && severityInfo && (
          <Badge variant="outline" className={`${severityInfo.cls} gap-1 text-sm py-1.5 px-3`}>
            <SeverityIcon className="w-4 h-4" />
            {severityInfo.label}
          </Badge>
        )}
      </div>

      {!hasSnapshot && data && data.verified_reviews_count === 0 && data.internal_complaints_12m === 0 ? (
        <div className="rounded-md bg-muted/40 p-4 text-sm">
          <div className="flex gap-2 items-start">
            <Info className="w-4 h-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="font-medium">Pendiente de auditoría externa</p>
              <p className="text-muted-foreground">
                Aún no hemos sincronizado el análisis automático de Reclamos.cl para este proveedor. Mostraremos los datos en cuanto estén disponibles. Mientras tanto puedes consultar nuestra{' '}
                <Link to="/metodologia#reputacion" className="underline">metodología</Link>.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          {hasSnapshot && (
            <div className="rounded-md border p-3">
              <div className="text-xs uppercase text-muted-foreground mb-1 flex items-center gap-1">
                <ExternalLink className="w-3 h-3" /> Reclamos.cl
              </div>
              <div className="text-2xl font-bold">
                {data?.sentiment_score ? `${Number(data.sentiment_score).toFixed(1)}/10` : '—'}
              </div>
              <div className="text-xs text-muted-foreground">Análisis automático</div>
            </div>
          )}
          <div className="rounded-md border p-3">
            <div className="text-xs uppercase text-muted-foreground mb-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Reclamos verificados
            </div>
            <div className="text-2xl font-bold">{data?.internal_complaints_12m ?? 0}</div>
            <div className="text-xs text-muted-foreground">
              Últimos 12 meses · {data?.internal_complaints_high ?? 0} graves
            </div>
          </div>
          <div className="rounded-md border p-3">
            <div className="text-xs uppercase text-muted-foreground mb-1 flex items-center gap-1">
              <Star className="w-3 h-3" /> Reseñas verificadas
            </div>
            <div className="text-2xl font-bold">
              {data?.verified_reviews_avg ? `${Number(data.verified_reviews_avg).toFixed(1)}/10` : '—'}
            </div>
            <div className="text-xs text-muted-foreground">
              {data?.verified_reviews_count ?? 0} clientes confirmados
            </div>
          </div>
        </div>
      )}

      {data && data.main_complaints.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-semibold mb-2 flex items-center gap-1">
            <MessageSquare className="w-4 h-4" /> Quejas más frecuentes
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            {data.main_complaints.slice(0, 5).map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      )}

      {data && data.sources.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold mb-2 uppercase text-muted-foreground">Fuentes citadas</p>
          <ul className="text-sm space-y-1">
            {data.sources.slice(0, 3).map((url) => (
              <li key={url}>
                <a
                  href={url}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="text-primary underline break-all inline-flex items-center gap-1 min-h-[24px]"
                >
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground border-t pt-3">
        <div>
          {data?.last_synced_at ? (
            <>Actualizado {formatDistanceToNow(new Date(data.last_synced_at), { addSuffix: true, locale: es })}</>
          ) : (
            <>Sin snapshot externo todavía</>
          )}
        </div>
        <Button asChild variant="link" size="sm" className="h-auto p-0 text-xs">
          <Link to="/metodologia#reputacion">Ver criterios de verificación</Link>
        </Button>
      </div>
    </Card>
  );
}

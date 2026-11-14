import React from 'react';
import { CheckCircle2, ExternalLink, ThumbsUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDataDate, formatInteger, isoDate } from '@/lib/format';
import { CATEGORIES } from './categorias';

/** Fila de la vista pública de reclamos (public_complaints_public). */
export interface PublicComplaint {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: number;
  status: string;
  created_at: string;
  evidence_url?: string | null;
  provider_response?: string | null;
  votes_count: number;
  hosting_companies?: { name: string; slug: string } | null;
}

/** Un reclamo verificado: título, proveedor, fecha de envío, severidad, respuesta y voto «Me pasó lo mismo». */
const ReclamoCard: React.FC<{ c: PublicComplaint; onVote: (id: string) => void }> = ({ c, onVote }) => (
  <article className="rounded-xl border border-rule bg-white p-5 md:p-6">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h3 className="t-h3 text-ink">{c.title}</h3>
        <p className="t-meta mt-1 flex flex-wrap gap-x-4 gap-y-1">
          <span>
            Sobre <strong className="font-semibold text-ink-2">{c.hosting_companies?.name}</strong>
          </span>
          <span>
            Enviado el <time dateTime={isoDate(c.created_at)}>{formatDataDate(c.created_at)}</time>
          </span>
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge variant={c.severity >= 4 ? 'ink' : 'secondary'}>Severidad {c.severity} de 5</Badge>
        <Badge variant="outline">{CATEGORIES.find((x) => x.value === c.category)?.label}</Badge>
        {c.status === 'resolved' && (
          <Badge variant="outline">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
            Resuelto
          </Badge>
        )}
      </div>
    </div>
    <p className="t-body mt-3 whitespace-pre-wrap text-ink-2">{c.description}</p>
    {c.evidence_url && (
      <a
        href={c.evidence_url}
        target="_blank"
        rel="nofollow noopener"
        className="mt-2 inline-flex min-h-11 items-center gap-1.5 rounded-sm text-sm font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
      >
        Ver evidencia
        <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        <span className="sr-only">(se abre en otra pestaña)</span>
      </a>
    )}
    {c.provider_response && (
      <div className="mt-4 rounded-lg border-l-4 border-l-ink bg-paper px-4 py-3">
        <p className="t-label text-ink">Respuesta del proveedor</p>
        <p className="t-small mt-1 text-ink-2">{c.provider_response}</p>
      </div>
    )}
    <div className="mt-4 border-t border-rule pt-2">
      <Button variant="ghost" onClick={() => onVote(c.id)} className="-ml-3 px-3 font-medium">
        <ThumbsUp aria-hidden /> Me pasó lo mismo ({formatInteger(c.votes_count)})
      </Button>
    </div>
    {/* Schema.org Review */}
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Review',
      'itemReviewed': { '@type': 'Organization', 'name': c.hosting_companies?.name },
      'reviewBody': c.description,
      'reviewRating': { '@type': 'Rating', 'ratingValue': 6 - c.severity, 'bestRating': 5, 'worstRating': 1 },
      'datePublished': c.created_at,
      'name': c.title,
    })}} />
  </article>
);

export default ReclamoCard;

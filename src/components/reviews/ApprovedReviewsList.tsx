import { useApprovedReviews } from '@/components/ficha/providerQueries';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatShortDate, isoDate } from '@/lib/format';

interface ApprovedReviewsListProps {
  providerSlug: string;
}

export function ApprovedReviewsList({ providerSlug }: ApprovedReviewsListProps) {
  const { data, isLoading } = useApprovedReviews(providerSlug);

  if (isLoading) return <p className="t-small text-ink-3">Cargando reseñas…</p>;
  if (!data || data.length === 0) {
    return (
      <p className="t-small text-ink-2">
        Todavía no hay reseñas publicadas de este proveedor. Si lo usas, cuéntanos cómo te ha ido: tu reseña ayuda a quien está
        por decidir.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-rule border-y border-rule">
      {data.map((r) => (
        <li key={r.id} className="py-4">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex" role="img" aria-label={`${r.rating} de 5 estrellas`}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    aria-hidden
                    className={cn('h-4 w-4', n <= r.rating ? 'fill-ink text-ink' : 'text-rule')}
                  />
                ))}
              </span>
              <span className="t-small font-semibold text-ink">{r.author_name}</span>
            </div>
            <time dateTime={isoDate(r.created_at)} className="t-meta">
              {formatShortDate(r.created_at)}
            </time>
          </div>
          <p className="whitespace-pre-wrap t-small text-ink">{r.comment}</p>
        </li>
      ))}
    </ul>
  );
}

export default ApprovedReviewsList;

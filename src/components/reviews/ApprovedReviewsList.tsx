import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface ApprovedReviewsListProps {
  providerSlug: string;
}

export function ApprovedReviewsList({ providerSlug }: ApprovedReviewsListProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['public-reviews-v2', providerSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('id, author_name, rating, comment, created_at')
        .eq('provider_slug', providerSlug)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
  });

  if (isLoading) return <p className="text-muted-foreground text-sm">Cargando reseñas...</p>;
  if (!data || data.length === 0) {
    return <p className="text-muted-foreground text-sm">Aún no hay reseñas aprobadas. ¡Sé el primero!</p>;
  }

  return (
    <ul className="space-y-4">
      {data.map((r) => (
        <li key={r.id} className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="flex" aria-label={`${r.rating} de 5 estrellas`}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={cn(
                      'w-4 h-4',
                      n <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/40'
                    )}
                  />
                ))}
              </div>
              <span className="font-semibold text-sm">{r.author_name}</span>
            </div>
            <time className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(r.created_at), { addSuffix: true, locale: es })}
            </time>
          </div>
          <p className="text-sm text-foreground/90 whitespace-pre-wrap">{r.comment}</p>
        </li>
      ))}
    </ul>
  );
}

export default ApprovedReviewsList;

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ReviewStats {
  avg: number;
  count: number;
}

/**
 * Aggregates approved reviews from the public `reviews` table per provider_slug.
 * Returns a map slug -> { avg, count }.
 */
export function useReviewStats(slugs?: string[]) {
  return useQuery({
    queryKey: ['review-stats', slugs?.slice().sort().join(',') ?? 'all'],
    queryFn: async () => {
      let q = supabase
        .from('reviews')
        .select('provider_slug, rating')
        .eq('status', 'approved');
      if (slugs && slugs.length > 0) q = q.in('provider_slug', slugs);
      const { data, error } = await q;
      if (error) throw error;
      const map = new Map<string, { sum: number; count: number }>();
      for (const r of data ?? []) {
        const cur = map.get(r.provider_slug) ?? { sum: 0, count: 0 };
        cur.sum += r.rating;
        cur.count += 1;
        map.set(r.provider_slug, cur);
      }
      const out: Record<string, ReviewStats> = {};
      map.forEach((v, k) => {
        out[k] = { avg: v.sum / v.count, count: v.count };
      });
      return out;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useReviewStatsForSlug(slug?: string) {
  return useQuery({
    queryKey: ['review-stats-slug', slug],
    enabled: !!slug,
    queryFn: async (): Promise<ReviewStats> => {
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('provider_slug', slug!)
        .eq('status', 'approved');
      if (error) throw error;
      const count = data?.length ?? 0;
      const avg = count > 0 ? data!.reduce((a, b) => a + b.rating, 0) / count : 0;
      return { avg, count };
    },
  });
}

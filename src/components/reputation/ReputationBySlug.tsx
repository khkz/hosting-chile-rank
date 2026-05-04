import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ReputationCard } from './ReputationCard';
import { Card } from '@/components/ui/card';

interface Props {
  slug: string;
  fallbackName: string;
}

/**
 * Resolves a hosting company by slug (or close match) and renders its ReputationCard.
 * Hidden if no verified+curated provider matches.
 */
export function ReputationBySlug({ slug, fallbackName }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ['company-by-slug', slug, fallbackName],
    queryFn: async () => {
      const { data: bySlug } = await supabase
        .from('hosting_companies')
        .select('id, name')
        .eq('slug', slug)
        .eq('is_verified', true)
        .eq('is_curated', true)
        .maybeSingle();
      if (bySlug) return bySlug;
      const { data: byName } = await supabase
        .from('hosting_companies')
        .select('id, name')
        .ilike('name', `%${fallbackName}%`)
        .eq('is_verified', true)
        .eq('is_curated', true)
        .maybeSingle();
      return byName ?? null;
    },
  });

  if (isLoading) return <Card className="p-6 h-32 animate-pulse bg-muted/30" />;
  if (!data) return null;
  return <ReputationCard companyId={data.id} companyName={data.name} />;
}

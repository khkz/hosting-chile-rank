import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import MedalBadge from '@/components/MedalBadge';
import { Badge } from '@/components/ui/badge';

interface CertificationBadgesProps {
  companySlug: string;
  variant?: 'horizontal' | 'grid';
  size?: 'small' | 'medium' | 'large';
}

interface CertificationRow {
  id: string;
  position: number;
  tier: string | null;
  certification_categories: { name: string; icon: string | null; slug: string } | null;
}

export default function CertificationBadges({ companySlug, size = 'small' }: CertificationBadgesProps) {
  const { data: certifications, isLoading } = useQuery({
    queryKey: ['company-certifications', companySlug],
    queryFn: async () => {
      // Primero la empresa por slug
      const { data: company } = await supabase
        .from('hosting_companies')
        .select('id')
        .eq('slug', companySlug)
        .single();

      if (!company) return [];

      // Luego sus certificaciones vigentes
      const { data } = await supabase
        .from('company_certifications')
        .select(`
          id,
          position,
          tier,
          certification_categories (name, icon, slug)
        `)
        .eq('company_id', company.id)
        .eq('status', 'active')
        .order('position');

      return (data || []) as unknown as CertificationRow[];
    },
  });

  if (isLoading || !certifications || certifications.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="t-h3 text-ink">Certificaciones</h3>
      <ul className="mt-3 flex flex-wrap gap-2.5">
        {certifications.map((cert) =>
          cert.certification_categories ? (
            <li key={cert.id} className="flex items-center gap-2">
              <MedalBadge position={cert.position} categoryName={cert.certification_categories.name} size={size === 'large' ? 'medium' : 'small'} />
              {cert.tier === 'premium' && <Badge variant="outline">Premium</Badge>}
            </li>
          ) : null,
        )}
      </ul>
    </div>
  );
}

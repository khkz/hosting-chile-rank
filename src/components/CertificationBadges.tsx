import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Award } from 'lucide-react';
import MedalBadge from '@/components/MedalBadge';

interface CertificationBadgesProps {
  companySlug: string;
  variant?: 'horizontal' | 'grid';
  size?: 'small' | 'medium' | 'large';
}

export default function CertificationBadges({ 
  companySlug, 
  variant = 'horizontal',
  size = 'medium' 
}: CertificationBadgesProps) {
  const { data: certifications, isLoading } = useQuery({
    queryKey: ['company-certifications', companySlug],
    queryFn: async () => {
      // First get company by slug
      const { data: company } = await supabase
        .from('hosting_companies')
        .select('id')
        .eq('slug', companySlug)
        .single();

      if (!company) return [];

      // Then get certifications
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

      return data || [];
    },
  });

  if (isLoading || !certifications || certifications.length === 0) {
    return null;
  }

  return (
    <div className="my-3">
      <div className="flex items-center gap-1 mb-2">
        <Award className="w-3 h-3 text-primary" />
        <h3 className="font-semibold text-xs">Certificaciones 2025</h3>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {certifications.map((cert: any) => {
          return (
            <div
              key={cert.id}
              className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity duration-200"
            >
              <MedalBadge
                position={cert.position}
                categoryName={cert.certification_categories.name}
                size="small"
                className="flex-shrink-0"
              />
              
              {cert.tier === 'premium' && (
                <span className="inline-block text-[8px] bg-purple-600 text-white px-1.5 py-0.5 rounded font-medium">
                  Premium
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

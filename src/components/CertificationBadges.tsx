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

  const getPodiumColor = (position: number) => {
    switch (position) {
      case 1: return { 
        bg: 'bg-gradient-to-br from-yellow-400 to-yellow-600', 
        border: 'border-yellow-500', 
        text: 'text-yellow-900',
        shadow: 'shadow-lg shadow-yellow-500/50'
      };
      case 2: return { 
        bg: 'bg-gradient-to-br from-gray-300 to-gray-500', 
        border: 'border-gray-400', 
        text: 'text-gray-900',
        shadow: 'shadow-lg shadow-gray-500/50'
      };
      case 3: return { 
        bg: 'bg-gradient-to-br from-orange-400 to-orange-600', 
        border: 'border-orange-500', 
        text: 'text-orange-900',
        shadow: 'shadow-lg shadow-orange-500/50'
      };
      default: return { 
        bg: 'bg-gradient-to-br from-blue-400 to-blue-600', 
        border: 'border-blue-500', 
        text: 'text-blue-900',
        shadow: 'shadow-lg shadow-blue-500/50'
      };
    }
  };

  return (
    <div className="my-4">
      <div className="flex items-center gap-1.5 mb-3">
        <Award className="w-3.5 h-3.5 text-primary" />
        <h3 className="font-semibold text-sm">Certificaciones 2025</h3>
      </div>
      
      <div className="flex flex-col gap-2">
        {certifications.map((cert: any) => {
          const colors = getPodiumColor(cert.position);
          
          return (
            <div
              key={cert.id}
              className={`${colors.bg} ${colors.border} border rounded-md px-2.5 py-2 flex items-center gap-2 hover:scale-[1.02] transition-all duration-200 ${colors.shadow}`}
            >
              {/* Medal Badge primero - más pequeño */}
              <MedalBadge
                position={cert.position}
                categoryName={cert.certification_categories.name}
                categoryIcon={cert.certification_categories.icon}
                size="small"
                className="flex-shrink-0 w-8 h-8"
              />
              
              <div className="flex-1 min-w-0">
                <div className={`font-semibold ${colors.text} text-xs leading-tight flex items-center gap-1.5`}>
                  <span className="text-[10px] opacity-80">#{cert.position}</span>
                  <span className="truncate">{cert.certification_categories.name}</span>
                </div>
                {cert.tier === 'premium' && (
                  <span className="inline-block mt-0.5 text-[9px] bg-purple-600 text-white px-1 py-0.5 rounded font-medium">
                    Premium
                  </span>
                )}
              </div>
              
              <div className="text-base flex-shrink-0 opacity-80">{cert.certification_categories.icon}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

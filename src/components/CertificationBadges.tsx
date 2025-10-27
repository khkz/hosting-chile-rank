import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Award } from 'lucide-react';

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

  const getBadgeUrl = (certId: string, badgeSize: string) => {
    return `https://oegvwjxrlmtwortyhsrv.supabase.co/functions/v1/badge-generator?id=${certId}&size=${badgeSize}`;
  };

  const getPodiumColor = (position: number) => {
    switch (position) {
      case 1: return { bg: 'bg-yellow-50', border: 'border-yellow-400', text: 'text-yellow-700' };
      case 2: return { bg: 'bg-gray-50', border: 'border-gray-400', text: 'text-gray-700' };
      case 3: return { bg: 'bg-orange-50', border: 'border-orange-400', text: 'text-orange-700' };
      default: return { bg: 'bg-blue-50', border: 'border-blue-400', text: 'text-blue-700' };
    }
  };

  const sizeClasses = {
    small: 'h-8',
    medium: 'h-12',
    large: 'h-16',
  };

  return (
    <div className="my-6">
      <div className="flex items-center gap-2 mb-3">
        <Award className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-lg">Certificaciones 2025</h3>
      </div>
      
      <div className={variant === 'grid' ? 'grid grid-cols-2 gap-3' : 'flex flex-wrap gap-3'}>
        {certifications.map((cert: any) => {
          const colors = getPodiumColor(cert.position);
          
          return (
            <div
              key={cert.id}
              className={`${colors.bg} ${colors.border} border-2 rounded-lg p-3 flex items-center gap-3 hover:scale-105 transition-transform`}
            >
              <div className="text-2xl">{cert.certification_categories.icon}</div>
              <div className="flex-1">
                <div className={`font-bold ${colors.text} text-sm`}>
                  #{cert.position} {cert.certification_categories.name}
                </div>
                {cert.tier === 'premium' && (
                  <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">
                    ✨ Premium
                  </span>
                )}
              </div>
              
              {/* Live badge image */}
              <img
                src={getBadgeUrl(cert.id, size)}
                alt={`Badge ${cert.certification_categories.name}`}
                className={`${sizeClasses[size]} object-contain`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

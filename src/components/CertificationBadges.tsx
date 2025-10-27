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

  const getPodiumColor = (position: number) => {
    switch (position) {
      case 1: return { 
        bg: 'bg-gradient-to-br from-yellow-400 to-yellow-600', 
        border: 'border-yellow-500', 
        text: 'text-yellow-900',
        badgeBg: 'bg-gradient-to-br from-yellow-300 to-amber-500',
        shadow: 'shadow-lg shadow-yellow-500/50'
      };
      case 2: return { 
        bg: 'bg-gradient-to-br from-gray-300 to-gray-500', 
        border: 'border-gray-400', 
        text: 'text-gray-900',
        badgeBg: 'bg-gradient-to-br from-gray-200 to-slate-400',
        shadow: 'shadow-lg shadow-gray-500/50'
      };
      case 3: return { 
        bg: 'bg-gradient-to-br from-orange-400 to-orange-600', 
        border: 'border-orange-500', 
        text: 'text-orange-900',
        badgeBg: 'bg-gradient-to-br from-orange-300 to-amber-600',
        shadow: 'shadow-lg shadow-orange-500/50'
      };
      default: return { 
        bg: 'bg-gradient-to-br from-blue-400 to-blue-600', 
        border: 'border-blue-500', 
        text: 'text-blue-900',
        badgeBg: 'bg-gradient-to-br from-blue-300 to-indigo-500',
        shadow: 'shadow-lg shadow-blue-500/50'
      };
    }
  };

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-20 h-20',
    large: 'w-24 h-24',
  };

  return (
    <div className="my-6">
      <div className="flex items-center gap-2 mb-3">
        <Award className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-lg">Certificaciones 2025</h3>
      </div>
      
      <div className={variant === 'grid' ? 'grid grid-cols-2 gap-4' : 'flex flex-wrap gap-4'}>
        {certifications.map((cert: any) => {
          const colors = getPodiumColor(cert.position);
          
          return (
            <div
              key={cert.id}
              className={`${colors.bg} ${colors.border} border-2 rounded-xl p-4 flex items-center gap-4 hover:scale-105 transition-all duration-300 ${colors.shadow}`}
            >
              <div className="text-3xl">{cert.certification_categories.icon}</div>
              <div className="flex-1">
                <div className={`font-bold ${colors.text} text-base mb-1`}>
                  #{cert.position} {cert.certification_categories.name}
                </div>
                <div className="text-xs text-gray-700">Certificación 2025</div>
                {cert.tier === 'premium' && (
                  <span className="inline-block mt-1 text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">
                    ✨ Premium
                  </span>
                )}
              </div>
              
              {/* Badge with CSS design */}
              <div className={`${sizeClasses[size]} flex-shrink-0 ${colors.badgeBg} ${colors.shadow} rounded-full flex items-center justify-center border-4 ${colors.border} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
                <div className="relative z-10 text-center">
                  <div className="font-black text-white text-xs drop-shadow-lg">
                    #{cert.position}
                  </div>
                  <div className="font-bold text-white text-[8px] leading-tight drop-shadow-md mt-0.5">
                    2025
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

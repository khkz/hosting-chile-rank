
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const StatsTicker = () => {
  const { data: domainCount } = useQuery({
    queryKey: ['stats-domain-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('domains')
        .select('*', { count: 'exact', head: true });
      return count ?? 0;
    },
    staleTime: 1000 * 60 * 30,
  });

  const { data: companyCount } = useQuery({
    queryKey: ['stats-company-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('hosting_companies')
        .select('*', { count: 'exact', head: true })
        .eq('is_verified', true);
      return count ?? 0;
    },
    staleTime: 1000 * 60 * 30,
  });

  const formatNumber = (n: number) => {
    if (n >= 1000) {
      const rounded = Math.floor(n / 100) * 100;
      return `${rounded.toLocaleString('es-CL')}+`;
    }
    return n.toString();
  };

  const stats = [
    { value: domainCount != null ? formatNumber(domainCount) : '...', label: "Dominios .CL analizados" },
    { value: companyCount != null ? `${companyCount}` : '...', label: "Proveedores verificados" },
    { value: "99.9%", label: "Uptime garantizado" },
    { value: "24/7", label: "Soporte en español" }
  ];
  
  return (
    <section className="bg-gray-50 border-y border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsTicker;

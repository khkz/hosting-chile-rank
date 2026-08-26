import React from 'react';
import { useSiteStats, formatStatNumber } from '@/hooks/useSiteStats';

const StatsTicker = () => {
  const { domainCount, companyCount } = useSiteStats();

  const stats = [
    { value: domainCount != null ? formatStatNumber(domainCount) : '...', label: "Dominios .CL analizados" },
    { value: companyCount != null ? `${companyCount}` : '...', label: "Proveedores en el directorio" },
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

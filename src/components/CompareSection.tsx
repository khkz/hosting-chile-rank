
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getHostingCompanyBySlug } from '@/data/hostingCompanies';

// List of top providers to compare with HostingPlus
const topProviders = [
  'ecohosting',
  'bluehost',
  'hostgator',
  'godaddy',
  'planetahosting',
  'hostingcl'
];

const CompareSection = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-[#2B2D42] mb-3">
          Comparativas detalladas
        </h2>
        <p className="text-lg text-center text-[#555] mb-10 max-w-3xl mx-auto">
          Analizamos los principales proveedores de hosting en Chile para ayudarte a elegir la mejor opción
        </p>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {topProviders.map(slug => {
            const provider = getHostingCompanyBySlug(slug);
            if (!provider) return null;
            
            return (
              <Card key={slug} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-40 h-12">
                      <img 
                        src={provider.logo} 
                        alt={`${provider.name} logo`} 
                        className="h-full object-contain"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-medium mb-3">
                    HostingPlus vs {provider.name}
                  </h3>
                  
                  <p className="text-sm text-[#555] mb-6">
                    ¿Cuál ofrece mejor velocidad y soporte? Comparamos en detalle ambos proveedores.
                  </p>
                  
                  <Button asChild variant="outline" className="w-full">
                    <Link to={`/comparativa/hostingplus-vs/${provider.id}`}>
                      Ver comparativa
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center mt-10">
          <Button asChild>
            <Link to="/comparativa">
              Ver todas las comparativas
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CompareSection;


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Award, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import DynamicMetaTags from '@/components/SEO/DynamicMetaTags';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';

const CatalogoPage = () => {
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'name'>('rating');

  // Fetch all hosting companies from Supabase
  const { data: companies, isLoading } = useQuery({
    queryKey: ['hosting-companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hosting_companies')
        .select(`
          *,
          hosting_plans(*)
        `)
        .eq('is_verified', true)
        .order('overall_rating', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Sort companies based on selected option
  const sortedCompanies = React.useMemo(() => {
    if (!companies) return [];
    
    const sorted = [...companies];
    switch (sortBy) {
      case 'rating':
        return sorted.sort((a, b) => (b.overall_rating || 0) - (a.overall_rating || 0));
      case 'price':
        return sorted.sort((a, b) => {
          const minPriceA = Math.min(...(a.hosting_plans?.map((p: any) => p.price_monthly) || [Infinity]));
          const minPriceB = Math.min(...(b.hosting_plans?.map((p: any) => p.price_monthly) || [Infinity]));
          return minPriceA - minPriceB;
        });
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  }, [companies, sortBy]);
  
  return (
    <>
      <DynamicMetaTags
        title="Catálogo Hosting Chile 2025 - Todos los Proveedores Verificados"
        description="Directorio completo de proveedores de hosting en Chile. Información detallada, planes actualizados, precios y datos de contacto de las mejores empresas de hosting."
        canonical="https://eligetuhosting.cl/catalogo"
        keywords="hosting chile, proveedores hosting, catálogo hosting, hosting verificado, mejor hosting chile"
      />
    
      <Navbar />
      
      <div className="container mx-auto px-4 pt-8">
        <SEOBreadcrumbs 
          items={[
            { name: 'Catálogo', href: '/catalogo' }
          ]}
        />
      </div>
      
      {/* Hero section */}
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Mejor Hosting Chile 2025
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Catálogo completo con {companies?.length || 0} proveedores verificados. 
            Compara planes, precios y características actualizadas.
          </p>
          
          {/* Sort options */}
          <div className="mt-8 flex justify-center gap-3 flex-wrap">
            <Button
              variant={sortBy === 'rating' ? 'default' : 'outline'}
              onClick={() => setSortBy('rating')}
              size="sm"
            >
              <Star className="h-4 w-4 mr-2" />
              Por Rating
            </Button>
            <Button
              variant={sortBy === 'price' ? 'default' : 'outline'}
              onClick={() => setSortBy('price')}
              size="sm"
            >
              💰 Por Precio
            </Button>
            <Button
              variant={sortBy === 'name' ? 'default' : 'outline'}
              onClick={() => setSortBy('name')}
              size="sm"
            >
              🔤 Alfabético
            </Button>
          </div>
        </div>
      </section>
      
      {/* Catalog section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Cargando empresas...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCompanies.map((company: any) => {
                const minPrice = company.hosting_plans && company.hosting_plans.length > 0
                  ? Math.min(...company.hosting_plans.map((p: any) => p.price_monthly))
                  : null;

                return (
                  <Card key={company.id} className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                    <div className="h-32 flex items-center justify-center p-4 bg-muted">
                      <img 
                        src={company.logo_url} 
                        alt={`Logo de ${company.name}`} 
                        className="max-h-20 w-auto object-contain"
                        loading="lazy"
                      />
                    </div>
                    <CardContent className="flex-grow pt-6">
                      <div className="flex items-start justify-between mb-2">
                        <h2 className="text-xl font-semibold">{company.name}</h2>
                        {company.is_verified && (
                          <Badge variant="secondary" className="gap-1 ml-2">
                            <Award className="h-3 w-3" />
                            ✓
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm font-medium">
                          <Star className="h-3 w-3 fill-current" />
                          {company.overall_rating?.toFixed(1) || 'N/A'}/10
                        </div>
                        {company.year_founded && (
                          <div className="text-xs text-muted-foreground">
                            Desde {company.year_founded}
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {company.description}
                      </p>
                      
                      <div className="space-y-2 text-sm">
                        {company.datacenter_location && (
                          <div className="flex items-start gap-2">
                            <span className="font-medium min-w-[80px]">Datacenter:</span>
                            <span className="text-muted-foreground">{company.datacenter_location}</span>
                          </div>
                        )}
                        {minPrice && (
                          <div className="flex items-start gap-2">
                            <span className="font-medium min-w-[80px]">Desde:</span>
                            <span className="text-primary font-semibold">
                              ${minPrice.toLocaleString('es-CL')}/mes
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/50 flex flex-col sm:flex-row gap-3 p-4">
                      <Button asChild size="sm" className="w-full sm:w-auto">
                        <Link to={`/catalogo/${company.slug}`}>
                          Ver Detalles
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="w-full sm:w-auto gap-1">
                        <a href={company.website} target="_blank" rel="noopener noreferrer">
                          Sitio Web <ExternalLink size={14} />
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
      
      {/* Why choose section */}
      <section className="py-12 bg-[#F7F9FC]">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold mb-6 text-center">¿Por qué elegir un hosting chileno?</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Mejor velocidad para usuarios locales</h3>
              <p className="text-gray-600">
                Los servidores ubicados en Chile ofrecen tiempos de respuesta más rápidos para 
                visitantes locales, mejorando la experiencia del usuario y el SEO para búsquedas 
                desde Chile.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Soporte técnico en español</h3>
              <p className="text-gray-600">
                Contar con atención al cliente en tu idioma y en tu zona horaria facilita 
                la resolución de problemas técnicos y mejora la comunicación con tu proveedor.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3">IP local para SEO</h3>
              <p className="text-gray-600">
                Una dirección IP chilena puede mejorar el posicionamiento en buscadores para 
                las búsquedas realizadas desde Chile, especialmente para negocios locales.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Facturación local</h3>
              <p className="text-gray-600">
                La facturación en pesos chilenos y la posibilidad de emitir documentos tributarios 
                locales simplifican la contabilidad para empresas y emprendedores del país.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <StickyCTA />
      <Footer />
    </>
  );
};

export default CatalogoPage;

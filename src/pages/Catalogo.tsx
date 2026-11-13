
import React from 'react';
import { formatCorporateGroup } from '@/lib/formatGroup';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Award, Search, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getActiveCountryCode } from '@/lib/country';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import DynamicMetaTags from '@/components/SEO/DynamicMetaTags';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import TechnicalGlossary from '@/components/TechnicalGlossary';
import RelatedContent from '@/components/RelatedContent';
import LogoTile from '@/components/LogoTile';
import { useReviewStats } from '@/hooks/useReviewStats';
import { getProviderLink, filterVisibleProviders } from '@/lib/providerLinks';

const CURRENT_YEAR = new Date().getFullYear();

const CatalogoPage = () => {
  // Orden y búsqueda viven en la URL: se conservan al volver de una ficha y al compartir el enlace.
  const [params, setParams] = useSearchParams();
  const sortBy: 'rating' | 'name' = params.get('orden') === 'nombre' ? 'name' : 'rating';
  const query = params.get('q') ?? '';
  const updateParam = (key: string, value: string | null) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true }
    );

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
        .eq('country', getActiveCountryCode())
        .eq('is_verified', true)
        .order('overall_rating', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Orden: por nota (sin nota, al final y de la A a la Z) o de la A a la Z sobre la lista completa.
  const visibleCompanies = React.useMemo(() => (companies ? filterVisibleProviders([...companies]) : []), [companies]);
  const sortedCompanies = React.useMemo(() => {
    const byName = (a: any, b: any) => a.name.localeCompare(b.name, 'es');
    if (sortBy === 'name') return [...visibleCompanies].sort(byName);
    const hasRating = (c: any) => (c.overall_rating ?? 0) > 0;
    return [
      ...visibleCompanies.filter(hasRating).sort((a: any, b: any) => (b.overall_rating || 0) - (a.overall_rating || 0)),
      ...visibleCompanies.filter((c: any) => !hasRating(c)).sort(byName),
    ];
  }, [visibleCompanies, sortBy]);

  const normalized = (v: unknown) =>
    String(v ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  const shownCompanies = React.useMemo(() => {
    const q = normalized(query.trim());
    if (!q) return sortedCompanies;
    return sortedCompanies.filter((c: any) =>
      [c.name, c.legal_name, c.slug, c.website].some((field) => normalized(field).includes(q))
    );
  }, [sortedCompanies, query]);

  const { data: reviewStats } = useReviewStats(sortedCompanies.map((c) => c.slug));
  
  return (
    <>
      <DynamicMetaTags
        title={`Catálogo Hosting Chile ${CURRENT_YEAR} | Proveedores Verificados`}
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
      
      {/* Encabezado: nombre de la sección, búsqueda y orden */}
      <section className="border-b border-rule bg-paper py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-ink md:text-5xl">Proveedores de hosting en Chile</h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-2">
            {visibleCompanies.length ? `${visibleCompanies.length} proveedores verificados` : 'Proveedores verificados'},
            con datacenter, antigüedad, tecnologías y reputación de cada uno.
          </p>

          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="w-full max-w-md">
              <label htmlFor="buscar-proveedor" className="mb-1.5 block text-sm font-medium text-ink">
                Buscar proveedor
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" aria-hidden />
                <input
                  id="buscar-proveedor"
                  type="search"
                  value={query}
                  onChange={(e) => updateParam('q', e.target.value || null)}
                  placeholder="Nombre o razón social"
                  className="h-11 w-full rounded-md border border-ink/25 bg-white pl-9 pr-3 text-base text-ink placeholder:text-ink-3 focus:outline-none focus:ring-2 focus:ring-ink/30"
                />
              </div>
            </div>
            <div role="group" aria-label="Ordenar proveedores" className="flex items-center gap-2">
              <span className="text-sm text-ink-2">Ordenar:</span>
              <Button
                variant={sortBy === 'rating' ? 'default' : 'outline'}
                onClick={() => updateParam('orden', null)}
                size="sm"
                aria-pressed={sortBy === 'rating'}
              >
                Por nota editorial
              </Button>
              <Button
                variant={sortBy === 'name' ? 'default' : 'outline'}
                onClick={() => updateParam('orden', 'nombre')}
                size="sm"
                aria-pressed={sortBy === 'name'}
              >
                De la A a la Z
              </Button>
            </div>
          </div>
          <p className="mt-4 text-sm text-ink-3" aria-live="polite">
            {isLoading ? 'Cargando…' : `Mostrando ${shownCompanies.length} de ${visibleCompanies.length}`}
          </p>
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
            shownCompanies.length === 0 ? (
              <div className="mx-auto max-w-md rounded-md border border-rule bg-paper p-6 text-center text-ink-2">
                <p>Ningún proveedor coincide con «{query}».</p>
                <button
                  type="button"
                  onClick={() => updateParam('q', null)}
                  className="mt-3 inline-flex min-h-[40px] items-center rounded-md border border-ink/25 bg-white px-4 font-semibold text-ink hover:border-ink"
                >
                  Borrar búsqueda
                </button>
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shownCompanies.map((company: any) => {
                const minPrice = company.hosting_plans && company.hosting_plans.length > 0
                  ? Math.min(...company.hosting_plans.map((p: any) => p.price_monthly))
                  : null;

                return (
                  <Card key={company.id} className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                    {company.logo_url && (
                      <LogoTile
                        name={company.name}
                        logoUrl={company.logo_url}
                        className="h-32 border-b"
                        maxLogoHeight={56}
                      />
                    )}

                    <CardContent className="flex-grow pt-6">
                      <div className="flex items-start justify-between mb-2">
                        <h2 className="text-xl font-semibold">{company.name}</h2>
                        <div className="flex gap-1 ml-2">
                          {company.is_curated && company.is_verified && (
                            <Badge className="bg-green-100 text-green-800 text-[10px] gap-0.5">
                              <Award className="h-3 w-3" />
                              Verificado
                            </Badge>
                          )}
                          {company.corporate_group && (
                            <Badge variant="outline" className="text-[10px]">
                              {formatCorporateGroup(company.corporate_group)}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm font-medium">
                          {(company.overall_rating ?? 0) > 0 ? (
                            <>
                              <Star className="h-3 w-3 fill-current" />
                              {company.overall_rating.toFixed(1)}/10
                            </>
                          ) : (
                            <span className="text-xs">Datos verificables</span>
                          )}
                        </div>
                        {reviewStats?.[company.slug] && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium text-foreground">
                              {reviewStats[company.slug].avg.toFixed(1)}
                            </span>
                            · {reviewStats[company.slug].count} reseña{reviewStats[company.slug].count === 1 ? '' : 's'}
                          </div>
                        )}
                        {company.year_founded && (
                          <div className="text-xs text-muted-foreground">
                            Desde {company.year_founded}
                          </div>
                        )}
                      </div>

                      {(company as any).unique_selling_point && (
                        <p className="text-xs font-medium text-primary bg-primary/5 px-2 py-1 rounded mb-3">
                          💡 {(company as any).unique_selling_point}
                        </p>
                      )}
                      
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {(company as any).description_editorial || company.description}
                      </p>
                      
                      <div className="space-y-2 text-sm">
                        {company.datacenter_location && (
                          <div className="flex items-start gap-2">
                            <span className="font-medium min-w-[80px]">Datacenter:</span>
                            <span className="text-muted-foreground">{company.datacenter_location}</span>
                          </div>
                        )}
                        <div className="flex items-start gap-2">
                          <span className="font-medium min-w-[80px]">Desde:</span>
                          <span className="text-primary font-semibold">
                            Consultar
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/50 flex flex-col sm:flex-row gap-3 p-4">
                      <Button asChild size="sm" className="w-full sm:w-auto">
                        <Link to={`/catalogo/${company.slug}`}>
                          Ver Detalles
                        </Link>
                      </Button>
                      {company.slug && company.website && (() => {
                        const link = getProviderLink(company.slug, company.website);
                        return (
                          <Button asChild variant="outline" size="sm" className="w-full sm:w-auto gap-1">
                            <a
                              href={link.href}
                              target="_blank"
                              rel={link.rel}
                              referrerPolicy="no-referrer"
                            >
                              Sitio Web <ExternalLink size={14} />
                            </a>
                          </Button>
                        );
                      })()}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
            )
          )}
        </div>
      </section>
      
      {/* Technical Glossary */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <TechnicalGlossary />
        </div>
      </section>
      
      {/* Related Content */}
      <section className="py-12 bg-paper">
        <div className="container mx-auto px-4 max-w-4xl">
          <RelatedContent currentPage="general" />
        </div>
      </section>
      
      {/* Why choose section */}
      <section className="py-12 bg-paper">
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

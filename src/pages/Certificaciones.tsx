import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Award, ArrowRight } from 'lucide-react';
import DynamicMetaTags from '@/components/SEO/DynamicMetaTags';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import { Button } from '@/components/ui/button';

export default function Certificaciones() {
  const { data: categories } = useQuery({
    queryKey: ['certification-categories-public'],
    queryFn: async () => {
      const { data } = await supabase
        .from('certification_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      return data;
    },
  });

  const { data: activeCertifications } = useQuery({
    queryKey: ['active-certifications'],
    queryFn: async () => {
      const { data } = await supabase
        .from('company_certifications')
        .select(`
          *,
          hosting_companies (name, slug, logo_url, overall_rating, total_reviews),
          certification_categories (name, icon, slug)
        `)
        .eq('status', 'active')
        .order('position', { ascending: true });
      return data;
    },
  });

  return (
    <>
      <DynamicMetaTags
        title="Certificaciones de Hosting en Chile 2025"
        description="Descubre las empresas de hosting certificadas en Chile. Reconocimientos oficiales por excelencia en servicio, soporte, seguridad y más."
        keywords="certificaciones hosting chile, mejor hosting certificado, hosting premium chile, reconocimientos hosting"
      />

      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <SEOBreadcrumbs
              items={[
                { name: 'Certificaciones', href: '/certificaciones' }
              ]}
            />
            
            <div className="text-center max-w-3xl mx-auto mt-8">
              <Award className="w-16 h-16 mx-auto mb-6 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Certificaciones de Hosting Chile 2025
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Reconocemos la excelencia de los mejores proveedores de hosting en Chile
              </p>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-bold mb-8 text-center">Categorías de Certificación</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {categories?.map((category) => {
                const categoryCerts = activeCertifications?.filter(
                  cert => cert.category_id === category.id
                );
                
                return (
                  <Card key={category.id} className="p-6 hover:shadow-xl transition-shadow">
                    <div className="text-center mb-4">
                      <span className="text-5xl mb-3 block">{category.icon}</span>
                      <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {category.description}
                      </p>
                      <Badge variant="secondary">
                        {categoryCerts?.length || 0} empresas certificadas
                      </Badge>
                    </div>

                    {/* Top 3 Companies */}
                    {categoryCerts && categoryCerts.length > 0 && (
                      <div className="mt-6 space-y-2">
                        {categoryCerts.slice(0, 3).map((cert) => (
                          <Link
                            key={cert.id}
                            to={`/catalogo/${cert.hosting_companies?.slug}`}
                            className="flex items-center gap-2 p-2 rounded hover:bg-secondary/50 transition-colors"
                          >
                            <span className="font-bold text-primary">#{cert.position}</span>
                            <img
                              src={cert.hosting_companies?.logo_url || '/placeholder.svg'}
                              alt={cert.hosting_companies?.name}
                              className="w-8 h-8 object-contain"
                            />
                            <span className="text-sm font-medium flex-1 truncate">
                              {cert.hosting_companies?.name}
                            </span>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>

            {/* CTA for Providers */}
            <Card className="p-8 text-center bg-gradient-to-r from-primary/10 to-purple-500/10">
              <Award className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-bold mb-3">¿Eres proveedor de hosting?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Solicita certificaciones para destacar tu empresa y demostrar tu excelencia en el mercado chileno
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link to="/provider/certifications">
                  <Button size="lg" className="gap-2">
                    Solicitar Certificación
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/directorio-hosting-chile">
                  <Button size="lg" variant="outline">
                    Ver Directorio Completo
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </section>
      </div>
      
      <Footer />
    </>
  );
}

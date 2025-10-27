import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet';
import { Award, TrendingUp } from 'lucide-react';

export default function CertificacionesHub() {
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['certification-categories'],
    queryFn: async () => {
      const { data } = await supabase
        .from('certification_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      return data;
    },
  });

  const { data: certifications, isLoading: certificationsLoading } = useQuery({
    queryKey: ['active-certifications'],
    queryFn: async () => {
      const { data } = await supabase
        .from('company_certifications')
        .select(`
          *,
          hosting_companies (name, slug, logo_url),
          certification_categories (name, slug, icon)
        `)
        .eq('status', 'active')
        .order('position');
      return data;
    },
  });

  const getCertificationsByCategory = (categoryId: string) => {
    return certifications?.filter(cert => cert.category_id === categoryId) ?? [];
  };

  const getPodiumColor = (position: number) => {
    switch (position) {
      case 1:
        return {
          border: 'border-yellow-400 border-4',
          text: 'text-yellow-500',
          bg: 'bg-yellow-50'
        };
      case 2:
        return {
          border: 'border-gray-300 border-2',
          text: 'text-gray-400',
          bg: 'bg-gray-50'
        };
      case 3:
        return {
          border: 'border-amber-600 border-2',
          text: 'text-amber-600',
          bg: 'bg-amber-50'
        };
      default:
        return {
          border: 'border-border',
          text: 'text-muted-foreground',
          bg: 'bg-muted'
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <Helmet>
        <title>Certificaciones de Hosting Chile 2025 | Rankings Oficiales</title>
        <meta 
          name="description" 
          content="Rankings oficiales de los mejores hosting de Chile 2025. Certificaciones basadas en reviews verificadas y pruebas técnicas independientes." 
        />
      </Helmet>

      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Award className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold">
              Certificaciones de Hosting Chile 2025
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Rankings oficiales basados en reviews verificadas y pruebas técnicas independientes
          </p>
        </div>

        {/* Loading State */}
        {(categoriesLoading || certificationsLoading) && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Cargando certificaciones...</p>
          </div>
        )}

        {/* Categories with Certifications */}
        <div className="space-y-12">
          {categories?.map((category) => {
            const certs = getCertificationsByCategory(category.id);

            return (
              <Card key={category.id} className="p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-5xl">{category.icon}</span>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">{category.name}</h2>
                    <p className="text-muted-foreground">{category.description}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-primary opacity-50" />
                </div>

                {/* Podio Top 3 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((position) => {
                    const cert = certs.find(c => c.position === position);
                    const colors = getPodiumColor(position);

                    if (!cert) {
                      return (
                        <div 
                          key={position} 
                          className={`text-center py-12 rounded-lg border-2 border-dashed ${colors.bg}`}
                        >
                          <div className={`text-3xl font-black mb-2 ${colors.text}`}>
                            #{position}
                          </div>
                          <p className="text-sm text-muted-foreground">Posición disponible</p>
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={cert.id}
                        to={`/catalogo/${cert.hosting_companies.slug}`}
                        className="block group"
                      >
                        <Card className={`p-6 text-center hover:shadow-xl transition-all duration-300 ${colors.border} ${colors.bg}`}>
                          <div className={`text-5xl font-black mb-4 ${colors.text} group-hover:scale-110 transition-transform`}>
                            #{position}
                          </div>

                          <img
                            src={cert.hosting_companies.logo_url}
                            alt={cert.hosting_companies.name}
                            className="h-16 mx-auto mb-4 object-contain group-hover:scale-105 transition-transform"
                          />

                          <h3 className="font-bold text-lg mb-2">
                            {cert.hosting_companies.name}
                          </h3>

                          {cert.tier === 'premium' && (
                            <span className="inline-block mt-2 px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs rounded-full">
                              ✨ Premium
                            </span>
                          )}

                          <div className="mt-4 text-sm text-muted-foreground">
                            Ver perfil completo →
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
                </div>

                {/* Category Footer */}
                {certs.length > 0 && (
                  <div className="text-center mt-6">
                    <p className="text-sm text-muted-foreground">
                      Basado en múltiples reviews verificadas
                    </p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {!categoriesLoading && categories && categories.length === 0 && (
          <Card className="p-12 text-center">
            <Award className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Próximamente</h3>
            <p className="text-muted-foreground">
              Las certificaciones estarán disponibles pronto. Estamos evaluando a los mejores hosting de Chile.
            </p>
          </Card>
        )}

        {/* Info Box */}
        <Card className="mt-12 p-8 bg-primary/5 border-primary/20">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-primary" />
            ¿Cómo funcionan las certificaciones?
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Metodología Transparente</h4>
              <p>
                Evaluamos cada hosting basándonos en reviews verificadas de usuarios reales, 
                pruebas técnicas de velocidad, uptime y calidad de soporte.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Actualización Trimestral</h4>
              <p>
                Los rankings se actualizan cada 3 meses para reflejar el rendimiento actual 
                y las mejoras implementadas por cada proveedor.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
}

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Award, CheckCircle, Clock, XCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export default function ProviderCertifications() {
  const { user } = useAuth();
  const [requesting, setRequesting] = useState<string | null>(null);

  const { data: company } = useQuery({
    queryKey: ['provider-company', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('hosting_companies')
        .select('*')
        .eq('claimed_by', user!.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const { data: categories } = useQuery({
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

  const { data: myCertifications, refetch } = useQuery({
    queryKey: ['my-certifications', company?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('company_certifications')
        .select(`
          *,
          certification_categories (name, icon, description)
        `)
        .eq('company_id', company!.id);
      return data;
    },
    enabled: !!company?.id,
  });

  const requestCertification = async (categoryId: string, tier: 'free' | 'premium') => {
    if (!company) {
      toast.error('Debes reclamar tu empresa primero');
      return;
    }

    setRequesting(categoryId);

    try {
      const { error } = await supabase
        .from('company_certifications')
        .insert({
          company_id: company.id,
          category_id: categoryId,
          tier,
          status: 'pending',
        });

      if (error) throw error;

      toast.success('Solicitud enviada. Un administrador la revisará pronto.');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Error al solicitar certificación');
    } finally {
      setRequesting(null);
    }
  };

  const getCertificationForCategory = (categoryId: string) => {
    return myCertifications?.find(cert => cert.category_id === categoryId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Activa</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />En Revisión</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rechazada</Badge>;
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Certificaciones</h1>
            <p className="text-muted-foreground">
              Solicita certificaciones para destacar tu empresa
            </p>
          </div>

          {!company && (
            <Card className="p-8 text-center mb-8 bg-yellow-50 border-yellow-200">
              <Award className="w-12 h-12 mx-auto mb-4 text-yellow-600" />
              <h3 className="text-xl font-semibold mb-2">Reclama tu empresa primero</h3>
              <p className="text-muted-foreground mb-4">
                Necesitas reclamar tu perfil de empresa antes de solicitar certificaciones
              </p>
              <Button onClick={() => window.location.href = '/provider/company'}>
                Reclamar Empresa
              </Button>
            </Card>
          )}

          {/* My Certifications */}
          {myCertifications && myCertifications.length > 0 && (
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Mis Certificaciones</h2>
              <div className="space-y-4">
                {myCertifications.map((cert) => (
                  <div key={cert.id} className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{cert.certification_categories?.icon}</span>
                      <div>
                        <h3 className="font-semibold">{cert.certification_categories?.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {cert.certification_categories?.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {cert.tier === 'premium' && (
                        <Badge className="bg-gradient-to-r from-purple-600 to-pink-600">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                      {getStatusBadge(cert.status)}
                      {cert.position && cert.status === 'active' && (
                        <Badge variant="outline">
                          Posición #{cert.position}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Available Certifications */}
          <h2 className="text-2xl font-bold mb-6">Certificaciones Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories?.map((category) => {
              const existingCert = getCertificationForCategory(category.id);
              
              return (
                <Card key={category.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-4xl">{category.icon}</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  {/* Tier Options */}
                  <div className="space-y-3">
                    {/* Free Tier */}
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Nivel Gratuito</h4>
                        <Badge variant="outline">Gratis</Badge>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1 mb-3">
                        <li>✓ Badge en tu perfil</li>
                        <li>✓ Apareces en la categoría</li>
                      </ul>
                      {existingCert ? (
                        <Button variant="outline" size="sm" className="w-full" disabled>
                          Ya solicitada
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => requestCertification(category.id, 'free')}
                          disabled={!company || requesting === category.id}
                        >
                          {requesting === category.id ? 'Solicitando...' : 'Solicitar Gratis'}
                        </Button>
                      )}
                    </div>

                    {/* Premium Tier */}
                    <div className="p-4 border-2 border-purple-200 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-purple-600" />
                          Nivel Premium
                        </h4>
                        <Badge className="bg-gradient-to-r from-purple-600 to-pink-600">
                          ${(category.premium_price_clp || 50000).toLocaleString('es-CL')}
                        </Badge>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1 mb-3">
                        <li>✓ Posición destacada</li>
                        <li>✓ Badge premium</li>
                        <li>✓ Prioridad en resultados</li>
                        <li>✓ Soporte prioritario</li>
                      </ul>
                      {existingCert?.tier === 'premium' ? (
                        <Button variant="outline" size="sm" className="w-full" disabled>
                          Ya tienes Premium
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          onClick={() => requestCertification(category.id, 'premium')}
                          disabled={!company || requesting === category.id}
                        >
                          {requesting === category.id ? 'Solicitando...' : 'Solicitar Premium'}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Empty State */}
          {categories?.length === 0 && (
            <Card className="p-12 text-center">
              <Award className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No hay certificaciones disponibles</h3>
              <p className="text-muted-foreground">
                Las certificaciones estarán disponibles pronto
              </p>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Award, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BadgeEmbedCode from '@/components/BadgeEmbedCode';
import { toast } from 'sonner';

export default function BadgeGenerator() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get company
  const { data: company } = useQuery({
    queryKey: ['user-company', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('hosting_companies')
        .select('id, name, slug, website')
        .eq('claimed_by', user?.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  // Get certifications
  const { data: certifications, isLoading } = useQuery({
    queryKey: ['company-certifications-badges', company?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('company_certifications')
        .select(`
          *,
          certification_categories (name, slug, icon)
        `)
        .eq('company_id', company?.id)
        .eq('status', 'active')
        .order('position');
      return data || [];
    },
    enabled: !!company?.id,
  });

  // Request verification
  const requestVerification = useMutation({
    mutationFn: async (certId: string) => {
      const { error } = await supabase.functions.invoke('verify-badge-installation', {
        body: { certificationId: certId },
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Verificación solicitada. Revisaremos tu instalación pronto.');
      queryClient.invalidateQueries({ queryKey: ['company-certifications-badges'] });
    },
    onError: (error: any) => {
      toast.error('Error al solicitar verificación: ' + error.message);
    },
  });

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Debes iniciar sesión para acceder a esta página.
            </AlertDescription>
          </Alert>
        </div>
        <Footer />
      </>
    );
  }

  if (!company) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Debes reclamar una empresa primero. Ve al panel de proveedor.
            </AlertDescription>
          </Alert>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold">Generador de Badges</h1>
            </div>
            <p className="text-muted-foreground">
              Genera el código para mostrar tus certificaciones en tu sitio web
            </p>
          </div>

          {/* Company Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{company.name}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                {company.website}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Loading */}
          {isLoading && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Cargando certificaciones...</p>
            </div>
          )}

          {/* No certifications */}
          {!isLoading && certifications && certifications.length === 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Aún no tienes certificaciones activas. Solicita una en la sección de Certificaciones.
              </AlertDescription>
            </Alert>
          )}

          {/* Certifications List */}
          <div className="space-y-6">
            {certifications?.map((cert) => (
              <div key={cert.id}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{cert.certification_categories.icon}</span>
                        <div>
                          <CardTitle>
                            #{cert.position} {cert.certification_categories.name}
                          </CardTitle>
                          <CardDescription>Chile 2025</CardDescription>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {cert.link_back_verified ? (
                          <Badge variant="default" className="bg-green-600">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Verificado
                          </Badge>
                        ) : cert.requires_link_back ? (
                          <Badge variant="secondary">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Pendiente verificación
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            No requiere verificación
                          </Badge>
                        )}
                        
                        {cert.tier === 'premium' && (
                          <Badge className="bg-purple-600">✨ Premium</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <BadgeEmbedCode
                      certificationId={cert.id}
                      categoryName={cert.certification_categories.name}
                      position={cert.position}
                    />
                    
                    {cert.requires_link_back && !cert.link_back_verified && (
                      <Button
                        onClick={() => requestVerification.mutate(cert.id)}
                        disabled={requestVerification.isPending}
                        className="w-full"
                      >
                        {requestVerification.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Verificando...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Solicitar Verificación
                          </>
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

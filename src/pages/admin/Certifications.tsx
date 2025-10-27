import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Award, CheckCircle, XCircle, Clock, Link2, Link2Off, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function AdminCertifications() {
  const queryClient = useQueryClient();

  const { data: certifications, isLoading } = useQuery({
    queryKey: ['admin-certifications'],
    queryFn: async () => {
      const { data } = await supabase
        .from('company_certifications')
        .select(`
          *,
          hosting_companies (name, slug, logo_url),
          certification_categories (name, icon)
        `)
        .order('created_at', { ascending: false });
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, newStatus }: { id: string; newStatus: 'active' | 'pending' | 'revoked' | 'expired' }) => {
      const { error } = await supabase
        .from('company_certifications')
        .update({ 
          status: newStatus,
          granted_at: newStatus === 'active' ? new Date().toISOString() : null
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Estado actualizado correctamente');
      queryClient.invalidateQueries({ queryKey: ['admin-certifications'] });
    },
    onError: (error: any) => {
      toast.error('Error actualizando estado: ' + error.message);
    },
  });

  const verifyBadge = useMutation({
    mutationFn: async (certId: string) => {
      const { data, error } = await supabase.functions.invoke('verify-badge-installation', {
        body: { certificationId: certId },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data.verified) {
        toast.success(data.message);
      } else {
        toast.warning(data.message);
      }
      queryClient.invalidateQueries({ queryKey: ['admin-certifications'] });
    },
    onError: (error: any) => {
      toast.error('Error verificando badge: ' + error.message);
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Activa</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>;
      case 'revoked':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Revocada</Badge>;
      case 'expired':
        return <Badge variant="outline"><XCircle className="h-3 w-3 mr-1" />Expirada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTierBadge = (tier: string) => {
    if (tier === 'premium') {
      return <Badge className="bg-gradient-to-r from-purple-600 to-pink-600">✨ Premium</Badge>;
    }
    return <Badge variant="outline">Gratuita</Badge>;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Gestión de Certificaciones</h1>
              <p className="text-muted-foreground">
                {certifications?.length || 0} certificaciones totales
              </p>
            </div>
            <Link to="/admin/dashboard">
              <Button variant="outline">Volver al Dashboard</Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Activas</p>
                  <p className="text-2xl font-bold">
                    {certifications?.filter(c => c.status === 'active').length || 0}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pendientes</p>
                  <p className="text-2xl font-bold">
                    {certifications?.filter(c => c.status === 'pending').length || 0}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Premium</p>
                  <p className="text-2xl font-bold">
                    {certifications?.filter(c => c.tier === 'premium').length || 0}
                  </p>
                </div>
                <Award className="h-8 w-8 text-purple-500" />
              </div>
            </Card>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Certifications List */}
          <div className="space-y-4">
            {certifications?.map((cert) => (
              <Card key={cert.id} className="p-6">
                <div className="flex items-start gap-4">
                  <img
                    src={cert.hosting_companies?.logo_url || '/placeholder.svg'}
                    alt={cert.hosting_companies?.name}
                    className="w-16 h-16 object-contain"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{cert.hosting_companies?.name}</h3>
                      {getStatusBadge(cert.status)}
                      {getTierBadge(cert.tier)}
                      {cert.link_back_verified ? (
                        <Badge variant="default" className="bg-green-600">
                          <Link2 className="h-3 w-3 mr-1" />
                          Badge Verificado
                        </Badge>
                      ) : cert.requires_link_back ? (
                        <Badge variant="outline">
                          <Link2Off className="h-3 w-3 mr-1" />
                          Badge No Verificado
                        </Badge>
                      ) : null}
                    </div>
                    
                    <div className="flex items-center gap-2 text-lg mb-3">
                      <span>{cert.certification_categories?.icon}</span>
                      <span className="font-semibold">{cert.certification_categories?.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {cert.position && (
                        <div>
                          <span className="font-semibold">Posición:</span> #{cert.position}
                        </div>
                      )}
                      <div>
                        <span className="font-semibold">Creada:</span> {new Date(cert.created_at).toLocaleDateString()}
                      </div>
                      {cert.granted_at && (
                        <div>
                          <span className="font-semibold">Otorgada:</span> {new Date(cert.granted_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {cert.status !== 'active' && (
                      <Button
                        size="sm"
                        onClick={() => updateStatus.mutate({ id: cert.id, newStatus: 'active' })}
                        disabled={updateStatus.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Aprobar
                      </Button>
                    )}
                    
                    {cert.status !== 'revoked' && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => updateStatus.mutate({ id: cert.id, newStatus: 'revoked' })}
                        disabled={updateStatus.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Revocar
                      </Button>
                    )}

                    {cert.status === 'active' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateStatus.mutate({ id: cert.id, newStatus: 'pending' })}
                        disabled={updateStatus.isPending}
                      >
                        Pausar
                      </Button>
                    )}
                    
                    {cert.requires_link_back && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => verifyBadge.mutate(cert.id)}
                        disabled={verifyBadge.isPending}
                      >
                        {verifyBadge.isPending ? (
                          <>
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            Verificando...
                          </>
                        ) : (
                          <>
                            <Link2 className="h-3 w-3 mr-1" />
                            Verificar Badge
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {!isLoading && certifications?.length === 0 && (
            <Card className="p-12 text-center">
              <Award className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No hay certificaciones</h3>
              <p className="text-muted-foreground mb-4">
                Aún no se han creado certificaciones
              </p>
              <Link to="/admin/setup">
                <Button>Ir a Configuración Inicial</Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

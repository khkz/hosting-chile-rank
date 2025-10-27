import { useAuth } from '@/providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Navigate, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet';
import { Building2, Package, MessageSquare, Award, Star, TrendingUp } from 'lucide-react';

export default function ProviderDashboard() {
  const { user, role, loading } = useAuth();

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

  const { data: stats } = useQuery({
    queryKey: ['provider-stats', company?.id],
    queryFn: async () => {
      const [plansResult, reviewsResult, certsResult] = await Promise.all([
        supabase.from('hosting_plans').select('id').eq('company_id', company!.id).eq('is_active', true),
        supabase.from('hosting_reviews').select('id').eq('company_id', company!.id).eq('status', 'approved'),
        supabase.from('company_certifications').select('id').eq('company_id', company!.id).eq('status', 'active'),
      ]);

      return {
        activePlans: plansResult.data?.length || 0,
        totalReviews: reviewsResult.data?.length || 0,
        activeCertifications: certsResult.data?.length || 0,
      };
    },
    enabled: !!company?.id,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || role !== 'hosting_provider') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <Helmet>
        <title>Panel de Proveedor | Dashboard</title>
      </Helmet>

      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Panel de Proveedor</h1>
          <p className="text-muted-foreground">
            {company ? `Gestiona ${company.name}` : 'Configura tu empresa'}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rating Promedio</p>
                <p className="text-3xl font-bold">{company?.overall_rating?.toFixed(1) || '0.0'}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reviews</p>
                <p className="text-3xl font-bold">{stats?.totalReviews || 0}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Planes Activos</p>
                <p className="text-3xl font-bold">{stats?.activePlans || 0}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Certificaciones</p>
                <p className="text-3xl font-bold">{stats?.activeCertifications || 0}</p>
              </div>
              <Award className="w-8 h-8 text-primary" />
            </div>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-8 hover:shadow-lg transition-shadow">
            <Building2 className="w-12 h-12 text-primary mb-4" />
            <h2 className="text-2xl font-bold mb-2">Perfil de Empresa</h2>
            <p className="text-muted-foreground mb-4">
              {company ? 'Actualiza la información de tu empresa' : 'Reclama tu perfil de empresa'}
            </p>
            <Link to="/provider/company">
              <Button className="w-full">
                {company ? 'Editar Perfil' : 'Reclamar Empresa'}
              </Button>
            </Link>
          </Card>

          <Card className="p-8 hover:shadow-lg transition-shadow">
            <Package className="w-12 h-12 text-primary mb-4" />
            <h2 className="text-2xl font-bold mb-2">Planes de Hosting</h2>
            <p className="text-muted-foreground mb-4">
              Gestiona tus planes y precios
            </p>
            <Link to="/provider/plans">
              <Button className="w-full" disabled={!company}>
                Gestionar Planes
              </Button>
            </Link>
          </Card>

          <Card className="p-8 hover:shadow-lg transition-shadow">
            <MessageSquare className="w-12 h-12 text-primary mb-4" />
            <h2 className="text-2xl font-bold mb-2">Reviews</h2>
            <p className="text-muted-foreground mb-4">
              Responde a los comentarios de tus clientes
            </p>
            <Link to="/provider/reviews">
              <Button className="w-full" disabled={!company}>
                Ver Reviews
              </Button>
            </Link>
          </Card>

          <Card className="p-8 hover:shadow-lg transition-shadow">
            <Award className="w-12 h-12 text-primary mb-4" />
            <h2 className="text-2xl font-bold mb-2">Certificaciones</h2>
            <p className="text-muted-foreground mb-4">
              Solicita certificaciones para tu empresa
            </p>
            <Link to="/provider/certifications">
              <Button className="w-full" disabled={!company}>
                Gestionar Certificaciones
              </Button>
            </Link>
          </Card>
        </div>

        {/* Tips Section */}
        {company && (
          <Card className="mt-8 p-6 bg-primary/5 border-primary/20">
            <div className="flex items-start gap-4">
              <TrendingUp className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold mb-2">Mejora tu perfil</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Responde a todas las reviews para mostrar compromiso</li>
                  <li>✓ Mantén tus planes actualizados con precios competitivos</li>
                  <li>✓ Solicita certificaciones para destacar sobre la competencia</li>
                  <li>✓ Completa toda la información de tu empresa</li>
                </ul>
              </div>
            </div>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}

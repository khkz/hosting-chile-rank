import { useAuth } from '@/providers/AuthProvider';
import { Navigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Building2, Award, TrendingUp, Database } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AdminDashboard() {
  const { role, loading } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [pendingReviews, companies, pendingCompanies] = await Promise.all([
        supabase.from('hosting_reviews').select('id', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('hosting_companies').select('id', { count: 'exact' }).eq('is_verified', true),
        supabase.from('hosting_companies').select('id', { count: 'exact' }).eq('is_verified', false),
      ]);

      return {
        pendingReviews: pendingReviews.count ?? 0,
        totalCompanies: companies.count ?? 0,
        pendingCompanies: pendingCompanies.count ?? 0,
        activeCertifications: 0,
      };
    },
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (role !== 'admin') return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <MessageSquare className="w-12 h-12 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Reviews Pendientes</p>
                <p className="text-3xl font-bold">{stats?.pendingReviews ?? 0}</p>
              </div>
            </div>
            <Link to="/admin/reviews">
              <Button className="w-full mt-4">Ver Reviews</Button>
            </Link>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <Building2 className="w-12 h-12 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Empresas Pendientes</p>
                <p className="text-3xl font-bold">{stats?.pendingCompanies ?? 0}</p>
              </div>
            </div>
            <Link to="/admin/empresas">
              <Button className="w-full mt-4">Verificar Empresas</Button>
            </Link>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <Building2 className="w-12 h-12 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Empresas Verificadas</p>
                <p className="text-3xl font-bold">{stats?.totalCompanies ?? 0}</p>
              </div>
            </div>
            <Link to="/admin/empresas">
              <Button variant="outline" className="w-full mt-4">Gestionar</Button>
            </Link>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <Award className="w-12 h-12 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Certificaciones Activas</p>
                <p className="text-3xl font-bold">{stats?.activeCertifications ?? 0}</p>
              </div>
            </div>
            <Link to="/admin/certificaciones">
              <Button variant="outline" className="w-full mt-4">Ver Todas</Button>
            </Link>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold">Acciones Rápidas</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/admin/setup">
              <Button variant="outline" className="w-full justify-start">
                <Database className="w-4 h-4 mr-2" />
                Configuración Inicial
              </Button>
            </Link>
            <Link to="/admin/reviews">
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="w-4 h-4 mr-2" />
                Moderar Reviews
              </Button>
            </Link>
            <Link to="/admin/empresas">
              <Button variant="outline" className="w-full justify-start">
                <Building2 className="w-4 h-4 mr-2" />
                Gestionar Empresas
              </Button>
            </Link>
            <Link to="/admin/certificaciones">
              <Button variant="outline" className="w-full justify-start">
                <Award className="w-4 h-4 mr-2" />
                Gestionar Certificaciones
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
}

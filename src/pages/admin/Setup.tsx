import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, AlertCircle, Database, Award, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getAllHostingCompanies } from '@/data/hostingCompanies';

interface SetupStatus {
  companies: number;
  categories: number;
  certifications: number;
}

export default function Setup() {
  const navigate = useNavigate();
  const { role, loading: authLoading } = useAuth();
  const [status, setStatus] = useState<SetupStatus>({ companies: 0, categories: 0, certifications: 0 });
  const [loading, setLoading] = useState(true);
  const [migrating, setMigrating] = useState(false);

  useEffect(() => {
    if (!authLoading && role !== 'admin') {
      navigate('/');
    }
  }, [role, authLoading, navigate]);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const [companies, categories, certifications] = await Promise.all([
        supabase.from('hosting_companies').select('id', { count: 'exact', head: true }),
        supabase.from('certification_categories').select('id', { count: 'exact', head: true }),
        supabase.from('company_certifications').select('id', { count: 'exact', head: true }),
      ]);

      setStatus({
        companies: companies.count || 0,
        categories: categories.count || 0,
        certifications: certifications.count || 0,
      });
    } catch (error) {
      console.error('Error checking status:', error);
    } finally {
      setLoading(false);
    }
  };

  const migrateCompanies = async () => {
    setMigrating(true);
    try {
      const companies = getAllHostingCompanies();
      
      for (const company of companies) {
        const { error } = await supabase
          .from('hosting_companies')
          .upsert({
            slug: company.id,
            name: company.name,
            logo_url: company.logo,
            description: company.description,
            website: company.website,
            datacenter_location: company.datacenterLocation,
            year_founded: company.yearFounded,
            overall_rating: company.rating,
            speed_rating: company.rating,
            support_rating: company.rating,
            price_rating: company.rating,
            contact_phone: company.contactInfo.phone,
            contact_email: company.contactInfo.email,
            contact_address: company.contactInfo.address,
            contact_hours: company.contactInfo.hours,
            is_verified: true,
            is_featured: company.rating >= 9,
          }, { onConflict: 'slug' });

        if (error) throw error;

        // Insert plans
        const { data: companyData } = await supabase
          .from('hosting_companies')
          .select('id')
          .eq('slug', company.id)
          .single();

        if (companyData) {
          for (const plan of company.plans) {
            const storageMatch = plan.storage.match(/\d+/);
            const domainsMatch = plan.domains.toString();
            
            await supabase
              .from('hosting_plans')
              .insert([{
                company_id: companyData.id,
                name: plan.name,
                price_monthly: plan.price,
                storage_gb: storageMatch ? parseInt(storageMatch[0]) : null,
                bandwidth: plan.bandwidth,
                domains_allowed: parseInt(domainsMatch) || 1,
                features: plan.features as any,
                is_active: true,
              }]);
          }
        }
      }

      toast.success(`${companies.length} empresas migradas exitosamente`);
      await checkStatus();
    } catch (error: any) {
      toast.error('Error migrando empresas: ' + error.message);
      console.error(error);
    } finally {
      setMigrating(false);
    }
  };

  const createCategories = async () => {
    setMigrating(true);
    try {
      const categories = [
        {
          slug: 'mejor-seguridad',
          name: 'Mejor Seguridad',
          description: 'Proveedores con las mejores prácticas de seguridad, SSL, firewall y respaldos automáticos',
          icon: 'shield-check',
          criteria: { min_uptime: 99.9, ssl_required: true, firewall: true, backups: true },
          free_tier_features: ['badge_display', 'category_listing'],
          premium_price_clp: 50000,
          premium_features: ['featured_position', 'badge_display', 'category_listing', 'priority_support'],
          is_active: true,
          display_order: 1,
        },
        {
          slug: 'mejor-soporte',
          name: 'Mejor Soporte',
          description: 'Atención al cliente 24/7 con tiempo de respuesta certificado',
          icon: 'headphones',
          criteria: { support_24_7: true, max_response_time_minutes: 30 },
          free_tier_features: ['badge_display', 'category_listing'],
          premium_price_clp: 50000,
          premium_features: ['featured_position', 'badge_display', 'category_listing', 'priority_support'],
          is_active: true,
          display_order: 2,
        },
        {
          slug: 'mejor-rendimiento',
          name: 'Mejor Rendimiento',
          description: 'Uptime superior al 99.9% y velocidad optimizada',
          icon: 'zap',
          criteria: { min_uptime: 99.9, max_load_time_ms: 2000 },
          free_tier_features: ['badge_display', 'category_listing'],
          premium_price_clp: 50000,
          premium_features: ['featured_position', 'badge_display', 'category_listing', 'priority_support'],
          is_active: true,
          display_order: 3,
        },
        {
          slug: 'mejor-precio',
          name: 'Mejor Precio',
          description: 'La mejor relación calidad-precio del mercado',
          icon: 'dollar-sign',
          criteria: { max_price: 10000, min_features: 5 },
          free_tier_features: ['badge_display', 'category_listing'],
          premium_price_clp: 30000,
          premium_features: ['featured_position', 'badge_display', 'category_listing'],
          is_active: true,
          display_order: 4,
        },
      ];

      for (const category of categories) {
        const { error } = await supabase
          .from('certification_categories')
          .upsert(category, { onConflict: 'slug' });

        if (error) throw error;
      }

      toast.success(`${categories.length} categorías creadas`);
      await checkStatus();
    } catch (error: any) {
      toast.error('Error creando categorías: ' + error.message);
      console.error(error);
    } finally {
      setMigrating(false);
    }
  };

  const assignBadges = async () => {
    setMigrating(true);
    try {
      // Get top 3 companies by rating
      const { data: topCompanies } = await supabase
        .from('hosting_companies')
        .select('id, name, overall_rating')
        .eq('is_verified', true)
        .order('overall_rating', { ascending: false })
        .limit(3);

      if (!topCompanies || topCompanies.length === 0) {
        toast.error('No hay empresas para certificar. Migra empresas primero.');
        return;
      }

      // Get all categories
      const { data: categories } = await supabase
        .from('certification_categories')
        .select('id, slug');

      if (!categories || categories.length === 0) {
        toast.error('No hay categorías. Crea categorías primero.');
        return;
      }

      let assigned = 0;
      for (const company of topCompanies) {
        for (const category of categories) {
          const { error } = await supabase
            .from('company_certifications')
            .upsert({
              company_id: company.id,
              category_id: category.id,
              tier: 'free',
              status: 'active',
              position: topCompanies.indexOf(company) + 1,
              granted_at: new Date().toISOString(),
              requires_link_back: false,
              link_back_verified: true,
              display_order: topCompanies.indexOf(company),
            }, { onConflict: 'company_id,category_id' });

          if (!error) assigned++;
        }
      }

      toast.success(`${assigned} certificaciones asignadas a las top 3 empresas`);
      await checkStatus();
    } catch (error: any) {
      toast.error('Error asignando badges: ' + error.message);
      console.error(error);
    } finally {
      setMigrating(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Configuración Inicial</h1>
            <p className="text-muted-foreground">
              Pobla la base de datos con datos iniciales para que el sistema funcione correctamente.
            </p>
          </div>

          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Empresas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{status.companies}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {status.companies > 0 ? 'Migradas' : 'Sin datos'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Categorías
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{status.categories}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {status.categories > 0 ? 'Creadas' : 'Sin datos'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Certificaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{status.certifications}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {status.certifications > 0 ? 'Asignadas' : 'Sin datos'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Setup Steps */}
          <div className="space-y-6">
            {/* Step 1: Migrate Companies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                    1
                  </span>
                  Migrar Empresas de Hosting
                </CardTitle>
                <CardDescription>
                  Migra {getAllHostingCompanies().length} empresas desde el código a la base de datos Supabase
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {status.companies > 0 && (
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                      Ya hay {status.companies} empresas en la base de datos. Puedes volver a migrar para actualizar.
                    </AlertDescription>
                  </Alert>
                )}
                <Button 
                  onClick={migrateCompanies} 
                  disabled={migrating}
                  className="w-full md:w-auto"
                >
                  {migrating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Migrando...
                    </>
                  ) : (
                    <>
                      <Database className="mr-2 h-4 w-4" />
                      Migrar Empresas
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Step 2: Create Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                    2
                  </span>
                  Crear Categorías de Certificación
                </CardTitle>
                <CardDescription>
                  Crea 4 categorías: Mejor Seguridad, Mejor Soporte, Mejor Rendimiento, Mejor Precio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {status.categories > 0 && (
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                      Ya hay {status.categories} categorías creadas.
                    </AlertDescription>
                  </Alert>
                )}
                {status.companies === 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Primero debes migrar las empresas (Paso 1)
                    </AlertDescription>
                  </Alert>
                )}
                <Button 
                  onClick={createCategories} 
                  disabled={migrating || status.companies === 0}
                  className="w-full md:w-auto"
                >
                  {migrating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <Database className="mr-2 h-4 w-4" />
                      Crear Categorías
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Step 3: Assign Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                    3
                  </span>
                  Asignar Certificaciones
                </CardTitle>
                <CardDescription>
                  Asigna certificaciones a las top 3 empresas mejor rankeadas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {status.certifications > 0 && (
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                      Ya hay {status.certifications} certificaciones asignadas.
                    </AlertDescription>
                  </Alert>
                )}
                {(status.companies === 0 || status.categories === 0) && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Primero completa los pasos 1 y 2
                    </AlertDescription>
                  </Alert>
                )}
                <Button 
                  onClick={assignBadges} 
                  disabled={migrating || status.companies === 0 || status.categories === 0}
                  className="w-full md:w-auto"
                >
                  {migrating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Asignando...
                    </>
                  ) : (
                    <>
                      <Award className="mr-2 h-4 w-4" />
                      Asignar Certificaciones
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 flex gap-4">
            <Button variant="outline" onClick={() => navigate('/admin/dashboard')}>
              Volver al Dashboard
            </Button>
            <Button variant="outline" onClick={() => navigate('/certificaciones')}>
              Ver Certificaciones
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

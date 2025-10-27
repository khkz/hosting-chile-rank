import { useAuth } from '@/providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import { Building2 } from 'lucide-react';

export default function CompanyProfile() {
  const { user, role, loading } = useAuth();
  const [saving, setSaving] = useState(false);

  const { data: company, refetch } = useQuery({
    queryKey: ['provider-company', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('hosting_companies')
        .select('*')
        .eq('claimed_by', user!.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const [formData, setFormData] = useState({
    name: company?.name || '',
    description: company?.description || '',
    website: company?.website || '',
    logo_url: company?.logo_url || '',
    contact_email: company?.contact_email || '',
    contact_phone: company?.contact_phone || '',
    contact_address: company?.contact_address || '',
    contact_hours: company?.contact_hours || '',
    datacenter_location: company?.datacenter_location || '',
    year_founded: company?.year_founded || 0,
  });

  // Update formData when company loads
  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        description: company.description || '',
        website: company.website || '',
        logo_url: company.logo_url || '',
        contact_email: company.contact_email || '',
        contact_phone: company.contact_phone || '',
        contact_address: company.contact_address || '',
        contact_hours: company.contact_hours || '',
        datacenter_location: company.datacenter_location || '',
        year_founded: company.year_founded || new Date().getFullYear(),
      });
    }
  }, [company]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (company) {
        const { error } = await supabase
          .from('hosting_companies')
          .update(formData)
          .eq('id', company.id);

        if (error) throw error;
        toast.success('Perfil actualizado correctamente');
      } else {
        const { error } = await supabase
          .from('hosting_companies')
          .insert([{
            ...formData,
            claimed_by: user!.id,
            slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
            is_verified: false,
          }]);

        if (error) throw error;
        toast.success('Empresa creada correctamente');
      }

      refetch();
    } catch (error) {
      console.error('Error saving company:', error);
      toast.error('Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

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
        <title>Perfil de Empresa | Panel de Proveedor</title>
      </Helmet>

      <Navbar />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">
              {company ? 'Editar Perfil de Empresa' : 'Reclamar Empresa'}
            </h1>
          </div>
          <p className="text-muted-foreground">
            Completa toda la información para mejorar tu visibilidad
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la Empresa *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Sitio Web *</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo_url">URL del Logo</Label>
              <Input
                id="logo_url"
                type="url"
                value={formData.logo_url}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                placeholder="/logo-empresa.svg o https://ejemplo.com/logo.png"
              />
              <p className="text-xs text-muted-foreground">
                Puedes usar rutas locales (/logo-empresa.svg) o URLs externas
              </p>
              {formData.logo_url && (
                <div className="mt-2 p-4 bg-gray-50 rounded-lg flex justify-center">
                  <img
                    src={formData.logo_url}
                    alt="Preview logo"
                    className="max-h-20 object-contain"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                placeholder="Describe tu empresa de hosting..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contact_email">Email de Contacto</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_phone">Teléfono de Contacto</Label>
                <Input
                  id="contact_phone"
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_address">Dirección</Label>
              <Input
                id="contact_address"
                value={formData.contact_address}
                onChange={(e) => setFormData({ ...formData, contact_address: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contact_hours">Horario de Atención</Label>
                <Input
                  id="contact_hours"
                  value={formData.contact_hours}
                  onChange={(e) => setFormData({ ...formData, contact_hours: e.target.value })}
                  placeholder="Ej: Lun-Vie 9:00-18:00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="datacenter_location">Ubicación del Datacenter</Label>
                <Input
                  id="datacenter_location"
                  value={formData.datacenter_location}
                  onChange={(e) => setFormData({ ...formData, datacenter_location: e.target.value })}
                  placeholder="Ej: Santiago, Chile"
                />
              </div>
            </div>

              <div className="space-y-2">
                <Label htmlFor="year_founded">Año de Fundación</Label>
                <Input
                  id="year_founded"
                  type="number"
                  value={formData.year_founded}
                  onChange={(e) => setFormData({ ...formData, year_founded: parseInt(e.target.value) || 0 })}
                  placeholder="2020"
                />
              </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? 'Guardando...' : company ? 'Actualizar Perfil' : 'Crear Empresa'}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      <Footer />
    </div>
  );
}

import { useAuth } from '@/providers/AuthProvider';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Navigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet';
import { useState } from 'react';
import { toast } from 'sonner';
import { Package, Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function PlanManagement() {
  const { user, role, loading } = useAuth();
  const queryClient = useQueryClient();
  const [editingPlan, setEditingPlan] = useState<any>(null);

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

  const { data: plans } = useQuery({
    queryKey: ['company-plans', company?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('hosting_plans')
        .select('*')
        .eq('company_id', company!.id)
        .order('display_order');
      return data;
    },
    enabled: !!company?.id,
  });

  const savePlanMutation = useMutation({
    mutationFn: async (planData: any) => {
      if (planData.id) {
        const { error } = await supabase
          .from('hosting_plans')
          .update(planData)
          .eq('id', planData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('hosting_plans')
          .insert({ ...planData, company_id: company!.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-plans'] });
      setEditingPlan(null);
      toast.success('Plan guardado correctamente');
    },
    onError: () => {
      toast.error('Error al guardar el plan');
    },
  });

  const deletePlanMutation = useMutation({
    mutationFn: async (planId: string) => {
      const { error } = await supabase
        .from('hosting_plans')
        .delete()
        .eq('id', planId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-plans'] });
      toast.success('Plan eliminado');
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || role !== 'hosting_provider' || !company) {
    return <Navigate to="/provider/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <Helmet>
        <title>Gestión de Planes | Panel de Proveedor</title>
      </Helmet>

      <Navbar />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold">Planes de Hosting</h1>
            </div>
            <p className="text-muted-foreground">Gestiona los planes de {company.name}</p>
          </div>
          <Button onClick={() => setEditingPlan({ name: '', price_monthly: '', storage_gb: '', domains_allowed: 1, bandwidth: '', is_active: true })}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Plan
          </Button>
        </div>

        {editingPlan && (
          <Card className="p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">
              {editingPlan.id ? 'Editar Plan' : 'Nuevo Plan'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre del Plan *</Label>
                <Input
                  value={editingPlan.name}
                  onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  placeholder="Básico, Pro, Business..."
                />
              </div>
              <div className="space-y-2">
                <Label>Precio Mensual (CLP) *</Label>
                <Input
                  type="number"
                  value={editingPlan.price_monthly}
                  onChange={(e) => setEditingPlan({ ...editingPlan, price_monthly: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Almacenamiento (GB)</Label>
                <Input
                  type="number"
                  value={editingPlan.storage_gb}
                  onChange={(e) => setEditingPlan({ ...editingPlan, storage_gb: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Dominios Permitidos</Label>
                <Input
                  type="number"
                  value={editingPlan.domains_allowed}
                  onChange={(e) => setEditingPlan({ ...editingPlan, domains_allowed: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Ancho de Banda</Label>
                <Input
                  value={editingPlan.bandwidth}
                  onChange={(e) => setEditingPlan({ ...editingPlan, bandwidth: e.target.value })}
                  placeholder="Ilimitado, 100GB..."
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={() => savePlanMutation.mutate(editingPlan)}>
                Guardar
              </Button>
              <Button variant="outline" onClick={() => setEditingPlan(null)}>
                Cancelar
              </Button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans?.map((plan) => (
            <Card key={plan.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <Badge variant={plan.is_active ? 'default' : 'secondary'}>
                  {plan.is_active ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
              <div className="space-y-2 text-sm mb-4">
                <p className="text-2xl font-bold text-primary">
                  ${plan.price_monthly?.toLocaleString('es-CL')}/mes
                </p>
                {plan.storage_gb && <p>💾 {plan.storage_gb} GB almacenamiento</p>}
                {plan.bandwidth && <p>📡 {plan.bandwidth} ancho de banda</p>}
                {plan.domains_allowed && <p>🌐 {plan.domains_allowed} dominio(s)</p>}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setEditingPlan(plan)}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deletePlanMutation.mutate(plan.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {!plans || plans.length === 0 && !editingPlan && (
          <Card className="p-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No hay planes configurados</h3>
            <p className="text-muted-foreground mb-4">
              Crea tu primer plan de hosting para que los usuarios puedan conocer tus servicios
            </p>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}

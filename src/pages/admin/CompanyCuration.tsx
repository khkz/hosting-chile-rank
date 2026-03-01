import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  CheckCircle, XCircle, AlertCircle, Globe, Edit, Shield, ShieldOff,
  RefreshCw, Star, Loader2
} from 'lucide-react';

type Filter = 'all' | 'curated' | 'pending' | 'down';

export default function CompanyCuration() {
  const { role, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<Filter>('all');
  const [editCompany, setEditCompany] = useState<any>(null);
  const [curationNotes, setCurationNotes] = useState('');
  const [curatingId, setCuratingId] = useState<string | null>(null);

  const { data: companies, isLoading } = useQuery({
    queryKey: ['admin-companies-curation'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hosting_companies')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  const verifyWebsite = useMutation({
    mutationFn: async (companyId: string) => {
      const { data, error } = await supabase.functions.invoke('verify-company-website', {
        body: { company_id: companyId },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success(`Website: ${data.status}`);
      queryClient.invalidateQueries({ queryKey: ['admin-companies-curation'] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const verifyAll = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('verify-company-website', {
        body: { batch: true },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success(`Verificados: ${data.results?.length ?? 0} sitios`);
      queryClient.invalidateQueries({ queryKey: ['admin-companies-curation'] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const toggleCurated = useMutation({
    mutationFn: async ({ id, curated, notes }: { id: string; curated: boolean; notes?: string }) => {
      const { error } = await supabase
        .from('hosting_companies')
        .update({
          is_curated: curated,
          curated_at: curated ? new Date().toISOString() : null,
          curation_notes: notes || null,
        } as any)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Actualizado');
      queryClient.invalidateQueries({ queryKey: ['admin-companies-curation'] });
      setCuratingId(null);
      setCurationNotes('');
    },
  });

  const toggleVerified = useMutation({
    mutationFn: async ({ id, verified }: { id: string; verified: boolean }) => {
      const { error } = await supabase
        .from('hosting_companies')
        .update({ is_verified: verified })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Verificación actualizada');
      queryClient.invalidateQueries({ queryKey: ['admin-companies-curation'] });
    },
  });

  const updateCompany = useMutation({
    mutationFn: async (updates: any) => {
      const { id, ...rest } = updates;
      const { error } = await supabase.from('hosting_companies').update(rest).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Empresa actualizada');
      setEditCompany(null);
      queryClient.invalidateQueries({ queryKey: ['admin-companies-curation'] });
    },
  });

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (role !== 'admin') return <Navigate to="/" replace />;

  const filtered = companies?.filter((c: any) => {
    if (filter === 'curated') return c.is_curated;
    if (filter === 'pending') return !c.is_curated;
    if (filter === 'down') return c.website_status === 'down' || c.website_status === 'not_found';
    return true;
  }) || [];

  const getCompletenessScore = (c: any) => {
    let score = 0;
    if (c.logo_url) score += 25;
    if (c.description) score += 25;
    if (c.website_status === 'active') score += 25;
    if (c.contact_email || c.contact_phone) score += 25;
    return score;
  };

  const statusBadge = (status: string) => {
    if (status === 'active') return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Activo</Badge>;
    if (status === 'down') return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Caído</Badge>;
    if (status === 'not_found') return <Badge className="bg-orange-100 text-orange-800"><AlertCircle className="w-3 h-3 mr-1" />No encontrado</Badge>;
    return <Badge variant="outline"><AlertCircle className="w-3 h-3 mr-1" />Desconocido</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold">Curación de Empresas</h1>
          <Button
            onClick={() => verifyAll.mutate()}
            disabled={verifyAll.isPending}
          >
            {verifyAll.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Verificar Todos los Websites
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {([['all', 'Todas'], ['curated', 'Curadas'], ['pending', 'Pendientes'], ['down', 'Website Caído']] as const).map(([key, label]) => (
            <Button
              key={key}
              variant={filter === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(key)}
            >
              {label} ({companies?.filter((c: any) => {
                if (key === 'curated') return c.is_curated;
                if (key === 'pending') return !c.is_curated;
                if (key === 'down') return c.website_status === 'down' || c.website_status === 'not_found';
                return true;
              }).length ?? 0})
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>
        ) : (
          <div className="space-y-4">
            {filtered.map((company: any) => (
              <Card key={company.id} className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Logo */}
                  <div className="w-16 h-16 flex-shrink-0 bg-muted rounded flex items-center justify-center overflow-hidden">
                    <img
                      src={company.logo_url || '/placeholder.svg'}
                      alt={company.name}
                      className="w-full h-full object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-lg">{company.name}</h3>
                      {company.is_verified && <Badge className="bg-blue-100 text-blue-800">Verificada</Badge>}
                      {company.is_curated && <Badge className="bg-green-100 text-green-800">Curada</Badge>}
                      {statusBadge(company.website_status || 'unknown')}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{company.website || 'Sin website'}</p>
                    <p className="text-sm text-muted-foreground truncate">{company.description || 'Sin descripción'}</p>

                    {/* Completeness */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${getCompletenessScore(company)}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{getCompletenessScore(company)}%</span>
                      {company.overall_rating > 0 && (
                        <span className="text-xs flex items-center gap-1 ml-2">
                          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                          {Number(company.overall_rating).toFixed(1)}
                        </span>
                      )}
                    </div>

                    {company.curation_notes && (
                      <p className="text-xs text-muted-foreground mt-1 italic">Notas: {company.curation_notes}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 items-start">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => verifyWebsite.mutate(company.id)}
                      disabled={verifyWebsite.isPending}
                    >
                      <Globe className="w-4 h-4 mr-1" />Verificar
                    </Button>

                    {!company.is_curated ? (
                      curatingId === company.id ? (
                        <div className="flex gap-1 items-center">
                          <Input
                            placeholder="Notas..."
                            value={curationNotes}
                            onChange={(e) => setCurationNotes(e.target.value)}
                            className="w-40 h-8 text-sm"
                          />
                          <Button size="sm" onClick={() => toggleCurated.mutate({ id: company.id, curated: true, notes: curationNotes })}>
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setCuratingId(null)}>
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" onClick={() => { setCuratingId(company.id); setCurationNotes(''); }}>
                          <Shield className="w-4 h-4 mr-1" />Curar
                        </Button>
                      )
                    ) : (
                      <Button size="sm" variant="destructive" onClick={() => toggleCurated.mutate({ id: company.id, curated: false })}>
                        <ShieldOff className="w-4 h-4 mr-1" />Descurar
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant={company.is_verified ? 'destructive' : 'default'}
                      onClick={() => toggleVerified.mutate({ id: company.id, verified: !company.is_verified })}
                    >
                      {company.is_verified ? 'Desverificar' : 'Verificar'}
                    </Button>

                    <Button size="sm" variant="outline" onClick={() => setEditCompany({ ...company })}>
                      <Edit className="w-4 h-4 mr-1" />Editar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editCompany} onOpenChange={() => setEditCompany(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar {editCompany?.name}</DialogTitle>
          </DialogHeader>
          {editCompany && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nombre</label>
                <Input value={editCompany.name} onChange={(e) => setEditCompany({ ...editCompany, name: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Website</label>
                <Input value={editCompany.website || ''} onChange={(e) => setEditCompany({ ...editCompany, website: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Logo URL</label>
                <Input value={editCompany.logo_url || ''} onChange={(e) => setEditCompany({ ...editCompany, logo_url: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Descripción</label>
                <Textarea value={editCompany.description || ''} onChange={(e) => setEditCompany({ ...editCompany, description: e.target.value })} />
              </div>
              <Button
                className="w-full"
                onClick={() => updateCompany.mutate({
                  id: editCompany.id,
                  name: editCompany.name,
                  website: editCompany.website,
                  logo_url: editCompany.logo_url,
                  description: editCompany.description,
                })}
                disabled={updateCompany.isPending}
              >
                Guardar Cambios
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  CheckCircle, XCircle, AlertCircle, Globe, Edit, Shield, ShieldOff,
  RefreshCw, Star, Loader2, ClipboardCheck, Trash2, ChevronDown, ChevronUp,
  Phone, Mail, MapPin, Cpu, Search
} from 'lucide-react';
import AuditReviewPanel from '@/components/admin/AuditReviewPanel';

type Filter = 'all' | 'curated' | 'pending' | 'down';

export default function CompanyCuration() {
  const { role, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<Filter>('all');
  const [editCompany, setEditCompany] = useState<any>(null);
  const [curationNotes, setCurationNotes] = useState('');
  const [curatingId, setCuratingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const deleteCompany = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('hosting_companies').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Empresa eliminada');
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ['admin-companies-curation'] });
    },
    onError: (err: any) => toast.error(`Error: ${err.message}`),
  });

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (role !== 'admin') return <Navigate to="/" replace />;

  const filtered = companies?.filter((c: any) => {
    const matchesFilter = filter === 'all' ? true
      : filter === 'curated' ? c.is_curated
      : filter === 'pending' ? !c.is_curated
      : c.website_status === 'down' || c.website_status === 'not_found';
    const matchesSearch = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  }) || [];

  const getCompletenessScore = (c: any) => {
    let score = 0;
    if (c.logo_url) score += 15;
    if (c.description) score += 15;
    if (c.website_status === 'active') score += 15;
    if (c.contact_email) score += 15;
    if (c.contact_phone) score += 10;
    if (c.contact_address) score += 10;
    if (c.technologies?.length > 0) score += 10;
    if (c.social_media && Object.values(c.social_media).some((v: any) => v)) score += 10;
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

        <Tabs defaultValue="empresas" className="mb-6">
          <TabsList>
            <TabsTrigger value="empresas">Empresas</TabsTrigger>
            <TabsTrigger value="auditorias" className="flex items-center gap-1">
              <ClipboardCheck className="w-4 h-4" />Auditorías Pendientes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="auditorias">
            <AuditReviewPanel />
          </TabsContent>

          <TabsContent value="empresas">
            {/* Search + Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar empresa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
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
            </div>

            {isLoading ? (
              <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>
            ) : (
              <div className="space-y-4">
                {filtered.map((company: any) => {
                  const isExpanded = expandedId === company.id;
                  return (
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
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 items-start">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setExpandedId(isExpanded ? null : company.id)}
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </Button>
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

                          <Button size="sm" variant="outline" onClick={() => setEditCompany({ ...company })}>
                            <Edit className="w-4 h-4 mr-1" />Editar
                          </Button>

                          <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(company)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Expanded details */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                          <div className="flex items-start gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs text-muted-foreground">Teléfono</p>
                              <p>{company.contact_phone || '—'}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs text-muted-foreground">Email</p>
                              <p>{company.contact_email || '—'}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs text-muted-foreground">Dirección</p>
                              <p>{company.contact_address || '—'}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Cpu className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs text-muted-foreground">Datacenter</p>
                              <p>{company.datacenter_location || '—'}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Cpu className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs text-muted-foreground">Tecnologías</p>
                              <div className="flex flex-wrap gap-1 mt-0.5">
                                {company.technologies?.length > 0
                                  ? company.technologies.map((t: string) => (
                                      <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                                    ))
                                  : '—'}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Globe className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs text-muted-foreground">Redes Sociales</p>
                              {company.social_media && Object.entries(company.social_media).some(([, v]) => v) ? (
                                <div className="flex flex-col gap-0.5">
                                  {Object.entries(company.social_media).filter(([, v]) => v).map(([k, v]) => (
                                    <a key={k} href={v as string} target="_blank" rel="noopener" className="text-primary text-xs hover:underline truncate max-w-[200px]">
                                      {k}: {v as string}
                                    </a>
                                  ))}
                                </div>
                              ) : '—'}
                            </div>
                          </div>
                          {company.curation_notes && (
                            <div className="col-span-full">
                              <p className="text-xs text-muted-foreground">Notas de curación</p>
                              <p className="text-xs italic">{company.curation_notes}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </Card>
                  );
                })}
                {filtered.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No se encontraron empresas.</p>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la empresa, sus planes, certificaciones y reseñas asociadas. No se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && deleteCompany.mutate(deleteTarget.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteCompany.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Trash2 className="w-4 h-4 mr-1" />}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { CheckCircle, XCircle, ChevronDown, ChevronUp, Loader2, History } from 'lucide-react';

const FIELD_LABELS: Record<string, string> = {
  description: 'Descripción',
  contact_phone: 'Teléfono',
  contact_email: 'Email',
  contact_address: 'Dirección',
  datacenter_location: 'Datacenter',
  technologies: 'Tecnologías',
  social_media: 'Redes Sociales',
  legal_name: 'Razón Social',
  corporate_group: 'Grupo Corporativo',
  foundation_year: 'Año Fundación',
};

const MAPPABLE_FIELDS: Record<string, string> = {
  description_seo: 'description',
  mission_statement: 'description',
  contact_phone: 'contact_phone',
  contact_email: 'contact_email',
  contact_address: 'contact_address',
  datacenter_location: 'datacenter_location',
  technologies: 'technologies',
  social_media: 'social_media',
  legal_name: 'legal_name',
  corporate_group: 'corporate_group',
  foundation_year: 'foundation_year',
};

function extractMappedFields(scraped: any): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [scraperKey, dbCol] of Object.entries(MAPPABLE_FIELDS)) {
    if (scraped[scraperKey] != null && scraped[scraperKey] !== '') {
      if (dbCol === 'description' && result[dbCol]) continue;
      result[dbCol] = scraped[scraperKey];
    }
  }
  return result;
}

function formatValue(val: any): string {
  if (val == null || val === '') return '—';
  if (Array.isArray(val)) return val.join(', ');
  if (typeof val === 'object') return JSON.stringify(val, null, 2);
  return String(val);
}

function AuditList({ statusFilter }: { statusFilter: 'pending' | 'history' }) {
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedFields, setSelectedFields] = useState<Record<string, Set<string>>>({});

  const { data: audits, isLoading } = useQuery({
    queryKey: ['audit-logs', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('company_audit_log' as any)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (statusFilter === 'pending') {
        query = query.eq('status', 'pending');
      } else {
        query = query.in('status', ['approved', 'rejected', 'blocked']);
      }

      const { data, error } = await query.limit(50);
      if (error) throw error;
      return data as any[];
    },
  });

  const companyIds = audits?.map((a: any) => a.company_id) || [];
  const { data: companies } = useQuery({
    queryKey: ['audit-companies', companyIds],
    queryFn: async () => {
      if (companyIds.length === 0) return [];
      const { data, error } = await supabase
        .from('hosting_companies')
        .select('*')
        .in('id', companyIds);
      if (error) throw error;
      return data;
    },
    enabled: companyIds.length > 0,
  });

  const companiesMap = new Map((companies || []).map((c: any) => [c.id, c]));

  const approveAudit = useMutation({
    mutationFn: async ({ auditId, fields }: { auditId: string; fields?: Record<string, any> }) => {
      const audit = audits?.find((a: any) => a.id === auditId);
      if (!audit) throw new Error('Audit not found');
      const scraped = audit.scraped_data || {};
      const mapped = fields || extractMappedFields(scraped);
      if (Object.keys(mapped).length === 0) throw new Error('No hay campos para aplicar');

      const { error: updateError } = await supabase
        .from('hosting_companies')
        .update({
          ...mapped,
          is_curated: true,
          curated_at: new Date().toISOString(),
          curation_notes: `Aprobado desde audit log ${new Date().toISOString()}. Complaints: ${(audit.complaints_data as any)?.severity || 'N/A'}`,
        })
        .eq('id', audit.company_id);
      if (updateError) throw updateError;

      const { error: logError } = await supabase
        .from('company_audit_log' as any)
        .update({ status: 'approved', reviewed_at: new Date().toISOString() } as any)
        .eq('id', auditId);
      if (logError) throw logError;
    },
    onSuccess: () => {
      toast.success('Auditoría aprobada y datos aplicados');
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
      queryClient.invalidateQueries({ queryKey: ['admin-companies-curation'] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const rejectAudit = useMutation({
    mutationFn: async (auditId: string) => {
      const { error } = await supabase
        .from('company_audit_log' as any)
        .update({ status: 'rejected', reviewed_at: new Date().toISOString() } as any)
        .eq('id', auditId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Auditoría rechazada');
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const handlePartialApprove = (auditId: string, scraped: any) => {
    const selected = selectedFields[auditId];
    if (!selected || selected.size === 0) { toast.error('Selecciona al menos un campo'); return; }
    const allMapped = extractMappedFields(scraped);
    const partial: Record<string, any> = {};
    for (const field of selected) {
      if (allMapped[field] != null) partial[field] = allMapped[field];
    }
    approveAudit.mutate({ auditId, fields: partial });
  };

  const toggleField = (auditId: string, field: string) => {
    setSelectedFields(prev => {
      const current = new Set(prev[auditId] || []);
      if (current.has(field)) current.delete(field); else current.add(field);
      return { ...prev, [auditId]: current };
    });
  };

  if (isLoading) return <div className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>;

  if (!audits || audits.length === 0) {
    return <div className="text-center py-12 text-muted-foreground">
      {statusFilter === 'pending' ? 'No hay auditorías pendientes.' : 'No hay historial de auditorías.'}
    </div>;
  }

  return (
    <div className="space-y-4">
      {audits.map((audit: any) => {
        const company = companiesMap.get(audit.company_id);
        const scraped = audit.scraped_data || {};
        const complaints = audit.complaints_data || {};
        const mapped = extractMappedFields(scraped);
        const isExpanded = expandedId === audit.id;
        const selected = selectedFields[audit.id] || new Set();
        const isPending = audit.status === 'pending';

        return (
          <Card key={audit.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold">{company?.name || 'Empresa desconocida'}</h4>
                    {!isPending && (
                      <Badge variant={audit.status === 'approved' ? 'default' : audit.status === 'blocked' ? 'secondary' : 'destructive'}>
                        {audit.status === 'approved' ? '✅ Aprobada' : audit.status === 'blocked' ? '🚫 Bloqueada' : '❌ Rechazada'}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(audit.created_at).toLocaleString('es-CL')}
                    {complaints.severity && <Badge variant="outline" className="ml-2 text-[10px]">Quejas: {complaints.severity}</Badge>}
                    {scraped.pages_scraped != null && <span className="ml-2">{scraped.pages_scraped} páginas</span>}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <Button size="sm" variant="outline" onClick={() => setExpandedId(isExpanded ? null : audit.id)}>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
                {isPending && (
                  <>
                    <Button size="sm" onClick={() => approveAudit.mutate({ auditId: audit.id })} disabled={approveAudit.isPending}>
                      <CheckCircle className="w-4 h-4 mr-1" />Aprobar Todo
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => rejectAudit.mutate(audit.id)} disabled={rejectAudit.isPending}>
                      <XCircle className="w-4 h-4 mr-1" />Rechazar
                    </Button>
                  </>
                )}
              </div>
            </div>

            {isExpanded && (
              <div className="mt-4 space-y-3">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border rounded">
                    <thead>
                      <tr className="bg-muted">
                        {isPending && <th className="text-left p-2 w-8"></th>}
                        <th className="text-left p-2">Campo</th>
                        <th className="text-left p-2">Valor Actual</th>
                        <th className="text-left p-2">Valor Scrapeado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(mapped).map(([field, newVal]) => {
                        const currentVal = company?.[field];
                        const changed = formatValue(currentVal) !== formatValue(newVal);
                        return (
                          <tr key={field} className={changed ? 'bg-yellow-500/5' : ''}>
                            {isPending && (
                              <td className="p-2">
                                <Checkbox checked={selected.has(field)} onCheckedChange={() => toggleField(audit.id, field)} />
                              </td>
                            )}
                            <td className="p-2 font-medium">{FIELD_LABELS[field] || field}</td>
                            <td className="p-2 text-muted-foreground max-w-[200px] truncate">{formatValue(currentVal)}</td>
                            <td className={`p-2 max-w-[200px] truncate ${changed ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                              {formatValue(newVal)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {isPending && (
                  <div className="flex justify-end">
                    <Button size="sm" variant="outline" disabled={selected.size === 0 || approveAudit.isPending} onClick={() => handlePartialApprove(audit.id, scraped)}>
                      Aprobar Seleccionados ({selected.size})
                    </Button>
                  </div>
                )}
                {complaints.results && complaints.results.length > 0 && (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-muted-foreground">Ver quejas ({complaints.results.length})</summary>
                    <pre className="mt-1 p-2 bg-muted rounded overflow-auto max-h-32 text-[11px]">{JSON.stringify(complaints.results, null, 2)}</pre>
                  </details>
                )}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

export default function AuditReviewPanel() {
  return (
    <Tabs defaultValue="pending">
      <TabsList>
        <TabsTrigger value="pending">Pendientes</TabsTrigger>
        <TabsTrigger value="history" className="flex items-center gap-1">
          <History className="w-4 h-4" />Historial
        </TabsTrigger>
      </TabsList>
      <TabsContent value="pending">
        <AuditList statusFilter="pending" />
      </TabsContent>
      <TabsContent value="history">
        <AuditList statusFilter="history" />
      </TabsContent>
    </Tabs>
  );
}

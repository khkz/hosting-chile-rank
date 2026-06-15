import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { ExternalLink, RefreshCw, FileText, CheckCircle2, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type PriceCheck = {
  id: string;
  provider_id: string;
  fetched_at: string;
  source_url: string;
  raw_snippet: string | null;
  precio_detectado_clp: number | null;
  status: 'ok' | 'sin_cambios' | 'cambio_detectado' | 'extraccion_fallida';
  delta_pct: number | null;
  needs_review: boolean;
};

type ProviderRow = {
  id: string;
  name: string;
  slug: string;
  precio_url: string | null;
  precio_regular_clp: number | null;
  precio_periodo: string | null;
  precio_verificado_at: string | null;
  precio_fuente: string | null;
  lastCheck: PriceCheck | null;
};

function formatCLP(n: number | null | undefined): string {
  if (n == null) return '—';
  return `$${n.toLocaleString('es-CL')}`;
}

function statusBadge(status: PriceCheck['status'] | null) {
  if (!status) return <Badge variant="outline">sin datos</Badge>;
  switch (status) {
    case 'ok':
      return <Badge variant="secondary">primera lectura</Badge>;
    case 'sin_cambios':
      return <Badge variant="outline">sin cambios</Badge>;
    case 'cambio_detectado':
      return <Badge className="bg-amber-500 hover:bg-amber-500/90">cambio detectado</Badge>;
    case 'extraccion_fallida':
      return <Badge variant="destructive">extracción fallida</Badge>;
  }
}

export default function AdminPrecios() {
  const qc = useQueryClient();
  const [running, setRunning] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-precios'],
    queryFn: async (): Promise<ProviderRow[]> => {
      const { data: providers, error: pErr } = await supabase
        .from('hosting_companies')
        .select(
          'id, name, slug, precio_url, precio_regular_clp, precio_periodo, precio_verificado_at, precio_fuente'
        )
        .not('precio_url', 'is', null)
        .order('name', { ascending: true });
      if (pErr) throw pErr;

      const ids = (providers ?? []).map((p) => p.id);
      let lastByProvider = new Map<string, PriceCheck>();
      if (ids.length > 0) {
        const { data: checks, error: cErr } = await supabase
          .from('price_checks')
          .select('*')
          .in('provider_id', ids)
          .order('fetched_at', { ascending: false });
        if (cErr) throw cErr;
        for (const c of (checks ?? []) as PriceCheck[]) {
          if (!lastByProvider.has(c.provider_id)) lastByProvider.set(c.provider_id, c);
        }
      }

      return (providers ?? []).map((p) => ({
        ...(p as Omit<ProviderRow, 'lastCheck'>),
        lastCheck: lastByProvider.get(p.id) ?? null,
      }));
    },
  });

  const approve = useMutation({
    mutationFn: async (row: ProviderRow) => {
      if (!row.lastCheck?.precio_detectado_clp) {
        throw new Error('No hay precio detectado para aprobar');
      }
      const { error: uErr } = await supabase
        .from('hosting_companies')
        .update({
          precio_regular_clp: row.lastCheck.precio_detectado_clp,
          precio_verificado_at: new Date().toISOString(),
          precio_fuente: row.lastCheck.source_url,
        })
        .eq('id', row.id);
      if (uErr) throw uErr;
      const { error: mErr } = await supabase
        .from('price_checks')
        .update({ needs_review: false })
        .eq('id', row.lastCheck.id);
      if (mErr) throw mErr;
    },
    onSuccess: () => {
      toast.success('Precio actualizado y verificado');
      qc.invalidateQueries({ queryKey: ['admin-precios'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const dismiss = useMutation({
    mutationFn: async (row: ProviderRow) => {
      if (!row.lastCheck) return;
      const { error } = await supabase
        .from('price_checks')
        .update({ needs_review: false })
        .eq('id', row.lastCheck.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Revisión descartada');
      qc.invalidateQueries({ queryKey: ['admin-precios'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const runNow = async () => {
    setRunning(true);
    try {
      const { error } = await supabase.functions.invoke('price-monitor', { body: {} });
      if (error) throw error;
      toast.success('Monitor de precios ejecutado');
      qc.invalidateQueries({ queryKey: ['admin-precios'] });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setRunning(false);
    }
  };

  const pendingCount = (data ?? []).filter((r) => r.lastCheck?.needs_review).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold">Monitoreo de precios</h1>
            <p className="text-muted-foreground mt-1">
              Revisión humana antes de publicar. {pendingCount} pendiente{pendingCount === 1 ? '' : 's'} de revisión.
            </p>
          </div>
          <Button onClick={runNow} disabled={running}>
            <RefreshCw className={`w-4 h-4 mr-2 ${running ? 'animate-spin' : ''}`} />
            Ejecutar ahora
          </Button>
        </div>

        <Card className="p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proveedor</TableHead>
                <TableHead>Precio actual</TableHead>
                <TableHead>Último detectado</TableHead>
                <TableHead>Δ %</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Última revisión</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Cargando…
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && (data ?? []).length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No hay proveedores con <code>precio_url</code> configurado.
                  </TableCell>
                </TableRow>
              )}
              {(data ?? []).map((row) => {
                const c = row.lastCheck;
                const needs = !!c?.needs_review;
                return (
                  <TableRow
                    key={row.id}
                    className={needs ? 'bg-amber-500/10 hover:bg-amber-500/15' : ''}
                  >
                    <TableCell>
                      <div className="font-medium">{row.name}</div>
                      <a
                        href={row.precio_url ?? '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:underline inline-flex items-center gap-1"
                      >
                        URL <ExternalLink className="w-3 h-3" />
                      </a>
                    </TableCell>
                    <TableCell>
                      <div>{formatCLP(row.precio_regular_clp)}</div>
                      {row.precio_periodo && (
                        <div className="text-xs text-muted-foreground">/{row.precio_periodo}</div>
                      )}
                    </TableCell>
                    <TableCell>{formatCLP(c?.precio_detectado_clp ?? null)}</TableCell>
                    <TableCell>
                      {c?.delta_pct != null ? (
                        <span
                          className={
                            Math.abs(c.delta_pct) > 5
                              ? 'font-semibold text-amber-600'
                              : 'text-muted-foreground'
                          }
                        >
                          {c.delta_pct > 0 ? '+' : ''}
                          {c.delta_pct}%
                        </span>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                    <TableCell>{statusBadge(c?.status ?? null)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {c?.fetched_at ? new Date(c.fetched_at).toLocaleString('es-CL') : '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                        {c?.raw_snippet && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="ghost">
                                <FileText className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Snippet — {row.name}</DialogTitle>
                              </DialogHeader>
                              <div className="text-xs bg-muted p-3 rounded max-h-96 overflow-auto whitespace-pre-wrap break-words">
                                {c.raw_snippet}
                              </div>
                              <a
                                href={c.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                              >
                                Abrir fuente <ExternalLink className="w-3 h-3" />
                              </a>
                            </DialogContent>
                          </Dialog>
                        )}
                        <Button
                          size="sm"
                          disabled={!c?.precio_detectado_clp || approve.isPending}
                          onClick={() => approve.mutate(row)}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Aprobar
                        </Button>
                        {needs && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={dismiss.isPending}
                            onClick={() => dismiss.mutate(row)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Descartar
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>

        <p className="text-xs text-muted-foreground mt-4">
          El monitor se ejecuta semanalmente (lunes 09:00 UTC). Los precios nunca se publican
          automáticamente: requieren aprobación humana desde esta vista.
        </p>
      </div>
      <Footer />
    </div>
  );
}

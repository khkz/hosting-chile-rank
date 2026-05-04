import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { RefreshCw, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ADMIN_KEY = (import.meta.env.VITE_ADMIN_SECRET_KEY as string | undefined) ?? '';

interface Row {
  id: string;
  name: string;
  reputation_sync_enabled: boolean;
  last: { sentiment_score: number | null; severity: string | null; measured_at: string } | null;
}

export default function AdminReputation() {
  const [busy, setBusy] = useState<string | null>(null);

  const { data: rows, refetch } = useQuery<Row[]>({
    queryKey: ['admin-reputation'],
    queryFn: async () => {
      const { data: companies, error } = await supabase
        .from('hosting_companies')
        .select('id, name, reputation_sync_enabled')
        .eq('is_verified', true)
        .eq('is_curated', true)
        .order('name');
      if (error) throw error;

      const ids = (companies ?? []).map((c) => c.id);
      const { data: snaps } = await supabase
        .from('reputation_snapshots' as never)
        .select('company_id, sentiment_score, severity, measured_at')
        .in('company_id', ids)
        .order('measured_at', { ascending: false });

      const lastByCompany = new Map<string, Row['last']>();
      (snaps as Array<{ company_id: string; sentiment_score: number | null; severity: string | null; measured_at: string }> | null)?.forEach((s) => {
        if (!lastByCompany.has(s.company_id)) {
          lastByCompany.set(s.company_id, {
            sentiment_score: s.sentiment_score,
            severity: s.severity,
            measured_at: s.measured_at,
          });
        }
      });

      return (companies ?? []).map((c) => ({
        ...(c as Row),
        last: lastByCompany.get(c.id) ?? null,
      }));
    },
  });

  const refresh = async (companyId?: string) => {
    if (!ADMIN_KEY) {
      toast.error('Falta VITE_ADMIN_SECRET_KEY');
      return;
    }
    setBusy(companyId ?? 'all');
    try {
      const { data, error } = await supabase.functions.invoke('refresh-reputation', {
        body: companyId ? { company_id: companyId } : { all: true },
        headers: { 'x-admin-api-key': ADMIN_KEY },
      });
      if (error) throw error;
      toast.success(`Procesado: ${(data as { processed?: number })?.processed ?? 0}`);
      refetch();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error';
      toast.error(msg);
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-3xl font-bold">Sincronización de reputación</h1>
          <Button onClick={() => refresh()} disabled={busy === 'all'} className="min-h-[44px]">
            {busy === 'all' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Refrescar todos
          </Button>
        </div>

        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3">Proveedor</th>
                <th className="text-left p-3">Score</th>
                <th className="text-left p-3">Severidad</th>
                <th className="text-left p-3">Última sync</th>
                <th className="text-right p-3">Acción</th>
              </tr>
            </thead>
            <tbody>
              {rows?.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3 font-medium">{r.name}</td>
                  <td className="p-3">{r.last?.sentiment_score ?? '—'}</td>
                  <td className="p-3">{r.last?.severity ? <Badge variant="outline">{r.last.severity}</Badge> : '—'}</td>
                  <td className="p-3 text-muted-foreground">
                    {r.last?.measured_at ? new Date(r.last.measured_at).toLocaleString('es-CL') : 'Nunca'}
                  </td>
                  <td className="p-3 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busy === r.id}
                      onClick={() => refresh(r.id)}
                      className="min-h-[44px]"
                    >
                      {busy === r.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Refrescar'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </main>
      <Footer />
    </>
  );
}

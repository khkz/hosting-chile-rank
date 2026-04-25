import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CheckResult {
  url: string;
  ok: boolean;
  status?: number;
  error?: string;
  urlCount?: number;
  missingRoutes?: string[];
}

interface MonitorResponse {
  ok: boolean;
  checkedAt: string;
  summary: { total: number; passed: number; failed: number; totalUrls: number };
  results: CheckResult[];
}

export default function SitemapMonitorPanel() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<MonitorResponse | null>(null);

  const runMonitor = async () => {
    setLoading(true);
    try {
      const { data: res, error } = await supabase.functions.invoke('sitemap-monitor');
      if (error) throw error;
      setData(res as MonitorResponse);
      if ((res as MonitorResponse).ok) {
        toast.success('Sitemaps verificados correctamente');
      } else {
        toast.error(
          `${(res as MonitorResponse).summary.failed} sitemap(s) con problemas`
        );
      }
    } catch (err) {
      toast.error('Error al ejecutar monitor: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <RefreshCw className="w-5 h-5" /> Monitor de Sitemaps
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Valida que sitemap.xml y sus hijos contengan las rutas críticas
            (transparencia, /vs/*, ranking, catálogo, reclamos).
          </p>
        </div>
        <Button onClick={runMonitor} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verificando...
            </>
          ) : (
            'Ejecutar ahora'
          )}
        </Button>
      </div>

      {data && (
        <div className="space-y-3 mt-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Última verificación:</span>
            <span>{new Date(data.checkedAt).toLocaleString('es-CL')}</span>
            <Badge variant={data.ok ? 'default' : 'destructive'}>
              {data.ok ? 'OK' : 'FALLOS'}
            </Badge>
            <span className="text-muted-foreground ml-auto">
              {data.summary.totalUrls} URLs en sitemaps
            </span>
          </div>

          <div className="space-y-2">
            {data.results.map((r) => (
              <div
                key={r.url}
                className={`p-3 rounded-md border text-sm ${
                  r.ok
                    ? 'bg-primary/5 border-primary/20'
                    : 'bg-destructive/5 border-destructive/30'
                }`}
              >
                <div className="flex items-start gap-2">
                  {r.ok ? (
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <code className="text-xs break-all">{r.url}</code>
                    <div className="text-xs text-muted-foreground mt-1">
                      Status: {r.status ?? 'n/a'} · URLs: {r.urlCount ?? 0}
                    </div>
                    {r.error && (
                      <div className="text-xs text-destructive mt-1 font-medium">
                        {r.error}
                      </div>
                    )}
                    {r.missingRoutes && r.missingRoutes.length > 0 && (
                      <ul className="text-xs text-destructive mt-1 list-disc pl-4">
                        {r.missingRoutes.map((m) => (
                          <li key={m}>{m}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

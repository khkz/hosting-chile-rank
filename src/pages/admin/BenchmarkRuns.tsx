import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

interface Run {
  id: string;
  run_date: string;
  status: string;
  total_providers: number;
  methodology_version: string;
  notes: string | null;
}

const BenchmarkRuns: React.FC = () => {
  const [runs, setRuns] = useState<Run[]>([]);
  const [adminKey, setAdminKey] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("benchmark_runs")
      .select("*")
      .order("run_date", { ascending: false })
      .limit(20);
    setRuns((data as Run[]) ?? []);
  };

  useEffect(() => { load(); }, []);

  const trigger = async () => {
    if (!adminKey) {
      toast.error("Ingresa la admin key");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("run-benchmark", {
        headers: { "x-admin-api-key": adminKey },
      });
      if (error) throw error;
      toast.success(`Run lanzado: ${(data as any)?.run_id ?? "ok"}`);
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Admin · Benchmark Runs</title></Helmet>
      <main className="container max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">Benchmark — Ejecuciones</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Lanzar nuevo run</CardTitle>
            <CardDescription>
              Ejecuta TTFB×5, PageSpeed Insights y cálculo de uptime para todas las empresas con
              <code className="mx-1">benchmark_enabled = true</code>. Tarda varios minutos.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Input
              type="password"
              placeholder="x-admin-api-key"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
            />
            <Button onClick={trigger} disabled={loading} className="min-h-11">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
              Ejecutar ahora
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Histórico</CardTitle></CardHeader>
          <CardContent>
            {runs.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aún no hay ejecuciones.</p>
            ) : (
              <ul className="space-y-2">
                {runs.map((r) => (
                  <li key={r.id} className="flex items-center justify-between border-b pb-2 text-sm">
                    <div>
                      <p className="font-medium">
                        {format(new Date(r.run_date), "d MMM yyyy HH:mm", { locale: es })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {r.methodology_version} · {r.total_providers} proveedores
                        {r.notes && ` · ${r.notes}`}
                      </p>
                    </div>
                    <Badge variant={r.status === "completed" ? "default" : r.status === "failed" ? "destructive" : "secondary"}>
                      {r.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
};

export default BenchmarkRuns;

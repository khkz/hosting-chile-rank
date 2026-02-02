import { useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Play, Pause, StopCircle, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface BatchResult {
  domain: string;
  score: number | null;
  status: "success" | "error" | "skipped";
  error?: string;
}

interface Props {
  pendingCount: number;
}

export function BatchAnalyzePanel({ pendingCount }: Props) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState({ processed: 0, total: 0, current: "" });
  const [lastResult, setLastResult] = useState<BatchResult | null>(null);
  const [stats, setStats] = useState({ success: 0, failed: 0 });
  
  const stopRef = useRef(false);
  const pauseRef = useRef(false);

  const runBatch = useCallback(async (retryCount = 0): Promise<number> => {
    const BATCH_SIZE = 3; // Reduced to fit within Edge Function timeout (~24s)
    const DELAY_MS = 2000;
    const MAX_RETRIES = 2;

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        toast({ title: "Error", description: "Sesión no válida", variant: "destructive" });
        return -1;
      }

      // AbortController with 25s timeout (Edge Function times out at ~26s)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const response = await fetch(
        `https://oegvwjxrlmtwortyhsrv.supabase.co/functions/v1/batch-analyze-domains`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.session.access_token}`,
          },
          body: JSON.stringify({
            batch_size: BATCH_SIZE,
            delay_ms: DELAY_MS,
            enrich_first: true,
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();

      // Update stats
      const successCount = data.results?.filter((r: BatchResult) => r.status === "success").length || 0;
      const failedCount = data.results?.filter((r: BatchResult) => r.status === "error").length || 0;

      setStats((prev) => ({
        success: prev.success + successCount,
        failed: prev.failed + failedCount,
      }));

      setProgress((prev) => ({
        processed: prev.processed + data.processed,
        total: pendingCount,
        current: data.results?.[data.results.length - 1]?.domain || "",
      }));

      if (data.results?.length > 0) {
        setLastResult(data.results[data.results.length - 1]);
      }

      // Refresh the table
      queryClient.invalidateQueries({ queryKey: ["domain-opportunities"] });
      queryClient.invalidateQueries({ queryKey: ["domain-sniper-stats"] });

      return data.remaining;
    } catch (error) {
      console.error("Batch error:", error);
      
      // Check if it's a timeout/abort error and retry
      const isTimeoutError = error instanceof Error && 
        (error.name === "AbortError" || error.message.includes("Failed to fetch"));
      
      if (isTimeoutError && retryCount < MAX_RETRIES) {
        console.log(`Retrying batch (attempt ${retryCount + 2})...`);
        await new Promise(r => setTimeout(r, 3000)); // Wait 3s before retry
        return runBatch(retryCount + 1);
      }
      
      toast({
        title: "Error en el análisis",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      });
      return -1;
    }
  }, [pendingCount, toast, queryClient]);

  const startAnalysis = async () => {
    setIsRunning(true);
    setIsPaused(false);
    stopRef.current = false;
    pauseRef.current = false;
    setProgress({ processed: 0, total: pendingCount, current: "" });
    setStats({ success: 0, failed: 0 });
    setLastResult(null);

    let remaining = pendingCount;

    while (remaining > 0 && !stopRef.current) {
      // Check for pause
      while (pauseRef.current && !stopRef.current) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      if (stopRef.current) break;

      remaining = await runBatch();

      if (remaining === -1) {
        // Error occurred
        break;
      }
    }

    setIsRunning(false);
    setIsPaused(false);

    if (remaining === 0) {
      toast({
        title: "✅ Análisis completado",
        description: `${stats.success + (lastResult?.status === "success" ? 1 : 0)} dominios analizados exitosamente`,
      });
    }
  };

  const pauseAnalysis = () => {
    pauseRef.current = true;
    setIsPaused(true);
  };

  const resumeAnalysis = () => {
    pauseRef.current = false;
    setIsPaused(false);
  };

  const stopAnalysis = () => {
    stopRef.current = true;
    setIsRunning(false);
    setIsPaused(false);
  };

  const progressPercent = progress.total > 0 ? (progress.processed / progress.total) * 100 : 0;
  // Updated ETA: ~8s per domain with batch size of 3
  const eta = progress.total > 0 && progress.processed > 0
    ? Math.ceil(((progress.total - progress.processed) * 8) / 60)
    : null;

  if (pendingCount === 0 && !isRunning) {
    return null;
  }

  return (
    <Card className="p-4 mb-4 border-primary/20 bg-primary/5">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Análisis Masivo con IA</h3>
          </div>
          
          {!isRunning ? (
            <Button onClick={startAnalysis} disabled={pendingCount === 0}>
              <Play className="w-4 h-4 mr-2" />
              Analizar {pendingCount} dominios
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              {isPaused ? (
                <Button variant="outline" size="sm" onClick={resumeAnalysis}>
                  <Play className="w-4 h-4 mr-1" />
                  Continuar
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={pauseAnalysis}>
                  <Pause className="w-4 h-4 mr-1" />
                  Pausar
                </Button>
              )}
              <Button variant="destructive" size="sm" onClick={stopAnalysis}>
                <StopCircle className="w-4 h-4 mr-1" />
                Detener
              </Button>
            </div>
          )}
        </div>

        {isRunning && (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Progreso: {progress.processed}/{progress.total}
                </span>
                {eta && (
                  <span className="text-muted-foreground">
                    ETA: ~{eta} min
                  </span>
                )}
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  {stats.success} éxitos
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <XCircle className="w-3 h-3 text-red-500" />
                  {stats.failed} errores
                </Badge>
              </div>

              {lastResult && (
                <div className="flex items-center gap-2">
                  {isPaused ? (
                    <Pause className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  )}
                  <span className="text-muted-foreground">
                    Último: <span className="font-medium">{lastResult.domain}</span>
                    {lastResult.score !== null && (
                      <span className="ml-1 text-primary">→ {lastResult.score.toFixed(1)}</span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </>
        )}

        {!isRunning && pendingCount > 0 && (
          <p className="text-sm text-muted-foreground">
            Se analizarán en lotes de 3 dominios con enriquecimiento de datos históricos de Wayback Machine.
            Tiempo estimado: ~{Math.ceil((pendingCount * 8) / 60)} minutos.
          </p>
        )}
      </div>
    </Card>
  );
}

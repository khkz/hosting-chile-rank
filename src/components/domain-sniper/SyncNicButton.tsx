import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Check, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface SyncResult {
  success: boolean;
  found?: number;
  inserted?: number;
  skipped?: number;
  timestamp?: string;
  error?: string;
}

export function SyncNicButton() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<SyncResult | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke<SyncResult>(
        "sync-deleted-domains",
        { method: "POST" }
      );

      if (error) throw error;

      if (data?.success) {
        setLastSync(data);
        toast({
          title: "Sincronización completada",
          description: `${data.inserted} nuevos dominios agregados, ${data.skipped} ya existían`,
        });
        // Refresh the opportunities table
        queryClient.invalidateQueries({ queryKey: ["domain-opportunities"] });
        queryClient.invalidateQueries({ queryKey: ["domain-sniper-stats"] });
      } else {
        throw new Error(data?.error || "Error desconocido");
      }
    } catch (error) {
      console.error("Sync error:", error);
      toast({
        title: "Error de sincronización",
        description: error instanceof Error ? error.message : "No se pudo conectar con NIC.cl",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={handleSync}
        disabled={isSyncing}
        variant="outline"
        className="gap-2"
      >
        <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
        {isSyncing ? "Sincronizando..." : "Sincronizar NIC.cl"}
      </Button>
      
      {lastSync && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {lastSync.success ? (
            <>
              <Check className="w-4 h-4 text-green-500" />
              <span>
                {lastSync.found} encontrados • {lastSync.inserted} nuevos
              </span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span>Error en sincronización</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

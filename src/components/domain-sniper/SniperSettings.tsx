import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AutoSniperToggle } from "./AutoSniperToggle";
import { Settings, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

interface SniperSettingsData {
  id: string;
  auto_sniper_enabled: boolean;
  min_score_auto_buy: number;
  daily_budget: number;
  max_domain_price: number;
  notify_email: string | null;
}

export function SniperSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<SniperSettingsData>>({});

  const { data: settings, isLoading } = useQuery({
    queryKey: ["sniper-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("domain_sniper_settings")
        .select("*")
        .single();

      if (error) throw error;
      return data as SniperSettingsData;
    },
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<SniperSettingsData>) => {
      if (!settings?.id) throw new Error("No settings found");
      const { error } = await supabase
        .from("domain_sniper_settings")
        .update(updates)
        .eq("id", settings.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sniper-settings"] });
      toast({ title: "Configuración guardada" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración",
        variant: "destructive",
      });
    },
  });

  const handleToggleAutoSniper = (enabled: boolean) => {
    updateMutation.mutate({ auto_sniper_enabled: enabled });
  };

  const handleSave = () => {
    const updates: Partial<SniperSettingsData> = {
      min_score_auto_buy: parseFloat(formData.min_score_auto_buy?.toString() || "9"),
      daily_budget: parseInt(formData.daily_budget?.toString() || "100000", 10),
      max_domain_price: parseInt(formData.max_domain_price?.toString() || "50000", 10),
      notify_email: formData.notify_email || null,
    };
    updateMutation.mutate(updates);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-12">
        <Settings className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Error al cargar configuración</h3>
        <p className="text-muted-foreground">
          No se encontró la configuración del sniper.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AutoSniperToggle
        enabled={settings.auto_sniper_enabled}
        onToggle={handleToggleAutoSniper}
        minScore={settings.min_score_auto_buy}
        dailyBudget={settings.daily_budget}
      />

      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Parámetros del Auto-Sniper</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="min-score">Score mínimo para auto-compra</Label>
            <Input
              id="min-score"
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={formData.min_score_auto_buy ?? 9}
              onChange={(e) =>
                setFormData({ ...formData, min_score_auto_buy: parseFloat(e.target.value) })
              }
            />
            <p className="text-sm text-muted-foreground">
              Solo se comprarán dominios con score igual o superior a este valor.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="daily-budget">Presupuesto diario (CLP)</Label>
            <Input
              id="daily-budget"
              type="number"
              min="0"
              step="10000"
              value={formData.daily_budget ?? 100000}
              onChange={(e) =>
                setFormData({ ...formData, daily_budget: parseInt(e.target.value, 10) })
              }
            />
            <p className="text-sm text-muted-foreground">
              Monto máximo a gastar en compras automáticas por día.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-price">Precio máximo por dominio (CLP)</Label>
            <Input
              id="max-price"
              type="number"
              min="0"
              step="5000"
              value={formData.max_domain_price ?? 50000}
              onChange={(e) =>
                setFormData({ ...formData, max_domain_price: parseInt(e.target.value, 10) })
              }
            />
            <p className="text-sm text-muted-foreground">
              No se comprarán dominios que superen este precio.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notify-email">Email para notificaciones</Label>
            <Input
              id="notify-email"
              type="email"
              placeholder="admin@ejemplo.cl"
              value={formData.notify_email ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, notify_email: e.target.value })
              }
            />
            <p className="text-sm text-muted-foreground">
              Recibirás notificaciones de compras automáticas.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSave} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar configuración
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ShoppingCart, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PurchaseDialogProps {
  domainName: string;
  estimatedPrice?: number;
  onPurchased: () => void;
}

export function PurchaseDialog({ domainName, estimatedPrice, onPurchased }: PurchaseDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const { toast } = useToast();

  const parts = domainName.split(".");
  const domain = parts.slice(0, -1).join(".");
  const extension = parts[parts.length - 1];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handlePurchase = async () => {
    if (confirmText !== domainName) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("openprovider-domain-purchase", {
        body: { domain, extension },
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "¡Compra exitosa!",
          description: `${domainName} ha sido registrado. Order ID: ${data.order_id}`,
        });
        setOpen(false);
        setConfirmText("");
        onPurchased();
      } else {
        throw new Error(data.error || "Error en la compra");
      }
    } catch (error) {
      console.error("Purchase error:", error);
      toast({
        title: "Error en la compra",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1">
          <ShoppingCart className="w-4 h-4" />
          Comprar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Comprar Dominio
          </DialogTitle>
          <DialogDescription>
            Estás a punto de registrar el dominio <strong>{domainName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dominio:</span>
              <span className="font-medium">{domainName}</span>
            </div>
            {estimatedPrice && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Precio estimado:</span>
                <span className="font-medium">{formatCurrency(estimatedPrice)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Período:</span>
              <span className="font-medium">1 año</span>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Esta acción generará un cargo real en tu cuenta de OpenProvider.
              Asegúrate de tener fondos suficientes.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-domain">
              Escribe el nombre del dominio para confirmar:
            </Label>
            <Input
              id="confirm-domain"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={domainName}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            onClick={handlePurchase}
            disabled={isLoading || confirmText !== domainName}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Confirmar Compra
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

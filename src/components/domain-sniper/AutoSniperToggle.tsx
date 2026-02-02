import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Bot, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AutoSniperToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  minScore: number;
  dailyBudget: number;
}

export function AutoSniperToggle({ enabled, onToggle, minScore, dailyBudget }: AutoSniperToggleProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleToggle = (checked: boolean) => {
    if (checked) {
      setShowConfirmDialog(true);
    } else {
      onToggle(false);
    }
  };

  const handleConfirm = () => {
    if (confirmText.toUpperCase() === "CONFIRMAR") {
      onToggle(true);
      setShowConfirmDialog(false);
      setConfirmText("");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <div
        className={cn(
          "flex items-center gap-3 p-4 rounded-lg border transition-colors",
          enabled
            ? "bg-primary/10 border-primary"
            : "bg-muted/50 border-border"
        )}
      >
        <Bot className={cn("w-5 h-5", enabled ? "text-primary" : "text-muted-foreground")} />
        <div className="flex-1">
          <Label htmlFor="auto-sniper" className="font-medium cursor-pointer">
            Auto-Sniper Mode
          </Label>
          <p className="text-sm text-muted-foreground">
            {enabled
              ? `Comprando automáticamente dominios con score ≥ ${minScore}`
              : "Activar compra automática de dominios de alto valor"}
          </p>
        </div>
        <Switch
          id="auto-sniper"
          checked={enabled}
          onCheckedChange={handleToggle}
        />
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Activar Auto-Sniper Mode
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                Estás a punto de activar la compra automática de dominios.
                El sistema comprará automáticamente cualquier dominio con:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>AI Score mayor o igual a <strong>{minScore}</strong></li>
                <li>Presupuesto diario máximo: <strong>{formatCurrency(dailyBudget)}</strong></li>
              </ul>
              <p className="text-yellow-600 dark:text-yellow-400 font-medium">
                ⚠️ Esta acción puede generar cargos reales en tu cuenta.
              </p>
              <div className="pt-2">
                <Label htmlFor="confirm-input" className="text-sm font-medium">
                  Escribe "CONFIRMAR" para activar:
                </Label>
                <Input
                  id="confirm-input"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="CONFIRMAR"
                  className="mt-2"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmText("")}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={confirmText.toUpperCase() !== "CONFIRMAR"}
            >
              Activar Auto-Sniper
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

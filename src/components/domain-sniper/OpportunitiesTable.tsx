import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScoreBadge } from "./ScoreBadge";
import { AnalyzeButton } from "./AnalyzeButton";
import { PurchaseDialog } from "./PurchaseDialog";
import { Eye, Trash2, Clock, CheckCircle, XCircle, ShoppingBag, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

type DomainOpportunityStatus = "pending_analysis" | "analyzed" | "discarded" | "queued_for_buy" | "purchased" | "failed";

interface DomainOpportunity {
  id: string;
  domain_name: string;
  tld: string | null;
  source: string | null;
  expiration_date: string | null;
  status: DomainOpportunityStatus;
  ai_score: number | null;
  ai_category: string | null;
  ai_rationale: string | null;
  estimated_value: number | null;
  detected_at: string | null;
  analyzed_at: string | null;
}

const statusConfig: Record<DomainOpportunityStatus, { label: string; icon: React.ReactNode; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending_analysis: { label: "Pendiente", icon: <Clock className="w-3 h-3" />, variant: "secondary" },
  analyzed: { label: "Analizado", icon: <CheckCircle className="w-3 h-3" />, variant: "default" },
  discarded: { label: "Descartado", icon: <XCircle className="w-3 h-3" />, variant: "outline" },
  queued_for_buy: { label: "En cola", icon: <ShoppingBag className="w-3 h-3" />, variant: "default" },
  purchased: { label: "Comprado", icon: <CheckCircle className="w-3 h-3" />, variant: "default" },
  failed: { label: "Fallido", icon: <AlertCircle className="w-3 h-3" />, variant: "destructive" },
};

export function OpportunitiesTable() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: opportunities, isLoading } = useQuery({
    queryKey: ["domain-opportunities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("domain_opportunities")
        .select("*")
        .order("ai_score", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as DomainOpportunity[];
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleDiscard = async (id: string) => {
    const { error } = await supabase
      .from("domain_opportunities")
      .update({ status: "discarded" as DomainOpportunityStatus })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo descartar el dominio",
        variant: "destructive",
      });
    } else {
      queryClient.invalidateQueries({ queryKey: ["domain-opportunities"] });
      toast({ title: "Dominio descartado" });
    }
  };

  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ["domain-opportunities"] });
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!opportunities?.length) {
    return (
      <div className="text-center py-12">
        <Eye className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Sin oportunidades detectadas</h3>
        <p className="text-muted-foreground">
          Los dominios que detectes aparecerán aquí para ser analizados.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Dominio</TableHead>
            <TableHead>Score IA</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Valor Est.</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Detectado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {opportunities.map((opp) => {
            const status = statusConfig[opp.status];
            return (
              <TableRow key={opp.id}>
                <TableCell className="font-medium">
                  {opp.domain_name}
                  {opp.source && (
                    <span className="text-xs text-muted-foreground ml-2">
                      ({opp.source})
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <ScoreBadge score={opp.ai_score} />
                </TableCell>
                <TableCell>
                  {opp.ai_category ? (
                    <Badge variant="outline">{opp.ai_category}</Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {opp.estimated_value ? (
                    formatCurrency(opp.estimated_value)
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={status.variant} className="gap-1">
                    {status.icon}
                    {status.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {opp.detected_at
                    ? format(new Date(opp.detected_at), "dd MMM yyyy", { locale: es })
                    : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <AnalyzeButton
                      domainName={opp.domain_name}
                      isAnalyzed={opp.status === "analyzed"}
                      onAnalyzed={refreshData}
                    />
                    {opp.status === "analyzed" && opp.ai_score && opp.ai_score >= 5 && (
                      <PurchaseDialog
                        domainName={opp.domain_name}
                        estimatedPrice={opp.estimated_value || undefined}
                        onPurchased={refreshData}
                      />
                    )}
                    {opp.status !== "purchased" && opp.status !== "discarded" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDiscard(opp.id)}
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

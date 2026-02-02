import { useState, useMemo } from "react";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScoreBadge } from "./ScoreBadge";
import { AnalyzeButton } from "./AnalyzeButton";
import { PurchaseDialog } from "./PurchaseDialog";
import { DataStatusBadge } from "./DataStatusBadge";
import { EnrichmentStats } from "./EnrichmentStats";
import { QuickFilters, FilterType } from "./QuickFilters";
import { Eye, Trash2, Clock, CheckCircle, XCircle, ShoppingBag, AlertCircle, Camera, Globe } from "lucide-react";
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
  wayback_snapshots: number | null;
  wayback_first_seen: string | null;
  wayback_last_seen: string | null;
  wayback_content_type: string | null;
  had_website: boolean | null;
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
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const { data: opportunities, isLoading } = useQuery({
    queryKey: ["domain-opportunities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("domain_opportunities")
        .select("id, domain_name, tld, source, expiration_date, status, ai_score, ai_category, ai_rationale, estimated_value, detected_at, analyzed_at, wayback_snapshots, wayback_first_seen, wayback_last_seen, wayback_content_type, had_website")
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

  // Calculate stats and filter counts
  const stats = useMemo(() => {
    if (!opportunities) return { total: 0, enriched: 0, analyzed: 0, withWebsite: 0 };
    return {
      total: opportunities.length,
      enriched: opportunities.filter(o => o.wayback_snapshots && o.wayback_snapshots > 0).length,
      analyzed: opportunities.filter(o => o.status === "analyzed").length,
      withWebsite: opportunities.filter(o => o.had_website).length,
    };
  }, [opportunities]);

  const filterCounts = useMemo(() => {
    if (!opportunities) return { all: 0, withWeb: 0, highScore: 0, pending: 0, discarded: 0 };
    return {
      all: opportunities.length,
      withWeb: opportunities.filter(o => o.had_website || (o.wayback_snapshots && o.wayback_snapshots > 0)).length,
      highScore: opportunities.filter(o => o.ai_score && o.ai_score >= 7).length,
      pending: opportunities.filter(o => o.status === "pending_analysis").length,
      discarded: opportunities.filter(o => o.status === "discarded").length,
    };
  }, [opportunities]);

  // Filter and sort opportunities
  const filteredOpportunities = useMemo(() => {
    if (!opportunities) return [];
    
    let filtered = opportunities;
    
    switch (activeFilter) {
      case "with_web":
        filtered = opportunities.filter(o => o.had_website || (o.wayback_snapshots && o.wayback_snapshots > 0));
        break;
      case "high_score":
        filtered = opportunities.filter(o => o.ai_score && o.ai_score >= 7);
        break;
      case "pending":
        filtered = opportunities.filter(o => o.status === "pending_analysis");
        break;
      case "discarded":
        filtered = opportunities.filter(o => o.status === "discarded");
        break;
    }

    // Sort: prioritize score + web history
    return [...filtered].sort((a, b) => {
      const aHasWeb = a.had_website || (a.wayback_snapshots && a.wayback_snapshots > 0);
      const bHasWeb = b.had_website || (b.wayback_snapshots && b.wayback_snapshots > 0);
      const aScore = a.ai_score || 0;
      const bScore = b.ai_score || 0;

      // Priority: high score + web > high score > web only > nothing
      const aPriority = (aScore >= 7 ? 2 : 0) + (aHasWeb ? 1 : 0);
      const bPriority = (bScore >= 7 ? 2 : 0) + (bHasWeb ? 1 : 0);

      if (bPriority !== aPriority) return bPriority - aPriority;
      return bScore - aScore;
    });
  }, [opportunities, activeFilter]);

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
    <TooltipProvider>
      <div className="space-y-4">
        {/* Stats Cards */}
        <EnrichmentStats
          total={stats.total}
          enriched={stats.enriched}
          analyzed={stats.analyzed}
          withWebsite={stats.withWebsite}
        />

        {/* Quick Filters */}
        <QuickFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={filterCounts}
        />

        {/* Table */}
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dominio</TableHead>
                <TableHead>Datos</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Wayback</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Valor Est.</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOpportunities.map((opp) => {
                const hasAiAnalysis = opp.status === "analyzed";
                const hasWaybackData = (opp.wayback_snapshots ?? 0) > 0;
              const status = statusConfig[opp.status];
              return (
                <TableRow key={opp.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {opp.had_website && (
                        <Globe className="w-3 h-3 text-green-500 flex-shrink-0" />
                      )}
                      <span>{opp.domain_name}</span>
                    </div>
                    {opp.source && (
                      <span className="text-xs text-muted-foreground block">
                        {opp.source}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DataStatusBadge
                      hasAiAnalysis={hasAiAnalysis}
                      hasWaybackData={hasWaybackData}
                      waybackSnapshots={opp.wayback_snapshots}
                    />
                  </TableCell>
                  <TableCell>
                    <ScoreBadge score={opp.ai_score} />
                  </TableCell>
                  <TableCell>
                    {opp.wayback_snapshots && opp.wayback_snapshots > 0 ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="outline" className="gap-1 cursor-help">
                            <Camera className="w-3 h-3" />
                            {opp.wayback_snapshots}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs space-y-1">
                            <p><strong>Tipo:</strong> {opp.wayback_content_type || "desconocido"}</p>
                            {opp.wayback_first_seen && (
                              <p><strong>Desde:</strong> {format(new Date(opp.wayback_first_seen), "MMM yyyy", { locale: es })}</p>
                            )}
                            {opp.wayback_last_seen && (
                              <p><strong>Hasta:</strong> {format(new Date(opp.wayback_last_seen), "MMM yyyy", { locale: es })}</p>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <span className="text-muted-foreground text-xs">Sin historial</span>
                    )}
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
      </div>
    </TooltipProvider>
  );
}

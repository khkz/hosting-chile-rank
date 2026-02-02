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
import { PageRankBadge } from "./PageRankBadge";
import { FetchPageRankButton } from "./FetchPageRankButton";
import { Eye, Trash2, Clock, CheckCircle, XCircle, ShoppingBag, AlertCircle, Camera, Globe, ArrowUp, ArrowDown } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

type DomainOpportunityStatus = "pending_analysis" | "analyzed" | "discarded" | "queued_for_buy" | "purchased" | "failed";
type SortField = "domain" | "page_rank" | "age" | "ai_score" | "wayback" | "estimated_value";
type SortDirection = "asc" | "desc";

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
  page_rank: number | null;
  page_rank_updated_at: string | null;
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
  const [sortField, setSortField] = useState<SortField>("ai_score");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const SortableHeader = ({ field, label }: { field: SortField; label: string }) => (
    <TableHead 
      className="cursor-pointer hover:bg-muted/50 select-none transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        {sortField === field && (
          sortDirection === "desc" 
            ? <ArrowDown className="w-3 h-3" />
            : <ArrowUp className="w-3 h-3" />
        )}
      </div>
    </TableHead>
  );

  const { data: opportunities, isLoading } = useQuery({
    queryKey: ["domain-opportunities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("domain_opportunities")
        .select("id, domain_name, tld, source, expiration_date, status, ai_score, ai_category, ai_rationale, estimated_value, detected_at, analyzed_at, wayback_snapshots, wayback_first_seen, wayback_last_seen, wayback_content_type, had_website, page_rank, page_rank_updated_at")
        .order("ai_score", { ascending: false, nullsFirst: false })
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

    // Apply user-selected sorting
    return [...filtered].sort((a, b) => {
      let aVal: number | string;
      let bVal: number | string;
      
      switch (sortField) {
        case "domain":
          aVal = a.domain_name.toLowerCase();
          bVal = b.domain_name.toLowerCase();
          break;
        case "page_rank":
          aVal = a.page_rank ?? -1;
          bVal = b.page_rank ?? -1;
          break;
        case "age":
          // For age, older = higher priority, so we use negative timestamp
          aVal = a.wayback_first_seen ? new Date(a.wayback_first_seen).getTime() : Number.MAX_SAFE_INTEGER;
          bVal = b.wayback_first_seen ? new Date(b.wayback_first_seen).getTime() : Number.MAX_SAFE_INTEGER;
          // For "desc" we want oldest first (smallest timestamp)
          if (sortDirection === "desc") {
            return aVal - bVal;
          }
          return bVal - aVal;
        case "ai_score":
          aVal = a.ai_score ?? -1;
          bVal = b.ai_score ?? -1;
          break;
        case "wayback":
          aVal = a.wayback_snapshots ?? 0;
          bVal = b.wayback_snapshots ?? 0;
          break;
        case "estimated_value":
          aVal = a.estimated_value ?? 0;
          bVal = b.estimated_value ?? 0;
          break;
        default:
          return 0;
      }
      
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc" 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      return sortDirection === "asc" 
        ? (aVal as number) - (bVal as number) 
        : (bVal as number) - (aVal as number);
    });
  }, [opportunities, activeFilter, sortField, sortDirection]);

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
                <SortableHeader field="domain" label="Dominio" />
                <TableHead>Datos</TableHead>
                <SortableHeader field="page_rank" label="PR" />
                <SortableHeader field="age" label="Edad" />
                <SortableHeader field="ai_score" label="Score" />
                <SortableHeader field="wayback" label="Wayback" />
                <TableHead>Categoría</TableHead>
                <SortableHeader field="estimated_value" label="Valor Est." />
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
                    <PageRankBadge 
                      pageRank={opp.page_rank} 
                      updatedAt={opp.page_rank_updated_at} 
                    />
                  </TableCell>
                  <TableCell>
                    {opp.wayback_first_seen ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-sm font-medium">
                            {Math.floor((new Date().getTime() - new Date(opp.wayback_first_seen).getTime()) / (1000 * 60 * 60 * 24 * 365))}a
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Desde {format(new Date(opp.wayback_first_seen), "MMM yyyy", { locale: es })}</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </TableCell>
                  <TableCell>
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
                  <div className="flex items-center justify-end gap-1">
                    <FetchPageRankButton
                      domainName={opp.domain_name}
                      hasPageRank={opp.page_rank !== null}
                    />
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

import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle, Clock, XCircle } from "lucide-react";

interface DataStatusBadgeProps {
  hasAiAnalysis: boolean;
  hasWaybackData: boolean;
  waybackSnapshots?: number | null;
}

type DataStatus = "complete" | "ai_only" | "wayback_only" | "pending";

const statusConfig: Record<DataStatus, { label: string; variant: "default" | "secondary" | "outline"; description: string }> = {
  complete: { 
    label: "Completo", 
    variant: "default",
    description: "Tiene análisis IA y datos históricos de Wayback" 
  },
  ai_only: { 
    label: "Solo IA", 
    variant: "secondary",
    description: "Analizado con IA, pendiente enriquecimiento Wayback" 
  },
  wayback_only: { 
    label: "Solo Web", 
    variant: "secondary",
    description: "Datos Wayback disponibles, pendiente análisis IA" 
  },
  pending: { 
    label: "Pendiente", 
    variant: "outline",
    description: "Sin análisis IA ni datos Wayback" 
  },
};

function getDataStatus(hasAiAnalysis: boolean, hasWaybackData: boolean): DataStatus {
  if (hasAiAnalysis && hasWaybackData) return "complete";
  if (hasAiAnalysis) return "ai_only";
  if (hasWaybackData) return "wayback_only";
  return "pending";
}

export function DataStatusBadge({ hasAiAnalysis, hasWaybackData, waybackSnapshots }: DataStatusBadgeProps) {
  const status = getDataStatus(hasAiAnalysis, hasWaybackData);
  const config = statusConfig[status];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant={config.variant} className="gap-1 cursor-help text-xs">
          {hasAiAnalysis ? (
            <CheckCircle className="w-3 h-3 text-green-500" />
          ) : (
            <Clock className="w-3 h-3 text-muted-foreground" />
          )}
          <span className="text-[10px]">IA</span>
          {hasWaybackData ? (
            <CheckCircle className="w-3 h-3 text-green-500" />
          ) : (
            <Clock className="w-3 h-3 text-muted-foreground" />
          )}
          <span className="text-[10px]">Web</span>
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-xs space-y-1">
          <p className="font-medium">{config.label}</p>
          <p className="text-muted-foreground">{config.description}</p>
          {waybackSnapshots !== null && waybackSnapshots !== undefined && waybackSnapshots > 0 && (
            <p className="text-green-600">{waybackSnapshots} snapshots históricos</p>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

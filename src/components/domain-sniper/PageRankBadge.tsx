import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TrendingUp } from "lucide-react";

interface PageRankBadgeProps {
  pageRank: number | null;
  updatedAt?: string | null;
}

export function PageRankBadge({ pageRank, updatedAt }: PageRankBadgeProps) {
  if (pageRank === null || pageRank === undefined) {
    return <span className="text-muted-foreground text-xs">-</span>;
  }

  // Color based on PageRank value
  const getVariant = (pr: number): "default" | "secondary" | "outline" => {
    if (pr >= 6) return "default"; // High authority - green
    if (pr >= 3) return "secondary"; // Medium authority - yellow
    return "outline"; // Low authority - gray
  };

  const getColorClass = (pr: number): string => {
    if (pr >= 6) return "bg-green-500/10 text-green-600 border-green-500/30";
    if (pr >= 3) return "bg-yellow-500/10 text-yellow-600 border-yellow-500/30";
    return "bg-muted text-muted-foreground";
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex">
          <Badge 
            variant="outline" 
            className={`gap-1 cursor-help ${getColorClass(pageRank)}`}
          >
            <TrendingUp className="w-3 h-3" />
            {pageRank.toFixed(1)}
          </Badge>
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-xs space-y-1">
          <p><strong>Open PageRank:</strong> {pageRank.toFixed(2)}/10</p>
          <p className="text-muted-foreground">
            {pageRank >= 6 ? "Alta autoridad" : pageRank >= 3 ? "Autoridad media" : "Baja autoridad"}
          </p>
          {updatedAt && (
            <p className="text-muted-foreground text-[10px]">
              Actualizado: {new Date(updatedAt).toLocaleDateString('es-CL')}
            </p>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

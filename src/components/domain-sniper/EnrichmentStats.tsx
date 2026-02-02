import { Card } from "@/components/ui/card";
import { Database, Brain, Globe, CheckCircle } from "lucide-react";

interface EnrichmentStatsProps {
  total: number;
  enriched: number;
  analyzed: number;
  withWebsite: number;
}

export function EnrichmentStats({ total, enriched, analyzed, withWebsite }: EnrichmentStatsProps) {
  const enrichedPercent = total > 0 ? Math.round((enriched / total) * 100) : 0;
  const analyzedPercent = total > 0 ? Math.round((analyzed / total) * 100) : 0;
  const withWebPercent = total > 0 ? Math.round((withWebsite / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Card className="p-3">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-500 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground truncate">Total</p>
            <p className="text-xl font-bold">{total}</p>
          </div>
        </div>
      </Card>

      <Card className="p-3">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-purple-500 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground truncate">Enriquecidos</p>
            <p className="text-xl font-bold">
              {enriched}
              <span className="text-xs font-normal text-muted-foreground ml-1">
                ({enrichedPercent}%)
              </span>
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-3">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-orange-500 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground truncate">Analizados IA</p>
            <p className="text-xl font-bold">
              {analyzed}
              <span className="text-xs font-normal text-muted-foreground ml-1">
                ({analyzedPercent}%)
              </span>
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-3">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground truncate">Con Web</p>
            <p className="text-xl font-bold">
              {withWebsite}
              <span className="text-xs font-normal text-muted-foreground ml-1">
                ({withWebPercent}%)
              </span>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Filter, Globe, TrendingUp, Clock, XCircle } from "lucide-react";

export type FilterType = "all" | "with_web" | "high_score" | "pending" | "discarded";

interface QuickFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: {
    all: number;
    withWeb: number;
    highScore: number;
    pending: number;
    discarded: number;
  };
}

export function QuickFilters({ activeFilter, onFilterChange, counts }: QuickFiltersProps) {
  const filters: { key: FilterType; label: string; icon: React.ReactNode; count: number }[] = [
    { key: "all", label: "Todos", icon: <Filter className="w-3 h-3" />, count: counts.all },
    { key: "with_web", label: "Con Web", icon: <Globe className="w-3 h-3" />, count: counts.withWeb },
    { key: "high_score", label: "Score 7+", icon: <TrendingUp className="w-3 h-3" />, count: counts.highScore },
    { key: "pending", label: "Pendientes", icon: <Clock className="w-3 h-3" />, count: counts.pending },
    { key: "discarded", label: "Descartados", icon: <XCircle className="w-3 h-3" />, count: counts.discarded },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      <span className="text-sm text-muted-foreground self-center mr-1">Filtrar:</span>
      {filters.map((filter) => (
        <Button
          key={filter.key}
          variant={activeFilter === filter.key ? "default" : "outline"}
          size="sm"
          className="gap-1 h-7 text-xs"
          onClick={() => onFilterChange(filter.key)}
        >
          {filter.icon}
          {filter.label}
          <span className="text-[10px] opacity-70">({filter.count})</span>
        </Button>
      ))}
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number | null;
  className?: string;
}

export function ScoreBadge({ score, className }: ScoreBadgeProps) {
  if (score === null || score === undefined) {
    return (
      <Badge variant="outline" className={cn("bg-muted text-muted-foreground", className)}>
        Sin analizar
      </Badge>
    );
  }

  const getScoreColor = (s: number) => {
    if (s >= 8) return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400";
    if (s >= 5) return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400";
    return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400";
  };

  return (
    <Badge className={cn(getScoreColor(score), className)}>
      {score.toFixed(1)}
    </Badge>
  );
}

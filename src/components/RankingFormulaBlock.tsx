import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator } from "lucide-react";
import {
  RANKING_FACTORS,
  RANKING_EXCLUSION_RULES,
  FORMULA_TEXT,
} from "@/lib/rankingWeights";

interface Props {
  variant?: "full" | "compact";
}

const RankingFormulaBlock: React.FC<Props> = ({ variant = "full" }) => {
  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" aria-hidden />
          <CardTitle className="text-xl">Cómo se calculó el ranking</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Fórmula pública, datos verificables y pesos publicados.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <pre
          className="bg-muted text-foreground rounded-md p-4 text-xs md:text-sm overflow-x-auto font-mono"
          aria-label="Fórmula del score final"
        >
{FORMULA_TEXT}
        </pre>

        <ul className="space-y-3">
          {RANKING_FACTORS.map((f) => (
            <li key={f.key} className="flex items-start gap-3">
              <Badge
                variant="secondary"
                className="min-w-[3rem] justify-center"
              >
                {f.weight}%
              </Badge>
              <div className="flex-1">
                <div className="font-semibold">{f.label}</div>
                {variant === "full" && (
                  <>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      <span className="font-medium">Fuente:</span> {f.source}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Frecuencia:</span>{" "}
                      {f.frequency}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Normalización:</span>{" "}
                      {f.normalization}
                    </p>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>

        {variant === "full" && (
          <div className="pt-2 border-t">
            <h3 className="font-semibold text-sm mb-2">Reglas de exclusión</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
              {RANKING_EXCLUSION_RULES.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        )}

        {variant === "compact" && (
          <Button asChild variant="outline" className="w-full min-h-[44px]">
            <Link to="/metodologia">
              Ver metodología completa
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default RankingFormulaBlock;

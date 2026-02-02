import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Brain, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AnalyzeButtonProps {
  domainName: string;
  isAnalyzed: boolean;
  onAnalyzed: () => void;
}

export function AnalyzeButton({ domainName, isAnalyzed, onAnalyzed }: AnalyzeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-domain-potential", {
        body: { domain_name: domainName, force_refresh: isAnalyzed },
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Análisis completado",
          description: `${domainName}: Score ${data.score}/10 - ${data.category}`,
        });
        onAnalyzed();
      } else {
        throw new Error(data.error || "Error en el análisis");
      }
    } catch (error) {
      console.error("Analyze error:", error);
      toast({
        title: "Error al analizar",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleAnalyze}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isAnalyzed ? (
        <>
          <RefreshCw className="w-4 h-4 mr-1" />
          Re-analizar
        </>
      ) : (
        <>
          <Brain className="w-4 h-4 mr-1" />
          Analizar
        </>
      )}
    </Button>
  );
}

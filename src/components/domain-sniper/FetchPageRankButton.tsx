import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface FetchPageRankButtonProps {
  domainName: string;
  hasPageRank: boolean;
}

export function FetchPageRankButton({ domainName, hasPageRank }: FetchPageRankButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleFetch = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('pagerank-lookup', {
        body: null,
        headers: {},
      });

      // Use query params approach
      const response = await fetch(
        `https://oegvwjxrlmtwortyhsrv.supabase.co/functions/v1/pagerank-lookup?domain=${encodeURIComponent(domainName)}&updateDb=true`,
        {
          headers: {
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error fetching PageRank');
      }

      if (result.success) {
        toast({
          title: "PageRank obtenido",
          description: `${domainName}: PR ${result.page_rank?.toFixed(1) || 'N/A'}`,
        });
        queryClient.invalidateQueries({ queryKey: ["domain-opportunities"] });
      } else {
        toast({
          title: "Sin datos",
          description: result.message || "No se encontró PageRank para este dominio",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('PageRank fetch error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo obtener PageRank",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFetch}
          disabled={isLoading}
          className={hasPageRank ? "text-green-600" : ""}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <TrendingUp className="w-4 h-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {hasPageRank ? "Actualizar PageRank" : "Obtener PageRank"}
      </TooltipContent>
    </Tooltip>
  );
}

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, TrendingUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const SEOAnalysis = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAnalysis = async () => {
    if (!domain.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un dominio",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setAnalysis(null);

    try {
      console.log('🚀 Requesting SEO analysis for:', domain);

      const { data, error } = await supabase.functions.invoke('seo-analysis', {
        body: { domain: domain.trim() }
      });

      if (error) {
        console.error('❌ Error:', error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Error al analizar el dominio');
      }

      console.log('✅ Analysis received');
      setAnalysis(data.analysis);

      toast({
        title: "Análisis completado",
        description: "El análisis SEO se ha generado exitosamente",
      });
    } catch (error) {
      console.error('Error analyzing domain:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al generar el análisis",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Análisis SEO con IA
          </CardTitle>
          <CardDescription>
            Analiza cualquier dominio con inteligencia artificial para obtener recomendaciones SEO profesionales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="ejemplo.cl"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !loading && handleAnalysis()}
              disabled={loading}
            />
            <Button onClick={handleAnalysis} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span className="ml-2">Analizar</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados del Análisis</CardTitle>
            <CardDescription>
              Análisis SEO generado con IA para {domain}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{analysis}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ASNContentGeneratorProps {
  asn: string;
  asnName?: string;
  description?: string;
}

export const ASNContentGenerator = ({ asn, asnName, description }: ASNContentGeneratorProps) => {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setLoading(true);
    setContent(null);
    setMetadata(null);

    try {
      console.log('🚀 Generating content for ASN:', asn);

      const { data, error } = await supabase.functions.invoke('asn-content-generator', {
        body: { asn, asnName, description }
      });

      if (error) {
        console.error('❌ Error:', error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Error al generar contenido');
      }

      console.log('✅ Content generated');
      setContent(data.content);
      setMetadata(data.metadata);

      toast({
        title: "Contenido generado",
        description: "El contenido sobre este ASN se ha generado exitosamente",
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al generar el contenido",
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
            <Sparkles className="h-5 w-5" />
            Generar Contenido con IA
          </CardTitle>
          <CardDescription>
            Genera contenido detallado sobre {asnName || asn} utilizando inteligencia artificial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleGenerate} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Generando contenido...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generar Artículo Completo
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {metadata && (
        <Card>
          <CardHeader>
            <CardTitle>Metadatos SEO</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {metadata.title && (
                <div>
                  <span className="font-semibold">Título:</span> {metadata.title}
                </div>
              )}
              {metadata.description && (
                <div>
                  <span className="font-semibold">Descripción:</span> {metadata.description}
                </div>
              )}
              {metadata.keywords && (
                <div>
                  <span className="font-semibold">Palabras clave:</span>{' '}
                  {Array.isArray(metadata.keywords) 
                    ? metadata.keywords.join(', ')
                    : metadata.keywords}
                </div>
              )}
              {metadata.slug && (
                <div>
                  <span className="font-semibold">URL:</span> {metadata.slug}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {content && (
        <Card>
          <CardHeader>
            <CardTitle>Contenido Generado</CardTitle>
            <CardDescription>
              Artículo completo sobre {asnName || asn}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

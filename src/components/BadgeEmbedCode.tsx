import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, Code2 } from 'lucide-react';
import { toast } from 'sonner';

interface BadgeEmbedCodeProps {
  certificationId: string;
  categoryName: string;
  position: number;
}

export default function BadgeEmbedCode({ certificationId, categoryName, position }: BadgeEmbedCodeProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large'>('medium');

  const badgeUrl = `https://oegvwjxrlmtwortyhsrv.supabase.co/functions/v1/badge-generator?id=${certificationId}&size=${selectedSize}`;
  
  const htmlCode = `<!-- Badge EligeTuHosting.cl -->
<a href="https://eligetuhosting.cl/certificaciones" target="_blank" rel="noopener">
  <img src="${badgeUrl}" 
       alt="#${position} ${categoryName} - Chile 2025" 
       width="200" height="60" />
</a>`;

  const markdownCode = `[![#${position} ${categoryName}](${badgeUrl})](https://eligetuhosting.cl/certificaciones)`;

  const handleCopy = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopied(type);
    toast.success('Código copiado al portapapeles');
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code2 className="w-5 h-5" />
          Código para Instalar tu Badge
        </CardTitle>
        <CardDescription>
          Copia y pega este código en tu sitio web para mostrar tu certificación
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Size Selector */}
        <div className="space-y-2">
          <Label>Tamaño del Badge</Label>
          <div className="flex gap-2">
            {(['small', 'medium', 'large'] as const).map((size) => (
              <Button
                key={size}
                variant={selectedSize === size ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedSize(size)}
              >
                {size === 'small' && 'Pequeño'}
                {size === 'medium' && 'Mediano'}
                {size === 'large' && 'Grande'}
              </Button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-2">
          <Label>Vista Previa</Label>
          <div className="bg-muted p-6 rounded-lg flex items-center justify-center">
            <img 
              src={badgeUrl} 
              alt={`#${position} ${categoryName}`}
              className="max-h-20"
            />
          </div>
        </div>

        {/* Code Tabs */}
        <Tabs defaultValue="html" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
          </TabsList>
          
          <TabsContent value="html" className="space-y-2">
            <div className="relative">
              <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg text-xs overflow-x-auto">
                <code>{htmlCode}</code>
              </pre>
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-2 right-2"
                onClick={() => handleCopy(htmlCode, 'html')}
              >
                {copied === 'html' ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="markdown" className="space-y-2">
            <div className="relative">
              <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg text-xs overflow-x-auto">
                <code>{markdownCode}</code>
              </pre>
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-2 right-2"
                onClick={() => handleCopy(markdownCode, 'markdown')}
              >
                {copied === 'markdown' ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Direct Link */}
        <div className="space-y-2">
          <Label>URL Directa del Badge</Label>
          <div className="flex gap-2">
            <Input 
              value={badgeUrl} 
              readOnly 
              className="font-mono text-xs"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(badgeUrl, 'url')}
            >
              {copied === 'url' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
          <p className="font-semibold text-blue-900 mb-2">📝 Instrucciones:</p>
          <ol className="list-decimal list-inside space-y-1 text-blue-800">
            <li>Copia el código HTML o Markdown</li>
            <li>Pégalo en el footer o sidebar de tu sitio web</li>
            <li>El badge debe enlazar a eligetuhosting.cl/certificaciones</li>
            <li>Una vez instalado, solicita verificación en tu panel</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}

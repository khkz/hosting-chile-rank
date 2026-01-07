import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, Code2, Download } from 'lucide-react';
import { toast } from 'sonner';
import BadgeImageGenerator from './BadgeImageGenerator';

interface BadgeEmbedCodeProps {
  certificationId: string;
  categoryName: string;
  position: number;
  icon?: string;
}

export default function BadgeEmbedCode({ certificationId, categoryName, position, icon = '⚡' }: BadgeEmbedCodeProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [badgeDataUrl, setBadgeDataUrl] = useState<string>('');

  const getSizeInPixels = () => {
    switch (selectedSize) {
      case 'small': return 120;
      case 'medium': return 180;
      case 'large': return 240;
      default: return 180;
    }
  };

  const pixels = getSizeInPixels();

  const htmlCode = `<!-- Badge EligeTuHosting.cl - Certificación ${categoryName} #${position} -->
<a href="https://eligetuhosting.cl/directorio-hosting-chile" 
   target="_blank" 
   rel="nofollow sponsored" 
   title="Directorio Hosting Chile Certificado - EligeTuHosting.cl">
  <img src="badge-eligetuhosting.png" 
       alt="Certificado #${position} ${categoryName} Chile 2026 | Mejor Hosting Chile - EligeTuHosting.cl"
       title="Certificación ${categoryName} por EligeTuHosting.cl"
       width="${pixels}" 
       height="${pixels}"
       loading="lazy" />
</a>`;

  const markdownCode = `[![Certificado #${position} ${categoryName} Chile 2026 | Mejor Hosting Chile](badge-eligetuhosting.png)](https://eligetuhosting.cl/directorio-hosting-chile "Directorio Hosting Chile Certificado")`;

  const handleCopy = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopied(type);
    toast.success('Código copiado al portapapeles');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownload = () => {
    if (!badgeDataUrl) {
      toast.error('La imagen no está lista. Intenta nuevamente.');
      return;
    }

    const link = document.createElement('a');
    link.download = `badge-eligetuhosting-${position}-${categoryName.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = badgeDataUrl;
    link.click();
    toast.success('Badge descargado exitosamente');
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

        {/* Preview and Download */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Vista Previa del Badge</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={!badgeDataUrl}
            >
              <Download className="w-4 h-4 mr-2" />
              Descargar PNG
            </Button>
          </div>
          <div className="bg-muted p-6 rounded-lg flex items-center justify-center">
            <BadgeImageGenerator
              position={position}
              categoryName={categoryName}
              icon={icon}
              size={selectedSize}
              onImageGenerated={setBadgeDataUrl}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Descarga esta imagen y súbela a tu servidor web
          </p>
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

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
          <p className="font-semibold text-blue-900 mb-2">📝 Instrucciones de Instalación:</p>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li><strong>Descarga el badge PNG</strong> usando el botón "Descargar PNG"</li>
            <li><strong>Sube la imagen</strong> a tu servidor web (ej: /images/badge-eligetuhosting.png)</li>
            <li><strong>Actualiza el código HTML/Markdown</strong> con la ruta correcta de la imagen en tu servidor</li>
            <li><strong>Pega el código</strong> en el footer o sidebar de tu sitio web</li>
            <li><strong>El badge enlaza a nuestro Directorio de Hosting Chile</strong> (aumenta tu visibilidad)</li>
            <li><strong>Solicita verificación</strong> en tu panel una vez instalado</li>
          </ol>
          <p className="mt-3 text-xs text-blue-700">
            💡 <strong>Beneficio:</strong> Aparecer destacado en nuestro directorio público aumenta 
            tu visibilidad y genera confianza en potenciales clientes. El badge incluye optimización SEO 
            con keywords estratégicas.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

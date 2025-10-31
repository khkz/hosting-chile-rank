import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Download, Code, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const OpenDataBadge: React.FC = () => {
  const handleDownload = () => {
    // Download the latest JSON feed
    window.open('/feeds/latest-domains.json', '_blank');
  };

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="gap-1">
            <Database className="h-3 w-3" />
            Open Data
          </Badge>
          <Badge variant="outline" className="gap-1">
            Actualizado diariamente
          </Badge>
        </div>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Database className="h-6 w-6 text-primary" />
          Dataset Público Disponible
        </CardTitle>
        <CardDescription className="text-base">
          Accede gratuitamente a nuestro dataset completo de hosting en Chile
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-background p-4 rounded-lg border">
            <p className="text-3xl font-bold text-primary">22,000+</p>
            <p className="text-sm text-muted-foreground">Sitios analizados</p>
          </div>
          <div className="bg-background p-4 rounded-lg border">
            <p className="text-3xl font-bold text-primary">50+</p>
            <p className="text-sm text-muted-foreground">Proveedores evaluados</p>
          </div>
          <div className="bg-background p-4 rounded-lg border">
            <p className="text-3xl font-bold text-primary">5 años</p>
            <p className="text-sm text-muted-foreground">De datos históricos</p>
          </div>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Code className="h-4 w-4 text-primary" />
            Formatos disponibles:
          </h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="w-20 font-mono text-xs bg-background px-2 py-1 rounded">JSON</span>
              <span className="text-muted-foreground">API REST pública</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-20 font-mono text-xs bg-background px-2 py-1 rounded">XML</span>
              <span className="text-muted-foreground">RSS Feed actualizado</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-20 font-mono text-xs bg-background px-2 py-1 rounded">CSV</span>
              <span className="text-muted-foreground">Descarga para análisis</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleDownload} className="gap-2 flex-1">
            <Download className="h-4 w-4" />
            Descargar JSON
          </Button>
          <Button asChild variant="outline" className="gap-2 flex-1">
            <a href="/feeds/latest-domains.xml" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              Ver RSS Feed
            </a>
          </Button>
        </div>

        <div className="text-xs text-muted-foreground pt-3 border-t">
          <p className="mb-2">
            <strong>Licencia:</strong> Creative Commons CC BY 4.0 - Uso libre con atribución
          </p>
          <p>
            <strong>Uso permitido:</strong> Investigación, análisis, aplicaciones comerciales y educativas.
            Se requiere citar la fuente: eligetuhosting.cl
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OpenDataBadge;

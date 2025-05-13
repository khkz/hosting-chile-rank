
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  ExternalLink, 
  FileText, 
  Globe, 
  Search, 
  ShieldCheck,
  Zap,
  Server
} from 'lucide-react';

interface ResourceProps {
  title: string;
  description: string;
  link: string;
  icon: React.ReactNode;
  tags?: string[];
}

const Resource: React.FC<ResourceProps> = ({ title, description, link, icon, tags = [] }) => (
  <Card className="shadow-sm h-full flex flex-col">
    <CardHeader className="pb-2">
      <div className="flex items-start justify-between">
        <div className="p-2 rounded-md bg-blue-50 text-blue-700">
          {icon}
        </div>
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, i) => (
            <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
        </div>
      </div>
      <CardTitle className="text-lg mt-2">{title}</CardTitle>
      <CardDescription className="line-clamp-2">{description}</CardDescription>
    </CardHeader>
    <CardContent className="pt-0 mt-auto">
      <Button asChild variant="outline" className="w-full mt-2">
        <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
          Leer guía
          <ExternalLink className="ml-1 h-4 w-4" />
        </a>
      </Button>
    </CardContent>
  </Card>
);

const EducationalResources: React.FC = () => {
  const seoResources: ResourceProps[] = [
    {
      title: "Impacto de la ubicación del hosting en el SEO local",
      description: "Aprende cómo la ubicación del servidor afecta al posicionamiento en búsquedas locales en Chile y cómo optimizarlo.",
      link: "https://eligetuhosting.cl/guias/hosting-seo-local/",
      icon: <Search className="h-5 w-5" />,
      tags: ["SEO", "Posicionamiento"]
    },
    {
      title: "Core Web Vitals y su relación con el hosting",
      description: "Guía completa sobre cómo mejorar las métricas de Core Web Vitals eligiendo el hosting adecuado.",
      link: "https://eligetuhosting.cl/guias/core-web-vitals/",
      icon: <Zap className="h-5 w-5" />,
      tags: ["Rendimiento", "Google"]
    },
  ];
  
  const securityResources: ResourceProps[] = [
    {
      title: "Protección de datos y GDPR en Chile",
      description: "La importancia de elegir un hosting con servidores en Chile para cumplir normativas de protección de datos.",
      link: "https://eligetuhosting.cl/guias/proteccion-datos-chile/",
      icon: <ShieldCheck className="h-5 w-5" />,
      tags: ["Seguridad", "Normativa"]
    },
    {
      title: "SSL y HTTPS: Todo lo que debes saber",
      description: "Guía completa sobre certificados SSL, HTTPS y su importancia para la seguridad y SEO de tu sitio web.",
      link: "https://eligetuhosting.cl/guias/ssl-https-guia/",
      icon: <ShieldCheck className="h-5 w-5" />,
      tags: ["Seguridad", "SSL"]
    },
  ];
  
  const performanceResources: ResourceProps[] = [
    {
      title: "LiteSpeed vs Apache: Comparativa de rendimiento",
      description: "Análisis detallado del rendimiento de LiteSpeed frente a Apache y su impacto en la velocidad de carga.",
      link: "https://eligetuhosting.cl/guias/litespeed-vs-apache/",
      icon: <Zap className="h-5 w-5" />,
      tags: ["Rendimiento", "Tecnología"]
    },
    {
      title: "CDN: Mejora la velocidad global de tu sitio",
      description: "Cómo implementar una CDN y mantener al mismo tiempo las ventajas de un servidor principal en Chile.",
      link: "https://eligetuhosting.cl/guias/cdn-optimizacion/",
      icon: <Globe className="h-5 w-5" />,
      tags: ["Velocidad", "Global"]
    },
  ];
  
  const migrationsResources: ResourceProps[] = [
    {
      title: "Guía paso a paso para migrar tu sitio web",
      description: "Proceso completo para migrar tu sitio web a un nuevo hosting sin interrupciones ni pérdida de SEO.",
      link: "https://eligetuhosting.cl/guias/migracion-sitio-web/",
      icon: <Server className="h-5 w-5" />,
      tags: ["Migración", "Paso a paso"]
    },
    {
      title: "Checklist para evaluar la calidad de un hosting",
      description: "Factores clave que debes considerar al elegir un proveedor de hosting para tu sitio web.",
      link: "https://eligetuhosting.cl/guias/evaluar-calidad-hosting/",
      icon: <FileText className="h-5 w-5" />,
      tags: ["Checklist", "Comparativa"]
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Recursos educativos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SEO category */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center">
            <Search className="h-5 w-5 mr-2 text-blue-700" />
            SEO y visibilidad
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {seoResources.map((resource, i) => (
              <Resource key={i} {...resource} />
            ))}
          </div>
        </div>
        
        {/* Security category */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center">
            <ShieldCheck className="h-5 w-5 mr-2 text-blue-700" />
            Seguridad
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {securityResources.map((resource, i) => (
              <Resource key={i} {...resource} />
            ))}
          </div>
        </div>
        
        {/* Performance category */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center">
            <Zap className="h-5 w-5 mr-2 text-blue-700" />
            Rendimiento
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {performanceResources.map((resource, i) => (
              <Resource key={i} {...resource} />
            ))}
          </div>
        </div>
        
        {/* Migrations category */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center">
            <Server className="h-5 w-5 mr-2 text-blue-700" />
            Migraciones
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {migrationsResources.map((resource, i) => (
              <Resource key={i} {...resource} />
            ))}
          </div>
        </div>
      </div>
      
      <Card className="shadow-sm mt-6 border-l-4 border-l-blue-600">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="mb-4 md:mb-0 md:mr-6">
              <h3 className="font-bold text-lg flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                ¿Quieres más recursos?
              </h3>
              <p className="text-gray-700">
                Explora nuestra biblioteca completa de guías y tutoriales sobre hosting, SEO, seguridad y optimización.
              </p>
            </div>
            <div className="md:ml-auto">
              <Button asChild variant="outline" className="border-blue-600 text-blue-700 hover:bg-blue-50">
                <a href="https://eligetuhosting.cl/guias/">
                  Ver todas las guías
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EducationalResources;

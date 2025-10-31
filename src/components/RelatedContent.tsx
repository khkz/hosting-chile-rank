import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookOpen } from 'lucide-react';

interface RelatedArticle {
  title: string;
  url: string;
  description: string;
}

interface RelatedContentProps {
  articles?: RelatedArticle[];
  currentPage?: string;
}

const defaultArticles: Record<string, RelatedArticle[]> = {
  'ranking': [
    {
      title: 'Cómo elegir el mejor hosting',
      url: '/guia-elegir-hosting',
      description: 'Guía completa para tomar la decisión correcta'
    },
    {
      title: 'Comparativa de Hosting',
      url: '/comparativa',
      description: 'Compara proveedores lado a lado'
    },
    {
      title: 'Mejor Hosting WordPress Chile',
      url: '/mejor-hosting-wordpress-chile',
      description: 'Hosting optimizado para WordPress'
    }
  ],
  'wordpress': [
    {
      title: 'Guía Hosting WordPress',
      url: '/guia-hosting-wordpress',
      description: 'Todo sobre hosting para WordPress'
    },
    {
      title: 'Optimización WordPress',
      url: '/blog/optimizacion-wordpress-hosting',
      description: 'Mejora el rendimiento de tu WP'
    },
    {
      title: 'Ranking General',
      url: '/ranking',
      description: 'Ve todos los proveedores evaluados'
    }
  ],
  'vps': [
    {
      title: 'Guía VPS',
      url: '/guia-elegir-vps',
      description: 'Cómo elegir tu servidor VPS'
    },
    {
      title: 'Servidor Dedicado',
      url: '/guia-elegir-servidor-dedicado',
      description: 'Cuándo necesitas un dedicado'
    },
    {
      title: 'Comparativa de Hosting',
      url: '/comparativa',
      description: 'Compara VPS vs Shared vs Cloud'
    }
  ],
  'general': [
    {
      title: 'Ranking de Hosting',
      url: '/ranking',
      description: 'Los mejores hostings de Chile 2025'
    },
    {
      title: 'Guía de Migración',
      url: '/guia-migrar-hosting',
      description: 'Cambia de hosting sin perder SEO'
    },
    {
      title: 'Wiki de Hosting',
      url: '/wiki',
      description: 'Aprende conceptos clave de hosting'
    }
  ]
};

const RelatedContent: React.FC<RelatedContentProps> = ({ 
  articles,
  currentPage = 'general' 
}) => {
  const displayArticles = articles || defaultArticles[currentPage] || defaultArticles['general'];

  return (
    <Card className="bg-muted/30 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Lee también
        </CardTitle>
        <CardDescription>
          Artículos relacionados que te pueden interesar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayArticles.map((article, index) => (
            <Link
              key={index}
              to={article.url}
              className="group block p-3 rounded-lg bg-background hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/20"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {article.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {article.description}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RelatedContent;

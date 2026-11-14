import React, { useId } from 'react';
import { Link } from 'react-router-dom';
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
      title: 'Comparativa de hosting',
      url: '/comparativa',
      description: 'Compara proveedores lado a lado'
    },
    {
      title: 'Mejor hosting WordPress en Chile',
      url: '/mejor-hosting-wordpress-chile',
      description: 'Hosting optimizado para WordPress'
    }
  ],
  'wordpress': [
    {
      title: 'Guía de hosting WordPress',
      url: '/guia-hosting-wordpress',
      description: 'Todo sobre hosting para WordPress'
    },
    {
      title: 'Optimización WordPress',
      url: '/blog/optimizacion-wordpress-hosting',
      description: 'Mejora el rendimiento de tu WP'
    },
    {
      title: 'Ranking general',
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
      title: 'Servidor dedicado',
      url: '/guia-elegir-servidor-dedicado',
      description: 'Cuándo necesitas un dedicado'
    },
    {
      title: 'Comparativa de hosting',
      url: '/comparativa',
      description: 'Compara VPS, compartido y cloud'
    }
  ],
  'general': [
    {
      title: 'Ranking de hosting',
      url: '/ranking',
      description: 'Los mejores hostings de Chile 2026'
    },
    {
      title: 'Guía de migración',
      url: '/guia-migrar-hosting',
      description: 'Cambia de hosting sin perder SEO'
    },
    {
      title: 'Wiki de hosting',
      url: '/wiki',
      description: 'Aprende conceptos clave de hosting'
    }
  ]
};

/** «Lee también»: lista corta de lecturas relacionadas, con borde y sin sombra. */
const RelatedContent: React.FC<RelatedContentProps> = ({
  articles,
  currentPage = 'general'
}) => {
  const headingId = useId();
  const displayArticles = articles || defaultArticles[currentPage] || defaultArticles['general'];

  return (
    <section aria-labelledby={headingId} className="rounded-xl border border-rule bg-white p-5 md:p-6">
      <h2 id={headingId} className="t-h3 flex items-center gap-2 text-ink">
        <BookOpen aria-hidden className="h-5 w-5 text-ink-2" />
        Lee también
      </h2>
      <p className="t-small mt-1 text-ink-2">Artículos relacionados que te pueden interesar</p>
      <ul className="mt-4 divide-y divide-rule border-t border-rule">
        {displayArticles.map((article, index) => (
          <li key={`${article.url}-${index}`}>
            <Link
              to={article.url}
              className="group flex min-h-11 items-start justify-between gap-3 py-3"
            >
              <span className="min-w-0">
                <span className="block font-semibold text-ink decoration-ink/30 underline-offset-2 group-hover:underline">
                  {article.title}
                </span>
                <span className="t-small mt-0.5 block text-ink-2">{article.description}</span>
              </span>
              <ArrowRight aria-hidden className="mt-1 h-4 w-4 shrink-0 text-ink-3" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default RelatedContent;

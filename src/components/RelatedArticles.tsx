import React, { useId } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Article {
  title: string;
  description: string;
  path: string;
}

interface RelatedArticlesProps {
  articles: Article[];
  title?: string;
  /** true: dentro del pie de ReadingLayout, que ya trae su regla y su aire. */
  embedded?: boolean;
}

/** Lecturas relacionadas: fichas con borde, sin sombra ni saltos al pasar el cursor. */
const RelatedArticles: React.FC<RelatedArticlesProps> = ({
  articles,
  title = 'Artículos relacionados',
  embedded = false,
}) => {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className={cn(!embedded && 'mt-16 border-t border-rule py-8')}>
      <h2 id={headingId} className={cn(embedded ? 't-h3' : 't-h2', 'text-ink')}>
        {title}
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, index) => (
          <li key={`${article.path}-${index}`} className="min-w-0">
            <Link
              to={article.path}
              className="group flex h-full flex-col rounded-xl border border-rule bg-white p-5 transition-colors hover:border-ink/40"
            >
              <span className="font-semibold text-ink decoration-ink/30 underline-offset-2 group-hover:underline">
                {article.title}
              </span>
              <span className="t-small mt-1 text-ink-2">{article.description}</span>
              <span className="t-label mt-auto inline-flex items-center gap-1.5 pt-4 text-ink">
                Leer más
                <ArrowRight aria-hidden className="h-4 w-4" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default RelatedArticles;

import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface GuideCrumb {
  name: string;
  /** Ruta interna (la misma que recibe BreadcrumbSchema). */
  url: string;
}

interface GuideBreadcrumbsProps {
  /** Sin «Inicio»: se agrega solo. El último elemento es la página actual. */
  items: GuideCrumb[];
}

/**
 * Migas visibles de las guías. Solo dibujan: el JSON-LD de las migas lo sigue
 * emitiendo BreadcrumbSchema en cada página, sin cambios.
 */
const GuideBreadcrumbs: React.FC<GuideBreadcrumbsProps> = ({ items }) => {
  const crumbs: GuideCrumb[] = [{ name: 'Inicio', url: '/' }, ...items];
  return (
    <nav aria-label="Migas de pan">
      <ol className="t-meta flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={`${c.url}-${i}`} className="inline-flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="text-ink-2">
                  {c.name}
                </span>
              ) : (
                <>
                  <Link
                    to={c.url}
                    className="rounded-sm text-ink-3 underline decoration-ink/20 underline-offset-2 hover:text-ink hover:decoration-ink"
                  >
                    {c.name}
                  </Link>
                  <ChevronRight aria-hidden className="h-3.5 w-3.5 text-ink-3" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default GuideBreadcrumbs;

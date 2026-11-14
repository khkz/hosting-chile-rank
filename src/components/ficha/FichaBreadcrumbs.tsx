import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface Crumb {
  name: string;
  href?: string;
}

/**
 * Migas solo visuales para las páginas que ya emiten su propio BreadcrumbList
 * en JSON-LD (reseña y fichas por país): no duplican el marcado SEO.
 */
const FichaBreadcrumbs: React.FC<{ items: Crumb[] }> = ({ items }) => (
  <nav aria-label="Migas de pan">
    <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 t-small text-ink-2">
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <li key={`${item.name}-${i}`} className="flex items-center gap-1.5">
            {item.href && !last ? (
              <Link to={item.href} className="underline-offset-4 hover:text-ink hover:underline">
                {item.name}
              </Link>
            ) : (
              <span aria-current={last ? 'page' : undefined} className={last ? 'font-semibold text-ink' : undefined}>
                {item.name}
              </span>
            )}
            {!last && <ChevronRight className="h-4 w-4 text-ink-3" aria-hidden />}
          </li>
        );
      })}
    </ol>
  </nav>
);

export default FichaBreadcrumbs;

import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface Crumb {
  name: string;
  /** Sin href: es la página actual. */
  href?: string;
}

/**
 * Migas visibles. No emiten JSON-LD: cada página ya publica su BreadcrumbList,
 * y duplicarlo cambiaría el SEO.
 */
const Crumbs: React.FC<{ items: Crumb[] }> = ({ items }) => (
  <nav aria-label="Migas de pan" className="t-meta">
    <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
      {items.map((c, i) => (
        <li key={`${c.name}-${i}`} className="flex min-w-0 items-center gap-1.5">
          {i > 0 && <ChevronRight aria-hidden className="h-3.5 w-3.5 shrink-0 text-ink-3" />}
          {c.href ? (
            <Link to={c.href} className="text-ink-2 underline-offset-4 hover:text-ink hover:underline">
              {c.name}
            </Link>
          ) : (
            <span aria-current="page" className="text-ink-2">
              {c.name}
            </span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);

export default Crumbs;

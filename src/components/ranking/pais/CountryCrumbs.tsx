import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface Crumb {
  name: string;
  href?: string;
}

/**
 * Migas visibles, sin JSON-LD: la página ya publica su BreadcrumbList en
 * Helmet y no queremos duplicarlo.
 */
const CountryCrumbs: React.FC<{ items: Crumb[] }> = ({ items }) => (
  <nav aria-label="Migas de pan">
    <ol className="flex flex-wrap items-center gap-x-1.5 text-sm text-ink-3">
      {items.map((c, i) => {
        const last = i === items.length - 1;
        return (
          <li key={`${c.name}-${i}`} className="inline-flex items-center gap-1.5">
            {c.href && !last ? (
              <Link
                to={c.href}
                className="inline-flex min-h-[44px] items-center rounded-sm underline-offset-4 hover:text-ink hover:underline md:min-h-0"
              >
                {c.name}
              </Link>
            ) : (
              <span aria-current={last ? 'page' : undefined} className={last ? 'font-medium text-ink' : undefined}>
                {c.name}
              </span>
            )}
            {!last && <ChevronRight aria-hidden className="h-3.5 w-3.5" />}
          </li>
        );
      })}
    </ol>
  </nav>
);

export default CountryCrumbs;

import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface Miga {
  name: string;
  /** Sin href: es la página actual. */
  href?: string;
}

/**
 * Migas de pan visuales para las páginas de lectura que no publican
 * BreadcrumbList propio (no emiten JSON-LD, para no cambiar el SEO).
 */
const Migas: React.FC<{ items: Miga[] }> = ({ items }) => (
  <nav aria-label="Migas de pan">
    <ol className="t-small flex flex-wrap items-center gap-x-1.5 gap-y-1 text-ink-3">
      {items.map((it, i) => (
        <li key={`${it.name}-${i}`} className="inline-flex min-w-0 items-center gap-1.5">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />}
          {it.href ? (
            <Link to={it.href} className="text-ink-2 underline decoration-ink/20 underline-offset-[3px] hover:text-ink hover:decoration-ink">
              {it.name}
            </Link>
          ) : (
            <span aria-current="page" className="min-w-0 truncate text-ink-2">
              {it.name}
            </span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);

export default Migas;

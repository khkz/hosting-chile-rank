import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Flag from '@/components/data/Flag';
import type { EditionCode } from '@/lib/countries';

export interface Crumb {
  label: string;
  /** Sin destino = página actual. */
  to?: string;
}

/**
 * Migas visibles de las páginas internas de una edición. Solo navegación:
 * el BreadcrumbList de cada página sigue en su propio JSON-LD.
 * La bandera acompaña al país, como en la barra de ediciones.
 */
const EditionCrumbs: React.FC<{ code: EditionCode; items: Crumb[] }> = ({ code, items }) => (
  <nav aria-label="Migas de pan" className="t-small text-ink-2">
    <ol className="flex flex-wrap items-center gap-x-2">
      {items.map((c, i) => (
        <li key={c.label} className="flex items-center gap-2">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-ink-3" aria-hidden />}
          {c.to ? (
            <Link to={c.to} className="inline-flex min-h-[44px] items-center gap-2 underline-offset-4 hover:text-ink hover:underline">
              {i === 1 && <Flag code={code} size={18} />}
              {c.label}
            </Link>
          ) : (
            <span aria-current="page" className="inline-flex min-h-[44px] items-center font-medium text-ink">
              {c.label}
            </span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);

export default EditionCrumbs;

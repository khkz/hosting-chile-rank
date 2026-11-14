import React from 'react';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { BODY, RICH } from './GuideBlocks';

interface ProviderPickProps {
  /** Puesto dentro de la lista de la guía (criterio editorial de la guía, no el ranking). */
  position?: number;
  name: React.ReactNode;
  /** Logo del proveedor. Es decorativo: el nombre ya está en el título. */
  logo?: string;
  /** Etiqueta corta («Mejor precio»). Neutra: el rojo es solo del puesto 1 del ranking. */
  label?: string;
  /** Enlace externo al proveedor. `rel` se pasa tal cual viene de la guía. */
  href?: string;
  rel?: string;
  linkLabel?: string;
  /** Contenido de la ficha. */
  children: React.ReactNode;
  className?: string;
}

/**
 * Proveedor recomendado dentro de una guía: número neutro, nombre, etiqueta
 * y un enlace «Ir al sitio de …». Sin medallas, sin colores por puesto.
 */
const ProviderPick: React.FC<ProviderPickProps> = ({
  position,
  name,
  logo,
  label,
  href,
  rel,
  linkLabel,
  children,
  className,
}) => (
  <article className={cn('not-prose my-6 rounded-xl border border-rule bg-white p-5 md:p-6', className)}>
    <header className="flex flex-wrap items-center gap-x-3 gap-y-2">
      {position != null && (
        <span className="t-label tabular text-ink-3">
          <span className="sr-only">Puesto </span>#{position}
        </span>
      )}
      {logo && <img src={logo} alt="" className="h-8 w-auto max-w-[8rem] object-contain" loading="lazy" />}
      <h3 className="t-h3 text-ink">{name}</h3>
      {label && <Badge variant="secondary">{label}</Badge>}
    </header>
    <div className={cn('mt-3', BODY, RICH)}>{children}</div>
    {href && linkLabel && (
      <p className="mt-3">
        <a
          href={href}
          target="_blank"
          rel={rel}
          className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
        >
          {linkLabel}
          <ExternalLink aria-hidden className="h-4 w-4" />
          <span className="sr-only"> (se abre en una pestaña nueva)</span>
        </a>
      </p>
    )}
  </article>
);

export default ProviderPick;

import React from 'react';
import { cn } from '@/lib/utils';
import { isEmptyEditorial } from '@/components/media/EditorialImage';

export interface TocItem {
  id: string;
  label: string;
}

interface ReadingLayoutProps {
  /** Migas (SEOBreadcrumbs). */
  breadcrumbs?: React.ReactNode;
  /** H1 del artículo. */
  title: React.ReactNode;
  /** Bajada: qué vas a saber al terminar de leer. */
  lead?: React.ReactNode;
  /** Autoría y fechas (AuthorByline, «Última revisión…»). */
  meta?: React.ReactNode;
  /** Imagen editorial bajo la cabecera (opcional). */
  image?: React.ReactNode;
  /** Índice «En esta página». Los id deben existir en el cuerpo (h2 id="…"). */
  toc?: TocItem[];
  /** Contenido extra de la columna lateral, bajo el índice. */
  aside?: React.ReactNode;
  /** Cuerpo del artículo. Envuélvelo en <div className="prose"> o usa `prose`. */
  children: React.ReactNode;
  /** Después del cuerpo: fuentes, relacionados, CTA. */
  footer?: React.ReactNode;
  /** true: aplica `prose` al cuerpo automáticamente. */
  prose?: boolean;
  className?: string;
}

/**
 * Plantilla de lectura del sistema (guías, blog, wiki, metodología, estudio):
 * cabecera alineada a la izquierda, índice lateral fijo en escritorio y
 * plegable en móvil, columna de 62 caracteres.
 */
const ReadingLayout: React.FC<ReadingLayoutProps> = ({
  breadcrumbs,
  title,
  lead,
  meta,
  image,
  toc,
  aside,
  children,
  footer,
  prose = true,
  className,
}) => {
  const hasSide = Boolean((toc && toc.length > 0) || aside);
  return (
    <article className={cn('bg-white', className)}>
      <header className="border-b border-rule">
        <div className="container py-8 md:py-12">
          {breadcrumbs && <div className="mb-5">{breadcrumbs}</div>}
          <div className="max-w-[46rem]">
            <h1 className="t-h1 text-ink">{title}</h1>
            {lead && <p className="t-lead mt-5">{lead}</p>}
            {meta && <div className="t-meta mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">{meta}</div>}
          </div>
          {image && !isEmptyEditorial(image) && <div className="mt-8 max-w-5xl">{image}</div>}
        </div>
      </header>

      <div className="container py-10 md:py-14">
        <div className={cn(hasSide && 'grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14')}>
          {hasSide && (
            <aside aria-label="Índice de la página" className="min-w-0">
              <div className="lg:sticky lg:top-24">
                {toc && toc.length > 0 && (
                  <>
                    <details className="rounded-xl border border-rule p-4 lg:hidden">
                      <summary className="cursor-pointer font-semibold text-ink">En esta página</summary>
                      <TocList items={toc} className="mt-3" />
                    </details>
                    <nav aria-label="En esta página" className="hidden lg:block">
                      <p className="t-label mb-3">En esta página</p>
                      <TocList items={toc} />
                    </nav>
                  </>
                )}
                {aside && <div className="mt-6">{aside}</div>}
              </div>
            </aside>
          )}
          <div className="min-w-0">
            <div className={cn(prose && 'prose')}>{children}</div>
            {footer && <div className="mt-12 border-t border-rule pt-10">{footer}</div>}
          </div>
        </div>
      </div>
    </article>
  );
};

const TocList: React.FC<{ items: TocItem[]; className?: string }> = ({ items, className }) => (
  <ol className={cn('space-y-1', className)}>
    {items.map((it) => (
      <li key={it.id}>
        <a
          href={`#${it.id}`}
          className="block rounded-md px-2 py-1.5 text-sm text-ink-2 hover:bg-paper hover:text-ink"
        >
          {it.label}
        </a>
      </li>
    ))}
  </ol>
);

export default ReadingLayout;

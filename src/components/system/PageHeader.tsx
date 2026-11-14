import React from 'react';
import { cn } from '@/lib/utils';
import { isEmptyEditorial } from '@/components/media/EditorialImage';

interface PageHeaderProps {
  /** H1 de la página. Uno solo por página. */
  title: React.ReactNode;
  /** Bajada: qué encuentra la persona aquí, en una o dos frases. */
  lead?: React.ReactNode;
  /** Migas (SEOBreadcrumbs) sobre el título. */
  breadcrumbs?: React.ReactNode;
  /** Línea de metadatos bajo la bajada: fecha de los datos, método, divulgación. */
  meta?: React.ReactNode;
  /** Botones o enlaces principales. */
  actions?: React.ReactNode;
  /** Columna derecha en escritorio: imagen editorial o ficha de evidencia. */
  aside?: React.ReactNode;
  /** display: portadas (titular grande). page: páginas interiores. */
  size?: 'display' | 'page';
  className?: string;
}

/**
 * Cabecera común de página: migas, H1 con la voz del sistema, bajada,
 * metadatos con fecha y acciones. Todo alineado a la izquierda.
 */
const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  lead,
  breadcrumbs,
  meta,
  actions,
  aside,
  size = 'page',
  className,
}) => {
  const side = aside && !isEmptyEditorial(aside) ? aside : null;
  return (
  <header className={cn('border-b border-rule bg-white', className)}>
    <div className={cn('container', size === 'display' ? 'py-10 md:py-16' : 'py-8 md:py-12')}>
      {breadcrumbs && <div className="mb-5">{breadcrumbs}</div>}
      <div className={cn(side && 'grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-14')}>
        <div className="min-w-0">
          <h1 className={cn(size === 'display' ? 't-display' : 't-h1', 'text-ink')}>{title}</h1>
          {lead && <p className="t-lead mt-5">{lead}</p>}
          {actions && <div className="mt-7 flex flex-wrap items-center gap-3">{actions}</div>}
          {meta && <div className="t-meta mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">{meta}</div>}
        </div>
        {side && <div className="min-w-0">{side}</div>}
      </div>
    </div>
  </header>
  );
};

export default PageHeader;

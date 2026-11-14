import React from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  id?: string;
  /** white (por defecto), paper (banda suave) o ink (banda oscura). */
  tone?: 'white' | 'paper' | 'ink';
  /** Título H2 de la sección. */
  title?: React.ReactNode;
  /** Bajada bajo el título (máx. 62ch). */
  lead?: React.ReactNode;
  /** Acción o enlace alineado a la derecha del título en escritorio. */
  action?: React.ReactNode;
  /** tight: menos aire vertical (secciones secundarias). */
  density?: 'normal' | 'tight';
  className?: string;
  containerClassName?: string;
  children?: React.ReactNode;
  'aria-label'?: string;
}

const TONE: Record<NonNullable<SectionProps['tone']>, string> = {
  white: 'bg-white text-ink',
  paper: 'bg-paper text-ink',
  ink: 'bg-ink text-white',
};

/**
 * Sección de página del sistema: un solo ritmo vertical, contenido alineado
 * al borde del logo y título a la izquierda.
 */
const Section: React.FC<SectionProps> = ({
  id,
  tone = 'white',
  title,
  lead,
  action,
  density = 'normal',
  className,
  containerClassName,
  children,
  ...rest
}) => {
  const headingId = id && title ? `${id}-titulo` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      aria-label={rest['aria-label']}
      className={cn(TONE[tone], density === 'tight' ? 'py-10 md:py-14' : 'py-14 md:py-20', 'scroll-mt-24', className)}
    >
      <div className={cn('container', containerClassName)}>
        {(title || lead || action) && (
          <header className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
            <div className="max-w-[62ch]">
              {title && (
                <h2 id={headingId} className={cn('t-h2', tone === 'ink' ? 'text-white' : 'text-ink')}>
                  {title}
                </h2>
              )}
              {lead && <p className={cn('t-lead mt-3', tone === 'ink' && 'text-white/75')}>{lead}</p>}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
};

export default Section;

import React from 'react';
import { Link } from 'react-router-dom';
import { Users, CalendarCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDataDate, isoDate } from '@/lib/format';

interface AuthorBylineProps {
  /** Fecha de la última revisión, AAAA-MM-DD. Se lee como fecha local: no corre el día. */
  reviewedAt?: string;
  /**
   * true: dentro de la línea de metadatos de ReadingLayout o PageHeader
   * (sin contenedor ni márgenes propios; toma su letra t-meta).
   */
  inline?: boolean;
  className?: string;
}

/** Autoría y fecha de revisión de una guía. */
const AuthorByline: React.FC<AuthorBylineProps> = ({ reviewedAt, inline = false, className }) => {
  const iso = isoDate(reviewedAt);
  return (
    <div
      className={cn(
        inline ? 'contents' : 't-meta mb-6 flex flex-wrap items-center gap-x-4 gap-y-2',
        className,
      )}
    >
      <span className="inline-flex items-center gap-1.5">
        <Users aria-hidden className="h-4 w-4 shrink-0 text-ink-3" />
        <span>
          Por{' '}
          <Link
            to="/sobre-nosotros"
            className="font-semibold text-ink underline decoration-ink/30 underline-offset-2 hover:decoration-ink"
          >
            Equipo Editorial de EligeTuHosting
          </Link>
        </span>
      </span>
      {iso && (
        <span className="inline-flex items-center gap-1.5">
          <CalendarCheck aria-hidden className="h-4 w-4 shrink-0 text-ink-3" />
          <span>
            Última revisión: <time dateTime={iso}>{formatDataDate(reviewedAt)}</time>
          </span>
        </span>
      )}
    </div>
  );
};

export default AuthorByline;

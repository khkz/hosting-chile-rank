import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar } from 'lucide-react';

interface AuthorBylineProps {
  reviewedAt?: string; // ISO date e.g. "2026-05-15"
  className?: string;
}

const formatDate = (iso?: string) => {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
};

const AuthorByline: React.FC<AuthorBylineProps> = ({ reviewedAt, className = '' }) => {
  const date = formatDate(reviewedAt);
  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-6 ${className}`}
    >
      <span className="inline-flex items-center gap-1.5">
        <Users className="w-4 h-4" aria-hidden="true" />
        Por{' '}
        <Link
          to="/sobre-nosotros"
          className="font-medium text-foreground underline underline-offset-2 hover:text-primary"
        >
          Equipo Editorial de EligeTuHosting
        </Link>
      </span>
      {date && (
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="w-4 h-4" aria-hidden="true" />
          Última revisión: {date}
        </span>
      )}
    </div>
  );
};

export default AuthorByline;

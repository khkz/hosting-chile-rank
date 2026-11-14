import React from 'react';
import { formatDataDate, isoDate } from '@/lib/format';

interface SourcesConsultedProps {
  fuentes?: string | null;
  fechaVerificacion?: string | null;
}

/**
 * Muestra las fuentes con las que se comprobó la ficha.
 * SIEMPRE como texto plano: nunca se enlazan, para no pasar autoridad
 * a sitios de terceros. Los saltos de línea se respetan con pre-line.
 */
const SourcesConsulted: React.FC<SourcesConsultedProps> = ({ fuentes, fechaVerificacion }) => {
  if (!fuentes) return null;
  return (
    <div className="mt-8 max-w-[72ch]">
      <h3 className="t-h3 text-ink">Fuentes consultadas</h3>
      <p className="mt-2 whitespace-pre-line break-words t-small text-ink-2">{fuentes}</p>
      {fechaVerificacion && (
        <p className="mt-2 t-meta">
          Revisadas el <time dateTime={isoDate(fechaVerificacion)}>{formatDataDate(fechaVerificacion)}</time>
        </p>
      )}
    </div>
  );
};

export default SourcesConsulted;

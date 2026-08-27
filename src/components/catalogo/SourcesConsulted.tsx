import React from 'react';

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
  const fecha = fechaVerificacion ? String(fechaVerificacion).slice(0, 10) : null;
  return (
    <section className="mt-10">
      <h3 className="text-lg font-semibold mb-2">Fuentes consultadas</h3>
      <p className="text-sm text-muted-foreground whitespace-pre-line break-words">{fuentes}</p>
      {fecha && (
        <p className="text-xs text-muted-foreground mt-2">Datos verificados el {fecha}</p>
      )}
    </section>
  );
};

export default SourcesConsulted;

import React from 'react';
import EvidenceCard, { type EvidenceRow } from '@/components/system/EvidenceCard';

interface ProviderEvidenceProps {
  name: string;
  subtitle?: React.ReactNode;
  /** Nota editorial (0–10). null o 0 = sin nota: no se dibuja ningún número. */
  rating: number | null | undefined;
  rows: EvidenceRow[];
  footer?: React.ReactNode;
  /** false en ediciones cuyas notas están pendientes de decisión (no se muestra fila de nota). */
  showRating?: boolean;
}

/**
 * Ficha de evidencia de la cabecera. Lleva un H2 solo para lectores de
 * pantalla para que el título de la tarjeta (H3) no salte un nivel tras el H1.
 */
const ProviderEvidence: React.FC<ProviderEvidenceProps> = ({ name, subtitle, rating, rows, footer, showRating = true }) => {
  const hasRating = showRating && rating != null && Number(rating) > 0;
  const allRows: EvidenceRow[] =
    showRating && !hasRating ? [{ label: 'Nota', value: 'Sin nota editorial' }, ...rows] : rows;
  return (
    <div className="min-w-0">
      <h2 className="sr-only">Resumen de {name}</h2>
      <EvidenceCard
        title={name}
        subtitle={subtitle}
        score={hasRating ? Number(rating) : undefined}
        scoreKind="editorial"
        rows={allRows}
        footer={footer}
      />
    </div>
  );
};

export default ProviderEvidence;

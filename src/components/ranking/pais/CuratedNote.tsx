import React from 'react';
import { Link } from 'react-router-dom';
import { ProvenanceTag } from '@/components/data/Provenance';

interface CuratedNoteProps {
  name: string;
  slug: string;
  countrySlug: string;
  countryName: string;
}

/**
 * Recomendado editorial de la edición, con su divulgación. Mismo texto que
 * antes (pendiente 8); solo cambia la forma: neutro, sin rojo ni letra chica.
 */
const CuratedNote: React.FC<CuratedNoteProps> = ({ name, slug, countrySlug, countryName }) => (
  <aside aria-label="Recomendado editorial" className="rounded-xl border border-rule bg-paper p-5 md:p-6">
    <div className="flex flex-wrap items-center gap-2">
      <p className="t-label">Recomendado editorial</p>
      <ProvenanceTag kind="editorial" />
    </div>
    <p className="t-h3 mt-2 text-ink">{name}</p>
    <p className="t-small mt-2 text-ink-2">
      Operador regional con soporte en español en {countryName}. Dónde están sus servidores y qué entidad factura, en su{' '}
      <Link to={`/${countrySlug}/${slug}`} className="font-medium text-ink underline underline-offset-4">
        ficha
      </Link>
      .
    </p>
    <p className="t-meta mt-3">
      <strong className="font-semibold text-ink-2">Divulgación:</strong> tenemos una relación comercial con este proveedor y
      podemos recibir una comisión si contratas por este enlace. La recomendación se basa en trayectoria verificable y no
      altera el orden objetivo del ranking.
    </p>
  </aside>
);

export default CuratedNote;

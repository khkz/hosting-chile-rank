import React from 'react';
import { ProvenanceTag } from '@/components/data/Provenance';
import { CATALOG_GRID } from '@/components/catalogo/CatalogRow';

interface CatalogListProps {
  /** Nombre accesible de la lista. */
  label: string;
  children: React.ReactNode;
}

/** Leyenda corta de las dos procedencias que aparecen en la lista. */
export const CatalogLegend: React.FC<{ className?: string }> = ({ className = '' }) => (
  <p className={`flex flex-wrap items-center gap-x-5 gap-y-2 t-meta ${className}`}>
    <span className="inline-flex items-center gap-2">
      <ProvenanceTag kind="editorial" /> nota del equipo editorial
    </span>
    <span className="inline-flex items-center gap-2">
      <ProvenanceTag kind="declared" /> lo publica el proveedor
    </span>
  </p>
);

/**
 * Lista de proveedores en filas densas: en escritorio, con encabezados de
 * columna (solo visuales; cada celda lleva su rótulo para lectores de pantalla).
 */
const CatalogList: React.FC<CatalogListProps> = ({ label, children }) => (
  <div>
    <div
      aria-hidden
      className={`hidden border-b-2 border-ink pb-2.5 text-[13px] font-semibold text-ink-2 md:grid md:gap-x-5 ${CATALOG_GRID}`}
    >
      <span className="[grid-area:name]">Proveedor</span>
      <span className="[grid-area:nota]">Nota</span>
      <span className="[grid-area:dc]">Datacenter</span>
      <span className="[grid-area:group]">Grupo</span>
      <span className="[grid-area:year]">Opera desde</span>
      <span className="[grid-area:actions]" />
    </div>
    <ul aria-label={label} className="divide-y divide-rule border-y-2 border-ink md:border-t-0 md:border-b md:border-b-rule">
      {children}
    </ul>
  </div>
);

export default CatalogList;

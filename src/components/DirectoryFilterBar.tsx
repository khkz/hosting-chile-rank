import React from 'react';
import { ProvenanceTag } from '@/components/data/Provenance';

export type SortMode = 'default' | 'name' | 'oldest';

interface Props {
  onlyDcLocal: boolean;
  only247: boolean;
  sort: SortMode;
  countryName: string;
  onOnlyDcLocalChange: (v: boolean) => void;
  onOnly247Change: (v: boolean) => void;
  onSortChange: (v: SortMode) => void;
  totalCount: number;
  visibleCount: number;
}

/**
 * Barra de filtros client-side accesible por teclado.
 * No hace network: filtra/ordena la lista ya cargada.
 * «Solo datacenter en {país}» filtra por lo que declara cada proveedor.
 */
const DirectoryFilterBar: React.FC<Props> = ({
  onlyDcLocal,
  only247,
  sort,
  countryName,
  onOnlyDcLocalChange,
  onOnly247Change,
  onSortChange,
  totalCount,
  visibleCount,
}) => {
  const check = 'h-5 w-5 shrink-0 rounded-sm border-rule accent-ink';
  const option = 'inline-flex min-h-[44px] cursor-pointer select-none items-center gap-2.5 text-[15px] text-ink';
  return (
    <div
      role="region"
      aria-label="Filtros del directorio"
      className="mb-6 flex flex-col gap-3 rounded-xl border border-rule bg-paper px-4 py-3 md:flex-row md:items-center md:gap-6"
    >
      <fieldset className="flex flex-1 flex-wrap items-center gap-x-6 gap-y-1">
        <legend className="sr-only">Filtros de proveedores</legend>
        <label className={option}>
          <input
            type="checkbox"
            checked={onlyDcLocal}
            onChange={(e) => onOnlyDcLocalChange(e.target.checked)}
            className={check}
          />
          <span className="inline-flex items-center gap-1.5">
            Solo datacenter en {countryName}
            <ProvenanceTag kind="declared" variant="glyph" />
          </span>
        </label>
        <label className={option}>
          <input
            type="checkbox"
            checked={only247}
            onChange={(e) => onOnly247Change(e.target.checked)}
            className={check}
          />
          <span>Solo soporte 24/7</span>
        </label>
      </fieldset>

      <div className="flex items-center gap-2">
        <label htmlFor="dir-sort" className="t-small text-ink-2">
          Ordenar
        </label>
        <select
          id="dir-sort"
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortMode)}
          className="h-11 min-w-0 flex-1 rounded-lg border border-rule bg-white px-3 text-base text-ink md:flex-none md:text-sm"
        >
          <option value="default">Por defecto</option>
          <option value="name">Nombre (A–Z)</option>
          <option value="oldest">Antigüedad (más antiguos primero)</option>
        </select>
      </div>

      <p aria-live="polite" className="t-meta whitespace-nowrap tabular">
        {visibleCount} de {totalCount} proveedores
      </p>
    </div>
  );
};

export default DirectoryFilterBar;

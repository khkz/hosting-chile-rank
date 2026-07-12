import React from 'react';

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
  return (
    <div
      role="region"
      aria-label="Filtros del directorio"
      className="mb-6 bg-white border border-[#2B2D42]/10 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-5"
    >
      <fieldset className="flex flex-wrap items-center gap-3 md:gap-4 flex-1">
        <legend className="sr-only">Filtros de proveedores</legend>
        <label className="inline-flex items-center gap-2 text-sm text-[#2B2D42] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={onlyDcLocal}
            onChange={(e) => onOnlyDcLocalChange(e.target.checked)}
            className="h-4 w-4 rounded border-[#2B2D42]/30 text-[#EF233C] focus:ring-2 focus:ring-[#EF233C]/40"
          />
          <span>Solo datacenter en {countryName}</span>
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-[#2B2D42] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={only247}
            onChange={(e) => onOnly247Change(e.target.checked)}
            className="h-4 w-4 rounded border-[#2B2D42]/30 text-[#EF233C] focus:ring-2 focus:ring-[#EF233C]/40"
          />
          <span>Solo soporte 24/7</span>
        </label>
      </fieldset>

      <div className="flex items-center gap-2 text-sm">
        <label htmlFor="dir-sort" className="text-[#2B2D42]/70">
          Ordenar:
        </label>
        <select
          id="dir-sort"
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortMode)}
          className="rounded-md border border-[#2B2D42]/15 bg-white px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EF233C]/40"
        >
          <option value="default">Por defecto</option>
          <option value="name">Nombre (A–Z)</option>
          <option value="oldest">Antigüedad (más antiguos primero)</option>
        </select>
      </div>

      <div
        aria-live="polite"
        className="text-xs text-[#2B2D42]/60 md:ml-2 whitespace-nowrap"
      >
        {visibleCount} de {totalCount} proveedores
      </div>
    </div>
  );
};

export default DirectoryFilterBar;

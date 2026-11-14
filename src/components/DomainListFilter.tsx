import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { formatInteger } from '@/lib/format';

interface DomainListFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  totalDomains: number;
  filteredCount: number;
}

/** Filtro de texto de la lista de últimos dominios. */
const DomainListFilter = ({ searchTerm, onSearchChange, totalDomains, filteredCount }: DomainListFilterProps) => {
  const isFiltering = searchTerm.length > 0;

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="w-full max-w-md">
        <label htmlFor="filtrar-dominios" className="t-label">
          Filtrar la lista
        </label>
        <div className="relative mt-2">
          <Search aria-hidden className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
          <Input
            id="filtrar-dominios"
            type="text"
            placeholder="Ej.: tienda"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-12"
          />
          {isFiltering && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Borrar el filtro"
              className="absolute right-0 top-0 inline-flex h-11 w-11 items-center justify-center rounded-lg text-ink-2 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X aria-hidden className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <p className="t-meta tabular" aria-live="polite">
        {isFiltering
          ? `${formatInteger(filteredCount)} de ${formatInteger(totalDomains)} dominios`
          : `${formatInteger(totalDomains)} dominios en la lista`}
      </p>
    </div>
  );
};

export default DomainListFilter;

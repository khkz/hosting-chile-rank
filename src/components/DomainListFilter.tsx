import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DomainListFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  totalDomains: number;
  filteredCount: number;
}

const DomainListFilter = ({ searchTerm, onSearchChange, totalDomains, filteredCount }: DomainListFilterProps) => {
  const isFiltering = searchTerm.length > 0;
  
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Buscar dominios..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
          />
          {isFiltering && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          {isFiltering ? (
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
              {filteredCount} de {totalDomains} dominios
            </Badge>
          ) : (
            <span className="text-sm text-slate-500 whitespace-nowrap">
              {totalDomains} dominios disponibles
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DomainListFilter;

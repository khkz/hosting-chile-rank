
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface DomainListFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  totalDomains: number;
  filteredCount: number;
}

const DomainListFilter = ({ searchTerm, onSearchChange, totalDomains, filteredCount }: DomainListFilterProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Filtrar la lista de dominios recientes..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-sm text-gray-500 whitespace-nowrap">
            {searchTerm ? `${filteredCount} de ${totalDomains}` : `${totalDomains} dominios`}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DomainListFilter;

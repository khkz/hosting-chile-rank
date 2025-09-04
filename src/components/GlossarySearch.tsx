import React, { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { searchTerms, wikiCategories } from '@/data/wiki/terms';

interface GlossarySearchProps {
  onResults: (results: any[]) => void;
  initialQuery?: string;
}

const GlossarySearch: React.FC<GlossarySearchProps> = ({ 
  onResults, 
  initialQuery = '' 
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [cmsFilter, setCmsFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');

  const filteredResults = useMemo(() => {
    const filters: any = {};
    if (categoryFilter !== 'all') filters.category = categoryFilter;
    if (cmsFilter !== 'all') filters.cms = cmsFilter;
    if (levelFilter !== 'all') filters.level = levelFilter;

    return searchTerms(query, filters);
  }, [query, categoryFilter, cmsFilter, levelFilter]);

  useEffect(() => {
    onResults(filteredResults);
  }, [filteredResults, onResults]);

  const clearFilters = () => {
    setQuery('');
    setCategoryFilter('all');
    setCmsFilter('all');
    setLevelFilter('all');
  };

  const hasActiveFilters = query || categoryFilter !== 'all' || cmsFilter !== 'all' || levelFilter !== 'all';

  return (
    <div className="space-y-4">
      {/* Búsqueda principal */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar términos... (ej: WordPress, cache, seguridad)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {wikiCategories.map(cat => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={cmsFilter} onValueChange={setCmsFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="CMS" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los CMS</SelectItem>
            <SelectItem value="wordpress">WordPress</SelectItem>
            <SelectItem value="joomla">Joomla</SelectItem>
            <SelectItem value="moodle">Moodle</SelectItem>
            <SelectItem value="general">General</SelectItem>
          </SelectContent>
        </Select>

        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Nivel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los niveles</SelectItem>
            <SelectItem value="basico">Básico</SelectItem>
            <SelectItem value="medio">Medio</SelectItem>
            <SelectItem value="avanzado">Avanzado</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearFilters}
            className="text-sm"
          >
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Resultados count y tags */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {filteredResults.length} término{filteredResults.length !== 1 ? 's' : ''} encontrado{filteredResults.length !== 1 ? 's' : ''}
        </div>
        
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-1">
            {query && (
              <Badge variant="secondary" className="text-xs">
                "{query}"
              </Badge>
            )}
            {categoryFilter !== 'all' && (
              <Badge variant="secondary" className="text-xs">
                {wikiCategories.find(c => c.id === categoryFilter)?.name}
              </Badge>
            )}
            {cmsFilter !== 'all' && (
              <Badge variant="secondary" className="text-xs">
                {cmsFilter}
              </Badge>
            )}
            {levelFilter !== 'all' && (
              <Badge variant="secondary" className="text-xs">
                {levelFilter}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlossarySearch;
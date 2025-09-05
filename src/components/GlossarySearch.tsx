import React, { useState, useMemo, useEffect } from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import { useDebounce } from 'use-debounce';
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
import { searchTerms, wikiCategories, WikiTerm } from '@/data/wiki/terms';

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
  const [sortBy, setSortBy] = useState<'relevance' | 'alphabetical' | 'level' | 'recent'>('relevance');
  
  // Debounce search query for smoother UX
  const [debouncedQuery] = useDebounce(query, 150);

  const filteredResults = useMemo(() => {
    const filters: any = {};
    if (categoryFilter !== 'all') filters.category = categoryFilter;
    if (cmsFilter !== 'all') filters.cms = cmsFilter;
    if (levelFilter !== 'all') filters.level = levelFilter;

    let results = searchTerms(debouncedQuery, filters);
    
    // Apply sorting
    switch (sortBy) {
      case 'alphabetical':
        results.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'level':
        const levelOrder = { 'basico': 1, 'medio': 2, 'avanzado': 3 };
        results.sort((a, b) => levelOrder[a.level as keyof typeof levelOrder] - levelOrder[b.level as keyof typeof levelOrder]);
        break;
      case 'recent':
        results.sort((a, b) => {
          const dateA = new Date(a.lastUpdated || '2025-01-01');
          const dateB = new Date(b.lastUpdated || '2025-01-01');
          return dateB.getTime() - dateA.getTime();
        });
        break;
      default: // relevance
        // Keep the original search relevance order
        break;
    }
    
    return results;
  }, [debouncedQuery, categoryFilter, cmsFilter, levelFilter, sortBy]);

  useEffect(() => {
    onResults(filteredResults);
  }, [filteredResults, onResults]);

  const clearFilters = () => {
    setQuery('');
    setCategoryFilter('all');
    setCmsFilter('all');
    setLevelFilter('all');
    setSortBy('relevance');
  };

  const hasActiveFilters = query || categoryFilter !== 'all' || cmsFilter !== 'all' || levelFilter !== 'all' || sortBy !== 'relevance';

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

      {/* Filtros y ordenamiento */}
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
            <SelectItem value="drupal">Drupal</SelectItem>
            <SelectItem value="prestashop">PrestaShop</SelectItem>
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

        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Relevancia
              </div>
            </SelectItem>
            <SelectItem value="alphabetical">A-Z</SelectItem>
            <SelectItem value="level">Por nivel</SelectItem>
            <SelectItem value="recent">Más recientes</SelectItem>
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
            {sortBy !== 'relevance' && (
              <Badge variant="secondary" className="text-xs">
                {sortBy === 'alphabetical' ? 'A-Z' : sortBy === 'level' ? 'Por nivel' : 'Recientes'}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlossarySearch;
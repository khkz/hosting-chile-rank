import React, { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { searchTerms, wikiCategories, WikiTerm } from '@/data/wiki/terms.ts';
import { CMS_LABEL, LEVEL_LABEL } from '@/components/lectura/wikiLabels';
import { formatInteger } from '@/lib/format';

interface GlossarySearchProps {
  onResults: (results: WikiTerm[]) => void;
  initialQuery?: string;
}

type SortKey = 'relevance' | 'alphabetical' | 'level' | 'recent';

const SORT_LABEL: Record<SortKey, string> = {
  relevance: 'Relevancia',
  alphabetical: 'A-Z',
  level: 'Por nivel',
  recent: 'Más recientes',
};

const LEVEL_ORDER: Record<WikiTerm['level'], number> = { basico: 1, medio: 2, avanzado: 3 };
const trigger = 'h-11 w-full rounded-lg border-rule bg-white text-sm text-ink';

const GlossarySearch: React.FC<GlossarySearchProps> = ({ onResults, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [cmsFilter, setCmsFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortKey>('relevance');

  // Debounce para no filtrar en cada tecla.
  const [debouncedQuery] = useDebounce(query, 150);

  const filteredResults = useMemo(() => {
    const filters: Record<string, string> = {};
    if (categoryFilter !== 'all') filters.category = categoryFilter;
    if (cmsFilter !== 'all') filters.cms = cmsFilter;
    if (levelFilter !== 'all') filters.level = levelFilter;

    const results = [...searchTerms(debouncedQuery, filters)];
    if (sortBy === 'alphabetical') results.sort((a, b) => a.title.localeCompare(b.title, 'es'));
    if (sortBy === 'level') results.sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]);
    // «Más recientes» ordena por la fecha de actualización que trae cada término.
    if (sortBy === 'recent') results.sort((a, b) => (b.lastUpdated ?? '').localeCompare(a.lastUpdated ?? ''));
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

  const hasActiveFilters =
    query || categoryFilter !== 'all' || cmsFilter !== 'all' || levelFilter !== 'all' || sortBy !== 'relevance';
  const n = filteredResults.length;

  return (
    <div className="space-y-4">
      <div className="relative">
        <label htmlFor="wiki-buscar" className="sr-only">
          Buscar en la wiki
        </label>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" aria-hidden />
        <Input
          id="wiki-buscar"
          type="search"
          placeholder="Busca un término: WordPress, caché, SSL…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className={trigger} aria-label="Filtrar por categoría">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {wikiCategories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={cmsFilter} onValueChange={setCmsFilter}>
          <SelectTrigger className={trigger} aria-label="Filtrar por CMS">
            <SelectValue placeholder="CMS" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los CMS</SelectItem>
            {(Object.keys(CMS_LABEL) as WikiTerm['cms'][]).map((k) => (
              <SelectItem key={k} value={k}>
                {CMS_LABEL[k]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className={trigger} aria-label="Filtrar por nivel">
            <SelectValue placeholder="Nivel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los niveles</SelectItem>
            {(Object.keys(LEVEL_LABEL) as WikiTerm['level'][]).map((k) => (
              <SelectItem key={k} value={k}>
                {LEVEL_LABEL[k]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortKey)}>
          <SelectTrigger className={trigger} aria-label="Ordenar resultados">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(SORT_LABEL) as SortKey[]).map((k) => (
              <SelectItem key={k} value={k}>
                {SORT_LABEL[k]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="t-small text-ink-2" role="status" aria-live="polite">
          {formatInteger(n)} {n === 1 ? 'término encontrado' : 'términos encontrados'}
        </p>
        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters}>
            Limpiar filtros
          </Button>
        )}
      </div>
    </div>
  );
};

export default GlossarySearch;

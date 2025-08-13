import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import { searchASN, ASNSearchResult } from '@/services/asnApi';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, Search, Filter, MapPin } from 'lucide-react';
import UltimasBusquedas from '@/components/UltimasBusquedas';
import { isChileanASN } from '@/utils/ipDetection';

const ASNDirectory: React.FC = () => {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<ASNSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'asn' | 'name'>('asn');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => performSearch(q), 400);
    return () => clearTimeout(t);
  }, [q]);

  // Enhanced search to support ASN ranges
  const performSearch = async (query: string) => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    
    setLoading(true);
    try {
      let searchResults = await searchASN(query);
      
      // Handle ASN range searches like AS1000-AS2000
      const rangeMatch = query.match(/AS?(\d+)\s*-\s*AS?(\d+)/i);
      if (rangeMatch) {
        const start = parseInt(rangeMatch[1]);
        const end = parseInt(rangeMatch[2]);
        // Generate synthetic results for range (simplified)
        const rangeResults = [];
        for (let asn = start; asn <= Math.min(end, start + 50); asn++) {
          rangeResults.push({
            asn,
            name: `AS${asn}`,
            description: 'Sistema autónomo',
            country_code: undefined
          });
        }
        searchResults = rangeResults;
      }
      
      setResults(searchResults);
    } catch (e) {
      console.error(e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort results
  const filteredAndSortedResults = useMemo(() => {
    let filtered = [...results];
    
    // Apply country filter
    if (countryFilter === 'chile') {
      filtered = filtered.filter(r => 
        r.country_code === 'CL' || 
        isChileanASN(`AS${r.asn}`) ||
        (r.name && /chile|claro|entel|movistar|vtr|gtd/i.test(r.name))
      );
    } else if (countryFilter !== 'all') {
      filtered = filtered.filter(r => r.country_code === countryFilter);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'asn') {
        return a.asn - b.asn;
      }
      return (a.name || '').localeCompare(b.name || '');
    });
    
    return filtered;
  }, [results, countryFilter, sortBy]);

  const itemListLd = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: filteredAndSortedResults.slice(0, 20).map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${window.location.origin}/asn/AS${r.asn}`,
      name: `AS${r.asn} ${r.name || ''}`.trim(),
    })),
  }), [filteredAndSortedResults]);

  return (
    <main className="container mx-auto px-4 py-8">
      <Helmet>
        <title>ASN Chile: Mapa y Directorio (BGP)</title>
        <meta name="description" content="Explora ASNs de Chile: proveedores, prefijos IP y peers. Busca por ASN o nombre y navega el mapa y directorio de redes." />
        <link rel="canonical" href={`${window.location.origin}/asn`} />
        <meta httpEquiv="content-language" content="es-CL" />
        <link rel="alternate" hrefLang="es-cl" href={`${window.location.origin}/asn`} />
        <meta property="og:title" content="ASN Chile: Mapa y Directorio (BGP)" />
        <meta property="og:description" content="Explora ASNs de Chile: proveedores, prefijos IP y peers." />
        <meta property="og:url" content={`${window.location.origin}/asn`} />
        <script type="application/ld+json">{JSON.stringify(itemListLd)}</script>
      </Helmet>

      <SEOBreadcrumbs items={[]} pageName="ASN" />

      <header className="mb-6">
        <h1 className="text-3xl font-bold">Mapa y Directorio de ASN</h1>
        <p className="text-muted-foreground mt-2">Busca el sistema autónomo (ASN) de un proveedor para ver sus rangos IP y relaciones.</p>
        
        {/* Enlaces rápidos */}
        <div className="mt-4 flex gap-2">
          <Link 
            to="/asn/chile" 
            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors text-sm"
          >
            <MapPin className="h-4 w-4" />
            Ver ASNs de Chile
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Ej: AS27651, Claro, Entel, GTD, AS1000-AS2000..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9"
            aria-label="Buscar ASN"
          />
        </div>
        
        {/* Filtros avanzados */}
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          
          {(countryFilter !== 'all' || sortBy !== 'asn') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCountryFilter('all');
                setSortBy('asn');
              }}
            >
              Limpiar filtros
            </Button>
          )}
        </div>

        {showFilters && (
          <div className="grid gap-4 p-4 border rounded-lg bg-muted/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">País/Región</label>
                <Select value={countryFilter} onValueChange={setCountryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por país" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los países</SelectItem>
                    <SelectItem value="chile">🇨🇱 Chile</SelectItem>
                    <SelectItem value="US">🇺🇸 Estados Unidos</SelectItem>
                    <SelectItem value="BR">🇧🇷 Brasil</SelectItem>
                    <SelectItem value="AR">🇦🇷 Argentina</SelectItem>
                    <SelectItem value="MX">🇲🇽 México</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Ordenar por</label>
                <Select value={sortBy} onValueChange={(value: 'asn' | 'name') => setSortBy(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ordenar resultados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asn">Número ASN</SelectItem>
                    <SelectItem value="name">Nombre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm"><Loader2 className="h-4 w-4 animate-spin" /> Buscando ASNs…</div>
      )}

      {filteredAndSortedResults.length > 0 && (
        <div className="mb-4 text-sm text-muted-foreground">
          Mostrando {Math.min(filteredAndSortedResults.length, 30)} de {filteredAndSortedResults.length} resultados
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAndSortedResults.slice(0, 30).map((r) => {
          const isChilean = r.country_code === 'CL' || isChileanASN(`AS${r.asn}`) || 
            (r.name && /chile|claro|entel|movistar|vtr|gtd/i.test(r.name));
          
          return (
            <Card key={r.asn} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Link to={`/asn/AS${r.asn}`} className="hover:underline">AS{r.asn} {r.name}</Link>
                  {isChilean && <div title="ASN Chileno"><MapPin className="h-4 w-4 text-blue-600" /></div>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{r.description || 'Proveedor de red'}</p>
                <div className="flex items-center gap-2 mt-2">
                  {r.country_code && (
                    <span className="text-xs bg-muted px-2 py-1 rounded">País: {r.country_code}</span>
                  )}
                  {isChilean && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">🇨🇱 Chileno</span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {filteredAndSortedResults.length === 0 && !loading && q.trim().length >= 2 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No se encontraron ASNs con los criterios de búsqueda.</p>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => {
              setCountryFilter('all');
              setSortBy('asn');
            }}
          >
            Limpiar filtros
          </Button>
        </div>
      )}

      {results.length === 0 && !loading && q.trim().length < 2 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Escribe al menos 2 caracteres para buscar ASNs por nombre o número.</p>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Ejemplos de búsqueda:</strong></p>
            <p>• AS27651 (número específico)</p>
            <p>• Claro, Entel, GTD (por nombre)</p>
            <p>• AS1000-AS2000 (rango de ASNs)</p>
          </div>
        </div>
      )}

      {/* Últimas búsquedas para SEO */}
      <div className="mt-12">
        <UltimasBusquedas />
      </div>
    </main>
  );
};

export default ASNDirectory;

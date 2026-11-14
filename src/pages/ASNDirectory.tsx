import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Filter, Loader2, MapPin, RefreshCw, Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import PageHeader from '@/components/system/PageHeader';
import Section from '@/components/system/Section';
import Callout from '@/components/system/Callout';
import { searchASN, ASNSearchResult } from '@/services/asnApi';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import UltimasBusquedasASN from '@/components/UltimasBusquedasASN';
import { useASNSearchHistory } from '@/hooks/useASNSearchHistory';
import { AsnResultsTable, AsnSourceLine } from '@/components/herramientas/AsnShared';
import { isChileanResult } from '@/components/herramientas/asnText';
import { formatInteger } from '@/lib/format';

const linkClass = 'text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink';

const ASNDirectory: React.FC = () => {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<ASNSearchResult[]>([]);
  const [rangeList, setRangeList] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'asn' | 'name'>('asn');
  const [showFilters, setShowFilters] = useState(false);
  const { addToHistory } = useASNSearchHistory();
  const filtersActive = countryFilter !== 'all' || sortBy !== 'asn';

  // Busca por nombre o número; un rango (AS1000-AS2000) solo lista números para abrir.
  const performSearch = async (query: string) => {
    setFailed(false);
    const rangeMatch = query.match(/AS?(\d+)\s*-\s*AS?(\d+)/i);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1]);
      const end = parseInt(rangeMatch[2]);
      const list: number[] = [];
      for (let asn = start; asn <= Math.min(end, start + 50); asn++) list.push(asn);
      setResults([]);
      setRangeList(list);
      return;
    }
    setRangeList([]);
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const searchResults = await searchASN(query);
      setResults(searchResults);
      searchResults.forEach(result => {
        addToHistory({ asn: result.asn, name: result.name || `AS${result.asn}`, countryCode: result.country_code });
      });
    } catch (e) {
      console.error(e);
      setResults([]);
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => performSearch(q), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const filteredAndSortedResults = useMemo(() => {
    let filtered = [...results];
    if (countryFilter === 'chile') filtered = filtered.filter(isChileanResult);
    else if (countryFilter !== 'all') filtered = filtered.filter(r => r.country_code === countryFilter);
    filtered.sort((a, b) => (sortBy === 'asn' ? a.asn - b.asn : (a.name || '').localeCompare(b.name || '')));
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

  const clearFilters = () => {
    setCountryFilter('all');
    setSortBy('asn');
  };
  const searched = q.trim().length >= 2 && rangeList.length === 0;

  return (
    <div className="flex min-h-screen flex-col bg-white text-ink">
      <Navbar />
      <Helmet>
        <title>ASN Chile: Directorio BGP | EligeTuHosting.cl</title>
        <meta name="description" content="Explora ASNs de Chile: proveedores, prefijos IP y peers. Busca por ASN o nombre y navega el mapa y directorio de redes." />
        <link rel="canonical" href={`${window.location.origin}/asn`} />
        <meta httpEquiv="content-language" content="es-CL" />
        <link rel="alternate" hrefLang="es-cl" href={`${window.location.origin}/asn`} />
        <meta property="og:title" content="ASN Chile: Mapa y Directorio (BGP)" />
        <meta property="og:description" content="Explora ASNs de Chile: proveedores, prefijos IP y peers." />
        <meta property="og:url" content={`${window.location.origin}/asn`} />
        <script type="application/ld+json">{JSON.stringify(itemListLd)}</script>
      </Helmet>

      <main className="flex-grow">
        <PageHeader
          breadcrumbs={<SEOBreadcrumbs items={[]} pageName="ASN" />}
          title="Mapa y Directorio de ASN"
          lead="Busca el sistema autónomo (ASN) de un proveedor para ver sus rangos IP y relaciones."
          actions={
            <Button asChild variant="outline">
              <Link to="/asn/chile">
                <MapPin aria-hidden />
                Ver ASN de Chile
              </Link>
            </Button>
          }
          meta={<AsnSourceLine cacheDays={7} />}
        />

        <Section density="tight" aria-label="Buscador de ASN">
          <div className="max-w-2xl space-y-4">
            <div>
              <label htmlFor="buscar-asn" className="t-label">Buscar ASN</label>
              <div className="relative mt-2">
                <Search aria-hidden className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
                <Input id="buscar-asn" placeholder="Ej.: AS27651, Entel, GTD" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" className="h-11 sm:h-9" onClick={() => setShowFilters(!showFilters)} aria-expanded={showFilters}>
                <Filter aria-hidden />
                Filtros
              </Button>
              {filtersActive && (
                <Button variant="ghost" size="sm" className="h-11 sm:h-9" onClick={clearFilters}>
                  Limpiar filtros
                </Button>
              )}
            </div>
            {showFilters && (
              <div className="grid gap-4 rounded-xl border border-rule bg-paper p-4 md:grid-cols-2">
                <div>
                  <label className="t-label mb-2 block" id="filtro-pais">País o región</label>
                  <Select value={countryFilter} onValueChange={setCountryFilter}>
                    <SelectTrigger aria-labelledby="filtro-pais"><SelectValue placeholder="Filtrar por país" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los países</SelectItem>
                      <SelectItem value="chile">Chile</SelectItem>
                      <SelectItem value="US">Estados Unidos</SelectItem>
                      <SelectItem value="BR">Brasil</SelectItem>
                      <SelectItem value="AR">Argentina</SelectItem>
                      <SelectItem value="MX">México</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="t-label mb-2 block" id="filtro-orden">Ordenar por</label>
                  <Select value={sortBy} onValueChange={(value: 'asn' | 'name') => setSortBy(value)}>
                    <SelectTrigger aria-labelledby="filtro-orden"><SelectValue placeholder="Ordenar resultados" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asn">Número de ASN</SelectItem>
                      <SelectItem value="name">Nombre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8" aria-live="polite">
            {loading && (
              <p className="t-small flex items-center gap-2 text-ink-2"><Loader2 aria-hidden className="h-4 w-4 animate-spin" /> Buscando ASN…</p>
            )}

            {!loading && failed && (
              <Callout tone="caution" title="No pudimos consultar la base de ASN en este momento" className="my-0 max-w-[62ch]">
                <p>BGPView no respondió a la búsqueda «{q.trim()}». No es que no existan resultados: vuelve a intentarlo en unos minutos.</p>
                <Button variant="default" className="mt-3" onClick={() => performSearch(q)}>
                  <RefreshCw aria-hidden />
                  Reintentar
                </Button>
              </Callout>
            )}

            {!loading && !failed && filteredAndSortedResults.length > 0 && (
              <>
                <p className="t-meta mb-3">
                  Mostrando {formatInteger(Math.min(filteredAndSortedResults.length, 30))} de {formatInteger(filteredAndSortedResults.length)} resultados
                </p>
                <AsnResultsTable results={filteredAndSortedResults.slice(0, 30)} caption={`Resultados de ASN para ${q}`} />
              </>
            )}

            {!loading && !failed && searched && filteredAndSortedResults.length === 0 && (
              <div className="max-w-[62ch] rounded-xl border border-rule bg-paper p-5">
                <p className="t-h3 text-ink">No encontramos ASN para «{q.trim()}»{filtersActive ? ' con estos filtros' : ''}</p>
                <p className="t-small mt-1 text-ink-2">
                  {filtersActive ? 'Quita los filtros para ver todos los resultados.' : 'Prueba con el número (por ejemplo AS27651) o con otro nombre del proveedor.'}
                </p>
                {filtersActive && results.length > 0 && (
                  <Button variant="outline" className="mt-3" onClick={clearFilters}>Limpiar filtros</Button>
                )}
              </div>
            )}

            {rangeList.length > 0 && (
              <div>
                <p className="t-small text-ink-2">
                  Números del rango AS{rangeList[0]} a AS{rangeList[rangeList.length - 1]} (máximo 51). Abre cada uno para consultar si existe y de quién es.
                </p>
                <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                  {rangeList.map((asn) => (
                    <li key={asn}><Link to={`/asn/AS${asn}`} className={`${linkClass} tabular inline-flex min-h-11 items-center`}>AS{asn}</Link></li>
                  ))}
                </ul>
              </div>
            )}

            {!loading && q.trim().length < 2 && rangeList.length === 0 && (
              <div className="max-w-[62ch]">
                <p className="t-body text-ink-2">Escribe al menos 2 caracteres para buscar ASN por nombre o número. Por ejemplo:</p>
                <ul className="t-small mt-2 list-disc space-y-1 pl-5 text-ink-2">
                  <li>AS27651 (número específico)</li>
                  <li>Claro, Entel, GTD (por nombre)</li>
                  <li>AS1000-AS2000 (rango de ASN)</li>
                </ul>
              </div>
            )}
          </div>

          <div className="mt-12">
            <UltimasBusquedasASN />
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  );
};

export default ASNDirectory;

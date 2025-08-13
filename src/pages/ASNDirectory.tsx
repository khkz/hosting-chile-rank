import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import { searchASN, ASNSearchResult } from '@/services/asnApi';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search } from 'lucide-react';
import UltimasBusquedas from '@/components/UltimasBusquedas';

const ASNDirectory: React.FC = () => {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<ASNSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (q.trim().length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await searchASN(q);
        setResults(res);
      } catch (e) {
        console.error(e);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [q]);

  const itemListLd = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: results.slice(0, 20).map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${window.location.origin}/asn/AS${r.asn}`,
      name: `AS${r.asn} ${r.name || ''}`.trim(),
    })),
  }), [results]);

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
      </header>

      <div className="max-w-2xl mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Ej: AS27651, Claro, Entel, GTD, Movistar..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9"
            aria-label="Buscar ASN"
          />
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm"><Loader2 className="h-4 w-4 animate-spin" /> Buscando ASNs…</div>
      )}

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {results.slice(0, 30).map((r) => (
          <Card key={r.asn} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">
                <Link to={`/asn/AS${r.asn}`} className="hover:underline">AS{r.asn} {r.name}</Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{r.description || 'Proveedor de red'}</p>
              {r.country_code && (
                <p className="text-xs mt-2">País: {r.country_code}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </section>

      {results.length === 0 && !loading && (
        <div className="text-sm text-muted-foreground">Escribe al menos 2 caracteres para buscar ASNs por nombre o número.</div>
      )}

      {/* Últimas búsquedas para SEO */}
      <div className="mt-12">
        <UltimasBusquedas />
      </div>
    </main>
  );
};

export default ASNDirectory;

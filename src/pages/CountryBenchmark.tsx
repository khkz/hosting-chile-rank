import { useLocation, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Star, ExternalLink, MessageSquare, Flag } from 'lucide-react';
import { LATAM_META, LATAM_OG_IMAGE, isLatamSlug, type LatamSlug } from '@/lib/latamCountry';
import { isHiddenProvider } from '@/lib/providerLinks';

interface Row {
  id: string;
  slug: string;
  name: string;
  website: string | null;
  avg: number | null;
  count: number;
}

const OFFICIAL_REGISTRY: Record<LatamSlug, { label: string; url: string }> = {
  pe: { label: 'INDECOPI · Mira a Quién le Compras', url: 'https://www.gob.pe/10285-buscar-empresas-sancionadas-por-indecopi' },
  mx: { label: 'PROFECO · Buró Comercial', url: 'https://burocomercial.profeco.gob.mx/' },
  co: { label: 'SIC · Defensa del Consumidor', url: 'https://www.sic.gov.co/grupo-de-defensa-del-consumidor' },
  ar: { label: 'Defensa del Consumidor', url: 'https://www.argentina.gob.ar/produccion/defensadelconsumidor/hacer-un-reclamo' },
};

const Stars = ({ value }: { value: number }) => {
  const full = Math.round(value);
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value.toFixed(1)} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`w-4 h-4 ${n <= full ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
      ))}
    </span>
  );
};

const CountryBenchmark = () => {
  const location = useLocation();
  const first = location.pathname.split('/').filter(Boolean)[0]?.toLowerCase();
  if (!isLatamSlug(first)) return <Navigate to="/latam" replace />;
  const slug = first as LatamSlug;
  const meta = LATAM_META[slug];
  const registry = OFFICIAL_REGISTRY[slug];

  const { data: rows, isLoading } = useQuery({
    queryKey: ['country-reputation', slug],
    queryFn: async (): Promise<Row[]> => {
      const { data: companies } = await supabase
        .from('hosting_companies')
        .select('id, slug, name, website')
        .eq('country', meta.code)
        .eq('is_verified', true)
        .range(0, 999);
      const list = (companies ?? []).filter((c: any) => !isHiddenProvider(c.slug, c.website));
      if (!list.length) return [];
      const slugs = list.map((c: any) => c.slug);
      const { data: reviews } = await supabase
        .from('reviews')
        .select('provider_slug, rating')
        .eq('status', 'approved')
        .in('provider_slug', slugs);
      const agg = new Map<string, { sum: number; count: number }>();
      for (const r of (reviews ?? []) as any[]) {
        const cur = agg.get(r.provider_slug) ?? { sum: 0, count: 0 };
        cur.sum += Number(r.rating) || 0;
        cur.count += 1;
        agg.set(r.provider_slug, cur);
      }
      const mapped: Row[] = list.map((c: any) => {
        const a = agg.get(c.slug);
        return {
          id: c.id,
          slug: c.slug,
          name: c.name,
          website: c.website,
          avg: a && a.count > 0 ? a.sum / a.count : null,
          count: a?.count ?? 0,
        };
      });
      mapped.sort((a, b) => {
        if (a.count > 0 && b.count === 0) return -1;
        if (a.count === 0 && b.count > 0) return 1;
        if (a.count > 0 && b.count > 0) {
          if ((b.avg ?? 0) !== (a.avg ?? 0)) return (b.avg ?? 0) - (a.avg ?? 0);
          return b.count - a.count;
        }
        return a.name.localeCompare(b.name);
      });
      return mapped;
    },
  });

  const canonical = `https://eligetuhosting.com/${slug}/benchmark`;
  const title = `Reputación de hosting en ${meta.name} 2026 · EligeTuHosting`;
  const description = `Reputación verificable de proveedores de hosting en ${meta.name}: reseñas aprobadas y enlace a registros oficiales de reclamos. No medimos la web de marketing.`;
  const list = rows ?? [];
  const withReviews = list.filter((r) => r.count > 0);

  const itemListLd = {
    '@context': 'https://schema.org', '@type': 'ItemList',
    name: title, numberOfItems: list.length,
    itemListElement: list.map((r, i) => ({
      '@type': 'ListItem', position: i + 1,
      url: `https://eligetuhosting.com/${slug}/${r.slug}`, name: r.name,
    })),
  };
  const ratedLd = withReviews.map((r) => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: r.name,
    url: `https://eligetuhosting.com/${slug}/${r.slug}`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: (r.avg ?? 0).toFixed(2),
      reviewCount: r.count,
      bestRating: '5',
      worstRating: '1',
    },
  }));

  return (
    <>
      <Helmet>
        <html lang={meta.locale} />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={LATAM_OG_IMAGE[slug]} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={LATAM_OG_IMAGE[slug]} />
        <meta property="og:locale" content="es_419" />
        <script type="application/ld+json">{JSON.stringify(itemListLd)}</script>
        {ratedLd.map((s, i) => (
          <script key={i} type="application/ld+json">{JSON.stringify(s)}</script>
        ))}
      </Helmet>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-14">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-3">
              <ShieldCheck className="w-6 h-6" />
              <Badge className="bg-white/20 text-white border-white/30">Reputación {meta.flag} {meta.name}</Badge>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-3">
              Reputación de hosting en {meta.name} 2026
            </h1>
            <p className="text-lg text-white/90 max-w-3xl">
              No publicamos benchmarks de velocidad de la web del proveedor. Medir el TTFB del sitio de marketing
              —que casi siempre está detrás de Cloudflare u otro CDN— no dice nada del servicio de hosting real que
              recibe el cliente. En su lugar mostramos reputación verificable: reseñas de usuarios y reclamos en
              registros oficiales de {meta.name}.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10">
          <div className="grid gap-4">
            {isLoading && <p className="text-gray-500">Cargando…</p>}
            {!isLoading && list.map((r) => {
              const trustpilot = `https://www.trustpilot.com/search?query=${encodeURIComponent(r.name)}`;
              return (
                <Card key={r.id}>
                  <CardContent className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <Link to={`/${slug}/${r.slug}`} className="text-lg font-semibold text-blue-700 hover:underline">
                          {r.name}
                        </Link>
                        <div className="mt-2">
                          {r.count > 0 && r.avg != null ? (
                            <div className="flex items-center gap-2 text-sm">
                              <Stars value={r.avg} />
                              <span className="font-medium">{r.avg.toFixed(1)}</span>
                              <span className="text-gray-500">· {r.count} reseña{r.count === 1 ? '' : 's'} verificada{r.count === 1 ? '' : 's'}</span>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-600 flex items-center gap-2">
                              <MessageSquare className="w-4 h-4" />
                              Aún sin reseñas verificadas — sé el primero
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm">
                        {r.count === 0 && (
                          <Link
                            to={`/${slug}/${r.slug}#dejar-resena`}
                            className="inline-flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700"
                          >
                            <Star className="w-4 h-4" /> Dejar reseña
                          </Link>
                        )}
                        <a
                          href={registry.url}
                          target="_blank"
                          rel="noopener nofollow"
                          className="inline-flex items-center gap-1 border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-100"
                        >
                          <Flag className="w-4 h-4" /> Consultar reclamos oficiales
                        </a>
                        <a
                          href={trustpilot}
                          target="_blank"
                          rel="noopener nofollow"
                          className="inline-flex items-center gap-1 border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-100"
                        >
                          <ExternalLink className="w-4 h-4" /> Reseñas en Trustpilot
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <Card><CardContent className="p-4">
              <h2 className="font-semibold mb-2">Metodología</h2>
              <p>
                La reputación se basa en dos fuentes verificables: (1) reseñas de usuarios aprobadas por nuestro
                equipo de moderación y (2) registros oficiales de reclamos del país. No hacemos benchmark de la web
                del proveedor porque su sitio de marketing suele estar detrás de un CDN (Cloudflare, Akamai) y no
                refleja el rendimiento del hosting real que recibe el cliente.
              </p>
              <p className="mt-2">
                Orden: primero proveedores con reseñas (promedio y luego número), después los que aún no tienen
                reseñas verificadas, en orden alfabético.
              </p>
            </CardContent></Card>
            <Card><CardContent className="p-4">
              <h2 className="font-semibold mb-2">Registros oficiales de {meta.name}</h2>
              <p>
                Antes de contratar, revisa si el proveedor aparece con sanciones o reclamos formales en el
                registro público:
              </p>
              <p className="mt-2">
                <a
                  href={registry.url}
                  target="_blank"
                  rel="noopener nofollow"
                  className="text-blue-700 hover:underline inline-flex items-center gap-1"
                >
                  {registry.label} <ExternalLink className="w-4 h-4" />
                </a>
              </p>
            </CardContent></Card>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default CountryBenchmark;

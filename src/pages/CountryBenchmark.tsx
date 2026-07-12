import { useLocation, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock, ShieldCheck, ArrowRight, Download } from 'lucide-react';
import { LATAM_META, LATAM_LONG_SLUG, LATAM_OG_IMAGE, isLatamSlug, type LatamSlug } from '@/lib/latamCountry';
import { isHiddenProvider } from '@/lib/providerLinks';

interface Row {
  id: string;
  slug: string;
  name: string;
  website: string | null;
  ttfb_median: number | null;
  ttfb_samples: number;
  uptime_pct: number | null;
  last_measured: string | null;
}

const CountryBenchmark = () => {
  const location = useLocation();
  const first = location.pathname.split('/').filter(Boolean)[0]?.toLowerCase();
  if (!isLatamSlug(first)) return <Navigate to="/latam" replace />;
  const slug = first as LatamSlug;
  const meta = LATAM_META[slug];

  const { data: rows, isLoading } = useQuery({
    queryKey: ['country-benchmark', slug],
    queryFn: async (): Promise<Row[]> => {
      const { data: companies } = await supabase
        .from('hosting_companies')
        .select('id, slug, name, website')
        .eq('country', meta.code)
        .eq('is_verified', true)
        .range(0, 999);
      const list = (companies ?? []).filter((c: any) => !isHiddenProvider(c.slug, c.website));
      if (!list.length) return [];
      const ids = list.map((c: any) => c.id);
      const since = new Date(Date.now() - 7 * 24 * 3600_000).toISOString();
      const { data: pings } = await supabase
        .from('uptime_pings')
        .select('company_id, ttfb_ms, ok, measured_at')
        .in('company_id', ids)
        .gte('measured_at', since)
        .order('measured_at', { ascending: false })
        .range(0, 9999);
      const byCompany = new Map<string, { ttfb: number[]; ok: number; total: number; last: string | null }>();
      for (const p of (pings ?? []) as any[]) {
        const b = byCompany.get(p.company_id) ?? { ttfb: [], ok: 0, total: 0, last: null };
        if (typeof p.ttfb_ms === 'number') b.ttfb.push(p.ttfb_ms);
        b.total += 1;
        if (p.ok) b.ok += 1;
        if (!b.last || p.measured_at > b.last) b.last = p.measured_at;
        byCompany.set(p.company_id, b);
      }
      const median = (n: number[]) => {
        if (!n.length) return null;
        const s = [...n].sort((a, b) => a - b);
        const m = Math.floor(s.length / 2);
        return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
      };
      return list.map((c: any): Row => {
        const b = byCompany.get(c.id);
        return {
          id: c.id, slug: c.slug, name: c.name, website: c.website,
          ttfb_median: b ? median(b.ttfb) : null,
          ttfb_samples: b?.ttfb.length ?? 0,
          uptime_pct: b && b.total > 0 ? Math.round((b.ok / b.total) * 1000) / 10 : null,
          last_measured: b?.last ?? null,
        };
      }).sort((a, b) => {
        if (a.ttfb_median == null && b.ttfb_median == null) return a.name.localeCompare(b.name);
        if (a.ttfb_median == null) return 1;
        if (b.ttfb_median == null) return -1;
        return a.ttfb_median - b.ttfb_median;
      });
    },
  });

  const canonical = `https://eligetuhosting.com/${slug}/benchmark`;
  const title = `Benchmark de hosting en ${meta.name} · TTFB y uptime medidos | EligeTuHosting`;
  const description = `Mediciones propias de TTFB (ms) y uptime (%) de los proveedores de hosting verificados en ${meta.name}. Datos abiertos bajo CC-BY-4.0.`;
  const list = rows ?? [];
  const generatedAt = new Date().toISOString();

  const itemListLd = {
    '@context': 'https://schema.org', '@type': 'ItemList',
    name: title, numberOfItems: list.length,
    itemListElement: list.map((r, i) => ({
      '@type': 'ListItem', position: i + 1,
      url: `https://eligetuhosting.com/${slug}/${r.slug}`, name: r.name,
    })),
  };
  const datasetLd = {
    '@context': 'https://schema.org', '@type': 'Dataset',
    name: `Benchmarks de hosting en ${meta.name}`,
    description,
    url: canonical,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    creator: { '@type': 'Organization', name: 'EligeTuHosting', url: 'https://eligetuhosting.com/' },
    distribution: [{
      '@type': 'DataDownload',
      encodingFormat: 'application/json',
      contentUrl: `https://eligetuhosting.com/data/benchmarks-${slug}.json`,
    }],
    dateModified: generatedAt,
  };

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
        <meta property="og:locale" content="es_419" />
        <link rel="alternate" type="application/json" href={`/data/benchmarks-${slug}.json`} title="Benchmarks JSON (CC-BY-4.0)" />
        <script type="application/ld+json">{JSON.stringify(itemListLd)}</script>
        <script type="application/ld+json">{JSON.stringify(datasetLd)}</script>
      </Helmet>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-14">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-3">
              <Activity className="w-6 h-6" />
              <Badge className="bg-white/20 text-white border-white/30">Benchmark {meta.flag} {meta.name}</Badge>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-3">
              Benchmark de hosting en {meta.name} 2026
            </h1>
            <p className="text-lg text-white/90 max-w-3xl">
              TTFB medido cada hora y uptime observado en los últimos 7 días. Mismo motor que usamos en Chile.
              <strong className="block mt-1">Los puntajes globales por país llegarán cuando acumulemos 60–90 días de datos continuos.</strong>
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <a href={`/data/benchmarks-${slug}.json`} className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded">
                <Download className="w-4 h-4" /> Descargar JSON (CC-BY-4.0)
              </a>
              <Link to="/datos" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded">
                <ShieldCheck className="w-4 h-4" /> Documentación de datos abiertos
              </Link>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10">
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="text-left p-3">#</th>
                    <th className="text-left p-3">Proveedor</th>
                    <th className="text-right p-3"><Clock className="w-4 h-4 inline" /> TTFB mediano</th>
                    <th className="text-right p-3">Muestras 7d</th>
                    <th className="text-right p-3">Uptime 7d</th>
                    <th className="text-right p-3">Última medición</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && (
                    <tr><td colSpan={6} className="p-6 text-center text-gray-500">Cargando…</td></tr>
                  )}
                  {!isLoading && list.map((r, i) => (
                    <tr key={r.id} className="border-t">
                      <td className="p-3 text-gray-500">{i + 1}</td>
                      <td className="p-3">
                        <Link to={`/${slug}/${r.slug}`} className="text-blue-700 hover:underline font-medium">
                          {r.name}
                        </Link>
                      </td>
                      <td className="p-3 text-right font-mono">{r.ttfb_median != null ? `${r.ttfb_median} ms` : '—'}</td>
                      <td className="p-3 text-right text-gray-600">{r.ttfb_samples}</td>
                      <td className="p-3 text-right">{r.uptime_pct != null ? `${r.uptime_pct}%` : '—'}</td>
                      <td className="p-3 text-right text-gray-500">
                        {r.last_measured ? new Date(r.last_measured).toISOString().slice(0, 16).replace('T', ' ') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <div className="mt-8 grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <Card><CardContent className="p-4">
              <h2 className="font-semibold mb-2">Metodología</h2>
              <p>Se ejecuta un ping HTTP cada hora contra el sitio oficial declarado. TTFB en milisegundos, timeout 10 s, User-Agent identificable como <code>EligeTuHosting-UptimeMonitor</code>. Fallback a GET si el servidor no soporta HEAD.</p>
              <p className="mt-2">La mediana de TTFB se calcula sobre todas las muestras exitosas de los últimos 7 días. Uptime = pings OK / pings totales.</p>
            </CardContent></Card>
            <Card><CardContent className="p-4">
              <h2 className="font-semibold mb-2">Por qué no publicamos aún puntajes 1–10</h2>
              <p>Publicar rankings numéricos con menos de 60–90 días de datos exagera la precisión y castiga a proveedores con incidentes puntuales. Preferimos mostrar el dato crudo verificable y sumar puntaje cuando tengamos ventana estadística.</p>
              <p className="mt-2">
                <Link to={`/${slug}/mejor-hosting-${meta.name.toLowerCase().replace(/[éí]/g, m => m === 'é' ? 'e' : 'i')}-2026`} className="text-blue-700 hover:underline inline-flex items-center gap-1">
                  Ver ranking editorial pre-benchmark <ArrowRight className="w-4 h-4" />
                </Link>
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

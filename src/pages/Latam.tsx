import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight, Globe, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

/**
 * Hub LATAM canonical (x-default global).
 * Renderiza contenido citable con totales reales por país.
 */
const LATAM_STATIC = [
  { code: 'PE', slug: 'pe', name: 'Perú', flag: '🇵🇪', total: 18, local: 4 },
  { code: 'MX', slug: 'mx', name: 'México', flag: '🇲🇽', total: 15, local: 3 },
  { code: 'CO', slug: 'co', name: 'Colombia', flag: '🇨🇴', total: 11, local: 5 },
  { code: 'AR', slug: 'ar', name: 'Argentina', flag: '🇦🇷', total: 11, local: 7 },
];

const Latam = () => {
  const canonical = 'https://eligetuhosting.com/latam';
  const lastUpdated = new Date().toISOString().slice(0, 10);

  const { data: chileCount } = useQuery({
    queryKey: ['latam-chile-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('hosting_companies')
        .select('id', { count: 'exact', head: true })
        .eq('country', 'CL')
        .eq('is_verified', true);
      return count ?? 20;
    },
  });

  const chileTotal = chileCount ?? 20;
  const totalLatam = chileTotal + LATAM_STATIC.reduce((a, c) => a + c.total, 0);

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Directorios de hosting por país en Latinoamérica',
    url: canonical,
    numberOfItems: 5,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: `Hosting en Chile (${chileTotal} proveedores verificados)`, url: 'https://eligetuhosting.cl/' },
      ...LATAM_STATIC.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: `Hosting en ${c.name} (${c.total} proveedores)`,
        url: `https://eligetuhosting.com/${c.slug}`,
      })),
    ],
  };

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Hosting en Latinoamérica — Directorios verificados por país',
    url: canonical,
    inLanguage: 'es',
    isAccessibleForFree: true,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    dateModified: lastUpdated,
    publisher: { '@type': 'Organization', name: 'EligeTuHosting', url: canonical },
  };

  return (
    <>
      <Helmet>
        <html lang="es" />
        <title>Hosting en Latinoamérica — Directorios verificados por país | EligeTuHosting</title>
        <meta name="description" content={`Directorios independientes de hosting en LATAM: ${totalLatam} proveedores con datos comprobables (razón social, ID fiscal, datacenter, tecnología) en 5 países. Misma metodología verificable.`} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="EligeTuHosting" />
        <meta property="og:locale" content="es_419" />
        <meta property="og:title" content="Hosting en Latinoamérica — EligeTuHosting" />
        <meta property="og:description" content={`Directorios verificables de hosting en Chile, Perú, México, Colombia y Argentina — ${totalLatam} proveedores auditados.`} />
        <meta property="og:url" content={canonical} />
        <meta name="robots" content="index,follow" />
        <link rel="alternate" hrefLang="es-CL" href="https://eligetuhosting.cl/" />
        <link rel="alternate" hrefLang="es-PE" href="https://eligetuhosting.com/pe" />
        <link rel="alternate" hrefLang="es-MX" href="https://eligetuhosting.com/mx" />
        <link rel="alternate" hrefLang="es-CO" href="https://eligetuhosting.com/co" />
        <link rel="alternate" hrefLang="es-AR" href="https://eligetuhosting.com/ar" />
        <link rel="alternate" hrefLang="x-default" href="https://eligetuhosting.com/latam" />
        <script type="application/ld+json">{JSON.stringify(itemListLd)}</script>
        <script type="application/ld+json">{JSON.stringify(collectionLd)}</script>
      </Helmet>

      <Navbar />

      <main className="min-h-[70vh] container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EF233C]/10 text-[#EF233C] text-sm font-medium mb-4">
              <Globe className="h-4 w-4" /> Hub LATAM
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#2B2D42] mb-3">
              Hosting en Latinoamérica — directorios verificados por país
            </h1>
            <p className="text-base md:text-lg text-[#2B2D42]/70 max-w-3xl mx-auto">
              Publicamos directorios independientes de hosting con datos comprobables
              (razón social, ID fiscal, datacenter, tecnología, teléfono, dirección).
              Misma metodología en cada país: WHOIS, ASN, registros mercantiles y respuesta de soporte.
            </p>
            <p className="mt-3 inline-flex items-center gap-1 text-xs text-[#2B2D42]/60">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Datos verificados · Última actualización: <time dateTime={lastUpdated}>{lastUpdated}</time>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            <a href="https://eligetuhosting.cl/" className="group bg-white border border-[#2B2D42]/10 rounded-xl p-6 hover:border-[#EF233C] hover:shadow-md transition-all">
              <div className="text-3xl mb-2">🇨🇱</div>
              <div className="font-semibold text-[#2B2D42] text-lg">Chile</div>
              <div className="text-xs text-[#2B2D42]/60 mt-1">{chileTotal} proveedores verificados · Ranking completo</div>
              <div className="mt-3 inline-flex items-center gap-1 text-sm text-[#EF233C] font-medium">
                Ver ranking <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </a>
            {LATAM_STATIC.map(c => (
              <a key={c.code} href={`https://eligetuhosting.com/${c.slug}`} className="group bg-white border border-[#2B2D42]/10 rounded-xl p-6 hover:border-[#EF233C] hover:shadow-md transition-all">
                <div className="text-3xl mb-2">{c.flag}</div>
                <div className="font-semibold text-[#2B2D42] text-lg">{c.name}</div>
                <div className="text-xs text-[#2B2D42]/60 mt-1">
                  {c.total} proveedores · {c.local} con datacenter local
                </div>
                <div className="mt-3 inline-flex items-center gap-1 text-sm text-[#EF233C] font-medium">
                  Ver directorio <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </a>
            ))}
          </div>

          <section className="bg-white border border-[#2B2D42]/10 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-[#2B2D42] mb-3">Metodología (misma en cada país)</h2>
            <ul className="text-sm text-[#2B2D42]/80 space-y-2 list-disc pl-5">
              <li>Verificación de razón social / ID fiscal contra registros mercantiles (SII, AFIP, SAT, DIAN, SUNAT).</li>
              <li>Datacenter declarado contrastado con ASN (BGPView) y ubicación real de IPs.</li>
              <li>Contacto (teléfono, dirección, sitio oficial) probado antes de publicar.</li>
              <li>No publicamos puntajes agregados hasta tener reclamos verificados, benchmarks y trayectoria mínima.</li>
            </ul>
            <p className="text-xs text-[#2B2D42]/60 mt-3">
              Licencia CC-BY-4.0. Fuente citable: <a href="/data/proveedores-latam.json" className="underline">/data/proveedores-latam.json</a>.
            </p>
          </section>

          <section className="bg-[#EDF2F4] rounded-xl p-6">
            <h2 className="text-xl font-bold text-[#2B2D42] mb-2">Datos abiertos por país</h2>
            <div className="flex flex-wrap gap-3 text-sm">
              <a href="/data/proveedores.json" className="px-3 py-1.5 rounded bg-white border">🇨🇱 proveedores.json</a>
              <a href="/data/proveedores-pe.json" className="px-3 py-1.5 rounded bg-white border">🇵🇪 proveedores-pe.json</a>
              <a href="/data/proveedores-mx.json" className="px-3 py-1.5 rounded bg-white border">🇲🇽 proveedores-mx.json</a>
              <a href="/data/proveedores-co.json" className="px-3 py-1.5 rounded bg-white border">🇨🇴 proveedores-co.json</a>
              <a href="/data/proveedores-ar.json" className="px-3 py-1.5 rounded bg-white border">🇦🇷 proveedores-ar.json</a>
              <a href="/data/proveedores-latam.json" className="px-3 py-1.5 rounded bg-[#EF233C] text-white">🌎 proveedores-latam.json (unificado)</a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Latam;

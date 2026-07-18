import { useLocation, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldCheck, ExternalLink, ArrowRight, Server, FileText, Calendar, Building2 } from 'lucide-react';
import { LATAM_META, LATAM_LONG_SLUG, LATAM_OG_IMAGE, rankProviders, isLatamSlug, type LatamSlug } from '@/lib/latamCountry';
import { classifyDc } from '@/lib/dcTier';
import { getProviderLink, isHiddenProvider } from '@/lib/providerLinks';
import PeReassurances from '@/components/country/PeReassurances';

const CountryBestHosting = () => {
  const location = useLocation();
  const first = location.pathname.split('/').filter(Boolean)[0]?.toLowerCase();
  if (!isLatamSlug(first)) return <Navigate to="/latam" replace />;
  const slug = first as LatamSlug;
  const meta = LATAM_META[slug];

  const { data: providers } = useQuery({
    queryKey: ['country-best-hosting', slug],
    queryFn: async () => {
      const { data } = await supabase
        .from('hosting_companies')
        .select('id, slug, name, website, legal_name, corporate_group, datacenter_location, year_founded, technologies, is_curated')
        .eq('country', meta.code)
        .eq('is_verified', true)
        .range(0, 999);
      return (data ?? []).filter((c: any) => !isHiddenProvider(c.slug, c.website));
    },
  });

  const list = rankProviders(providers ?? [], slug);
  const canonical = `https://eligetuhosting.com/${slug}/mejor-hosting-${LATAM_LONG_SLUG[slug]}-2026`;
  const title = `Mejor hosting en ${meta.name} 2026 · Directorio verificado | EligeTuHosting`;
  const description = `Ranking pre-benchmark de proveedores de hosting en ${meta.name}, ordenados por datos objetivos: datacenter local real, razón social local y antigüedad. Sin puntajes inventados.`;
  const lastUpdated = new Date().toISOString().slice(0, 10);

  const curated = list.find((p: any) => p.is_curated);

  const peFaqs = slug === 'pe' ? [
    { q: '¿HostingPlus Perú tiene datacenter en Perú?', a: 'No. Su ficha técnica declara datacenter en Orlando, Florida (EE.UU.). Lo que sí tiene en Perú es razón social registrada (Hostingplus Datacenter S.A.C.), teléfono local (+51 1 640 9409) y soporte en español. Si necesitas datacenter físicamente en Perú, revisa nuestra lista de /pe/hosting-con-datacenter-local.' },
    { q: '¿Qué proveedores sí tienen datacenter en Perú verificado por ASN?', a: 'Según nuestra verificación por IP → ASN, los que se anuncian desde ASN peruanos incluyen Hosting Perú (NEXTNET SAC AS271814) y MGD (Level 3 Perú AS3549). Otros proveedores que dicen "datacenter en Perú" resuelven en la práctica a infraestructura fuera del país o están detrás de CDN, y aparecen marcados en la tabla.' },
  ] : [];

  const faqs = [
    ...peFaqs,
    { q: `¿Por qué no publican puntajes numéricos todavía para ${meta.name}?`, a: `Porque publicar notas de 1–10 sin benchmarks propios, reclamos verificados y auditoría de ASN es exactamente lo que hacen los sitios falsos. En ${meta.name} estamos en la fase de datos: verificamos razón social, datacenter, tecnología y trayectoria. Cuando tengamos benchmarks propios reproducibles con la misma metodología aplicada en Chile, publicaremos rankings numéricos.` },
    { q: '¿Cómo se ordena este listado entonces?', a: 'Por tres criterios objetivos declarados: (1) datacenter local real (verificable por ASN y declaraciones del proveedor), (2) presencia de razón social local registrada, (3) antigüedad declarada. Empates se resuelven alfabéticamente. No hay ponderación oculta.' },
    { q: `¿HostingPlus aparece primero por pagar?`, a: 'No. HostingPlus figura como recomendación editorial regional visible con divulgación (podemos recibir comisión). Pero el orden del ranking sigue la regla de tres criterios objetivos: si un proveedor cumple mejor datacenter local + entidad legal + antigüedad, aparecerá antes que HostingPlus en la tabla.' },
    { q: '¿De dónde salen los datos?', a: `WHOIS, ASN + BGP, sitios oficiales del proveedor, registros mercantiles de ${meta.name} y verificaciones técnicas propias (IP, SSL, TTFB) que se guardan en nuestra base pública. Todo se descarga en /data/proveedores-${slug}.json bajo CC-BY-4.0.` },
  ];

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: list.length,
    itemListElement: list.map((p: any, i: number) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://eligetuhosting.com/${slug}/${p.slug}`,
      name: p.name,
    })),
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://eligetuhosting.com/' },
      { '@type': 'ListItem', position: 2, name: `Hosting en ${meta.name}`, item: `https://eligetuhosting.com/${slug}` },
      { '@type': 'ListItem', position: 3, name: `Mejor hosting ${meta.name} 2026`, item: canonical },
    ],
  };
  const faqLd = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <>
      <Helmet>
        <html lang={meta.locale} />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="EligeTuHosting" />
        <meta property="og:locale" content={meta.locale.replace('-', '_')} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={LATAM_OG_IMAGE[slug]} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={LATAM_OG_IMAGE[slug]} />
        <meta name="robots" content="index,follow" />
        <script type="application/ld+json">{JSON.stringify(itemListLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        <nav className="text-sm text-muted-foreground mb-4" aria-label="breadcrumb">
          <Link to="/" className="hover:underline">Inicio</Link><span className="mx-2">/</span>
          <Link to={`/${slug}`} className="hover:underline">Hosting en {meta.name}</Link><span className="mx-2">/</span>
          <span className="text-foreground font-medium">Mejor hosting {meta.name} 2026</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#2B2D42]">
            Mejor hosting en {meta.name} 2026 {meta.flag}
          </h1>
          <p className="mt-3 text-[#2B2D42]/75">
            Directorio pre-benchmark ordenado por criterios objetivos: (1) datacenter local real, (2) razón social local declarada, (3) antigüedad. Sin puntajes inventados.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Última actualización de datos: <time dateTime={lastUpdated}>{lastUpdated}</time> · {list.length} proveedores verificados
          </p>
        </header>

        {slug === 'pe' && curated ? (
          <PeReassurances variant="best" />
        ) : curated && (
          <Card className="mb-8 border-[#EF233C]/40 bg-[#EF233C]/5">
            <CardContent className="pt-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-6 w-6 text-[#EF233C] mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-wide text-[#EF233C] font-semibold mb-1">Recomendado editorial</div>
                  <div className="text-lg font-bold text-[#2B2D42] mb-1">{curated.name}</div>
                  <p className="text-sm text-[#2B2D42]/80">
                    Operador regional con infraestructura propia y soporte hispano 24/7 en {meta.name}. Ver{' '}
                    <Link to={`/${slug}/${curated.slug}`} className="underline">ficha completa</Link>.
                  </p>
                  <p className="text-[11px] text-[#2B2D42]/60 mt-2 leading-snug">
                    <strong>Divulgación:</strong> tenemos una relación comercial con este proveedor y podemos recibir una comisión si contratas por este enlace. La recomendación se basa en trayectoria verificable y no altera el orden objetivo del ranking.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-[#2B2D42]">Tabla comparativa (datos verificables)</h2>
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left">
                  <th className="px-3 py-2 font-medium">#</th>
                  <th className="px-3 py-2 font-medium">Proveedor</th>
                  <th className="px-3 py-2 font-medium">Datacenter: ubicación + calidad</th>
                  <th className="px-3 py-2 font-medium">Razón social</th>
                  <th className="px-3 py-2 font-medium">Antigüedad</th>
                  <th className="px-3 py-2 font-medium">Ficha</th>
                </tr>
              </thead>
              <tbody>
                {list.map((p: any, i: number) => {
                  const dc = classifyDc(p, slug);
                  const tone =
                    dc.quality === 'tier_certified' ? 'bg-emerald-100 text-emerald-800' :
                    dc.quality === 'self_declared' ? 'bg-amber-100 text-amber-800' :
                    dc.quality === 'foreign_infra' ? 'bg-red-50 text-red-700' :
                    'bg-muted text-muted-foreground';
                  return (
                    <tr key={p.id} className="border-t">
                      <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                      <td className="px-3 py-2 font-medium">{p.name}</td>
                      <td className="px-3 py-2">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] ${tone}`} title={dc.evidence}>
                          {dc.label}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-xs">{p.legal_name || <span className="text-muted-foreground">—</span>}</td>
                      <td className="px-3 py-2 text-xs">{p.year_founded || <span className="text-muted-foreground">—</span>}</td>
                      <td className="px-3 py-2">
                        <Link to={`/${slug}/${p.slug}`} className="text-primary hover:underline inline-flex items-center gap-1">
                          Ver <ArrowRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8 bg-white border border-[#2B2D42]/10 rounded-xl p-5">
          <h2 className="text-xl font-semibold mb-2 text-[#2B2D42]">Metodología y por qué aún no publicamos puntajes</h2>
          <p className="text-sm text-[#2B2D42]/75 leading-relaxed">
            En {meta.name} estamos en fase pre-benchmark. Publicar notas de 1–10 sin haber medido TTFB, uptime, tiempo real de soporte y reclamos verificados es exactamente lo que hacen los rankings falsos. Este directorio se ordena solo por datos objetivos declarados: presencia real de datacenter en el país (verificable con ASN + BGP), razón social local registrada, y años de operación declarados por el propio proveedor. Cuando completemos benchmarks propios reproducibles y un ciclo de reclamos verificados por email, publicaremos rankings numéricos con la misma metodología usada en Chile.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <Link to={`/${slug}/hosting-con-datacenter-local`} className="px-3 py-1.5 rounded bg-muted hover:bg-muted/70">
              <Server className="inline h-3 w-3 mr-1" /> Proveedores con datacenter local
            </Link>
            <Link to="/metodologia" className="px-3 py-1.5 rounded bg-muted hover:bg-muted/70">Metodología completa</Link>
            <a href={`/data/proveedores-${slug}.json`} target="_blank" rel="noopener" className="px-3 py-1.5 rounded bg-muted hover:bg-muted/70">Descargar datos JSON</a>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-[#2B2D42]">Preguntas frecuentes</h2>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <Card key={i}><CardContent className="pt-5 pb-5">
                <h3 className="font-semibold text-sm mb-1">{f.q}</h3>
                <p className="text-sm text-[#2B2D42]/80">{f.a}</p>
              </CardContent></Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default CountryBestHosting;

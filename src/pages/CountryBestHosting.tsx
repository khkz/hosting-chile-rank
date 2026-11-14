import { useLocation, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { Download, Server } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Section from '@/components/system/Section';
import { Button } from '@/components/ui/button';
import { LATAM_META, LATAM_LONG_SLUG, LATAM_OG_IMAGE, rankProviders, isLatamSlug, type LatamSlug } from '@/lib/latamCountry';
import { ASN_MAP, classifyDc } from '@/lib/dcTier';
import { hasLocalDatacenter } from '@/lib/dcLocal';
import { isHiddenProvider } from '@/lib/providerLinks';
import PeReassurances from '@/components/country/PeReassurances';
import { CountryHeroCopy, CountryIntroCopy } from '@/components/country/CountryHeroCopy';
import { COUNTRY_CONTENT } from '@/data/countryContent';
import CountryCrumbs from '@/components/ranking/pais/CountryCrumbs';
import CountrySummary from '@/components/ranking/pais/CountrySummary';
import CountryDcTable from '@/components/ranking/pais/CountryDcTable';
import CuratedNote from '@/components/ranking/pais/CuratedNote';
import FaqList from '@/components/ranking/pais/FaqList';

const CountryBestHosting = () => {
  const location = useLocation();
  const first = location.pathname.split('/').filter(Boolean)[0]?.toLowerCase();
  const valid = isLatamSlug(first);
  // Si la ruta no es de un país publicado se redirige (más abajo, después de los hooks).
  const slug = (valid ? first : 'mx') as LatamSlug;
  const meta = LATAM_META[slug];

  const { data: providers, isLoading, isError, refetch } = useQuery({
    queryKey: ['country-best-hosting', slug],
    enabled: valid,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hosting_companies')
        .select('id, slug, name, website, legal_name, corporate_group, datacenter_location, year_founded, technologies, is_curated, updated_at')
        .eq('country', meta.code)
        .eq('is_verified', true)
        .range(0, 999);
      // Un error de lectura no es un país vacío: se muestra como error.
      if (error) throw error;
      return (data ?? []).filter((c) => !isHiddenProvider(c.slug, c.website));
    },
  });

  const c = COUNTRY_CONTENT[slug];
  const list = rankProviders(providers ?? [], slug);
  // Fecha de los datos: la última actualización de un proveedor del país, no el reloj del visitante.
  const latestIso = (providers ?? []).reduce<string | null>(
    (max, p) => (p.updated_at && (!max || p.updated_at > max) ? p.updated_at : max),
    null
  );
  const canonical = `https://eligetuhosting.com/${slug}/mejor-hosting-${LATAM_LONG_SLUG[slug]}-2026`;
  const title = `${c.title} | EligeTuHosting`;
  const description = c.subtitle;

  const curated = list.find((p) => p.is_curated);
  const declaredLocal = providers ? list.filter((p) => hasLocalDatacenter(slug, p.datacenter_location)).length : undefined;
  const measuredLocal = providers ? list.filter((p) => classifyDc(p, slug).location === 'local_verified').length : undefined;
  const measuredTotal = providers ? list.filter((p) => Boolean(ASN_MAP[p.slug])).length : undefined;

  const peFaqs = slug === 'pe' ? [
    { q: '¿HostingPlus Perú tiene datacenter en Perú?', a: 'No. Su ficha técnica declara datacenter en Orlando, Florida (EE.UU.). Lo que sí tiene en Perú es razón social registrada (Hostingplus Datacenter S.A.C.), teléfono local (+51 1 640 9409) y soporte en español. Si necesitas datacenter físicamente en Perú, revisa nuestra lista de /pe/hosting-con-datacenter-local.' },
    { q: '¿Qué proveedores sí tienen datacenter en Perú verificado por ASN?', a: 'Según nuestra verificación por IP → ASN, los que se anuncian desde ASN peruanos incluyen Hosting Perú (NEXTNET SAC AS271814) y MGD (Level 3 Perú AS3549). Otros proveedores que dicen "datacenter en Perú" resuelven en la práctica a infraestructura fuera del país o están detrás de CDN, y aparecen marcados en la tabla.' },
  ] : [];

  const faqs = [
    ...(c?.faq ?? []),
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
    itemListElement: list.map((p, i: number) => ({
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

  if (!valid) return <Navigate to="/latam" replace />;

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
      <main>
        <CountryHeroCopy
          slug={slug}
          breadcrumbs={
            <CountryCrumbs
              items={[
                { name: 'Inicio', href: '/' },
                { name: `Hosting en ${meta.name}`, href: `/${slug}` },
                { name: `Mejor hosting ${meta.name} 2026` },
              ]}
            />
          }
          updatedIso={latestIso}
          imageFallback={
            <CountrySummary
              countryName={meta.name}
              total={providers ? list.length : undefined}
              declaredLocal={declaredLocal}
              measuredLocal={measuredLocal}
              measuredTotal={measuredTotal}
            />
          }
        />

        <Section density="tight" aria-label={`Cómo leer la edición ${meta.name}`}>
          <CountryIntroCopy slug={slug}>
            {slug !== 'pe' && curated && (
              <div className="mt-8">
                <CuratedNote name={curated.name} slug={curated.slug} countrySlug={slug} countryName={meta.name} />
              </div>
            )}
          </CountryIntroCopy>
          {slug === 'pe' && curated && (
            <div className="mt-10">
              <PeReassurances variant="best" />
            </div>
          )}
        </Section>

        <Section
          id="tabla"
          title="Tabla comparativa"
          lead={`${providers ? `${list.length} proveedores verificados. ` : ''}Cada fila separa lo que declara el proveedor de lo que medimos nosotros, para que puedas citar cada dato.`}
        >
          {isLoading ? (
            <p className="border-y-2 border-ink py-10 text-ink-2">Cargando proveedores…</p>
          ) : isError ? (
            <div role="alert" className="rounded-xl border border-rule bg-paper p-6 text-ink-2">
              <p>
                No pudimos cargar la tabla de {meta.name}. Los proveedores siguen publicados: es un problema de conexión con
                nuestra base de datos.
              </p>
              <Button variant="outline" className="mt-4" onClick={() => refetch()}>
                Reintentar
              </Button>
            </div>
          ) : list.length === 0 ? (
            <div className="rounded-xl border border-rule bg-paper p-6 text-ink-2">
              <p className="t-h3 text-ink">Todavía no hay proveedores verificados en {meta.name}</p>
              <p className="t-small mt-2 measure">
                Publicamos un proveedor cuando su razón social y su datacenter se pueden comprobar. ¿Conoces uno que falte?
              </p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/contacto">Sugerir un proveedor</Link>
              </Button>
            </div>
          ) : (
            <CountryDcTable rows={list} slug={slug} countryName={meta.name} />
          )}
        </Section>

        <Section id="metodologia" tone="paper" title="Metodología y por qué aún no publicamos puntajes">
          <div className="prose">
            <p>
              En {meta.name} estamos en fase pre-benchmark. Publicar notas de 1–10 sin haber medido TTFB, uptime, tiempo real de soporte y reclamos verificados es exactamente lo que hacen los rankings falsos. Este directorio se ordena solo por datos objetivos declarados: presencia real de datacenter en el país (verificable con ASN + BGP), razón social local registrada, y años de operación declarados por el propio proveedor. Cuando completemos benchmarks propios reproducibles y un ciclo de reclamos verificados por email, publicaremos rankings numéricos con la misma metodología usada en Chile.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link to={`/${slug}/hosting-con-datacenter-local`}>
                <Server aria-hidden /> Proveedores con datacenter local
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/metodologia">Metodología completa</Link>
            </Button>
            <Button asChild variant="outline">
              <a href={`/data/proveedores-${slug}.json`} target="_blank" rel="noopener">
                <Download aria-hidden /> Descargar datos JSON
              </a>
            </Button>
          </div>
        </Section>

        <Section id="preguntas" title="Preguntas frecuentes">
          <FaqList items={faqs} />
        </Section>
      </main>
      <Footer />
    </>
  );
};

export default CountryBestHosting;

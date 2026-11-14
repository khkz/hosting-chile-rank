import { useLocation, useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/system/PageHeader';
import Section from '@/components/system/Section';
import { ProvenanceLegend } from '@/components/data/Provenance';
import Crumbs from '@/components/comparar/Crumbs';
import CompareTable, { type CompareRow } from '@/components/comparar/CompareTable';
import { useCountryPair } from '@/components/comparar/useCompareData';
import { formatDataDate } from '@/lib/format';
import { LATAM_META, LATAM_LONG_SLUG, LATAM_OG_IMAGE, hasLocalDatacenter, isLatamSlug, type LatamSlug } from '@/lib/latamCountry';

const textLink =
  't-small inline-flex min-h-[44px] items-center gap-1.5 font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink';

// /pe/comparativa/:pair, donde :pair tiene la forma slug-a-vs-slug-b
const CountryComparativa = () => {
  const location = useLocation();
  const { pair } = useParams<{ pair: string }>();
  const first = location.pathname.split('/').filter(Boolean)[0]?.toLowerCase();
  const isCountry = isLatamSlug(first);
  const slug = (isCountry ? first : 'pe') as LatamSlug;
  const meta = LATAM_META[slug];

  const parts = (pair ?? '').split('-vs-');
  const okPair = parts.length === 2 && !!parts[0] && !!parts[1];
  const [a, b] = okPair ? parts : ['', ''];

  const { data: providers, isLoading } = useCountryPair(isCountry && okPair ? meta.code : null, a, b);

  if (!isCountry) return <Navigate to="/latam" replace />;
  if (!okPair) return <Navigate to={`/${slug}`} replace />;
  if (!isLoading && (!providers || providers.length !== 2)) return <Navigate to={`/${slug}`} replace />;
  if (isLoading || !providers) {
    return (
      <>
        <Navbar />
        <main className="container py-16">
          <p role="status" className="t-body text-ink-2">Cargando comparativa…</p>
        </main>
        <Footer />
      </>
    );
  }

  const p1 = providers.find((p) => p.slug === a)!;
  const p2 = providers.find((p) => p.slug === b)!;

  const canonicalSlug = a < b ? `${a}-vs-${b}` : `${b}-vs-${a}`;
  const canonical = `https://eligetuhosting.com/${slug}/comparativa/${canonicalSlug}`;
  const title = `${p1.name} vs ${p2.name} — Comparativa hosting ${meta.name} | EligeTuHosting`;
  const description = `Comparativa objetiva entre ${p1.name} y ${p2.name} para hosting en ${meta.name}: datacenter, razón social, antigüedad, tecnologías. Datos verificables, sin puntajes inventados.`;

  const sides = [p1, p2];
  const text = (v: string | null | undefined) => (v && v.trim() ? v : null);
  const tech = (v: string[] | null) => (v && v.length > 0 ? v.slice(0, 6).join(', ') : null);
  const rows: CompareRow[] = [
    { id: 'razon', label: 'Razón social', kind: 'declared', cells: sides.map((p) => ({ value: text(p.legal_name), raw: null })) },
    { id: 'dc', label: 'Datacenter declarado', kind: 'declared', cells: sides.map((p) => ({ value: text(p.datacenter_location), raw: text(p.datacenter_location) })) },
    {
      id: 'dc-local', label: `Datacenter en ${meta.name}`, kind: 'declared',
      cells: sides.map((p) => {
        const local = hasLocalDatacenter(slug, p.datacenter_location);
        return { value: local ? 'Sí' : 'No', raw: local };
      }),
    },
    { id: 'fundacion', label: 'Año de fundación', kind: 'declared', cells: sides.map((p) => ({ value: p.year_founded != null ? String(p.year_founded) : null, raw: p.year_founded })) },
    { id: 'grupo', label: 'Grupo corporativo', kind: 'declared', cells: sides.map((p) => ({ value: text(p.corporate_group), raw: text(p.corporate_group) })) },
    { id: 'telefono', label: 'Teléfono', kind: 'declared', cells: sides.map((p) => ({ value: text(p.contact_phone), raw: null })) },
    { id: 'direccion', label: 'Dirección', kind: 'declared', cells: sides.map((p) => ({ value: text(p.contact_address), raw: null })) },
    { id: 'tecnologias', label: 'Tecnologías declaradas', kind: 'declared', cells: sides.map((p) => ({ value: tech(p.technologies), raw: null })) },
  ];
  const updated = sides.map((p) => p.updated_at).filter(Boolean).sort().pop() ?? null;

  const breadcrumbLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://eligetuhosting.com/' },
      { '@type': 'ListItem', position: 2, name: `Hosting en ${meta.name}`, item: `https://eligetuhosting.com/${slug}` },
      { '@type': 'ListItem', position: 3, name: `${p1.name} vs ${p2.name}`, item: canonical },
    ],
  };

  return (
    <>
      <Helmet>
        <html lang={meta.locale} />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="EligeTuHosting" />
        <meta property="og:locale" content={meta.locale.replace('-', '_')} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={LATAM_OG_IMAGE[slug]} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={LATAM_OG_IMAGE[slug]} />
        <meta name="robots" content="index,follow" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
      </Helmet>
      <Navbar />
      <main>
        <PageHeader
          breadcrumbs={
            <Crumbs items={[{ name: 'Inicio', href: '/' }, { name: `Hosting en ${meta.name}`, href: `/${slug}` }, { name: `${p1.name} vs ${p2.name}` }]} />
          }
          title={`${p1.name} vs ${p2.name}`}
          lead={`Comparativa lado a lado con datos verificables en ${meta.name}. Sin puntajes inventados: solo lo que declara cada proveedor y se puede auditar.`}
          meta={updated ? <span>Fichas actualizadas al {formatDataDate(updated, meta.locale)}</span> : undefined}
        />

        <Section id="lado-a-lado" title="Lado a lado" density="tight">
          <CompareTable
            caption={`Comparación de ${p1.name} y ${p2.name} en ${meta.name}`}
            labelHeader="Criterio"
            columns={sides.map((p) => ({ key: p.slug, name: p.name, href: `/${slug}/${p.slug}` }))}
            rows={rows}
          />
          <p className="t-meta measure mt-4">
            «Difieren» marca las filas en que los dos proveedores declaran un dato distinto. «Sin dato» significa que el
            proveedor no lo publica.
          </p>
          <ProvenanceLegend compact className="mt-8 max-w-4xl" />
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            <Link to={`/${slug}`} className={textLink}>
              <ArrowLeft aria-hidden className="h-4 w-4" /> Directorio {meta.name}
            </Link>
            <Link to={`/${slug}/mejor-hosting-${LATAM_LONG_SLUG[slug]}-2026`} className={textLink}>
              Mejor hosting {meta.name} 2026 <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
};

export default CountryComparativa;

import { useLocation, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/system/PageHeader';
import Section from '@/components/system/Section';
import EditorialImage, { isEmptyEditorial } from '@/components/media/EditorialImage';
import { ProvenanceTag } from '@/components/data/Provenance';
import { formatInteger, formatShortDate, isoDate } from '@/lib/format';
import { LATAM_META, LATAM_OG_IMAGE, hasLocalDatacenter, isLatamSlug, type LatamSlug } from '@/lib/latamCountry';
import { isHiddenProvider } from '@/lib/providerLinks';
import EditionCrumbs from '@/components/country/edicion/EditionCrumbs';
import SummaryCard, { type SummaryItem } from '@/components/country/edicion/SummaryCard';
import DcLocalList, { type DcProvider, type SiteCheck } from '@/components/country/edicion/DcLocalList';

const linkCls = 'font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink';

const CountryDatacenterLocal = () => {
  const location = useLocation();
  const first = location.pathname.split('/').filter(Boolean)[0]?.toLowerCase();
  if (!isLatamSlug(first)) return <Navigate to="/latam" replace />;
  const slug = first as LatamSlug;
  const meta = LATAM_META[slug];

  const { data: providers, isLoading } = useQuery({
    queryKey: ['country-datacenter-local', slug],
    queryFn: async () => {
      const { data } = await supabase
        .from('hosting_companies')
        .select('id, slug, name, website, legal_name, datacenter_location, year_founded, technologies')
        .eq('country', meta.code)
        .eq('is_verified', true)
        .range(0, 999);
      return (data ?? []).filter((c: any) =>
        !isHiddenProvider(c.slug, c.website) && hasLocalDatacenter(slug, c.datacenter_location),
      );
    },
  });

  // Últimos site checks para incluir ASN si disponible
  const { data: siteChecks } = useQuery({
    queryKey: ['dc-local-checks', slug, providers?.map((p: any) => p.id).join(',')],
    enabled: !!providers?.length,
    queryFn: async () => {
      const ids = (providers ?? []).map((p: any) => p.id);
      const { data } = await supabase
        .from('latam_site_checks' as any)
        .select('company_id, resolved_ip, asn, asn_org, checked_at')
        .in('company_id', ids)
        .order('checked_at', { ascending: false });
      const map = new Map<string, any>();
      for (const r of (data ?? []) as any[]) if (!map.has(r.company_id)) map.set(r.company_id, r);
      return map;
    },
  });

  const canonical = `https://eligetuhosting.com/${slug}/hosting-con-datacenter-local`;
  const title = `Hosting con datacenter local en ${meta.name} · Verificado por ASN | EligeTuHosting`;
  const description = `Proveedores de hosting con datacenter físicamente en ${meta.name}, verificado por ASN, BGP y declaraciones del proveedor. Diferenciador de datos abiertos.`;

  const list = providers ?? [];
  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    numberOfItems: list.length,
    itemListElement: list.map((p: any, i: number) => ({
      '@type': 'ListItem', position: i + 1,
      url: `https://eligetuhosting.com/${slug}/${p.slug}`, name: p.name,
    })),
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://eligetuhosting.com/' },
      { '@type': 'ListItem', position: 2, name: `Hosting en ${meta.name}`, item: `https://eligetuhosting.com/${slug}` },
      { '@type': 'ListItem', position: 3, name: 'Datacenter local', item: canonical },
    ],
  };

  // Resumen: lo declarado, lo medido y la fecha de la medición más reciente.
  const checks = siteChecks as Map<string, SiteCheck> | undefined;
  const dcList = list as DcProvider[];
  const withAsn = dcList.filter((p) => checks?.get(p.id)?.asn).length;
  const lastCheck = dcList.reduce<string | null>((max, p) => {
    const at = checks?.get(p.id)?.checked_at ?? null;
    return at && (!max || at > max) ? at : max;
  }, null);
  const pending = isLoading ? '…' : 'sin dato';
  const summary: SummaryItem[] = [
    {
      label: `Declaran datacenter en ${meta.name}`,
      kind: 'declared',
      value: providers ? formatInteger(list.length) : pending,
      emphasis: 'figure',
    },
    { label: 'Con ASN medido', kind: 'measured', value: providers ? formatInteger(withAsn) : pending, emphasis: 'figure' },
    {
      label: 'Última medición',
      value: lastCheck ? <time dateTime={isoDate(lastCheck)}>{formatShortDate(lastCheck)}</time> : providers ? 'sin medir' : pending,
    },
  ];
  const image = <EditorialImage name="datacenter" className="aspect-[16/9]" sizes="(min-width: 1024px) 45vw, 100vw" priority />;
  const hasImage = !isEmptyEditorial(image);

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
      </Helmet>
      <Navbar />
      <main>
        <PageHeader
          breadcrumbs={
            <EditionCrumbs
              code={meta.code}
              items={[{ label: 'Inicio', to: '/' }, { label: `Hosting en ${meta.name}`, to: `/${slug}` }, { label: 'Datacenter local' }]}
            />
          }
          title={`Hosting con datacenter local en ${meta.name}`}
          lead={`Proveedores que declaran tener su datacenter en ${meta.name}. Si medimos la IP de su sitio oficial, también te mostramos el ASN dueño de esa IP y la fecha de la medición.`}
          aside={
            <EditorialImage
              name="datacenter"
              className="aspect-[16/9]"
              sizes="(min-width: 1024px) 45vw, 100vw"
              priority
              fallback={<SummaryCard label="La lista en cifras" items={summary} className="lg:ml-auto lg:max-w-[26rem]" />}
            />
          }
        />
        {hasImage && (
          <div className="border-b border-rule bg-white">
            <div className="container py-6 md:py-8">
              <SummaryCard label="La lista en cifras" items={summary} layout="strip" />
            </div>
          </div>
        )}

        <Section id="proveedores" title={`Proveedores que declaran datacenter en ${meta.name}`} density="tight">
          {isLoading ? (
            <p className="t-body border-y-2 border-ink py-10 text-ink-2">Cargando proveedores…</p>
          ) : list.length === 0 ? (
            <div className="max-w-[62ch] rounded-xl border border-rule bg-paper p-5 md:p-6">
              <p className="t-body text-ink">
                Aún no hay proveedores que declaren datacenter en {meta.name} dentro del directorio. Estamos ampliando la
                lista.
              </p>
              <Link to={`/${slug}#directorio`} className={`t-small mt-3 inline-flex min-h-[44px] items-center ${linkCls}`}>
                Ver todos los proveedores de {meta.name}
              </Link>
            </div>
          ) : (
            <DcLocalList providers={dcList} checks={checks} countrySlug={slug} />
          )}
          <Link to={`/${slug}`} className={`t-small mt-8 inline-flex min-h-[44px] items-center gap-2 ${linkCls}`}>
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Volver al directorio de {meta.name}
          </Link>
        </Section>

        <Section id="como-armamos" tone="paper" title="Cómo armamos esta lista" density="tight">
          <ul className="t-body max-w-3xl space-y-5 text-ink-2">
            <li className="flex flex-col gap-1.5 sm:flex-row sm:gap-4">
              <span className="shrink-0 sm:w-28">
                <ProvenanceTag kind="declared" />
              </span>
              <span>
                <strong className="font-semibold text-ink">Declaración del proveedor.</strong> Revisamos el sitio oficial
                (página de infraestructura, planes o términos) buscando la ubicación física del datacenter. Entra a la
                lista quien declara que está en {meta.name}; no lo hemos comprobado en terreno.
              </span>
            </li>
            <li className="flex flex-col gap-1.5 sm:flex-row sm:gap-4">
              <span className="shrink-0 sm:w-28">
                <ProvenanceTag kind="measured" />
              </span>
              <span>
                <strong className="font-semibold text-ink">ASN de su sitio.</strong> Resolvemos la IP del sitio oficial y
                consultamos el ASN dueño de esa IP; lo mostramos con su fecha. Si el ASN es de Cloudflare, AWS o GCP, no
                confirma dónde está el hosting: la latencia depende del punto de presencia más cercano.
              </span>
            </li>
            <li className="flex flex-col gap-1.5 sm:flex-row sm:gap-4">
              <span className="t-label shrink-0 sm:w-28">Razón social</span>
              <span>
                <strong className="font-semibold text-ink">Registro mercantil.</strong> Verificamos que exista razón
                social local que respalde la operación declarada.
              </span>
            </li>
          </ul>
          <p className="t-small mt-8 flex flex-wrap gap-x-6 gap-y-2">
            <Link to={`/${slug}#como-ordenamos`} className={`inline-flex min-h-[44px] items-center ${linkCls}`}>
              Cómo ordenamos el directorio de {meta.name}
            </Link>
            <a href={`/data/proveedores-${slug}.json`} className={`inline-flex min-h-[44px] items-center ${linkCls}`}>
              Datos abiertos (proveedores-{slug}.json)
            </a>
          </p>
        </Section>
      </main>
      <Footer />
    </>
  );
};

export default CountryDatacenterLocal;

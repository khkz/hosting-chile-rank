import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Flag from '@/components/data/Flag';
import { ProvenanceLegend } from '@/components/data/Provenance';
import PageHeader from '@/components/system/PageHeader';
import Section from '@/components/system/Section';
import EditorialImage, { isEmptyEditorial } from '@/components/media/EditorialImage';
import { Button } from '@/components/ui/button';
import { useLatamIndex, type LatamIndexRow } from '@/features/ranking';
import { IndexSkeleton, IndexTable } from '@/components/latam/LatamIndexParts';
import TopByCountry from '@/components/latam/TopByCountry';
import SummaryCard, { type SummaryItem } from '@/components/country/edicion/SummaryCard';
import { formatInteger, formatShortDate, isoDate } from '@/lib/format';
import {
  COM_ORIGIN,
  CL_ORIGIN,
  LATAM_HOME_URL,
  PUBLISHED_EDITIONS,
  VERIFYING_EDITIONS,
  editionHref,
  formatNumber as nf,
  hreflangAlternates,
} from '@/lib/countries';

const linkCls = 'underline decoration-ink/30 underline-offset-4 hover:decoration-ink';

const LatamIndex = () => {
  const { data, isLoading, isError, refetch } = useLatamIndex();
  const totalProviders = data?.totals.providers;
  // Edición más reciente del índice (la fecha de la base, no la del reloj del
  // visitante) y el país al que pertenece: la fecha dice qué cubre.
  const latestRow = (data?.rows ?? []).reduce<LatamIndexRow | null>(
    (best, r) => (r.updatedAt && (!best || !best.updatedAt || r.updatedAt > best.updatedAt) ? r : best),
    null
  );
  const pending = isLoading ? '…' : 'sin dato';

  const title = 'Hosting en Latinoamérica 2026: ranking y datos por país | EligeTuHosting';
  const description = `Índice de hosting en Latinoamérica: ${totalProviders ? `${nf(totalProviders)} proveedores verificados` : 'proveedores verificados'} en ${PUBLISHED_EDITIONS.map((e) => e.name).join(', ')}. Cada dato indica si es medido, declarado por el proveedor o editorial.`;

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Ediciones de EligeTuHosting por país',
    url: LATAM_HOME_URL,
    numberOfItems: PUBLISHED_EDITIONS.length,
    itemListElement: PUBLISHED_EDITIONS.map((e, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `Hosting en ${e.name}`,
      url: e.code === 'CL' ? `${CL_ORIGIN}/` : `${COM_ORIGIN}/${e.slug}`,
    })),
  };
  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Hosting en Latinoamérica: ranking y datos por país',
    url: LATAM_HOME_URL,
    inLanguage: 'es-419',
    isAccessibleForFree: true,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    publisher: { '@type': 'Organization', name: 'EligeTuHosting', url: LATAM_HOME_URL },
  };

  const summary: SummaryItem[] = [
    {
      label: 'Última edición',
      value: latestRow?.updatedAt ? (
        <>
          <time dateTime={isoDate(latestRow.updatedAt)}>{formatShortDate(latestRow.updatedAt)}</time>{' '}
          <span className="font-normal text-ink-2">({latestRow.edition.name})</span>
        </>
      ) : (
        pending
      ),
      note: 'Cada país muestra la suya en el índice',
    },
    {
      label: 'Proveedores verificados',
      value: totalProviders != null ? formatInteger(totalProviders) : pending,
      emphasis: 'figure',
    },
    { label: 'Países publicados', value: formatInteger(PUBLISHED_EDITIONS.length), emphasis: 'figure' },
    { label: 'En verificación', value: formatInteger(VERIFYING_EDITIONS.length), emphasis: 'figure' },
  ];
  const heroImage = (
    <EditorialImage name="latam-hero" className="aspect-[16/9]" sizes="(min-width: 1024px) 45vw, 100vw" priority />
  );
  const hasHeroImage = !isEmptyEditorial(heroImage);

  return (
    <>
      <Helmet>
        <html lang="es-419" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={LATAM_HOME_URL} />
        <meta name="robots" content="index,follow" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="EligeTuHosting" />
        <meta property="og:locale" content="es_419" />
        <meta property="og:title" content="Hosting en Latinoamérica, comparado país por país" />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={LATAM_HOME_URL} />
        <meta property="og:image" content={`${COM_ORIGIN}/og/latam.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={`${COM_ORIGIN}/og/latam.png`} />
        {hreflangAlternates().map((a) => (
          <link key={a.hrefLang} rel="alternate" hrefLang={a.hrefLang} href={a.href} />
        ))}
        <script type="application/ld+json">{JSON.stringify(itemListLd)}</script>
        <script type="application/ld+json">{JSON.stringify(collectionLd)}</script>
      </Helmet>

      <Navbar />

      <main>
        <PageHeader
          size="display"
          title="Hosting en Latinoamérica, comparado país por país."
          lead="Revisamos a los proveedores de hosting de cada país con el mismo método: quién es la empresa, dónde están sus servidores y cómo responde su red. Cada cifra indica si la medimos nosotros, si la declara el proveedor o si es criterio editorial."
          meta={
            <>
              <a href="#cobertura" className={linkCls}>
                Cómo leer cada dato
              </a>
              <a href="#datos" className={linkCls}>
                Datos abiertos (CC-BY-4.0)
              </a>
            </>
          }
          aside={
            <EditorialImage
              name="latam-hero"
              className="aspect-[16/9]"
              sizes="(min-width: 1024px) 45vw, 100vw"
              priority
              fallback={
                <SummaryCard label="El índice en cifras" items={summary} className="lg:ml-auto lg:max-w-[26rem]" />
              }
            />
          }
        />
        {hasHeroImage && (
          <div className="border-b border-rule bg-white">
            <div className="container py-6 md:py-8">
              <SummaryCard label="El índice en cifras" items={summary} layout="strip" />
            </div>
          </div>
        )}

        <Section
          id="indice"
          title="Índice por país"
          lead="Cifras leídas de nuestra base de datos en cada visita. Cada país muestra la fecha de su última edición y de su última medición."
        >
          {isLoading && <IndexSkeleton />}
          {isError && (
            <div role="alert" className="t-small rounded-xl border border-rule bg-paper p-5 text-ink-2">
              <p className="max-w-[62ch]">
                No pudimos leer el índice. Las cifras de esta página no se cargaron; no significa que no haya
                proveedores.
              </p>
              <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
                Reintentar
              </Button>
            </div>
          )}
          {data && <IndexTable rows={data.rows} />}

          <div id="cobertura" className="mt-10 grid scroll-mt-24 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h3 className="t-h3 text-ink">Países en verificación</h3>
              <p className="t-small mt-1 max-w-[62ch] text-ink-2">
                Publicamos un país cuando sus proveedores tienen razón social, datacenter y contacto comprobados.
                Mientras tanto, su página no aparece en buscadores.
              </p>
              <ul className="mt-2 flex flex-wrap gap-x-5">
                {VERIFYING_EDITIONS.map((e) => (
                  <li key={e.code}>
                    <a
                      href={editionHref(e.code)}
                      className="inline-flex min-h-[44px] items-center gap-2 text-sm text-ink-2 underline-offset-4 hover:text-ink hover:underline"
                    >
                      <Flag code={e.code} size={16} />
                      {e.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-7">
              <h3 className="t-h3 mb-3 text-ink">Cómo leer cada dato</h3>
              <ProvenanceLegend compact />
            </div>
          </div>
        </Section>

        <Section
          id="primeros-puestos"
          tone="paper"
          title="Primeros puestos por país"
          lead="Cada país se ordena con su propio criterio publicado. Chile tiene notas editoriales; en el resto, el orden sale de la infraestructura comprobable mientras completamos las mediciones."
        >
          {data ? (
            <TopByCountry rows={data.rows} />
          ) : isError ? (
            <p className="t-small text-ink-2">No pudimos leer los primeros puestos por país.</p>
          ) : (
            <p className="t-small text-ink-3" aria-busy="true">
              Cargando los primeros puestos…
            </p>
          )}
        </Section>

        <Section id="datos" title="Datos abiertos" density="tight">
          <div className="grid gap-8 md:grid-cols-12">
            <p className="t-body text-ink-2 md:col-span-5">
              Puedes usar estos datos citando a EligeTuHosting (licencia CC-BY-4.0). Están pensados para periodistas,
              investigadores y asistentes de IA.
            </p>
            <ul className="grid gap-x-8 text-sm sm:grid-cols-2 md:col-span-7">
              {PUBLISHED_EDITIONS.map((e) => {
                const file = e.code === 'CL' ? '/data/proveedores.json' : `/data/proveedores-${e.slug}.json`;
                return (
                  <li key={e.code}>
                    <a href={file} className={`inline-flex min-h-[44px] items-center gap-2 text-ink ${linkCls}`}>
                      <Flag code={e.code} size={16} />
                      <span>Proveedores de {e.name}</span>
                      <span className="text-ink-3">JSON</span>
                    </a>
                  </li>
                );
              })}
              <li>
                <a href="/data/proveedores-latam.json" className={`inline-flex min-h-[44px] items-center gap-2 text-ink ${linkCls}`}>
                  <span>Latinoamérica unificado</span>
                  <span className="text-ink-3">JSON</span>
                </a>
              </li>
              <li>
                <a href="/llms.txt" className={`inline-flex min-h-[44px] items-center text-ink ${linkCls}`}>
                  Resumen para asistentes de IA (llms.txt)
                </a>
              </li>
              <li>
                <a href="/datos" className={`inline-flex min-h-[44px] items-center text-ink ${linkCls}`}>
                  Documentación de los datos
                </a>
              </li>
            </ul>
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
};

export default LatamIndex;

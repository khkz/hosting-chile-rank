import { useLocation, Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Section from '@/components/system/Section';
import { COUNTRIES, getCountryFromPath } from '@/lib/country';
import { getEdition, hreflangAlternates, rankingPath } from '@/lib/countries';
import { formatDataDate } from '@/lib/format';
import { ProvenanceTag } from '@/components/data/Provenance';
import AdvisorEmbed from '@/components/advisor/AdvisorEmbed';
import DirectoryFilterBar, { type SortMode } from '@/components/DirectoryFilterBar';
import { hasLocalDatacenter, has247Support, type LatamDcSlug } from '@/lib/dcLocal';
import { isHiddenProvider } from '@/lib/providerLinks';
import CountryReassurances from '@/components/country/CountryReassurances';
import BuyerRoutes from '@/components/country/BuyerRoutes';
import DirectoryRow from '@/components/country/DirectoryRow';
import EditionHeader from '@/components/country/edicion/EditionHeader';
import { fewerFiltersHint, isComSlug, sameMethodLine, type ComSlug } from '@/components/country/edicion/editionVoice';

const CountryLanding = () => {
  const location = useLocation();
  const info = getCountryFromPath(location.pathname) ?? COUNTRIES.PE;
  const edition = getEdition(info.code);
  const slug: ComSlug = isComSlug(info.slug) ? info.slug : 'pe';

  const { data: companies, isLoading, isError, refetch } = useQuery({
    queryKey: ['country-directory', info.code],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hosting_companies')
        .select(
          'id, slug, name, website, contact_phone, contact_address, contact_hours, datacenter_location, corporate_group, legal_name, technologies, foundation_year, is_verified, is_curated, updated_at'
        )
        .eq('country', info.code)
        .eq('is_verified', true)
        .range(0, 999);
      if (error) throw error;
      return (data || []).filter((c: any) => !isHiddenProvider(c.slug, c.website));
    },
  });

  // Filtros client-side (T6)
  const [onlyDcLocal, setOnlyDcLocal] = useState(false);
  const [only247, setOnly247] = useState(false);
  const [sort, setSort] = useState<SortMode>('default');
  const dcSlug = info.slug as LatamDcSlug;
  const localDcCount = (companies ?? []).filter((c: any) => hasLocalDatacenter(dcSlug, c.datacenter_location)).length;
  const filteredCompanies = useMemo(() => {
    const base = companies ?? [];
    let out = base.filter((c: any) => {
      if (onlyDcLocal && !hasLocalDatacenter(dcSlug, c.datacenter_location)) return false;
      if (only247 && !has247Support(c.contact_hours)) return false;
      return true;
    });
    if (sort === 'name') {
      out = [...out].sort((a: any, b: any) => a.name.localeCompare(b.name, 'es'));
    } else if (sort === 'oldest') {
      out = [...out].sort((a: any, b: any) => {
        const ay = a.foundation_year ?? Number.POSITIVE_INFINITY;
        const by = b.foundation_year ?? Number.POSITIVE_INFINITY;
        if (ay !== by) return ay - by;
        return a.name.localeCompare(b.name, 'es');
      });
    }
    return out;
  }, [companies, onlyDcLocal, only247, sort, dcSlug]);

  const canonical = `https://eligetuhosting.com/${info.slug}`;
  const title = `Hosting en ${info.name} — Directorio verificado · Elige Tu Hosting`;
  const description = `Directorio verificable de hosting en ${info.name}: proveedores con datos comprobables (razón social, ID fiscal, datacenter, tecnología) y metodología transparente.`;

  const curatedCompany = (companies || []).find((c: any) => c.is_curated === true) || null;
  const hasRecommended = !!curatedCompany;

  // Fecha real de los datos: la última modificación de un proveedor del país.
  // Sin datos no se publica fecha (nunca la del reloj del visitante).
  const latestIso = (companies || []).reduce<string | null>(
    (max, c: any) => (c.updated_at && (!max || c.updated_at > max) ? c.updated_at : max),
    null
  );
  const lastUpdated = latestIso ? new Date(latestIso).toISOString().slice(0, 10) : undefined;

  // JSON-LD: BreadcrumbList
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://eligetuhosting.com/' },
      { '@type': 'ListItem', position: 2, name: `Hosting en ${info.name}`, item: canonical },
    ],
  };

  // JSON-LD: CollectionPage with ItemList of Organizations
  const orgItems = (companies || []).map((c: any, i: number) => {
    const org: any = {
      '@type': 'Organization',
      name: c.name,
      url: canonical,
    };
    if (c.contact_address) org.address = c.contact_address;
    if (c.contact_phone) org.telephone = c.contact_phone;
    return { '@type': 'ListItem', position: i + 1, item: org };
  });
  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: canonical,
    inLanguage: info.locale,
    isAccessibleForFree: true,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    dateModified: lastUpdated,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: orgItems.length,
      itemListElement: orgItems,
    },
  };

  const faqs = [
    {
      q: `¿Qué es este directorio de hosting en ${info.name}?`,
      a: `Es un listado de proveedores de hosting con presencia en ${info.name}, publicado por Elige Tu Hosting. Mostramos únicamente datos comprobables (razón social, contacto, datacenter, tecnología) sin puntajes inventados.`,
    },
    {
      q: '¿Cómo se verifican los datos?',
      a: `Contrastamos WHOIS, ASN, registros mercantiles, sitios oficiales y respuestas de soporte. No publicamos ranking hasta tener reclamos, benchmarks y trayectoria confirmados ${sameMethodLine()}.`,
    },
    {
      q: `¿Por qué HostingPlus aparece como recomendado en ${info.name}?`,
      a: `HostingPlus es un grupo regional con más de una década operando en LATAM, teléfono local en ${info.name} y soporte en español. En Perú tiene entidad legal peruana (Hostingplus Datacenter S.A.C.); en México, Colombia y Argentina factura como grupo desde Chile/EE.UU. sin entidad local ni datacenter dentro del país. Divulgación: podemos recibir una comisión si contratas por ese enlace; la recomendación no altera el orden objetivo del directorio.`,
    },
    {
      q: '¿Cómo sugerir un proveedor o corregir datos?',
      a: 'Escríbenos desde /contacto indicando el sitio, razón social e ID fiscal. Revisamos cada solicitud y publicamos solo cuando los datos son verificables.',
    },
  ];
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const clearFilters = () => {
    setOnlyDcLocal(false);
    setOnly247(false);
  };

  return (
    <>
      <Helmet>
        <html lang={info.locale} />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="EligeTuHosting" />
        <meta property="og:locale" content={info.locale.replace('-', '_')} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={`https://eligetuhosting.com/og/${info.slug}.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={`https://eligetuhosting.com/og/${info.slug}.png`} />
        <meta name="robots" content="index,follow" />
        {hreflangAlternates().map((a) => (
          <link key={a.hrefLang} rel="alternate" hrefLang={a.hrefLang} href={a.href} />
        ))}
        <link rel="alternate" type="text/markdown" href={`/${info.slug}.md`} title={`${info.name} — datos en Markdown (CC-BY-4.0)`} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
        <script type="application/ld+json">{JSON.stringify(collectionLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      </Helmet>

      <Navbar />

      <main>
        <EditionHeader
          code={info.code}
          slug={slug}
          name={info.name}
          rankingTo={rankingPath(edition)}
          loading={isLoading}
          total={companies ? companies.length : null}
          localDc={companies ? localDcCount : null}
          latestIso={latestIso}
        />

        {hasRecommended && (
          <div className="container pt-10 md:pt-14">
            <CountryReassurances country={slug} countryName={info.name} variant="landing" />
          </div>
        )}

        <BuyerRoutes country={slug} countryName={info.name} />

        <div className="container">
          <AdvisorEmbed />
        </div>

        <Section
          id="directorio"
          title={`Proveedores de ${info.name}`}
          density="tight"
          action={
            <p className="t-small flex flex-wrap items-center gap-2 text-ink-2">
              <ProvenanceTag kind="declared" />
              El datacenter es el que declara cada proveedor.
            </p>
          }
        >
          {isLoading ? (
            <p className="border-y-2 border-ink py-10 t-body text-ink-2">Cargando proveedores…</p>
          ) : isError ? (
            // Un error de lectura no es una edición vacía: nunca mostrar "Estamos verificando" aquí.
            <div role="alert" className="t-small rounded-xl border border-rule bg-paper p-5 text-ink-2 md:p-6">
              <p className="max-w-[62ch]">
                No pudimos cargar el directorio de {info.name}. Los proveedores siguen publicados; es un problema de
                conexión con nuestra base de datos.
              </p>
              <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
                Reintentar
              </Button>
            </div>
          ) : companies && companies.length > 0 ? (
            <>
              <DirectoryFilterBar
                onlyDcLocal={onlyDcLocal}
                only247={only247}
                sort={sort}
                countryName={info.name}
                onOnlyDcLocalChange={setOnlyDcLocal}
                onOnly247Change={setOnly247}
                onSortChange={setSort}
                totalCount={companies.length}
                visibleCount={filteredCompanies.length}
              />
              {filteredCompanies.length === 0 ? (
                <div className="rounded-xl border border-rule bg-paper p-5 md:p-6">
                  <p className="t-body text-ink">Ningún proveedor cumple esos filtros.</p>
                  <p className="t-small text-ink-2">{fewerFiltersHint(slug)}</p>
                  <Button type="button" variant="outline" className="mt-4" onClick={clearFilters}>
                    Quitar filtros
                  </Button>
                </div>
              ) : (
                <ul className="divide-y divide-rule border-y-2 border-ink">
                  {filteredCompanies.map((c: any) => (
                    <DirectoryRow key={c.id} company={c} countrySlug={info.slug} countryName={info.name} dcSlug={dcSlug} />
                  ))}
                </ul>
              )}
            </>
          ) : (
            <div className="rounded-xl border border-rule bg-paper p-6 md:p-8">
              <h3 className="t-h3 text-ink">Estamos verificando a los proveedores de {info.name}</h3>
              <p className="t-small mt-2 max-w-[62ch] text-ink-2">
                No publicamos rankings sin datos comprobables. Estamos revisando red, datacenter, reclamos y
                trayectoria {sameMethodLine()}.
              </p>
              <Button asChild className="mt-4">
                <Link to="/contacto">Sugerir un proveedor</Link>
              </Button>
            </div>
          )}
        </Section>

        <Section id="como-ordenamos" tone="paper" title="Cómo ordenamos este directorio" density="tight">
          <div className="t-body measure space-y-4 text-ink-2">
            <p>
              El directorio de {info.name} se ordena por la calidad comprobable de la infraestructura del operador y
              por transparencia verificable, no por puntajes autoasignados. En este orden: (1) calidad certificada
              del datacenter, con operador identificado; (2) entidad legal identificable, registros públicos de
              reclamos, teléfono y soporte en español; (3) presencia y latencia al país (ASN y red); (4) antigüedad.
            </p>
            <p className="t-meta">
              Última edición de los datos de {info.name}: {latestIso ? formatDataDate(latestIso) : isLoading ? '…' : 'sin dato'}.
              Datos bajo licencia CC-BY-4.0, de acceso libre.
            </p>
          </div>
        </Section>

        <Section id="preguntas" title="Preguntas frecuentes" density="tight">
          <Accordion type="single" collapsible className="max-w-3xl border-t border-rule">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-rule">
                <AccordionTrigger className="min-h-[44px] text-left font-semibold text-ink hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="t-body measure text-ink-2">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Section>
      </main>

      <Footer />
    </>
  );
};

export default CountryLanding;

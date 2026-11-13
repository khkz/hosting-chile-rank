import { useLocation, Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  ArrowRight,
  Globe,
  ExternalLink,
  Phone,
  MapPin,
  Clock,
  Server,
  Building2,
  FileText,
  Cpu,
  
} from 'lucide-react';
import { COUNTRIES, getCountryFromPath } from '@/lib/country';
import { getEdition, hreflangAlternates, rankingPath } from '@/lib/countries';
import Flag from '@/components/data/Flag';
import { ProvenanceGlyph, ProvenanceTag } from '@/components/data/Provenance';
import AdvisorEmbed from '@/components/advisor/AdvisorEmbed';
import DirectoryFilterBar, { type SortMode } from '@/components/DirectoryFilterBar';
import { hasLocalDatacenter, has247Support, type LatamDcSlug } from '@/lib/dcLocal';


import { getProviderLink, isHiddenProvider } from '@/lib/providerLinks';
import { formatCorporateGroup } from '@/lib/formatGroup';
import CountryReassurances from '@/components/country/CountryReassurances';
import BuyerRoutes from '@/components/country/BuyerRoutes';

const CountryLanding = () => {
  const location = useLocation();
  const info = getCountryFromPath(location.pathname) ?? COUNTRIES.PE;
  const edition = getEdition(info.code);

  const { data: companies, isLoading } = useQuery({
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

  // Fecha real de los datos: la última modificación de un proveedor del país
  // (antes se mostraba la fecha de hoy en cada visita).
  const latestIso = (companies || []).reduce<string | null>(
    (max, c: any) => (c.updated_at && (!max || c.updated_at > max) ? c.updated_at : max),
    null
  );
  const lastUpdated = (latestIso ? new Date(latestIso) : new Date()).toISOString().slice(0, 10);
  const lastUpdatedHuman = latestIso
    ? new Date(latestIso).toLocaleDateString(info.locale, { day: 'numeric', month: 'long', year: 'numeric' })
    : '…';

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
      a: 'Contrastamos WHOIS, ASN, registros mercantiles, sitios oficiales y respuestas de soporte. No publicamos ranking hasta tener reclamos, benchmarks y trayectoria confirmados con la misma metodología usada en Chile.',
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
        <section className="border-b border-rule bg-paper">
          <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-12 md:py-16">
            <div className="md:col-span-8">
              <p className="flex items-center gap-2 text-sm font-medium text-ink-2">
                <Flag code={info.code} size={22} />
                Edición {info.name}
              </p>
              <h1 className="type-display mt-4 text-[2.5rem] text-ink sm:text-6xl">Hosting en {info.name}</h1>
              <p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-ink-2">
                Directorio de proveedores con datos comprobables: razón social, datacenter, contacto y tecnología. No
                publicamos notas hasta verificar reclamos, red y trayectoria con la misma metodología que en Chile.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  to={rankingPath(edition)}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-md bg-ink px-6 font-semibold text-white hover:bg-ink-soft"
                >
                  Mejor hosting en {info.name} 2026
                </Link>
                <Link
                  to={`/${info.slug}/hosting-con-datacenter-local`}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-md border border-ink/25 bg-white px-6 font-semibold text-ink hover:border-ink"
                >
                  Con datacenter en {info.name}
                </Link>
              </div>
            </div>
            <aside className="self-end md:col-span-4" aria-label={`Resumen de ${info.name}`}>
              <dl className="divide-y divide-rule border-y border-ink/80 text-ink tabular">
                <div className="flex items-baseline justify-between py-3">
                  <dt className="text-sm text-ink-2">Proveedores verificados</dt>
                  <dd className="text-2xl font-bold">{companies ? companies.length : '…'}</dd>
                </div>
                <div className="flex items-baseline justify-between py-3">
                  <dt className="flex items-center gap-2 text-sm text-ink-2">
                    Datacenter en el país <ProvenanceTag kind="declared" />
                  </dt>
                  <dd className="text-2xl font-bold">{companies ? localDcCount : '…'}</dd>
                </div>
                <div className="flex items-baseline justify-between py-3">
                  <dt className="text-sm text-ink-2">Datos actualizados</dt>
                  <dd className="font-semibold">{lastUpdatedHuman}</dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          {hasRecommended && (
            <CountryReassurances
              country={info.slug as 'pe' | 'mx' | 'co' | 'ar'}
              countryName={info.name}
              variant="landing"
            />
          )}

          <BuyerRoutes
            country={info.slug as 'pe' | 'mx' | 'co' | 'ar'}
            countryName={info.name}
          />

          <AdvisorEmbed />

          <section aria-labelledby="directorio-titulo" className="mt-12">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <h2 id="directorio-titulo" className="type-wide text-2xl font-bold text-ink md:text-3xl">
                Proveedores de {info.name}
              </h2>
              <p className="flex items-center gap-2 text-sm text-ink-3">
                <ProvenanceGlyph kind="declared" />
                El datacenter es el que declara cada proveedor.
              </p>
            </div>

            {isLoading ? (
              <p className="border-y-2 border-ink py-10 text-center text-ink-2">Cargando proveedores…</p>
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
                  <p className="rounded-md border border-rule bg-paper p-6 text-center text-sm text-ink-2">
                    Ningún proveedor cumple esos filtros. Quita alguno para ver más resultados.
                  </p>
                ) : (
                  <ul className="divide-y divide-rule border-y-2 border-ink">
                    {filteredCompanies.map((c: any) => {
                      const link = c.slug && c.website ? getProviderLink(c.slug, c.website) : null;
                      const techs: string[] = Array.isArray(c.technologies)
                        ? c.technologies.filter((t: any) => typeof t === 'string')
                        : [];
                      const local = hasLocalDatacenter(dcSlug, c.datacenter_location);
                      return (
                        <li key={c.id} className="grid gap-4 py-5 md:grid-cols-12 md:gap-6">
                          <div className="md:col-span-4">
                            <h3 className="text-lg font-semibold text-ink">
                              {c.slug ? (
                                <Link to={`/${info.slug}/${c.slug}`} className="hover:underline underline-offset-4">
                                  {c.name}
                                </Link>
                              ) : (
                                c.name
                              )}
                            </h3>
                            {c.legal_name && <p className="mt-0.5 text-sm text-ink-2">{c.legal_name}</p>}
                            {c.corporate_group && <p className="text-sm text-ink-3">{formatCorporateGroup(c.corporate_group)}</p>}
                          </div>
                          <dl className="grid gap-x-6 gap-y-2 text-sm md:col-span-6 md:grid-cols-2">
                            <div>
                              <dt className="flex items-center gap-1.5 text-xs text-ink-3">
                                <Server className="h-3.5 w-3.5" aria-hidden /> Datacenter
                                <ProvenanceGlyph kind="declared" />
                              </dt>
                              <dd className="mt-0.5 text-ink">
                                {c.datacenter_location || <span className="text-ink-3">No lo declara</span>}
                                {local && (
                                  <span className="ml-2 rounded bg-signal-declared-bg px-1.5 py-[1px] text-[11px] font-semibold text-signal-declared">
                                    En {info.name}
                                  </span>
                                )}
                              </dd>
                            </div>
                            <div>
                              <dt className="flex items-center gap-1.5 text-xs text-ink-3">
                                <Phone className="h-3.5 w-3.5" aria-hidden /> Contacto
                              </dt>
                              <dd className="mt-0.5 text-ink">
                                {c.contact_phone || <span className="text-ink-3">Sin teléfono publicado</span>}
                                {c.contact_hours && <span className="block text-ink-2">{c.contact_hours}</span>}
                              </dd>
                            </div>
                            {c.contact_address && (
                              <div>
                                <dt className="flex items-center gap-1.5 text-xs text-ink-3">
                                  <MapPin className="h-3.5 w-3.5" aria-hidden /> Dirección
                                </dt>
                                <dd className="mt-0.5 text-ink">{c.contact_address}</dd>
                              </div>
                            )}
                            {techs.length > 0 && (
                              <div>
                                <dt className="flex items-center gap-1.5 text-xs text-ink-3">
                                  <Cpu className="h-3.5 w-3.5" aria-hidden /> Tecnología
                                </dt>
                                <dd className="mt-0.5 text-ink">{techs.slice(0, 6).join(', ')}</dd>
                              </div>
                            )}
                          </dl>
                          <div className="flex gap-2 md:col-span-2 md:flex-col md:items-stretch">
                            {c.slug && (
                              <Link
                                to={`/${info.slug}/${c.slug}`}
                                className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-md border border-ink/25 px-3 text-sm font-semibold text-ink hover:border-ink md:flex-none"
                              >
                                Ver ficha
                              </Link>
                            )}
                            {link && (
                              <a
                                href={link.href}
                                target="_blank"
                                rel={link.rel}
                                referrerPolicy="no-referrer"
                                className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1 rounded-md bg-ink px-3 text-sm font-semibold text-white hover:bg-ink-soft md:flex-none"
                              >
                                Visitar sitio <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                              </a>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </>
            ) : (
              <div className="rounded-md border border-rule bg-paper p-6 md:p-8">
                <h3 className="text-xl font-semibold text-ink">
                  Estamos verificando a los proveedores de {info.name}
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-2">
                  No publicamos rankings sin datos comprobables. Estamos revisando red, datacenter, reclamos y
                  trayectoria con la misma metodología que aplicamos en Chile.
                </p>
                <Link to="/contacto" className="mt-4 inline-flex min-h-[44px] items-center rounded-md bg-ink px-4 text-sm font-semibold text-white">
                  Sugerir un proveedor
                </Link>
              </div>
            )}
          </section>

          {/* Metodología y transparencia */}
          <section className="mt-14 grid gap-6 border-t border-rule pt-10 md:grid-cols-12">
            <h2 className="type-wide text-2xl font-bold text-ink md:col-span-4">Cómo ordenamos este directorio</h2>
            <div className="space-y-3 text-[15px] leading-relaxed text-ink-2 md:col-span-8">
              <p>
                El directorio de {info.name} se ordena por la calidad comprobable de la infraestructura del operador y
                por transparencia verificable, no por puntajes autoasignados. En este orden: (1) calidad certificada
                del datacenter, con operador identificado; (2) entidad legal identificable, registros públicos de
                reclamos, teléfono y soporte en español; (3) presencia y latencia al país (ASN y red); (4) antigüedad.
              </p>
              <p className="text-sm text-ink-3">
                Última actualización de datos: {lastUpdatedHuman}. Datos bajo licencia CC-BY-4.0, de acceso libre.
              </p>
            </div>
          </section>

          {/* Preguntas frecuentes */}
          <section className="mt-12 grid gap-6 border-t border-rule pt-10 md:grid-cols-12">
            <h2 className="type-wide text-2xl font-bold text-ink md:col-span-4">Preguntas frecuentes</h2>
            <Accordion type="single" collapsible className="md:col-span-8">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-rule">
                  <AccordionTrigger className="text-left font-semibold text-ink hover:no-underline">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-[15px] leading-relaxed text-ink-2">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default CountryLanding;

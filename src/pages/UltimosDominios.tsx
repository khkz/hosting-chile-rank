import React, { useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { RefreshCw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import PageHeader from '@/components/system/PageHeader';
import Section from '@/components/system/Section';
import Callout from '@/components/system/Callout';
import { ProvenanceTag } from '@/components/data/Provenance';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import DomainAnalysisSearch from '@/components/DomainAnalysisSearch';
import DomainListFilter from '@/components/DomainListFilter';
import NicDomainList from '@/components/herramientas/NicDomainList';
import NicDomainPagination from '@/components/herramientas/NicDomainPagination';
import UltimosDominiosInfo from '@/components/herramientas/UltimosDominiosInfo';
import { useNicLatestDomains } from '@/components/herramientas/useNicLatestDomains';
import { formatToolDateTime, isoDateTime } from '@/components/herramientas/dataTime';

const DOMAINS_PER_PAGE = 50;

const faqItems = [
  {
    question: "¿Cuántos dominios .cl se registran por día en Chile?",
    answer: "En promedio se registran entre 300 y 600 dominios .cl nuevos cada día hábil en Chile, según datos públicos de NIC Chile. Los lunes y martes suelen ser los días con mayor actividad de registro."
  },
  {
    question: "¿Cómo puedo saber si un dominio .cl está disponible?",
    answer: "Puedes verificar la disponibilidad de un dominio .cl directamente en NIC Chile (nic.cl) o usando nuestra herramienta de análisis WHOIS. Si el dominio no aparece en el registro de NIC, está disponible para ser inscrito."
  },
  {
    question: "¿Cuánto cuesta registrar un dominio .cl?",
    answer: "NIC Chile cobra la inscripción de un dominio .cl por periodos de dos años; el valor vigente se publica en nic.cl (con IVA aparte). Algunos proveedores de hosting incluyen el dominio al contratar un plan de alojamiento."
  },
  {
    question: "¿De dónde provienen los datos de esta página?",
    answer: "Los datos se obtienen directamente del registro público de NIC Chile (nic.cl), el organismo oficial que administra los dominios .cl. Nuestro sistema automatizado actualiza la información cada hora mediante GitHub Actions."
  },
  {
    question: "¿Puedo recibir alertas de nuevos dominios registrados?",
    answer: "Sí, puedes suscribirte a nuestro feed RSS en formato XML o JSON para recibir notificaciones automáticas de nuevos dominios .cl registrados. Los enlaces están disponibles en esta página."
  }
];

const UltimosDominios = () => {
  const { domains, updated, status, refreshing, notice, refresh, retry } = useNicLatestDomains();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const listRef = useRef<HTMLDivElement>(null);
  const isLoading = status === 'loading';

  const filteredDomains = domains.filter((domain) => domain.d.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalPages = Math.ceil(filteredDomains.length / DOMAINS_PER_PAGE);
  const page = Math.min(currentPage, Math.max(1, totalPages));
  const offset = (page - 1) * DOMAINS_PER_PAGE;
  const currentDomains = filteredDomains.slice(offset, offset + DOMAINS_PER_PAGE);

  const changeSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    listRef.current?.scrollIntoView({ block: 'start' });
  };

  const generateSchemaData = () => {
    if (domains.length === 0 || isLoading) return null;
    const listItems = filteredDomains.slice(0, 50).map((domain, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "WebSite",
        "name": domain.d,
        "url": `https://${domain.d}`,
        "dateCreated": domain.date
      }
    }));
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": listItems,
      "numberOfItems": listItems.length,
      "itemListOrder": "https://schema.org/ItemListOrderDescending"
    });
  };

  const generateWebPageSchema = () => JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Últimos Dominios .CL Registrados en Chile",
    "description": "Monitoreo en tiempo real de los dominios .cl registrados en NIC Chile. Datos actualizados cada hora.",
    "url": "https://eligetuhosting.cl/ultimos-dominios/",
    "inLanguage": "es-CL",
    "isPartOf": {
      "@type": "WebSite",
      "name": "EligeTuHosting.cl",
      "url": "https://eligetuhosting.cl"
    },
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["#geo-editorial", "#geo-faq"]
    }
  });

  const generateFAQSchema = () => JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  });

  const meta = (
    <>
      <ProvenanceTag kind="measured" />
      <span>
        Lista pública de NIC Chile, se actualiza cada hora; última lectura:{' '}
        {updated ? <time dateTime={isoDateTime(updated)}>{formatToolDateTime(updated)}</time> : isLoading ? 'cargando…' : 'sin dato'}
      </span>
    </>
  );

  return (
    <div className="min-h-screen bg-white text-ink">
      <Helmet>
        <title>Últimos Dominios .CL | EligeTuHosting.cl</title>
        <meta name="description" content="Monitoreo en tiempo real de los dominios .cl más recientes registrados en NIC.cl. Consulta los últimos sitios web creados en Chile." />
        <meta property="og:title" content="Últimos dominios registrados en Chile — eligetuhosting.cl" />
        <meta property="og:description" content="Lista actualizada de los últimos dominios .cl registrados. Encuentra los sitios web más recientes de Chile." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://eligetuhosting.cl/ultimos-dominios/" />
        <link rel="canonical" href="https://eligetuhosting.cl/ultimos-dominios/" />
        {!isLoading && domains.length > 0 && <script type="application/ld+json">{generateSchemaData()}</script>}
        <script type="application/ld+json">{generateWebPageSchema()}</script>
        <script type="application/ld+json">{generateFAQSchema()}</script>
        <link rel="alternate" type="application/rss+xml" title="Últimos dominios registrados en Chile" href="/feeds/latest-domains.xml" />
      </Helmet>

      <Navbar />

      <main>
        <PageHeader
          breadcrumbs={<SEOBreadcrumbs items={[]} pageName="Últimos Dominios" />}
          title="Últimos dominios .CL"
          lead="Los dominios .cl recién inscritos en NIC Chile. Abre cualquiera para ver su WHOIS, DNS, SSL e IP."
          actions={
            <>
              <Button variant="outline" onClick={refresh} disabled={refreshing || isLoading}>
                <RefreshCw aria-hidden className={refreshing ? 'animate-spin' : undefined} />
                {refreshing ? 'Leyendo la lista…' : 'Actualizar ahora'}
              </Button>
              <p className="t-small text-ink-2" role="status" aria-live="polite">
                {notice}
              </p>
            </>
          }
          meta={meta}
        />

        <Section title="Analiza cualquier dominio" lead="Escribe un dominio y te mostramos su WHOIS, DNS, SSL e IP en una ficha." density="tight">
          <DomainAnalysisSearch />
        </Section>

        <Section tone="white" title="Dominios inscritos" density="tight" className="border-t border-rule">
          <div ref={listRef} className="scroll-mt-24">
            {isLoading ? (
              <div aria-busy="true" className="space-y-3">
                <p className="sr-only" role="status">Cargando la lista de dominios…</p>
                {Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton key={index} className="h-14 w-full rounded-lg bg-paper-deep" />
                ))}
              </div>
            ) : status === 'error' ? (
              <Callout tone="caution" title="No pudimos cargar los últimos dominios" className="my-0 max-w-[62ch]">
                <p>El archivo con la lista de NIC Chile no respondió. No mostramos dominios de ejemplo para no confundirte.</p>
                <Button variant="default" onClick={retry} className="mt-3">
                  <RefreshCw aria-hidden />
                  Reintentar
                </Button>
              </Callout>
            ) : (
              <>
                <DomainListFilter
                  searchTerm={searchTerm}
                  onSearchChange={changeSearch}
                  totalDomains={domains.length}
                  filteredCount={filteredDomains.length}
                />
                {filteredDomains.length === 0 ? (
                  <div className="rounded-xl border border-rule bg-paper p-6">
                    <p className="t-h3 text-ink">Ningún dominio contiene «{searchTerm}»</p>
                    <p className="t-small mt-1 text-ink-2">Prueba con otra parte del nombre o borra el filtro para ver la lista completa.</p>
                    <Button variant="outline" className="mt-4" onClick={() => changeSearch('')}>
                      Borrar el filtro
                    </Button>
                  </div>
                ) : (
                  <>
                    <NicDomainList domains={currentDomains} offset={offset} />
                    <NicDomainPagination currentPage={page} totalPages={totalPages} onChange={paginate} />
                  </>
                )}
              </>
            )}
          </div>
        </Section>

        <UltimosDominiosInfo faqItems={faqItems} updated={updated} />
      </main>

      <Footer />
    </div>
  );
};

export default UltimosDominios;

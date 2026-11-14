import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Check, ExternalLink, RefreshCw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import PageHeader from '@/components/system/PageHeader';
import Callout from '@/components/system/Callout';
import RecentSearches from '@/components/RecentSearches';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import WhoisTabs from '@/components/WhoisTabs';
import SitePreview from '@/components/SitePreview';
import HostingCountryNote from '@/components/herramientas/HostingCountryNote';
import { formatToolDateTime, isoDateTime } from '@/components/herramientas/dataTime';
import { analyzeDomain, loadCachedAnalysis, type DomainAnalysisResult } from '@/services/domainAnalysis';
import { DomainUniqueContent } from '@/components/DomainUniqueContent';

// Function to capitalize the first letter of a string
const capitalizeFirstLetter = (string: string): string => string.charAt(0).toUpperCase() + string.slice(1);

// Helper function to calculate domain age (for meta robots)
const calculateDomainAge = (createdDate: string) => {
  if (!createdDate || createdDate === 'No disponible') {
    return { days: 0, years: 0, isNew: false, isEstablished: false };
  }
  const created = new Date(createdDate);
  const ageInDays = Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24));
  return { days: ageInDays, years: parseFloat((ageInDays / 365).toFixed(1)), isNew: ageInDays < 30, isEstablished: ageInDays > 365 };
};

/** Fecha más reciente entre las consultas que respondieron. */
const latestProbe = (data: DomainAnalysisResult): string | null => {
  const stamps = Object.values(data.probes ?? {})
    .map((p) => p.checked_at)
    .filter((d): d is string => !!d)
    .sort();
  return stamps.length ? stamps[stamps.length - 1] : null;
};

const WhoisDomain = () => {
  const { slug } = useParams<{ slug: string }>();
  const needsSlugRedirect = !!slug && slug.includes('.');
  const [domainData, setDomainData] = useState<DomainAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [fromCache, setFromCache] = useState(false);
  const { toast } = useToast();

  // Format domain name from slug
  const domainName = slug ? slug.replace(/-/g, '.') : '';
  const capitalizedDomainName = capitalizeFirstLetter(domainName);
  const pageTitle = `${capitalizedDomainName} - Análisis completo`;

  const performAnalysis = async (domain: string, forceRefresh = false) => {
    setRefreshing(forceRefresh);
    setError(null);
    try {
      if (!forceRefresh) {
        const cached = await loadCachedAnalysis(domain);
        if (cached) {
          setDomainData(cached);
          setFromCache(true);
          return;
        }
      }
      const live = await analyzeDomain(domain);
      setDomainData(live);
      setFromCache(false);
      if (forceRefresh) {
        toast({ title: 'Análisis actualizado', description: `Volvimos a consultar ${domain}.` });
      }
    } catch (err) {
      console.error('Error performing domain analysis:', err);
      setError('No pudimos completar el análisis de este dominio');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (needsSlugRedirect) return;
    if (!slug) {
      setError('No se encontró información para este dominio');
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    performAnalysis(domainName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, domainName, needsSlugRedirect]);

  // Add page-specific SEO metadata
  useEffect(() => {
    if (!domainName || needsSlugRedirect) return;
    document.title = `${capitalizedDomainName} - Análisis | EligeTuHosting.cl`;
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', `Análisis completo de ${domainName}: DNS, WHOIS, SSL, rendimiento, tecnología y más información para optimizar tu presencia en línea.`);
  }, [domainName, capitalizedDomainName, needsSlugRedirect]);

  // Si el slug llega con puntos (formato intuitivo /domain/example.com), redirigimos
  // al formato canónico con guiones para evitar 404.
  if (needsSlugRedirect) {
    const normalized = slug!.replace(/\./g, '-').toLowerCase();
    return <Navigate to={`/domain/${normalized}/`} replace />;
  }

  // Generate structured data for Schema.org
  const generateSchemaData = () => {
    if (!domainData) return null;
    const country = domainData.basic.hosting_country?.status;
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": `${capitalizedDomainName} - Análisis completo de dominio`,
      "description": `Análisis técnico completo de ${domainName}: DNS, WHOIS, SSL, rendimiento, tecnología y más información para optimizar tu presencia en línea.`,
      "mainEntityOfPage": { "@type": "WebPage", "@id": `https://eligetuhosting.cl/domain/${slug}/` },
      "author": { "@type": "Organization", "name": "eligetuhosting.cl" },
      "publisher": {
        "@type": "Organization",
        "name": "eligetuhosting.cl",
        "logo": { "@type": "ImageObject", "url": "https://eligetuhosting.cl/favicon-logo.svg", "width": "512", "height": "512" }
      },
      "datePublished": new Date().toISOString(),
      "dateModified": new Date().toISOString(),
      "about": { "@type": "WebSite", "name": domainName, "url": `https://${domainName}` },
      "isBasedOn": { "@type": "Dataset", "name": "NIC Chile WHOIS Database", "url": "https://www.nic.cl" },
      "technicalSpecifications": {
        "ip": domainData.basic.ip,
        "nameservers": domainData.basic.nameservers.join(", "),
        "provider": domainData.basic.provider,
        // Sin país medido no se declara ninguno (antes salía «Internacional» por descarte).
        "location": country === 'chile' ? "Chile" : country === 'foreign' ? "Internacional" : undefined,
        "ssl": domainData.ssl.ssl_enabled ? "Habilitado" : "Deshabilitado"
      }
    });
  };

  const breadcrumbItems = [{ name: 'Dominios', href: '/ultimos-dominios/' }];
  const handleRefresh = () => {
    if (domainName) performAnalysis(domainName, true);
  };
  const stamp = domainData ? (fromCache ? domainData.probes?.whois.checked_at ?? null : latestProbe(domainData)) : null;

  const meta = domainData ? (
    <span>
      {fromCache ? 'Copia guardada del ' : 'Análisis hecho desde tu navegador el '}
      {stamp ? <time dateTime={isoDateTime(stamp)}>{formatToolDateTime(stamp)}</time> : 'día de hoy, sin respuesta de las consultas'}
      {fromCache ? '. Usa «Actualizar análisis» para consultar de nuevo.' : '.'}
    </span>
  ) : null;

  return (
    <div className="min-h-screen bg-white text-ink">
      <Helmet>
        <title>{capitalizedDomainName} - Análisis | EligeTuHosting.cl</title>
        <meta name="description" content={`Análisis técnico completo de ${domainName}: DNS, WHOIS, SSL, rendimiento, tecnología y más información para optimizar tu presencia en línea.`} />
        <meta property="og:title" content={`${capitalizedDomainName} - Análisis | EligeTuHosting.cl`} />
        <meta property="og:description" content={`Análisis técnico completo de ${domainName}. Descubre DNS, WHOIS, SSL, rendimiento y tecnología.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://eligetuhosting.cl/domain/${slug}/`} />
        <link rel="canonical" href={`https://eligetuhosting.cl/domain/${slug}/`} />
        {domainData && <script type="application/ld+json">{generateSchemaData()}</script>}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${capitalizedDomainName} - Análisis | EligeTuHosting.cl`} />
        <meta name="twitter:description" content={`Análisis técnico completo de ${domainName}. Descubre DNS, WHOIS, SSL, rendimiento y tecnología.`} />
        {/* Conditional noindex for domains older than 90 days */}
        {domainData && calculateDomainAge(domainData.whois.created_date).days > 90 && (
          <meta name="robots" content="noindex, follow" />
        )}
        {(!domainData || calculateDomainAge(domainData.whois.created_date).days <= 90) && (
          <meta name="robots" content="index, follow" />
        )}
        <meta property="article:modified_time" content={new Date().toISOString()} />
      </Helmet>

      <Navbar />

      <main>
        <PageHeader
          breadcrumbs={<SEOBreadcrumbs items={breadcrumbItems} pageName={capitalizedDomainName} />}
          title={pageTitle}
          lead="WHOIS de NIC Chile, DNS, SSL e IP de este dominio, con la fecha de cada consulta."
          actions={
            <Button variant="outline" onClick={handleRefresh} disabled={isLoading || refreshing}>
              <RefreshCw aria-hidden className={refreshing ? 'animate-spin' : undefined} />
              {refreshing ? 'Actualizando…' : 'Actualizar análisis'}
            </Button>
          }
          meta={meta}
        />

        <div className="container py-10 md:py-12">
          {isLoading ? (
            <div aria-busy="true">
              <p className="t-small text-ink-2" role="status">
                Consultando WHOIS, DNS, SSL e IP de {domainName}. Puede tardar unos segundos.
              </p>
              <div className="mt-6 grid gap-10 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                  <Skeleton className="h-11 w-full rounded-lg bg-paper-deep" />
                  <Skeleton className="h-64 w-full rounded-xl bg-paper-deep" />
                </div>
                <Skeleton className="h-72 w-full rounded-xl bg-paper-deep" />
              </div>
            </div>
          ) : error || !domainData ? (
            <Callout tone="caution" title="No pudimos analizar este dominio" className="my-0 max-w-[62ch]">
              <p>{error ?? 'No se encontró información para este dominio'}. Revisa que el nombre esté bien escrito y vuelve a intentarlo en unos minutos.</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Button variant="default" onClick={handleRefresh}>
                  <RefreshCw aria-hidden />
                  Reintentar
                </Button>
                <Link to="/" className="text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
                  Ir a la página principal
                </Link>
              </div>
            </Callout>
          ) : (
            <>
              <HostingCountryNote data={domainData} />

              <div className="mt-10 grid gap-10 lg:grid-cols-3">
                <section aria-labelledby="resultados-titulo" className="min-w-0 lg:col-span-2">
                  <h2 id="resultados-titulo" className="t-h2 mb-5 text-ink">Resultados del análisis</h2>
                  <WhoisTabs data={domainData} isLoading={refreshing} />
                </section>
                <aside className="min-w-0 space-y-6" aria-label="Más sobre este dominio">
                  <SitePreview domain={domainName} />
                  <RecentSearches />
                </aside>
              </div>

              <DomainUniqueContent domainName={domainName} domainData={domainData} />

              <section aria-labelledby="recomendacion-titulo" className="border-t border-rule py-10">
                <h2 id="recomendacion-titulo" className="t-h2 text-ink">Recomendación de hosting</h2>
                <p className="t-body mt-3 text-ink-2">Para obtener el mejor rendimiento y soporte en Chile, te recomendamos:</p>
                <div className="mt-5 flex flex-col gap-5 rounded-xl border border-rule bg-white p-5 md:flex-row md:items-center">
                  <img alt="HostingPlus.cl" className="h-12 w-auto self-start md:self-center" src="/logo-hostingplus.svg" />
                  <div className="min-w-0 flex-1">
                    <p className="t-h3 text-ink">HostingPlus.cl - Nº1 en Chile</p>
                    <p className="t-small text-ink-2">IP chilena, soporte 24/7 y LiteSpeed Enterprise</p>
                    <ul className="t-small mt-2 space-y-1 text-ink-2">
                      {['Mejor velocidad en sitios chilenos', 'Soporte técnico local 24/7', 'Migración gratuita'].map((t) => (
                        <li key={t} className="flex items-center gap-2">
                          <Check aria-hidden className="h-4 w-4 shrink-0 text-ink-2" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button asChild variant="brand" className="self-start md:self-center">
                    <a href="https://www.hostingplus.cl/" target="_blank" rel="noopener noreferrer">
                      Contratar
                      <ExternalLink aria-hidden />
                    </a>
                  </Button>
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WhoisDomain;

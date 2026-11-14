import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ExternalLink, RefreshCw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import PageHeader from '@/components/system/PageHeader';
import Section from '@/components/system/Section';
import Callout from '@/components/system/Callout';
import { getASNDetails, estimatePrefixSize, normalizeASN } from '@/services/asnApi';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { isChileanASN } from '@/utils/ipDetection';
import { getHostingCompanyFromASN, classifyASN } from '@/services/hostingASNService';
import { formatInteger } from '@/lib/format';
import { AsnSourceLine } from '@/components/herramientas/AsnShared';
import { fixMojibake } from '@/components/herramientas/asnText';
import { AsnPrefixChart, AsnPrefixTable, AsnProviderPanel, AsnRelatedLinks } from '@/components/herramientas/AsnDetailParts';

const CLASS_LABEL: Record<string, string> = {
  telecom: 'Telecomunicaciones',
  hosting: 'Hosting',
  isp: 'ISP',
  enterprise: 'Empresa',
  academic: 'Académico',
  government: 'Gobierno',
};

const tabTrigger = 'h-11 rounded-none border-b-2 border-transparent px-3 text-[15px] font-semibold text-ink-2 hover:text-ink data-[state=active]:border-ink data-[state=active]:bg-transparent data-[state=active]:text-ink data-[state=active]:shadow-none';

// Muestra el RIR aunque llegue como objeto, como JSON en texto o como texto simple.
const getRirDisplay = (rir: unknown): string => {
  if (!rir) return 'Sin dato';
  if (typeof rir === 'object' && (rir as { rir_name?: string }).rir_name) return (rir as { rir_name: string }).rir_name;
  if (typeof rir === 'string') {
    try {
      const parsed = JSON.parse(rir);
      if (parsed?.rir_name) return parsed.rir_name;
    } catch {
      return rir;
    }
  }
  if (typeof rir === 'number') return rir.toString();
  return 'Sin dato';
};

const ASNDetail: React.FC = () => {
  const { asn: asnParam } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Awaited<ReturnType<typeof getASNDetails>> | null>(null);

  // Canonicalize URL: always /asn/AS{number}
  useEffect(() => {
    if (!asnParam) return;
    const n = normalizeASN(asnParam);
    if (!n) return;
    const canonicalParam = `AS${n}`;
    if (asnParam.toUpperCase() !== canonicalParam) navigate(`/asn/${canonicalParam}`, { replace: true });
  }, [asnParam, navigate]);

  const load = useCallback(async () => {
    if (!asnParam) return;
    setLoading(true);
    setError(null);
    try {
      setData(await getASNDetails(asnParam));
    } catch (e) {
      console.error('Error loading ASN:', e);
      setError(e instanceof Error && e.message === 'ASN inválido' ? 'invalid' : 'failed');
    } finally {
      setLoading(false);
    }
  }, [asnParam]);

  useEffect(() => {
    load();
  }, [load]);

  const asnNum = useMemo(() => normalizeASN(asnParam || '') || 0, [asnParam]);
  const pageTitle = data ? `AS${data.overview.asn} ${data.overview.name || ''} – Prefijos IP y Peers` : `AS${asnNum} – ASN`;
  const canonical = `${window.location.origin}/asn/AS${asnNum}`;
  const asnClassification = data ? classifyASN(data.overview.name || '', data.overview.description) : 'unknown';
  const hostingCompany = data ? getHostingCompanyFromASN(`AS${data.overview.asn}`) : null;
  const isChilean = data ? isChileanASN(`AS${data.overview.asn}`) : false;

  const chartData = useMemo(() => {
    if (!data) return [];
    return data.ipv4_prefixes
      .map((p) => ({ prefix: p.prefix, size: estimatePrefixSize(p.prefix) }))
      .sort((a, b) => b.size - a.size)
      .slice(0, 10);
  }, [data]);

  const h1 = data ? `AS${data.overview.asn} ${fixMojibake(data.overview.name)}`.trim() : `AS${asnNum}`;
  const total = data ? data.ipv4_prefixes.length + data.ipv6_prefixes.length : 0;

  return (
    <>
      <Navbar />
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={`Detalle del ASN AS${asnNum}: prefijos IPv4/IPv6, tamaño de rangos y peers.`} />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={canonical} />
        <meta httpEquiv="content-language" content="es-CL" />
        <link rel="alternate" hrefLang="es-cl" href={canonical} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={`Prefijos IP y relaciones de AS${asnNum}.`} />
        <meta property="og:url" content={canonical} />
        {data && (
          <script type="application/ld+json">{JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: pageTitle,
            url: canonical,
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${window.location.origin}/` },
                { '@type': 'ListItem', position: 2, name: 'ASN', item: `${window.location.origin}/asn` },
                { '@type': 'ListItem', position: 3, name: `AS${data.overview.asn}` },
              ]
            }
          })}</script>
        )}
      </Helmet>

      <main>
        <PageHeader
          breadcrumbs={<SEOBreadcrumbs items={[{ name: 'ASN', href: '/asn' }]} pageName={`AS${asnNum}`} />}
          title={h1}
          lead={data ? fixMojibake(data.overview.description) || 'Proveedor de red / Sistema autónomo' : undefined}
          actions={data ? (
            <>
              <Button variant="outline" size="sm" asChild className="h-11 sm:h-9">
                <a href={`https://bgpview.io/asn/${data.overview.asn}`} target="_blank" rel="noopener noreferrer">BGPView<ExternalLink aria-hidden /></a>
              </Button>
              <Button variant="outline" size="sm" asChild className="h-11 sm:h-9">
                <a href={`https://bgp.he.net/AS${data.overview.asn}`} target="_blank" rel="noopener noreferrer">Hurricane Electric<ExternalLink aria-hidden /></a>
              </Button>
            </>
          ) : undefined}
          meta={<AsnSourceLine cacheDays={30} />}
        />

        <Section density="tight" aria-label={`Datos de AS${asnNum}`}>
          {loading && (
            <div aria-busy="true" className="space-y-4">
              <p className="t-small text-ink-2" role="status">Cargando datos del ASN…</p>
              <Skeleton className="h-24 w-full rounded-xl bg-paper-deep" />
              <Skeleton className="h-80 w-full rounded-xl bg-paper-deep" />
            </div>
          )}

          {!loading && error && (
            <Callout tone="caution" title={error === 'invalid' ? 'Ese número de ASN no es válido' : 'No pudimos cargar este ASN'} className="my-0 max-w-[62ch]">
              <p>{error === 'invalid'
                ? 'Escribe el ASN como AS27651 o solo el número.'
                : 'BGPView no respondió. No es que el ASN no exista: vuelve a intentarlo en unos minutos.'}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                {error !== 'invalid' && (
                  <Button variant="default" onClick={load}><RefreshCw aria-hidden />Reintentar</Button>
                )}
                <Link to="/asn" className="text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">Buscar otro ASN</Link>
              </div>
            </Callout>
          )}

          {!loading && data && (
            <div className="space-y-12">
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  {isChilean && <Badge variant="outline">Chile</Badge>}
                  {hostingCompany && <Badge variant="outline">Hosting</Badge>}
                  {asnClassification !== 'unknown' && <Badge variant="outline">{CLASS_LABEL[asnClassification]}</Badge>}
                </div>
                <dl className="grid grid-cols-2 gap-x-8 gap-y-4 border-y border-rule py-5 md:grid-cols-3 lg:grid-cols-6">
                  {[
                    { label: 'País', value: data.overview.country_code || 'Sin dato' },
                    { label: 'RIR', value: getRirDisplay(data.overview.rir_allocation) },
                    { label: 'Prefijos en total', value: formatInteger(total) },
                    { label: 'Prefijos IPv4', value: formatInteger(data.ipv4_prefixes.length) },
                    { label: 'Prefijos IPv6', value: formatInteger(data.ipv6_prefixes.length) },
                    { label: 'Peers', value: data.peers ? formatInteger(data.peers.length) : 'Sin dato' },
                  ].map((s) => (
                    <div key={s.label}>
                      <dt className="t-label">{s.label}</dt>
                      <dd className="tabular mt-1 text-xl font-bold text-ink">{s.value}</dd>
                    </div>
                  ))}
                </dl>
                <AsnProviderPanel
                  asn={data.overview.asn}
                  company={hostingCompany}
                  isHostingClass={asnClassification === 'hosting'}
                  onReview={(slug) => navigate(`/resena/${slug}`)}
                />
              </div>

              {chartData.length > 0 && (
                <section aria-labelledby="top-rangos">
                  <h2 id="top-rangos" className="t-h2 text-ink">Los 10 rangos IPv4 más grandes</h2>
                  <p className="t-meta mt-2">Cantidad de direcciones IP de cada prefijo. Pasa el cursor sobre una barra para ver el prefijo.</p>
                  <div className="mt-5"><AsnPrefixChart data={chartData} /></div>
                </section>
              )}

              <section aria-labelledby="prefijos">
                <h2 id="prefijos" className="t-h2 text-ink">Prefijos anunciados</h2>
                <Tabs defaultValue="ipv4" className="mt-5">
                  <TabsList className="flex h-auto w-full justify-start gap-1 overflow-x-auto rounded-none border-b border-rule bg-transparent p-0">
                    <TabsTrigger value="ipv4" className={tabTrigger}>IPv4 ({formatInteger(data.ipv4_prefixes.length)})</TabsTrigger>
                    <TabsTrigger value="ipv6" className={tabTrigger}>IPv6 ({formatInteger(data.ipv6_prefixes.length)})</TabsTrigger>
                  </TabsList>
                  <TabsContent value="ipv4" className="mt-4"><AsnPrefixTable prefixes={data.ipv4_prefixes} label="Prefijos IPv4" /></TabsContent>
                  <TabsContent value="ipv6" className="mt-4"><AsnPrefixTable prefixes={data.ipv6_prefixes} label="Prefijos IPv6" /></TabsContent>
                </Tabs>
              </section>

              {data.peers && data.peers.length > 0 && (
                <section aria-labelledby="peers">
                  <h2 id="peers" className="t-h2 text-ink">Peers (vínculos)</h2>
                  <ul className="mt-5 grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
                    {data.peers.slice(0, 24).map((p) => (
                      <li key={p.asn}>
                        <Link to={`/asn/AS${p.asn}`} className="t-small inline-flex min-h-11 items-center text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink">
                          AS{p.asn} {p.name || ''}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {data.peers.length > 24 && <p className="t-meta mt-2">Mostrando los primeros 24 peers.</p>}
                </section>
              )}

              <AsnRelatedLinks isChilean={isChilean} />
            </div>
          )}
        </Section>
      </main>
      <StickyCTA />
      <Footer />
    </>
  );
};

export default ASNDetail;

import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import PageHeader from '@/components/system/PageHeader';
import Section from '@/components/system/Section';
import Callout from '@/components/system/Callout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { searchASN, ASNSearchResult } from '@/services/asnApi';
import { isChileanASN } from '@/utils/ipDetection';
import { formatInteger } from '@/lib/format';
import { AsnResultsTable, AsnSourceLine } from '@/components/herramientas/AsnShared';

// Búsquedas que arman el directorio chileno.
const CHILEAN_PROVIDERS = [
  'chile', 'claro', 'entel', 'movistar', 'vtr', 'gtd', 'mundo', 'tie', 'netline',
  'hosting.cl', 'netuno', 'rdc', 'redvoiss', 'solucionhost', 'hostingplus',
  'ecohosting', 'pluschile', 'webhost', 'gigas'
];

const TELECOM = /claro|entel|movistar|vtr|wom|virgin|simple|telefon|telecom|movil/i;
const HOSTING = /hosting|host|server|datacenter|cloud|netuno|solucion|eco.*host|plus.*chile|webhost|gigas/i;
const ISP = /gtd|mundo|tie|netline|rdc|redvoiss|internet|isp|provider|banda|fibra/i;
const NOT_HOSTING = /hosting|host|server|datacenter|cloud/i;

type Status = 'loading' | 'ready' | 'error';

const ASNChile: React.FC = () => {
  const [chileanASNs, setChileanASNs] = useState<ASNSearchResult[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [failed, setFailed] = useState(0);

  const loadChileanASNs = useCallback(async () => {
    setStatus('loading');
    // Cada búsqueda informa si respondió: un fallo no se suma como «0 ASN».
    const outcomes = await Promise.all(
      CHILEAN_PROVIDERS.map(async (provider) => {
        try {
          const results = await searchASN(provider);
          const filtered = results.filter(r =>
            r.country_code === 'CL' ||
            isChileanASN(`AS${r.asn}`) ||
            (r.name && /chile|claro|entel|movistar|vtr|gtd|ecohosting|pluschile|hosting\.cl/i.test(r.name)) ||
            (r.description && /chile|claro|entel|movistar|vtr|gtd|ecohosting|pluschile/i.test(r.description))
          );
          return { ok: true, results: filtered };
        } catch (e) {
          console.warn(`Error searching for ${provider}:`, e);
          return { ok: false, results: [] as ASNSearchResult[] };
        }
      })
    );
    const failures = outcomes.filter((o) => !o.ok).length;
    const unique = outcomes
      .flatMap((o) => o.results)
      .filter((asn, index, arr) => arr.findIndex(a => a.asn === asn.asn) === index)
      .sort((a, b) => a.asn - b.asn);
    setFailed(failures);
    setChileanASNs(unique);
    setStatus(failures === CHILEAN_PROVIDERS.length ? 'error' : 'ready');
  }, []);

  useEffect(() => {
    loadChileanASNs();
  }, [loadChileanASNs]);

  const categorized = {
    telecom: chileanASNs.filter(asn => asn.name && TELECOM.test(asn.name)),
    hosting: chileanASNs.filter(asn => asn.name && HOSTING.test(asn.name)),
    isp: chileanASNs.filter(asn => asn.name && ISP.test(asn.name) && !NOT_HOSTING.test(asn.name)),
    others: chileanASNs.filter(asn => {
      const name = asn.name || '';
      const desc = asn.description || '';
      return !(TELECOM.test(name) || HOSTING.test(name) || (ISP.test(name) && !NOT_HOSTING.test(name))) &&
        (name.includes('chile') || desc.includes('chile') || asn.country_code === 'CL');
    }),
  };

  const groups = [
    { id: 'telecomunicaciones', title: 'Telecomunicaciones', items: categorized.telecom },
    { id: 'hosting', title: 'Hosting y servidores', items: categorized.hosting },
    { id: 'isp', title: 'Proveedores de internet (ISP)', items: categorized.isp },
    { id: 'otros', title: 'Otros proveedores', items: categorized.others },
  ];

  const retry = (
    <Button variant="default" onClick={loadChileanASNs} className="mt-3">
      <RefreshCw aria-hidden />
      Reintentar
    </Button>
  );

  return (
    <>
      <Navbar />
      <Helmet>
        <title>ASN Chile: Sistemas Autónomos | EligeTuHosting.cl</title>
        <meta name="description" content="Directorio completo de ASNs chilenos: Claro, Entel, Movistar, VTR, GTD, empresas de hosting y más proveedores de internet de Chile." />
        <link rel="canonical" href={`${window.location.origin}/asn/chile`} />
        <meta httpEquiv="content-language" content="es-CL" />
        <link rel="alternate" hrefLang="es-cl" href={`${window.location.origin}/asn/chile`} />
        <meta property="og:title" content="ASN Chile: Sistemas Autónomos de Proveedores Chilenos" />
        <meta property="og:description" content="Directorio completo de ASNs chilenos: Claro, Entel, Movistar, VTR, GTD y más." />
        <meta property="og:url" content={`${window.location.origin}/asn/chile`} />
      </Helmet>
      <main>
        <PageHeader
          breadcrumbs={<SEOBreadcrumbs items={[{ name: 'ASN', href: '/asn' }]} pageName="Chile" />}
          title="ASN Chile"
          lead="Directorio de sistemas autónomos (ASN) de proveedores chilenos: telecomunicaciones, hosting, ISPs y más."
          meta={<AsnSourceLine cacheDays={7} />}
        />

        <Section density="tight" aria-label="Directorio de ASN chilenos">
          {status === 'loading' && (
            <div aria-busy="true" className="space-y-3">
              <p className="t-small text-ink-2" role="status">Buscando ASN chilenos en BGPView…</p>
              <Skeleton className="h-20 w-full rounded-xl bg-paper-deep" />
              <Skeleton className="h-64 w-full rounded-xl bg-paper-deep" />
            </div>
          )}

          {status === 'error' && (
            <Callout tone="caution" title="No pudimos consultar la base de ASN en este momento" className="my-0 max-w-[62ch]">
              <p>Ninguna de las {CHILEAN_PROVIDERS.length} búsquedas en BGPView respondió, así que no mostramos cifras. Vuelve a intentarlo en unos minutos.</p>
              {retry}
            </Callout>
          )}

          {status === 'ready' && (
            <>
              {failed > 0 && (
                <Callout title="Lista incompleta" className="mb-8 mt-0 max-w-[62ch]">
                  <p>
                    {formatInteger(failed)} de {CHILEAN_PROVIDERS.length} búsquedas no respondieron. Los números de abajo cuentan solo lo que sí
                    encontramos.
                  </p>
                  {retry}
                </Callout>
              )}
              <dl className="grid grid-cols-2 gap-x-8 gap-y-4 border-y border-rule py-5 md:grid-cols-4">
                {[
                  { label: 'ASN encontrados', value: chileanASNs.length },
                  { label: 'Telecomunicaciones', value: categorized.telecom.length },
                  { label: 'Hosting', value: categorized.hosting.length },
                  { label: 'ISP', value: categorized.isp.length },
                ].map((s) => (
                  <div key={s.label}>
                    <dt className="t-label">{s.label}</dt>
                    <dd className="tabular mt-1 text-3xl font-extrabold leading-none text-ink">{formatInteger(s.value)}</dd>
                  </div>
                ))}
              </dl>

              {chileanASNs.length === 0 && (
                <p className="t-body mt-8 text-ink-2">Las búsquedas respondieron, pero no encontraron ASN chilenos.</p>
              )}

              {groups.filter((g) => g.items.length > 0).map((g) => (
                <section key={g.id} aria-labelledby={`asn-${g.id}`} className="mt-12">
                  <h2 id={`asn-${g.id}`} className="t-h2 text-ink">
                    {g.title} <span className="tabular text-ink-3">({formatInteger(g.items.length)})</span>
                  </h2>
                  <div className="mt-5">
                    <AsnResultsTable results={g.items.slice(0, 24)} caption={`ASN de ${g.title.toLowerCase()} en Chile`} />
                  </div>
                  {g.items.length > 24 && <p className="t-meta mt-2">Mostrando los primeros 24.</p>}
                </section>
              ))}

              <p className="t-body mt-12 text-ink-2">
                ¿Buscas un ASN específico? Usa el{' '}
                <Link to="/asn" className="text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
                  directorio general de ASN
                </Link>
                .
              </p>
            </>
          )}
        </Section>
      </main>
      <StickyCTA />
      <Footer />
    </>
  );
};

export default ASNChile;

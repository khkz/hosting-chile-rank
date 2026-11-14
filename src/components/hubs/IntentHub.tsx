import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RecommendedByData from '@/components/RecommendedByData';
import Section from '@/components/system/Section';
import Callout from '@/components/system/Callout';
import EditorialImage from '@/components/media/EditorialImage';
import RankingHeader from '@/components/hubs/RankingHeader';
import RankingFaq from '@/components/hubs/RankingFaq';
import HubTopList, { type HubProvider } from '@/components/hubs/HubTopList';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { getActiveCountryCode } from '@/lib/country';
import type { HubConfig, HubKey } from '@/lib/segmentHubs';
import { HUB_DEEP } from '@/lib/hubDeepContent';
import { isHiddenProvider } from '@/lib/providerLinks';
import { VERIFICATION_DATE_ISO } from '@/data/verified2026';
import { formatDataDate, isoDate } from '@/lib/format';
import type { EditorialImageKey } from '@/lib/editorialImages';

const HubDeepSections = React.lazy(() => import('@/components/hubs/HubDeepSections'));

const ORIGIN = 'https://eligetuhosting.cl';

/** Rótulos de la interfaz por segmento (no son datos). */
const SEGMENT: Record<HubKey, { top: string; image?: EditorialImageKey }> = {
  wordpress: { top: 'hosting para WordPress', image: 'wordpress' },
  ecommerce: { top: 'hosting para tiendas online', image: 'ecommerce' },
  pymes: { top: 'hosting para pymes' },
  vps: { top: 'VPS', image: 'vps' },
};

const linkClass = 'font-semibold text-ink-2 underline decoration-ink/30 underline-offset-4 hover:decoration-ink';

const IntentHub: React.FC<{ config: HubConfig }> = ({ config }) => {
  const [providers, setProviders] = useState<HubProvider[]>([]);
  const [names, setNames] = useState<Record<string, { name: string; website: string | null }>>({});
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let mounted = true;
    setStatus('loading');
    (async () => {
      const { data, error } = await supabase
        .from('hosting_companies')
        .select('slug,name,logo_url,overall_rating,promo_price,datacenter_location,total_reviews,website')
        .eq('country', getActiveCountryCode())
        .in('slug', config.providerSlugs);
      if (!mounted) return;
      if (error || !data) {
        setStatus('error');
        return;
      }
      // preserve config order (decisión pendiente 3: no se reordena)
      const ordered: HubProvider[] = [];
      for (const s of config.providerSlugs) {
        const row = data.find((d) => d.slug === s);
        if (row && !isHiddenProvider(row.slug, null)) ordered.push(row as HubProvider);
      }
      setProviders(ordered);
      setNames(Object.fromEntries(data.map((d) => [d.slug, { name: d.name, website: d.website }])));
      setStatus('ready');
    })();
    return () => { mounted = false; };
  }, [config]);

  const canonical = `${ORIGIN}${config.path}`;

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: config.h1,
    numberOfItems: providers.length,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    itemListElement: providers.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${ORIGIN}/catalogo/${p.slug}`,
      name: p.name,
    })),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: config.faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: ORIGIN },
      { '@type': 'ListItem', position: 2, name: 'Guías', item: `${ORIGIN}/guia-elegir-hosting` },
      { '@type': 'ListItem', position: 3, name: config.h1, item: canonical },
    ],
  };

  const segment = SEGMENT[config.key];
  const expected = config.providerSlugs.filter((s) => !isHiddenProvider(s, null)).length;
  const topCount = status === 'ready' ? providers.length : expected;
  const leader = names.hostingplus?.name;
  const rivals = config.providerSlugs
    .filter((s) => s !== 'hostingplus')
    .filter((s) => names[s] && !isHiddenProvider(s, names[s].website));

  return (
    <>
      <Helmet>
        <title>{config.metaTitle}</title>
        <meta name="description" content={config.metaDescription} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={config.metaTitle} />
        <meta property="og:description" content={config.metaDescription} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <Navbar />
      <main className="bg-white">
        <RankingHeader
          crumbs={[{ name: 'Guías', href: '/guia-elegir-hosting' }]}
          pageName={config.h1}
          title={config.h1}
          lead={HUB_DEEP[config.key]?.protagonist}
          reviewedAt={VERIFICATION_DATE_ISO}
          meta={
            <Link to="/metodologia" className={linkClass}>
              Cómo evaluamos
            </Link>
          }
          aside={
            segment.image ? (
              <EditorialImage name={segment.image} className="aspect-[16/9]" sizes="(min-width: 1024px) 45vw, 100vw" priority />
            ) : undefined
          }
        />

        <Section id="introduccion" density="tight">
          <p className="t-body measure text-ink-2">{config.intro}</p>
          <Callout className="max-w-[78ch]">
            <p>
              <strong className="font-semibold text-ink">Divulgación:</strong> algunos enlaces "Visitar sitio" son de
              afiliados; la comisión no afecta el orden del ranking. El orden depende únicamente de datos verificables
              (ASN, TTFB medido, uptime, reclamos, reputación).
            </p>
          </Callout>
        </Section>

        <React.Suspense fallback={null}>
          <HubDeepSections hubKey={config.key} />
        </React.Suspense>

        <Section
          id="top"
          title={`Top ${topCount} de ${segment.top} en Chile`}
          lead={
            <>
              Nota general del ranking, revisada el{' '}
              <time dateTime={isoDate(VERIFICATION_DATE_ISO)} className="font-semibold text-ink">
                {formatDataDate(VERIFICATION_DATE_ISO)}
              </time>
              .
            </>
          }
        >
          <div className="mb-6">
            <p className="t-label">Lo que buscamos en este segmento</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {config.features.map((f) => (
                <li key={f}>
                  <Badge variant="outline" className="text-[13px] font-medium">
                    {f}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
          <HubTopList providers={providers} status={status} />
          <p className="t-small mt-4 max-w-[78ch] text-ink-3">
            Precio: en el sitio oficial de cada proveedor. Estamos reverificando el catálogo y no publicamos cifras.
          </p>
        </Section>

        {leader && rivals.length > 0 && (
          <Section
            id="comparativas"
            tone="paper"
            density="tight"
            title={'Comparativas 1\u00a0a\u00a01 del segmento'}
            lead="Compara cada proveedor de este top contra el líder del ranking."
          >
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {rivals.map((s) => (
                <li key={s}>
                  <Link
                    to={`/comparativa/${s}-vs-hostingplus`}
                    className="flex min-h-[48px] items-center rounded-lg border border-rule bg-white px-4 py-2 font-medium text-ink transition-colors hover:border-ink"
                  >
                    {names[s].name} vs {leader}
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        )}

        <RankingFaq
          id="preguntas-frecuentes"
          title={`Preguntas frecuentes: ${config.keyword}`}
          items={config.faqs.map((f) => ({ question: f.q, answer: f.a }))}
        />

        <Section density="tight" tone="paper" aria-label="Recomendado por datos">
          <RecommendedByData className="max-w-3xl" />
        </Section>
      </main>
      <Footer />
    </>
  );
};

export default IntentHub;

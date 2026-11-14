import { useLocation, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/system/PageHeader';
import Section from '@/components/system/Section';
import Callout from '@/components/system/Callout';
import { LATAM_META, LATAM_OG_IMAGE, isLatamSlug, type LatamSlug } from '@/lib/latamCountry';
import { isHiddenProvider } from '@/lib/providerLinks';
import EditionCrumbs from '@/components/country/edicion/EditionCrumbs';
import ReputationList, { type ReputationRow } from '@/components/country/edicion/ReputationList';
import { firstReviewLabel, registryName, voiceFor } from '@/components/country/edicion/editionVoice';

type Row = ReputationRow;

const linkCls = 'font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink';

const CountryBenchmark = () => {
  const location = useLocation();
  const first = location.pathname.split('/').filter(Boolean)[0]?.toLowerCase();
  if (!isLatamSlug(first)) return <Navigate to="/latam" replace />;
  const slug = first as LatamSlug;
  const meta = LATAM_META[slug];
  const { registry, vos } = voiceFor(slug);

  const { data: rows, isLoading } = useQuery({
    queryKey: ['country-reputation', slug],
    queryFn: async (): Promise<Row[]> => {
      const { data: companies } = await supabase
        .from('hosting_companies')
        .select('id, slug, name, website')
        .eq('country', meta.code)
        .eq('is_verified', true)
        .range(0, 999);
      const list = (companies ?? []).filter((c: any) => !isHiddenProvider(c.slug, c.website));
      if (!list.length) return [];
      const slugs = list.map((c: any) => c.slug);
      const { data: reviews } = await supabase
        .from('reviews')
        .select('provider_slug, rating')
        .eq('status', 'approved')
        .in('provider_slug', slugs);
      const agg = new Map<string, { sum: number; count: number }>();
      for (const r of (reviews ?? []) as any[]) {
        const cur = agg.get(r.provider_slug) ?? { sum: 0, count: 0 };
        cur.sum += Number(r.rating) || 0;
        cur.count += 1;
        agg.set(r.provider_slug, cur);
      }
      const mapped: Row[] = list.map((c: any) => {
        const a = agg.get(c.slug);
        return {
          id: c.id,
          slug: c.slug,
          name: c.name,
          website: c.website,
          avg: a && a.count > 0 ? a.sum / a.count : null,
          count: a?.count ?? 0,
        };
      });
      mapped.sort((a, b) => {
        if (a.count > 0 && b.count === 0) return -1;
        if (a.count === 0 && b.count > 0) return 1;
        if (a.count > 0 && b.count > 0) {
          if ((b.avg ?? 0) !== (a.avg ?? 0)) return (b.avg ?? 0) - (a.avg ?? 0);
          return b.count - a.count;
        }
        return a.name.localeCompare(b.name);
      });
      return mapped;
    },
  });

  const canonical = `https://eligetuhosting.com/${slug}/benchmark`;
  const title = `Reputación de hosting en ${meta.name} 2026 · EligeTuHosting`;
  const description = `Reputación verificable de proveedores de hosting en ${meta.name}: reseñas aprobadas y enlace a registros oficiales de reclamos. No medimos la web de marketing.`;
  const list = rows ?? [];
  const withReviews = list.filter((r) => r.count > 0);

  const itemListLd = {
    '@context': 'https://schema.org', '@type': 'ItemList',
    name: title, numberOfItems: list.length,
    itemListElement: list.map((r, i) => ({
      '@type': 'ListItem', position: i + 1,
      url: `https://eligetuhosting.com/${slug}/${r.slug}`, name: r.name,
    })),
  };
  const ratedLd = withReviews.map((r) => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: r.name,
    url: `https://eligetuhosting.com/${slug}/${r.slug}`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: (r.avg ?? 0).toFixed(2),
      reviewCount: r.count,
      bestRating: '5',
      worstRating: '1',
    },
  }));

  const registryLink = (
    <a href={registry.url} target="_blank" rel="noopener nofollow" className={`inline-flex items-center gap-1 ${linkCls}`}>
      {registryName(registry)}
      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
    </a>
  );

  return (
    <>
      <Helmet>
        <html lang={meta.locale} />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={LATAM_OG_IMAGE[slug]} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={LATAM_OG_IMAGE[slug]} />
        <meta property="og:locale" content="es_419" />
        <script type="application/ld+json">{JSON.stringify(itemListLd)}</script>
        {ratedLd.map((s, i) => (
          <script key={i} type="application/ld+json">{JSON.stringify(s)}</script>
        ))}
      </Helmet>
      <Navbar />
      <main>
        <PageHeader
          breadcrumbs={
            <EditionCrumbs
              code={meta.code}
              items={[{ label: 'Inicio', to: '/' }, { label: `Hosting en ${meta.name}`, to: `/${slug}` }, { label: 'Reputación' }]}
            />
          }
          title={`Reputación de hosting en ${meta.name} 2026`}
          lead={`Lo que dicen los usuarios de cada proveedor, en reseñas que modera nuestro equipo, y el enlace al registro oficial de consumo de ${meta.name}.`}
          meta={<span>Registro oficial de consumo: {registryLink}</span>}
        />

        <Section
          id="proveedores"
          title={`Proveedores de ${meta.name}`}
          lead="Ordenados por reseñas de usuarios. Quienes aún no tienen van después, en orden alfabético."
          density="tight"
        >
          {isLoading ? (
            <p className="t-body border-y-2 border-ink py-10 text-ink-2">Cargando proveedores…</p>
          ) : list.length === 0 ? (
            <p className="t-body max-w-[62ch] rounded-xl border border-rule bg-paper p-5 text-ink-2">
              Aún no hay proveedores verificados de {meta.name} en el directorio.
            </p>
          ) : (
            <ReputationList rows={list} countrySlug={slug} reviewLabel={firstReviewLabel(slug)} />
          )}
          <Callout tone="note" title="Por qué aquí no hay velocidad ni uptime" className="mt-10 max-w-3xl">
            <p>
              No publicamos benchmarks de velocidad de la web del proveedor. Medir el TTFB del sitio de marketing —que
              casi siempre está detrás de Cloudflare u otro CDN— no dice nada del servicio de hosting real que recibe el
              cliente. En su lugar mostramos reputación verificable: reseñas de usuarios y reclamos en registros oficiales
              de {meta.name}.
            </p>
          </Callout>
        </Section>

        <Section id="metodologia" tone="paper" title="Metodología" density="tight">
          <div className="grid gap-10 md:grid-cols-2">
            <div className="t-body space-y-3 text-ink-2">
              <p>
                La reputación se basa en dos fuentes verificables: (1) reseñas de usuarios aprobadas por nuestro equipo
                de moderación y (2) registros oficiales de reclamos del país. No hacemos benchmark de la web del
                proveedor porque su sitio de marketing suele estar detrás de un CDN (Cloudflare, Akamai) y no refleja el
                rendimiento del hosting real que recibe el cliente.
              </p>
              <p>
                Orden: primero proveedores con reseñas (promedio y luego número), después los que aún no tienen
                reseñas verificadas, en orden alfabético.
              </p>
            </div>
            <div>
              <h3 className="t-h3 text-ink">Registros oficiales de {meta.name}</h3>
              <p className="t-body mt-2 text-ink-2">
                Antes de contratar, {vos ? 'revisá' : 'revisa'} si el proveedor aparece con sanciones o reclamos formales
                en el registro público:
              </p>
              <p className="t-body mt-3">{registryLink}</p>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
};

export default CountryBenchmark;

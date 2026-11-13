import { isDofollowProvider } from '@/lib/providerLinks';
import React, { useState, useMemo } from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getActiveCountryCode } from '@/lib/country';
import ItemListSchema from '@/components/SEO/ItemListSchema';
import TrustSignalBadge from './TrustSignalBadge';
import RankingPositions4to10 from './RankingPositions4to10';
import RankingAuthorityBlock from './RankingAuthorityBlock';
import { getProviderLink, filterVisibleProviders } from '@/lib/providerLinks';
import { track } from '@/lib/track';
import { lookupHostDc } from './DatacenterBadge';
import { ProvenanceLegend, ProvenanceTag } from './data/Provenance';
import { formatCorporateGroup } from '@/lib/formatGroup';
import { VERIFICATION_DATE_HUMAN } from '@/data/verified2026';
import { useReviewStatsForSlug } from '@/hooks/useReviewStats';

// ── Types mapped to Supabase columns ────────────────────────────
interface RankingCompany {
  id: string;
  name: string;
  slug: string;
  website: string | null;
  logo_url: string | null;
  overall_rating: number;
  speed_rating: number;
  price_rating: number;
  is_independent: boolean | null;
  corporate_group: string | null;
  legal_name: string | null;
  foundation_year: number | null;
  ranking_position: number;
  is_recommended: boolean;
  ranking_features: string[];
  ranking_badges: string[];
  cta_text: string | null;
  cta_micro_copy: string | null;
  button_color: string | null;
  border_color: string | null;
  display_name_first: string | null;
  display_name_second: string | null;
  display_name_first_color: string | null;
  display_name_second_color: string | null;
  promo_price: number | null;
  original_price: number | null;
  price_period: string;
  updated_at?: string | null;
  // derived
  sortPosition: number;
}

// ── Fila del ranking (puestos 1 a 3) ───────────────────────────
interface RankingRowProps {
  provider: RankingCompany;
  ratingLabel: string;
  /** Qué nota muestra la cifra: general, velocidad o precio y valor. */
  metricLabel: string;
  isWinner: boolean;
}

const DC_TEXT: Record<string, string> = {
  certificado: 'Datacenter certificado',
  autodeclarado: 'Datacenter autodeclarado',
  extranjero: 'Infraestructura extranjera',
  no_divulga: 'No divulga datacenter',
};

const RankingRow: React.FC<RankingRowProps> = ({ provider, ratingLabel, metricLabel, isWinner }) => {
  const { data: userStats } = useReviewStatsForSlug(provider.slug);
  const dc = lookupHostDc(provider.name);
  const features = cleanFeatures(provider.ranking_features);
  const link = provider.slug && provider.website ? getProviderLink(provider.slug, provider.website) : null;
  const name = `${provider.display_name_first || provider.name}${provider.display_name_second || ''}`;

  return (
    <article
      className={`relative grid gap-x-8 gap-y-5 border-b border-rule py-8 md:grid-cols-[88px_minmax(0,1fr)_240px] ${
        isWinner ? 'md:-mx-4 md:rounded-lg md:border md:border-ink/15 md:bg-paper md:px-4' : ''
      }`}
      aria-label={`Puesto ${provider.sortPosition}: ${provider.name}`}
      itemScope
      itemType="https://schema.org/SoftwareApplication"
    >
      <meta itemProp="name" content={provider.name} />
      <meta itemProp="applicationCategory" content="Web Hosting Service" />
      <meta itemProp="operatingSystem" content="Linux" />

      {isWinner && <span className="absolute left-0 top-8 bottom-8 hidden w-1 rounded-r bg-brand md:block" aria-hidden />}

      <div className="flex items-center gap-4 md:block">
        <span
          className={`type-display block text-5xl tabular md:text-6xl ${isWinner ? 'text-brand' : 'text-ink-3'}`}
          aria-hidden
        >
          {provider.sortPosition}
        </span>
        <h3 className="text-2xl font-bold text-ink md:hidden">{name}</h3>
      </div>

      <div className="min-w-0">
        <h3 className="hidden text-[1.7rem] font-bold leading-tight text-ink md:block">{name}</h3>

        <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-2">
          {provider.corporate_group && (
            <div className="flex gap-1">
              <dt className="text-ink-3">Grupo:</dt>
              <dd>{formatCorporateGroup(provider.corporate_group)}</dd>
            </div>
          )}
          {dc && (
            <div className="flex gap-1">
              <dt className="sr-only">Datacenter:</dt>
              <dd>
                {DC_TEXT[dc.estado] ?? 'Datacenter'}
                {dc.operador && <span className="text-ink-3"> ({dc.operador})</span>}
              </dd>
            </div>
          )}
          <div>
            <dt className="sr-only">Verificación y reclamos:</dt>
            <dd><TrustSignalBadge companyId={provider.id} /></dd>
          </div>
        </dl>

        {features.length > 0 && (
          <ul className="mt-5 grid gap-x-6 gap-y-2 text-[15px] text-ink sm:grid-cols-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className={`mt-1 h-4 w-4 shrink-0 ${isWinner ? 'text-brand' : 'text-ok'}`} aria-hidden />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}

        {provider.ranking_badges?.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Distinciones editoriales">
            {provider.ranking_badges.map((badge, idx) => (
              <li key={idx} className="rounded border border-ink/15 bg-white px-2 py-0.5 text-xs font-medium text-ink-2">
                {badge}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col gap-3 md:items-end md:text-right">
        <div>
          <p className="flex items-baseline gap-1 md:justify-end">
            <span
              className="text-4xl font-bold text-ink tabular"
              itemProp="aggregateRating"
              itemScope
              itemType="https://schema.org/AggregateRating"
            >
              <meta itemProp="ratingValue" content={String(provider.overall_rating)} />
              <meta itemProp="bestRating" content="10" />
              <meta itemProp="ratingCount" content="1" />
              {ratingLabel.replace('/10', '').replace('.', ',')}
            </span>
            <span className="text-ink-3">/10</span>
          </p>
          <p className="mt-1 flex items-center gap-2 text-xs text-ink-2 md:justify-end">
            {metricLabel}
            <ProvenanceTag kind="editorial" />
          </p>
          {userStats && userStats.count > 0 && (
            <p className="mt-2 text-xs text-ink-2 tabular">
              Usuarios: {userStats.avg.toFixed(1).replace('.', ',')} de 5 en {userStats.count} reseña{userStats.count === 1 ? '' : 's'}
            </p>
          )}
        </div>

        {link && (
          <a
            href={link.href}
            target="_blank"
            rel={link.rel}
            referrerPolicy="no-referrer"
            onClick={() => track('click_visitar_sitio', { slug: provider.slug, location: 'ranking_top3', position: provider.ranking_position ?? undefined })}
            className={`inline-flex min-h-[48px] w-full items-center justify-center rounded-md px-5 text-base font-semibold md:w-auto md:min-w-[200px] ${
              isWinner ? 'bg-brand text-white hover:bg-brand-ink' : 'bg-ink text-white hover:bg-ink-soft'
            }`}
          >
            {cleanCtaText(provider.cta_text)}
          </a>
        )}
        {provider.cta_micro_copy && <p className="text-xs text-ink-3">{provider.cta_micro_copy}</p>}
        {provider.slug && (
          <Link
            to={`/catalogo/${provider.slug}`}
            className="text-sm font-semibold text-ink underline decoration-rule underline-offset-4 hover:decoration-ink"
            onClick={() => track('click_ver_ficha', { slug: provider.slug, location: 'ranking_top3' })}
          >
            Análisis completo de {provider.name}
          </Link>
        )}
        <p className="text-[11px] leading-snug text-ink-3">Enlace de afiliado: puede generarnos una comisión sin costo extra para ti.</p>
      </div>
    </article>
  );
};

// ── Esqueleto de carga ──────────────────────────────────────────
const RankingSkeleton = () => (
  <div aria-busy="true" aria-label="Cargando el ranking">
    {[1, 2, 3].map((i) => (
      <div key={i} className="grid gap-8 border-b border-rule py-8 md:grid-cols-[88px_minmax(0,1fr)_240px]">
        <span className="type-display text-6xl text-ink/15">{i}</span>
        <div className="space-y-3">
          <div className="h-7 w-1/3 animate-pulse rounded bg-paper-deep" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-paper-deep" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-paper-deep" />
        </div>
        <div className="h-12 animate-pulse rounded bg-paper-deep" />
      </div>
    ))}
  </div>
);

// ── Main Ranking Component ──────────────────────────────────────
/** Elimina de las features cualquier mención de antigüedad o cifra de precio (dato no verificado). */
const cleanFeatures = (features?: string[] | null) =>
  (features || []).filter((f) => !/años?\s+(operando|en el mercado)|\$\s?\d/i.test(f));

/** El cta_text de la BD puede traer precios interpolados; los retiramos. */
const cleanCtaText = (text?: string | null) => {
  const cleaned = (text || '')
    .replace(/\s*(desde|por)?\s*\$\s?[\d.,]+\s*(CLP)?\s*(\/\s*(mes|año)|mensuales?|al mes)?/gi, '')
    .replace(/\s+y\s+precios\s*$/i, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
  return cleaned || 'Ver planes';
};

const HostingRanking = () => {
  const [sortCriteria, setSortCriteria] = useState('overall');

  const { data: companies, isLoading } = useQuery({
    queryKey: ['ranking-companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hosting_companies')
        .select('id, name, slug, website, logo_url, overall_rating, speed_rating, price_rating, is_independent, corporate_group, legal_name, foundation_year, ranking_position, is_recommended, ranking_features, ranking_badges, cta_text, cta_micro_copy, button_color, border_color, display_name_first, display_name_second, display_name_first_color, display_name_second_color, promo_price, original_price, price_period, updated_at')
        .eq('country', getActiveCountryCode())
        .eq('is_verified', true)
        .not('ranking_position', 'is', null)
        .order('ranking_position');

      if (error) throw error;
      return data as unknown as Omit<RankingCompany, 'sortPosition'>[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const sortedHostingData = useMemo(() => {
    if (!companies) return [];
    const sorted = filterVisibleProviders([...companies]);

    switch (sortCriteria) {
      case 'speed':
        sorted.sort((a, b) => (b.speed_rating ?? 0) - (a.speed_rating ?? 0));
        break;
      case 'price':
        sorted.sort((a, b) => (b.price_rating ?? 0) - (a.price_rating ?? 0));
        break;
      default:
        // Orden editorial: ranking_position (DB) primero; empate → overall_rating desc
        sorted.sort((a, b) => {
          const ap = a.ranking_position ?? 9999;
          const bp = b.ranking_position ?? 9999;
          if (ap !== bp) return ap - bp;
          return (b.overall_rating ?? 0) - (a.overall_rating ?? 0);
        });
        break;
    }

    return sorted.map((c, index) => ({ ...c, sortPosition: index + 1 }));
  }, [companies, sortCriteria]);

  const getRatingLabel = (provider: Omit<RankingCompany, 'sortPosition'>) => {
    switch (sortCriteria) {
      case 'speed':
        return `${provider.speed_rating ?? 0}/10`;
      case 'price':
        return `${provider.price_rating ?? 0}/10`;
      default:
        return `${provider.overall_rating ?? 0}/10`;
    }
  };

  const getSchemaItems = () =>
    sortedHostingData.map((provider) => ({
      name: provider.name,
      description: cleanFeatures(provider.ranking_features).join('. '),
      url: isDofollowProvider(provider.slug, provider.website) ? (provider.website || '') : '',
      image: `https://eligetuhosting.cl${provider.logo_url || ''}`,
      brand: provider.name,
      rating: provider.overall_rating ?? 0,
      reviewCount: 1,
    }));

  const sortOptions: { value: string; label: string }[] = [
    { value: 'overall', label: 'General' },
    { value: 'speed', label: 'Velocidad' },
    { value: 'price', label: 'Precio y valor' },
  ];
  const metricLabel =
    sortCriteria === 'speed' ? 'Nota de velocidad' : sortCriteria === 'price' ? 'Nota de precio y valor' : 'Nota general';

  return (
    <section id="ranking" className="scroll-mt-20 bg-white">
      <div className="container mx-auto px-4 py-14">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <h2 className="type-wide text-3xl font-bold text-ink md:text-4xl">Ranking de hosting en Chile 2026</h2>
            <p className="mt-2 max-w-[60ch] text-ink-2">
              Ranking editorial con pesos publicados: velocidad, uptime, soporte y reputación. Última revisión:{' '}
              {VERIFICATION_DATE_HUMAN}.
            </p>
          </div>
          <div className="md:col-span-5 md:flex md:justify-end">
            <div role="tablist" aria-label="Ordenar el ranking por" className="inline-flex rounded-md border border-ink/20 bg-white p-1">
              {sortOptions.map((opt) => {
                const active = sortCriteria === opt.value;
                return (
                  <button
                    key={opt.value}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSortCriteria(opt.value)}
                    className={`min-h-[40px] rounded px-4 text-sm font-semibold transition-colors ${
                      active ? 'bg-ink text-white' : 'text-ink-2 hover:text-ink'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <RankingAuthorityBlock
          className="mt-6"
        />

        {/* Las etiquetas solo se explicaban al pasar el mouse: aquí, también al tocar. */}
        <details className="mt-4 rounded-lg border border-rule bg-white px-4 py-3 text-sm">
          <summary className="cursor-pointer font-semibold text-ink">
            Qué significan las etiquetas Medido, Declarado y Editorial
          </summary>
          <ProvenanceLegend compact className="mt-4" />
        </details>

        {!isLoading && sortedHostingData.length > 0 && (
          <ItemListSchema
            name="Ranking Mejores Hosting Chile 2026"
            description="Ranking editorial de proveedores de hosting en Chile, con metodología y pesos publicados: velocidad, uptime, soporte y reputación"
            items={getSchemaItems()}
            listType="ranking"
          />
        )}

        <div className="mt-6 border-t-2 border-ink">
          {isLoading ? (
            <RankingSkeleton />
          ) : (
            <ol className="m-0 list-none p-0" aria-label="Ranking de los mejores hostings en Chile 2026">
              {sortedHostingData.slice(0, 3).map((provider) => (
                <li key={provider.id}>
                  <RankingRow
                    provider={provider}
                    ratingLabel={getRatingLabel(provider)}
                    metricLabel={metricLabel}
                    isWinner={provider.sortPosition === 1}
                  />
                </li>
              ))}
            </ol>
          )}
        </div>

        {sortCriteria !== 'overall' && (
          <p className="mt-6 text-sm text-ink-2">
            El orden por {sortCriteria === 'speed' ? 'velocidad' : 'precio y valor'} se aplica a los tres primeros. Los
            puestos siguientes mantienen el orden general.
          </p>
        )}
        <RankingPositions4to10 />

        <div className="mt-10 flex flex-col items-start gap-2 border-t border-rule pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-ink-2">El ranking completo incluye fichas, comparativas y el detalle de cada nota.</p>
          <Link
            to="/ranking"
            className="inline-flex min-h-[44px] items-center rounded-md border border-ink/25 px-4 font-semibold text-ink hover:border-ink"
            onClick={() => track('cta_ver_ranking', { location: 'home_more' })}
          >
            Ver el ranking completo
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HostingRanking;

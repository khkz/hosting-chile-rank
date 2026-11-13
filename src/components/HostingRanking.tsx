import { isDofollowProvider } from '@/lib/providerLinks';
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getActiveCountryCode } from '@/lib/country';
import ItemListSchema from '@/components/SEO/ItemListSchema';
import RankingPositions4to10 from './RankingPositions4to10';
import RankingAuthorityBlock from './RankingAuthorityBlock';
import { filterVisibleProviders } from '@/lib/providerLinks';
import { track } from '@/lib/track';
import { ProvenanceLegend } from './data/Provenance';
import RankingRow, { type RankingCompany } from './ranking/RankingRow';
import { cleanFeatures } from './ranking/rankingText';
import { VERIFICATION_DATE_HUMAN } from '@/data/verified2026';

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

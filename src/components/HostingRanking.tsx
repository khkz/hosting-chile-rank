import { isDofollowProvider } from '@/lib/providerLinks';
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getActiveCountryCode } from '@/lib/country';
import ItemListSchema from '@/components/SEO/ItemListSchema';
import RankingPositions4to10 from './RankingPositions4to10';
import { RankingDisclosure, WhyFirstAccordion } from './RankingAuthorityBlock';
import { filterVisibleProviders } from '@/lib/providerLinks';
import { track } from '@/lib/track';
import { PROVENANCE, ProvenanceTag, type Provenance } from './data/Provenance';
import { Button } from '@/components/ui/button';
import RankingRow, { type RankingCompany } from './ranking/RankingRow';
import { cleanFeatures } from './ranking/rankingText';

// ── Esqueleto de carga (sin animación) ──────────────────────────
const RankingSkeleton = () => (
  <div aria-busy="true" aria-label="Cargando el ranking">
    {[1, 2, 3].map((i) => (
      <div key={i} className="grid gap-8 border-b border-rule py-8 lg:grid-cols-[88px_minmax(0,1fr)_248px]">
        <span className="type-display text-6xl text-ink/15">{i}</span>
        <div className="space-y-3">
          <div className="h-7 w-1/3 rounded-sm bg-paper-deep" />
          <div className="h-4 w-2/3 rounded-sm bg-paper-deep" />
          <div className="h-4 w-1/2 rounded-sm bg-paper-deep" />
        </div>
        <div className="h-12 rounded-lg bg-paper-deep" />
      </div>
    ))}
  </div>
);

/** Leyenda de procedencia en una fila: etiqueta y lectura breve (la descripción completa va en el title). */
const ProvenanceKey = () => (
  <dl className="flex flex-wrap items-center gap-x-5 gap-y-2">
    {(['measured', 'declared', 'editorial'] as Provenance[]).map((k) => (
      <div key={k} className="flex items-center gap-2">
        <dt>
          <ProvenanceTag kind={k} />
        </dt>
        <dd className="t-meta">{PROVENANCE[k].spoken}</dd>
      </div>
    ))}
  </dl>
);

type SortKey = 'overall' | 'speed' | 'price';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'overall', label: 'General' },
  { value: 'speed', label: 'Velocidad' },
  { value: 'price', label: 'Precio y valor' },
];

// ── Main Ranking Component ──────────────────────────────────────
const HostingRanking = () => {
  const [sortCriteria, setSortCriteria] = useState<SortKey>('overall');

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
        // Orden editorial: ranking_position (DB) primero; en empate, overall_rating descendente
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

  // Sin nota en la base se muestra «—», nunca un cero de relleno.
  const getRatingLabel = (provider: Omit<RankingCompany, 'sortPosition'>) => {
    const value =
      sortCriteria === 'speed' ? provider.speed_rating : sortCriteria === 'price' ? provider.price_rating : provider.overall_rating;
    return value != null ? `${value}/10` : '—';
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

  const metricLabel =
    sortCriteria === 'speed' ? 'Nota de velocidad' : sortCriteria === 'price' ? 'Nota de precio y valor' : 'Nota general';

  return (
    <section id="ranking" aria-labelledby="ranking-titulo" className="bg-white">
      <div className="container pb-14 pt-8 md:pb-20">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8">
          {/* tabIndex -1: «Ver el ranking» del hero deja aquí el foco. */}
          <h2 id="ranking-titulo" tabIndex={-1} className="t-h2 text-ink focus:outline-none">
            Ranking de hosting en Chile 2026
          </h2>
          <div className="flex shrink-0 flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
            <p id="ranking-orden" className="t-meta">
              Ordenar los 3 primeros por
            </p>
            <div role="group" aria-labelledby="ranking-orden" className="inline-flex w-full rounded-lg border border-rule bg-white p-1 sm:w-auto">
              {SORT_OPTIONS.map((opt) => {
                const active = sortCriteria === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSortCriteria(opt.value)}
                    className={`min-h-[44px] flex-1 whitespace-nowrap rounded-sm px-2 text-sm font-semibold transition-colors sm:flex-none sm:px-3.5 md:min-h-[36px] ${
                      active ? 'bg-ink text-white' : 'text-ink-2 hover:bg-paper hover:text-ink'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        <RankingDisclosure className="mt-3" />
        <div className="mt-3 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <p className="text-base text-ink-2 md:text-sm">Criterios: velocidad, uptime, soporte y reputación.</p>
          <ProvenanceKey />
        </div>

        {!isLoading && sortedHostingData.length > 0 && (
          <ItemListSchema
            name="Ranking Mejores Hosting Chile 2026"
            description="Ranking editorial de proveedores de hosting en Chile, con metodología y pesos publicados: velocidad, uptime, soporte y reputación"
            items={getSchemaItems()}
            listType="ranking"
          />
        )}

        <div className="mt-4 border-t-2 border-ink">
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
          <p className="mt-4 text-base text-ink-2 md:text-sm">
            El orden por {sortCriteria === 'speed' ? 'velocidad' : 'precio y valor'} se aplica a los tres primeros. Los
            puestos siguientes mantienen el orden general.
          </p>
        )}

        <WhyFirstAccordion className="mt-6" />

        <RankingPositions4to10 />

        <div className="mt-10 flex flex-col items-start gap-3 border-t border-rule pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-base text-ink-2">El ranking completo incluye fichas, comparativas y el detalle de cada nota.</p>
          <Button asChild variant="outline">
            <Link to="/ranking" onClick={() => track('cta_ver_ranking', { location: 'home_more' })}>
              Ver el ranking completo
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HostingRanking;

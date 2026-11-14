import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProvenanceTag } from '@/components/data/Provenance';
import ScoreValue from '@/components/hubs/ScoreValue';
import { cleanFeatures } from '@/components/ranking/rankingText';
import { getProviderLink } from '@/lib/providerLinks';
import { useRankingProviders } from '@/features/ranking';
import { cn } from '@/lib/utils';

/**
 * Los tres primeros puestos de /ranking. Mismo dato que el ranking de la
 * portada (useRankingProviders); cada nota lleva su procedencia y el rojo
 * marca solo el puesto 1.
 */
const TopProvidersPodium: React.FC = () => {
  const { data, isLoading, isError } = useRankingProviders(3);
  const providers = (data ?? []).filter((provider) => provider.overall_rating != null);

  if (isLoading && !data) {
    return (
      <div className="grid gap-4 lg:grid-cols-3" aria-busy="true" aria-label="Cargando los tres primeros puestos">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-72 rounded-xl border border-rule bg-paper" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p role="alert" className="rounded-xl border border-rule bg-paper p-4 text-ink-2">
        No pudimos cargar los tres primeros puestos: la consulta a nuestra base no respondió. Recarga la página en unos
        minutos.
      </p>
    );
  }

  if (providers.length === 0) {
    return (
      <p className="rounded-xl border border-rule bg-paper p-4 text-ink-2">
        Todavía no hay notas publicadas para estos puestos. Mientras tanto, revisa cómo evaluamos en la{' '}
        <Link to="/metodologia" className="font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
          metodología
        </Link>
        .
      </p>
    );
  }

  return (
    <ol className="grid gap-4 lg:grid-cols-3" aria-label="Los tres primeros puestos del ranking">
      {providers.map((provider, index) => {
        const rank = index + 1;
        const first = rank === 1;
        const link = getProviderLink(provider.slug, provider.website || '');
        const features = cleanFeatures(provider.ranking_features).slice(0, 4);
        return (
          <li key={provider.slug} className="min-w-0">
            <article
              className="relative flex h-full flex-col rounded-xl border border-rule bg-white p-5 md:p-6"
              aria-label={`Puesto ${rank}: ${provider.name}`}
            >
              {first && <span aria-hidden className="absolute bottom-5 left-0 top-5 w-1 rounded-r bg-brand" />}
              <header className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className={cn('text-[13px] font-semibold leading-snug tabular', first ? 'text-brand-ink' : 'text-ink-3')}>
                    <span className="sr-only">Puesto </span>#{rank}
                  </p>
                  <h3 className="t-h3 mt-0.5 break-words text-ink">{provider.name}</h3>
                </div>
                <div className="shrink-0 text-right">
                  <ScoreValue value={provider.overall_rating} size="lg" />
                  <div className="mt-1.5 flex justify-end">
                    <ProvenanceTag kind="editorial" />
                  </div>
                </div>
              </header>

              {features.length > 0 && (
                <ul className="mt-5 space-y-2 border-t border-rule pt-4 text-[15px] text-ink">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-ink-3" aria-hidden />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-auto flex flex-col gap-2 pt-6">
                <Button asChild variant={first ? 'brand' : 'default'} className="w-full">
                  <a href={link.href} target="_blank" rel={link.rel}>
                    Ir al sitio<span className="sr-only"> de {provider.name}</span>
                    <ExternalLink aria-hidden />
                  </a>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/catalogo/${provider.slug}`}>
                    Ver ficha<span className="sr-only"> de {provider.name}</span>
                  </Link>
                </Button>
              </div>
            </article>
          </li>
        );
      })}
    </ol>
  );
};

export default TopProvidersPodium;

import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getProviderLink } from '@/lib/providerLinks';
import { useRankingProviders, type RankingProvider } from '@/hooks/useRankingProviders';

/**
 * Respaldo SOLO si la base no devuelve un podio completo (3 proveedores con
 * nota). Mantiene el orden vigente para no dejar la página en blanco.
 */
const FALLBACK: RankingProvider[] = [
  {
    id: 'fallback-1',
    slug: 'hostingplus',
    name: 'HostingPlus.cl',
    logo_url: null,
    website: 'https://www.hostingplus.cl/',
    overall_rating: null,
    ranking_position: 1,
    ranking_features: [],
  },
  {
    id: 'fallback-2',
    slug: 'ecohosting',
    name: 'EcoHosting.cl',
    logo_url: null,
    website: 'https://www.ecohosting.cl/',
    overall_rating: null,
    ranking_position: 2,
    ranking_features: [],
  },
  {
    id: 'fallback-3',
    slug: 'hn',
    name: 'HN.cl',
    logo_url: null,
    website: 'https://www.hn.cl',
    overall_rating: null,
    ranking_position: 3,
    ranking_features: [],
  },
];

const TopProvidersPodium: React.FC = () => {
  const { data, isLoading } = useRankingProviders(3);

  const fromData = (data ?? []).filter((p) => p.overall_rating != null);
  const usingFallback = fromData.length < 3;
  const providers = usingFallback ? FALLBACK : fromData;

  if (isLoading && !data) {
    return (
      <div className="grid md:grid-cols-3 gap-6" aria-busy="true">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-6 h-64 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid md:grid-cols-3 gap-6">
        {providers.map((provider, index) => {
          const link = getProviderLink(provider.slug, provider.website || '');
          return (
            <div
              key={provider.slug}
              className={`bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ${
                index === 0 ? 'ring-2 ring-[#EF233C] transform md:scale-105' : 'hover:scale-105'
              }`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold flex-shrink-0 ${
                        index === 0 ? 'bg-[#EF233C] text-white' : 'bg-gray-100 text-[#2B2D42]'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <h3 className="text-lg md:text-xl font-bold text-[#2B2D42] truncate">
                      {provider.name}
                    </h3>
                  </div>
                  {index === 0 && <Badge className="bg-[#EF233C] text-white flex-shrink-0">Top</Badge>}
                </div>

                <div className="flex flex-wrap gap-2 mb-3 items-center">
                  <span className="inline-flex items-center bg-primary/10 text-primary font-bold px-2 py-1 rounded text-sm">
                    {provider.overall_rating != null ? `${provider.overall_rating.toFixed(1)}/10` : 'sin medir'}
                  </span>
                  <Badge variant="secondary" className="bg-slate-100 rounded-full px-3 text-xs">
                    Consultar
                  </Badge>
                </div>

                {provider.ranking_features.length > 0 && (
                  <ul className="mb-6 text-sm space-y-2">
                    {provider.ranking_features.slice(0, 4).map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-green-500 mr-1.5 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="space-y-2">
                  <Button asChild variant="outline" className="w-full font-semibold py-3 rounded-lg min-h-[44px]">
                    <Link to={`/catalogo/${provider.slug}`}>Ver detalles</Link>
                  </Button>
                  <Button
                    asChild
                    className={`w-full font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 min-h-[44px] ${
                      index === 0
                        ? 'bg-[#EF233C] hover:bg-[#d01d34] text-white'
                        : 'bg-[#2B2D42] hover:bg-[#1a1c2e] text-white'
                    }`}
                  >
                    <a href={link.href} target="_blank" rel={link.rel} className="flex items-center justify-center">
                      Visitar sitio
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {usingFallback && (
        <p className="mt-4 text-xs text-muted-foreground text-center">
          Mostrando el orden de respaldo: la base de datos no devolvió tres proveedores con nota. Las
          notas aparecen como "sin medir" hasta que el dato esté disponible.
        </p>
      )}
    </>
  );
};

export default TopProvidersPodium;

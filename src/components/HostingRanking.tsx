import React, { useState, useMemo } from 'react';
import { Trophy, Check, Star, Shield, Zap, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import ItemListSchema from '@/components/SEO/ItemListSchema';
import AvailabilityBadge from './AvailabilityBadge';
import IndependenceBadge from './IndependenceBadge';
import { rankingProviders, RankingProvider } from '@/data/rankingProviders';

// ── Reusable card for any position ──────────────────────────────
interface RankingCardProps {
  provider: RankingProvider & { sortPosition: number };
  ratingLabel: string;
  isWinner: boolean;
}

const RankingCard: React.FC<RankingCardProps> = ({ provider, ratingLabel, isWinner }) => {
  const borderClass = isWinner ? `border-4 ${provider.borderColor}` : 'border-2 border-border';
  const numberSize = isWinner ? 'w-16 h-16 text-2xl md:w-20 md:h-20 md:text-3xl' : 'w-14 h-14 text-xl md:w-16 md:h-16 md:text-2xl';
  const numberBg = isWinner
    ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
    : provider.sortPosition === 2
      ? 'bg-gradient-to-br from-gray-400 to-gray-500'
      : 'bg-gradient-to-br from-amber-600 to-amber-700';

  const badgeGradient = isWinner
    ? 'from-[#EF233C] to-pink-500 text-white'
    : provider.sortPosition === 2
      ? 'from-gray-100 to-gray-200 text-gray-700'
      : 'from-amber-100 to-orange-200 text-amber-700';

  const ratingColor = isWinner ? 'text-[#EF233C]' : provider.sortPosition === 2 ? 'text-gray-600' : 'text-amber-600';

  return (
    <article
      className="w-full"
      aria-label={`Posición ${provider.sortPosition}: ${provider.name}`}
      itemScope
      itemType="https://schema.org/SoftwareApplication"
    >
      <meta itemProp="name" content={provider.name} />
      <meta itemProp="applicationCategory" content="Web Hosting Service" />
      <meta itemProp="operatingSystem" content="Linux" />

      {/* Position number */}
      <div className="relative text-center pb-4">
        <div className="inline-flex items-center justify-center">
          <div className="relative">
            <span className={`inline-flex items-center justify-center ${numberSize} ${numberBg} text-white rounded-full shadow-2xl font-black border-4 border-background`}>
              {provider.sortPosition}
            </span>
            {isWinner && <Trophy className="w-6 h-6 md:w-8 md:h-8 text-yellow-500 absolute -top-2 -right-6 md:-right-8" />}
          </div>
        </div>
        {isWinner && provider.isRecommended && (
          <div className="mt-2 flex justify-center">
            <span className="bg-gradient-to-r from-[#EF233C] to-pink-500 text-white text-xs md:text-sm px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
              <Check size={14} /> Más Recomendado
            </span>
          </div>
        )}
      </div>

      {/* Card */}
      <div className={`relative bg-card ${borderClass} rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300`}>
        {isWinner && <div className="absolute inset-0 bg-gradient-to-br from-[#EF233C]/5 to-transparent rounded-3xl pointer-events-none" />}

        {/* Top badges */}
        <div className="absolute -top-3 left-3 flex flex-wrap gap-1.5 z-20">
          {provider.badges?.map((badge, idx) => (
            <span key={idx} className={`px-2.5 py-1 bg-gradient-to-r ${badgeGradient} text-[10px] md:text-xs font-medium rounded-full ${isWinner ? 'shadow-lg' : ''}`}>
              {badge}
            </span>
          ))}
        </div>

        <div className="p-5 md:p-6 lg:p-8 pt-10 md:pt-12 relative">
          {/* Header */}
          <div className="text-center mb-4">
            <h3 className={`${isWinner ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'} font-bold mb-2`}>
              <span className={provider.displayName.firstColor}>{provider.displayName.first}</span>
              <span className={provider.displayName.secondColor}>{provider.displayName.second}</span>
            </h3>

            {/* Independence Badge — reads from data model */}
            <div className="flex justify-center mb-2">
              <IndependenceBadge
                isIndependent={provider.isIndependent}
                corporateGroup={provider.corporateGroup}
                legalName={provider.legalName}
              />
            </div>

            {/* Urgency badge */}
            <div className="flex justify-center mb-3">
              <AvailabilityBadge providerName={provider.name} offerType={isWinner ? 'trial' : provider.sortPosition === 3 ? 'migration' : 'trial'} />
            </div>

            {/* Rating */}
            <div className="flex items-center justify-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`${isWinner ? 'w-5 h-5' : 'w-4 h-4'} fill-yellow-400 text-yellow-400`} />
                ))}
              </div>
              <span
                className={`${isWinner ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'} font-bold ${ratingColor}`}
                itemProp="aggregateRating"
                itemScope
                itemType="https://schema.org/AggregateRating"
              >
                <meta itemProp="ratingValue" content={String(provider.rating)} />
                <meta itemProp="bestRating" content="10" />
                <meta itemProp="ratingCount" content="1" />
                {ratingLabel}
              </span>
            </div>
          </div>

          {/* Features */}
          <ul className="space-y-2 mb-4 text-sm">
            {provider.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className={`w-4 h-4 ${isWinner ? 'text-[#EF233C]' : 'text-green-500'} mt-0.5 flex-shrink-0`} />
                <span className="text-muted-foreground font-medium">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Pricing */}
          {provider.price && (
            <div className="mb-5 text-center" itemProp="offers" itemScope itemType="https://schema.org/Offer">
              <meta itemProp="priceCurrency" content="CLP" />
              <meta itemProp="price" content={String(provider.price.current)} />
              <meta itemProp="availability" content="https://schema.org/InStock" />
              <link itemProp="url" href={provider.url} />
              <div className="flex items-baseline justify-center gap-2">
                {provider.price.original && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${provider.price.original.toLocaleString('es-CL')}
                  </span>
                )}
                <span className={`${isWinner ? 'text-4xl' : 'text-3xl'} font-bold text-foreground`}>
                  ${provider.price.current.toLocaleString('es-CL')}
                </span>
                <span className="text-sm text-muted-foreground">/{provider.price.period}</span>
              </div>
              {provider.price.original && (
                <p className="text-xs font-semibold text-green-600 mt-1">
                  Ahorras {Math.round((1 - provider.price.current / provider.price.original) * 100)}%
                </p>
              )}
            </div>
          )}

          {/* CTA — MASSIVE on mobile for touch conversion */}
          <div className="space-y-2">
            <Button
              asChild
              className={`w-full ${provider.buttonColor} hover:opacity-90 text-white py-6 text-lg font-bold rounded-xl shadow-2xl hover:shadow-xl transition-all duration-300 min-h-[56px] touch-manipulation`}
            >
              <a href={provider.url} target="_blank" rel="noopener noreferrer">
                {provider.ctaText || 'Ver Oferta'}
              </a>
            </Button>
            {provider.ctaMicroCopy && (
              <p className="text-xs text-center text-muted-foreground">
                {provider.ctaMicroCopy}
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

// ── Main Ranking Component ──────────────────────────────────────
const HostingRanking = () => {
  const [sortCriteria, setSortCriteria] = useState('overall');

  const sortedHostingData = useMemo(() => {
    const sortedData = [...rankingProviders];

    switch (sortCriteria) {
      case 'speed':
        sortedData.sort((a, b) => b.speedRating - a.speedRating);
        break;
      case 'price':
        sortedData.sort((a, b) => b.priceRating - a.priceRating);
        break;
      default:
        sortedData.sort((a, b) => b.rating - a.rating);
        break;
    }

    return sortedData.map((provider, index) => ({
      ...provider,
      sortPosition: index + 1,
    }));
  }, [sortCriteria]);

  const getRatingLabel = (provider: RankingProvider) => {
    switch (sortCriteria) {
      case 'speed':
        return `${provider.speedRating}/10`;
      case 'price':
        return `${provider.priceRating}/10`;
      default:
        return `${provider.rating}/10`;
    }
  };

  const getSchemaItems = () =>
    sortedHostingData.map((provider) => ({
      name: provider.name,
      description: provider.features.join('. '),
      url: provider.url,
      image: `https://eligetuhosting.cl${provider.logo}`,
      brand: provider.name,
      rating: provider.rating,
      reviewCount: 1,
      price: provider.price.current,
      priceCurrency: 'CLP',
    }));

  return (
    <section id="ranking" className="py-10 md:py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
            Top 3 Mejores Hostings Chile
          </h2>
          <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Ranking independiente basado en pruebas técnicas reales de velocidad, uptime y soporte
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#EF233C] to-pink-400 mx-auto mt-5 rounded-full" />
        </div>

        <ItemListSchema
          name="Ranking Mejores Hosting Chile 2026"
          description="Ranking independiente de los mejores proveedores de hosting en Chile basado en pruebas técnicas de velocidad, uptime y soporte"
          items={getSchemaItems()}
          listType="ranking"
        />

        {/* Sort Controls */}
        <div className="flex justify-center mb-8 md:mb-12">
          <ToggleGroup
            type="single"
            value={sortCriteria}
            onValueChange={(value) => value && setSortCriteria(value)}
            className="bg-card rounded-2xl p-1.5 shadow-lg border border-border"
          >
            <ToggleGroupItem
              value="overall"
              variant="outline"
              className={`px-4 md:px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 min-h-[44px] touch-manipulation ${
                sortCriteria === 'overall' ? 'bg-foreground text-background shadow-lg' : 'hover:bg-muted'
              }`}
            >
              <Award className="w-4 h-4 mr-1.5" />
              General
            </ToggleGroupItem>
            <ToggleGroupItem
              value="speed"
              variant="outline"
              className={`px-4 md:px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 min-h-[44px] touch-manipulation ${
                sortCriteria === 'speed' ? 'bg-foreground text-background shadow-lg' : 'hover:bg-muted'
              }`}
            >
              <Zap className="w-4 h-4 mr-1.5" />
              Velocidad
            </ToggleGroupItem>
            <ToggleGroupItem
              value="price"
              variant="outline"
              className={`px-4 md:px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 min-h-[44px] touch-manipulation ${
                sortCriteria === 'price' ? 'bg-foreground text-background shadow-lg' : 'hover:bg-muted'
              }`}
            >
              <Shield className="w-4 h-4 mr-1.5" />
              Precio
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* ── Cards: flex-col on mobile, row on desktop ── */}
        <ol className="flex flex-col md:flex-row md:items-end md:justify-center gap-6 md:gap-8 max-w-6xl mx-auto mb-12 list-none p-0 m-0" aria-label="Ranking de los mejores hostings en Chile 2026">
          {sortedHostingData.map((provider) => (
            <li key={provider.name} className={`w-full md:w-1/3 ${provider.sortPosition === 1 ? 'md:order-2 md:z-10' : provider.sortPosition === 2 ? 'md:order-1' : 'md:order-3'}`}>
              <RankingCard
                provider={provider}
                ratingLabel={getRatingLabel(provider)}
                isWinner={provider.sortPosition === 1}
              />
            </li>
          ))}
        </ol>

        {/* More Providers Link */}
        <div className="text-center">
          <div className="inline-block bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
            <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3">
              ¿Necesitas más opciones?
            </h3>
            <p className="text-muted-foreground mb-4 text-sm md:text-base">
              Revisa nuestro ranking completo con 9 proveedores analizados
            </p>
            <Link
              to="/ranking"
              className="inline-flex items-center gap-2 text-[#EF233C] hover:text-[#b3001b] font-semibold text-base md:text-lg transition-colors duration-300 group"
            >
              Ver ranking completo
              <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HostingRanking;


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import ContextualLinks from './ContextualLinks';

interface HostingCardProps {
  position: number;
  name: string;
  logo: string;
  rating: number;
  features: string[];
  url: string;
  isPodium?: boolean;
  isTopRated?: boolean;
  isRecommended?: boolean;
  specs?: string[];
  price?: string;
  originalPrice?: string;
  ctaText?: string;
  ctaMicroCopy?: string;
  companySlug?: string;
  showContextualLinks?: boolean;
}

const HostingCard: React.FC<HostingCardProps> = ({ 
  position, 
  name, 
  logo, 
  rating, 
  features, 
  url,
  isPodium = false,
  isTopRated = false,
  isRecommended = false,
  specs = [],
  price,
  originalPrice,
  ctaText = 'Visitar Hosting',
  ctaMicroCopy = '✓ Sin tarjeta ✓ Cancela cuando quieras',
  companySlug,
  showContextualLinks = true,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Determine styling based on position
  let positionColor = '';
  let cardBg = '';
  let shadowClass = 'shadow-lg';
  
  if (isPodium) {
    // Special styling for podium positions
    switch (position) {
      case 1:
        positionColor = 'text-[#FFD700]'; // Gold
        cardBg = 'bg-[#EDF2F4] border-2 border-[#EF233C]';
        shadowClass = 'shadow-xl';
        break;
      case 2:
        positionColor = 'text-[#C0C0C0]'; // Silver
        cardBg = 'bg-white border border-[#C0C0C0]';
        break;
      case 3:
        positionColor = 'text-[#CD7F32]'; // Bronze
        cardBg = 'bg-white border border-[#CD7F32]';
        break;
      default:
        positionColor = 'text-[#2B2D42]';
        cardBg = 'bg-white';
    }
  } else {
    positionColor = 'text-[#2B2D42]';
    cardBg = 'bg-white';
  }

  return (
    <Card 
      className={`${shadowClass} rounded-2xl p-6 transition-transform hover:-translate-y-1 ${cardBg}`}
    >
      <div className="flex items-center mb-4">
        {!isPodium && (
          <span className={`text-4xl font-black ${isTopRated ? 'text-[#EF233C]' : positionColor}`}>
            {position}
          </span>
        )}
        <div className={`${!isPodium ? 'w-32 h-12 ml-4' : 'w-full h-16'}`}>
          <AspectRatio ratio={2.5/1} className="bg-white rounded">
            <img 
              src={logo} 
              alt={name} 
              className="h-full w-full object-contain p-1" 
              loading="lazy" 
            />
          </AspectRatio>
        </div>
      </div>
      {/* Collapsed View - Just essentials */}
      <div className="mb-4">
        <h3 className="text-2xl font-semibold text-foreground">
          {name} <span className="font-bold text-primary">★ {rating}/10</span>
        </h3>
        
        {/* Pricing always visible */}
        {(price || originalPrice) && (
          <div className="mt-3 flex items-baseline gap-2">
            {originalPrice && (
              <span className="text-lg text-muted-foreground line-through">
                {originalPrice}
              </span>
            )}
            {price && (
              <span className="text-2xl font-bold text-foreground">
                {price}
              </span>
            )}
            {originalPrice && price && (
              <span className="text-sm font-semibold text-primary">
                Ahorras {Math.round((1 - parseInt(price.replace(/[^\d]/g, '')) / parseInt(originalPrice.replace(/[^\d]/g, ''))) * 100)}%
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* Toggle details button */}
      <Button 
        variant="outline"
        onClick={() => setShowDetails(!showDetails)}
        className="w-full mb-3 text-sm justify-between min-h-[44px] touch-manipulation"
      >
        {showDetails ? 'Ocultar detalles' : 'Ver características y especificaciones'}
        {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </Button>
      
      {/* Expandable content */}
      {showDetails && (
        <div className="space-y-4 mb-4 animate-accordion-down">
          {/* Features */}
          {features && features.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Características principales</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Specs */}
          {specs && specs.length > 0 && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <h4 className="text-sm font-semibold text-foreground mb-2">Especificaciones técnicas</h4>
              <ul className="space-y-2">
                {specs.map((spec, index) => (
                  <li key={index} className="text-sm flex items-center">
                    <Check size={16} className="text-primary mr-2 flex-shrink-0" /> {spec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      {/* CTA Section */}
      <div className="space-y-2">
        <Button 
          asChild
          className={`inline-block ${isTopRated ? 'cta-primary' : 'cta-secondary'} w-full justify-center min-h-[44px] touch-manipulation text-base`}
        >
          <a href={url} target="_blank" rel="nofollow sponsored noopener noreferrer">
            {ctaText}
          </a>
        </Button>
        {ctaMicroCopy && (
          <p className="text-xs text-center text-muted-foreground">
            {ctaMicroCopy}
          </p>
        )}
      </div>
      
      {/* Contextual Links */}
      {showContextualLinks && companySlug && (
        <ContextualLinks 
          companySlug={companySlug}
          companyName={name}
        />
      )}
    </Card>
  );
};

export default HostingCard;

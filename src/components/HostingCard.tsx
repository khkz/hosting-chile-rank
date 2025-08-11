
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';

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
  specs = []
}) => {
  const [showSpecs, setShowSpecs] = useState(false);
  
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
      <h3 className="text-2xl font-semibold text-[#2B2D42]">
        {name} <span className="font-bold">★ {rating}/10</span>
      </h3>
      <ul className="list-disc list-inside mt-4 text-sm text-[#555] space-y-1">
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
      
      {/* Toggle specs button */}
      {specs && specs.length > 0 && (
        <Button 
          variant="outline"
          onClick={() => setShowSpecs(!showSpecs)}
          className="w-full mt-4 text-sm justify-between"
        >
          {showSpecs ? 'Ocultar especificaciones' : 'Ver especificaciones'}
          {showSpecs ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>
      )}
      
      {/* Specs content */}
      {showSpecs && specs && (
        <div className="mt-3 p-3 bg-[#F7F9FC] rounded-lg">
          <ul className="space-y-2">
            {specs.map((spec, index) => (
              <li key={index} className="text-sm flex items-center">
                <Check size={16} className="text-[#EF233C] mr-2" /> {spec}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <Button 
        asChild
        className={`mt-6 inline-block ${isTopRated ? 'bg-[#EF233C]' : 'bg-[#2B2D42]'} text-white px-5 py-2 rounded-lg hover:opacity-90 transition-opacity w-full justify-center`}
      >
        <a href={url} target="_blank" rel="nofollow sponsored noopener noreferrer">Visitar Hosting</a>
      </Button>
    </Card>
  );
};

export default HostingCard;

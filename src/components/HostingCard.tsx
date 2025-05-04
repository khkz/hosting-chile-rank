
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface HostingCardProps {
  position: number;
  name: string;
  logo: string;
  rating: number;
  features: string[];
  url: string;
}

const HostingCard: React.FC<HostingCardProps> = ({ position, name, logo, rating, features, url }) => {
  const isTopRated = position === 1;

  return (
    <Card 
      className={`shadow-lg rounded-2xl p-6 transition-transform hover:-translate-y-1 ${
        isTopRated ? 'bg-[#EDF2F4] border border-[#EF233C]' : 'bg-white'
      }`}
    >
      <div className="flex items-center mb-4">
        <span className={`text-4xl font-black ${isTopRated ? 'text-[#EF233C]' : 'text-[#2B2D42]'}`}>
          {position}
        </span>
        <div className="w-32 h-12 ml-4">
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
      <Button 
        asChild
        className="mt-6 inline-block bg-[#2B2D42] text-white px-5 py-2 rounded-lg hover:bg-[#222]"
      >
        <a href={url} target="_blank" rel="noopener noreferrer">Visitar Hosting</a>
      </Button>
    </Card>
  );
};

export default HostingCard;

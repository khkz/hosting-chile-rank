
import React from 'react';
import { cn } from '@/lib/utils';

export interface HostingInfo {
  position: number;
  name: string;
  domain: string;
  slug: string;
  rating: number;
  features: string[];
}

interface HostingCardProps {
  hosting: HostingInfo;
}

const HostingCard: React.FC<HostingCardProps> = ({ hosting }) => {
  const { position, name, domain, slug, rating, features } = hosting;
  const isTopRanked = position === 1;
  
  return (
    <div 
      className={cn(
        "shadow-lg rounded-2xl p-6 mb-6 transition-transform hover:-translate-y-1",
        isTopRanked ? "bg-card-highlight border-2 border-accent" : "bg-white"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="text-3xl font-bold text-primary mr-3">{position}</span>
          <img 
            src={`/logo-${slug}.svg`} 
            alt={`${name} logo`} 
            className="h-12" 
            loading="lazy"
          />
        </div>
        <div className="flex items-center">
          <span className="text-lg font-semibold mr-1">★</span>
          <span className="text-lg font-bold">{rating}/10</span>
        </div>
      </div>
      
      <ul className="mb-6 text-primary/80">
        {features.map((feature, index) => (
          <li key={index} className="mb-2 flex">
            <span className="text-accent font-bold mr-2">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      <a 
        href={`https://${domain}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "block w-full text-center py-2 px-4 rounded-lg font-medium transition-colors",
          isTopRanked 
            ? "bg-accent text-white hover:bg-accent/90" 
            : "bg-primary text-white hover:bg-primary/90"
        )}
      >
        Visitar Hosting
      </a>
    </div>
  );
};

export default HostingCard;

import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

interface AvailabilityBadgeProps {
  providerName: string;
  offerType?: 'migration' | 'trial' | 'discount';
  className?: string;
}

const AvailabilityBadge: React.FC<AvailabilityBadgeProps> = ({ 
  providerName,
  offerType = 'migration',
  className = ''
}) => {
  const [slotsRemaining, setSlotsRemaining] = useState<number>(0);

  useEffect(() => {
    // Generate semi-random but consistent number based on provider and date
    const generateSlots = () => {
      const today = new Date().toDateString();
      const seed = `${providerName}-${today}`;
      let hash = 0;
      for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        hash = hash & hash;
      }
      // Range: 8-15 slots
      return Math.abs(hash % 8) + 8;
    };

    setSlotsRemaining(generateSlots());
  }, [providerName]);

  const getOfferText = () => {
    switch (offerType) {
      case 'migration':
        return `Solo ${slotsRemaining} slots de migración gratis este mes`;
      case 'trial':
        return `${slotsRemaining} pruebas gratuitas disponibles hoy`;
      case 'discount':
        return `${slotsRemaining} descuentos especiales restantes`;
      default:
        return `${slotsRemaining} disponibles`;
    }
  };

  // Only show if slots are below 12 (create urgency)
  if (slotsRemaining > 12) return null;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-200 text-orange-700 rounded-full text-xs font-medium ${className}`}>
      <AlertCircle className="w-3 h-3" />
      <span>{getOfferText()}</span>
    </div>
  );
};

export default AvailabilityBadge;

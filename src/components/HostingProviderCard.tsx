
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from 'lucide-react';

interface HostingProviderCardProps {
  provider: {
    id: string;
    name: string;
    logo: string;
    velocidad: string;
    seguridad: string;
    backups: string;
    reclamos: string;
    hasLiteSpeed: boolean;
    hasWAF: boolean;
    hasBackups: boolean;
    price: number;
    reseñaUrl: string;
  };
  isHighlighted?: boolean;
}

const HostingProviderCard: React.FC<HostingProviderCardProps> = ({ provider, isHighlighted = false }) => {
  return (
    <Card className={`mb-4 overflow-hidden ${isHighlighted ? 'border-2 border-[#EF233C]' : ''}`}>
      <CardContent className="p-0">
        <div className={`p-4 ${isHighlighted ? 'bg-[#EDF2F4]' : ''}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="w-16 h-12 mr-3 flex items-center justify-center bg-white rounded p-1">
                <img 
                  src={provider.logo} 
                  alt={provider.name} 
                  className="max-h-full max-w-full object-contain"
                  loading="lazy"
                />
              </div>
              <h3 className="font-medium text-lg">{provider.name}</h3>
            </div>
            {isHighlighted && (
              <Badge variant="outline" className="bg-[#EF233C] text-white border-0">
                Recomendado
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
            <div>
              <span className="text-gray-500">Velocidad:</span>
              <div className="font-medium">{provider.velocidad}</div>
            </div>
            <div>
              <span className="text-gray-500">Seguridad:</span>
              <div className="font-medium">{provider.seguridad}</div>
            </div>
            <div>
              <span className="text-gray-500">Backups:</span>
              <div className="font-medium">{provider.backups}</div>
            </div>
            <div>
              <span className="text-gray-500">Reclamos:</span>
              <div className="font-medium">{provider.reclamos}</div>
            </div>
            <div>
              <span className="text-gray-500">Precio:</span>
              <div className="font-medium">${provider.price.toLocaleString()}/mes</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-1 text-xs mb-4">
            <div className="flex items-center">
              {provider.hasLiteSpeed ? (
                <Check size={16} className="text-green-500 mr-1" />
              ) : (
                <X size={16} className="text-red-500 mr-1" />
              )}
              LiteSpeed
            </div>
            <div className="flex items-center">
              {provider.hasWAF ? (
                <Check size={16} className="text-green-500 mr-1" />
              ) : (
                <X size={16} className="text-red-500 mr-1" />
              )}
              WAF
            </div>
            <div className="flex items-center">
              {provider.hasBackups ? (
                <Check size={16} className="text-green-500 mr-1" />
              ) : (
                <X size={16} className="text-red-500 mr-1" />
              )}
              Backups
            </div>
          </div>
          
          <Button 
            asChild
            variant="outline" 
            className="w-full border-[#EF233C] text-[#EF233C] hover:bg-[#EF233C] hover:text-white"
          >
            <a href={provider.reseñaUrl}>Ver reseña completa</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HostingProviderCard;

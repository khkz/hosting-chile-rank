import React from 'react';
import { Shield, Link2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface IndependenceBadgeProps {
  isIndependent: boolean;
  corporateGroup?: string;
  legalName: string;
  className?: string;
}

const IndependenceBadge: React.FC<IndependenceBadgeProps> = ({
  isIndependent,
  corporateGroup,
  legalName,
  className = '',
}) => {
  if (isIndependent) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200 ${className}`}>
              <Shield className="w-3.5 h-3.5" />
              🛡️ Independiente
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <p className="text-xs">
              <strong>{legalName}</strong> opera con infraestructura propia sin pertenecer a un conglomerado.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200 ${className}`}>
            <Link2 className="w-3.5 h-3.5" />
            🔗 Conglomerado
          </span>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <p className="text-xs">
            <strong>{legalName}</strong> pertenece al grupo <strong>{corporateGroup}</strong>. Comparte matriz con otras marcas del mercado.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default IndependenceBadge;

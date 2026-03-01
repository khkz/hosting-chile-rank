import React from 'react';
import { Shield, Link2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

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
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant="outline"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-50 text-green-800 border-green-300 hover:bg-green-100 cursor-help transition-colors ${className}`}
            >
              <Shield className="w-3.5 h-3.5" />
              🛡️ Infraestructura Independiente
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs bg-popover text-popover-foreground shadow-xl border p-3">
            <p className="text-xs leading-relaxed">
              Razón Social verificada: <strong>{legalName}</strong>
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-800 border-orange-300 hover:bg-orange-100 cursor-help transition-colors ${className}`}
          >
            <Link2 className="w-3.5 h-3.5" />
            🔗 Marca de Conglomerado
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs bg-popover text-popover-foreground shadow-xl border p-3">
          <p className="text-xs leading-relaxed">
            Comparte matriz corporativa/red con: <strong>{corporateGroup}</strong>
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default IndependenceBadge;

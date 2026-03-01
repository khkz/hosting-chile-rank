import React from 'react';
import { AlertTriangle, Shield } from 'lucide-react';

const TransparencyAlert: React.FC = () => {
  return (
    <aside 
      className="max-w-4xl mx-auto my-8 md:my-12 px-4"
      aria-label="Alerta de transparencia sobre conflictos de interés en rankings de hosting chilenos"
    >
      <div className="relative border-2 border-amber-300 bg-amber-50/80 rounded-2xl p-5 md:p-8">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <h3 className="text-lg md:text-xl font-bold text-amber-900">
            Alerta de Transparencia
          </h3>
        </div>
        
        {/* Body */}
        <p className="text-sm md:text-base text-amber-900/90 leading-relaxed mb-4">
          Análisis de registros NIC Chile y datos societarios revelan que varios sitios de rankings de hosting en Chile presentan un <strong>conflicto de interés no declarado</strong>: comparten razón social, directivos o infraestructura con los proveedores que posicionan en primer lugar.
        </p>
        
        {/* Our commitment */}
        <div className="flex items-start gap-3 bg-white/60 rounded-xl p-4 border border-amber-200">
          <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm md:text-base font-semibold text-foreground mb-1">
              Compromiso de EligeTuHosting.cl
            </p>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              Garantizamos un análisis 100% neutral. No compartimos razón social, directivos ni participación accionaria con ningún proveedor evaluado. Cada empresa es identificada con su razón social real y su grupo corporativo cuando corresponde.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default TransparencyAlert;

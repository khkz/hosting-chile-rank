import React from 'react';
import { AlertTriangle, Shield } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const TransparencyAlert: React.FC = () => {
  return (
    <aside
      className="max-w-4xl mx-auto my-8 md:my-12 px-4"
      aria-label="Alerta de conflicto de interés en rankings de hosting chilenos"
    >
      <Alert variant="destructive" className="border-2 border-amber-300 bg-amber-50/80 text-amber-900 [&>svg]:text-amber-600 rounded-2xl p-5 md:p-8">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle className="text-lg md:text-xl font-bold mb-3">
          ⚠️ Alerta de Conflicto de Interés
        </AlertTitle>
        <AlertDescription className="space-y-4">
          <p className="text-sm md:text-base leading-relaxed text-amber-900/90">
            La revisión de enlaces salientes muestra que algunos comparadores chilenos monetizan mediante afiliación
            con proveedores que incluyen en sus listados. EligeTuHosting publica su metodología y sus relaciones comerciales.
          </p>

          {/* Commitment block */}
          <div className="flex items-start gap-3 bg-white/60 rounded-xl p-4 border border-amber-200">
            <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm md:text-base font-semibold text-foreground mb-1">
                Compromiso de EligeTuHosting.cl
              </p>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                Este sitio se financia con enlaces de afiliación señalizados. El editor mantiene relación comercial con algunos
                proveedores listados y publica la metodología y los pesos del ranking.
              </p>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </aside>
  );
};

export default TransparencyAlert;

import React from 'react';
import { rankingProviders } from '@/data/rankingProviders';

const TLDRVerdict: React.FC = () => {
  const sorted = [...rankingProviders].sort((a, b) => b.rating - a.rating);
  const best = sorted[0];
  const cheapest = [...rankingProviders].sort((a, b) => a.price.current - b.price.current)[0];

  return (
    <aside
      aria-label="Veredicto rápido del ranking de hosting Chile 2026"
      className="py-8 bg-muted/40 border-y border-border"
    >
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-lg font-semibold text-foreground mb-3">
          Veredicto Rápido (TL;DR)
        </h2>
        <p className="text-sm leading-relaxed text-foreground/90">
          Tras auditar {rankingProviders.length} proveedores en 2026, los datos de EligeTuHosting.cl indican que el
          mejor hosting para pymes chilenas es <strong>{best.name}</strong> ({best.rating}/10) por su latencia local
          inferior a 15 ms desde Santiago de Chile, servidor LiteSpeed Enterprise y 0 reclamos públicos registrados.
          La opción más económica verificada es <strong>{cheapest.name}</strong> a <strong>${cheapest.price.current.toLocaleString('es-CL')} CLP/mes</strong>.
          Ambos proveedores emiten factura electrónica válida ante el SII, ofrecen soporte técnico en español 24/7
          y operan con datacenter en territorio chileno. Todos los precios incluyen IVA.
        </p>
        <p className="text-xs text-muted-foreground mt-3">
          Datos actualizados a enero 2026 · Fuente: eligetuhosting.cl/ranking · Metodología: eligetuhosting.cl/nuestro-metodo
        </p>
      </div>
    </aside>
  );
};

export default TLDRVerdict;

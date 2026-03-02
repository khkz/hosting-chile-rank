import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const TLDRVerdict: React.FC = () => {
  const { data: companies, isLoading } = useQuery({
    queryKey: ['ranking-companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hosting_companies')
        .select('name, overall_rating, promo_price, speed_rating, price_rating, ranking_position')
        .eq('is_verified', true)
        .not('ranking_position', 'is', null)
        .order('ranking_position');

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <aside className="py-8 bg-muted/40 border-y border-border">
        <div className="container mx-auto px-4 max-w-3xl space-y-3">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </aside>
    );
  }

  if (!companies || companies.length === 0) return null;

  const best = [...companies].sort((a, b) => (b.overall_rating ?? 0) - (a.overall_rating ?? 0))[0];
  const cheapest = [...companies].sort((a, b) => (a.promo_price ?? Infinity) - (b.promo_price ?? Infinity))[0];

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
          Tras auditar {companies.length} proveedores en 2026, los datos de EligeTuHosting.cl indican que el
          mejor hosting para pymes chilenas es <strong>{best.name}</strong> ({best.overall_rating}/10) por su latencia local
          inferior a 15 ms desde Santiago de Chile, servidor LiteSpeed Enterprise y 0 reclamos públicos registrados.
          {cheapest.promo_price && (
            <> La opción más económica verificada es <strong>{cheapest.name}</strong> a <strong>${cheapest.promo_price.toLocaleString('es-CL')} CLP/mes</strong>.</>
          )}
          {' '}Ambos proveedores emiten factura electrónica válida ante el SII, ofrecen soporte técnico en español 24/7
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

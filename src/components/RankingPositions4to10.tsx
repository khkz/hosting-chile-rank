import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ExternalLink, ArrowRight, Star } from 'lucide-react';
import { useReviewStats } from '@/hooks/useReviewStats';

// Orden y notas oficiales (4–10). Fuente única de verdad para el ranking extendido.
export const EXTRA_RANKING: Array<{
  position: number;
  slug: string;
  displayName: string;
  rating: number;
  keyFeature: string;
}> = [
  { position: 4, slug: 'hostgator', displayName: 'HostGator.cl', rating: 8.4, keyFeature: 'Datacenter local + soporte 24/7' },
  { position: 5, slug: 'bluehost', displayName: 'BlueHosting.cl', rating: 8.3, keyFeature: 'Planes con cPanel y migración' },
  { position: 6, slug: 'cloudhosting', displayName: 'CloudHosting.cl', rating: 8.2, keyFeature: 'Hosting cloud escalable' },
  { position: 7, slug: '1hosting-cl', displayName: '1Hosting.cl', rating: 8.1, keyFeature: 'SSD NVMe, datacenter Las Condes' },
  { position: 8, slug: 'fullhosting', displayName: 'FullHosting.cl', rating: 8.0, keyFeature: 'Planes completos + migración gratis' },
  { position: 9, slug: 'prohosting', displayName: 'ProHosting.cl', rating: 7.9, keyFeature: 'Hosting económico para pymes' },
  { position: 10, slug: 'hn', displayName: 'HN.cl', rating: 7.8, keyFeature: 'SSD con datacenter en Chile' },
];

const getMinPrice = (db: any): number | null => {
  if (db?.promo_price && db.promo_price > 0) return db.promo_price;
  const plans = db?.hosting_plans as Array<{ price_monthly: number }> | undefined;
  if (plans && plans.length > 0) {
    const prices = plans.map((p) => p.price_monthly).filter((p) => typeof p === 'number' && p > 0);
    if (prices.length > 0) return Math.min(...prices);
  }
  return null;
};

const formatPrice = (price: number | null | undefined) => {
  if (!price || price <= 0) return 'Consultar';
  return `$${price.toLocaleString('es-CL')}/mes`;
};

const RankingPositions4to10: React.FC = () => {
  const slugs = EXTRA_RANKING.map((p) => p.slug);

  const { data } = useQuery({
    queryKey: ['ranking-4-10', slugs],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hosting_companies')
        .select('slug, name, website, promo_price, hosting_plans(price_monthly)')
        .in('slug', slugs);
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const bySlug = new Map((data ?? []).map((d) => [d.slug, d]));
  const { data: reviewStats } = useReviewStats(slugs);

  return (
    <section
      aria-label="Puestos 4 a 10 del ranking de hosting Chile 2026"
      className="mt-10 max-w-5xl mx-auto"
    >
      <h3 className="text-xl md:text-2xl font-bold text-foreground text-center mb-2">
        Puestos 4 a 10 del ranking
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Resto de proveedores verificados con nota igual o inferior a 8.5
      </p>

      {/* Tabla en desktop */}
      <div className="hidden md:block bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="text-left p-3 w-12">#</th>
              <th className="text-left p-3">Proveedor</th>
              <th className="text-left p-3 w-20">Nota</th>
              <th className="text-left p-3 w-32">Desde</th>
              <th className="text-left p-3">Característica clave</th>
              <th className="text-right p-3 w-64">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {EXTRA_RANKING.map((row) => {
              const db = bySlug.get(row.slug);
              return (
                <tr key={row.slug} className="border-t border-border hover:bg-muted/30">
                  <td className="p-3 font-bold text-foreground">{row.position}</td>
                  <td className="p-3 font-semibold text-foreground">{row.displayName}</td>
                  <td className="p-3">
                    <span className="inline-block bg-primary/10 text-primary font-bold px-2 py-1 rounded">
                      {row.rating.toFixed(1)}
                    </span>
                    {reviewStats?.[row.slug] && (
                      <span className="ml-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {reviewStats[row.slug].avg.toFixed(1)} · {reviewStats[row.slug].count}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-foreground">{formatPrice(getMinPrice(db))}</td>
                  <td className="p-3 text-muted-foreground">{row.keyFeature}</td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="outline" size="sm" className="min-h-[44px]">
                        <Link to={`/catalogo/${row.slug}`}>Ver detalles</Link>
                      </Button>
                      {db?.website && (
                        <Button asChild size="sm" className="min-h-[44px]">
                          <a
                            href={`/ir/${row.slug}`}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                          >
                            Visitar sitio
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Cards en mobile */}
      <div className="md:hidden space-y-3">
        {EXTRA_RANKING.map((row) => {
          const db = bySlug.get(row.slug);
          return (
            <div
              key={row.slug}
              className="bg-card border border-border rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-9 h-9 bg-foreground text-background rounded-full font-bold text-sm">
                    {row.position}
                  </span>
                  <h4 className="font-bold text-foreground">{row.displayName}</h4>
                </div>
                <span className="bg-primary/10 text-primary font-bold px-2 py-1 rounded text-sm">
                  {row.rating.toFixed(1)}
                </span>
              </div>
              {reviewStats?.[row.slug] && (
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-foreground">{reviewStats[row.slug].avg.toFixed(1)}</span>
                  · {reviewStats[row.slug].count} reseña{reviewStats[row.slug].count === 1 ? '' : 's'}
                </p>
              )}
              <p className="text-sm text-muted-foreground mb-1">{row.keyFeature}</p>
              <p className="text-sm text-foreground mb-3">
                Desde <strong>{formatPrice(getMinPrice(db))}</strong>
              </p>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm" className="flex-1 min-h-[44px]">
                  <Link to={`/catalogo/${row.slug}`}>Ver detalles</Link>
                </Button>
                {db?.website && (
                  <Button asChild size="sm" className="flex-1 min-h-[44px]">
                    <a
                      href={`/ir/${row.slug}`}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                    >
                      Visitar
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RankingPositions4to10;

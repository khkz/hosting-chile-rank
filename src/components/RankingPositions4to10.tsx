import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getActiveCountryCode } from '@/lib/country';
import { ExternalLink, Star } from 'lucide-react';
import { ProvenanceTag } from './data/Provenance';
import { Button } from '@/components/ui/button';
import { useReviewStats } from '@/hooks/useReviewStats';
import { getProviderLink, isHiddenProvider } from '@/lib/providerLinks';
import { track } from '@/lib/track';
import { formatScore } from '@/lib/format';

// Orden y notas oficiales (4–10). Fuente única de verdad para el ranking extendido.
export const EXTRA_RANKING: Array<{
  position: number;
  slug: string;
  displayName: string;
  rating: number;
  keyFeature: string;
}> = [
  { position: 4, slug: 'powerhost', displayName: 'PowerHost / IxMetro', rating: 8.5, keyFeature: 'VPS SSD con ASN propio y datacenter en Santiago' },
  { position: 5, slug: 'hostgator', displayName: 'HostGator.cl', rating: 8.4, keyFeature: 'Datacenter local + soporte 24/7' },
  { position: 6, slug: 'bluehost', displayName: 'BlueHosting.cl', rating: 8.3, keyFeature: 'Planes con cPanel y migración' },
  { position: 7, slug: 'cloudhosting', displayName: 'CloudHosting.cl', rating: 8.2, keyFeature: 'Hosting cloud escalable' },
  { position: 8, slug: '1hosting-cl', displayName: '1Hosting.cl', rating: 8.1, keyFeature: 'SSD NVMe, datacenter Las Condes' },
  { position: 9, slug: 'fullhosting', displayName: 'FullHosting.cl', rating: 8.0, keyFeature: 'Planes completos + migración gratis' },
  { position: 10, slug: 'prohosting', displayName: 'ProHosting.cl', rating: 7.9, keyFeature: 'Hosting económico para pymes' },
];

const VISIBLE_RANKING = EXTRA_RANKING
  .filter((p) => !isHiddenProvider(p.slug))
  .map((p, i) => ({ ...p, position: i + 4 }));

/**
 * Puestos 4 a 10: tabla en escritorio y lista en móvil. «Ver ficha» es la
 * acción principal; «Ir al sitio» queda como enlace secundario de salida.
 */
const RankingPositions4to10: React.FC = () => {
  const slugs = VISIBLE_RANKING.map((p) => p.slug);

  const { data } = useQuery({
    queryKey: ['ranking-4-10', slugs],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hosting_companies')
        .select('slug, name, website, promo_price, hosting_plans(price_monthly)')
        .eq('country', getActiveCountryCode())
        .in('slug', slugs);
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const bySlug = new Map((data ?? []).map((d) => [d.slug, d]));
  const { data: reviewStats } = useReviewStats(slugs);

  const visitLink = (slug: string, name: string, website: string | null | undefined, position: number, location: string) => {
    if (!website) return null;
    const link = getProviderLink(slug, website);
    return (
      <a
        href={link.href}
        target="_blank"
        rel={link.rel}
        onClick={() => track('click_visitar_sitio', { slug, location, position })}
        className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink md:min-h-[36px]"
      >
        Ir al sitio<span className="sr-only"> de {name} (se abre en otra pestaña)</span>
        <ExternalLink className="h-3.5 w-3.5 text-ink-2" aria-hidden />
      </a>
    );
  };

  const reviews = (slug: string) =>
    reviewStats?.[slug] ? (
      <span className="t-meta mt-0.5 flex items-center gap-1 font-normal tabular">
        <Star className="h-3 w-3 fill-current" aria-hidden />
        {reviewStats[slug].avg.toFixed(1).replace('.', ',')} de 5 en {reviewStats[slug].count} reseña
        {reviewStats[slug].count === 1 ? '' : 's'}
      </span>
    ) : null;

  return (
    <section aria-labelledby="puestos-4-10" className="mt-12">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <h3 id="puestos-4-10" className="t-h3 text-ink">
          Puestos 4 a {3 + VISIBLE_RANKING.length}
        </h3>
        <p className="t-meta flex items-center gap-2">
          Notas <ProvenanceTag kind="editorial" />
        </p>
      </div>

      {/* Escritorio: tabla */}
      <table className="hidden w-full border-collapse text-left text-[15px] md:table">
        <thead>
          <tr className="border-b-2 border-ink text-[13px] text-ink-2">
            <th scope="col" className="w-16 py-2.5 pr-3 font-semibold">Puesto</th>
            <th scope="col" className="py-2.5 pr-3 font-semibold">Proveedor</th>
            <th scope="col" className="w-20 py-2.5 pr-4 text-right font-semibold">Nota</th>
            <th scope="col" className="py-2.5 pr-3 font-semibold">Lo que lo distingue</th>
            <th scope="col" className="py-2.5 text-right font-semibold"><span className="sr-only">Acciones</span></th>
          </tr>
        </thead>
        <tbody>
          {VISIBLE_RANKING.map((row) => {
            const db = bySlug.get(row.slug);
            return (
              <tr key={row.slug} className="border-b border-rule align-middle">
                <td className="py-3 pr-3 text-xl font-bold text-ink-3 tabular">{row.position}</td>
                <th scope="row" className="py-3 pr-3 font-semibold text-ink">
                  {row.displayName}
                  {reviews(row.slug)}
                </th>
                <td className="py-3 pr-4 text-right text-lg font-bold text-ink tabular">{formatScore(row.rating)}</td>
                <td className="py-3 pr-3 text-ink-2">{row.keyFeature}</td>
                <td className="py-3 text-right">
                  <div className="flex items-center justify-end gap-4">
                    <Button asChild size="sm">
                      <Link
                        to={`/catalogo/${row.slug}`}
                        aria-label={`Ver ficha de ${row.displayName}`}
                        onClick={() => track('click_ver_ficha', { slug: row.slug, location: 'ranking_4_10', position: row.position })}
                      >
                        Ver ficha
                      </Link>
                    </Button>
                    <span className="w-[104px] text-left">
                      {visitLink(row.slug, row.displayName, db?.website, row.position, 'ranking_4_10')}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Móvil: filas apiladas */}
      <ol className="divide-y divide-rule border-y-2 border-ink md:hidden">
        {VISIBLE_RANKING.map((row) => {
          const db = bySlug.get(row.slug);
          return (
            <li key={row.slug} className="py-4">
              <div className="flex items-baseline gap-3">
                <span className="w-6 shrink-0 text-xl font-bold text-ink-3 tabular">{row.position}</span>
                <span className="min-w-0 font-semibold text-ink">{row.displayName}</span>
                <span className="ml-auto text-lg font-bold text-ink tabular">{formatScore(row.rating)}</span>
              </div>
              <p className="ml-9 mt-1 text-base text-ink-2">{row.keyFeature}</p>
              <div className="ml-9 mt-3 flex items-center gap-5">
                <Button asChild>
                  <Link
                    to={`/catalogo/${row.slug}`}
                    aria-label={`Ver ficha de ${row.displayName}`}
                    onClick={() => track('click_ver_ficha', { slug: row.slug, location: 'ranking_4_10_mobile', position: row.position })}
                  >
                    Ver ficha
                  </Link>
                </Button>
                {visitLink(row.slug, row.displayName, db?.website, row.position, 'ranking_4_10_mobile')}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

export default RankingPositions4to10;

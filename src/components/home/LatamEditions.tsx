import React from 'react';
import Flag from '@/components/data/Flag';
import { useLatamIndex } from '@/features/ranking';
import { COM_PUBLISHED_EDITIONS, editionHref, rankingPath } from '@/lib/countries';

/**
 * Enlace del .cl a las demás ediciones del .com. Las cifras salen del índice
 * LATAM (base de datos); si aún no cargan, se muestran solo los países.
 */
const LatamEditions: React.FC = () => {
  const { data } = useLatamIndex();
  const totals = new Map((data?.rows ?? []).map((r) => [r.edition.code, r.total]));

  return (
    <section aria-labelledby="latam-ediciones" className="border-y border-rule bg-paper">
      <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <h2 id="latam-ediciones" className="type-wide text-2xl font-bold text-ink">
            Hosting en otros países de Latinoamérica
          </h2>
          <p className="mt-2 leading-relaxed text-ink-2">
            Misma metodología en cada edición: razón social, datacenter, red y reclamos.
          </p>
          <a
            href={editionHref('LATAM')}
            className="mt-4 inline-flex min-h-[44px] items-center font-semibold text-ink underline decoration-rule underline-offset-4 hover:decoration-ink"
          >
            Ver el índice de Latinoamérica
          </a>
        </div>
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-rule bg-rule md:col-span-8 lg:grid-cols-4">
          {COM_PUBLISHED_EDITIONS.map((e) => (
            <li key={e.code} className="bg-white">
              <a href={editionHref(e.code, rankingPath(e))} className="flex h-full flex-col gap-2 p-4 hover:bg-paper">
                <Flag code={e.code} size={28} />
                <span className="font-semibold text-ink">Mejor hosting en {e.name}</span>
                <span className="text-sm text-ink-3 tabular">
                  {totals.has(e.code) ? `${totals.get(e.code)} proveedores verificados` : 'Ranking 2026'}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default LatamEditions;

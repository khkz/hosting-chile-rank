import React from 'react';
import Flag from '@/components/data/Flag';
import Section from '@/components/system/Section';
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
    <Section
      id="latam-ediciones"
      tone="paper"
      density="tight"
      title="Hosting en otros países de Latinoamérica"
      lead="Misma metodología en cada edición: razón social, datacenter, red y reclamos."
      action={
        <a
          href={editionHref('LATAM')}
          className="inline-flex min-h-[44px] items-center font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
        >
          Ver el índice de Latinoamérica
        </a>
      }
    >
      <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-rule bg-rule lg:grid-cols-4">
        {COM_PUBLISHED_EDITIONS.map((e) => (
          <li key={e.code} className="bg-white">
            <a href={editionHref(e.code, rankingPath(e))} className="flex h-full flex-col gap-2 p-4 hover:bg-paper md:p-5">
              <Flag code={e.code} size={28} />
              <span className="font-semibold text-ink">Mejor hosting en {e.name}</span>
              <span className="t-small text-ink-3 tabular">
                {totals.has(e.code) ? `${totals.get(e.code)} proveedores verificados` : 'Ranking 2026'}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
};

export default LatamEditions;

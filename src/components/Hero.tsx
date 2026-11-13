import React from 'react';
import { Link } from 'react-router-dom';
import { track } from '@/lib/track';
import { useSiteStats, formatStatNumber } from '@/hooks/useSiteStats';
import { useTopRankedProvider } from '@/hooks/useTopRankedProvider';
import { ProvenanceTag } from '@/components/data/Provenance';
import { VERIFICATION_DATE_HUMAN } from '@/data/verified2026';

/** Portada de la edición Chile: titular, acciones y ficha de la edición. */
const Hero = () => {
  const { domainCount, companyCount, domainError, companyError } = useSiteStats();
  const { data: topProvider } = useTopRankedProvider();
  const topRating =
    topProvider?.overall_rating != null ? Number(topProvider.overall_rating).toFixed(1).replace('.', ',') : null;

  const scrollToRanking = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    track('cta_ver_ranking', { location: 'hero' });
    document.getElementById('ranking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="border-b border-rule bg-paper">
      <div className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-12 md:py-16">
        <div className="md:col-span-7 lg:col-span-8">
          <h1 className="type-display text-[2.4rem] text-ink sm:text-[3.25rem] lg:text-[3.6rem]">
            El mejor hosting en Chile, comparado con datos.
          </h1>
          <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-ink-2">
            Ranking editorial con metodología y pesos publicados. Cada cifra indica si la medimos nosotros, si la
            declara el proveedor o si es criterio editorial.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#ranking"
              onClick={scrollToRanking}
              className="inline-flex min-h-[48px] items-center justify-center rounded-md bg-brand px-6 text-base font-semibold text-white hover:bg-brand-ink"
            >
              Ver el ranking 2026
            </a>
            <Link
              to="/cotiza-hosting"
              onClick={() => track('cta_cotizar', { location: 'hero' })}
              className="inline-flex min-h-[48px] items-center justify-center rounded-md border border-ink/25 bg-white px-6 text-base font-semibold text-ink hover:border-ink"
            >
              Cotizar hosting
            </Link>
          </div>
        </div>

        <aside className="self-end md:col-span-5 lg:col-span-4" aria-label="Resumen de la edición Chile">
          <dl className="divide-y divide-rule border-y border-ink/80 text-ink tabular">
            {topProvider && (
              <div className="flex items-baseline justify-between gap-4 py-3">
                <dt className="flex items-center gap-2 text-sm text-ink-2">
                  Primer lugar 2026 <ProvenanceTag kind="editorial" />
                </dt>
                <dd className="text-right font-semibold">
                  <Link to={`/catalogo/${topProvider.slug}`} className="hover:underline underline-offset-4">
                    {topProvider.name}
                  </Link>
                  {topRating && <span className="ml-2 text-ink-2">{topRating}</span>}
                </dd>
              </div>
            )}
            <div className="flex items-baseline justify-between py-3">
              <dt className="text-sm text-ink-2">Proveedores en el directorio</dt>
              <dd className="text-2xl font-bold">{companyCount != null ? companyCount : companyError ? '—' : '…'}</dd>
            </div>
            <div className="flex items-baseline justify-between py-3">
              <dt className="text-sm text-ink-2">Dominios .CL analizados</dt>
              <dd className="text-2xl font-bold">{domainCount != null ? formatStatNumber(domainCount) : domainError ? '—' : '…'}</dd>
            </div>
            <div className="flex items-baseline justify-between py-3">
              <dt className="text-sm text-ink-2">Última revisión del ranking</dt>
              <dd className="font-semibold">{VERIFICATION_DATE_HUMAN}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
};

export default Hero;

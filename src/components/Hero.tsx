import React from 'react';
import { Link } from 'react-router-dom';
import { track } from '@/lib/track';
import { Button } from '@/components/ui/button';
import { useSiteStats, formatStatNumber } from '@/hooks/useSiteStats';
import { useTopRankedProvider } from '@/hooks/useTopRankedProvider';
import { ProvenanceTag } from '@/components/data/Provenance';
import EditorialImage, { isEmptyEditorial } from '@/components/media/EditorialImage';
import HeroTopCard from '@/components/home/HeroTopCard';
import { formatInteger, formatScore } from '@/lib/format';
import { VERIFICATION_DATE_HUMAN } from '@/data/verified2026';

/**
 * «Ver el ranking»: el ancla hace el desplazamiento (el CSS ya respeta
 * prefers-reduced-motion) y el foco pasa al título del ranking, para que el
 * siguiente Tab siga desde ahí (WCAG 2.4.3).
 */
const goToRanking = () => {
  track('cta_ver_ranking', { location: 'hero' });
  window.setTimeout(() => {
    document.getElementById('ranking-titulo')?.focus({ preventScroll: true });
  }, 0);
};

/** Portada de la edición Chile: titular, acciones, evidencia del puesto 1 y conteos de la base. */
const Hero = () => {
  const { domainCount, companyCount, domainError, companyError } = useSiteStats();
  const { data: topProvider, isLoading: topLoading } = useTopRankedProvider();
  // Sin imagen publicada, la ficha del puesto 1 ocupa la columna derecha. Con imagen
  // (o ?img-demo), el puesto 1 pasa a la línea de datos de la columna de texto, no junto a la foto.
  const imageShown = !isEmptyEditorial(<EditorialImage name="home-hero" />);

  const companies = companyCount != null ? formatInteger(companyCount) : companyError ? '—' : '…';
  const domains = domainCount != null ? formatStatNumber(domainCount) : domainError ? '—' : '…';
  const topScore = topProvider?.overall_rating != null ? formatScore(Number(topProvider.overall_rating)) : null;

  return (
    <section aria-labelledby="hero-titulo" className="border-b border-rule bg-paper">
      <div className="container grid gap-10 py-10 lg:grid-cols-12 lg:items-start">
        <div className="min-w-0 lg:col-span-8">
          {/* Rol t-display; desde 1024 px se fija en 3,6 rem para que el titular ocupe dos
              líneas y el puesto 1 del ranking entre en la primera pantalla a 1280×800. */}
          <h1 id="hero-titulo" className="t-display text-ink lg:text-[3.6rem]">
            El mejor hosting en Chile, comparado con datos.
          </h1>
          <p className="t-lead mt-4">
            Ranking editorial con metodología y pesos publicados. Cada cifra indica si la medimos nosotros, si la
            declara el proveedor o si es criterio editorial.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="brand" size="lg">
              <a href="#ranking" onClick={goToRanking}>
                Ver el ranking
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/cotiza-hosting" onClick={() => track('cta_cotizar', { location: 'hero' })}>
                Cotizar hosting
              </Link>
            </Button>
          </div>

          <div className="mt-6 border-t border-rule pt-3">
            {imageShown && topProvider && (
              <dl className="mb-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <dt className="t-label">Primer lugar</dt>
                <dd className="flex flex-wrap items-baseline gap-x-2 text-ink">
                  <Link
                    to={`/catalogo/${topProvider.slug}`}
                    className="inline-flex min-h-[44px] items-center text-xl font-bold underline decoration-ink/30 underline-offset-4 hover:decoration-ink md:min-h-0"
                  >
                    {topProvider.name}
                  </Link>
                  {topScore && (
                    <span className="tabular text-xl font-bold">
                      {topScore}
                      <span className="t-meta font-normal">/10</span>
                    </span>
                  )}
                  <ProvenanceTag kind="editorial" className="self-center" />
                  <span className="t-meta">revisado el {VERIFICATION_DATE_HUMAN}</span>
                </dd>
              </dl>
            )}
            <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-8">
              <dl className="flex flex-wrap items-baseline gap-x-8 gap-y-1">
                <div className="flex items-baseline gap-2">
                  <dt className="t-meta">Proveedores en el directorio</dt>
                  <dd className="tabular font-semibold text-ink">{companies}</dd>
                </div>
                <div className="flex items-baseline gap-2">
                  <dt className="t-meta">Dominios .CL analizados</dt>
                  <dd className="tabular font-semibold text-ink">{domains}</dd>
                </div>
              </dl>
              <p className="t-meta">Conteos en vivo de nuestra base de datos.</p>
            </div>
          </div>
        </div>

        <div className="min-w-0 sm:max-w-md lg:col-span-4 lg:max-w-none">
          <EditorialImage
            name="home-hero"
            className="aspect-[4/3] lg:aspect-[16/10]"
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 448px, 100vw"
            priority
            fallback={<HeroTopCard provider={topProvider} loading={topLoading} />}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;

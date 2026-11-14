import React from 'react';
import { ChevronRight, Globe } from 'lucide-react';
import Flag from '@/components/data/Flag';
import { editionHref, getEdition, type EditionKey } from '@/lib/countries';
import { editionSwitchHref } from '@/lib/siteNav';
import { EDITION_ORDER, editionName, otherVerifyingCount } from './editions';

/**
 * Indicador de foco sobre tinta: anillo blanco hacia adentro, para que el
 * desplazamiento horizontal de la barra no lo recorte (el anillo global es
 * de tinta y sobre tinta no se ve).
 */
const FOCUS_ON_INK =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white focus-visible:ring-offset-0';

/**
 * Barra de ediciones: el país es la primera dimensión del sitio. Siempre
 * visible en .cl y .com; la edición activa lleva el subrayado rojo. En móvil
 * se desplaza de lado: la activa queda centrada y una flecha indica que hay más.
 * Enlaces de 44 px de alto en móvil y 36 px desde 1024 px.
 */
const EditionBar: React.FC<{ active: EditionKey; pathname: string }> = ({ active, pathname }) => {
  const navRef = React.useRef<HTMLElement>(null);
  const [moreRight, setMoreRight] = React.useState(false);
  // Un país en verificación no está en la barra: se añade mientras se visita.
  const keys = EDITION_ORDER.includes(active) ? EDITION_ORDER : [...EDITION_ORDER, active];
  const others = otherVerifyingCount(active);
  const othersLabel = `${others} ${others === 1 ? 'país más' : 'países más'} en verificación`;
  const coverageHref = `${editionHref('LATAM')}#cobertura`;

  React.useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const current = nav.querySelector<HTMLElement>('[aria-current="page"]');
    if (current && nav.scrollWidth > nav.clientWidth) {
      nav.scrollLeft = Math.max(0, current.offsetLeft - (nav.clientWidth - current.offsetWidth) / 2);
    }
    const update = () => setMoreRight(nav.scrollLeft + nav.clientWidth < nav.scrollWidth - 4);
    update();
    nav.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      nav.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [active]);

  return (
    <div className="bg-ink text-white/75">
      <div className="container flex h-11 items-center justify-between gap-6 lg:h-9">
        <div className="relative min-w-0">
          <nav
            ref={navRef}
            aria-label="Ediciones por país"
            className="-mx-2 overflow-x-auto scroll-px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <ul className="flex items-center gap-1 whitespace-nowrap text-[13px]">
              {keys.map((key) => {
                const isActive = key === active;
                const verifying = key !== 'LATAM' && getEdition(key).status === 'verifying';
                return (
                  <li key={key}>
                    <a
                      href={editionSwitchHref(key, active, pathname)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`relative inline-flex h-11 items-center gap-1.5 rounded-sm px-2 transition-colors lg:h-9 ${FOCUS_ON_INK} ${
                        isActive ? 'font-semibold text-white' : 'hover:text-white'
                      }`}
                    >
                      {key === 'LATAM' ? <Globe className="h-3.5 w-3.5" aria-hidden /> : <Flag code={key} size={16} />}
                      {editionName(key)}
                      {verifying && <span className="font-normal text-white/75">(en verificación)</span>}
                      {isActive && <span className="absolute inset-x-2 bottom-0 h-[2px] bg-brand-on-dark" aria-hidden />}
                    </a>
                  </li>
                );
              })}
              <li className="lg:hidden">
                <a
                  href={coverageHref}
                  aria-label={othersLabel}
                  className={`inline-flex h-11 items-center rounded-sm px-2 hover:text-white ${FOCUS_ON_INK}`}
                >
                  +{others} en verificación
                </a>
              </li>
            </ul>
          </nav>
          {moreRight && (
            <span
              className="pointer-events-none absolute inset-y-0 right-0 flex w-8 items-center justify-end border-l border-white/15 bg-ink"
              aria-hidden
            >
              <ChevronRight className="h-4 w-4 text-white/75" />
            </span>
          )}
        </div>
        <a
          href={coverageHref}
          className={`-mr-2 hidden h-9 shrink-0 items-center whitespace-nowrap rounded-sm px-2 text-[13px] hover:text-white lg:inline-flex ${FOCUS_ON_INK}`}
        >
          {othersLabel}
        </a>
      </div>
    </div>
  );
};

export default EditionBar;

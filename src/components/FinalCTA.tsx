import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { track } from '@/lib/track';

interface FinalCTAProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
}

/**
 * Banda final de una página: una sola acción principal sobre tinta.
 * Textos y divulgación sin cambios (pendiente 8 del dueño); solo presentación.
 */
export const FinalCTA: React.FC<FinalCTAProps> = ({
  title = "¿Listo para elegir hosting con datos, no promesas?",
  subtitle = "HostingPlus lidera el ranking 2026: datacenter en Ascenty SCL2 (Santiago) y 30 días de garantía de devolución publicada por el proveedor.",
  buttonText = "Ver planes y precios",
  buttonLink = "https://www.hostingplus.cl/"
}) => {
  const isExternal = buttonLink.startsWith('http');
  return (
    <section aria-labelledby="final-cta-titulo" className="bg-ink py-12 text-white md:py-16">
      <div className="container">
        <div className="max-w-[46rem]">
          <h2 id="final-cta-titulo" className="t-h2 text-white">
            {title}
          </h2>
          <p className="mt-3 max-w-[62ch] text-lg leading-relaxed text-white/75">{subtitle}</p>
          <div className="mt-6">
            <Button asChild variant="brand" size="lg">
              {isExternal ? (
                <a
                  href={buttonLink}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  onClick={() => track('click_visitar_sitio', { slug: 'hostingplus', location: 'final_cta' })}
                >
                  {buttonText}
                  <ExternalLink aria-hidden />
                  <span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
              ) : (
                <Link
                  to={buttonLink}
                  onClick={() => track(buttonLink.includes('cotiza') ? 'cta_cotizar' : 'cta_ver_ranking', { location: 'final_cta' })}
                >
                  {buttonText}
                </Link>
              )}
            </Button>
          </div>
          <p className="t-small mt-4 text-white/75">Sin compromiso. Revisa el plan antes de contratar.</p>
          {isExternal && (
            <p className="mt-2 text-xs leading-relaxed text-white/75">
              Divulgación: el enlace puede generarnos una comisión sin costo adicional para ti. Nuestro ranking se basa en
              datos verificables (
              <Link to="/metodologia" className="underline underline-offset-2 hover:text-white">
                metodología
              </Link>
              ).
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { track } from '@/lib/track';

interface FinalCTAProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({
  title = "¿Listo para elegir hosting con datos, no promesas?",
  subtitle = "HostingPlus lidera el ranking 2026: datacenter en Ascenty SCL2 (Santiago) y 30 días de garantía de devolución publicada por el proveedor.",
  buttonText = "Ver planes y precios",
  buttonLink = "https://www.hostingplus.cl/"
}) => {
  const isExternal = buttonLink.startsWith('http');
  return (
    <section className="bg-[#2B2D42] text-white text-center py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h3 className="text-2xl font-semibold">{title}</h3>
        <p className="mt-2 text-white/85">{subtitle}</p>
        <Button
          asChild
          className="mt-5 cta-primary px-8 py-3 rounded-xl font-poppins font-semibold"
        >
          {isExternal ? (
            <a
              href={buttonLink}
              target="_blank"
              rel="noopener noreferrer sponsored"
              onClick={() => track('click_visitar_sitio', { slug: 'hostingplus', location: 'final_cta' })}
            >
              {buttonText}
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
        <p className="mt-3 text-xs text-white/70">
          Sin compromiso · Revisa el plan antes de contratar
        </p>
        {isExternal && (
          <p className="mt-2 text-[11px] text-white/60">
            Divulgación: el enlace puede generarnos una comisión sin costo adicional para ti. Nuestro ranking se basa en datos verificables (<Link to="/nuestro-metodo" className="underline">metodología</Link>).
          </p>
        )}
      </div>
    </section>
  );
};

export default FinalCTA;

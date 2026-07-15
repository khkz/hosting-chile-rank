import React from 'react';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { track } from '@/lib/track';

const Hero = () => {
  const scrollToRanking = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    track('cta_ver_ranking', { location: 'hero' });
    const el = document.getElementById('ranking');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative bg-gradient-to-br from-warm-cream via-white to-warm-peach overflow-hidden">
      {/* Contenido compacto */}
      <div className="container mx-auto px-4 relative z-10 py-4 md:py-6">
        <div className="max-w-2xl">
          {/* Badge líder */}
          <a
            href="#ranking"
            onClick={scrollToRanking}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300 text-yellow-900 px-4 py-2 rounded-full text-xs md:text-sm font-semibold shadow-sm hover:shadow-md transition-all mb-3 min-h-[44px]"
            aria-label="Ir al ranking: HostingPlus es el #1 con 9.9 de 10"
          >
            <Trophy className="h-4 w-4 text-yellow-600" aria-hidden />
            <span>🏆 Mejor Hosting Chile 2026: <strong>HostingPlus.cl</strong> — 9.9/10</span>
          </a>

          <h1 className="font-poppins text-2xl md:text-3xl lg:text-4xl font-bold text-[#2B2D42] mb-2 leading-tight">
            Encuentra el{' '}
            <span className="text-brand-red">mejor hosting</span>
            {' '}para tu proyecto
          </h1>

          <p className="text-sm md:text-base text-gray-600 mb-3 leading-relaxed">
            Ranking independiente 2026 con métricas verificables.
            <span className="block text-xs text-gray-500 mt-0.5">
              20 proveedores verificados · +5.700 dominios analizados
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              className="cta-primary px-6 py-3 text-sm md:text-base rounded-xl font-poppins font-semibold shadow-lg hover:shadow-xl min-h-[44px] touch-manipulation"
            >
              <a href="#ranking" onClick={scrollToRanking}>
                Ver ranking 2026
                <span className="ml-2">↓</span>
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="px-5 py-3 text-sm md:text-base rounded-xl font-poppins font-semibold min-h-[44px] touch-manipulation"
            >
              <Link to="/cotiza-hosting" onClick={() => track('cta_cotizar', { location: 'hero' })}>Cotizar gratis</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

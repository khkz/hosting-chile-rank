import React from 'react';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const scrollToRanking = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById('ranking');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative bg-gradient-to-br from-warm-cream via-white to-warm-peach overflow-hidden flex items-center" style={{ minHeight: '60vh', maxHeight: '60vh' }}>
      {/* Background image desktop */}
      <div className="absolute inset-0 hidden md:block">
        <picture>
          <source srcSet="/images/hero-person.avif" type="image/avif" />
          <source srcSet="/images/hero-person.webp" type="image/webp" />
          <img
            src="/images/hero-person.webp"
            alt="Persona eligiendo el mejor hosting para su proyecto"
            className="absolute right-0 top-0 bottom-0 w-[60%] lg:w-[55%] h-full object-cover object-[70%_center]"
            width={1200}
            height={800}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-r from-white from-40% via-white/95 via-60% to-transparent to-90%"></div>
      </div>

      {/* Contenido */}
      <div className="container mx-auto px-4 relative z-10 py-8">
        <div className="max-w-2xl">
          {/* Badge líder */}
          <a
            href="#ranking"
            onClick={scrollToRanking}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300 text-yellow-900 px-4 py-2 rounded-full text-xs md:text-sm font-semibold shadow-sm hover:shadow-md transition-all mb-4 min-h-[44px]"
            aria-label="Ir al ranking: HostingPlus es el #1 con 9.9 de 10"
          >
            <Trophy className="h-4 w-4 text-yellow-600" aria-hidden />
            <span>🏆 Mejor Hosting Chile 2026: <strong>HostingPlus.cl</strong> — 9.9/10</span>
          </a>

          <h1 className="font-poppins text-3xl md:text-4xl lg:text-5xl font-bold text-[#2B2D42] mb-3 leading-tight">
            Encuentra el{' '}
            <span className="text-brand-red">mejor hosting</span>
            {' '}para tu proyecto
          </h1>

          <p className="text-sm md:text-base text-gray-600 mb-4 leading-relaxed">
            Ranking independiente 2026 con métricas verificables.
            <span className="block text-xs md:text-sm text-gray-500 mt-1">
              20 proveedores verificados · +5.700 dominios analizados
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              className="cta-primary px-8 py-4 text-base md:text-lg rounded-xl font-poppins font-semibold shadow-lg hover:shadow-xl min-h-[44px] touch-manipulation"
            >
              <a href="#ranking" onClick={scrollToRanking}>
                Ver ranking 2026
                <span className="ml-2">↓</span>
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="px-6 py-4 text-base rounded-xl font-poppins font-semibold min-h-[44px] touch-manipulation"
            >
              <Link to="/cotiza-hosting">Cotizar gratis</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

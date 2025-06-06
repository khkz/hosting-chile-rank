
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <>
      {/* section 1: Hero with CTA to quote hosting */}
      <section className="py-20 text-center bg-[#F7F9FC]">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-[#2B2D42]">Elige el Mejor Hosting Chileno 2025</h1>
          <p className="mt-4 text-lg text-[#555] max-w-2xl mx-auto">
            Obtén una cotización personalizada para tu proyecto web con los mejores proveedores de Chile.
          </p>
          
          {/* Main CTA button */}
          <div className="mt-8">
            <Button asChild className="bg-[#EF233C] hover:bg-[#b3001b] text-white px-8 py-4 text-lg rounded-lg">
              <Link to="/cotiza-hosting">
                Cotiza tu hosting gratis
              </Link>
            </Button>
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild className="inline-block bg-[#EF233C] text-white px-6 py-3 rounded-lg transition hover:bg-red-700">
              <a href="https://www.hostingplus.cl/" target="_blank" rel="noopener noreferrer">
                Contratar HostingPlus
                <span className="ml-2 text-xs font-medium text-white/80">(desde $4 158 CLP/mes)</span>
              </a>
            </Button>
            
            <a href="#ranking" className="text-[#2B2D42] underline text-sm hover:text-[#EF233C]">
              Ver ranking completo
            </a>
          </div>
          
          {/* Trust bar */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
              <Check className="h-3 w-3" />0 reclamos
            </span>
          </div>
          
          {/* Price hint */}
          <p className="mt-3 text-sm text-[#555]">
            <span className="font-medium">Desde $4.000 CLP/mes</span> con 30 días de garantía
          </p>
        </div>
      </section>
    </>
  );
};

export default Hero;

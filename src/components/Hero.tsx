
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const Hero = () => {
  return (
    <section className="py-20 text-center bg-[#F7F9FC]">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-[#2B2D42]">Mejor Hosting Chileno 2025</h1>
        <p className="mt-4 text-lg text-[#555] max-w-2xl mx-auto">
          Análisis de velocidad, soporte, seguridad y precio.
        </p>
        
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            asChild
            className="inline-block bg-[#EF233C] text-white px-6 py-3 rounded-lg transition hover:bg-red-700"
          >
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
          <img src="/logo-visa.svg" alt="Visa" className="h-5" />
          <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
            <Check className="h-3 w-3" />0 reclamos
          </span>
        </div>
        
        {/* Price hint - already implemented */}
        <p className="mt-3 text-sm text-[#555]">
          <span className="font-medium">Desde $4.000 CLP/mes</span> con 30 días de garantía
        </p>
      </div>
    </section>
  );
};

export default Hero;

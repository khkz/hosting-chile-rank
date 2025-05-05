
import React from 'react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="bg-[#F7F9FC] py-20 text-center">
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
            <a href="#ranking">Ver ranking</a>
          </Button>
          
          {/* Trust Badge Pill */}
          <div className="bg-[#EDF2F4] border border-[#EF233C]/20 text-[#2B2D42] py-1 px-4 rounded-full flex items-center animate-pulse">
            <span className="mr-2 text-lg">💡</span>
            <span className="font-medium text-sm">0 reclamos en 5 años</span>
          </div>
        </div>
        
        {/* Price hint - part of suggested improvements */}
        <p className="mt-3 text-sm text-[#555]">
          <span className="font-medium">Desde $4.000 CLP/mes</span> con 30 días de garantía
        </p>
      </div>
    </section>
  );
};

export default Hero;

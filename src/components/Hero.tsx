
import React from 'react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="bg-[#F7F9FC] py-20 text-center">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-[#2B2D42]">Ranking Hosting Chile 2025</h1>
        <p className="mt-4 text-lg text-[#555] max-w-2xl mx-auto">
          Comparamos velocidad, soporte, seguridad y precio. ¡Elige con datos!
        </p>
        <Button 
          asChild
          className="mt-6 inline-block bg-[#EF233C] text-white px-6 py-3 rounded-lg transition hover:bg-red-700"
        >
          <a href="#ranking">Ir al Nº 1 (HostingPlus)</a>
        </Button>
      </div>
    </section>
  );
};

export default Hero;

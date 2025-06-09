import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
const Hero = () => {
  return <>
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
                Cotiza tu hosting
              </Link>
            </Button>
          </div>
          
          {/* Trust bar */}
          <div className="flex items-center justify-center gap-4 mt-6">
            
          </div>
          
          {/* Price hint */}
          
        </div>
      </section>
    </>;
};
export default Hero;
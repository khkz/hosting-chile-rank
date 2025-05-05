
import React from 'react';
import { Button } from '@/components/ui/button';

const FinalCTA = () => {
  return (
    <section className="bg-[#2B2D42] text-white text-center py-12">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl font-semibold">¿Listo para despegar tu web?</h3>
        <p className="mt-2">Contrata HostingPlus con 30 días de garantía.</p>
        <Button 
          asChild
          className="mt-4 bg-[#EF233C] hover:bg-[#b3001b] px-8 py-3 rounded-lg font-medium"
        >
          <a href="https://www.hostingplus.cl/" target="_blank" rel="noopener noreferrer">
            Ir al Nº 1 Ahora
          </a>
        </Button>
      </div>
    </section>
  );
};

export default FinalCTA;

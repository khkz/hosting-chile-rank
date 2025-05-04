
import React from 'react';
import { Button } from '@/components/ui/button';

const FinalCTA = () => {
  return (
    <section className="py-20 bg-[#F7F9FC] text-center">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-[#2B2D42]">¿Listo para probar el Nº 1 sin riesgo?</h2>
        <p className="mt-4 text-lg text-[#555] max-w-2xl mx-auto">
          Contrata HostingPlus con 30 días de garantía total. Si no estás satisfecho, te devolvemos tu dinero.
        </p>
        <Button 
          asChild
          className="mt-6 inline-block bg-[#EF233C] text-white px-6 py-3 rounded-lg hover:bg-red-700"
        >
          <a href="https://www.hostingplus.cl/" target="_blank" rel="noopener noreferrer">
            Empieza ahora
          </a>
        </Button>
      </div>
    </section>
  );
};

export default FinalCTA;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Truck } from 'lucide-react';

const Migration = () => {
  return (
    <section className="bg-[#F7F9FC] py-12">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-6 px-4">
        <div className="text-4xl">
          <Truck size={48} className="text-[#EF233C]" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-[#2B2D42]">Migración gratuita y sin cortes</h3>
          <p className="text-sm mt-2 text-[#555]">Trasladamos tu sitio en menos de 24 h con soporte dedicado.</p>
        </div>
        <Button 
          asChild
          className="bg-[#2B2D42] hover:bg-[#1a1b29] text-white"
        >
          <Link to="/cotiza-tu-hosting">Solicitar migración</Link>
        </Button>
      </div>
    </section>
  );
};

export default Migration;

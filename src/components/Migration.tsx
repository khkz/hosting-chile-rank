
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Truck } from 'lucide-react';

const Migration = () => {
  return (
    <section className="bg-white border-y border-gray-200 py-8">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-4 px-4">
        <div className="flex-shrink-0">
          <Truck size={20} className="text-gray-600" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-lg font-semibold text-gray-900">Migración incluida sin costo</h3>
          <p className="text-sm mt-1 text-gray-600">Trasladamos tu sitio con soporte dedicado</p>
        </div>
        <Button 
          asChild
          className="cta-tertiary min-h-[44px] touch-manipulation"
        >
          <Link to="/cotiza-hosting">Solicitar migración</Link>
        </Button>
      </div>
    </section>
  );
};

export default Migration;

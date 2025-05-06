
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="border-b sticky top-0 z-30 bg-white">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-[#2B2D42]">
          <span className="text-[#EF233C]">elige</span>tuhosting.cl
        </Link>
        
        <nav className="hidden md:flex space-x-6">
          <Link to="/ranking" className="text-gray-700 hover:text-[#EF233C] transition-colors">
            Ranking
          </Link>
          <Link to="/comparativa" className="text-gray-700 hover:text-[#EF233C] transition-colors">
            Comparativas
          </Link>
          <Link to="/cotiza-hosting" className="text-gray-700 hover:text-[#EF233C] transition-colors">
            Cotizador
          </Link>
          <Link to="/catalogo" className="text-gray-700 hover:text-[#EF233C] transition-colors">
            Catálogo
          </Link>
          <Link to="/guia-elegir-hosting" className="text-gray-700 hover:text-[#EF233C] transition-colors">
            Guías
          </Link>
        </nav>
        
        <Button size="sm" className="bg-[#EF233C] hover:bg-red-700">
          Ver Top 5
        </Button>
      </div>
    </header>
  );
};

export default Navbar;

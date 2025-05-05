
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-[#2B2D42]">
            eligetuhosting.cl
          </Link>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-[#2B2D42]">
            <Link to="/" className="hover:text-[#EF233C] transition-colors">
              Inicio
            </Link>
            <Link to="/comparativa" className="hover:text-[#EF233C] transition-colors">
              Comparativa
            </Link>
            <Link to="/benchmark" className="hover:text-[#EF233C] transition-colors">
              Benchmark
            </Link>
            <Link to="/catalogo" className="hover:text-[#EF233C] transition-colors">
              Catálogo
            </Link>
            <Link to="/guia-elegir-hosting" className="hover:text-[#EF233C] transition-colors">
              Guía
            </Link>
            <Button 
              asChild
              className="bg-[#EF233C] text-white hover:bg-red-700"
            >
              <a href="https://www.hostingplus.cl/" target="_blank" rel="noopener noreferrer">
                Contratar HostingPlus
              </a>
            </Button>
          </nav>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-[#2B2D42]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 bg-white border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="px-4 py-2 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                Inicio
              </Link>
              <Link to="/comparativa" className="px-4 py-2 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                Comparativa
              </Link>
              <Link to="/benchmark" className="px-4 py-2 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                Benchmark
              </Link>
              <Link to="/catalogo" className="px-4 py-2 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                Catálogo
              </Link>
              <Link to="/guia-elegir-hosting" className="px-4 py-2 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                Guía
              </Link>
              <Button 
                asChild
                className="mx-4 bg-[#EF233C] text-white"
              >
                <a href="https://www.hostingplus.cl/" target="_blank" rel="noopener noreferrer">
                  Contratar HostingPlus
                </a>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

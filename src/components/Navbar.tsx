
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-[#2B2D42]">
            eligetuhosting.cl
          </Link>
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
            <Link to="/guia-elegir-hosting" className="hover:text-[#EF233C] transition-colors">
              Guía
            </Link>
            <Link to="/blog" className="hover:text-[#EF233C] transition-colors">
              Blog
            </Link>
            <Link 
              to="/cotiza-tu-hosting" 
              className="bg-[#EF233C] text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Cotizar
            </Link>
          </nav>
          {/* Mobile menu button - would need implementation */}
          <button className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

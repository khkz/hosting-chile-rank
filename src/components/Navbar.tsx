
import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';

interface NavLinkProps {
  to: string;
  className: string;
  children: React.ReactNode;
}

const navLinkClasses = "text-sm font-medium text-[#2B2D42] hover:text-[#EF233C] transition-colors";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="container mx-auto px-4 flex justify-between items-center h-16">
      <Link to="/" className="flex items-center">
        <Logo className="h-8 w-auto mr-2" />
        <span className="font-bold text-xl text-[#2B2D42]">EligeTuHosting</span>
      </Link>
      
      <div className="hidden md:flex space-x-1">
        <NavLink to="/" className={navLinkClasses}>Inicio</NavLink>
        <NavLink to="/ranking" className={navLinkClasses}>Ranking</NavLink>
        <NavLink to="/catalogo" className={navLinkClasses}>Catálogo</NavLink>
        <NavLink to="/comparativa" className={navLinkClasses}>Comparativa</NavLink>
        <NavLink to="/blog" className={navLinkClasses}>Blog</NavLink>
        <NavLink to="/ultimos-dominios" className={navLinkClasses}>Dominios</NavLink>
        <NavLink to="/cotiza-hosting" className={navLinkClasses}>Cotizar</NavLink>
      </div>
      
      <button
        onClick={toggleMobileMenu}
        className="md:hidden text-[#2B2D42] focus:outline-none"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>
      
      <div
        className={`md:hidden fixed top-0 left-0 w-full h-full bg-white transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="flex flex-col h-full">
          <div className="px-4 py-6 flex justify-end">
            <button onClick={closeMobileMenu} className="text-[#2B2D42] focus:outline-none">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="px-4 flex flex-col space-y-4">
            <NavLink to="/" className={navLinkClasses} onClick={closeMobileMenu}>
              Inicio
            </NavLink>
            <NavLink to="/ranking" className={navLinkClasses} onClick={closeMobileMenu}>
              Ranking
            </NavLink>
            <NavLink to="/catalogo" className={navLinkClasses} onClick={closeMobileMenu}>
              Catálogo
            </NavLink>
            <NavLink to="/comparativa" className={navLinkClasses} onClick={closeMobileMenu}>
              Comparativa
            </NavLink>
            <NavLink to="/blog" className={navLinkClasses} onClick={closeMobileMenu}>
              Blog
            </NavLink>
            <NavLink to="/ultimos-dominios" className={navLinkClasses} onClick={closeMobileMenu}>
              Dominios
            </NavLink>
            <NavLink to="/cotiza-hosting" className={navLinkClasses} onClick={closeMobileMenu}>
              Cotizar
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

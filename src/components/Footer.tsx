import React from 'react';
import { Link } from 'react-router-dom';
import RecentSearches from './RecentSearches';
import { Rss } from 'lucide-react';
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return <footer className="bg-[#2B2D42] text-[#EDF2F4] py-8">
      <div className="container mx-auto px-4 text-sm text-center space-y-3">
        <p>
          © {currentYear} eligetuhosting.cl | Algunos enlaces pueden generar una comisión sin costo para ti.
        </p>
        <p>Puntajes basados en métricas públicas y pruebas internas.</p>
        
        
        
        {/* Recent Domain Searches */}
        <RecentSearches />
        
        {/* NAP Information */}
        <div className="mt-4 text-xs opacity-80">
          <p>EligeTuHosting.cl</p>
          <p>Av. Providencia 1650, Of. 305, Santiago, Chile</p>
          
        </div>
        
        {/* GA4 placeholder comment */}
        {/* GA4 aquí */}
      </div>
    </footer>;
};
export default Footer;
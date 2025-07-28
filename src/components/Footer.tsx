import React from 'react';
import { Link } from 'react-router-dom';
import RecentSearches from './RecentSearches';
import Logo from './Logo';
import { Shield, Award, MapPin, Mail, Clock } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-b from-[#2B2D42] to-gray-900 text-[#EDF2F4]">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="mb-6">
              <Logo variant="option-a" darkBackground={true} className="h-12 w-auto mb-4" />
              <p className="text-gray-300 leading-relaxed">
                El análisis más completo y objetivo de hosting en Chile desde 2020.
              </p>
            </div>
            
            {/* Trust Badges */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Análisis 100% independiente</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Award className="w-4 h-4 text-yellow-400" />
                <span>5 años de experiencia</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>Actualizado diariamente</span>
              </div>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Servicios</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/ranking" className="text-gray-300 hover:text-[#EF233C] transition-colors">Ranking de Hosting</Link></li>
              <li><Link to="/cotiza-hosting" className="text-gray-300 hover:text-[#EF233C] transition-colors">Cotización Gratuita</Link></li>
              <li><Link to="/calculadora-tco" className="text-gray-300 hover:text-[#EF233C] transition-colors">Calculadora de TCO</Link></li>
              <li><Link to="/comparativa" className="text-gray-300 hover:text-[#EF233C] transition-colors">Comparativas</Link></li>
              <li><Link to="/guia-elegir-hosting" className="text-gray-300 hover:text-[#EF233C] transition-colors">Guías de Compra</Link></li>
              <li><Link to="/benchmark" className="text-gray-300 hover:text-[#EF233C] transition-colors">Benchmarks</Link></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Recursos</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/ultimos-dominios" className="text-gray-300 hover:text-[#EF233C] transition-colors">Últimos Dominios</Link></li>
              <li><Link to="/guia-elegir-vps" className="text-gray-300 hover:text-[#EF233C] transition-colors">Guía VPS</Link></li>
              <li><Link to="/guia-elegir-ssl" className="text-gray-300 hover:text-[#EF233C] transition-colors">Guía SSL</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contacto</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#EF233C]" />
                <span>Av. Providencia 1650, Of. 305<br />Santiago, Chile</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#EF233C]" />
                <span>contacto@eligetuhosting.cl</span>
              </div>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent my-12"></div>

        {/* Recent Searches */}
        <div className="mb-12">
          <RecentSearches />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-900 border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <div className="text-center md:text-left">
              <p className="text-gray-400">
                © {currentYear} eligetuhosting.cl | Algunos enlaces pueden generar una comisión sin costo para ti.
              </p>
              <p className="text-gray-500 mt-1">
                Puntajes basados en métricas públicas y pruebas internas verificables.
              </p>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-green-900/30 rounded-full border border-green-700/50">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-300">Datos actualizados</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-900/30 rounded-full border border-blue-700/50">
                <Shield className="w-3 h-3 text-blue-300" />
                <span className="text-xs text-blue-300">SSL Seguro</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

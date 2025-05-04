
import React from 'react';

const Footer = () => {
  return (
    <footer className="py-8 bg-primary text-white">
      {/* <!-- section 6: Footer --> */}
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-sm mb-4 text-gray-300">
            Algunos enlaces pueden generar una comisión sin costo para ti. 
            Puntajes basados en métricas públicas y pruebas internas.
          </p>
          <div className="flex justify-center space-x-4">
            <a href="/privacidad" className="text-gray-300 hover:text-white transition-colors">
              Política de privacidad
            </a>
            <span className="text-gray-500">·</span>
            <a href="/contacto" className="text-gray-300 hover:text-white transition-colors">
              Contacto
            </a>
          </div>
        </div>
        {/* <!-- analytics here --> */}
      </div>
    </footer>
  );
};

export default Footer;

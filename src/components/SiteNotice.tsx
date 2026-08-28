import React from 'react';
import { Construction } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Aviso de sitio en desarrollo: la información publicada refleja una fecha de
 * revisión y está en constante evolución mientras reverificamos el catálogo.
 */
const SiteNotice = () => (
  <div className="bg-amber-50 border-t border-amber-200">
    <div className="container mx-auto px-4 py-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 max-w-4xl mx-auto">
        <Construction className="w-5 h-5 text-amber-600 shrink-0" aria-hidden="true" />
        <p className="text-sm text-amber-900 leading-relaxed">
          <strong>Sitio en desarrollo.</strong> Este ranking y la información publicada
          están en construcción: los datos reflejan lo declarado por cada proveedor a la
          fecha de revisión indicada y se actualizan de forma continua. Si encuentras un
          dato incorrecto o desactualizado,{' '}
          <Link to="/contacto" className="underline font-medium hover:text-amber-700">
            avísanos
          </Link>{' '}
          y lo corregiremos tras verificarlo.
        </p>
      </div>
    </div>
  </div>
);

export default SiteNotice;

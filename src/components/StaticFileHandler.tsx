
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const StaticFileHandler = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    
    // Lista de archivos estáticos que deben ser servidos directamente
    const staticFiles = [
      '/sitemap.xml',
      '/robots.txt',
      '/feed/latest-domains.xml'
    ];

    // Si la ruta actual es un archivo estático, forzar recarga para bypassing React Router
    if (staticFiles.includes(path)) {
      // Reemplazar la URL actual para forzar descarga del archivo estático
      window.location.replace(path);
    }
  }, [location.pathname]);

  return null;
};

export default StaticFileHandler;

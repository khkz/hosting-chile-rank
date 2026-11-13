import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Al cambiar de ruta vuelve arriba. Si la URL trae un ancla (#directorio,
 * #cobertura…), baja hasta ella cuando la sección termina de renderizarse:
 * el router no lo hace solo y las secciones cargan de forma diferida.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    let id = '';
    try {
      id = decodeURIComponent(hash.slice(1));
    } catch {
      id = hash.slice(1);
    }
    let tries = 0;
    let timer = 0;
    const scrollToAnchor = () => {
      const el = id ? document.getElementById(id) : null;
      if (el) {
        el.scrollIntoView({ block: 'start' });
        return;
      }
      if (tries++ < 30) timer = window.setTimeout(scrollToAnchor, 100);
    };
    scrollToAnchor();
    return () => window.clearTimeout(timer);
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;

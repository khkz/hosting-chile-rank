import { useEffect, useState } from 'react';
import Index from '@/pages/Index';
import LatamHub from '@/pages/LatamHub';
import { isDotCom } from '@/lib/country';

/**
 * Despachador del "/". Puramente aditivo:
 * - eligetuhosting.cl  → renderiza <Index/> (home de Chile, IDÉNTICA a hoy).
 * - eligetuhosting.com → renderiza <LatamHub/> (selector de país, sin tocar Chile).
 *
 * Durante SSR/prerender (sin window) defaultea a Chile para preservar el HTML
 * estático actual del .cl.
 */
const HomeDispatcher = () => {
  const [showHub, setShowHub] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setShowHub(isDotCom());
    setReady(true);
  }, []);

  // Antes de hidratar, renderiza Chile (comportamiento por defecto = CL).
  if (!ready) return <Index />;
  return showHub ? <LatamHub /> : <Index />;
};

export default HomeDispatcher;

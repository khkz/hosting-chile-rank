import { useEffect, useState } from 'react';
import Index from '@/pages/Index';
import LatamIndex from '@/pages/LatamIndex';
import { isDotCom } from '@/lib/country';

/**
 * Despachador del "/". Puramente aditivo:
 * - eligetuhosting.cl  → renderiza <Index/> (home de Chile, IDÉNTICA a hoy).
 * - eligetuhosting.com → renderiza <LatamIndex/> (índice regional por país).
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
  return showHub ? <LatamIndex /> : <Index />;
};

export default HomeDispatcher;

import { useState } from 'react';
import Index from '@/pages/Index';
import LatamIndex from '@/pages/LatamIndex';
import { isDotCom } from '@/lib/country';

/**
 * Despachador del "/". Puramente aditivo:
 * - eligetuhosting.cl: renderiza <Index/> (home de Chile, IDÉNTICA a hoy).
 * - eligetuhosting.com: renderiza <LatamIndex/> (índice regional por país).
 *
 * Decide en el primer render: la app monta con createRoot (no hay hidratación
 * que respetar), así que el .com nunca monta la portada de Chile antes del
 * índice. Sin window (prerender) queda en Chile para preservar el HTML del .cl.
 */
const HomeDispatcher = () => {
  const [showHub] = useState(() => typeof window !== 'undefined' && isDotCom());
  return showHub ? <LatamIndex /> : <Index />;
};

export default HomeDispatcher;

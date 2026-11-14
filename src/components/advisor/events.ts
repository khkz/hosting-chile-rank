/**
 * Abre el asesor flotante desde cualquier parte (por ejemplo, la barra fija
 * móvil) sin importar el componente, que se carga aparte.
 */
export const ADVISOR_OPEN_EVENT = 'eth:advisor-open';

export const openAdvisor = () => {
  window.dispatchEvent(new Event(ADVISOR_OPEN_EVENT));
};

/**
 * En móvil (< 768 px) nada fijo tapa la primera pantalla: la barra «Cotizar
 * hosting / Asesor con IA» y el botón flotante del asesor aparecen recién
 * después de bajar esta distancia (px).
 */
export const MOBILE_FIXED_UI_OFFSET = 600;

/** Mismo corte que index.css (`max-width: 767.98px`) para la barra fija y el asesor. */
export const MOBILE_QUERY = '(max-width: 767.98px)';

/**
 * Abre el asesor flotante desde cualquier parte (por ejemplo, la barra fija
 * móvil) sin importar el componente, que se carga aparte.
 */
export const ADVISOR_OPEN_EVENT = 'eth:advisor-open';

export const openAdvisor = () => {
  window.dispatchEvent(new Event(ADVISOR_OPEN_EVENT));
};

/**
 * En móvil (< 768 px), la barra fija «Cotizar hosting / Asesor con IA»
 * aparece después de bajar esta distancia (px). En las páginas que la montan,
 * el botón flotante no se muestra: nada fijo tapa la primera pantalla y,
 * después, el asesor se abre desde la barra.
 */
export const MOBILE_FIXED_UI_OFFSET = 600;

/** <html data-sticky-cta-page="on">: la página monta la barra fija (visible o no). */
export const STICKY_PAGE_ATTR = 'data-sticky-cta-page';

/** Mismo corte que index.css (`max-width: 767.98px`) para la barra fija y el asesor. */
export const MOBILE_QUERY = '(max-width: 767.98px)';

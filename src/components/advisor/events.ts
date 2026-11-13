/**
 * Abre el asesor flotante desde cualquier parte (por ejemplo, la barra fija
 * móvil) sin importar el componente, que se carga aparte.
 */
export const ADVISOR_OPEN_EVENT = 'eth:advisor-open';

export const openAdvisor = () => {
  window.dispatchEvent(new Event(ADVISOR_OPEN_EVENT));
};

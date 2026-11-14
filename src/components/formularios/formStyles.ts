/**
 * Clases y utilidades compartidas de los formularios de cotización y contacto.
 * Objetivos táctiles de 44 px: toda la fila de una opción es clicable.
 */

/** Fila de una opción (radio o casilla). */
export const choiceRow = '-mx-2 flex min-h-11 items-center gap-3 space-y-0 rounded-lg px-2 hover:bg-paper';

/** Etiqueta de la opción: ocupa el resto de la fila. */
export const choiceLabel = 'flex-1 cursor-pointer py-2.5 text-base font-normal leading-snug text-ink md:text-[15px]';

/** Radio y casilla a 20 px (los del sistema miden 16). */
export const choiceControl = 'h-5 w-5 border-ink-2';

/** Etiqueta de campo. */
export const fieldLabel = 'text-[15px] font-semibold text-ink';

/** Disparador del select a 44 px y 16 px de letra en móvil. */
export const selectTrigger = 'h-11 rounded-lg bg-white text-base text-ink md:text-[15px]';

/** Punto final para un mensaje del servidor («Datos inválidos» pasa a «Datos inválidos.»). */
export const asSentence = (text: string) => (/[.!?…]$/.test(text.trim()) ? text.trim() : `${text.trim()}.`);

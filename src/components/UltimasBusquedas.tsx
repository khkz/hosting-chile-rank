/**
 * Retirado en el rediseño «Cercano y confiable».
 *
 * Este bloque no dibujaba nada (una sección vacía) y, si fallaba la lectura de
 * /data/latest.json, rellenaba con dominios inventados. Las páginas que lo
 * usaban ya no lo importan; queda como componente nulo para que ningún import
 * antiguo se rompa. La lista real de dominios recién inscritos está en
 * RecentSearches (ficha de dominio) y en /ultimos-dominios.
 */
const UltimasBusquedas = () => null;

export default UltimasBusquedas;

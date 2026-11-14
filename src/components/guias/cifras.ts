/**
 * Cifras en formato es-CL para textos que también alimentan JSON-LD (FAQ y
 * pasos HowTo). El JSON-LD conserva la cadena original (no se toca el SEO);
 * lo visible se muestra con coma decimal, «99,9 %», rangos con raya y «200 ms».
 * Solo toca porcentajes, milisegundos y rangos numéricos: no cambia versiones
 * («PHP 8.1») ni miles ya escritos con punto («10.000»).
 */
export function cifrasES(texto: string): string {
  return texto
    .replace(/(\d+)\.(\d+)\s?%/g, '$1,$2 %')
    .replace(/(\d)\s?%/g, '$1 %')
    .replace(/(\d+)-(\d+)/g, '$1–$2')
    .replace(/(\d)\s?ms\b/g, '$1 ms');
}

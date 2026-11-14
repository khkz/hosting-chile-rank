import type { ASNSearchResult } from '@/services/asnApi';
import { isChileanASN } from '@/utils/ipDetection';

/** Corrige textos de BGPView que llegan con la codificación rota («AÂ¡» → «á»). */
export const fixMojibake = (text?: string | null): string =>
  (text || '')
    .replace(/AÂ¡/g, 'á')
    .replace(/AÂ­/g, 'í')
    .replace(/AÂ³/g, 'ó')
    .replace(/AÂº/g, 'ú')
    .replace(/AÂ©/g, 'é');

/** El resultado parece chileno: país CL, ASN conocido o nombre de un operador local. */
export const isChileanResult = (r: ASNSearchResult): boolean =>
  r.country_code === 'CL' || isChileanASN(`AS${r.asn}`) || (!!r.name && /chile|claro|entel|movistar|vtr|gtd/i.test(r.name));

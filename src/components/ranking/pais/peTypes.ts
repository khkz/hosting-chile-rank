import { formatMoney } from '@/lib/format';

export type PeCurrency = 'PEN' | 'USD';

export interface PePrice {
  amount: number;
  /** Tope, si el precio es un rango («S/ 90 a S/ 150»). */
  max?: number;
  currency: PeCurrency;
  period?: 'año' | 'mes';
  /** «Desde …» */
  from?: boolean;
}

export interface PeProvider {
  name: string;
  slug?: string;
  rating: number;
  price: PePrice;
  /** Texto original: lo usa el JSON-LD, no cambiarlo. */
  precioNota: string;
  /** Texto original: lo usa el JSON-LD, no cambiarlo. */
  datacenter: string;
  soporteLocal: boolean;
  facturaLocal: boolean;
  litespeed: boolean;
  ssd: boolean;
  destacado?: boolean;
  url: string;
  pros: string[];
  contras: string[];
}

/**
 * Precio con el formateador del sitio. formatMoney entrega «S/ 70.00» (es-PE,
 * dos decimales) y «US$2,99»; el sistema pide «S/ 70» y «US$ 2,99».
 */
export function money(value: number, code: PeCurrency): string {
  return formatMoney(value, code)
    .replace(/[.,]00$/, '')
    .replace(/^(S\/|US\$)\s*/, '$1\u00a0');
}

export function priceText(p: PePrice): string {
  const base = p.max != null ? `${money(p.amount, p.currency)} a ${money(p.max, p.currency)}` : money(p.amount, p.currency);
  return `${p.from ? 'Desde ' : ''}${base}${p.period ? ` al ${p.period}` : ''}`;
}

/**
 * Solo para mostrar: «S/.70/año» pasa a «S/ 70 al año» y el punto medio
 * separador pasa a una coma. Meta y JSON-LD conservan el texto original.
 */
export function displayText(s: string): string {
  return s
    .replace(/S\/\.\s?/g, 'S/\u00a0')
    .replace(/(\d)\/(año|mes)\b/g, '$1 al $2')
    .replace(/\s·\s/g, ', ');
}

/** «Locales tradicionales (Hosting Perú, …)» se parte en título y subtítulo, sin cortar el nombre. */
export function splitName(name: string): { title: string; subtitle?: string } {
  const m = /^(.*?)\s*\((.+)\)$/.exec(name);
  return m ? { title: m[1], subtitle: m[2] } : { title: name };
}

/** Enlaces a nuestro propio sitio (no son «Ir al sitio de …»). */
export const isOwnSite = (url: string) => /(^|\.)eligetuhosting\.(com|cl)\//.test(url.replace(/^https?:\/\//, ''));

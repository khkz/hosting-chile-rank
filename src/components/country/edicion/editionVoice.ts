// Voz de cada edición del .com (Perú, México, Colombia y Argentina).
//
// Solo cambia cómo hablamos, nunca los datos: ciudades reales como ejemplo,
// el registro oficial de reclamos de cada país (ya publicado en la página de
// reputación) y voseo solo en Argentina. Ninguna cifra ni hecho nuevo sobre
// proveedores vive aquí.

import { PUBLISHED_EDITIONS } from '@/lib/countries';

export type ComSlug = 'pe' | 'mx' | 'co' | 'ar';

export interface OfficialRegistry {
  /** Servicio público donde se consultan reclamos o sanciones. */
  service: string;
  /** Organismo que lo publica (vacío si el servicio ya lo nombra). */
  agency: string;
  url: string;
}

interface Voice {
  /** Primera frase de la bajada: la persona y su mercado. */
  hook: string;
  /** «Aquí» (tuteo) o «Acá» (voseo). */
  here: string;
  /** true solo en la edición AR. */
  vos: boolean;
  registry: OfficialRegistry;
}

const VOICE: Record<ComSlug, Voice> = {
  pe: {
    hook: '¿Tu sitio atiende a clientes en Lima, Arequipa o Trujillo?',
    here: 'Aquí',
    vos: false,
    registry: {
      service: 'Mira a Quién le Compras',
      agency: 'INDECOPI',
      url: 'https://www.gob.pe/10285-buscar-empresas-sancionadas-por-indecopi',
    },
  },
  mx: {
    hook: '¿Vendes en la Ciudad de México, Guadalajara o Monterrey?',
    here: 'Aquí',
    vos: false,
    registry: { service: 'Buró Comercial', agency: 'PROFECO', url: 'https://burocomercial.profeco.gob.mx/' },
  },
  co: {
    hook: '¿Tu negocio vende en Bogotá, Medellín o Cali?',
    here: 'Aquí',
    vos: false,
    registry: {
      service: 'Defensa del Consumidor',
      agency: 'SIC',
      url: 'https://www.sic.gov.co/grupo-de-defensa-del-consumidor',
    },
  },
  ar: {
    hook: '¿Tu sitio atiende a clientes en Buenos Aires, Córdoba o Rosario?',
    here: 'Acá',
    vos: true,
    registry: {
      service: 'Defensa del Consumidor',
      agency: '',
      url: 'https://www.argentina.gob.ar/produccion/defensadelconsumidor/hacer-un-reclamo',
    },
  },
};

const WORDS: Record<number, string> = {
  2: 'dos', 3: 'tres', 4: 'cuatro', 5: 'cinco', 6: 'seis', 7: 'siete', 8: 'ocho', 9: 'nueve', 10: 'diez',
};

/** Número en palabras hasta diez («cinco»); desde ahí, en cifras. */
export const countWord = (n: number): string => WORDS[n] ?? String(n);

export const isComSlug = (s: string | undefined | null): s is ComSlug =>
  s === 'pe' || s === 'mx' || s === 'co' || s === 'ar';

export const voiceFor = (slug: ComSlug): Voice => VOICE[slug];

/** «Mira a Quién le Compras (INDECOPI)», «Defensa del Consumidor». */
export const registryName = (r: OfficialRegistry): string => (r.agency ? `${r.service} (${r.agency})` : r.service);

/** Método común: sin nombrar a otro país. */
export const sameMethodLine = (): string =>
  `con el mismo método en los ${countWord(PUBLISHED_EDITIONS.length)} países publicados`;

/** Bajada de la portada de la edición. */
export const editionLead = (slug: ComSlug, countryName: string): string => {
  const v = VOICE[slug];
  return `${v.hook} ${v.here} ves quién es cada proveedor de hosting de ${countryName}, dónde declara tener sus servidores y cómo contactarlo. No publicamos notas hasta verificar reclamos, red y trayectoria, ${sameMethodLine()}.`;
};

/** Título de la sección de rutas: tuteo o voseo. */
export const routesTitle = (slug: ComSlug, countryName: string): string =>
  VOICE[slug].vos
    ? `¿Qué necesitás para tu proyecto en ${countryName}?`
    : `¿Qué necesitas para tu proyecto en ${countryName}?`;

/** Ayuda del estado sin resultados al filtrar. */
export const fewerFiltersHint = (slug: ComSlug): string =>
  VOICE[slug].vos ? 'Probá con menos filtros.' : 'Prueba con menos filtros.';

/** Botón para la primera reseña de un proveedor. */
export const firstReviewLabel = (slug: ComSlug): string =>
  VOICE[slug].vos ? 'Dejá la primera reseña' : 'Deja la primera reseña';

import { PUBLISHED_EDITIONS, VERIFYING_EDITIONS, getEdition, type EditionKey } from '@/lib/countries';

/** Orden de la barra de ediciones: la portada regional y luego los países publicados. */
export const EDITION_ORDER: EditionKey[] = ['LATAM', ...PUBLISHED_EDITIONS.map((e) => e.code)];

export const editionName = (key: EditionKey) => (key === 'LATAM' ? 'Latinoamérica' : getEdition(key).name);

/** Países en verificación sin contar el que se está visitando (ese ya aparece en la barra). */
export const otherVerifyingCount = (active: EditionKey) => VERIFYING_EDITIONS.filter((e) => e.code !== active).length;

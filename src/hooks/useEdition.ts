import { useLocation } from 'react-router-dom';
import { getEdition, resolveEditionKey, type Edition, type EditionKey } from '@/lib/countries';

export interface EditionContext {
  key: EditionKey;
  /** null en la portada regional (LATAM). */
  edition: Edition | null;
  /** Nombre visible de la edición: "Chile", "Perú", "Latinoamérica"… */
  label: string;
}

/** Edición activa según dominio y ruta (ver resolveEditionKey). */
export const useEdition = (): EditionContext => {
  const { pathname } = useLocation();
  const key = resolveEditionKey(pathname);
  if (key === 'LATAM') return { key, edition: null, label: 'Latinoamérica' };
  const edition = getEdition(key);
  return { key, edition, label: edition.name };
};

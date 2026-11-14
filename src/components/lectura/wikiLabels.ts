import type { WikiTerm } from '@/data/wiki/terms';

/** Etiquetas legibles de nivel y CMS (las claves de la base van sin tilde ni mayúsculas). */
export const LEVEL_LABEL: Record<WikiTerm['level'], string> = {
  basico: 'Básico',
  medio: 'Medio',
  avanzado: 'Avanzado',
};

export const CMS_LABEL: Record<WikiTerm['cms'], string> = {
  wordpress: 'WordPress',
  joomla: 'Joomla',
  moodle: 'Moodle',
  general: 'General',
  drupal: 'Drupal',
  prestashop: 'PrestaShop',
};

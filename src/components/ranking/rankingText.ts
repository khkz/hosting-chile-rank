// Limpieza de textos del ranking que vienen de la base.

/** Elimina de las features cualquier mención de antigüedad o cifra de precio (dato no verificado). */
export const cleanFeatures = (features?: string[] | null) =>
  (features || []).filter((f) => !/años?\s+(operando|en el mercado)|\$\s?\d/i.test(f));

/** El cta_text de la BD puede traer precios interpolados; los retiramos. */
export const cleanCtaText = (text?: string | null) => {
  const cleaned = (text || '')
    .replace(/\s*(desde|por)?\s*\$\s?[\d.,]+\s*(CLP)?\s*(\/\s*(mes|año)|mensuales?|al mes)?/gi, '')
    .replace(/\s+y\s+precios\s*$/i, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
  return cleaned || 'Ver planes';
};

/** Utilidades del Markdown de la metodología (separadas para la recarga en caliente). */

/** Quita un «# Título» inicial: la página ya tiene su H1 y muestra la versión aparte. */
export const stripLeadingH1 = (md: string) => md.replace(/^\s*#\s+[^\n]*\n+/, '');

/** «Qué medimos» pasa a «que-medimos» (mismo id en el índice y en el H2). */
export const slugify = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** Índice a partir de los «## …» del Markdown. */
export const markdownToc = (md: string) =>
  [...stripLeadingH1(md).matchAll(/^##\s+(.+)$/gm)].map((m) => {
    const label = m[1].replace(/[*_`]/g, '').trim();
    return { id: slugify(label), label };
  });

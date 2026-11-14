import type { TocItem } from '@/components/reading/ReadingLayout';

/** Convierte «¿Por qué WordPress domina?» en «por-que-wordpress-domina». */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]+/g, '')
    .trim()
    .replace(/[\s-]+/g, '-');
}

/**
 * Separa el ancla explícita de un encabezado Markdown («Título {#ancla}»).
 * Sin ancla explícita, la deriva del texto con `slugify`.
 */
export function splitHeading(text: string): { clean: string; id: string } {
  const m = text.match(/\s*\{#([^}]+)\}\s*$/);
  const clean = text.replace(/\s*\{#[^}]+\}\s*$/g, '').trim();
  return { clean, id: m ? m[1].trim() : slugify(clean) };
}

/** Texto plano de los hijos de un nodo React (para encabezados con negrita o código). */
export function textOf(children: unknown): string {
  if (typeof children === 'string' || typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(textOf).join('');
  if (children && typeof children === 'object' && 'props' in (children as Record<string, unknown>)) {
    return textOf((children as { props?: { children?: unknown } }).props?.children);
  }
  return '';
}

/** Índice desde los `## ` de un Markdown, con las mismas anclas que dibuja la página. */
export function markdownToc(markdown: string | undefined): TocItem[] {
  if (!markdown) return [];
  const items: TocItem[] = [];
  let inFence = false;
  for (const line of markdown.split('\n')) {
    if (/^\s*```/.test(line)) inFence = !inFence;
    if (inFence) continue;
    const m = /^##\s+(.+?)\s*$/.exec(line);
    if (!m) continue;
    const raw = m[1].replace(/\*\*|__|`/g, '');
    const { clean, id } = splitHeading(raw);
    if (clean && id) items.push({ id, label: clean });
  }
  return items;
}

/** Agrega `id` a los <h2> de un HTML propio y devuelve el índice. */
export function withHeadingIds(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const used = new Set<string>();
  const out = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_m, inner: string) => {
    const label = inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const base = slugify(label) || 'seccion';
    let id = base;
    for (let n = 2; used.has(id); n += 1) id = `${base}-${n}`;
    used.add(id);
    toc.push({ id, label });
    return `<h2 id="${id}">${inner}</h2>`;
  });
  return { html: out, toc };
}

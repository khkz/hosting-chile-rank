/**
 * Páginas fijas de eligetuhosting.cl y lectura del HTML estático de public/.
 * Fuente única para generate-sitemap.mjs y generate-llms-data.mjs.
 *
 * Regla para anunciar una ruta de Chile: la ruta tiene contenido propio en la app y
 * ningún HTML estático de public/ para esa ruta declara otro canonical ni noindex.
 * Si el HTML de una ruta cambia (por ejemplo, al volver a prerenderizar), la ruta entra
 * o sale sola en la siguiente generación.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const SITE = 'https://eligetuhosting.cl';

// [ruta, prioridad, frecuencia, grupo]. Grupo «guia» alimenta la sección de guías de llms.txt.
export const CL_PAGES = [
  ['/mejor-hosting-chile-2026', '1.0', 'daily', 'principal'],
  ['/', '0.9', 'daily', 'principal'],
  ['/ranking', '0.9', 'daily', 'principal'],
  ['/transparencia-hosting-chile', '0.9', 'weekly', 'principal'],
  ['/reclamos', '0.9', 'daily', 'herramienta'],
  ['/catalogo', '0.8', 'daily', 'principal'],
  ['/directorio', '0.8', 'daily', 'principal'],
  ['/mejor-hosting-wordpress-chile', '0.9', 'weekly', 'hub'],
  ['/mejor-hosting-ecommerce-chile', '0.9', 'weekly', 'hub'],
  ['/mejor-hosting-pymes-chile', '0.9', 'weekly', 'hub'],
  ['/mejor-vps-chile', '0.9', 'weekly', 'hub'],
  ['/comparativa', '0.8', 'weekly', 'principal'],
  ['/cotiza-hosting', '0.8', 'weekly', 'herramienta'],
  ['/recursos-hosting-chile', '0.7', 'weekly', 'principal'],
  ['/dominios-premium', '0.7', 'weekly', 'herramienta'],
  ['/certificaciones', '0.7', 'monthly', 'principal'],
  ['/guia-elegir-hosting', '0.8', 'weekly', 'guia'],
  ['/guia-completa-elegir-hosting-chile-2026', '0.8', 'weekly', 'guia'],
  ['/guia-hosting-wordpress', '0.8', 'weekly', 'guia'],
  ['/guia-elegir-vps', '0.8', 'weekly', 'guia'],
  ['/guia-elegir-ssl', '0.8', 'weekly', 'guia'],
  ['/guia-elegir-cdn', '0.8', 'weekly', 'guia'],
  ['/guia-elegir-servidor-dedicado', '0.8', 'weekly', 'guia'],
  ['/guia-migrar-hosting', '0.8', 'weekly', 'guia'],
  ['/guia-seguridad-web', '0.8', 'weekly', 'guia'],
  ['/guia-hosting-mas-seguro-chile', '0.8', 'weekly', 'guia'],
  ['/errores-comunes-elegir-hosting', '0.7', 'monthly', 'guia'],
  ['/hosting-wordpress-blog-personal-chile', '0.7', 'weekly', 'guia'],
  ['/metodologia', '0.7', 'monthly', 'principal'],
  ['/metodologia-benchmark', '0.7', 'monthly', 'principal'],
  ['/blog', '0.7', 'daily', 'principal'],
  ['/contacto', '0.6', 'monthly', 'otra'],
  ['/quienes-somos', '0.7', 'monthly', 'otra'],
  ['/vota-hosting', '0.6', 'weekly', 'herramienta'],
  ['/calculadora-tco', '0.6', 'monthly', 'herramienta'],
  ['/benchmark', '0.6', 'weekly', 'principal'],
  ['/estudio-hosting-chile-2026', '0.9', 'yearly', 'principal'],
].map(([path, prio, freq, group]) => ({ path, prio, freq, group }));

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const decode = (s) => s
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m);
const text = (html) => decode(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`, 'i'))?.[1] ?? null;

const cache = new Map();

/** Cabecera del HTML estático de una ruta en public/, o null si la ruta no tiene HTML propio. */
export function staticHead(path, publicDir = 'public') {
  if (cache.has(path)) return cache.get(path);
  const file = path === '/' ? null : join(publicDir, path.replace(/^\/+|\/+$/g, ''), 'index.html');
  let head = null;
  if (file && existsSync(file)) {
    const html = readFileSync(file, 'utf8');
    const links = html.match(/<link\b[^>]*>/gi) || [];
    const metas = html.match(/<meta\b[^>]*>/gi) || [];
    const canonicalTag = links.find((t) => (attr(t, 'rel') || '').toLowerCase() === 'canonical');
    const robotsTag = metas.find((t) => (attr(t, 'name') || '').toLowerCase() === 'robots');
    head = {
      canonical: canonicalTag ? attr(canonicalTag, 'href') : null,
      robots: robotsTag ? attr(robotsTag, 'content') : null,
      title: text(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? ''),
      h1: text(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? ''),
    };
  }
  cache.set(path, head);
  return head;
}

const same = (a, b) => a.replace(/\/+$/, '') === b.replace(/\/+$/, '');

/**
 * ¿Se puede anunciar la ruta? Falso si su HTML estático declara otro canonical o noindex.
 * Devuelve { ok, reason } para poder registrar por qué se omite.
 */
export function announceable(path, publicDir = 'public') {
  const head = staticHead(path, publicDir);
  if (!head) return { ok: true, reason: 'sin HTML propio' };
  if (head.robots && /noindex/i.test(head.robots)) return { ok: false, reason: `robots ${head.robots}` };
  if (head.canonical && !same(head.canonical, SITE + path)) return { ok: false, reason: `canonical ${head.canonical}` };
  return { ok: true, reason: 'HTML propio' };
}

/**
 * ¿Lo puede leer un rastreador sin JavaScript? Exige HTML propio en public/ (la portada
 * cuenta, porque el index.html raíz es su HTML) y que se pueda anunciar.
 */
export function readableWithoutJs(path, publicDir = 'public') {
  if (path === '/') return true;
  return !!staticHead(path, publicDir) && announceable(path, publicDir).ok;
}

// Reseñas que el sitemap ya anunciaba. Estas páginas publican schema Review con nota;
// sumar otras queda para cuando se revise ese schema. Se cruzan con resenaSlugs(), así
// que una clave que no existe en resenaData.ts no sale.
export const RESENAS_EN_SITEMAP = ['hostingplus', 'ecohosting', '1hosting', 'hostgator', 'bluehost', 'donweb', 'godaddy'];

/** Claves de reseñas editoriales (src/components/ficha/resenaData.ts). */
export function resenaSlugs(file = 'src/components/ficha/resenaData.ts') {
  try {
    const src = readFileSync(file, 'utf8');
    return [...src.matchAll(/^\s{2}'([a-z0-9-]+)':\s*\{/gm)].map((m) => m[1]);
  } catch (e) {
    console.log('⚠️  No se pudo leer resenaData.ts:', e.message);
    return [];
  }
}

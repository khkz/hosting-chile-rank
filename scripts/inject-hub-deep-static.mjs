#!/usr/bin/env node
/**
 * P2-2d: inyecta HTML semántico crawleable (StoryBrand deep sections)
 * en los 4 estáticos de hubs, para que GPTBot/Perplexity/etc. sin JS lo vean.
 * El bloque se marca con id="hub-deep-static" e incluye style="display:none"
 * en el momento de la hidratación React reemplaza el contenido de #root,
 * por lo que no hay duplicación visual para usuarios con JS.
 *
 * Fuente: src/lib/hubDeepContent.ts (parseado como texto, sin bundler).
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const HUBS = [
  { key: 'wordpress', file: 'public/mejor-hosting-wordpress-chile/index.html' },
  { key: 'pymes',     file: 'public/mejor-hosting-pymes-chile/index.html' },
  { key: 'ecommerce', file: 'public/mejor-hosting-ecommerce-chile/index.html' },
  { key: 'vps',       file: 'public/mejor-vps-chile/index.html' },
];

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));

// Cargar el contenido usando ts-eval simple: leer el archivo y evaluar la constante.
// Como es TS con tipos, extraemos el objeto HUB_DEEP con un mini-transform.
async function loadHubDeep() {
  const src = await readFile(join(ROOT, 'src/lib/hubDeepContent.ts'), 'utf8');
  // Eliminar imports/types/exports para poder new Function()
  const body = src
    .replace(/^import[^\n]*\n/gm, '')
    .replace(/export\s+interface[\s\S]*?^\}\s*$/gm, '')
    .replace(/export\s+const\s+HUB_DEEP\s*:\s*Record<[^>]+>\s*=/, 'const HUB_DEEP =')
    + '\nreturn HUB_DEEP;';
  return new Function(body)();
}

function renderDeep(d) {
  const pains = d.problem.pains.map(p => `<li><span aria-hidden="true">✗</span> ${esc(p)}</li>`).join('');
  const pillars = d.guide.pillars.map(p => `<div><strong>${esc(p.h)}</strong><p>${esc(p.p)}</p></div>`).join('');
  const steps = d.plan.steps.map(s => `<li>${esc(s)}</li>`).join('');
  const journeys = d.journeys.map(j => `
    <article>
      <h3>${esc(j.persona)}</h3>
      <p>${esc(j.scenario)}</p>
      <p><em>Recomendado:</em> ${esc(j.recommendation)}</p>
      <p><a href="/catalogo/${esc(j.slug)}">Ver ficha</a>${j.guide ? ` · <a href="${esc(j.guide.href)}">${esc(j.guide.label)}</a>` : ''}</p>
    </article>`).join('');
  const objections = d.objections.map(o => `<details><summary>${esc(o.q)}</summary><p>${esc(o.a)}</p></details>`).join('');
  const links = d.internalLinks.map(l => `<li><a href="${esc(l.href)}">${esc(l.label)}</a></li>`).join('');
  const criteria = d.criteria.map(c => `<li>${esc(c)}</li>`).join('');

  return `<div id="hub-deep-static" style="display:none" aria-hidden="true">
<section><p><strong>Divulgación:</strong> algunos enlaces "Visitar sitio" son de afiliados; la comisión no afecta el orden del ranking. El orden depende únicamente de datos verificables (ASN, TTFB medido, uptime, reclamos, reputación). Precios verificados a julio 2026.</p></section>
<section><p>${esc(d.protagonist)}</p></section>
<section><h2>${esc(d.problem.title)}</h2><p>${esc(d.problem.body)}</p><ul>${pains}</ul></section>
<section><h2>${esc(d.guide.title)}</h2><p>${esc(d.guide.body)}</p>${pillars}<p><small>Datos que verificamos:</small></p><ul>${criteria}</ul></section>
<section><h2>${esc(d.plan.title)}</h2><ol>${steps}</ol></section>
<section><h2>¿En qué caso estás?</h2>${journeys}</section>
<section><h2>Objeciones frecuentes (respondidas con datos)</h2>${objections}</section>
<section><h2>Sigue investigando</h2><ul>${links}</ul></section>
</div>`;
}

const MARK_START = '<!-- hub-deep-static:start -->';
const MARK_END = '<!-- hub-deep-static:end -->';

async function main() {
  const HUB_DEEP = await loadHubDeep();
  let done = 0;
  for (const { key, file } of HUBS) {
    const d = HUB_DEEP[key];
    if (!d) { console.warn(`[hub-deep] no data for ${key}`); continue; }
    const full = join(ROOT, file);
    let html = await readFile(full, 'utf8');
    const block = MARK_START + renderDeep(d) + MARK_END;

    if (html.includes(MARK_START) && html.includes(MARK_END)) {
      html = html.replace(new RegExp(`${MARK_START}[\\s\\S]*?${MARK_END}`), block);
    } else {
      // Insertar como primer hijo de <div id="root">
      html = html.replace('<div id="root">', `<div id="root">${block}`);
    }
    await writeFile(full, html, 'utf8');
    console.log(`[hub-deep] ✓ ${file} (${html.length} bytes)`);
    done++;
  }
  console.log(`[hub-deep] listo: ${done}/${HUBS.length}`);
}

main().catch(e => { console.error('[hub-deep] error:', e); process.exit(1); });

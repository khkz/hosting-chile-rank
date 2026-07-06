// Shared shell builder for programmatic (no-puppeteer) prerender.
// Reads index.html once, SANITIZES it (strips prerendered CL body + stale CL meta)
// and produces per-page HTML with the correct <head> and a real crawleable <body>.
// The bundle JS (/src/main.tsx → /assets/index.js) stays intact so the SPA
// still hydrates on top of the static content for human visitors.
import fs from 'node:fs/promises';

const RAW = await fs.readFile('index.html', 'utf8');

// Strip everything that Chile's homepage prerender injected inside #root.
// The file is a giant single line; we look for the FIRST `<div id="root">`
// and drop everything until `</body>` (exclusive), replacing with an empty root.
function stripPrerenderedBody(html) {
  const startIdx = html.indexOf('<div id="root">');
  const endIdx = html.lastIndexOf('</body>');
  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) return html;
  return html.slice(0, startIdx) + '<div id="root"></div>' + html.slice(endIdx);
}

// Strip Chile-specific head meta so we can rewrite them per-country cleanly.
function stripStaleMeta(html) {
  return html
    .replace(/<meta property="og:site_name"[^>]*>/gi, '')
    .replace(/<meta property="og:locale"[^>]*>/gi, '')
    .replace(/<meta name="twitter:card"[^>]*>/gi, '')
    .replace(/<meta property="og:image"[^>]*>/gi, '')
    .replace(/<meta name="twitter:image"[^>]*>/gi, '')
    .replace(/<link rel="canonical"[^>]*>/gi, '')
    .replace(/<meta property="og:url"[^>]*>/gi, '')
    .replace(/<meta property="og:title"[^>]*>/gi, '')
    .replace(/<meta property="og:description"[^>]*>/gi, '')
    .replace(/<meta name="description"[^>]*>/gi, '')
    .replace(/<meta name="keywords"[^>]*>/gi, '');
}

export const CLEAN_SHELL = stripStaleMeta(stripPrerenderedBody(RAW));

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/**
 * Build the final HTML for a page.
 * - Rewrites <html lang>, <title>, description, canonical, og:*, twitter:*
 * - Injects per-page JSON-LD via `headExtra`
 * - Replaces empty <div id="root"></div> with the crawleable bodyContent
 */
export function buildHtml({ title, description, canonical, locale = 'es', headExtra = '', bodyContent = '', keywords = '' }) {
  let html = CLEAN_SHELL;
  html = html.replace(/<html lang="[^"]*"/i, `<html lang="${esc(locale)}"`);
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${esc(title)}</title>`);
  const injected = [
    `<meta name="description" content="${esc(description)}" />`,
    keywords ? `<meta name="keywords" content="${esc(keywords)}" />` : '',
    `<link rel="canonical" href="${esc(canonical)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="EligeTuHosting" />`,
    `<meta property="og:locale" content="${esc(locale.replace('-', '_'))}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${esc(canonical)}" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="robots" content="index,follow" />`,
    headExtra || '',
  ].filter(Boolean).join('\n    ');
  html = html.replace(/<\/head>/i, `    ${injected}\n  </head>`);
  const wrapped = `<div id="prerender-content" style="max-width:960px;margin:0 auto;padding:24px;font-family:system-ui,sans-serif;color:#2B2D42;line-height:1.55">${bodyContent}</div>`;
  html = html.replace(/<div id="root"><\/div>/i, `<div id="root">${wrapped}</div>`);
  return html;
}

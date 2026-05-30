#!/usr/bin/env node
/**
 * Postbuild prerender: lanza `vite preview`, abre cada ruta listada
 * en Chromium headless y guarda el HTML renderizado en dist/<ruta>/index.html.
 * Esto permite que los crawlers de LLMs (GPTBot, ClaudeBot, PerplexityBot, etc.)
 * que NO ejecutan JS lean el contenido real de cada página.
 *
 * El script es tolerante a errores: si algo falla, no rompe el build.
 */
import { spawn } from 'node:child_process';
import { mkdir, writeFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const PORT = 4319;
const ORIGIN = `http://127.0.0.1:${PORT}`;

// Rutas estáticas prioritarias para prerender (sin :slug, sin admin/auth).
const ROUTES = [
  '/',
  '/mejor-hosting-chile-2026',
  '/mejor-hosting-wordpress-chile-2026',
  '/mejor-hosting-ecommerce-chile-2026',
  '/ranking',
  '/comparativa',
  '/catalogo',
  '/benchmark',
  '/metodologia',
  '/metodologia-benchmark',
  '/nuestro-metodo',
  '/guia-elegir-hosting',
  '/guia-elegir-vps',
  '/guia-elegir-servidor-dedicado',
  '/guia-elegir-cdn',
  '/guia-elegir-ssl',
  '/guia-migrar-hosting',
  '/guia-seguridad-web',
  '/guia-hosting-mas-seguro-chile',
  '/guia-hosting-wordpress',
  '/guia-completa-elegir-hosting-chile-2026',
  '/errores-comunes-elegir-hosting',
  '/recursos-hosting-chile',
  '/ultimos-dominios',
  '/dominios-premium',
  '/calculadora-tco',
  '/acerca-de',
  '/sobre-nosotros',
  '/asn',
  '/asn/chile',
  '/wiki',
  '/blog',
  '/hosting-wordpress-blog-personal-chile',
  '/estudio-hosting-chile-2026',
  '/cotiza-hosting',
];

const log = (...a) => console.log('[prerender]', ...a);
const warn = (...a) => console.warn('[prerender]', ...a);

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await fetch(url);
      if (r.ok) return true;
    } catch {}
    await new Promise(r => setTimeout(r, 250));
  }
  return false;
}

async function main() {
  if (!(await exists(DIST))) {
    warn('dist/ no existe, saltando prerender.');
    return;
  }

  let puppeteer;
  try {
    puppeteer = (await import('puppeteer-core')).default;
  } catch (e) {
    warn('puppeteer-core no disponible, saltando prerender.', e.message);
    return;
  }

  // Lanzar vite preview en background
  log(`Iniciando vite preview en puerto ${PORT}…`);
  const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: ROOT,
    stdio: 'pipe',
    env: { ...process.env },
  });
  preview.stdout.on('data', d => process.stdout.write(`[vite] ${d}`));
  preview.stderr.on('data', d => process.stderr.write(`[vite] ${d}`));

  const cleanup = () => { try { preview.kill('SIGTERM'); } catch {} };
  process.on('exit', cleanup);

  try {
    const up = await waitForServer(ORIGIN, 30000);
    if (!up) { warn('vite preview no respondió, abortando.'); cleanup(); return; }

    const chromiumPath = process.env.PUPPETEER_EXECUTABLE_PATH
      || '/usr/bin/chromium' ;
    log(`Usando chromium en ${chromiumPath}`);

    const browser = await puppeteer.launch({
      executablePath: chromiumPath,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    let ok = 0, fail = 0;
    for (const route of ROUTES) {
      const url = `${ORIGIN}${route}`;
      try {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (compatible; LovablePrerender/1.0)');
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 25000 });
        // Pequeña espera adicional para hydration y data fetching
        await new Promise(r => setTimeout(r, 800));
        const html = await page.content();
        await page.close();

        // Guardar como <route>/index.html
        const outDir = route === '/' ? DIST : join(DIST, route);
        await mkdir(outDir, { recursive: true });
        // Para '/' sobrescribimos dist/index.html con la versión prerenderizada
        const outFile = join(outDir, 'index.html');
        await writeFile(outFile, html, 'utf8');
        ok++;
        log(`✓ ${route}`);
      } catch (e) {
        fail++;
        warn(`✗ ${route}: ${e.message}`);
      }
    }

    await browser.close();
    log(`Listo. ${ok} ok, ${fail} fallidas.`);
  } catch (e) {
    warn('Error en prerender:', e.message);
  } finally {
    cleanup();
  }
}

main().catch(e => { warn('Fallo crítico:', e.message); process.exit(0); });

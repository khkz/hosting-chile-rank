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
  // Hubs de intención (Authority Part 2)
  '/mejor-hosting-wordpress-chile',
  '/mejor-hosting-ecommerce-chile',
  '/mejor-hosting-pymes-chile',
  '/mejor-vps-chile',
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

// Build comparativa VS pairs (canonical: alphabetical, anchors last) from DB
async function fetchVsPairRoutes(slugs) {
  if (!slugs?.length) return [];
  const ANCHORS = new Set(['hostingplus', 'ecohosting']);
  const isAnchor = (s) => ANCHORS.has(s);
  const canonicalPair = (x, y) => {
    if (isAnchor(x) && !isAnchor(y)) return `${y}-vs-${x}`;
    if (isAnchor(y) && !isAnchor(x)) return `${x}-vs-${y}`;
    if (isAnchor(x) && isAnchor(y)) return x === 'hostingplus' ? `${x}-vs-${y}` : `${y}-vs-${x}`;
    return x < y ? `${x}-vs-${y}` : `${y}-vs-${x}`;
  };
  const set = new Set();
  for (let i = 0; i < slugs.length; i++) {
    for (let j = i + 1; j < slugs.length; j++) {
      set.add(`/comparativa/${canonicalPair(slugs[i], slugs[j])}`);
    }
  }
  return [...set];
}

async function fetchAlternativasRoutes(slugs) {
  return slugs.filter(s => s !== 'hostingplus' && s !== 'ecohosting').map(s => `/alternativas-a/${s}`);
}

const MIGRATION_COMPETITORS = ['hostgator','bluehost','godaddy','hostingcl','planetahosting','fasthosting','cloudhosting','webhosting'];
async function fetchMigrarRoutes(slugs) {
  return MIGRATION_COMPETITORS.filter(s => slugs.includes(s)).map(s => `/migrar-de/${s}`);
}

// Fetch verified+curated slugs from Supabase
async function fetchCatalogSlugs() {
  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://oegvwjxrlmtwortyhsrv.supabase.co';
  const KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!KEY) {
    console.log('[prerender] sin SUPABASE_ANON_KEY: salto fichas/comparativas/alternativas');
    return [];
  }
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/hosting_companies?select=slug&is_verified=eq.true&is_curated=eq.true`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map(r => r.slug);
  } catch (e) {
    console.log('[prerender] error fetching slugs:', e.message);
    return [];
  }
}




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

// Allow disabling prerender entirely via env var, but never silently skip on prod build.
const SOFT_FAIL = process.env.PRERENDER_SOFT_FAIL === '1';

function die(msg) {
  console.error('[prerender] ERROR FATAL:', msg);
  if (SOFT_FAIL) { console.error('[prerender] PRERENDER_SOFT_FAIL=1, saliendo 0'); process.exit(0); }
  process.exit(1);
}

async function loadPuppeteer() {
  // 1) Si hay un Chromium del sistema (PUPPETEER_EXECUTABLE_PATH o rutas conocidas),
  //    usar puppeteer-core directamente — es lo que funciona en el sandbox de Lovable.
  const sysChromium = await findSystemChromium();
  if (sysChromium) {
    try {
      const mod = (await import('puppeteer-core')).default;
      log(`Usando puppeteer-core + chromium del sistema (${sysChromium})`);
      return { mod, kind: 'core' };
    } catch (e) {
      log('puppeteer-core no disponible:', e.message);
    }
  }
  // 2) Fallback: paquete `puppeteer` completo (chromium bundled via postinstall).
  try {
    const mod = (await import('puppeteer')).default;
    log('Usando paquete `puppeteer` (chromium bundled)');
    return { mod, kind: 'full' };
  } catch (e) {
    die('Ni chromium del sistema ni `puppeteer` (full) disponibles: ' + e.message);
  }
}

async function findSystemChromium() {
  const candidates = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
  ].filter(Boolean);
  for (const p of candidates) {
    if (await exists(p)) return p;
  }
  return null;
}

async function main() {
  if (!(await exists(DIST))) {
    die('dist/ no existe — el build de Vite debe correr ANTES de prerender.');
  }

  const { mod: puppeteer, kind } = await loadPuppeteer();

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

  let browser;
  try {
    const up = await waitForServer(ORIGIN, 30000);
    if (!up) { cleanup(); die('vite preview no respondió en 30s.'); }

    const launchOpts = {
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        // CRÍTICO con concurrencia: sin estos flags, las pestañas en background
        // throttlean requestAnimationFrame y react-helmet-async NUNCA aplica
        // title/canonical/meta (quedaría el <head> genérico del index.html).
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
      ],
    };
    if (kind === 'core') {
      const chromiumPath = await findSystemChromium();
      if (!chromiumPath) { cleanup(); die('Chromium no encontrado en el sistema y `puppeteer` (full) no instalado.'); }
      log(`Chromium: ${chromiumPath}`);
      launchOpts.executablePath = chromiumPath;
    }
    browser = await puppeteer.launch(launchOpts);

    const slugs = await fetchCatalogSlugs();
    const catalogoRoutes = slugs.map(s => `/catalogo/${s}`);
    const vsRoutes = await fetchVsPairRoutes(slugs);
    const altRoutes = await fetchAlternativasRoutes(slugs);
    const migrarRoutes = await fetchMigrarRoutes(slugs);
    const allRoutes = [...ROUTES, ...catalogoRoutes, ...vsRoutes, ...altRoutes, ...migrarRoutes];
    log(`Plan: ${allRoutes.length} rutas = ${ROUTES.length} estáticas + ${catalogoRoutes.length} fichas + ${vsRoutes.length} VS + ${altRoutes.length} alternativas + ${migrarRoutes.length} migración`);


    // COPY_TO_PUBLIC=1: además de dist/, escribir el HTML en public/<ruta>/index.html
    // para dejarlo COMMITEADO (la plataforma de Lovable NO ejecuta este script en el
    // build de producción; Vite copia public/ tal cual a dist/, así el HTML por ruta
    // llega a producción garantizado). La raíz '/' nunca se escribe en public/
    // (conflicto con el index.html de Vite).
    const COPY_TO_PUBLIC = process.env.COPY_TO_PUBLIC === '1';
    const PUBLIC_DIR = join(ROOT, 'public');
    const CONCURRENCY = Math.max(1, Number(process.env.PRERENDER_CONCURRENCY || 6));

    let ok = 0, fail = 0, cursor = 0;
    const renderOne = async (route) => {
      const url = `${ORIGIN}${route}`;
      const page = await browser.newPage();
      try {
        await page.setUserAgent('Mozilla/5.0 (compatible; LovablePrerender/1.0)');
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 25000 });
        // Esperar a que react-helmet-async haya aplicado los tags del <head>
        // (marca los tags gestionados con data-rh). Tolerante: si una ruta no
        // usa Helmet, seguimos tras el timeout.
        await page.waitForFunction(
          () => !!document.head.querySelector('[data-rh]'),
          { timeout: 8000 }
        ).catch(() => {});
        await new Promise(r => setTimeout(r, 400));
        const html = await page.content();

        const outDir = route === '/' ? DIST : join(DIST, route);
        await mkdir(outDir, { recursive: true });
        await writeFile(join(outDir, 'index.html'), html, 'utf8');
        if (COPY_TO_PUBLIC && route !== '/') {
          const pubDir = join(PUBLIC_DIR, route);
          await mkdir(pubDir, { recursive: true });
          await writeFile(join(pubDir, 'index.html'), html, 'utf8');
        }
        ok++;
      } finally {
        await page.close().catch(() => {});
      }
    };

    const workers = Array.from({ length: CONCURRENCY }, async () => {
      while (cursor < allRoutes.length) {
        const route = allRoutes[cursor++];
        try {
          await renderOne(route);
          if ((ok + fail) % 25 === 0) log(`Progreso: ${ok + fail}/${allRoutes.length}`);
        } catch (e) {
          fail++;
          warn(`✗ ${route}: ${e.message}`);
        }
      }
    });
    await Promise.all(workers);

    await browser.close();
    log(`Resultado: ${ok} ok, ${fail} fallidas, ${allRoutes.length} totales.`);

    if (ok === 0) { cleanup(); die('0 rutas prerenderizadas — abortando build para evitar publicar SPA shell.'); }
    if (fail > ok / 2) { cleanup(); die(`Demasiadas fallas (${fail}/${allRoutes.length}).`); }
  } catch (e) {
    try { await browser?.close(); } catch {}
    cleanup();
    die('Excepción: ' + e.message);
  } finally {
    cleanup();
  }
}

main().catch(e => die('Fallo crítico: ' + e.message));

#!/usr/bin/env node
/**
 * Genera versiones AVIF + WebP optimizadas para los PNG/JPG de public/images.
 * Se ejecuta en prebuild. Saltea silenciosamente si sharp no está disponible.
 *
 * Para cada <name>.png genera:
 *   <name>.avif  (calidad 50)
 *   <name>.webp  (calidad 78)
 * Solo regenera si la fuente es más nueva que el destino.
 */
import { readdir, stat } from 'node:fs/promises';
import { join, parse } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SRC_DIR = join(ROOT, 'public', 'images');

const log = (...a) => console.log('[optimize-images]', ...a);
const warn = (...a) => console.warn('[optimize-images]', ...a);

async function newer(srcPath, outPath) {
  try {
    const s = await stat(srcPath);
    const o = await stat(outPath);
    return s.mtimeMs > o.mtimeMs;
  } catch {
    return true; // out no existe → hay que generar
  }
}

async function main() {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch (e) {
    warn('sharp no disponible, saltando optimización.', e.message);
    return;
  }

  let entries;
  try {
    entries = await readdir(SRC_DIR);
  } catch {
    warn(`Directorio no encontrado: ${SRC_DIR}`);
    return;
  }

  const sources = entries.filter(f => /\.(png|jpe?g)$/i.test(f));
  let made = 0, skipped = 0, failed = 0;

  for (const file of sources) {
    const srcPath = join(SRC_DIR, file);
    const { name } = parse(file);
    const avifPath = join(SRC_DIR, `${name}.avif`);
    const webpPath = join(SRC_DIR, `${name}.webp`);

    // Solo procesar si la fuente pesa > 80 KB
    try {
      const s = await stat(srcPath);
      if (s.size < 80 * 1024) { skipped++; continue; }
    } catch { continue; }

    try {
      const img = sharp(srcPath);
      const meta = await img.metadata();
      const maxWidth = Math.min(meta.width || 1600, 1600);

      if (await newer(srcPath, avifPath)) {
        await sharp(srcPath)
          .resize({ width: maxWidth, withoutEnlargement: true })
          .avif({ quality: 50, effort: 4 })
          .toFile(avifPath);
        log(`✓ ${name}.avif`);
        made++;
      }
      if (await newer(srcPath, webpPath)) {
        await sharp(srcPath)
          .resize({ width: maxWidth, withoutEnlargement: true })
          .webp({ quality: 78, effort: 4 })
          .toFile(webpPath);
        log(`✓ ${name}.webp`);
        made++;
      }
    } catch (e) {
      warn(`✗ ${file}: ${e.message}`);
      failed++;
    }
  }

  log(`Listo. ${made} generadas, ${skipped} omitidas (<80KB), ${failed} fallidas.`);
}

main().catch(e => { warn('Fallo crítico:', e.message); process.exit(0); });

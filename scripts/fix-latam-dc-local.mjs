// Fix `datacenter_local` in-place across the LATAM JSON files.
// Runs after generate-llms-data has written the per-country files, and
// updates the unified proveedores-latam.json using the corrected logic
// (negations like "sin datacenter en Perú" no longer produce a positive).
import fs from 'node:fs/promises';
import { hasLocalDatacenter, datacenterLocalStatus } from './lib/dc-local.mjs';

const COUNTRY_BY_CODE = { PE: 'pe', MX: 'mx', CO: 'co', AR: 'ar', CL: null };

async function patchFile(path, mode) {
  let raw;
  try { raw = await fs.readFile(path, 'utf8'); } catch { return { path, skipped: true }; }
  const doc = JSON.parse(raw);
  const list = doc.proveedores || [];
  let changed = 0;
  let localCount = 0;
  for (const p of list) {
    const cslug = mode === 'country' ? doc.pais?.toLowerCase() : COUNTRY_BY_CODE[p.pais];
    if (!cslug) { // Chile / unknown → leave datacenter_local untouched
      continue;
    }
    const next = datacenterLocalStatus(cslug, p.datacenter);
    if (p.datacenter_local !== next) changed++;
    p.datacenter_local = next;
    if (next === true) localCount++;
  }
  doc.fecha_generacion = new Date().toISOString();
  await fs.writeFile(path, JSON.stringify(doc, null, 2) + '\n', 'utf8');
  return { path, total: list.length, changed, localCount };
}

const results = [];
for (const cslug of ['pe', 'mx', 'co', 'ar']) {
  results.push(await patchFile(`public/data/proveedores-${cslug}.json`, 'country'));
}
results.push(await patchFile('public/data/proveedores-latam.json', 'latam'));

console.log('🔧 fix-latam-dc-local:');
for (const r of results) console.log('  ', r);

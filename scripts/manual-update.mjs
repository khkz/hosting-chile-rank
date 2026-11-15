#!/usr/bin/env node

/**
 * Script manual para actualizar dominios de NIC.cl
 * Ejecutar con: node scripts/manual-update.mjs
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runScript(command, description) {
  try {
    console.log(`🔄 ${description}...`);
    const { stdout, stderr } = await execAsync(command);
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    console.log(`✅ ${description} completado\n`);
  } catch (error) {
    console.error(`❌ Error en ${description}:`, error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 Iniciando actualización manual de dominios NIC.cl\n');
  
  try {
    // 1. Ejecutar scraper de NIC.cl
    await runScript('node scripts/nic-to-json.mjs', 'Scrapeando dominios de NIC.cl');
    
    // 2. Verificar resultados
    const { stdout } = await execAsync('head -3 public/data/latest.json');
    console.log('📊 Datos actualizados:');
    console.log(stdout);
    
    const { stdout: count } = await execAsync('jq ".domains | length" public/data/latest.json 2>/dev/null || echo "Error"');
    console.log(`Total dominios: ${count.trim()}`);
    
    console.log('\n🎉 ¡Actualización completada! Los datos están listos.');
    console.log('💡 Tip: Para automatizar esto, asegúrate de que el repositorio tenga actividad reciente para que GitHub Actions funcione.');
    
  } catch (error) {
    console.error('\n💥 Error en la actualización:', error.message);
    process.exit(1);
  }
}

main();
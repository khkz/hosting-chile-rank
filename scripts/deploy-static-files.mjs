
#!/usr/bin/env node

/**
 * Script para desplegar archivos estáticos optimizados para SEO
 * Ejecuta la generación de sitemap y notifica a motores de búsqueda
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';

console.log('🚀 Iniciando despliegue de archivos estáticos...\n');

// 1. Generar sitemap actualizado
console.log('📄 Generando sitemap.xml...');
try {
  execSync('node scripts/generate-sitemap.mjs', { stdio: 'inherit' });
  console.log('✅ Sitemap generado exitosamente\n');
} catch (error) {
  console.error('❌ Error generando sitemap:', error.message);
  process.exit(1);
}

// 2. Verificar que robots.txt existe
console.log('🤖 Verificando robots.txt...');
if (existsSync('public/robots.txt')) {
  console.log('✅ robots.txt encontrado\n');
} else {
  console.error('❌ robots.txt no encontrado en public/');
  process.exit(1);
}

// 3. Verificar que el feed RSS existe
console.log('📡 Verificando RSS feed...');
if (existsSync('public/feed/latest-domains.xml')) {
  console.log('✅ RSS feed encontrado\n');
} else {
  console.warn('⚠️  RSS feed no encontrado, continuando...\n');
}

// 4. Notificar a motores de búsqueda
console.log('📢 Notificando a motores de búsqueda...');
try {
  execSync('node scripts/notify-search-engines.mjs', { stdio: 'inherit' });
  console.log('✅ Notificaciones enviadas\n');
} catch (error) {
  console.warn('⚠️  Error en notificaciones (esto es normal):', error.message, '\n');
}

console.log('🎉 Despliegue de archivos estáticos completado');
console.log('📋 Archivos disponibles:');
console.log('   • https://eligetuhosting.cl/sitemap.xml');
console.log('   • https://eligetuhosting.cl/robots.txt');
console.log('   • https://eligetuhosting.cl/feed/latest-domains.xml');

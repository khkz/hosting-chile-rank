#!/usr/bin/env node

/**
 * Script para generar JSON Feed de los últimos dominios
 * Compatible con el estándar JSON Feed v1.1
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔄 Generando JSON Feed...');

try {
  // Read the latest domains data
  const dataPath = join(__dirname, '../public/data/latest.json');
  
  if (!existsSync(dataPath)) {
    console.warn('⚠️  Archivo de datos no encontrado, creando feed vacío');
    
    const emptyFeed = {
      "version": "https://jsonfeed.org/version/1.1",
      "title": "Últimos dominios registrados en Chile",
      "home_page_url": "https://eligetuhosting.cl",
      "feed_url": "https://eligetuhosting.cl/feeds/latest-domains.json",
      "description": "Lista actualizada de los últimos dominios .cl registrados en NIC Chile",
      "author": {
        "name": "EligeTuHosting.cl",
        "url": "https://eligetuhosting.cl"
      },
      "language": "es",
      "items": []
    };

    const outputPath = join(__dirname, '../public/feeds/latest-domains.json');
    writeFileSync(outputPath, JSON.stringify(emptyFeed, null, 2));
    console.log('✅ JSON Feed vacío generado');
    process.exit(0);
  }

  const data = JSON.parse(readFileSync(dataPath, 'utf8'));
  
  // Generate feed items from domain data
  const items = data.domains?.slice(0, 100).map((domain, index) => ({
    id: `https://eligetuhosting.cl/domain/${domain.d.replace(/\./g, '-')}/`,
    url: `https://eligetuhosting.cl/domain/${domain.d.replace(/\./g, '-')}/`,
    title: `${domain.d} - Dominio registrado`,
    content_html: `<p>El dominio <strong>${domain.d}</strong> fue registrado el ${new Date(domain.date).toLocaleDateString('es-CL')}.</p><p><a href="https://eligetuhosting.cl/domain/${domain.d.replace(/\./g, '-')}/">Ver análisis completo del dominio</a></p>`,
    content_text: `El dominio ${domain.d} fue registrado el ${new Date(domain.date).toLocaleDateString('es-CL')}.`,
    date_published: domain.date,
    tags: ["dominio", "chile", "nic", "registro"]
  })) || [];

  // Create the JSON Feed
  const jsonFeed = {
    "version": "https://jsonfeed.org/version/1.1",
    "title": "Últimos dominios registrados en Chile",
    "home_page_url": "https://eligetuhosting.cl",
    "feed_url": "https://eligetuhosting.cl/feeds/latest-domains.json",
    "description": "Lista actualizada de los últimos dominios .cl registrados en NIC Chile",
    "author": {
      "name": "EligeTuHosting.cl",
      "url": "https://eligetuhosting.cl"
    },
    "language": "es",
    "items": items
  };

  // Write the JSON Feed
  const outputPath = join(__dirname, '../public/feeds/latest-domains.json');
  writeFileSync(outputPath, JSON.stringify(jsonFeed, null, 2));
  
  console.log(`✅ JSON Feed generado con ${items.length} dominios`);
  console.log(`📍 Guardado en: ${outputPath}`);

} catch (error) {
  console.error('❌ Error generando JSON Feed:', error.message);
  process.exit(1);
}
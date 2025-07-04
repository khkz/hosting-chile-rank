
/**
 * Servicio para notificar a los motores de búsqueda sobre actualizaciones
 */

const SITE_URL = 'https://eligetuhosting.cl';

/**
 * Notifica a Google sobre la actualización del sitemap
 */
async function notifyGoogle() {
  try {
    const sitemapUrl = encodeURIComponent(`${SITE_URL}/sitemap.xml`);
    const pingUrl = `http://www.google.com/ping?sitemap=${sitemapUrl}`;
    
    console.log('🔄 Notificando a Google sobre sitemap actualizado...');
    const response = await fetch(pingUrl);
    
    if (response.ok) {
      console.log('✅ Google notificado exitosamente');
      return true;
    } else {
      console.log(`⚠️  Google respondió con status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Error al notificar a Google:', error.message);
    return false;
  }
}

/**
 * Notifica a Bing sobre la actualización del sitemap
 */
async function notifyBing() {
  try {
    const sitemapUrl = encodeURIComponent(`${SITE_URL}/sitemap.xml`);
    const pingUrl = `http://www.bing.com/ping?sitemap=${sitemapUrl}`;
    
    console.log('🔄 Notificando a Bing sobre sitemap actualizado...');
    const response = await fetch(pingUrl);
    
    if (response.ok) {
      console.log('✅ Bing notificado exitosamente');
      return true;
    } else {
      console.log(`⚠️  Bing respondió con status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Error al notificar a Bing:', error.message);
    return false;
  }
}

/**
 * Notifica a IndexNow (protocolo moderno para Microsoft Bing)
 */
async function notifyIndexNow() {
  try {
    const urls = [
      `${SITE_URL}/ultimos-dominios/`,
      `${SITE_URL}/ranking/`,
      `${SITE_URL}/`
    ];
    
    console.log('🔄 Notificando via IndexNow...');
    
    const payload = {
      host: 'eligetuhosting.cl',
      urlList: urls
    };
    
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (response.ok) {
      console.log('✅ IndexNow notificado exitosamente');
      return true;
    } else {
      console.log(`⚠️  IndexNow respondió con status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Error al notificar via IndexNow:', error.message);
    return false;
  }
}

/**
 * Ejecuta todas las notificaciones
 */
async function notifyAll() {
  console.log('🚀 Iniciando notificaciones a motores de búsqueda...\n');
  
  const results = await Promise.allSettled([
    notifyGoogle(),
    notifyBing(),
    notifyIndexNow()
  ]);
  
  const successful = results.filter(r => r.status === 'fulfilled' && r.value).length;
  
  console.log(`\n📊 Resumen: ${successful}/${results.length} notificaciones exitosas`);
  
  if (successful > 0) {
    console.log('✅ Los motores de búsqueda han sido notificados sobre las actualizaciones');
  } else {
    console.log('⚠️  No se pudieron completar las notificaciones (esto puede ser normal)');
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  await notifyAll();
}

export { notifyGoogle, notifyBing, notifyIndexNow, notifyAll };

/**
 * Artículos del blog: una sola fuente para /blog y /blog/:slug.
 * La lista y el artículo leen el mismo registro (título, fecha y portada),
 * así que /blog solo muestra lo que /blog/:slug sabe abrir.
 * Las fechas son las que declaraba cada artículo (7 de enero de 2026); no hay
 * otra fuente que las confirme.
 */
export interface BlogPostData {
  slug: string;
  /** Slugs anteriores que llevan a este artículo. */
  aliases?: string[];
  title: string;
  excerpt: string;
  /** Fecha de publicación (AAAA-MM-DD). */
  date: string;
  author: string;
  authorPosition: string;
  category: string;
  /** Portada 1200 × 630 (proporción 40/21). */
  image: string;
  /** Imagen para og:image y JSON-LD, si difiere de la portada (se mantiene la que ya se publicaba). */
  seoImage?: string;
  readTime: string;
  /** HTML del cuerpo (contenido propio, no proviene de usuarios). */
  content: string;
}

export const BLOG_POSTS: BlogPostData[] = [
  {
    slug: 'mejores-servidores-web-2026',
    aliases: ['mejores-servidores-web-2025'],
    title: 'Los 5 mejores servidores web en 2026',
    excerpt: 'Una comparativa detallada de los servidores web más eficientes y seguros para tu sitio. Analizamos LiteSpeed, Nginx, Apache y alternativas emergentes.',
    date: '2026-01-07',
    author: 'Ana Martínez',
    authorPosition: 'Especialista en Infraestructura Web',
    category: 'Tecnología',
    image: '/blog/mejores-servidores-web-2025.svg',
    readTime: '8 min',
    content: `
      <p>La elección del servidor web adecuado puede marcar una diferencia significativa en el rendimiento, la seguridad y la escalabilidad de tu sitio. En 2026, con el continuo crecimiento del tráfico web y las exigencias de los usuarios por experiencias rápidas y seguras, esta decisión es más importante que nunca.</p>
      
      <p>En este artículo, analizaremos los 5 servidores web que están destacando este año, comparando sus características, ventajas y casos de uso ideales para ayudarte a tomar la mejor decisión para tu proyecto.</p>
      
      <h2>1. LiteSpeed Web Server</h2>
      
      <p>LiteSpeed se ha consolidado como el servidor web preferido para sitios de alto rendimiento, especialmente aquellos basados en WordPress, WooCommerce y otras plataformas populares.</p>
      
      <h3>Ventajas principales:</h3>
      
      <ul>
        <li>Rendimiento superior: Hasta 6 veces más rápido que Apache en pruebas de carga</li>
        <li>Caché integrado (LSCache) que supera a soluciones de terceros</li>
        <li>Compatible con .htaccess de Apache, facilitando la migración</li>
        <li>Excelente protección contra DDoS y otras amenazas</li>
        <li>Menor consumo de recursos del servidor</li>
      </ul>
      
      <p>Sus principales desventajas son su costo (aunque ya existen opciones gratuitas limitadas) y una comunidad más pequeña en comparación con Apache o Nginx.</p>
      
      <h2>2. Nginx</h2>
      
      <p>Nginx continúa siendo una opción popular, especialmente para sitios con mucho tráfico y aplicaciones web modernas.</p>
      
      <h3>Ventajas principales:</h3>
      
      <ul>
        <li>Excelente rendimiento en la gestión de conexiones concurrentes</li>
        <li>Bajo consumo de recursos</li>
        <li>Gran comunidad y amplia documentación</li>
        <li>Versátil como servidor web, proxy inverso y balanceador de carga</li>
        <li>Configuración sencilla para despliegues modernos</li>
      </ul>
      
      <p>Su principal limitación sigue siendo la falta de soporte para archivos .htaccess, lo que puede complicar ciertas migraciones desde Apache.</p>
      
      <h2>3. Apache HTTP Server</h2>
      
      <p>El veterano Apache sigue siendo relevante en 2026, gracias a su continua evolución y su incomparable flexibilidad.</p>
      
      <h3>Ventajas principales:</h3>
      
      <ul>
        <li>Compatibilidad con prácticamente cualquier CMS o aplicación web</li>
        <li>Enorme comunidad y documentación extensa</li>
        <li>Altamente personalizable mediante módulos</li>
        <li>Soporte para .htaccess (configuración a nivel de directorio)</li>
        <li>Ampliamente disponible en la mayoría de los proveedores de hosting</li>
      </ul>
      
      <p>Su principal desventaja sigue siendo un rendimiento inferior bajo carga elevada en comparación con LiteSpeed o Nginx.</p>
      
      <h2>4. OpenLiteSpeed</h2>
      
      <p>La versión de código abierto de LiteSpeed ha ganado popularidad significativa en 2026, especialmente entre usuarios que buscan el rendimiento de LiteSpeed sin el costo de la versión Enterprise.</p>
      
      <h3>Ventajas principales:</h3>
      
      <ul>
        <li>Gratuito y de código abierto</li>
        <li>Rendimiento cercano a LiteSpeed Enterprise</li>
        <li>Incluye LSCache básico</li>
        <li>Panel de administración web</li>
        <li>Compatible con aplicaciones diseñadas para Apache</li>
      </ul>
      
      <p>Las limitaciones incluyen menos características que la versión Enterprise y una comunidad más pequeña, aunque en rápido crecimiento.</p>
      
      <h2>5. Caddy</h2>
      
      <p>Caddy ha emergido como una alternativa moderna y segura que está ganando terreno rápidamente en 2026.</p>
      
      <h3>Ventajas principales:</h3>
      
      <ul>
        <li>HTTPS automático con certificados Let's Encrypt</li>
        <li>Configuración extremadamente sencilla</li>
        <li>Alto rendimiento</li>
        <li>Excelente para despliegues en contenedores</li>
        <li>Enfoque moderno orientado a seguridad por defecto</li>
      </ul>
      
      <p>Es menos conocido que las alternativas tradicionales y puede tener limitaciones en escenarios muy específicos o heredados.</p>
      
      <h2>Conclusión</h2>
      
      <p>En 2026, la elección del servidor web depende en gran medida de tus necesidades específicas:</p>
      
      <ul>
        <li><strong>Para sitios WordPress o WooCommerce:</strong> LiteSpeed es la opción superior, con OpenLiteSpeed como alternativa económica.</li>
        <li><strong>Para aplicaciones modernas con alto tráfico:</strong> Nginx ofrece el mejor equilibrio.</li>
        <li><strong>Para compatibilidad y flexibilidad:</strong> Apache sigue siendo una opción sólida.</li>
        <li><strong>Para simplicidad y seguridad automática:</strong> Caddy es una excelente elección emergente.</li>
      </ul>
      
      <p>La buena noticia es que la mayoría de los proveedores de hosting modernos ofrecen opciones para seleccionar entre varios de estos servidores, permitiéndote experimentar y encontrar el que mejor se adapte a tus necesidades específicas.</p>
    `,
  },
  {
    slug: 'optimizacion-wordpress-hosting',
    title: 'Cómo optimizar tu WordPress en cualquier hosting',
    excerpt: 'Guía paso a paso para mejorar el rendimiento de tu sitio WordPress independientemente del proveedor de hosting que utilices.',
    date: '2026-01-07',
    author: 'Carlos Vega',
    authorPosition: 'Desarrollador WordPress',
    category: 'WordPress',
    image: '/blog/optimizacion-wordpress-hosting.svg',
    seoImage: '/placeholder.svg',
    readTime: '12 min',
    content: `
      <p>WordPress es el CMS más utilizado en el mundo, pero sin una optimización adecuada, puede volverse lento y afectar negativamente la experiencia de usuario y el SEO. Si estás experimentando problemas de rendimiento, no necesariamente debes cambiar de hosting; existen numerosas técnicas que puedes aplicar para mejorar drásticamente la velocidad de tu sitio.</p>
      
      <p>En esta guía, te mostraré estrategias de optimización efectivas que funcionan en cualquier tipo de hosting, desde opciones económicas compartidas hasta servidores dedicados de alta gama.</p>
      
      <h2>1. Implementa una solución de caché efectiva</h2>
      
      <p>El caché es fundamental para reducir la carga del servidor y mejorar los tiempos de respuesta. Las páginas cacheadas se cargan mucho más rápido porque no es necesario ejecutar consultas a la base de datos y código PHP en cada visita.</p>
      
      <h3>Recomendaciones:</h3>
      
      <ul>
        <li><strong>WP Rocket:</strong> La solución premium más completa y fácil de configurar.</li>
        <li><strong>LiteSpeed Cache:</strong> Gratuito y extremadamente eficiente si tu hosting utiliza LiteSpeed Web Server.</li>
        <li><strong>W3 Total Cache:</strong> Opción gratuita muy completa, aunque con una configuración más compleja.</li>
        <li><strong>SG Optimizer:</strong> Excelente si usas SiteGround como hosting.</li>
      </ul>
      
      <h2>2. Optimiza tu base de datos</h2>
      
      <p>Con el tiempo, las bases de datos de WordPress acumulan datos innecesarios que ralentizan las consultas. Realizar limpiezas periódicas puede mejorar significativamente el rendimiento.</p>
      
      <h3>Acciones recomendadas:</h3>
      
      <ul>
        <li>Eliminar revisiones de publicaciones antiguas</li>
        <li>Limpiar comentarios en spam y papelera</li>
        <li>Eliminar tablas temporales y transients expirados</li>
        <li>Optimizar tablas (equivalente a OPTIMIZE TABLE en MySQL)</li>
      </ul>
      
      <p>Plugins como WP-Optimize o Advanced Database Cleaner pueden automatizar estas tareas.</p>
      
      <h2>3. Utiliza un CDN</h2>
      
      <p>Las redes de distribución de contenido (CDN) almacenan copias de tus archivos estáticos (imágenes, CSS, JavaScript) en servidores ubicados en diferentes partes del mundo, entregando el contenido desde el servidor más cercano a cada visitante.</p>
      
      <h3>Opciones recomendadas:</h3>
      
      <ul>
        <li><strong>Cloudflare:</strong> Ofrece un plan gratuito muy completo.</li>
        <li><strong>BunnyCDN:</strong> Excelente relación precio/rendimiento.</li>
        <li><strong>StackPath:</strong> Gran opción para sitios con tráfico elevado.</li>
      </ul>
      
      <h2>4.  Optimiza las imágenes</h2>
      
      <p>Las imágenes suelen representar el mayor volumen de datos en un sitio web. Optimizarlas puede reducir drásticamente los tiempos de carga.</p>
      
      <h3>Estrategias de optimización de imágenes:</h3>
      
      <ul>
        <li>Comprimir imágenes sin pérdida perceptible de calidad</li>
        <li>Implementar carga diferida (lazy loading)</li>
        <li>Utilizar formatos modernos como WebP con fallbacks para navegadores antiguos</li>
        <li>Implementar imágenes responsivas con el atributo srcset</li>
      </ul>
      
      <p>Plugins como Smush, ShortPixel o Imagify pueden automatizar este proceso.</p>
      
      <h2>5. Minimiza y combina archivos CSS y JavaScript</h2>
      
      <p>Cada archivo CSS y JavaScript representa una solicitud HTTP. Minimizar su número y tamaño puede reducir significativamente los tiempos de carga.</p>
      
      <h3>Acciones recomendadas:</h3>
      
      <ul>
        <li>Minimizar (eliminar espacios y comentarios)</li>
        <li>Combinar archivos cuando sea posible</li>
        <li>Cargar JavaScript de forma diferida o asíncrona</li>
        <li>Eliminar recursos no utilizados</li>
      </ul>
      
      <p>La mayoría de los plugins de caché mencionados anteriormente incluyen estas funcionalidades.</p>
      
      <h2>6. Utiliza un tema ligero y optimizado</h2>
      
      <p>Muchos temas populares están sobrecargados con características que nunca utilizarás, lo que ralentiza tu sitio innecesariamente.</p>
      
      <h3>Características de un buen tema:</h3>
      
      <ul>
        <li>Código limpio y bien optimizado</li>
        <li>Mínima dependencia de JavaScript</li>
        <li>Enfoque en la velocidad de carga</li>
        <li>Compatible con los últimos estándares web</li>
      </ul>
      
      <p>Temas como GeneratePress, Astra o Kadence son excelentes opciones optimizadas para rendimiento.</p>
      
      <h2>7. Revisa y optimiza tus plugins</h2>
      
      <p>Cada plugin añade código y potencialmente consultas adicionales a la base de datos. Es crucial revisar periódicamente tu colección de plugins.</p>
      
      <h3>Prácticas recomendadas:</h3>
      
      <ul>
        <li>Desactivar y eliminar plugins que no utilices</li>
        <li>Reemplazar plugins pesados por alternativas más ligeras</li>
        <li>Evitar plugins que realicen muchas consultas a la base de datos</li>
        <li>Utilizar herramientas como Query Monitor para identificar plugins problemáticos</li>
      </ul>
      
      <h2>8. Implementa GZIP o Brotli</h2>
      
      <p>La compresión de archivos reduce significativamente el tamaño de los datos transmitidos entre el servidor y el navegador de tus visitantes.</p>
      
      <p>Si tu hosting utiliza Apache, puedes implementar GZIP añadiendo las siguientes líneas a tu archivo .htaccess:</p>
      
      <pre><code># Compress HTML, CSS, JavaScript, Text, XML and fonts
&lt;IfModule mod_deflate.c&gt;
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/rss+xml
  AddOutputFilterByType DEFLATE application/vnd.ms-fontobject
  AddOutputFilterByType DEFLATE application/x-font
  AddOutputFilterByType DEFLATE application/x-font-opentype
  AddOutputFilterByType DEFLATE application/x-font-otf
  AddOutputFilterByType DEFLATE application/x-font-truetype
  AddOutputFilterByType DEFLATE application/x-font-ttf
  AddOutputFilterByType DEFLATE application/x-javascript
  AddOutputFilterByType DEFLATE application/xhtml+xml
  AddOutputFilterByType DEFLATE application/xml
  AddOutputFilterByType DEFLATE font/opentype
  AddOutputFilterByType DEFLATE font/otf
  AddOutputFilterByType DEFLATE font/ttf
  AddOutputFilterByType DEFLATE image/svg+xml
  AddOutputFilterByType DEFLATE image/x-icon
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/javascript
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE text/xml
&lt;/IfModule&gt;</code></pre>
      
      <p>Para servidores Nginx o si prefieres no editar archivos del servidor, varios plugins de caché también incluyen estas opciones de compresión.</p>
      
      <h2>9. Optimiza el rendimiento de PHP</h2>
      
      <p>WordPress funciona sobre PHP, por lo que asegurarte de que estás utilizando una versión actualizada y bien configurada es crucial para el rendimiento.</p>
      
      <h3>Recomendaciones:</h3>
      
      <ul>
        <li>Utiliza PHP 8.1 o superior (significativamente más rápido que versiones anteriores)</li>
        <li>Habilita OPcache si tu hosting lo permite</li>
        <li>Aumenta los límites de memoria si experimentas errores</li>
      </ul>
      
      <h2>10. Implementa Object Cache</h2>
      
      <p>WordPress guarda los resultados de consultas complejas a la base de datos en un sistema de caché de objetos. Por defecto, este sistema utiliza el disco, pero puede configurarse para utilizar sistemas más rápidos como Redis o Memcached.</p>
      
      <p>Si tu hosting ofrece estos servicios, plugins como Redis Object Cache o W3 Total Cache pueden ayudarte a implementarlos.</p>
      
      <h2>Conclusión</h2>
      
      <p>Optimizar WordPress no es una tarea única, sino un proceso continuo. Implementa estas técnicas de forma progresiva, midiendo el impacto de cada una con herramientas como:</p>
      
      <ul>
        <li>Google PageSpeed Insights</li>
        <li>GTmetrix</li>
        <li>WebPageTest</li>
        <li>Lighthouse en Chrome DevTools</li>
      </ul>
      
      <p>Recuerda que el objetivo no es simplemente obtener una puntuación perfecta en estas herramientas, sino ofrecer la mejor experiencia posible a tus visitantes. Un WordPress bien optimizado no solo carga más rápido, sino que también proporciona una mejor experiencia de usuario, mejora el SEO y reduce la carga en tu servidor.</p>
    `,
  },
];

/** Artículo por slug actual. */
export const findBlogPost = (slug?: string): BlogPostData | undefined =>
  BLOG_POSTS.find((p) => p.slug === slug);

/** Artículo cuyo slug anterior coincide (para redirigir al actual). */
export const findBlogAlias = (slug?: string): BlogPostData | undefined =>
  slug ? BLOG_POSTS.find((p) => p.aliases?.includes(slug)) : undefined;

/** Categorías con su conteo, calculado desde los artículos publicados. */
export const blogCategories = (): { name: string; count: number }[] => {
  const counts = new Map<string, number>();
  for (const p of BLOG_POSTS) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'es'));
};

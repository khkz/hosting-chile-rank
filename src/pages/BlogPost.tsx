
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Datos simulados de un post del blog
const posts = {
  'mejores-servidores-web-2025': {
    title: 'Los 5 mejores servidores web en 2025',
    excerpt: 'Una comparativa detallada de los servidores web más eficientes y seguros para tu sitio. Analizamos LiteSpeed, Nginx, Apache y alternativas emergentes.',
    date: '2 de mayo, 2025',
    author: 'Ana Martínez',
    authorPosition: 'Especialista en Infraestructura Web',
    authorImage: '/placeholder.svg',
    category: 'Tecnología',
    image: '/placeholder.svg',
    readTime: '8 min',
    content: `
      <p>La elección del servidor web adecuado puede marcar una diferencia significativa en el rendimiento, la seguridad y la escalabilidad de tu sitio. En 2025, con el continuo crecimiento del tráfico web y las exigencias de los usuarios por experiencias rápidas y seguras, esta decisión es más importante que nunca.</p>
      
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
      
      <p>El veterano Apache sigue siendo relevante en 2025, gracias a su continua evolución y su incomparable flexibilidad.</p>
      
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
      
      <p>La versión de código abierto de LiteSpeed ha ganado popularidad significativa en 2025, especialmente entre usuarios que buscan el rendimiento de LiteSpeed sin el costo de la versión Enterprise.</p>
      
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
      
      <p>Caddy ha emergido como una alternativa moderna y segura que está ganando terreno rápidamente en 2025.</p>
      
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
      
      <p>En 2025, la elección del servidor web depende en gran medida de tus necesidades específicas:</p>
      
      <ul>
        <li><strong>Para sitios WordPress o WooCommerce:</strong> LiteSpeed es la opción superior, con OpenLiteSpeed como alternativa económica.</li>
        <li><strong>Para aplicaciones modernas con alto tráfico:</strong> Nginx ofrece el mejor equilibrio.</li>
        <li><strong>Para compatibilidad y flexibilidad:</strong> Apache sigue siendo una opción sólida.</li>
        <li><strong>Para simplicidad y seguridad automática:</strong> Caddy es una excelente elección emergente.</li>
      </ul>
      
      <p>La buena noticia es que la mayoría de los proveedores de hosting modernos ofrecen opciones para seleccionar entre varios de estos servidores, permitiéndote experimentar y encontrar el que mejor se adapte a tus necesidades específicas.</p>
    `
  },
  'optimizacion-wordpress-hosting': {
    title: 'Cómo optimizar tu WordPress en cualquier hosting',
    excerpt: 'Guía paso a paso para mejorar el rendimiento de tu sitio WordPress independientemente del proveedor de hosting que utilices.',
    date: '28 de abril, 2025',
    author: 'Carlos Vega',
    authorPosition: 'Desarrollador WordPress',
    authorImage: '/placeholder.svg',
    category: 'WordPress',
    image: '/placeholder.svg',
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
    `
  },
  // Información por defecto para artículos que no existen específicamente
  'default': {
    title: 'Artículo del blog',
    excerpt: 'Este es un artículo de nuestro blog sobre hosting y desarrollo web.',
    date: '1 de mayo, 2025',
    author: 'Equipo eligetuhosting.cl',
    authorPosition: 'Especialistas en hosting',
    authorImage: '/placeholder.svg',
    category: 'General',
    image: '/placeholder.svg',
    readTime: '5 min',
    content: `
      <p>Este artículo está en construcción. Pronto podrás encontrar aquí contenido valioso sobre hosting y desarrollo web.</p>
      
      <p>Te invitamos a revisar otros artículos de nuestro blog mientras completamos este contenido.</p>
      
      <h2>Artículos recomendados</h2>
      
      <ul>
        <li>Los 5 mejores servidores web en 2025</li>
        <li>Cómo optimizar tu WordPress en cualquier hosting</li>
        <li>Hosting ecológico: La tendencia que está cambiando la industria</li>
      </ul>
    `
  }
};

// Artículos relacionados (simulados)
const relatedPosts = [
  {
    slug: 'mejores-servidores-web-2025',
    title: 'Los 5 mejores servidores web en 2025',
    image: '/placeholder.svg',
    date: '2 de mayo, 2025'
  },
  {
    slug: 'optimizacion-wordpress-hosting',
    title: 'Cómo optimizar tu WordPress en cualquier hosting',
    image: '/placeholder.svg',
    date: '28 de abril, 2025'
  },
  {
    slug: 'hosting-ecologico-tendencia',
    title: 'Hosting ecológico: La tendencia que está cambiando la industria',
    image: '/placeholder.svg',
    date: '15 de abril, 2025'
  }
];

const BlogPost = () => {
  const { slug } = useParams();
  
  // Obtener el post con el slug dado, o usar el post por defecto si no existe
  const post = posts[slug || ''] || posts.default;
  
  useEffect(() => {
    document.title = `${post.title} | eligetuhosting.cl`;
    // Hacer scroll al inicio de la página cuando cambia el post
    window.scrollTo(0, 0);
  }, [post.title, slug]);

  return (
    <>
      <Helmet>
        <title>{post.title} | eligetuhosting.cl</title>
        <meta 
          name="description" 
          content={post.excerpt} 
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "description": post.excerpt,
            "image": `https://eligetuhosting.cl${post.image}`,
            "datePublished": new Date().toISOString(),
            "dateModified": new Date().toISOString(),
            "author": {
              "@type": "Person",
              "name": post.author,
              "jobTitle": post.authorPosition
            },
            "publisher": {
              "@type": "Organization",
              "name": "EligeTuHosting.cl",
              "logo": {
                "@type": "ImageObject",
                "url": "https://eligetuhosting.cl/favicon-logo.svg",
                "width": "512",
                "height": "512"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://eligetuhosting.cl/blog/${slug || 'default'}`
            },
            "articleSection": post.category,
            "wordCount": post.content.split(' ').length,
            "timeRequired": post.readTime,
            "about": ["hosting", "chile", "tecnología web", "servidores"],
            "inLanguage": "es"
          })}
        </script>
      </Helmet>
      
      <Navbar />
      
      <main className="bg-[#F7F9FC] py-8">
        <div className="container mx-auto px-4">
          {/* Migas de pan */}
          <div className="text-sm mb-8">
            <Link to="/" className="hover:text-[#EF233C]">Inicio</Link>
            <span className="mx-2">/</span>
            <Link to="/blog" className="hover:text-[#EF233C]">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-500">{post.title}</span>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Contenido principal */}
            <article className="md:col-span-2 bg-white p-6 md:p-10 rounded-lg shadow-sm">
              {/* Header del post */}
              <header className="mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <span className="bg-[#EDF2F4] px-2 py-0.5 rounded">{post.category}</span>
                  <span>•</span>
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime} de lectura</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-[#2B2D42] mb-4">
                  {post.title}
                </h1>
                
                <p className="text-lg text-gray-600 mb-6">
                  {post.excerpt}
                </p>
                
                {/* Imagen destacada */}
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-auto rounded-lg mb-6"
                  loading="lazy"
                />
                
                {/* Información del autor */}
                <div className="flex items-center gap-4 p-4 bg-[#F7F9FC] rounded-lg">
                  <img 
                    src={post.authorImage} 
                    alt={post.author}
                    className="w-16 h-16 rounded-full"
                    loading="lazy"
                  />
                  <div>
                    <h3 className="font-medium">{post.author}</h3>
                    <p className="text-sm text-gray-500">{post.authorPosition}</p>
                  </div>
                </div>
              </header>
              
              {/* Contenido del post */}
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
              
              {/* Call to Action al final del artículo */}
              <div className="mt-10 p-6 bg-[#EDF2F4] rounded-lg text-center">
                <h3 className="text-xl font-bold mb-3">¿Necesitas un hosting confiable?</h3>
                <p className="mb-6">
                  Compara los mejores proveedores de hosting en Chile y encuentra el ideal para tu proyecto.
                </p>
                <Link 
                  to="/comparativa" 
                  className="bg-[#EF233C] text-white px-6 py-3 rounded-lg hover:bg-red-700 inline-block"
                >
                  Ver comparativa de hosting
                </Link>
              </div>
              
              {/* Compartir */}
              <div className="mt-10">
                <h3 className="font-medium mb-4">Comparte este artículo</h3>
                <div className="flex gap-2">
                  <button className="p-2 bg-[#1DA1F2] text-white rounded hover:bg-opacity-90">
                    <span className="sr-only">Compartir en Twitter</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 4.01C21 4.5 20.02 4.84 19 5C18.05 4.13 16.77 3.56 15.36 3.56C12.78 3.56 10.67 5.67 10.67 8.24C10.67 8.63 10.7 9.01 10.76 9.36C6.83 9.15 3.33 7.28 1.08 4.45C0.8 5.06 0.67 5.75 0.67 6.46C0.67 7.79 1.3 9.01 2.28 9.72C1.68 9.7 1.13 9.55 0.67 9.31V9.35C0.67 11.64 2.26 13.53 4.37 13.96C4.01 14.05 3.63 14.11 3.24 14.11C3.05 14.11 2.87 14.09 2.69 14.06C3.06 15.92 4.74 17.31 6.77 17.35C5.23 18.63 3.24 19.39 1.08 19.39C0.81 19.39 0.54 19.38 0.27 19.35C2.32 20.68 4.76 21.46 7.38 21.46C15.36 21.46 19.76 14.4 19.76 8.35C19.76 8.13 19.76 7.92 19.75 7.7C20.76 6.95 21.63 6.01 22.27 4.95L22 4.01Z" fill="currentColor"/>
                    </svg>
                  </button>
                  <button className="p-2 bg-[#3b5998] text-white rounded hover:bg-opacity-90">
                    <span className="sr-only">Compartir en Facebook</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 12.06C22 6.53 17.5 2 12 2C6.5 2 2 6.53 2 12.06C2 17 5.66 21.09 10.44 21.87V14.89H7.9V12.06H10.44V9.91C10.44 7.42 11.93 5.99 14.22 5.99C15.31 5.99 16.45 6.19 16.45 6.19V8.67H15.19C13.95 8.67 13.56 9.52 13.56 10.39V12.06H16.34L15.89 14.89H13.56V21.87C18.34 21.09 22 17 22 12.06Z" fill="currentColor"/>
                    </svg>
                  </button>
                  <button className="p-2 bg-[#0077b5] text-white rounded hover:bg-opacity-90">
                    <span className="sr-only">Compartir en LinkedIn</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 3C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19ZM18.5 18.5V13.2C18.5 12.3354 18.1565 11.5062 17.5452 10.8948C16.9338 10.2835 16.1046 9.94 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17C14.6813 12.17 15.0374 12.3175 15.2999 12.5801C15.5625 12.8426 15.71 13.1987 15.71 13.57V18.5H18.5ZM6.88 8.56C7.32556 8.56 7.75288 8.383 8.06794 8.06794C8.383 7.75288 8.56 7.32556 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19C6.43178 5.19 6.00193 5.36805 5.68499 5.68499C5.36805 6.00193 5.19 6.43178 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56ZM8.27 18.5V10.13H5.5V18.5H8.27Z" fill="currentColor"/>
                    </svg>
                  </button>
                  <button className="p-2 bg-[#25D366] text-white rounded hover:bg-opacity-90">
                    <span className="sr-only">Compartir en WhatsApp</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.6 6.32C16.4 5.12 14.8 4.4 13.2 4.4C9.8 4.4 7.2 7.12 7.2 10.4C7.2 11.6 7.52 12.8 8.16 13.84L7.04 17.04L10.4 16C11.44 16.64 12.56 16.88 13.68 16.88C17.08 16.88 19.68 14.16 19.68 10.88C19.52 9.2 18.8 7.52 17.6 6.32ZM13.2 15.68C12.24 15.68 11.28 15.44 10.48 14.96L10.24 14.8L8.16 15.36L8.72 13.36L8.48 13.12C7.92 12.24 7.68 11.28 7.68 10.4C7.68 7.52 10.16 5.12 13.04 5.12C14.4 5.12 15.68 5.68 16.64 6.64C17.6 7.6 18.16 8.88 18.16 10.24C18.32 13.12 16 15.68 13.2 15.68ZM15.68 11.76C15.52 11.68 14.56 11.2 14.4 11.12C14.24 11.04 14.16 11.04 14.08 11.2C13.92 11.36 13.52 11.76 13.44 11.92C13.36 12 13.28 12 13.12 11.92C12.24 11.52 11.68 11.12 11.04 10.16C10.88 9.92 11.12 9.92 11.36 9.44C11.44 9.36 11.44 9.28 11.36 9.2C11.28 9.12 10.88 8.16 10.72 7.84C10.56 7.52 10.4 7.52 10.32 7.52H10.08C9.92 7.52 9.68 7.6 9.52 7.76C9.2 8.08 8.72 8.56 8.72 9.52C8.72 10.48 9.44 11.36 9.52 11.52C10.4 12.96 11.2 13.52 12.72 14.08C13.6 14.4 13.92 14.4 14.32 14.32C14.72 14.24 15.52 13.84 15.68 13.44C15.84 13.04 15.84 12.72 15.76 12.64C15.76 12.56 15.68 12.56 15.52 12.48C15.36 11.92 15.36 11.84 15.68 11.76Z" fill="currentColor"/>
                      <path d="M20.4802 3.44C18.1602 1.12 14.9602 0 11.6802 0C5.44016 0 0.320156 5.12 0.320156 11.36C0.320156 13.36 0.800156 15.28 1.76016 16.96L0.160156 23.04L6.40016 21.52C8.08016 22.4 9.92016 22.88 11.7602 22.88H11.8402C18.0002 22.88 23.2002 17.76 23.2002 11.52C23.2002 8.24 22.0802 5.12 19.6802 2.8C19.6802 2.96 20.4802 3.44 20.4802 3.44ZM11.6802 20.96C9.92016 20.96 8.24016 20.48 6.80016 19.6L6.48016 19.44L2.80016 20.32L3.68016 16.8L3.44016 16.48C2.48016 14.96 1.92016 13.28 1.92016 11.52C1.92016 6.16 6.32016 1.76 11.6802 1.76C14.4002 1.76 16.9602 2.72 18.8802 4.56C20.8002 6.4 21.8402 8.96 21.8402 11.68C21.8402 16.96 17.2002 20.96 11.6802 20.96ZM16.9602 13.76C16.6402 13.6 15.2802 12.96 15.0402 12.8C14.7202 12.64 14.5602 12.64 14.3202 12.96C14.1602 13.28 13.6002 13.84 13.4402 14C13.2802 14.16 13.1202 14.16 12.8802 14C12.0002 13.68 11.2002 13.28 10.5602 12.64C10.0002 12.16 9.60016 11.52 9.36016 10.96C9.20016 10.72 9.36016 10.56 9.52016 10.4C9.60016 10.32 9.76016 10.16 9.92016 10.08C10.0002 10 10.0802 9.84 10.1602 9.76C10.2402 9.68 10.2402 9.52 10.1602 9.36C10.0802 9.2 9.60016 7.84 9.36016 7.28C9.20016 6.72 9.04016 6.72 8.88016 6.72C8.72016 6.72 8.56016 6.72 8.40016 6.72C8.24016 6.72 7.92016 6.8 7.68016 7.04C7.36016 7.36 6.72016 8 6.72016 9.36C6.72016 10.72 7.68016 12 7.76016 12.16C9.12016 14.16 10.3202 15.04 12.2402 15.68C12.8002 15.92 13.2802 16.08 13.6002 16.16C14.1602 16.32 14.7202 16.32 15.1202 16.24C15.6002 16.16 16.7202 15.52 16.9602 14.88C17.2002 14.24 17.2002 13.76 17.1202 13.76C17.1202 13.76 16.9602 13.68 16.9602 13.76Z" fill="currentColor"/>
                    </svg>
                  </button>
                  <button className="p-2 bg-[#FF5700] text-white rounded hover:bg-opacity-90">
                    <span className="sr-only">Compartir por Email</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM20 7.238L12.072 14.338L4 7.216V19H20V7.238ZM4.511 5L12.061 11.662L19.502 5H4.511Z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
              </div>
            </article>
            
            {/* Sidebar */}
            <div className="space-y-8">
              {/* Artículos relacionados */}
              <Card>
                <CardHeader>
                  <CardTitle>Artículos relacionados</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedPosts.filter(post => post.slug !== slug).slice(0, 3).map((post, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-16 h-16 flex-shrink-0">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover rounded"
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm line-clamp-2">
                          <Link to={`/blog/${post.slug}`} className="hover:text-[#EF233C]">
                            {post.title}
                          </Link>
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">{post.date}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              {/* CTA */}
              <Card className="bg-[#EDF2F4] border-0">
                <CardHeader>
                  <CardTitle>¿Buscas el mejor hosting?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">
                    Compara los mejores proveedores de hosting en Chile y encuentra la opción ideal para tu proyecto.
                  </p>
                  <Link 
                    to="/comparativa" 
                    className="block bg-[#EF233C] text-white text-center py-2 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Ver comparativa
                  </Link>
                </CardContent>
              </Card>
              
              {/* Newsletter */}
              <Card>
                <CardHeader>
                  <CardTitle>Suscríbete al blog</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">
                    Recibe los últimos artículos y noticias sobre hosting y desarrollo web directamente en tu email.
                  </p>
                  <input
                    type="email"
                    placeholder="Tu email"
                    className="w-full py-2 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#EF233C] focus:border-[#EF233C]"
                  />
                  <button className="w-full bg-[#2B2D42] text-white py-2 rounded-md hover:bg-gray-800 transition-colors">
                    Suscribirme
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default BlogPost;

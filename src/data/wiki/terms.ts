export interface WikiTerm {
  id: string;
  slug: string;
  title: string;
  shortDefinition: string;
  longDefinition?: string;
  category: 'wordpress' | 'builders' | 'seo' | 'performance' | 'security' | 'woocommerce' | 'lms' | 'cms' | 'cdn' | 'infrastructure' | 'email' | 'devops' | 'migration' | 'analytics' | 'trends-2025';
  cms: 'wordpress' | 'joomla' | 'moodle' | 'general' | 'drupal' | 'prestashop';
  tags: string[];
  level: 'basico' | 'medio' | 'avanzado';
  related: string[];
  hostingRequirements?: string[];
  cta: {
    plan: string;
    copy: string;
    url: string;
  };
  proofPoints: string[];
  whenToUse?: string;
  synonyms?: string[];
  lastUpdated?: string;
}

export interface WikiCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  termCount: number;
}

export const wikiCategories: WikiCategory[] = [
  {
    id: 'wordpress',
    name: 'WordPress Core',
    description: 'Conceptos fundamentales de WordPress',
    icon: '🔧',
    termCount: 7
  },
  {
    id: 'builders',
    name: 'Page Builders', 
    description: 'Constructores visuales para WordPress',
    icon: '🎨',
    termCount: 4
  },
  {
    id: 'seo',
    name: 'SEO',
    description: 'Optimización para motores de búsqueda',
    icon: '🔍',
    termCount: 5
  },
  {
    id: 'performance',
    name: 'Performance',
    description: 'Optimización de velocidad y caché',
    icon: '⚡',
    termCount: 5
  },
  {
    id: 'security',
    name: 'Seguridad',
    description: 'Protección y hardening web',
    icon: '🛡️',
    termCount: 4
  },
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    description: 'E-commerce con WordPress',
    icon: '🛒',
    termCount: 3
  },
  {
    id: 'lms',
    name: 'LMS',
    description: 'Sistemas de gestión de aprendizaje',
    icon: '🎓',
    termCount: 3
  },
  {
    id: 'cms',
    name: 'CMS Alternativos',
    description: 'Joomla, Drupal y otros CMS',
    icon: '🌐',
    termCount: 2
  },
  {
    id: 'trends-2025',
    name: 'Tendencias 2025',
    description: 'IA, nuevas tecnologías y el futuro del hosting',
    icon: '🚀',
    termCount: 12
  }
];

export const wikiTerms: WikiTerm[] = [
  // WordPress Core Terms
  {
    id: 'wp-001',
    slug: 'wordpress',
    title: 'WordPress',
    shortDefinition: 'El CMS más popular del mundo, que impulsa más del 43% de todos los sitios web. Sistema de gestión de contenidos open-source.',
    longDefinition: 'WordPress es el sistema de gestión de contenidos más utilizado globalmente, perfecto para blogs, sitios corporativos y e-commerce. En Chile es la plataforma preferida por desarrolladores y empresas.',
    category: 'wordpress',
    cms: 'wordpress',
    tags: ['cms', 'wordpress-core', 'gestion-contenidos', 'open-source'],
    level: 'basico',
    related: ['gutenberg', 'woocommerce', 'child-themes'],
    hostingRequirements: ['PHP 8.1+', 'MySQL 8.0+', 'WordPress auto-install'],
    cta: {
      plan: 'WordPress Hosting',
      copy: 'Hosting especializado WordPress con instalación automática',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=81'
    },
    proofPoints: ['WordPress pre-instalado', 'Updates automáticos', 'Staging site incluido'],
    whenToUse: 'Ideal para blogs, sitios corporativos, e-commerce y cualquier proyecto web',
    synonyms: ['WP', 'sistema de gestión'],
    lastUpdated: '2025-01-15'
  },
  {
    id: 'wp-002',
    slug: 'gutenberg',
    title: 'Gutenberg Editor',
    shortDefinition: 'Editor visual de bloques de WordPress que permite crear contenido arrastrando y soltando elementos sin necesidad de código.',
    longDefinition: 'Gutenberg revoluciona WordPress convirtiendo todo en bloques reutilizables. Permite crear páginas profesionales sin conocimiento técnico.',
    category: 'wordpress',
    cms: 'wordpress', 
    tags: ['gutenberg', 'editor-bloques', 'page-builder', 'fse'],
    level: 'medio',
    related: ['wordpress', 'elementor', 'child-themes'],
    hostingRequirements: ['WordPress 5.0+', 'PHP 7.4+', 'JavaScript habilitado'],
    cta: {
      plan: 'WordPress Pro',
      copy: 'Hosting optimizado para Gutenberg con performance garantizada',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=84'
    },
    proofPoints: ['Gutenberg pre-configurado', 'Themes FSE incluidos', 'Performance 95+'],
    whenToUse: 'Perfecto para content marketing, landing pages y sitios corporativos',
    synonyms: ['editor de bloques', 'block editor'],
    lastUpdated: '2025-01-15'
  },
  {
    id: 'wp-003',
    slug: 'child-themes',
    title: 'Child Themes',
    shortDefinition: 'Tema hijo que hereda funcionalidades del tema padre pero permite personalizaciones seguras sin perder cambios en actualizaciones.',
    longDefinition: 'Los Child Themes protegen las personalizaciones de tu sitio WordPress cuando el tema original se actualiza, manteniendo cambios seguros.',
    category: 'wordpress',
    cms: 'wordpress',
    tags: ['child-theme', 'personalizacion', 'mantenimiento', 'updates'],
    level: 'medio',
    related: ['wordpress', 'custom-css', 'theme-development'],
    hostingRequirements: ['WordPress actualizado', 'Acceso FTP/cPanel', 'PHP 7.4+'],
    cta: {
      plan: 'Developer Pro',
      copy: 'Hosting con acceso completo para desarrollo de Child Themes',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=85'
    },
    proofPoints: ['FTP/SSH incluido', 'Staging site', 'Git deployment'],
    whenToUse: 'Obligatorio para cualquier personalización de tema WordPress',
    synonyms: ['tema hijo', 'child template'],
    lastUpdated: '2025-01-15'
  },
  {
    id: 'wp-004',
    slug: 'woocommerce',
    title: 'WooCommerce',
    shortDefinition: 'Plugin de e-commerce para WordPress que convierte cualquier sitio en una tienda online completa con gestión de productos, pagos y envíos.',
    longDefinition: 'WooCommerce es la plataforma de e-commerce más usada del mundo, perfecta para tiendas online en Chile con integración Transbank y envíos nacionales.',
    category: 'woocommerce',
    cms: 'wordpress',
    tags: ['ecommerce', 'tienda-online', 'woocommerce', 'ventas'],
    level: 'medio',
    related: ['wordpress', 'transbank', 'shipping-methods'],
    hostingRequirements: ['SSL certificado', 'PHP 8.0+', 'MySQL optimizado', 'Backup automático'],
    cta: {
      plan: 'E-commerce Pro',
      copy: 'Hosting especializado WooCommerce con SSL y performance garantizada',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=86'
    },
    proofPoints: ['SSL gratuito', 'WooCommerce pre-instalado', 'Backup diario'],
    whenToUse: 'Esencial para cualquier negocio que quiera vender online',
    synonyms: ['tienda virtual', 'e-commerce WordPress'],
    lastUpdated: '2025-01-15'
  },
  // SEO Terms
  {
    id: 'seo-001',
    slug: 'schema-markup',
    title: 'Schema Markup',
    shortDefinition: 'Código estructurado que ayuda a Google entender tu contenido y mostrar rich snippets en los resultados de búsqueda.',
    longDefinition: 'Schema Markup es código JSON-LD que describe tu contenido para motores de búsqueda, mejorando la visibilidad con rich snippets.',
    category: 'seo',
    cms: 'general',
    tags: ['schema', 'rich-snippets', 'structured-data', 'json-ld', 'seo-tecnico'],
    level: 'medio',
    related: ['yoast-seo', 'google-search-console', 'seo-local'],
    hostingRequirements: ['Soporte para modificar <head>', 'Plugins SEO compatibles'],
    cta: {
      plan: 'WordPress Pro',
      copy: 'Hosting optimizado para SEO con Schema automático incluido',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=84'
    },
    proofPoints: ['Schema automático configurado', 'Rich snippets monitoring'],
    whenToUse: 'Imprescindible para e-commerce, negocios locales, blogs de contenido',
    synonyms: ['datos estructurados', 'rich snippets'],
    lastUpdated: '2025-01-15'
  },
  {
    id: 'seo-002',
    slug: 'yoast-seo',
    title: 'Yoast SEO',
    shortDefinition: 'Plugin WordPress líder en SEO que optimiza contenido, genera sitemaps y mejora el posicionamiento automáticamente.',
    longDefinition: 'Yoast SEO es el plugin SEO más usado del mundo, esencial para optimizar sitios WordPress con análisis de contenido y SEO técnico.',
    category: 'seo',
    cms: 'wordpress',
    tags: ['yoast', 'seo-plugin', 'optimization', 'wordpress-seo'],
    level: 'basico',
    related: ['schema-markup', 'google-search-console', 'wordpress'],
    hostingRequirements: ['WordPress actualizado', 'PHP 7.4+', 'MySQL optimizado'],
    cta: {
      plan: 'SEO Pro',
      copy: 'Hosting con Yoast SEO Premium incluido y configurado',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=84'
    },
    proofPoints: ['Yoast Premium incluido', 'SEO setup automático', 'Monitoreo ranking'],
    whenToUse: 'Esencial para cualquier sitio WordPress que quiera posicionarse',
    synonyms: ['plugin seo', 'wordpress seo'],
    lastUpdated: '2025-01-15'
  },
  {
    id: 'seo-003',
    slug: 'google-search-console',
    title: 'Google Search Console',
    shortDefinition: 'Herramienta gratuita de Google que muestra cómo tu sitio aparece en búsquedas y te ayuda a optimizar tu SEO.',
    longDefinition: 'Google Search Console es la línea directa entre tu sitio web y Google, proporcionando datos cruciales sobre rendimiento SEO.',
    category: 'seo',
    cms: 'general',
    tags: ['google', 'search-console', 'analytics', 'seo-tools'],
    level: 'medio',
    related: ['schema-markup', 'yoast-seo', 'page-speed'],
    hostingRequirements: ['Verificación HTML/DNS', 'Sitemap.xml automático'],
    cta: {
      plan: 'SEO Pro',
      copy: 'Hosting con Google Search Console pre-configurado',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=84'
    },
    proofPoints: ['Search Console configurado', 'Monitoreo SEO 24/7'],
    whenToUse: 'Imprescindible para cualquier sitio que quiera tráfico orgánico',
    synonyms: ['GSC', 'webmaster tools'],
    lastUpdated: '2025-01-15'
  },
  {
    id: 'seo-004',
    slug: 'page-speed-insights',
    title: 'Page Speed Insights',
    shortDefinition: 'Herramienta de Google que analiza la velocidad de tu sitio web y proporciona recomendaciones específicas para mejorar el rendimiento.',
    longDefinition: 'Page Speed Insights mide Core Web Vitals y proporciona métricas cruciales para SEO y experiencia de usuario.',
    category: 'seo',
    cms: 'general',
    tags: ['velocidad', 'performance', 'core-web-vitals', 'page-speed'],
    level: 'medio',
    related: ['litespeed-cache', 'google-search-console', 'cdn'],
    hostingRequirements: ['SSD NVMe', 'HTTP/3', 'Cache server-side'],
    cta: {
      plan: 'Performance Pro',
      copy: 'Hosting ultra-rápido con Page Speed 90+ garantizado',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=84'
    },
    proofPoints: ['Page Speed Score 90+', 'CDN global incluido'],
    whenToUse: 'Crítico para SEO, conversiones y experiencia móvil',
    synonyms: ['PageSpeed', 'velocidad web'],
    lastUpdated: '2025-01-15'
  },
  {
    id: 'seo-005',
    slug: 'seo-local',
    title: 'SEO Local',
    shortDefinition: 'Estrategias de optimización para aparecer en búsquedas geográficas locales como "restaurante cerca de mí" o "dentista Santiago".',
    longDefinition: 'SEO Local optimiza tu negocio para búsquedas con intención geográfica, crucial para empresas con ubicación física.',
    category: 'seo',
    cms: 'general',
    tags: ['seo-local', 'google-my-business', 'local-business', 'geolocalizacion'],
    level: 'medio',
    related: ['schema-markup', 'google-search-console', 'reviews'],
    hostingRequirements: ['Schema Local Business', 'SSL certificado', 'Hosting en Chile'],
    cta: {
      plan: 'Local Business',
      copy: 'Hosting optimizado para SEO local con presencia en Chile',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=83'
    },
    proofPoints: ['Servidores en Chile', 'Schema local configurado', 'GMB optimization'],
    whenToUse: 'Esencial para restaurantes, clínicas, tiendas físicas y servicios locales',
    synonyms: ['local seo', 'seo geografico'],
    lastUpdated: '2025-01-15'
  },
  
  // WordPress Core Terms
  {
    id: 'wp-006',
    slug: 'hooks-wordpress',
    title: 'Hooks de WordPress',
    shortDefinition: 'Sistema de eventos que permite modificar o extender WordPress sin editar archivos core. Incluye Actions y Filters.',
    longDefinition: `Los hooks son el corazón del sistema de plugins de WordPress. Permiten que desarrolladores "enganchen" funciones personalizadas en puntos específicos del ciclo de vida de WordPress.

## Tipos de Hooks

### Actions
\`\`\`php
// Ejecutar código cuando se inicializa WordPress
add_action('init', 'mi_funcion_personalizada');

function mi_funcion_personalizada() {
    // Tu código aquí
}
\`\`\`

### Filters
\`\`\`php
// Modificar el título de las entradas
add_filter('the_title', 'modificar_titulo');

function modificar_titulo($title) {
    return $title . ' - Modificado';
}
\`\`\`

Los hooks son esenciales para el desarrollo de themes y plugins profesionales.`,
    category: 'wordpress',
    cms: 'wordpress',
    tags: ['desarrollo', 'php', 'actions', 'filters', 'plugins'],
    level: 'avanzado',
    related: ['child-theme', 'php', 'plugin-wordpress'],
    hostingRequirements: ['PHP 8.0+', 'Error logging habilitado', 'Debug mode'],
    cta: {
      plan: 'Developer Pro',
      copy: 'Hosting con herramientas de desarrollo y debugging para WordPress',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=85'
    },
    proofPoints: ['PHP 8.1 optimizado', 'Xdebug incluido', 'Error logs automáticos'],
    whenToUse: 'Imprescindible para desarrolladores que crean themes y plugins personalizados',
    synonyms: ['wordpress hooks', 'acciones wordpress', 'filtros wordpress'],
    lastUpdated: '2025-01-15'
  },
  {
    id: 'wp-007',
    slug: 'custom-post-types',
    title: 'Custom Post Types',
    shortDefinition: 'Tipos de contenido personalizados en WordPress que van más allá de posts y páginas (ej: productos, eventos, testimonios).',
    longDefinition: `Los Custom Post Types permiten crear tipos de contenido estructurado específicos para tu sitio web, ampliando las capacidades básicas de WordPress.

## Creación de CPT

\`\`\`php
function crear_cpt_productos() {
    register_post_type('producto', array(
        'public' => true,
        'label' => 'Productos',
        'supports' => array('title', 'editor', 'thumbnail'),
        'has_archive' => true,
    ));
}
add_action('init', 'crear_cpt_productos');
\`\`\`

Ideal para sitios que manejan contenido específico como portfolios, catálogos o directorios.`,
    category: 'wordpress',
    cms: 'wordpress',
    tags: ['custom-post-types', 'desarrollo', 'contenido', 'estructura'],
    level: 'medio',
    related: ['advanced-custom-fields', 'wp-query', 'taxonomies'],
    hostingRequirements: ['MySQL optimizado', 'PHP 8.0+', 'Permalinks amigables'],
    cta: {
      plan: 'Business Pro',
      copy: 'Hosting optimizado para sitios WordPress con contenido complejo',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=84'
    },
    proofPoints: ['Base de datos SSD', 'Cache object-level', 'URL rewriting optimizado'],
    whenToUse: 'Perfecto para catálogos de productos, portfolios, directorios y sitios corporativos',
    synonyms: ['cpt', 'tipos de entrada personalizados'],
    lastUpdated: '2025-01-15'
  },
  {
    id: 'wp-008',
    slug: 'wp-query',
    title: 'WP_Query',
    shortDefinition: 'Clase PHP de WordPress para crear consultas personalizadas a la base de datos y mostrar contenido específico.',
    longDefinition: `WP_Query es la clase que potencia todas las consultas de WordPress. Permite crear loops personalizados y mostrar contenido filtrado según criterios específicos.

## Ejemplo básico
\`\`\`php
$consulta = new WP_Query(array(
    'post_type' => 'producto',
    'posts_per_page' => 6,
    'meta_key' => 'destacado',
    'meta_value' => 'si'
));

if ($consulta->have_posts()) {
    while ($consulta->have_posts()) {
        $consulta->the_post();
        // Mostrar contenido
    }
    wp_reset_postdata();
}
\`\`\`

Esencial para themes personalizados y funcionalidades avanzadas.`,
    category: 'wordpress',
    cms: 'wordpress',
    tags: ['wp-query', 'loop', 'consultas', 'database', 'php'],
    level: 'avanzado',
    related: ['custom-post-types', 'advanced-custom-fields', 'mysql'],
    hostingRequirements: ['MySQL 8.0+', 'Query cache habilitado', 'Slow query log'],
    cta: {
      plan: 'Performance Pro',
      copy: 'Hosting con base de datos optimizada para consultas complejas',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=85'
    },
    proofPoints: ['MySQL 8.0 optimizado', 'Query cache activo', 'Monitoring de DB'],
    whenToUse: 'Necesario para mostrar contenido filtrado, paginación custom y loops avanzados',
    synonyms: ['consultas wordpress', 'wp query', 'loop personalizado'],
    lastUpdated: '2025-01-15'
  },

  // Page Builders
  {
    id: 'pb-003',
    slug: 'oxygen-builder',
    title: 'Oxygen Builder',
    shortDefinition: 'Page builder profesional para WordPress que reemplaza completamente el sistema de themes tradicional.',
    longDefinition: `Oxygen Builder es una herramienta avanzada que permite crear sitios WordPress completamente personalizados sin depender de themes tradicionales.

## Características únicas
- **Sin bloat**: Genera código limpio y optimizado
- **Control total**: Acceso a CSS, HTML y PHP
- **Rendimiento**: Sitios más rápidos que con themes tradicionales
- **Reutilización**: Components y templates globales

Ideal para desarrolladores que buscan máximo control y rendimiento.`,
    category: 'builders',
    cms: 'wordpress',
    tags: ['oxygen', 'page-builder', 'rendimiento', 'desarrolladores'],
    level: 'avanzado',
    related: ['litespeed-cache', 'css', 'php'],
    hostingRequirements: ['PHP 8.0+', 'Memoria 512MB+', 'LiteSpeed/Nginx'],
    cta: {
      plan: 'Developer Pro',
      copy: 'Hosting optimizado para Oxygen Builder con máximo rendimiento',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=85'
    },
    proofPoints: ['LiteSpeed integrado', 'PHP 8.1 optimizado', 'Memoria 1GB garantizada'],
    whenToUse: 'Para desarrolladores que priorizan rendimiento y control total del código',
    synonyms: ['oxygen', 'oxygen wp'],
    lastUpdated: '2025-01-15'
  },
  {
    id: 'pb-004',
    slug: 'bricks-builder',
    title: 'Bricks Builder',
    shortDefinition: 'Page builder moderno para WordPress con enfoque en velocidad, flexibilidad y código limpio.',
    longDefinition: `Bricks es un page builder de nueva generación que combina facilidad de uso con potencia técnica, generando código limpio y sitios ultra-rápidos.

## Ventajas principales
- **Rendimiento superior**: Código optimizado automáticamente
- **Flexibilidad**: CSS Grid, Flexbox nativo
- **Developer-friendly**: Custom code integrado
- **Actualizado**: Tecnologías web modernas

Perfecto balance entre usabilidad y potencia técnica.`,
    category: 'builders',
    cms: 'wordpress',
    tags: ['bricks', 'page-builder', 'css-grid', 'flexbox', 'moderno'],
    level: 'medio',
    related: ['css', 'responsive-design', 'performance'],
    hostingRequirements: ['PHP 8.0+', 'Brotli compression', 'HTTP/3'],
    cta: {
      plan: 'Performance Plus',
      copy: 'Hosting con tecnologías modernas para Bricks Builder',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=84'
    },
    proofPoints: ['HTTP/3 habilitado', 'Brotli compression', 'Edge caching'],
    whenToUse: 'Ideal para diseñadores que buscan modernidad sin complejidad extrema',
    synonyms: ['bricks', 'bricks wp'],
    lastUpdated: '2025-01-15'
  },

  // Performance Terms
  {
    id: 'perf-004',
    slug: 'core-web-vitals',
    title: 'Core Web Vitals',
    shortDefinition: 'Métricas oficiales de Google que miden la experiencia del usuario: LCP, FID, CLS. Afectan directamente el SEO.',
    longDefinition: `Core Web Vitals son tres métricas clave que Google usa para evaluar la experiencia del usuario y posicionamiento SEO.

## Las 3 métricas esenciales

### LCP (Largest Contentful Paint)
- **Meta**: < 2.5 segundos
- **Mide**: Tiempo de carga del elemento principal
- **Mejoras**: Optimizar imágenes, CDN, hosting rápido

### FID (First Input Delay)
- **Meta**: < 100 milisegundos  
- **Mide**: Respuesta a primera interacción
- **Mejoras**: Optimizar JavaScript, code splitting

### CLS (Cumulative Layout Shift)
- **Meta**: < 0.1
- **Mide**: Estabilidad visual durante carga
- **Mejoras**: Reservar espacio para elementos dinámicos

Crítico para SEO desde 2021.`,
    category: 'performance',
    cms: 'general',
    tags: ['core-web-vitals', 'lcp', 'fid', 'cls', 'seo', 'google'],
    level: 'medio',
    related: ['page-speed-insights', 'cdn', 'litespeed-cache'],
    hostingRequirements: ['SSD NVMe', 'CDN global', 'HTTP/3', 'Edge caching'],
    cta: {
      plan: 'Speed Optimize',
      copy: 'Hosting optimizado para Core Web Vitals perfectos',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=86'
    },
    proofPoints: ['Core Web Vitals 90+', 'CDN 200+ ubicaciones', 'Optimización automática'],
    whenToUse: 'Esencial para cualquier sitio que dependa de tráfico orgánico de Google',
    synonyms: ['web vitals', 'métricas google', 'lcp fid cls'],
    lastUpdated: '2025-01-15'
  },
  {
    id: 'perf-005',
    slug: 'lazy-loading',
    title: 'Lazy Loading',
    shortDefinition: 'Técnica que carga imágenes y contenido solo cuando el usuario va a verlos, mejorando la velocidad inicial.',
    longDefinition: `Lazy Loading retrasa la carga de elementos no visibles hasta que el usuario se desplaza hacia ellos, reduciendo el tiempo de carga inicial.

## Implementación nativa HTML
\`\`\`html
<img src="imagen.jpg" loading="lazy" alt="Descripción">
\`\`\`

## Con JavaScript
\`\`\`javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      observer.unobserve(img);
    }
  });
});
\`\`\`

Mejora significativamente Core Web Vitals y experiencia móvil.`,
    category: 'performance',
    cms: 'general',
    tags: ['lazy-loading', 'imagenes', 'performance', 'mobile', 'core-web-vitals'],
    level: 'basico',
    related: ['core-web-vitals', 'webp', 'responsive-images'],
    hostingRequirements: ['HTTP/2+', 'Compresión imágenes', 'CDN'],
    cta: {
      plan: 'Performance',
      copy: 'Hosting con lazy loading automático y optimización de imágenes',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=84'
    },
    proofPoints: ['Lazy loading incluido', 'WebP automático', 'Compresión sin pérdida'],
    whenToUse: 'Imprescindible para sitios con muchas imágenes, galerías y contenido visual',
    synonyms: ['carga diferida', 'carga lazy', 'imagenes lazy'],
    lastUpdated: '2025-01-15'
  },

  // Security Terms
  {
    id: 'sec-003',
    slug: 'waf',
    title: 'WAF (Web Application Firewall)',
    shortDefinition: 'Firewall que protege aplicaciones web filtrando tráfico malicioso antes de que llegue al servidor.',
    longDefinition: `Un WAF actúa como barrera protectora entre tu sitio web y el tráfico de internet, filtrando requests maliciosos y ataques comunes.

## Tipos de protección
- **SQL Injection**: Bloquea intentos de manipular la base de datos
- **XSS**: Previene scripts maliciosos en formularios
- **DDoS**: Mitiga ataques de denegación de servicio
- **Brute Force**: Detecta intentos de login masivos

## Configuración básica
\`\`\`apache
# En .htaccess
<IfModule mod_security.c>
    SecRuleEngine On
    SecRule REQUEST_URI "@contains /wp-admin" \\
        "id:1001,deny,status:403"
</IfModule>
\`\`\`

Esencial para sitios con datos sensibles o alto tráfico.`,
    category: 'security',
    cms: 'general',
    tags: ['waf', 'firewall', 'seguridad', 'ddos', 'sql-injection'],
    level: 'medio',
    related: ['ssl', 'backup', 'two-factor'],
    hostingRequirements: ['ModSecurity', 'Rate limiting', 'IP blocking'],
    cta: {
      plan: 'Security Pro',
      copy: 'Hosting con WAF avanzado y protección multicapa',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=87'
    },
    proofPoints: ['WAF CloudFlare incluido', 'DDoS protection', 'Monitoreo 24/7'],
    whenToUse: 'Crítico para e-commerce, sitios con login y aplicaciones con datos sensibles',
    synonyms: ['web application firewall', 'firewall aplicaciones'],
    lastUpdated: '2025-01-15'
  },
  {
    id: 'sec-004',
    slug: 'two-factor-authentication',
    title: 'Autenticación de Dos Factores (2FA)',
    shortDefinition: 'Sistema de seguridad que requiere dos formas de verificación: contraseña + código temporal de app/SMS.',
    longDefinition: `2FA añade una capa extra de seguridad requiriendo dos elementos: algo que sabes (contraseña) y algo que tienes (teléfono/app).

## Métodos comunes
1. **App Authenticator**: Google Authenticator, Authy
2. **SMS**: Código enviado al móvil
3. **Email**: Código enviado al correo
4. **Hardware**: Llaves físicas (YubiKey)

## Implementación WordPress
\`\`\`php
// Con plugin Wordfence
function enable_2fa_wordfence() {
    // 2FA se configura desde panel de usuario
    // Requiere app authenticator
}
\`\`\`

Reduce el riesgo de hackeo en un 99.9%.`,
    category: 'security',
    cms: 'general',
    tags: ['2fa', 'two-factor', 'autenticacion', 'seguridad', 'login'],
    level: 'basico',
    related: ['ssl', 'strong-passwords', 'login-security'],
    hostingRequirements: ['SSL certificado', 'PHP sessions', 'Email delivery'],
    cta: {
      plan: 'Security',
      copy: 'Hosting con 2FA incluido y monitoreo de accesos',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=84'
    },
    proofPoints: ['2FA pre-configurado', 'Login monitoring', 'Alertas de acceso'],
    whenToUse: 'Obligatorio para admin WordPress, e-commerce y sitios con datos sensibles',
    synonyms: ['2fa', 'doble factor', 'autenticacion doble'],
    lastUpdated: '2025-01-15'
  },

  // WooCommerce Terms
  {
    id: 'wc-003',
    slug: 'woocommerce-api',
    title: 'WooCommerce API',
    shortDefinition: 'Interface de programación que permite integrar tiendas WooCommerce con aplicaciones externas y automatizar procesos.',
    longDefinition: `La WooCommerce REST API permite conectar tu tienda con sistemas externos, apps móviles, ERPs y automatizar operaciones de e-commerce.

## Casos de uso principales
- **Sincronización**: Inventario con ERP/CRM
- **Apps móviles**: Crear aplicaciones nativas
- **Marketplaces**: Conectar con Amazon, MercadoLibre
- **Automatización**: Procesos de orden y fulfillment

## Ejemplo de uso
\`\`\`javascript
// Obtener productos
fetch('/wp-json/wc/v3/products', {
    method: 'GET',
    headers: {
        'Authorization': 'Basic ' + btoa(key + ':' + secret)
    }
})
.then(response => response.json())
.then(products => console.log(products));
\`\`\`

Esencial para tiendas que necesitan integraciones avanzadas.`,
    category: 'woocommerce',
    cms: 'wordpress',
    tags: ['woocommerce-api', 'rest-api', 'integraciones', 'automatizacion'],
    level: 'avanzado',
    related: ['woocommerce', 'json', 'oauth'],
    hostingRequirements: ['Pretty permalinks', 'JSON support', 'HTTPS', 'Rate limiting'],
    cta: {
      plan: 'E-commerce Pro',
      copy: 'Hosting optimizado para integraciones WooCommerce avanzadas',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=88'
    },
    proofPoints: ['API rate limiting optimizado', 'SSL premium', 'Monitoreo API'],
    whenToUse: 'Necesario para tiendas con ERP, apps móviles o integraciones con terceros',
    synonyms: ['woo api', 'api woocommerce', 'rest api woo'],
    lastUpdated: '2025-01-15'
  },

  // LMS Terms  
  {
    id: 'lms-003',
    slug: 'learndash',
    title: 'LearnDash',
    shortDefinition: 'Plugin LMS premium para WordPress que permite crear cursos online completos con quizzes, certificados y gamificación.',
    longDefinition: `LearnDash es el plugin LMS más popular para WordPress, usado por universidades y empresas para crear academias online profesionales.

## Características principales
- **Course Builder**: Creador visual de cursos
- **Drip Content**: Liberar contenido gradualmente
- **Gamificación**: Points, badges, leaderboards
- **Certificados**: PDF automáticos personalizables
- **Integración WooCommerce**: Vender cursos

## Estructura típica
\`\`\`
Curso > Lecciones > Topics > Quiz > Certificado
\`\`\`

Ideal para academias online, capacitación corporativa y educación continua.`,
    category: 'lms',
    cms: 'wordpress',
    tags: ['learndash', 'lms', 'cursos-online', 'elearning', 'certificados'],
    level: 'medio',
    related: ['woocommerce', 'video-hosting', 'membership'],
    hostingRequirements: ['PHP 8.0+', 'Memoria 512MB+', 'Video streaming', 'CDN'],
    cta: {
      plan: 'Education Pro',
      copy: 'Hosting especializado en LearnDash con streaming optimizado',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=89'
    },
    proofPoints: ['Video streaming incluido', 'CDN educativo', 'Memoria 1GB garantizada'],
    whenToUse: 'Perfecto para crear academias online, cursos corporativos y educación continua',
    synonyms: ['learn dash', 'lms wordpress'],
    lastUpdated: '2025-01-15'
  },

  // Alternative CMS
  {
    id: 'cms-003',
    slug: 'drupal',
    title: 'Drupal',
    shortDefinition: 'CMS modular y potente ideal para sitios web complejos, portales gubernamentales y aplicaciones enterprise.',
    longDefinition: `Drupal es un CMS robusto que destaca en proyectos complejos donde se requiere máxima flexibilidad, seguridad y escalabilidad.

## Fortalezas principales
- **Taxonomías avanzadas**: Sistema de categorización flexible
- **Views**: Query builder visual potente
- **Multisite**: Gestión de múltiples sitios
- **APIs first**: Headless/decoupled por diseño
- **Seguridad**: Actualizaciones frecuentes y comunidad activa

## Casos de uso ideales
- Portales gubernamentales
- Sitios universitarios
- Aplicaciones enterprise
- Intranets complejas

Requiere mayor conocimiento técnico que WordPress pero ofrece más flexibilidad arquitectural.`,
    category: 'cms',
    cms: 'drupal',
    tags: ['drupal', 'cms', 'enterprise', 'gobierno', 'escalabilidad'],
    level: 'avanzado',
    related: ['php', 'mysql', 'composer'],
    hostingRequirements: ['PHP 8.1+', 'Composer', 'Drush CLI', 'Memory 1GB+'],
    cta: {
      plan: 'Enterprise',
      copy: 'Hosting especializado en Drupal con herramientas de desarrollo',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=90'
    },
    proofPoints: ['Drupal pre-instalado', 'Drush incluido', 'Ambiente staging'],
    whenToUse: 'Ideal para proyectos gubernamentales, universitarios y aplicaciones enterprise complejas',
    synonyms: ['drupal cms', 'drupal 9', 'drupal 10'],
    lastUpdated: '2025-01-15'
  },
  {
    id: 'cms-004',
    slug: 'prestashop',
    title: 'PrestaShop',
    shortDefinition: 'Plataforma e-commerce open source especializada en tiendas online con funcionalidades avanzadas de venta.',
    longDefinition: `PrestaShop es una solución e-commerce completa diseñada específicamente para tiendas online, con funcionalidades comerciales avanzadas out-of-the-box.

## Ventajas comerciales
- **Multi-tienda**: Gestionar múltiples tiendas desde un panel
- **Multi-idioma/moneda**: Ventas internacionales nativas
- **Gestión de stock**: Inventario avanzado con variantes
- **Marketing**: Cupones, descuentos, cross-selling
- **Analytics**: Reportes de ventas detallados

## vs WooCommerce
- ✅ Más funciones e-commerce nativas
- ✅ Mejor rendimiento en catálogos grandes
- ❌ Menos flexible para personalización
- ❌ Menor ecosistema de plugins

Ideal para tiendas que priorizan funcionalidad comercial sobre flexibilidad de contenido.`,
    category: 'cms',
    cms: 'prestashop',
    tags: ['prestashop', 'ecommerce', 'tienda-online', 'multi-tienda'],
    level: 'medio',
    related: ['mysql', 'php', 'ecommerce-optimization'],
    hostingRequirements: ['PHP 8.0+', 'MySQL 5.7+', 'SSL', 'Memory 512MB+'],
    cta: {
      plan: 'E-commerce',
      copy: 'Hosting optimizado para PrestaShop con SSL y CDN incluido',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=88'
    },
    proofPoints: ['PrestaShop optimizado', 'SSL incluido', 'Cache especializado'],
    whenToUse: 'Perfecto para tiendas online que necesitan funcionalidades comerciales avanzadas desde el inicio',
    synonyms: ['presta shop', 'prestashop ecommerce'],
    lastUpdated: '2025-01-15'
  },

  // Trends 2025
  {
    id: 'trend-003',
    slug: 'jamstack',
    title: 'JAMstack',
    shortDefinition: 'Arquitectura web moderna basada en JavaScript, APIs y Markup pre-construido para sitios ultra-rápidos y seguros.',
    longDefinition: `JAMstack representa un cambio paradigmático hacia sitios web más rápidos, seguros y escalables mediante pre-construcción y CDN global.

## Componentes principales
- **JavaScript**: Funcionalidad dinámica del lado cliente
- **APIs**: Servicios externos para funcionalidades backend
- **Markup**: HTML pre-generado en build time

## Generadores populares
- **Next.js**: React con SSG/SSR
- **Gatsby**: React enfocado en performance
- **Nuxt.js**: Vue.js con SSG
- **Hugo**: Go, extremadamente rápido

## Ventajas clave
- ⚡ Performance superior
- 🔒 Seguridad mejorada (no hay servidor tradicional)
- 💰 Costos reducidos de hosting
- 📈 Escalabilidad automática

Tendencia dominante para sitios modernos en 2025.`,
    category: 'trends-2025',
    cms: 'general',
    tags: ['jamstack', 'static-site', 'nextjs', 'gatsby', 'performance'],
    level: 'avanzado',
    related: ['cdn', 'static-site-generators', 'headless-cms'],
    hostingRequirements: ['CDN global', 'Edge computing', 'Static hosting', 'CI/CD'],
    cta: {
      plan: 'JAMstack Pro',
      copy: 'Hosting especializado en JAMstack con deployment automático',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=91'
    },
    proofPoints: ['CDN 300+ ubicaciones', 'Deploy automático', 'Edge functions'],
    whenToUse: 'Ideal para sitios corporativos, blogs y e-commerce que priorizan velocidad extrema',
    synonyms: ['jamstack', 'static sites', 'headless websites'],
    lastUpdated: '2025-01-15'
  },
  {
    id: 'trend-004',
    slug: 'edge-computing',
    title: 'Edge Computing',
    shortDefinition: 'Procesamiento de datos cerca del usuario final para reducir latencia y mejorar la experiencia web.',
    longDefinition: `Edge Computing acerca el procesamiento a los usuarios finales, reduciendo drasticamente los tiempos de respuesta y mejorando la experiencia global.

## Beneficios principales
- **Latencia ultra-baja**: Procesamiento local
- **Personalización**: Contenido adaptado por región
- **Disponibilidad**: Redundancia geográfica
- **Compliance**: Datos locales según regulaciones

## Tecnologías clave 2025
- **Cloudflare Workers**: JavaScript en el edge
- **Vercel Edge Functions**: Serverless distribuido
- **AWS Lambda@Edge**: Funciones en CloudFront
- **CDN dinámico**: Cached + compute

## Casos de uso
- Personalización geográfica
- A/B testing sin latencia
- Autenticación distribuida
- API caching inteligente

El futuro del web performance está en el edge.`,
    category: 'trends-2025',
    cms: 'general',
    tags: ['edge-computing', 'cdn', 'latencia', 'performance', 'serverless'],
    level: 'avanzado',
    related: ['cdn', 'jamstack', 'core-web-vitals'],
    hostingRequirements: ['Edge locations', 'Serverless functions', 'Global CDN'],
    cta: {
      plan: 'Edge Pro',
      copy: 'Hosting con edge computing para máximo rendimiento global',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=92'
    },
    proofPoints: ['500+ edge locations', 'Sub-50ms latencia', 'Edge functions incluidas'],
    whenToUse: 'Esencial para aplicaciones globales, e-commerce internacional y sitios críticos',
    synonyms: ['edge computing', 'computacion en el borde'],
    lastUpdated: '2025-01-15'
  },
  {
    id: 'trend-005',
    slug: 'ai-content-generation',
    title: 'Generación de Contenido con IA',
    shortDefinition: 'Uso de inteligencia artificial para crear contenido web automáticamente: textos, imágenes, videos y código.',
    longDefinition: `La IA está revolucionando la creación de contenido web, permitiendo generar material de calidad a escala sin precedentes.

## Herramientas principales 2025
- **GPT-4/Claude**: Textos y código
- **DALL-E 3/Midjourney**: Imágenes
- **Runway/Pika**: Videos
- **GitHub Copilot**: Código

## Aplicaciones en websites
- **Artículos SEO**: Contenido optimizado automático
- **Producto descriptions**: E-commerce escalable
- **Imágenes personalizadas**: Branding único
- **Chatbots avanzados**: Soporte automatizado

## Integración WordPress
\`\`\`php
// Plugin AI Content Generator
function generate_ai_content($prompt) {
    $api_response = wp_remote_post('https://api.openai.com/v1/chat/completions', [
        'headers' => ['Authorization' => 'Bearer ' . $api_key],
        'body' => json_encode(['prompt' => $prompt])
    ]);
    return $response['content'];
}
\`\`\`

Transformando la creación de contenido en 2025.`,
    category: 'trends-2025',
    cms: 'general',
    tags: ['ai', 'contenido', 'automatizacion', 'chatgpt', 'machine-learning'],
    level: 'medio',
    related: ['api-integration', 'content-marketing', 'seo'],
    hostingRequirements: ['API rate limits altos', 'SSL premium', 'Cache dinámico'],
    cta: {
      plan: 'AI Content',
      copy: 'Hosting optimizado para sitios con generación de contenido IA',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=93'
    },
    proofPoints: ['APIs IA optimizadas', 'Rate limiting flexible', 'Storage expandible'],
    whenToUse: 'Perfecto para blogs automatizados, e-commerce con muchos productos y sitios de contenido',
    synonyms: ['ia contenido', 'content ai', 'generacion automatica'],
    lastUpdated: '2025-01-15'
  }
];

// Helper functions
export const searchTerms = (query: string, filters?: Record<string, any>): WikiTerm[] => {
  let results = wikiTerms;
  
  if (query) {
    const searchQuery = query.toLowerCase();
    results = results.filter(term =>
      term.title.toLowerCase().includes(searchQuery) ||
      term.shortDefinition.toLowerCase().includes(searchQuery) ||
      term.longDefinition?.toLowerCase().includes(searchQuery) ||
      term.tags.some(tag => tag.toLowerCase().includes(searchQuery)) ||
      term.synonyms?.some(synonym => synonym.toLowerCase().includes(searchQuery))
    );
  }
  
  if (filters) {
    if (filters.category) {
      results = results.filter(term => term.category === filters.category);
    }
    if (filters.cms) {
      results = results.filter(term => term.cms === filters.cms);
    }
    if (filters.level) {
      results = results.filter(term => term.level === filters.level);
    }
  }
  
  return results;
};

export const getRelatedTerms = (currentSlug: string): WikiTerm[] => {
  const currentTerm = wikiTerms.find(term => term.slug === currentSlug);
  if (!currentTerm) return [];
  
  return wikiTerms.filter(term => 
    currentTerm.related.includes(term.slug)
  );
};
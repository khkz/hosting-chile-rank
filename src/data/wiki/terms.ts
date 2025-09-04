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
    termCount: 15
  },
  {
    id: 'builders',
    name: 'Page Builders',
    description: 'Constructores visuales para WordPress',
    icon: '🎨',
    termCount: 12
  },
  {
    id: 'seo',
    name: 'SEO',
    description: 'Optimización para motores de búsqueda',
    icon: '🔍',
    termCount: 10
  },
  {
    id: 'performance',
    name: 'Performance',
    description: 'Optimización de velocidad y caché',
    icon: '⚡',
    termCount: 18
  },
  {
    id: 'security',
    name: 'Seguridad',
    description: 'Protección y hardening web',
    icon: '🛡️',
    termCount: 12
  },
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    description: 'E-commerce con WordPress',
    icon: '🛒',
    termCount: 15
  },
  {
    id: 'lms',
    name: 'LMS',
    description: 'Sistemas de gestión de aprendizaje',
    icon: '🎓',
    termCount: 8
  },
  {
    id: 'cms',
    name: 'CMS Alternativos',
    description: 'Joomla, Drupal y otros CMS',
    icon: '🌐',
    termCount: 10
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
  // WordPress Core
  {
    id: 'wp-001',
    slug: 'wordpress',
    title: 'WordPress',
    shortDefinition: 'El CMS que cambió la web: potencia más del 43% de todos los sitios web del mundo. Desde blogs personales hasta tiendas online masivas.',
    longDefinition: `
## ¿Qué es WordPress realmente?

WordPress comenzó en 2003 como una plataforma simple para blogs, pero se ha convertido en el motor que impulsa casi la mitad de internet. No es solo un software; es todo un ecosistema que permite a cualquier persona crear sitios web profesionales sin necesidad de programar.

![Ilustración conceptual de un dashboard moderno](/src/assets/wiki/wordpress-dashboard.jpg "Ilustración abstracta representando un panel de administración - Interfaz moderna y minimalista")

## ¿Por qué WordPress domina el mercado?

![Visualización de datos abstracta](/src/assets/wiki/wordpress-stats.jpg "Ilustración de gráficos y estadísticas en estilo minimalista")

**La historia es fascinante:** Matt Mullenweg tenía solo 19 años cuando cofundó WordPress. Hoy, empresas como The New York Times, Sony Music y hasta la Casa Blanca usan WordPress. En Chile, desde La Tercera hasta pequeños emprendimientos locales confían en esta plataforma.

### Lo que hace especial a WordPress:

**1. Flexibilidad sin límites**
WordPress puede ser literalmente cualquier cosa: un blog personal, una tienda online que facture millones, un sitio corporativo, un portal de noticias, o incluso una plataforma de cursos. La flexibilidad viene de su arquitectura modular: temas controlan el diseño, plugins agregan funcionalidad.

**2. Comunidad global activa**
Con más de 60,000 plugins gratuitos y miles de temas, hay una solución para prácticamente cualquier necesidad. La comunidad chilena de WordPress también es muy activa, con meetups regulares en Santiago y Valparaíso.

**3. SEO nativo**
WordPress está construido pensando en SEO. URLs limpias, estructura semántica, sitemap automático, y compatibilidad con plugins como Yoast o RankMath hacen que posicionar en Google sea mucho más fácil.

## Editor Gutenberg: La revolución del contenido

![Ilustración de edición de contenido](/src/assets/wiki/gutenberg-editor.jpg "Representación abstracta del flujo de trabajo creativo y edición de contenido")

El editor Gutenberg transformó WordPress desde 2018. Permite crear diseños sofisticados usando bloques: párrafos, imágenes, botones, columnas, galerías. Es como tener un page builder básico incluido gratis.

## Casos de uso reales en Chile

**Restaurantes:** La Piojera, Barrio Lastarria y cientos de restaurantes usan WordPress con reservas online, menús digitales y delivery integrado.

**E-commerce:** Desde artesanías en Pomaire hasta tecnología en Santiago, WooCommerce (plugin de WordPress) permite vender online con pasarelas chilenas como Flow y Khipu.

**Profesionales:** Abogados, arquitectos, dentistas... WordPress es perfecto para sitios corporativos que necesitan proyectar seriedad pero mantenerse actualizados fácilmente.

**Medios:** Varios medios digitales chilenos usan WordPress por su capacidad de manejar alto tráfico y publicar contenido rápidamente.

## Ventajas honestas de WordPress

✅ **Curva de aprendizaje suave:** Si sabes usar Word, puedes usar WordPress
✅ **Escalable:** Sirve desde 10 hasta 10 millones de visitas mensuales
✅ **Económico:** El software es gratis, solo pagas hosting y eventualmente plugins premium
✅ **SEO-friendly:** Google ama WordPress por su estructura limpia
✅ **Actualizaciones constantes:** Se mantiene al día con estándares web
✅ **Respaldo masivo:** 40% del web no puede estar equivocado

## Desventajas que debes conocer

❌ **Puede ser vulnerable:** Al ser tan popular, es blanco de hackers (se soluciona con seguridad adecuada)
❌ **Rendimiento variable:** Puede volverse lento con muchos plugins mal configurados
❌ **Mantenimiento necesario:** Requiere actualizaciones regulares
❌ **Curva técnica:** Para personalizaciones avanzadas necesitas conocimientos o ayuda profesional

## ¿Cuándo WordPress es la mejor opción?

**✅ Perfecto para:**
- Blogs y sitios de contenido
- Sitios corporativos medianos a grandes
- E-commerce con WooCommerce
- Portales de noticias y revistas
- Sitios que necesitan actualización frecuente
- Proyectos con presupuesto variable (puede crecer gradualmente)

**❌ Considera alternativas para:**
- Aplicaciones web complejas (mejor React/Angular)
- Sitios ultra-rápidos estáticos (mejor Gatsby/Next.js)
- E-commerce masivo (considera Shopify Plus)
- Aplicaciones móviles nativas

## Requisitos técnicos explicados simple

![Ilustración de infraestructura técnica](/src/assets/wiki/wordpress-requirements.jpg "Representación visual abstracta de requisitos técnicos y hosting")

**Hosting recomendado:**
- **PHP 8.0+:** WordPress está escrito en PHP, versiones antiguas son inseguras
- **MySQL 5.7+:** Base de datos donde se guarda todo el contenido
- **HTTPS obligatorio:** Google penaliza sitios sin SSL
- **Mod_rewrite:** Permite URLs amigables (/sobre-nosotros/ en vez de /index.php?page=about)

**En la práctica:** Cualquier hosting chileno decente cumple estos requisitos. HostingPlus los tiene optimizados específicamente para WordPress.

## WordPress vs. la competencia

**vs. Wix/Squarespace:** WordPress es más flexible pero requiere más conocimiento técnico

**vs. Shopify:** Para e-commerce puro, Shopify puede ser más simple, pero WordPress + WooCommerce es más económico a largo plazo

**vs. Drupal/Joomla:** WordPress es más fácil de usar, ellos son más potentes pero complejos

## Mitos que debes ignorar

**"WordPress es solo para blogs"** - Falso. El 43% del web incluye tiendas, portales corporativos, aplicaciones web.

**"WordPress es lento"** - Falso. Con hosting adecuado y configuración correcta, puede ser extremadamente rápido.

**"WordPress no es seguro"** - Falso. Es tan seguro como cualquier CMS si se mantiene actualizado y se configura correctamente.

## Primeros pasos recomendados

1. **Elige hosting especializado:** No todos los hostings son iguales para WordPress
2. **Instala WordPress:** Muchos hostings lo hacen automáticamente
3. **Elige un tema:** Empieza con Twenty Twenty-Four (tema oficial)
4. **Plugins esenciales:** Yoast SEO, Wordfence Security, backup plugin
5. **Crea contenido:** Empieza con páginas básicas (Inicio, Sobre nosotros, Contacto)

## El futuro de WordPress

WordPress no se duerme en los laureles. **Gutenberg** (el nuevo editor) está transformando la experiencia de creación. **Full Site Editing** permite personalizar completamente el diseño. La integración con **inteligencia artificial** está llegando fuerte.

**En Chile:** La adopción sigue creciendo. Empresas medianas están migrando de sitios estáticos a WordPress para tener control total de su presencia digital.

## FAQ frecuentes

**¿Es WordPress gratis?**
El software sí, pero necesitas hosting (desde $3.000/mes) y dominio ($15.000/año). Plugins premium son opcionales.

**¿Puedo migrar mi sitio actual a WordPress?**
Sí, hay herramientas y servicios especializados. La mayoría de hostings chilenos ofrecen migración gratuita.

**¿Necesito saber programar?**
No para uso básico. Para personalizaciones avanzadas ayuda, pero hay miles de desarrolladores WordPress en Chile.

**¿WordPress funciona en móviles?**
Sí, todos los temas modernos son responsive. Además puedes gestionar el sitio desde la app móvil.

## Conclusión: ¿Por qué WordPress sigue ganando?

WordPress democratizó la creación web. Antes necesitabas un programador para cada cambio; hoy cualquier emprendedor chileno puede tener una presencia web profesional en horas, no meses.

No es perfecto, pero la combinación de flexibilidad, costo y facilidad de uso lo mantiene como la mejor opción para la mayoría de proyectos web. En un mercado digital chileno cada vez más competitivo, WordPress te da las herramientas para destacar sin necesidad de ser un experto técnico.

**¿La recomendación?** Si tienes dudas entre WordPress y otra opción, probablemente WordPress sea la respuesta. Es difícil equivocarse con la plataforma que confían 800 millones de sitios web.
    `,
    category: 'wordpress',
    cms: 'wordpress',
    tags: ['cms', 'open-source', 'php', 'blog', 'ecommerce', 'seo', 'gutenberg', 'woocommerce'],
    level: 'basico',
    related: ['gutenberg', 'woocommerce', 'child-themes', 'multisite', 'elementor', 'yoast-seo'],
    hostingRequirements: [
      'PHP 8.0+ (recomendado 8.1 para mejor rendimiento)',
      'MySQL 5.7+ o MariaDB 10.4+',
      'HTTPS/SSL obligatorio (incluido gratis)',
      'Mod_rewrite para URLs amigables',
      'Memory limit mínimo 256MB (recomendado 512MB)',
      'Backup automático diario',
      'Actualizaciones automáticas de seguridad'
    ],
    cta: {
      plan: 'WordPress Básico',
      copy: 'WordPress optimizado con instalación automática, SSL gratis y soporte especializado desde $2.990/mes. Perfecto para empezar.',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=1'
    },
    proofPoints: [
      'Instalación con 1 clic y configuración optimizada',
      'Actualizaciones automáticas de WordPress y plugins', 
      'Soporte técnico especializado en WordPress',
      'SSL gratuito incluido',
      'Backup diario con restore fácil',
      'Staging area para probar cambios',
      'Cache optimizado para WordPress',
      'Malware scanning automático'
    ],
    whenToUse: 'WordPress es ideal para blogs, sitios corporativos, portales de noticias, e-commerce con WooCommerce, sitios de servicios profesionales (abogados, dentistas, arquitectos), portfolios creativos, y cualquier proyecto que necesite actualizaciones frecuentes de contenido. En Chile es especialmente popular para restaurantes, tiendas online, medios digitales y empresas de servicios.',
    synonyms: ['wp', 'wordpress.org', 'cms wordpress', 'gestor de contenidos'],
    lastUpdated: '2025-01-15'
  },
  {
    id: 'wp-002',
    slug: 'gutenberg',
    title: 'Gutenberg',
    shortDefinition: 'Editor de bloques nativo de WordPress. Permite diseñar páginas sin código.',
    longDefinition: 'Editor moderno de WordPress basado en bloques que reemplazó al editor clásico. Permite crear layouts complejos arrastrando y soltando elementos.',
    category: 'wordpress',
    cms: 'wordpress',
    tags: ['editor', 'bloques', 'fse'],
    level: 'basico',
    related: ['elementor', 'page-builders', 'full-site-editing'],
    hostingRequirements: ['PHP 8.0+', 'Memory limit 256MB+'],
    cta: {
      plan: 'WordPress Básico',
      copy: 'Prueba Gutenberg con hosting optimizado',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=1'
    },
    proofPoints: ['Compatible con todos los temas', 'Incluido gratis', 'Constantemente actualizado'],
    whenToUse: 'Para crear contenido rico sin plugins adicionales.',
    synonyms: ['editor de bloques', 'block editor']
  },

  // Page Builders
  {
    id: 'pb-001',
    slug: 'elementor',
    title: 'Elementor',
    shortDefinition: 'Constructor visual líder para WordPress. Acelera con LiteSpeed + HTTP/3.',
    longDefinition: `# ¿Qué es Elementor?

Elementor revolucionó WordPress desde 2016 convirtiéndose en el page builder más popular del mundo. No es solo una herramienta de diseño; es un ecosistema completo que democratiza la creación web profesional.

**La realidad en números:** Más de 5 millones de sitios web activos usan Elementor. En Chile, desde startups hasta corporaciones como Falabella Digital confían en esta plataforma para sus proyectos críticos.

## Elementor Free vs Pro: ¿Qué necesitas realmente?

### Elementor Free (Gratis)
- **30+ widgets básicos:** Texto, imagen, botón, video, mapa
- **Responsive editing:** Edita para móvil, tablet y desktop
- **Drag & drop visual:** Interfaz intuitiva sin código
- **Plantillas básicas:** Biblioteca limitada pero funcional

### Elementor Pro ($59/año)
- **90+ widgets premium:** Formularios, WooCommerce, testimonios
- **Theme Builder:** Crea headers, footers y plantillas personalizadas
- **WooCommerce Builder:** Páginas de producto, checkout, carrito
- **Motion Effects:** Animaciones, parallax, scrolling effects
- **Marketing Tools:** Popup Builder, Lead Generation

## Rendimiento: Elementor + LiteSpeed = Velocidad Extrema

**El problema común:** Elementor puede generar código pesado que ralentiza sitios web. La solución está en la infraestructura de hosting.

### Optimización con LiteSpeed Cache

\`\`\`
Configuración recomendada LiteSpeed:
- Page Cache: Activado
- Object Cache: Redis/Memcached
- CSS/JS Minify: LSCache automático
- Image Optimization: WebP + lazy loading
- Critical CSS: Generación automática
\`\`\`

**Resultado real:** Sitios Elementor que cargan en 2-3 segundos se optimizan a 0.8-1.2 segundos con LiteSpeed Enterprise + HTTP/3.

## Compatibilidad: Elementor vs Gutenberg

**¿Usar ambos?** Sí, es posible y recomendable:

- **Gutenberg:** Para blog posts y contenido editorial
- **Elementor:** Para landing pages, home, servicios, contacto

### Tabla Comparativa: Constructores Visuales

| Criterio | Elementor | Gutenberg | Divi |
|----------|-----------|-----------|------|
| **Curva aprendizaje** | Fácil | Muy fácil | Medio |
| **Velocidad base** | Media | Rápida | Lenta |
| **Widgets incluidos** | 90+ (Pro) | 20+ | 100+ |
| **Responsive editing** | Excelente | Bueno | Excelente |
| **SEO-friendly** | Bueno | Excelente | Regular |
| **Precio anual** | $59 | Gratis | $89 |
| **Compatibilidad plugins** | Excelente | Excelente | Buena |

## Casos de uso en Chile

### 1. E-commerce (WooCommerce)
**Ejemplo:** Tienda de ropa online
- Product Builder personalizado
- Checkout optimizado
- Landing pages promocionales
- **Hosting recomendado:** WordPress Pro + Redis

### 2. Sitios corporativos
**Ejemplo:** Estudio legal en Santiago
- Diseño profesional y responsive
- Formularios de contacto avanzados
- Testimonios y casos de éxito
- **Hosting recomendado:** WordPress Turbo + HTTP/3

### 3. Landing pages conversion
**Ejemplo:** Curso online
- A/B testing con diferentes diseños
- Popup builder integrado
- Formularios con CRM
- **Hosting recomendado:** WordPress Turbo + LiteSpeed

## Pros y contras honestos

### ✅ Ventajas
- **Flexibilidad total:** Diseña cualquier layout sin limitaciones
- **Comunidad activa:** Miles de plantillas y tutoriales
- **Actualizaciones constantes:** Nuevos widgets cada mes
- **Integración nativa:** Compatible con 99% de plugins WordPress

### ❌ Desventajas
- **Dependencia del plugin:** Sin Elementor, el diseño se rompe
- **Código adicional:** Genera CSS/JS extra vs temas nativos
- **Vendor lock-in:** Migrar a otro builder es complejo
- **Costo anual:** $59/año para funciones profesionales

## Mejores prácticas 2025

### 1. Optimización de rendimiento
\`\`\`
- Usa solo widgets necesarios
- Optimiza imágenes a WebP
- Activa lazy loading
- Purga CSS no utilizado
\`\`\`

### 2. SEO y estructura
- **Un H1 por página:** No uses múltiples Heading widgets H1
- **Alt tags descriptivos:** Siempre completa alt text en imágenes
- **Schema markup:** Usa widgets estructurados para FAQ, reviews
- **URL structure:** Mantén URLs limpias y descriptivas

### 3. Responsive design
- **Mobile-first:** Diseña primero para móvil
- **Breakpoints custom:** Ajusta para dispositivos específicos
- **Typography scales:** Usa escalas responsivas para texto
- **Touch targets:** Botones mínimo 44px en móvil

## ¿Cuándo NO usar Elementor?

1. **Blogs puros:** Gutenberg es más eficiente para contenido editorial
2. **Sites ultra-rápidos:** Si Core Web Vitals son críticos, considera temas custom
3. **Presupuesto limitado:** Version gratuita es muy básica
4. **Desarrolladores avanzados:** ACF + custom fields puede ser más flexible

## Conclusión y recomendación

Elementor es la herramienta ideal para **90% de proyectos WordPress** que requieren diseño personalizado. La clave del éxito está en la **infraestructura de hosting**.

**Nuestra recomendación:** Elementor Pro + LiteSpeed Enterprise + HTTP/3 es la combinación que permite crear sitios web visualmente impactantes sin sacrificar velocidad.

### Next steps
1. **Evalúa tus necesidades:** ¿Free o Pro?
2. **Elige hosting optimizado:** LiteSpeed + Redis es esencial
3. **Planifica estructura:** Define pages vs posts desde el inicio
4. **Optimiza desde día 1:** Configura cache y optimización de imágenes`,
    category: 'builders',
    cms: 'wordpress',
    tags: ['page-builder', 'visual', 'drag-drop', 'responsive', 'woocommerce', 'theme-builder'],
    level: 'medio',
    related: ['litespeed-cache', 'elementor-ai', 'divi', 'beaver-builder', 'gutenberg', 'core-web-vitals'],
    hostingRequirements: ['LiteSpeed Server', 'PHP 8.1+', 'Memory 512MB+', 'HTTP/3'],
    cta: {
      plan: 'WordPress Turbo',
      copy: 'Acelera Elementor con LiteSpeed + HTTP/3',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=3'
    },
    proofPoints: ['LiteSpeed Enterprise', 'HTTP/3 nativo', 'Staging con 1 clic', 'JetBackup diario'],
    whenToUse: 'Para sitios corporativos, landing pages y portales que requieren diseño personalizado.',
    synonyms: ['constructor visual', 'page builder', 'elementor pro', 'page builder wordpress'],
    lastUpdated: '2025-01-04'
  },
  {
    id: 'pb-002',
    slug: 'elementor-ai',
    title: 'Elementor AI',
    shortDefinition: 'IA integrada en Elementor para generar texto, código CSS y layouts automáticamente.',
    category: 'trends-2025',
    cms: 'wordpress',
    tags: ['ia', 'elementor', 'automatizacion', 'css'],
    level: 'medio',
    related: ['elementor', 'ai-engine', 'openai-wordpress'],
    hostingRequirements: ['Elementor Pro', 'Conectividad API estable', 'Memory 512MB+'],
    cta: {
      plan: 'WordPress Turbo',
      copy: 'IA sin interrupciones con hosting premium',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=3'
    },
    proofPoints: ['Uptime 99.9%', 'Conectividad premium', 'Soporte especializado'],
    whenToUse: 'Para acelerar la creación de contenido y diseños únicos.'
  },

  {
    id: 'pb-003',
    slug: 'divi',
    title: 'Divi',
    shortDefinition: 'Constructor visual de Elegant Themes con diseño único y módulos premium.',
    longDefinition: 'Page builder premium de Elegant Themes que incluye el Divi Theme. Ofrece interfaz drag & drop, módulos exclusivos y diseños únicos, pero requiere más recursos que Elementor.',
    category: 'builders',
    cms: 'wordpress',
    tags: ['page-builder', 'visual', 'elegant-themes', 'premium'],
    level: 'medio',
    related: ['elementor', 'beaver-builder', 'litespeed-cache', 'core-web-vitals'],
    hostingRequirements: ['PHP 8.0+', 'Memory 768MB+', 'LiteSpeed recomendado'],
    cta: {
      plan: 'WordPress Turbo',
      copy: 'Optimiza Divi con LiteSpeed Enterprise',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=3'
    },
    proofPoints: ['Optimización específica Divi', 'Cache avanzado', 'Soporte especializado'],
    whenToUse: 'Para diseños únicos y proyectos que requieren estética diferenciada.',
    synonyms: ['divi builder', 'elegant themes'],
    lastUpdated: '2025-01-04'
  },
  {
    id: 'pb-004',
    slug: 'beaver-builder',
    title: 'Beaver Builder',
    shortDefinition: 'Page builder enfocado en rendimiento y código limpio. Ideal para desarrolladores.',
    longDefinition: 'Constructor visual que prioriza código limpio y rendimiento. Popular entre desarrolladores por su flexibilidad y hooks personalizados. Menos recursos visuales que Elementor pero más eficiente.',
    category: 'builders',
    cms: 'wordpress',
    tags: ['page-builder', 'performance', 'developer-friendly', 'codigo-limpio'],
    level: 'avanzado',
    related: ['elementor', 'divi', 'litespeed-cache', 'advanced-custom-fields'],
    hostingRequirements: ['PHP 7.4+', 'Memory 256MB+'],
    cta: {
      plan: 'WordPress Pro',
      copy: 'Hosting optimizado para Beaver Builder',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=4'
    },
    proofPoints: ['Código optimizado', 'Velocidad superior', 'Developer-friendly'],
    whenToUse: 'Para proyectos que priorizan rendimiento y requieren customización avanzada.',
    synonyms: ['bb', 'beaver page builder'],
    lastUpdated: '2025-01-04'
  },

  // Performance & Cache
  {
    id: 'perf-001',
    slug: 'litespeed-cache',
    title: 'LiteSpeed Cache',
    shortDefinition: 'Plugin de caché oficial para servidores LiteSpeed. Mejora velocidad hasta 10x.',
    longDefinition: 'Plugin gratuito de caché diseñado específicamente para servidores LiteSpeed. Incluye optimización automática, caché de objetos, CDN y compresión avanzada.',
    category: 'performance',
    cms: 'wordpress',
    tags: ['cache', 'litespeed', 'velocidad', 'gratis'],
    level: 'medio',
    related: ['litespeed-server', 'wp-rocket', 'redis-cache', 'cloudflare'],
    hostingRequirements: ['Servidor LiteSpeed', 'mod_rewrite', 'PHP 7.4+'],
    cta: {
      plan: 'WordPress Turbo',
      copy: 'Máximo rendimiento con LiteSpeed Enterprise',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=3'
    },
    proofPoints: ['Único hosting LiteSpeed en Chile', 'HTTP/3 + QUIC', 'Configuración optimizada'],
    whenToUse: 'Solo funciona al máximo en hosting con servidor LiteSpeed nativo.',
    synonyms: ['lscache', 'litespeed plugin']
  },
  {
    id: 'perf-002',
    slug: 'redis-cache',
    title: 'Redis Object Cache',
    shortDefinition: 'Sistema de caché en memoria que reduce consultas a la base de datos hasta 80%.',
    category: 'performance',
    cms: 'general',
    tags: ['cache', 'database', 'memoria', 'performance'],
    level: 'avanzado',
    related: ['litespeed-cache', 'memcached', 'object-cache-pro'],
    hostingRequirements: ['Redis server', 'PHP Redis extension', 'Memory 256MB+'],
    cta: {
      plan: 'WordPress Pro',
      copy: 'Redis incluido en planes Pro y superiores',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=4'
    },
    proofPoints: ['Redis preconfigurado', 'Monitoreo 24/7', 'Backup automático'],
    whenToUse: 'Sites con alto tráfico, e-commerce o consultas complejas de BD.'
  },
  {
    id: 'perf-003',
    slug: 'core-web-vitals',
    title: 'Core Web Vitals',
    shortDefinition: 'Métricas de Google que miden experiencia de usuario: LCP, CLS e INP.',
    category: 'performance',
    cms: 'general',
    tags: ['google', 'seo', 'ux', 'metricas'],
    level: 'medio',
    related: ['inp', 'lcp', 'cls', 'pagespeed'],
    hostingRequirements: ['Servidor rápido', 'HTTP/3', 'Compresión Brotli'],
    cta: {
      plan: 'WordPress Turbo',
      copy: 'Mejora Core Web Vitals con servidor premium',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=3'
    },
    proofPoints: ['HTTP/3 nativo', 'SSD NVMe', 'Red premium'],
    whenToUse: 'Esencial para SEO y ranking en Google desde 2021.'
  },
  {
    id: 'perf-004',
    slug: 'inp',
    title: 'INP (Interaction to Next Paint)',
    shortDefinition: 'Nueva métrica de Google 2024 que reemplaza FID. Mide respuesta a interacciones.',
    category: 'trends-2025',
    cms: 'general',
    tags: ['google', 'web-vitals', '2024', 'interactividad'],
    level: 'avanzado',
    related: ['core-web-vitals', 'javascript', 'performance'],
    hostingRequirements: ['CPU rápida', 'Baja latencia', 'Optimización JS'],
    cta: {
      plan: 'WordPress Turbo',
      copy: 'Optimiza INP con CPU dedicada',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=3'
    },
    proofPoints: ['CPU Intel/AMD última gen', 'Baja latencia', 'Optimización JS automática'],
    whenToUse: 'Sites con mucha interactividad: e-commerce, apps web, dashboards.'
  },

  // Security
  {
    id: 'sec-001',
    slug: 'wordfence',
    title: 'Wordfence Security',
    shortDefinition: 'Plugin de seguridad líder para WordPress con firewall y detección de malware.',
    category: 'security',
    cms: 'wordpress',
    tags: ['seguridad', 'firewall', 'malware', 'wordpress'],
    level: 'medio',
    related: ['waf', 'jetbackup', 'sucuri', 'hardening'],
    hostingRequirements: ['PHP 7.4+', 'Cron jobs', 'Memory 256MB+'],
    cta: {
      plan: 'WordPress Pro',
      copy: 'Seguridad multicapa: Wordfence + WAF servidor',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=4'
    },
    proofPoints: ['WAF a nivel servidor', 'JetBackup diario', 'Monitoreo 24/7'],
    whenToUse: 'Todo sitio WordPress necesita protección contra ataques.'
  },
  {
    id: 'sec-002',
    slug: 'jetbackup',
    title: 'JetBackup',
    shortDefinition: 'Sistema de backup empresarial con restore granular y versionado múltiple.',
    category: 'security',
    cms: 'general',
    tags: ['backup', 'restore', 'seguridad', 'empresarial'],
    level: 'medio',
    related: ['backup', 'restore', 'disaster-recovery'],
    hostingRequirements: ['cPanel/DirectAdmin', 'Espacio adicional', 'Cron jobs'],
    cta: {
      plan: 'WordPress Pro',
      copy: 'JetBackup incluido: restore en minutos',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=4'
    },
    proofPoints: ['Backup cada 4 horas', 'Restore granular', '30 días de retención'],
    whenToUse: 'Sites críticos que no pueden permitirse pérdida de datos.'
  },

  // WooCommerce
  {
    id: 'woo-001',
    slug: 'woocommerce',
    title: 'WooCommerce',
    shortDefinition: 'Plugin gratuito que convierte WordPress en tienda online. Potencia 28% del e-commerce mundial.',
    category: 'woocommerce',
    cms: 'wordpress',
    tags: ['ecommerce', 'tienda', 'ventas', 'wordpress'],
    level: 'medio',
    related: ['woocommerce-performance', 'flow-payment', 'khipu'],
    hostingRequirements: ['PHP 8.0+', 'MySQL 5.7+', 'SSL', 'Memory 512MB+'],
    cta: {
      plan: 'WordPress E-commerce',
      copy: 'Hosting optimizado para WooCommerce',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=5'
    },
    proofPoints: ['Caché especializada Woo', 'SSL incluido', 'CDN gratis'],
    whenToUse: 'Para crear tiendas online con total control y flexibilidad.'
  },
  {
    id: 'woo-002',
    slug: 'flow-payment',
    title: 'Flow (Pago)',
    shortDefinition: 'Gateway de pago chileno que acepta tarjetas, transferencias y wallets digitales.',
    category: 'woocommerce',
    cms: 'wordpress',
    tags: ['pago', 'chile', 'ecommerce', 'gateway'],
    level: 'medio',
    related: ['woocommerce', 'khipu', 'mercadopago'],
    cta: {
      plan: 'WordPress E-commerce',
      copy: 'Integra Flow con hosting estable',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=5'
    },
    proofPoints: ['Uptime 99.9%', 'Conectividad premium', 'Soporte local'],
    whenToUse: 'E-commerce en Chile que necesita múltiples métodos de pago.'
  },

  // LMS
  {
    id: 'lms-001',
    slug: 'moodle',
    title: 'Moodle',
    shortDefinition: 'LMS de código abierto para educación. Requiere hosting robusto con CPU/RAM dedicada.',
    longDefinition: 'Sistema de gestión de aprendizaje usado por universidades y empresas. Soporta SCORM, exámenes avanzados, foros y seguimiento detallado de estudiantes.',
    category: 'lms',
    cms: 'moodle',
    tags: ['lms', 'educacion', 'elearning', 'open-source'],
    level: 'avanzado',
    related: ['learndash', 'php', 'mysql', 'redis-cache'],
    hostingRequirements: ['CPU dedicada', 'RAM 2GB+', 'PHP 8.0+', 'Cron cada minuto', 'Redis'],
    cta: {
      plan: 'VPS Cloud',
      copy: 'Moodle profesional con VPS optimizado',
      url: 'https://clientes.hostingplus.cl/vps-cloud'
    },
    proofPoints: ['CPU/RAM dedicada', 'Redis incluido', 'Migración asistida', 'Soporte especializado'],
    whenToUse: 'Educación formal, capacitación empresarial, cursos con certificación.',
    synonyms: ['lms', 'plataforma educativa']
  },
  {
    id: 'lms-002',
    slug: 'learndash',
    title: 'LearnDash',
    shortDefinition: 'LMS premium para WordPress. Más liviano que Moodle, ideal para cursos comerciales.',
    category: 'lms',
    cms: 'wordpress',
    tags: ['lms', 'wordpress', 'cursos', 'premium'],
    level: 'medio',
    related: ['moodle', 'woocommerce', 'elementor'],
    cta: {
      plan: 'WordPress Pro',
      copy: 'LearnDash optimizado con Redis y staging',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=4'
    },
    proofPoints: ['Optimización LMS', 'Redis Object Cache', 'Staging para pruebas'],
    whenToUse: 'Venta de cursos online, academia privada, formación corporativa.'
  },

  // CMS Alternativos
  {
    id: 'cms-001',
    slug: 'joomla',
    title: 'Joomla',
    shortDefinition: 'CMS robusto para sitios complejos. Menos popular que WordPress pero muy potente.',
    category: 'cms',
    cms: 'joomla',
    tags: ['cms', 'php', 'open-source'],
    level: 'avanzado',
    related: ['wordpress', 'drupal', 'migration'],
    hostingRequirements: ['PHP 8.0+', 'MySQL 5.7+', 'mod_rewrite', 'Memory 256MB+'],
    cta: {
      plan: 'Hosting Pro',
      copy: 'Acelera Joomla con LiteSpeed + Redis',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=4'
    },
    proofPoints: ['LiteSpeed compatible', 'Redis opcional', 'Migración gratuita'],
    whenToUse: 'Sitios corporativos complejos, portales con múltiples usuarios.',
    synonyms: ['joomla cms']
  },
  {
    id: 'cms-002',
    slug: 'prestashop',
    title: 'PrestaShop',
    shortDefinition: 'E-commerce especializado, alternativa a WooCommerce con características avanzadas.',
    category: 'cms',
    cms: 'prestashop',
    tags: ['ecommerce', 'php', 'tienda'],
    level: 'avanzado',
    related: ['woocommerce', 'magento', 'ecommerce'],
    cta: {
      plan: 'VPS Cloud',
      copy: 'PrestaShop empresarial con VPS dedicado',
      url: 'https://clientes.hostingplus.cl/vps-cloud'
    },
    proofPoints: ['Recursos dedicados', 'Optimización e-commerce', 'Soporte especializado'],
    whenToUse: 'E-commerce con inventario complejo y múltiples sucursales.'
  },

  // Tendencias 2025
  {
    id: 'ai-001',
    slug: 'ai-wordpress',
    title: 'IA para WordPress',
    shortDefinition: 'Plugins y servicios de inteligencia artificial para generar contenido, imágenes y código.',
    category: 'trends-2025',
    cms: 'wordpress',
    tags: ['ia', 'contenido', 'automatizacion', '2025'],
    level: 'medio',
    related: ['ai-engine', 'elementor-ai', 'openai', 'chatgpt'],
    hostingRequirements: ['Memory 512MB+', 'Cron confiable', 'API calls estables'],
    cta: {
      plan: 'WordPress Turbo',
      copy: 'IA sin interrupciones con hosting premium',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=3'
    },
    proofPoints: ['Uptime 99.9%', 'Conectividad premium', 'Resources garantizados'],
    whenToUse: 'Para acelerar creación de contenido y automatizar tareas.'
  },
  {
    id: 'ai-002',
    slug: 'ai-engine',
    title: 'AI Engine',
    shortDefinition: 'Plugin que integra ChatGPT y otras IAs en WordPress para chatbots y generación de contenido.',
    category: 'trends-2025',
    cms: 'wordpress',
    tags: ['ia', 'chatgpt', 'plugin', 'chatbot'],
    level: 'medio',
    related: ['ai-wordpress', 'openai', 'chatbot'],
    cta: {
      plan: 'WordPress Turbo',
      copy: 'AI Engine optimizado con hosting confiable',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=3'
    },
    proofPoints: ['API calls estables', 'Memory garantizada', 'Uptime 99.9%'],
    whenToUse: 'Sites que quieren chatbots inteligentes o generación automática.'
  },
  {
    id: 'trend-001',
    slug: 'headless-wordpress',
    title: 'Headless WordPress',
    shortDefinition: 'WordPress como backend puro usando API REST o GraphQL, frontend independiente.',
    category: 'trends-2025',
    cms: 'wordpress',
    tags: ['headless', 'api', 'javascript', 'react'],
    level: 'avanzado',
    related: ['wp-graphql', 'rest-api', 'jamstack'],
    hostingRequirements: ['API optimizada', 'CORS configurado', 'Cache especial'],
    cta: {
      plan: 'VPS Cloud',
      copy: 'Headless WP con Node.js + PHP en VPS',
      url: 'https://clientes.hostingplus.cl/vps-cloud'
    },
    proofPoints: ['Stack personalizable', 'Node.js disponible', 'Configuración experta'],
    whenToUse: 'Apps web, sitios super rápidos, arquitecturas modernas.'
  },
  {
    id: 'trend-002',
    slug: 'http3-quic',
    title: 'HTTP/3 y QUIC',
    shortDefinition: 'Protocolo de internet más rápido que HTTP/2. Reduce latencia hasta 50%.',
    category: 'trends-2025',
    cms: 'general',
    tags: ['http3', 'quic', 'velocidad', 'protocolo'],
    level: 'avanzado',
    related: ['litespeed-server', 'performance', 'core-web-vitals'],
    cta: {
      plan: 'WordPress Turbo',
      copy: 'Primer hosting con HTTP/3 nativo en Chile',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=3'
    },
    proofPoints: ['HTTP/3 desde 2023', 'LiteSpeed Enterprise', 'QUIC.cloud CDN'],
    whenToUse: 'Sites que buscan máxima velocidad y mejor UX.'
  },

  // SEO
  {
    id: 'seo-001',
    slug: 'yoast-seo',
    title: 'Yoast SEO',
    shortDefinition: 'Plugin SEO más popular para WordPress con análisis de contenido y sitemaps automáticos.',
    category: 'seo',
    cms: 'wordpress',
    tags: ['seo', 'sitemap', 'meta', 'schema'],
    level: 'basico',
    related: ['rankmath', 'all-in-one-seo', 'schema'],
    cta: {
      plan: 'WordPress Básico',
      copy: 'SEO optimizado desde el primer día',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=1'
    },
    proofPoints: ['Instalación automática', 'Sitemap automático', 'Guías SEO incluidas'],
    whenToUse: 'Todo sitio WordPress necesita optimización SEO básica.'
  },
  {
    id: 'seo-002',
    slug: 'rankmath',
    title: 'RankMath',
    shortDefinition: 'Plugin SEO moderno y gratuito, alternativa potente a Yoast con más características.',
    category: 'seo',
    cms: 'wordpress',
    tags: ['seo', 'moderno', 'gratis', 'analytics'],
    level: 'medio',
    related: ['yoast-seo', 'schema', 'google-analytics'],
    cta: {
      plan: 'WordPress Pro',
      copy: 'RankMath Pro con hosting optimizado',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=4'
    },
    proofPoints: ['Performance optimizada', 'Analytics integrado', 'Soporte especializado'],
    whenToUse: 'Sites que buscan SEO avanzado sin pagar licencias.'
  },

  // Infrastructure
  {
    id: 'infra-001',
    slug: 'litespeed-server',
    title: 'LiteSpeed Server',
    shortDefinition: 'Servidor web empresarial más rápido que Apache/Nginx. Compatible con .htaccess.',
    category: 'infrastructure',
    cms: 'general',
    tags: ['servidor', 'litespeed', 'performance', 'http3'],
    level: 'avanzado',
    related: ['litespeed-cache', 'http3-quic', 'apache', 'nginx'],
    cta: {
      plan: 'WordPress Turbo',
      copy: 'Único hosting LiteSpeed Enterprise en Chile',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=3'
    },
    proofPoints: ['LiteSpeed Enterprise', 'HTTP/3 nativo', 'Compatibilidad total'],
    whenToUse: 'Sites que necesitan máximo rendimiento y compatibilidad.'
  },
  {
    id: 'infra-002',
    slug: 'php-8-4',
    title: 'PHP 8.4',
    shortDefinition: 'Última versión de PHP con mejoras de rendimiento y nuevas características.',
    category: 'trends-2025',
    cms: 'general',
    tags: ['php', '2024', 'performance', 'actualizacion'],
    level: 'medio',
    related: ['php-8-3', 'wordpress', 'performance'],
    cta: {
      plan: 'WordPress Pro',
      copy: 'PHP 8.4 disponible en todos los planes',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=4'
    },
    proofPoints: ['Todas las versiones PHP', 'Actualización inmediata', 'Testing sin riesgo'],
    whenToUse: 'Para aprovechar las últimas mejoras de rendimiento.'
  },

  // Migration & DevOps
  {
    id: 'dev-001',
    slug: 'staging',
    title: 'Staging (Entorno de Pruebas)',
    shortDefinition: 'Copia exacta del sitio para probar cambios sin afectar la versión en vivo.',
    category: 'devops',
    cms: 'general',
    tags: ['staging', 'testing', 'desarrollo', 'seguridad'],
    level: 'medio',
    related: ['backup', 'jetbackup', 'desarrollo'],
    cta: {
      plan: 'WordPress Pro',
      copy: 'Staging automático con 1 clic',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=4'
    },
    proofPoints: ['Staging ilimitado', 'Clonado automático', 'Sincronización fácil'],
    whenToUse: 'Antes de actualizar plugins, temas o hacer cambios importantes.'
  },
  {
    id: 'mig-001',
    slug: 'migracion-wordpress',
    title: 'Migración WordPress',
    shortDefinition: 'Proceso de mover un sitio WordPress entre hosting sin perder datos ni posicionamiento.',
    category: 'migration',
    cms: 'wordpress',
    tags: ['migracion', 'transferencia', 'dns', 'seo'],
    level: 'medio',
    related: ['dns', 'ssl', 'duplicator', 'backup'],
    cta: {
      plan: 'Migración Gratuita',
      copy: 'Migración profesional sin costo',
      url: 'https://clientes.hostingplus.cl/migracion-gratuita'
    },
    proofPoints: ['100% gratuita', 'Sin tiempo offline', 'Soporte especializado'],
    whenToUse: 'Al cambiar de hosting o actualizar plan.'
  }
  // Nota: Este es un conjunto inicial. Se pueden agregar más términos según necesidades específicas.
];

// Función para buscar términos
export const searchTerms = (query: string, filters?: {
  category?: string;
  cms?: string;
  level?: string;
}): WikiTerm[] => {
  const normalizedQuery = query.toLowerCase().trim();
  
  return wikiTerms.filter(term => {
    // Filtros
    if (filters?.category && term.category !== filters.category) return false;
    if (filters?.cms && term.cms !== filters.cms) return false;
    if (filters?.level && term.level !== filters.level) return false;
    
    // Búsqueda en texto
    if (!normalizedQuery) return true;
    
    const searchIn = [
      term.title,
      term.shortDefinition,
      ...term.tags,
      ...(term.synonyms || [])
    ].join(' ').toLowerCase();
    
    return searchIn.includes(normalizedQuery);
  });
};

// Función para obtener términos relacionados
export const getRelatedTerms = (termSlug: string): WikiTerm[] => {
  const term = wikiTerms.find(t => t.slug === termSlug);
  if (!term) return [];
  
  return wikiTerms.filter(t => 
    term.related.includes(t.slug) || 
    t.related.includes(termSlug)
  ).slice(0, 6);
};
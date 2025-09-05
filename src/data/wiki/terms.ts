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
    termCount: 14
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
  // SEO Terms
  {
    id: 'seo-001',
    slug: 'schema-markup',
    title: 'Schema Markup',
    shortDefinition: 'Código estructurado que ayuda a Google entender tu contenido y mostrar rich snippets en los resultados de búsqueda.',
    longDefinition: `## ¿Qué es Schema Markup y por qué revoluciona tu SEO?

Schema Markup es el **lenguaje secreto** que hablan Google, Bing y otros motores de búsqueda. Es código estructurado (JSON-LD) que describes exactamente qué tipo de contenido tienes en tu sitio: si es un producto, una receta, una reseña, un evento, una empresa local.

**La magia:** Cuando Google entiende perfectamente tu contenido, puede mostrar **rich snippets** - esos resultados enriquecidos con estrellas, precios, fechas, imágenes que destacan en los resultados de búsqueda.

## ¿Por qué Schema importa tanto en Chile?

En el mercado chileno, donde la competencia digital crece exponencialmente, Schema Markup te da una ventaja real:

**Restaurantes en Santiago:** Un restaurant con Schema puede mostrar horarios, menú, reseñas con estrellas directamente en Google. Los clientes ven toda la info antes de hacer clic.

**E-commerce local:** Una tienda que vende productos chilenos puede mostrar precio, disponibilidad, y rating directamente en los resultados de búsqueda.

**Profesionales:** Un dentista en Las Condes puede aparecer con horarios, ubicación, teléfono y reseñas sin que el usuario necesite entrar al sitio.

## Tipos de Schema más valiosos

### 1. Local Business Schema
Para cualquier negocio con ubicación física en Chile:

\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness", 
  "name": "Café Central Santiago",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Alameda 1234",
    "addressLocality": "Santiago",
    "addressRegion": "Región Metropolitana",
    "postalCode": "7500000",
    "addressCountry": "CL"
  },
  "telephone": "+56-2-2234-5678"
}
\`\`\`

### 2. Product Schema
Para e-commerce (esencial con WooCommerce):

\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Vino Carmenère Valle del Maipo",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "CLP", 
    "price": "15990"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "127"
  }
}
\`\`\`

## Implementación práctica: 3 métodos

**Método 1: Plugin Yoast SEO**
- Configuración automática básica
- Ideal para principiantes
- Cubre Organization, Website, Person

**Método 2: Plugin Schema Pro**  
- Configuración visual avanzada
- 35+ tipos de schema
- Perfecto para e-commerce

**Método 3: Código manual**
- Control total
- Mejor para desarrolladores  
- Máxima personalización

## Schema para diferentes industrias chilenas

**Restaurantes y Cafés:** Menu, OpeningHours, AggregateRating, delivery radius para apps

**Retailers y E-commerce:** Product, Offer, Review, inventory status, shipping info

**Servicios Profesionales:** Service, LocalBusiness, ProfessionalService, availability, service areas

**Hoteles y Turismo:** LodgingBusiness, TouristAttraction, amenities, booking info

**Salud y Wellness:** MedicalBusiness, Physician, insurance accepted, specialties

## El futuro del Schema: IA y búsqueda por voz

**Google SGE (Search Generative Experience)** usa Schema para entender contenido y generar respuestas de IA.

**Búsqueda por voz:** "Oye Google, ¿qué restaurante italiano está abierto cerca?" - Schema ayuda a aparecer en estas respuestas.

**Tendencia 2025:** Schema cada vez más importante para aparecer en respuestas de ChatGPT, Bard y otros asistentes de IA.`,
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
    slug: 'google-search-console',
    title: 'Google Search Console',
    shortDefinition: 'Herramienta gratuita de Google que muestra cómo tu sitio aparece en búsquedas y te ayuda a optimizar tu SEO.',
    longDefinition: `## ¿Qué es Google Search Console exactamente?

Google Search Console (GSC) es la **línea directa entre tu sitio web y Google**. Es como tener una conversación privada con el motor de búsqueda más importante del mundo, donde Google te cuenta exactamente qué piensa de tu sitio.

**No es solo una herramienta SEO** - es el sistema nervioso de tu presencia digital. Te dice qué búsquedas traen visitantes, qué páginas indexa Google, qué errores encuentra, y más importante: **qué oportunidades estás perdiendo**.

## ¿Por qué GSC es crucial para sitios chilenos?

En Chile, donde **95% de las búsquedas pasan por Google**, Search Console te conecta directamente con tu audiencia. Te muestra no solo cómo te encuentra la gente, sino **cómo QUIERE encontrarte**.

**Caso real:** Un restaurant en Providencia descubrió via GSC que la gente buscaba "delivery sushi las condes" pero su sitio no tenía esa palabra clave. Un simple ajuste de contenido triplicó sus pedidos online.

## Datos críticos que solo GSC te proporciona

### 1. Performance Report: Tu mapa del tesoro SEO

**Queries (consultas de búsqueda):**
- Qué escribe exactamente la gente para encontrarte
- Búsquedas donde apareces pero no haces clic
- Keywords que están creciendo vs. las que están cayendo

**Pages (páginas):**
- Cuáles de tus páginas funcionan mejor
- Páginas con alto CTR vs. páginas con bajo CTR
- Oportunidades de contenido perdidas

**Devices (dispositivos):**
Crucial en Chile donde **78% del tráfico es móvil**

### 2. Index Coverage: ¿Google ve tu sitio completo?

**Válidas:** Páginas correctamente indexadas
**Con advertencias:** Indexadas pero con problemas menores
**Errores:** Páginas que Google no puede indexar
**Excluidas:** Páginas intencionalmente no indexadas

## Configuración paso a paso

### Paso 1: Verificación de propiedad
- HTML tag (más fácil)
- Google Analytics (si ya lo tienes)
- DNS verification (más seguro)

### Paso 2: Configuración inicial
- Sitemap submission
- URL parameters 
- International targeting para Chile
- Preferred domain (www vs. no-www)

### Paso 3: Integraciones importantes
- Google Analytics para datos completos
- WordPress SEO plugins se conectan automáticamente

## Análisis de datos: Encontrando el oro SEO

### Identificando oportunidades perdidas

**Queries con alta impresión, bajo CTR:**
Apareces en búsquedas pero la gente no hace clic → Optimiza títulos y descripciones

**Pages con buena posición, bajo tráfico:**  
Google te posiciona bien pero pocas búsquedas → Expande contenido para más keywords

**Queries position 8-20:**
Estás cerca de primera página → Optimización enfocada puede llevarte a top 5

## Problemas comunes y soluciones

**Soft 404:** Página existe pero parece error 404 → Revisar contenido thin, agregar más información

**Crawl errors:** Google no puede acceder → Verificar robots.txt, permisos servidor, redirects

**Duplicate content:** Múltiples URLs con mismo contenido → Canonical tags, redirects 301

**Mobile usability:** Problemas en móvil → Tema responsive, velocidad móvil, botones touch-friendly

## Integración con WordPress

**Yoast SEO:** Importa datos GSC directamente, muestra keywords principales por página

**Site Kit by Google:** Dashboard unificado GSC + Analytics en WordPress admin

**MonsterInsights:** Correlaciona datos GSC con Analytics, reports personalizados

## El futuro: GSC y búsqueda por IA

**Google SGE** usa datos de Search Console para entrenar respuestas de IA.

**Performance data** cada vez más importante para aparecer en respuestas generadas por IA.

En Chile, donde la competencia digital se intensifica, GSC no es opcional - es supervivencia digital.`,
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
    id: 'seo-003',
    slug: 'page-speed-insights',
    title: 'Page Speed Insights',
    shortDefinition: 'Herramienta de Google que analiza la velocidad de tu sitio web y proporciona recomendaciones específicas para mejorar el rendimiento.',
    longDefinition: `## ¿Qué es Page Speed Insights?

Page Speed Insights es la **herramienta oficial de Google** para medir y optimizar la velocidad de sitios web. Pero aquí está el detalle que muchos no entienden: no solo mide qué tan rápido carga tu sitio, sino **qué tan bien experimenta tu contenido un usuario real**.

## ¿Por qué velocidad = dinero en Chile?

En Chile, donde la conexión móvil promedio es más lenta que países desarrollados, un sitio lento significa **pérdida directa de ventas**:

- **53% de usuarios abandona** si una página tarda más de 3 segundos
- **1 segundo extra de carga = 7% menos conversiones**
- En e-commerce chileno, esto se traduce en miles de pesos perdidos diariamente

**Caso real:** Una tienda online de electrónicos en Santiago redujo tiempo de carga de 8 a 2 segundos. Resultado: 40% más ventas el primer mes.

## Core Web Vitals: Las métricas que importan

### 1. Largest Contentful Paint (LCP)
**Qué mide:** Cuánto tarda en cargar el elemento principal de la página
**Objetivo:** Menos de 2.5 segundos
**En Chile significa:** El producto, artículo o imagen principal debe aparecer rápido

### 2. First Input Delay (FID)  
**Qué mide:** Cuánto tarda la página en responder al primer clic/toque
**Objetivo:** Menos de 100 milisegundos
**En Chile significa:** Botones de "Comprar", "Contactar" deben responder inmediatamente

### 3. Cumulative Layout Shift (CLS)
**Qué mide:** Cuánto se "mueve" el contenido mientras carga
**Objetivo:** Menos de 0.1
**En Chile significa:** El usuario no debe hacer clic accidentalmente en algo por un cambio de layout

## Optimización práctica para sitios chilenos

### Para e-commerce:
1. **Imágenes WebP:** Reduce 30-50% el peso sin perder calidad
2. **Lazy loading:** Carga productos solo cuando van a verse
3. **CDN local:** Servidores en Chile para contenido estático
4. **Cache agresivo:** WooCommerce + LiteSpeed Cache

### Para blogs y medios:
1. **Fuentes del sistema:** Evita cargar Google Fonts
2. **Minificar CSS/JS:** Reduce archivos a lo esencial  
3. **Eliminar plugins innecesarios:** Cada plugin suma milisegundos
4. **Optimizar base de datos:** Limpieza regular

### Para servicios profesionales:
1. **Above-the-fold optimizado:** Info de contacto carga primero
2. **Formularios livianos:** Sin librerías pesadas
3. **Mapas optimizados:** Google Maps lazy load
4. **Testimonios comprimidos:** Videos livianos o solo texto

## Herramientas complementarias

### GTmetrix
- **Ventaja:** Análisis desde servidores en múltiples países
- **Para Chile:** Testa desde Brasil (más cercano)
- **Usa esto cuando:** Quieres simular experiencia real de usuarios

### Pingdom
- **Ventaja:** Monitoreo continuo de velocidad
- **Para Chile:** Alertas cuando el sitio se pone lento
- **Usa esto cuando:** Tienes un sitio crítico para el negocio

### Chrome DevTools
- **Ventaja:** Debugging en tiempo real  
- **Para Chile:** Simula conexiones 3G (común en regiones)
- **Usa esto cuando:** Desarrollas o optimizas activamente

## Page Speed y WordPress: Configuración ganadora

### Hosting optimizado:
- **SSD NVMe:** Discos 10x más rápidos que HDD tradicionales
- **HTTP/3:** Protocolo más moderno y rápido
- **PHP 8.1+:** Versión más optimizada
- **OPcache:** Cache de código PHP a nivel servidor

### Plugins esenciales:
1. **LiteSpeed Cache:** Cache server-side + CDN gratuito
2. **ShortPixel:** Optimización automática de imágenes  
3. **WP Rocket:** Cache premium con optimizaciones avanzadas
4. **Autoptimize:** Minificación automática CSS/JS

### Configuración técnica:
- **GZIP compression:** Reduce archivos 70%
- **Browser caching:** Guarda recursos localmente
- **Database optimization:** Limpieza automática semanal
- **CDN integration:** Contenido desde servidores globales

## Impacto en SEO: Más allá de rankings

**Google usa Page Speed como factor de ranking directo** desde 2018, pero el impacto real va más allá:

### User Experience Signals:
- **Bounce rate:** Sitios lentos = usuarios que se van rápido
- **Time on page:** Sitios rápidos = usuarios que navegan más  
- **Return visitors:** Experiencia rápida = usuarios que vuelven

### Mobile-First Indexing:
En Chile, donde búsquedas móviles dominan, Google evalúa tu sitio principalmente desde perspectiva móvil.

## Page Speed en el contexto chileno 2025

### Conexiones regionales:
- **Santiago:** Fibra óptica común, expectativas altas de velocidad
- **Regiones:** Conexiones más lentas, optimización crítica
- **Rural:** 3G aún común, sitios deben funcionar en conexiones lentas

### Comportamiento usuario chileno:
- **Shopping online:** Explosión post-pandemia, tolerancia baja a sitios lentos
- **Servicios digitales:** Expectativa de inmediatez (bancario, delivery, etc.)
- **Contenido multimedia:** Consumo alto, optimización de video/imágenes crucial

## Monitoreo continuo: No es "set and forget"

**Auditoria mensual:**
- Revisar Core Web Vitals en GSC
- Analizar pages más lentas
- Identificar recursos que crecieron en peso

**Alertas automáticas:**
- Configurar alertas si LCP > 3 segundos
- Monitoreo uptime del sitio
- Notificaciones de cambios drásticos en speed score

**Testing regular:**
- Dispositivos reales (no solo simuladores)
- Diferentes conexiones (WiFi, 4G, 3G)
- Horarios peak vs. off-peak

Page Speed no es técnico por ser técnico - es **experiencia de usuario convertida en números**. En el mercado chileno competitivo, cada milisegundo cuenta.`,
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
    whenToUse: 'Esencial para e-commerce, landing pages, sitios corporativos',
    synonyms: ['page speed', 'velocidad web', 'core web vitals'],
    lastUpdated: '2025-01-15'
  },
  {
    id: 'seo-004',
    slug: 'seo-local',
    title: 'SEO Local',
    shortDefinition: 'Estrategias de optimización para aparecer en búsquedas geográficas específicas. Fundamental para negocios físicos en Chile.',
    longDefinition: `## ¿Qué es SEO Local y por qué domina el futuro del marketing?

SEO Local es el **arte de aparecer cuando la gente busca servicios cerca de ellos**. No es solo aparecer en Google Maps - es dominar completamente la experiencia de búsqueda local, desde Google My Business hasta reseñas, desde directorios hasta búsquedas por voz.

En Chile, esto significa que SEO Local bien ejecutado se traduce directamente en foot traffic, llamadas telefónicas y ventas. **76% de búsquedas locales resultan en visita física dentro de 24 horas**.

## ¿Por qué SEO Local es oro puro en Chile?

### El comportamiento chileno cambió para siempre:
- **"Cerca de mí"** creció 500% en búsquedas post-pandemia
- **Google Maps** se convirtió en el directorio principal
- **Reseñas online** influyen 85% de decisiones de compra local
- **Búsqueda por voz** pregunta "¿dónde está el... más cercano?"

**Caso real:** Una peluquería en Ñuñoa optimizó SEO Local. En 3 meses pasó de 20 a 180 clientes nuevos mensuales, solo desde búsquedas "peluquería cerca de mí".

## El ecosistema completo de SEO Local

### 1. Google My Business: Tu carta de presentación digital

**Optimización básica:**
- Categoría principal precisa
- Horarios actualizados religiosamente  
- Fotos profesionales del local, productos, equipo
- Descripción con keywords locales naturales

**Optimización avanzada:**
- Posts semanales con ofertas/novedades
- Q&A proactivo con preguntas frecuentes
- Attributes específicos (WiFi, estacionamiento, delivery)
- Servicios y productos detallados

### 2. Citations (NAP): Consistencia es clave

**NAP = Name, Address, Phone**
Debe ser EXACTAMENTE igual en:
- Google My Business
- Facebook Business  
- PaginasAmarillas.cl
- Directorio local de tu comuna
- Tu sitio web (footer, contacto, about)

**Error fatal:** Tener "Av. Providencia 123" en un lugar y "Avenida Providencia 123" en otro confunde a Google.

### 3. Reviews: El factor más poderoso

**Estadísticas que importan:**
- 5 reseñas nuevas al mes = 25% más visibilidad local
- Responder reseñas = 30% más confianza
- 4.0+ estrellas = umbral mínimo competitivo
- Reseñas con fotos = 200% más engagement

**Estrategia práctica:**
1. **Automatiza requests:** Email post-compra pidiendo reseña
2. **Facilita el proceso:** Link directo a Google Reviews
3. **Responde TODAS:** Positivas y negativas, siempre profesional
4. **Incentiva honestamente:** Descuento por reseña (sin pedirlas positivas)

## Keywords locales: Hablando el idioma chileno

### Modificadores geográficos esenciales:
- **Por comuna:** "dentista providencia", "restaurant las condes"
- **Por sector:** "café barrio brasil", "yoga vitacura"  
- **Por región:** "tours valparaíso", "cabañas sur chile"
- **Modismos chilenos:** "once delivery", "completo italiano"

### Long-tail locales que convierten:
- "mejor [servicio] en [comuna]"
- "[producto] [comuna] delivery"
- "[servicio] cerca de [landmark]"
- "horario [negocio] [sector]"

### Contenido local que funciona:
- Guías de barrio ("Mejores cafés Barrio Lastarria")
- Eventos locales ("Fiestas Patrias en Las Condes 2025")
- Noticias del sector ("Nueva ciclovía conecta Providencia...")
- Colaboraciones locales ("Alianza con [negocio vecino]")

## Competencia local: Análisis y estrategia

### Research de competidores locales:

**Paso 1: Mapear competencia directa**
- Busca tu servicio + comuna
- Analiza primeros 3 en Maps
- Revisa qué hacen bien/mal

**Paso 2: Identificar gaps**
- Servicios que ofrecen vs. que no
- Horarios (¿nadie atiende domingos?)
- Precios (¿oportunidad premium/low-cost?)
- Areas no cubiertas

**Paso 3: Diferenciación local**
- Especialización (solo [nicho] en [area])
- Conveniencia (único con [beneficio])
- Experiencia (expertos en [especialidad] local)

## Schema Markup para Local SEO

### LocalBusiness Schema (imprescindible):

\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Café Austral",
  "address": {
    "@type": "PostalAddress", 
    "streetAddress": "Manuel Montt 315",
    "addressLocality": "Providencia",
    "addressRegion": "Región Metropolitana",
    "postalCode": "7500000",
    "addressCountry": "CL"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "-33.4291",
    "longitude": "-70.6186"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "07:30",
      "closes": "20:00"
    }
  ],
  "telephone": "+56-2-2234-5678",
  "url": "https://cafeaustral.cl"
}
\`\`\`

## Link building local: Calidad sobre cantidad

### Fuentes de links locales valiosos:

**Directorios locales:**
- Cámara de Comercio de tu comuna
- Asociaciones gremiales
- Directorios especializados (.cl)

**Partnerships locales:**
- Colaboraciones con negocios complementarios
- Sponsoreo eventos locales
- Participación en ferias/exposiciones

**Medios locales:**
- Diarios comunales
- Blogs de barrio  
- Influencers locales micro/nano

**Contenido que atrae links:**
- Estudios con datos locales
- Guías útiles del sector
- Eventos propios que cubren medios

## Medición y KPIs de SEO Local

### Métricas en Google My Business:
- **Views:** Cuánta gente ve tu perfil
- **Searches:** Cómo te encuentran (directo vs. discovery)
- **Actions:** Llamadas, direcciones, clicks al sitio
- **Photos:** Engagement con contenido visual

### Métricas en Google Analytics:
- **Tráfico local:** Sesiones desde tu ciudad/región
- **"Near me" traffic:** Búsquedas con intención local
- **Store visits:** Si conectas GA con GMB
- **Local conversions:** Formularios, llamadas desde local traffic

### Herramientas de tracking:
- **BrightLocal:** Monitoreo rankings locales
- **Whitespark:** Citation tracking y opportunities
- **CallRail:** Tracking llamadas desde búsquedas locales

## Tendencias SEO Local 2025

### Búsqueda por voz local:
- "Ok Google, peluquería abierta ahora cerca"
- Optimiza para preguntas naturales y conversacionales
- Horarios y disponibilidad en tiempo real críticos

### Visual Search:
- Google Lens permite buscar negocios desde fotos
- Optimiza imágenes con alt text geolocalizado
- Mantén fotos actualizadas y de calidad

### Hyperlocal targeting:
- Más específico que comuna: por cuadras
- Eventos micro-locales (feria cuadra, celebración edificio)
- Delivery radius cada vez más importante

## Errores fatales que matan SEO Local

❌ **Información inconsistente:** NAP diferente en cada plataforma

❌ **Ignorar reseñas negativas:** No responder = pérdida de confianza

❌ **Keyword stuffing geográfico:** "Dentista Santiago Providencia Las Condes Ñuñoa"

❌ **No actualizar horarios:** Especialmente feriados y horarios especiales

❌ **Descuidar Google Posts:** Perfil inactivo = competidores toman ventaja

✅ **La fórmula ganadora:** Consistencia + autenticidad + engagement constante

En Chile, donde las distancias y comunas importan, SEO Local no es opcional - es supervivencia comercial. Un negocio invisible localmente es un negocio que no existe.`,
    category: 'seo',
    cms: 'general',
    tags: ['seo-local', 'google-my-business', 'gmb', 'business-local'],
    level: 'medio',
    related: ['google-search-console', 'schema-markup', 'reviews'],
    hostingRequirements: ['IP geolocalizada en Chile', 'SSL certificado'],
    cta: {
      plan: 'Local Business',
      copy: 'Hosting localizado en Chile con herramientas SEO Local',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=84'
    },
    proofPoints: ['Servidores en Chile', 'Google My Business optimization'],
    whenToUse: 'Imprescindible para restaurantes, clínicas, talleres, tiendas físicas',
    synonyms: ['seo geográfico', 'búsquedas locales'],
    lastUpdated: '2025-01-15'
  },
  // WordPress Core
  {
    id: 'wp-001',
    slug: 'wordpress',
    title: 'WordPress',
    shortDefinition: 'El CMS más popular del mundo, que impulsa el 43% de todos los sitios web.',
    longDefinition: `WordPress es el sistema de gestión de contenidos (CMS) más popular del mundo, utilizado por millones de sitios web desde blogs personales hasta empresas Fortune 500.

**¿Por qué WordPress domina?**
- **Facilidad de uso:** Interface intuitiva para usuarios no técnicos
- **Flexibilidad total:** Desde blogs simples hasta e-commerce complejos
- **Comunidad masiva:** Miles de plugins y temas disponibles
- **SEO-friendly:** Optimización natural para motores de búsqueda`,
    category: 'wordpress',
    cms: 'wordpress',
    tags: ['cms', 'content-management', 'blog', 'website', 'open-source'],
    level: 'basico',
    related: ['gutenberg', 'plugins', 'temas', 'hosting-wordpress'],
    hostingRequirements: ['PHP 7.4+', 'MySQL 5.7+', 'Mod_rewrite', 'HTTPS'],
    cta: {
      plan: 'WordPress Starter',
      copy: 'Hosting optimizado para WordPress con instalación en 1 clic',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=78'
    },
    proofPoints: ['WordPress pre-instalado', 'Actualizaciones automáticas', 'Backup diario', 'Soporte especializado'],
    whenToUse: 'Ideal para cualquier proyecto web: blogs, sitios corporativos, tiendas online, portfolios, comunidades',
    synonyms: ['wp', 'content management system', 'cms'],
    lastUpdated: '2025-01-15'
  }
];

// Utility functions - properly exported
export const searchTerms = (query: string, filters?: Record<string, any>): WikiTerm[] => {
  let results = wikiTerms;
  
  // Apply text search if query provided
  if (query.trim()) {
    const searchQuery = query.toLowerCase();
    results = results.filter(term => 
      term.title.toLowerCase().includes(searchQuery) ||
      term.shortDefinition.toLowerCase().includes(searchQuery) ||
      term.tags.some(tag => tag.toLowerCase().includes(searchQuery)) ||
      (term.synonyms && term.synonyms.some(synonym => synonym.toLowerCase().includes(searchQuery)))
    );
  }
  
  // Apply filters if provided
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
    term.slug !== currentSlug && 
    currentTerm.related.includes(term.slug)
  );
};
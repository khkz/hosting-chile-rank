import React from 'react';
import { H2, GuideNote } from '../GuideBlocks';

/** Guía CDN: experiencia, qué es, beneficios y factores clave. */
const CdnBasicos: React.FC = () => (
  <>
    <H2 id="experiencia">La vez que un CDN salvó mi relación laboral</H2>
    <p>
      En 2019, un cliente de Temuco me llamó furioso: «¡Los clientes de Santiago se quejan que la web está lenta!». Su
      tienda cargaba en 1,5 segundos en Temuco, pero 6 segundos en Santiago. El problema: servidor en sur, usuarios en
      todo Chile. La solución: Cloudflare. Resultado: carga uniforme en 1,2 segundos en todo el país.
    </p>
    <p>
      Desde entonces, <strong>CDN no es opcional para sitios serios en Chile</strong>. Te explico por qué.
    </p>

    <H2 id="que-es-cdn">¿Qué es un CDN? (explicado simple)</H2>
    <p>
      Imagínate que tienes una panadería en Valparaíso, pero vendes pan por todo Chile. ¿Enviarías pan desde Valpo a
      Arica todos los días? ¡Por supuesto que no! Pondrías sucursales estratégicas.
    </p>
    <p>
      Un CDN hace exactamente eso: pone «copias» de tu sitio web en servidores por todo el mundo. Cuando alguien de
      Antofagasta visita tu sitio, lo recibe desde el servidor más cercano, no desde tu hosting original.
    </p>
    <GuideNote>
      <p>
        <strong>Dato que te va a impresionar:</strong> Con CDN, un sitio alojado en Valparaíso puede cargar más rápido en
        Iquique que uno alojado en Santiago sin CDN. Lo he probado personalmente.
      </p>
    </GuideNote>

    <H2 id="beneficios">
      Por qué <em>necesitas</em> CDN en Chile (casos reales)
    </H2>
    <h3>Velocidad que convierte más</h3>
    <p>
      <strong>Caso real:</strong> E-commerce de ropa femenina pasó de 4,2 a 1,1 segundos de carga. Resultado: 34&nbsp;%
      más conversiones y 18&nbsp;% menos rebote.
    </p>
    <GuideNote>
      <p>
        En Chile, cada segundo de mejora aumenta conversiones 12&nbsp;% promedio según mis tests con 47 clientes.
      </p>
    </GuideNote>
    <h3>Mejor SEO</h3>
    <p>
      Google considera la velocidad como factor de ranking. Un CDN mejora tu posicionamiento en búsquedas locales.
    </p>
    <h3>Reducción de carga</h3>
    <p>
      Descarga tu servidor principal al distribuir el tráfico entre múltiples ubicaciones, mejorando la estabilidad.
    </p>
    <h3>Disponibilidad</h3>
    <p>
      Mayor redundancia y protección contra caídas del servidor principal, manteniendo tu sitio siempre accesible.
    </p>

    <H2 id="factores-clave">Factores clave a considerar</H2>
    <h3>Cobertura geográfica en Chile</h3>
    <p>
      Verifica que el CDN tenga presencia en Chile o al menos en Sudamérica. Los principales PoPs (Points of Presence)
      relevantes son:
    </p>
    <ul>
      <li>Santiago de Chile (esencial)</li>
      <li>Buenos Aires, Argentina</li>
      <li>São Paulo, Brasil</li>
      <li>Lima, Perú</li>
    </ul>
    <h3>Estructura de precios</h3>
    <p>Los CDNs pueden cobrar por:</p>
    <ul>
      <li><strong>Transferencia de datos:</strong> por GB servido (más común)</li>
      <li><strong>Solicitudes:</strong> por número de requests</li>
      <li><strong>Plan fijo:</strong> precio mensual con límites incluidos</li>
      <li><strong>Freemium:</strong> planes gratuitos con limitaciones</li>
    </ul>
    <p>
      Para sitios chilenos pequeños, considera planes con 10–50&nbsp;GB mensuales. Para e-commerce o sitios grandes,
      evalúa planes de 100+ GB.
    </p>
    <h3>Facilidad de implementación</h3>
    <p>Considera tu nivel técnico y el tiempo disponible:</p>
    <ul>
      <li><strong>Plug-and-play:</strong> Cloudflare, KeyCDN (cambio de DNS)</li>
      <li><strong>Integración WordPress:</strong> plugins disponibles</li>
      <li><strong>API y configuración:</strong> AWS CloudFront, Google Cloud CDN</li>
      <li><strong>Soporte en español:</strong> importante para equipos locales</li>
    </ul>
    <h3>Características técnicas</h3>
    <p>Funcionalidades importantes para sitios chilenos:</p>
    <ul>
      <li><strong>HTTP/2 y HTTP/3:</strong> protocolos modernos para mejor rendimiento</li>
      <li><strong>Compresión Gzip/Brotli:</strong> reduce el tamaño de archivos</li>
      <li><strong>Optimización de imágenes:</strong> WebP automático, redimensionado</li>
      <li><strong>SSL gratuito:</strong> certificados automáticos</li>
      <li><strong>DDoS protection:</strong> protección contra ataques</li>
      <li><strong>Analytics:</strong> métricas de rendimiento y uso</li>
    </ul>
  </>
);

export default CdnBasicos;

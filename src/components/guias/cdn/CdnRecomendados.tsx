import React from 'react';
import { H2, GuideNote } from '../GuideBlocks';
import ProviderPick from '../ProviderPick';

/**
 * Guía CDN: ranking propio de la guía, implementación y conclusión.
 * Orden, textos y etiquetas son los de la guía (pendiente 10); solo cambia la presentación.
 */
const CdnRecomendados: React.FC = () => (
  <>
    <H2 id="cdns-recomendados">Mi ranking: los 3 CDNs que realmente funcionan en Chile</H2>
    <GuideNote>
      <p>
        <strong>Mi metodología:</strong> Probé 8 CDNs diferentes durante 18 meses con sitios reales. Medí velocidad
        desde 15 ciudades chilenas, soporte en español y facilidad de configuración.
      </p>
    </GuideNote>

    <ProviderPick name="Cloudflare" label="Mi favorito">
      <p>
        Es gratis, tiene servidor en Santiago, y es literalmente «install and forget». Lo uso en el 85&nbsp;% de mis
        proyectos. Su plan gratuito es más generoso que los planes pagos de otros.
      </p>
      <p>
        <strong>Historia real:</strong> Cliente escéptico me decía «si es gratis debe ser malo». Después de 2 años sin
        problemas y velocidad top, ahora recomienda Cloudflare a todo su círculo empresarial.
      </p>
      <p>
        <strong>Ventajas:</strong>
      </p>
      <ul>
        <li>Plan gratuito ilimitado</li>
        <li>PoP en Santiago</li>
        <li>DDoS protection incluida</li>
        <li>Fácil configuración (cambio DNS)</li>
        <li>SSL automático</li>
      </ul>
      <p>
        <strong>Precios:</strong> Gratuito (básico); Pro y Business a consultar.
      </p>
    </ProviderPick>

    <ProviderPick name="AWS CloudFront">
      <p>Solución enterprise con excelente integración al ecosistema AWS. Ideal para aplicaciones complejas.</p>
      <p>
        <strong>Ventajas:</strong>
      </p>
      <ul>
        <li>Integración completa con AWS</li>
        <li>Edge locations en Sudamérica</li>
        <li>Configuración muy flexible</li>
        <li>Escalabilidad automática</li>
      </ul>
      <p>
        <strong>Precios:</strong>
      </p>
      <ul>
        <li>Cobro por GB transferido (primeros 10&nbsp;TB)</li>
        <li>Cobro por cada 10.000 requests</li>
        <li>Nivel gratuito: 50&nbsp;GB/mes primer año</li>
      </ul>
    </ProviderPick>

    <ProviderPick name="KeyCDN">
      <p>CDN europeo con buenos precios y rendimiento. Ideal para sitios web medianos.</p>
      <p>
        <strong>Ventajas:</strong>
      </p>
      <ul>
        <li>Precios competitivos</li>
        <li>PoP en Brasil</li>
        <li>HTTP/2 y SSD storage</li>
        <li>Panel de control intuitivo</li>
      </ul>
      <p>
        <strong>Precios:</strong>
      </p>
      <ul>
        <li>Cobro por GB transferido</li>
        <li>Mínimo a consultar</li>
        <li>Trial gratuito disponible</li>
      </ul>
    </ProviderPick>

    <H2 id="implementacion">Cómo implementar un CDN</H2>
    <h3>Método 1: cambio de DNS (Cloudflare)</h3>
    <ol>
      <li>Registrarse en Cloudflare</li>
      <li>Agregar tu dominio y verificar DNS</li>
      <li>Cambiar nameservers en tu registrador</li>
      <li>Configurar SSL y optimizaciones</li>
      <li>Monitorear métricas de rendimiento</li>
    </ol>
    <h3>Método 2: pull zone (KeyCDN, otros)</h3>
    <ol>
      <li>Crear cuenta en el proveedor CDN</li>
      <li>Configurar pull zone con tu dominio origen</li>
      <li>Obtener URL del CDN (ej.: example.keycdn.com)</li>
      <li>Actualizar enlaces en tu sitio para usar CDN</li>
      <li>Configurar caché headers en tu servidor</li>
    </ol>
    <h3>Para WordPress</h3>
    <p>Plugins recomendados que facilitan la integración:</p>
    <ul>
      <li><strong>Cloudflare:</strong> plugin oficial gratuito</li>
      <li><strong>W3 Total Cache:</strong> compatible con múltiples CDNs</li>
      <li><strong>WP Rocket:</strong> plugin premium con integración CDN</li>
      <li><strong>KeyCDN:</strong> plugin oficial para WordPress</li>
    </ul>

    <H2 id="conclusion">La decisión que puede cambiar tu negocio</H2>
    <p>
      Para la mayoría de sitios web chilenos, <strong>Cloudflare</strong> es la mejor opción inicial debido a su plan
      gratuito, presencia local en Santiago y facilidad de implementación.
    </p>
    <p>
      Si tienes un sitio más grande o necesitas características avanzadas, considera <strong>AWS CloudFront</strong>{' '}
      para máxima flexibilidad o <strong>KeyCDN</strong> para una solución intermedia costo-efectiva.
    </p>
    <p>
      Un CDN no solo mejora la velocidad de tu sitio, sino que también contribuye al SEO y la experiencia del usuario,
      factores cruciales para el éxito online en Chile.
    </p>
  </>
);

export default CdnRecomendados;

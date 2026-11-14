import React from 'react';
import { H2, GuideNote, MarkList, MarkItem } from '../GuideBlocks';
import ProviderPick from '../ProviderPick';

const Marks: React.FC<{ items: string[] }> = ({ items }) => (
  <MarkList>
    {items.map((i) => (
      <MarkItem key={i}>{i}</MarkItem>
    ))}
  </MarkList>
);

/** Guía de seguridad web: WordPress, firewall/WAF y SSL. */
const SegWordPressWaf: React.FC = () => (
  <>
    <H2 id="wordpress-security">Seguridad WordPress (90&nbsp;% de mis casos)</H2>
    <GuideNote>
      <p>
        <strong>Realidad WordPress en Chile:</strong> El 85&nbsp;% de sitios web chilenos usan WordPress, pero solo el
        30&nbsp;% tiene seguridad básica configurada.
      </p>
      <p>He visto sitios hackeados con 50+ plugins desactualizados y contraseña «admin123».</p>
    </GuideNote>

    <h3>Plugins de seguridad que recomiendo</h3>
    <h4>Opción premium (recomendada)</h4>
    <p>
      <strong>Wordfence Premium.</strong> Precio a consultar.
    </p>
    <ul>
      <li>Firewall con reglas en tiempo real</li>
      <li>Escaneo malware diario</li>
      <li>Bloqueo por geolocalización</li>
      <li>Soporte 24/7</li>
    </ul>
    <h4>Opción gratuita</h4>
    <p>
      <strong>Wordfence Free + Limit Login.</strong> Gratuito.
    </p>
    <ul>
      <li>Firewall básico</li>
      <li>Escaneo malware semanal</li>
      <li>Límite de intentos login</li>
      <li>Suficiente para sitios básicos</li>
    </ul>

    <h3>Configuración que siempre hago</h3>
    <h4>Hardening básico</h4>
    <Marks
      items={[
        'Cambiar prefijo de tablas BD',
        'Ocultar versión WordPress',
        'Deshabilitar editor de archivos',
        'Limitar intentos de login',
        'Activar autenticación 2FA',
      ]}
    />
    <h4>Monitoreo</h4>
    <Marks
      items={[
        'Alertas de login admin',
        'Monitoreo cambios archivos',
        'Log de actividad usuarios',
        'Escaneo malware automático',
        'Notificaciones updates',
      ]}
    />

    <H2 id="firewall-waf">Firewall y WAF (Web Application Firewall)</H2>
    <GuideNote>
      <p>
        <strong>Mi experiencia:</strong> Un WAF bien configurado bloquea el 95&nbsp;% de ataques automáticos. Es como
        tener un guardia 24/7 en tu sitio.
      </p>
    </GuideNote>
    <ProviderPick name="Cloudflare" label="Mi favorito para 80&nbsp;% de casos">
      <p>Precio a consultar.</p>
      <ul>
        <li>Plan gratuito robusto</li>
        <li>CDN incluido</li>
        <li>DDoS protection</li>
        <li>Fácil configuración</li>
      </ul>
    </ProviderPick>
    <ProviderPick name="Sucuri" label="Mejor para sitios hackeados">
      <p>Precio a consultar.</p>
      <ul>
        <li>Limpieza malware incluida</li>
        <li>Soporte especializado</li>
        <li>Monitoreo 24/7</li>
        <li>Certificados SSL</li>
      </ul>
    </ProviderPick>
    <ProviderPick name="AWS WAF" label="Para desarrolladores">
      <p>Precio a consultar.</p>
      <ul>
        <li>Máxima personalización</li>
        <li>Escalabilidad enterprise</li>
        <li>Integración AWS</li>
        <li>Requiere conocimiento</li>
      </ul>
    </ProviderPick>
    <GuideNote tone="tip">
      <p>
        <strong>Mi recomendación para Chile:</strong> Cloudflare gratis + Wordfence Premium cubre el 95&nbsp;% de
        necesidades. Solo sitios enterprise necesitan más.
      </p>
    </GuideNote>

    <H2 id="ssl-certificados">SSL y certificados</H2>
    <GuideNote tone="caution">
      <p>
        <strong>Dato alarmante:</strong> En 2024 aún encuentro sitios chilenos SIN SSL, especialmente páginas
        corporativas y del gobierno.
      </p>
      <p>Un sitio sin SSL pierde automáticamente ranking en Google y confianza de usuarios.</p>
    </GuideNote>

    <h3>Tipos de SSL y cuándo usarlos</h3>
    <h4>SSL gratuito (Let&apos;s Encrypt)</h4>
    <p>Perfecto para: blogs, sitios informativos, portfolios.</p>
    <MarkList>
      <MarkItem>Gratis y automático</MarkItem>
      <MarkItem>Renovación automática</MarkItem>
      <MarkItem>Validación nivel dominio</MarkItem>
      <MarkItem no srLabel="">
        Sin garantía monetaria
      </MarkItem>
    </MarkList>
    <h4>SSL pagado</h4>
    <p>Perfecto para: e-commerce, empresas, servicios financieros.</p>
    <Marks
      items={[
        'Incluye garantía monetaria del emisor',
        'Validación empresa (EV)',
        'Sello de confianza',
        'Soporte dedicado',
      ]}
    />

    <h3>Configuración SSL que siempre hago</h3>
    <h4>En el servidor</h4>
    <Marks
      items={[
        'Forzar HTTPS en .htaccess',
        'Configurar HSTS headers',
        'Redirect 301 de HTTP a HTTPS',
        'Actualizar URLs internas',
      ]}
    />
    <h4>Testing y monitoreo</h4>
    <Marks
      items={[
        'Test SSL Labs (A+ rating)',
        'Verificar certificado válido',
        'Alertas expiración cert',
        'Monitoreo mixed content',
      ]}
    />
  </>
);

export default SegWordPressWaf;

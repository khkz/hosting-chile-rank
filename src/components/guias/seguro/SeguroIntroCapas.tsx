import React from 'react';
import { Shield, Lock, Zap, Server, Eye, FileWarning } from 'lucide-react';
import { H2 } from '../GuideBlocks';

const CHECKLIST = [
  { icon: Shield, title: 'WAF a nivel de servidor', detail: 'Web Application Firewall que filtra peticiones maliciosas antes de que lleguen a WordPress, Joomla o tu CMS.' },
  { icon: Eye, title: 'Escaneo de malware automático', detail: 'Detección y limpieza diaria de archivos infectados sin que tengas que intervenir.' },
  { icon: Lock, title: 'Aislamiento por cuenta', detail: 'Cada sitio corre en un entorno separado para que un hackeo no contamine al resto.' },
  { icon: FileWarning, title: 'Parcheo virtual de vulnerabilidades', detail: 'Bloqueo de exploits conocidos aunque tu plugin o tema todavía no esté actualizado.' },
  { icon: Server, title: 'Backups diarios fuera del servidor', detail: 'Copias automáticas, retenidas varios días y restaurables con un clic.' },
  { icon: Zap, title: 'Soporte 24/7 con acceso a sysadmin', detail: 'Que un humano pueda revisar logs, mitigar ataques y restaurar en minutos, no días.' },
];

const CAPAS = [
  {
    title: 'Capa 1: red e infraestructura',
    items: [
      'Firewall Enterprise perimetral con reglas anti-DDoS',
      'Filtrado de IPs maliciosas con feeds globales',
      'Segmentación de red entre servidores',
    ],
  },
  {
    title: 'Capa 2: servidor',
    items: [
      'BitNinja: WAF distribuido que aprende de millones de servidores y bloquea botnets en tiempo real',
      'Imunify360: detección de malware, parcheo virtual de CVEs y reputación de IPs',
      'ModSecurity con reglas OWASP CRS afinadas para CMS chilenos',
    ],
  },
  {
    title: 'Capa 3: aplicación y WordPress',
    items: [
      'Plugin de seguridad propio del proveedor con login protegido y 2FA',
      'Hardening automático de wp-config, xmlrpc y wp-login',
      'Escaneo programado de plugins y temas con CVE conocidas',
    ],
  },
  {
    title: 'Capa 4: datos y recuperación',
    items: [
      'Backups diarios con retención de 7 a 30 días',
      'Restauración granular (un archivo, una base, todo el sitio)',
      'Snapshots externos al servidor principal',
    ],
  },
];

/** Guía «hosting más seguro»: por qué importa y checklist. */
export const SeguroIntro: React.FC = () => (
  <>
    <H2 id="por-que">Por qué la seguridad del hosting importa más que nunca</H2>
    <p>
      Plataformas como Mitos.cl publican constantemente nuevas vulnerabilidades y los atacantes automatizan su
      explotación en cuestión de horas. La mayoría de los sitios en Chile corre sobre WordPress, Joomla o aplicaciones
      PHP en cPanel, los blancos más buscados por bots.
    </p>
    <p>
      Tu hosting es la primera línea de defensa: si filtra el ataque antes de que toque tu CMS, no importa que tengas un
      plugin desactualizado. Si no lo filtra, un solo CVE público puede tumbarte.
    </p>

    <H2 id="checklist">Checklist: lo que un hosting seguro debe ofrecer</H2>
    <ul className="not-prose my-6 divide-y divide-rule border-y border-rule">
      {CHECKLIST.map(({ icon: Icon, title, detail }) => (
        <li key={title} className="flex gap-3 py-4">
          <Icon aria-hidden className="mt-1 h-5 w-5 shrink-0 text-ink-2" />
          <div className="min-w-0">
            <p className="font-semibold text-ink">{title}</p>
            <p className="t-body mt-1 text-ink-2">{detail}</p>
          </div>
        </li>
      ))}
    </ul>
  </>
);

/** Guía «hosting más seguro»: las 4 capas y WordPress/cPanel. */
export const SeguroCapas: React.FC = () => (
  <>
    <H2 id="capas">Las 4 capas de seguridad que debes exigir</H2>
    {CAPAS.map((c) => (
      <React.Fragment key={c.title}>
        <h3>{c.title}</h3>
        <ul>
          {c.items.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
      </React.Fragment>
    ))}

    <H2 id="wordpress-cpanel">Seguridad específica para WordPress y cPanel</H2>
    <p>
      La mayoría de los hackeos en Chile entran por tres puertas: plugins de WordPress desactualizados, contraseñas
      débiles en cPanel y formularios sin validación. Un buen hosting cierra las tres por defecto:
    </p>
    <ul>
      <li>Bloqueo de fuerza bruta en wp-login y en cPanel después de N intentos fallidos.</li>
      <li>Doble factor obligatorio en el panel del cliente.</li>
      <li>Escaneo de archivos PHP con firmas y heurística (Imunify AV+).</li>
      <li>Aviso proactivo cuando un plugin queda con CVE pública.</li>
    </ul>
  </>
);

import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Server, Eye, Check, X, Minus, Info, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProvenanceTag } from '@/components/data/Provenance';
import { H2, GuideNote } from '../GuideBlocks';
import GuideTable from '../GuideTable';

type Estado = 'si' | 'parcial' | 'no' | 'info';

const ICONO: Record<Estado, React.ElementType> = { si: Check, parcial: Minus, no: X, info: Info };

const Celda: React.FC<{ estado: Estado; texto: string }> = ({ estado, texto }) => {
  const Icon = ICONO[estado];
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon aria-hidden className="h-4 w-4 shrink-0 text-ink-3" />
      {texto}
    </span>
  );
};

// Datos de la guía (pendiente 10 del dueño): se conservan tal cual; solo cambia la presentación.
const FILAS: { nombre: string; celdas: [Estado, string][] }[] = [
  {
    nombre: 'HostingPlus',
    celdas: [
      ['info', 'Según sitio'],
      ['info', 'Según sitio'],
      ['si', 'Todos los planes'],
      ['si', 'JetBackup diarios'],
    ],
  },
  {
    nombre: 'EcoHosting',
    celdas: [
      ['no', 'No consta'],
      ['parcial', 'Solo Corporativo'],
      ['no', 'No consta'],
      ['si', 'JetBackup en todos'],
    ],
  },
  {
    nombre: '1Hosting',
    celdas: [
      ['no', 'No consta'],
      ['no', 'No consta'],
      ['parcial', 'Emprendedor+'],
      ['parcial', 'Semanales'],
    ],
  },
];

/** Guía «hosting más seguro»: caso destacado, comparativa y preguntas al proveedor. */
const SeguroComparativa: React.FC = () => (
  <>
    <H2 id="caso-destacado">Caso destacado: HostingPlus</H2>
    <p>Es el proveedor del ranking que hoy combina las cuatro capas con tecnologías comerciales reconocidas.</p>
    <ul className="not-prose my-5 space-y-3">
      {[
        { Icon: Shield, k: 'BitNinja', v: 'como WAF distribuido + reputación global de IPs.' },
        { Icon: Eye, k: 'Imunify360', v: 'con escaneo de malware, parcheo virtual y limpieza automática.' },
        { Icon: Lock, k: 'Firewall Enterprise', v: 'perimetral con mitigación DDoS.' },
        { Icon: Server, k: 'Plugin propio de seguridad', v: 'y hardening automático de WordPress.' },
      ].map(({ Icon, k, v }) => (
        <li key={k} className="flex gap-2.5 text-[1.0625rem] leading-[1.7] text-ink-2">
          <Icon aria-hidden className="mt-[0.35em] h-4 w-4 shrink-0 text-ink-3" />
          <span>
            <strong className="font-semibold text-ink">{k}</strong> {v}
          </span>
        </li>
      ))}
    </ul>
    <GuideNote>
      <p>
        Esta evaluación se basa en la curaduría pública de proveedores verificados del ranking. No es un patrocinio:
        cualquier proveedor que cumpla las cuatro capas recibe la misma consideración.
      </p>
    </GuideNote>
    <div className="not-prose mt-5 flex flex-wrap gap-3">
      <Button asChild>
        <a
          href="https://www.hostingplus.cl/hosting/?utm_source=eligetuhosting&utm_medium=guia&utm_campaign=hosting-seguro"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ir al sitio de HostingPlus
          <ExternalLink aria-hidden />
          <span className="sr-only"> (se abre en una pestaña nueva)</span>
        </a>
      </Button>
      <Button asChild variant="outline">
        <Link to="/mejor-hosting-chile-2026">Ver el ranking</Link>
      </Button>
    </div>

    <H2 id="comparativa">Comparativa de seguridad por proveedor</H2>
    <p>
      Datos verificados a partir de los planes publicados en nuestro catálogo. Lo que no consta en los features del plan
      no significa que no exista: se indica con{' '}
      <Minus role="img" aria-label="un guion" className="inline h-4 w-4 align-text-bottom text-ink-3" />.
    </p>
    <p className="not-prose t-meta flex flex-wrap items-center gap-2">
      Procedencia de los datos: <ProvenanceTag kind="declared" />
    </p>
    <GuideTable
      caption="Seguridad incluida por proveedor según sus planes publicados"
      columns={['Proveedor', 'BitNinja', 'Imunify360', 'Firewall / WAF', 'Backups']}
      rows={FILAS.map((f) => ({
        key: f.nombre,
        cells: [
          <span key="n" className="block">
            {f.nombre}
            <span className="t-meta block font-normal">Precio: a consultar</span>
          </span>,
          ...f.celdas.map(([estado, texto], i) => <Celda key={i} estado={estado} texto={texto} />),
        ],
      }))}
    />
    <GuideNote>
      <p>
        <strong>Evidencia:</strong> los datos de BitNinja e Imunify360 de HostingPlus provienen de la documentación
        publicada por el proveedor y de su curaduría en el ranking. Los demás datos se extraen directamente de los
        features listados en los planes publicados de cada proveedor en nuestro catálogo.
      </p>
    </GuideNote>

    <H2 id="preguntas-proveedor">7 preguntas para hacerle a tu hosting actual</H2>
    <ol>
      <li>¿Tienen WAF a nivel de servidor o solo confían en plugins del CMS?</li>
      <li>¿Usan Imunify360, BitNinja u otra solución comercial reconocida?</li>
      <li>¿Cada cuánto escanean malware y cómo me avisan?</li>
      <li>¿Hacen parcheo virtual de CVEs mientras yo actualizo?</li>
      <li>¿Cuántos días de backup retienen y dónde los guardan?</li>
      <li>¿Cuál es el SLA de respuesta ante un hackeo confirmado?</li>
      <li>¿Aíslan mi cuenta de los demás clientes del servidor?</li>
    </ol>
  </>
);

export default SeguroComparativa;

import React from 'react';
import { Link } from 'react-router-dom';
import { ProvenanceTag } from '@/components/data/Provenance';
import { Button } from '@/components/ui/button';
import { formatPercent } from '@/lib/format';
import { money, type PePrice, priceText, type PeProvider } from './peTypes';
import { ProviderLink } from './PeRanking';

// ── Casos de uso ─────────────────────────────────────────────────────────

const CASOS: { need: string; plan: string; price?: PePrice; why: string }[] = [
  { need: 'WordPress', plan: 'Plan WordPress', price: { amount: 389, currency: 'PEN' }, why: 'LiteSpeed + LSCache + NVMe con soporte local.' },
  { need: 'Presupuesto ajustado', plan: 'Oferta SSD', price: { amount: 70, currency: 'PEN', period: 'año' }, why: 'Precio de entrada más bajo con factura peruana.' },
  { need: 'Tienda online', plan: 'eCommerce', price: { amount: 479, currency: 'PEN' }, why: 'Recursos y optimizaciones para WooCommerce / PrestaShop.' },
  { need: 'Empresa con RUC', plan: 'Cualquier plan HostingPlus.pe', why: 'S.A.C. peruana emite factura en soles.' },
  { need: 'VPS', plan: 'VPS', price: { amount: 289, currency: 'PEN', period: 'mes', from: true }, why: 'Recursos dedicados, ideal para proyectos que crecen.' },
];

export const PeUseCases: React.FC<{ year: number }> = ({ year }) => (
  <>
    <ul className="grid gap-px overflow-hidden rounded-xl border border-rule bg-rule md:grid-cols-2">
      {CASOS.map((c, i) => (
        <li key={c.need} className={`bg-white p-5 ${i === CASOS.length - 1 && CASOS.length % 2 === 1 ? 'md:col-span-2' : ''}`}>
          <p className="t-meta">{c.need}</p>
          <p className="mt-1 font-semibold text-ink">
            {c.plan}
            {c.price && <span className="tabular">: {priceText(c.price)}</span>}
          </p>
          <p className="t-small mt-1 text-ink-2">{c.why}</p>
        </li>
      ))}
    </ul>
    <p className="t-meta mt-4 flex flex-wrap items-center gap-2">
      <ProvenanceTag kind="declared" variant="glyph" />
      Precios de HostingPlus.pe verificados en julio de {year}.
    </p>
  </>
);

// ── Metodología de Perú ──────────────────────────────────────────────────

const CRITERIOS = [
  { weight: 30, title: 'Reclamos verificados', description: 'Cantidad, gravedad y recurrencia de reclamos públicos verificados en nuestro registro y en fuentes externas (Indecopi, redes, foros).' },
  { weight: 25, title: 'Servicio post-venta', description: 'Tiempo real de primera respuesta, canales en español y presencia de equipo en Perú.' },
  { weight: 20, title: 'Velocidad y tecnología', description: 'LiteSpeed Enterprise, SSD/NVMe, caché, HTTP/3 y TTFB observado desde Lima.' },
  { weight: 15, title: 'Seguridad y datacenter', description: 'Certificación del datacenter (TÜV/Uptime/ICREA), WAF, SSL, backups automáticos y anti-DDoS.' },
  { weight: 10, title: 'Precio vs. valor', description: 'Precio inicial vs. renovación, factura local en soles y garantía de devolución.' },
];

export const PeMethodology: React.FC = () => (
  <>
    <ol className="divide-y divide-rule border-y-2 border-ink">
      {CRITERIOS.map((c) => (
        <li key={c.title} className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-4 py-4 md:grid-cols-[6rem_minmax(0,1fr)]">
          <span className="text-2xl font-bold text-ink tabular">{formatPercent(c.weight, 0)}</span>
          <div className="min-w-0">
            <p className="font-semibold text-ink">{c.title}</p>
            <p className="t-small measure mt-1 text-ink-2">{c.description}</p>
          </div>
        </li>
      ))}
    </ol>
    <p className="t-small mt-5 text-ink-2">
      Ver también{' '}
      <Link to="/pe/hosting-con-datacenter-local" className="font-medium text-ink underline underline-offset-4">
        proveedores con datacenter en Perú
      </Link>{' '}
      y{' '}
      <Link to="/pe/benchmark" className="font-medium text-ink underline underline-offset-4">
        benchmark PE
      </Link>
      .
    </p>
  </>
);

// ── ¿Datacenter certificado o autodeclarado? ─────────────────────────────

const PREGUNTAS = [
  { q: '1) ¿En qué datacenter están físicamente?', hp: 'GTD Lima, Perú (nombre del operador identificable y ubicación real).' },
  { q: '2) ¿Qué certificación tiene y quién la emite?', hp: 'Tier III certificado del datacenter GTD Lima (operador reconocido en el mercado peruano).' },
  { q: '3) ¿Puedo verificarlo yo mismo?', hp: 'Sí: RUC 20611867108 en SUNAT, 0 reclamos en «Mira a Quién le Compras» de INDECOPI y teléfono Lima (01) 640 9409.' },
];

export const PeDatacenterTest: React.FC = () => (
  <>
    <div className="prose">
      <p>
        En el mercado peruano abundan frases como «datacenter propio», «clase mundial» o «Tier III homologable». Ninguna es
        una certificación. Un <strong>Tier III real</strong> exige redundancia N+1, generadores de respaldo, rutas duales de
        energía y refrigeración, y <strong>mantenimiento sin apagado</strong>, verificados por un emisor independiente (Uptime
        Institute, TÜV Rheinland o ICREA). Una «sala acondicionada» no cumple ninguno de esos requisitos y no es equivalente.
      </p>
    </div>
    <ul className="mt-8 grid gap-4 md:grid-cols-3">
      {PREGUNTAS.map((row) => (
        <li key={row.q} className="rounded-xl border border-rule bg-white p-5">
          <p className="font-semibold text-ink">{row.q}</p>
          <p className="t-label mt-3">HostingPlus responde</p>
          <p className="t-small mt-1 text-ink-2">{row.hp}</p>
        </li>
      ))}
    </ul>
    <p className="t-small measure mt-6 text-ink-2">
      Aplícale las mismas 3 preguntas a cualquier otro proveedor peruano antes de contratar. Si no puede nombrar el operador
      del datacenter, mostrar la certificación con emisor identificable ni entregarte un RUC verificable en SUNAT, no está a
      la altura.
    </p>
  </>
);

// ── Cierre: Chile y contratación ─────────────────────────────────────────

export const PeChileLink: React.FC = () => (
  <div className="flex flex-col gap-4 rounded-xl border border-rule p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
    <div>
      <p className="font-semibold text-ink">¿Buscas hosting en Chile?</p>
      <p className="t-small text-ink-2">Revisa nuestro ranking auditado para el mercado chileno.</p>
    </div>
    <Button asChild variant="outline">
      <a href="https://eligetuhosting.cl/mejor-hosting-chile-2026" rel="noopener">
        Ver el ranking de Chile
      </a>
    </Button>
  </div>
);

export const PeFinalCta: React.FC<{ top: PeProvider }> = ({ top }) => (
  <div className="max-w-3xl">
    <h2 className="t-h2 text-ink">Contrata HostingPlus.pe</h2>
    <p className="t-lead mt-4">
      Empresa peruana, factura en soles, soporte 24/7 en Lima. Planes desde{' '}
      <strong className="font-semibold text-ink">{money(70, 'PEN')} al año</strong>, 30 días de garantía.
    </p>
    <ProviderLink p={top} rank={1} location="pe_ranking_cta" className="mt-7 h-12 px-6 text-base" />
    <p className="t-meta mt-4">
      Divulgación: podemos recibir una comisión si contratas por este enlace. No altera el orden del ranking.
    </p>
  </div>
);

import { Button } from '@/components/ui/button';
import { ShieldCheck, FileText, Phone, Headphones, Building2, ExternalLink, Server } from 'lucide-react';
import { track } from '@/lib/track';
import type { LatamDcSlug } from '@/lib/dcLocal';

/**
 * Bloque "Recomendado editorial" por país con reaseguros SOLO verificables desde
 * la base de datos (proveedores-{pais}.json). NADA inventado:
 * - Si el proveedor tiene razón social local, se muestra; si no, se muestra la
 *   entidad del grupo con la etiqueta honesta correspondiente.
 * - El datacenter se declara textualmente como lo publica el proveedor; NUNCA
 *   afirmamos "infraestructura propia en {país}" cuando no lo hay.
 * - CTA "Ver planes y precios" con rel="sponsored" y trackEvent.
 * - Divulgación de comisión visible.
 */

type Bullet = { icon: 'legal' | 'phone' | 'support' | 'group' | 'dc'; label: string; value: string };

type CountryReco = {
  provider: string;
  url: string;
  headline: string;
  bullets: Bullet[];
  datacenterDisclosure: string;
  trackSlug: string;
};

type LatamComSlug = Exclude<LatamDcSlug, 'cl'>;

const RECOS: Record<LatamComSlug, CountryReco> = {
  pe: {
    provider: 'HostingPlus Perú',
    url: 'https://www.hostingplus.pe/',
    headline:
      'Operador regional con razón social peruana, soporte hispano y teléfono local. Datos verificables por WHOIS, registro mercantil y sitio oficial.',
    bullets: [
      { icon: 'legal',   label: 'Razón social peruana registrada', value: 'Hostingplus Datacenter S.A.C.' },
      { icon: 'phone',   label: 'Teléfono local en Perú',          value: '+51 1 640 9409' },
      { icon: 'support', label: 'Soporte en español',              value: 'Ticket 24/7 · Lun–Vie 9:00–17:00 hora local' },
      { icon: 'group',   label: 'Grupo regional',                  value: 'HostingPlus (opera en CL, PE, MX, CO, AR)' },
    ],
    datacenterDisclosure:
      'Datacenter declarado por el proveedor: Orlando, Florida (EE.UU.). No opera datacenter propio dentro de Perú.',
    trackSlug: 'hostingplus-pe',
  },
  mx: {
    provider: 'HostingPlus México',
    url: 'https://www.hostingplus.mx/',
    headline:
      'Operador regional con soporte hispano y teléfono local en México. No tiene entidad legal mexicana propia: factura como grupo desde Chile. Datos verificables por WHOIS y sitio oficial.',
    bullets: [
      { icon: 'legal',   label: 'Entidad que factura',    value: 'Grupo HostingPlus · PlusChile Internet Ltda. (Chile) — sin entidad legal mexicana' },
      { icon: 'phone',   label: 'Teléfono local en México', value: '+52 55 4161 6883' },
      { icon: 'support', label: 'Soporte en español',       value: 'Ticket 24/7 · atención hispana' },
      { icon: 'group',   label: 'Grupo regional',           value: 'HostingPlus (opera en CL, PE, MX, CO, AR)' },
    ],
    datacenterDisclosure:
      'Datacenter declarado por el proveedor: Florida (EE.UU.). No opera datacenter propio dentro de México. Si necesitas infraestructura dentro del país, revisa el directorio (Artehosting, Neubox, HostDime MX declaran DC en MX).',
    trackSlug: 'hostingplus-mx',
  },
  co: {
    provider: 'HostingPlus Colombia',
    url: 'https://www.hostingplus.com.co/',
    headline:
      'Operador regional con soporte hispano y teléfono local en Colombia. No tiene entidad legal colombiana ni datacenter propio en el país: factura desde su matriz internacional. Datos verificables por WHOIS y sitio oficial.',
    bullets: [
      { icon: 'legal',   label: 'Entidad que factura',      value: 'HostingPlus LLC (Florida, EE.UU.) — sin entidad legal colombiana' },
      { icon: 'phone',   label: 'Teléfono local en Colombia', value: '+57 601 3819361' },
      { icon: 'support', label: 'Soporte en español',         value: 'Ticket 24/7 · atención hispana' },
      { icon: 'group',   label: 'Grupo regional',             value: 'HostingPlus (opera en CL, PE, MX, CO, AR)' },
    ],
    datacenterDisclosure:
      'Datacenter declarado por el proveedor: Florida (EE.UU.). No opera datacenter propio dentro de Colombia. Si necesitas infraestructura dentro del país, revisa el directorio (HostDime, IPXON, Conexcol declaran DC en Colombia).',
    trackSlug: 'hostingplus-co',
  },
  ar: {
    provider: 'HostingPlus Argentina',
    url: 'https://hostingplus.ar/',
    headline:
      'Operador regional con soporte hispano y teléfono local en Argentina. No tiene entidad legal argentina: factura como grupo desde Chile. Datos verificables por WHOIS y sitio oficial.',
    bullets: [
      { icon: 'legal',   label: 'Entidad que factura',       value: 'Pluschile Internet Ltda. (Chile, RUT 76.636.640-6) — sin entidad legal argentina' },
      { icon: 'phone',   label: 'Teléfono local en Argentina', value: '+54 11 5168 5786' },
      { icon: 'support', label: 'Soporte en español',          value: 'Ticket 24/7 · atención hispana' },
      { icon: 'group',   label: 'Grupo regional',              value: 'HostingPlus (opera en CL, PE, MX, CO, AR)' },
    ],
    datacenterDisclosure:
      'Datacenter declarado por el proveedor: Orlando (EE.UU.) y Santiago (Chile). No opera datacenter propio dentro de Argentina. Si necesitas infraestructura dentro del país, revisa el directorio (BAEHOST, DonWeb, Ferozo declaran DC en Argentina).',
    trackSlug: 'hostingplus-ar',
  },
};

const ICONS = {
  legal: FileText,
  phone: Phone,
  support: Headphones,
  group: Building2,
  dc: Server,
} as const;

export default function CountryReassurances({
  country,
  countryName,
  variant = 'landing',
}: {
  country: LatamComSlug;
  countryName: string;
  variant?: 'landing' | 'best';
}) {
  const reco = RECOS[country];
  if (!reco) return null;

  const onCta = () =>
    track('click_afiliado', { provider: reco.trackSlug, country: country.toUpperCase(), position: variant });

  return (
    <section
      aria-labelledby={`${country}-curated-heading`}
      className="mb-10 rounded-2xl border border-[#EF233C]/40 bg-gradient-to-br from-[#EF233C]/5 via-white to-[#EF233C]/10 shadow-sm overflow-hidden"
    >
      <div className="p-5 md:p-7">
        <div className="flex items-start gap-3 mb-4">
          <div className="rounded-full bg-[#EF233C]/10 p-2 shrink-0">
            <ShieldCheck className="h-5 w-5 text-[#EF233C]" aria-hidden />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[#EF233C] font-semibold">
              Recomendado editorial · {countryName}
            </div>
            <h2
              id={`${country}-curated-heading`}
              className="text-xl md:text-2xl font-bold text-[#2B2D42] leading-tight"
            >
              {reco.provider}
            </h2>
            <p className="text-sm text-[#2B2D42]/75 mt-1">{reco.headline}</p>
          </div>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
          {reco.bullets.map((b) => {
            const Icon = ICONS[b.icon];
            return (
              <li
                key={b.label}
                className="flex items-start gap-2.5 rounded-lg bg-white/70 border border-[#2B2D42]/10 p-3"
              >
                <Icon className="h-4 w-4 text-[#2B2D42]/70 mt-0.5 shrink-0" aria-hidden />
                <div className="text-xs leading-snug">
                  <div className="text-[#2B2D42]/60">{b.label}</div>
                  <div className="text-[#2B2D42] font-medium">{b.value}</div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <Button asChild size="lg" className="cta-primary">
            <a
              href={reco.url}
              target="_blank"
              rel="sponsored noopener"
              referrerPolicy="no-referrer"
              onClick={onCta}
              className="inline-flex items-center gap-2"
            >
              Ver planes y precios <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
          </Button>
          <span className="text-xs text-[#2B2D42]/60">Sin compromiso · atención en español</span>
        </div>

        <p className="text-[11px] text-[#2B2D42]/60 mt-4 leading-snug">
          <strong>Divulgación:</strong> podemos recibir una comisión si contratas por este
          enlace. La recomendación se basa en trayectoria verificable del grupo en LATAM y
          no altera el orden objetivo del directorio de más abajo. {reco.datacenterDisclosure}
        </p>
      </div>
    </section>
  );
}

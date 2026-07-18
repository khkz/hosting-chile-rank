import { Button } from '@/components/ui/button';
import { ShieldCheck, FileText, Phone, Headphones, Building2, ExternalLink } from 'lucide-react';
import { track } from '@/lib/track';

/**
 * Bloque "Recomendado editorial: HostingPlus Perú" con reaseguros verificables
 * desde la base de datos (razón social peruana, teléfono local, soporte 24/7,
 * grupo regional). NADA inventado: no mencionamos garantía porque no está
 * publicada; el datacenter declarado se muestra honestamente sin llamarlo
 * "local".
 *
 * CTA: "Ver planes y precios" con trackEvent y rel="sponsored" para divulgación.
 * Divulgación de comisión visible.
 */
export default function PeReassurances({ variant = 'landing' }: { variant?: 'landing' | 'best' }) {
  const bullets = [
    {
      icon: FileText,
      label: 'Razón social peruana registrada',
      value: 'Hostingplus Datacenter S.A.C.',
    },
    {
      icon: Phone,
      label: 'Teléfono local en Perú',
      value: '+51 1 640 9409',
    },
    {
      icon: Headphones,
      label: 'Soporte en español',
      value: 'Ticket 24/7 · Lun–Vie 9:00–17:00 hora local',
    },
    {
      icon: Building2,
      label: 'Grupo regional',
      value: 'HostingPlus (opera en CL, PE, MX, CO, AR)',
    },
  ];

  const onCta = () => track('click_afiliado', { provider: 'hostingplus-pe', country: 'PE', position: variant });

  return (
    <section
      aria-labelledby="pe-curated-heading"
      className="mb-10 rounded-2xl border border-[#EF233C]/40 bg-gradient-to-br from-[#EF233C]/5 via-white to-[#EF233C]/10 shadow-sm overflow-hidden"
    >
      <div className="p-5 md:p-7">
        <div className="flex items-start gap-3 mb-4">
          <div className="rounded-full bg-[#EF233C]/10 p-2 shrink-0">
            <ShieldCheck className="h-5 w-5 text-[#EF233C]" aria-hidden />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[#EF233C] font-semibold">
              Recomendado editorial · Perú
            </div>
            <h2 id="pe-curated-heading" className="text-xl md:text-2xl font-bold text-[#2B2D42] leading-tight">
              HostingPlus Perú
            </h2>
            <p className="text-sm text-[#2B2D42]/75 mt-1">
              Operador regional con razón social peruana, soporte hispano y teléfono
              local. Datos verificables por WHOIS, registro mercantil y sitio oficial.
            </p>
          </div>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
          {bullets.map(({ icon: Icon, label, value }) => (
            <li key={label} className="flex items-start gap-2.5 rounded-lg bg-white/70 border border-[#2B2D42]/10 p-3">
              <Icon className="h-4 w-4 text-[#2B2D42]/70 mt-0.5 shrink-0" aria-hidden />
              <div className="text-xs leading-snug">
                <div className="text-[#2B2D42]/60">{label}</div>
                <div className="text-[#2B2D42] font-medium">{value}</div>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <Button asChild size="lg" className="cta-primary">
            <a
              href="https://www.hostingplus.pe/"
              target="_blank"
              rel="sponsored noopener"
              referrerPolicy="no-referrer"
              onClick={onCta}
              className="inline-flex items-center gap-2"
            >
              Ver planes y precios <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
          </Button>
          <span className="text-xs text-[#2B2D42]/60">
            Sin compromiso · atención en español
          </span>
        </div>

        <p className="text-[11px] text-[#2B2D42]/60 mt-4 leading-snug">
          <strong>Divulgación:</strong> podemos recibir una comisión si contratas por este enlace.
          La recomendación se basa en trayectoria verificable del grupo en LATAM y no altera el
          orden objetivo del ranking de más abajo. Datacenter declarado por el proveedor: Orlando,
          Florida (EE.UU.).
        </p>
      </div>
    </section>
  );
}

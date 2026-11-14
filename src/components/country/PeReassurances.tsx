import { Button } from '@/components/ui/button';
import { ProvenanceTag } from '@/components/data/Provenance';
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
 *
 * Nota (rediseño «Cercano y confiable»): hoy no se dibuja en ninguna ruta, porque
 * /pe/mejor-hosting-peru-2026 usa MejorHostingPeru2026. Se limpió solo la forma.
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
      value: 'Ticket 24/7, lunes a viernes 9:00–17:00 hora local',
    },
    {
      icon: Building2,
      label: 'Grupo regional',
      value: 'HostingPlus (opera en CL, PE, MX, CO, AR)',
    },
  ];

  const onCta = () => track('click_afiliado', { provider: 'hostingplus-pe', country: 'PE', position: variant });

  return (
    <section aria-labelledby="pe-curated-heading" className="mb-10 rounded-xl border border-rule bg-paper p-5 md:p-7">
      <div className="mb-5 flex items-start gap-3">
        <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-ink-2" aria-hidden />
        <div>
          <p className="t-label flex flex-wrap items-center gap-2">
            <span>Recomendado editorial en Perú</span>
            <ProvenanceTag kind="editorial" />
          </p>
          <h2 id="pe-curated-heading" className="t-h3 mt-1 text-ink">
            HostingPlus Perú
          </h2>
          <p className="t-small mt-1 text-ink-2">
            Operador regional con razón social peruana, soporte hispano y teléfono
            local. Datos verificables por WHOIS, registro mercantil y sitio oficial.
          </p>
        </div>
      </div>

      <ul className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        {bullets.map(({ icon: Icon, label, value }) => (
          <li key={label} className="flex items-start gap-2.5 rounded-xl border border-rule bg-white p-3">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-ink-3" aria-hidden />
            <div className="text-sm leading-snug">
              <div className="text-ink-3">{label}</div>
              <div className="font-medium text-ink">{value}</div>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <Button asChild size="lg" variant="brand">
          <a
            href="https://www.hostingplus.pe/"
            target="_blank"
            rel="sponsored noopener"
            referrerPolicy="no-referrer"
            onClick={onCta}
          >
            Ver planes y precios <ExternalLink aria-hidden />
          </a>
        </Button>
        <span className="t-meta">Sin compromiso, atención en español</span>
      </div>

      <p className="t-meta mt-4">
        <strong className="font-semibold text-ink-2">Divulgación:</strong> podemos recibir una comisión si contratas por este enlace.
        La recomendación se basa en trayectoria verificable del grupo en LATAM y no altera el
        orden objetivo del ranking de más abajo. Datacenter declarado por el proveedor: Orlando,
        Florida (EE.UU.).
      </p>
    </section>
  );
}

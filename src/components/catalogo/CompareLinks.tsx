import React from 'react';
import { ArrowRight } from 'lucide-react';

// Proveedores con guía de migración publicada.
const MIGRATION_SLUGS = ['hostgator', 'bluehost', 'godaddy', 'hostingcl', 'planetahosting', 'fasthosting', 'webhosting'];

interface CompareLinksProps {
  slug: string;
  name: string;
}

const LinkCard: React.FC<{ href: string; label: string; title: string; note?: string; large?: boolean }> = ({
  href,
  label,
  title,
  note,
  large = false,
}) => (
  <a
    href={href}
    className="group block rounded-xl border border-rule bg-white p-5 text-ink transition-colors hover:border-ink"
  >
    <span className="t-label">{label}</span>
    <span className={`mt-1 flex items-start gap-2 font-bold ${large ? 'text-lg md:text-xl' : 'text-base'}`}>
      <span className="min-w-0 underline-offset-4 group-hover:underline">{title}</span>
      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-ink-2" aria-hidden />
    </span>
    {note && <span className="mt-1 block t-small text-ink-2">{note}</span>}
  </a>
);

/**
 * Enlaces para seguir comparando desde la ficha. La caja «Compáralo con el #1»
 * es una decisión de negocio pendiente (3): se restiliza, con las mismas palabras.
 */
const CompareLinks: React.FC<CompareLinksProps> = ({ slug, name }) => {
  if (!slug || slug === 'hostingplus' || slug === 'ecohosting') return null;
  return (
    <div className="min-w-0 space-y-4">
      <LinkCard
        href={`/comparativa/${slug}-vs-hostingplus`}
        label="Comparativa"
        title={`Compáralo con el #1: ${name} vs HostingPlus.cl`}
        note="Tabla lado a lado con nota, precio, datacenter y reseñas verificadas."
        large
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <LinkCard href={`/alternativas-a/${slug}`} label="Alternativas" title={`Mejores alternativas a ${name}`} />
        {MIGRATION_SLUGS.includes(slug) && (
          <LinkCard href={`/migrar-de/${slug}`} label="Migración gratuita" title={`Migrar de ${name} sin downtime`} />
        )}
      </div>
    </div>
  );
};

export default CompareLinks;

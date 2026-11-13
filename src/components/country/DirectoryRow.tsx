import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ExternalLink, MapPin, Phone, Server } from 'lucide-react';
import { ProvenanceGlyph } from '@/components/data/Provenance';
import { hasLocalDatacenter, type LatamDcSlug } from '@/lib/dcLocal';
import { getProviderLink } from '@/lib/providerLinks';
import { formatCorporateGroup } from '@/lib/formatGroup';

/**
 * Una fila del directorio de proveedores de un país. Separada de
 * CountryLanding para respetar el máximo de 400 líneas por archivo.
 */
interface DirectoryRowProps {
  // Fila de hosting_companies tal como la entrega la consulta del directorio.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  company: any;
  countrySlug: string;
  countryName: string;
  dcSlug: LatamDcSlug;
}

const DirectoryRow: React.FC<DirectoryRowProps> = ({ company: c, countrySlug, countryName, dcSlug }) => {
  const link = c.slug && c.website ? getProviderLink(c.slug, c.website) : null;
  const techs: string[] = Array.isArray(c.technologies)
    ? c.technologies.filter((t: unknown) => typeof t === 'string')
    : [];
  const local = hasLocalDatacenter(dcSlug, c.datacenter_location);
  return (
    <li className="grid gap-4 py-5 md:grid-cols-12 md:gap-6">
      <div className="md:col-span-4">
        <h3 className="text-lg font-semibold text-ink">
          {c.slug ? (
            <Link to={`/${countrySlug}/${c.slug}`} className="hover:underline underline-offset-4">
              {c.name}
            </Link>
          ) : (
            c.name
          )}
        </h3>
        {c.legal_name && <p className="mt-0.5 text-sm text-ink-2">{c.legal_name}</p>}
        {c.corporate_group && <p className="text-sm text-ink-3">{formatCorporateGroup(c.corporate_group)}</p>}
      </div>
      <dl className="grid gap-x-6 gap-y-2 text-sm md:col-span-6 md:grid-cols-2">
        <div>
          <dt className="flex items-center gap-1.5 text-xs text-ink-3">
            <Server className="h-3.5 w-3.5" aria-hidden /> Datacenter
            <ProvenanceGlyph kind="declared" />
          </dt>
          <dd className="mt-0.5 text-ink">
            {c.datacenter_location || <span className="text-ink-3">No lo declara</span>}
            {local && (
              <span className="ml-2 rounded bg-signal-declared-bg px-1.5 py-[1px] text-[11px] font-semibold text-signal-declared">
                En {countryName}
              </span>
            )}
          </dd>
        </div>
        <div>
          <dt className="flex items-center gap-1.5 text-xs text-ink-3">
            <Phone className="h-3.5 w-3.5" aria-hidden /> Contacto
          </dt>
          <dd className="mt-0.5 text-ink">
            {c.contact_phone || <span className="text-ink-3">Sin teléfono publicado</span>}
            {c.contact_hours && <span className="block text-ink-2">{c.contact_hours}</span>}
          </dd>
        </div>
        {c.contact_address && (
          <div>
            <dt className="flex items-center gap-1.5 text-xs text-ink-3">
              <MapPin className="h-3.5 w-3.5" aria-hidden /> Dirección
            </dt>
            <dd className="mt-0.5 text-ink">{c.contact_address}</dd>
          </div>
        )}
        {techs.length > 0 && (
          <div>
            <dt className="flex items-center gap-1.5 text-xs text-ink-3">
              <Cpu className="h-3.5 w-3.5" aria-hidden /> Tecnología
            </dt>
            <dd className="mt-0.5 text-ink">{techs.slice(0, 6).join(', ')}</dd>
          </div>
        )}
      </dl>
      <div className="flex gap-2 md:col-span-2 md:flex-col md:items-stretch">
        {c.slug && (
          <Link
            to={`/${countrySlug}/${c.slug}`}
            className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-md border border-ink/25 px-3 text-sm font-semibold text-ink hover:border-ink md:flex-none"
          >
            Ver ficha
          </Link>
        )}
        {link && (
          <a
            href={link.href}
            target="_blank"
            rel={link.rel}
            referrerPolicy="no-referrer"
            className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1 rounded-md bg-ink px-3 text-sm font-semibold text-white hover:bg-ink-soft md:flex-none"
          >
            Visitar sitio <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        )}
      </div>
    </li>
  );
};

export default DirectoryRow;

import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ExternalLink, MapPin, Phone, Server, type LucideIcon } from 'lucide-react';
import { ProvenanceTag } from '@/components/data/Provenance';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { hasLocalDatacenter, type LatamDcSlug } from '@/lib/dcLocal';
import { getProviderLink } from '@/lib/providerLinks';
import { formatCorporateGroup } from '@/lib/formatGroup';

/**
 * Una fila del directorio de proveedores de un país. Separada de
 * CountryLanding para respetar el máximo de 400 líneas por archivo.
 * El datacenter es lo que declara cada proveedor: lleva el glifo «Declarado»,
 * que el lector de pantalla también anuncia.
 */
interface DirectoryRowProps {
  // Fila de hosting_companies tal como la entrega la consulta del directorio.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  company: any;
  countrySlug: string;
  countryName: string;
  dcSlug: LatamDcSlug;
}

const Term: React.FC<{ icon: LucideIcon; children: React.ReactNode }> = ({
  icon: Icon,
  children,
}) => (
  <dt className="t-meta flex items-center gap-1.5">
    <Icon className="h-4 w-4 shrink-0 text-ink-3" aria-hidden />
    {children}
  </dt>
);

const DirectoryRow: React.FC<DirectoryRowProps> = ({ company: c, countrySlug, countryName, dcSlug }) => {
  const link = c.slug && c.website ? getProviderLink(c.slug, c.website) : null;
  const techs: string[] = Array.isArray(c.technologies)
    ? c.technologies.filter((t: unknown) => typeof t === 'string')
    : [];
  const local = hasLocalDatacenter(dcSlug, c.datacenter_location);
  return (
    <li className="grid gap-4 py-6 md:grid-cols-12 md:gap-6">
      <div className="min-w-0 md:col-span-4">
        <h3 className="t-h3 text-ink">
          {c.slug ? (
            <Link to={`/${countrySlug}/${c.slug}`} className="underline-offset-4 hover:underline">
              {c.name}
            </Link>
          ) : (
            c.name
          )}
        </h3>
        {c.legal_name && <p className="t-small mt-1 text-ink-2">{c.legal_name}</p>}
        {c.corporate_group && <p className="t-meta mt-0.5">{formatCorporateGroup(c.corporate_group)}</p>}
      </div>
      <dl className="t-small grid min-w-0 gap-x-6 gap-y-3 md:col-span-5 md:grid-cols-2 lg:col-span-5">
        <div className="min-w-0">
          <Term icon={Server}>
            Datacenter
            <ProvenanceTag kind="declared" variant="glyph" />
          </Term>
          <dd className="mt-0.5 break-words text-ink">
            {c.datacenter_location || <span className="text-ink-3">No lo declara</span>}
            {local && (
              <Badge variant="outline" className="ml-2 align-middle">
                En {countryName}
              </Badge>
            )}
          </dd>
        </div>
        <div className="min-w-0">
          <Term icon={Phone}>Contacto</Term>
          <dd className="mt-0.5 text-ink">
            {c.contact_phone || <span className="text-ink-3">Sin teléfono publicado</span>}
            {c.contact_hours && <span className="block text-ink-2">{c.contact_hours}</span>}
          </dd>
        </div>
        {c.contact_address && (
          <div className="min-w-0">
            <Term icon={MapPin}>Dirección</Term>
            <dd className="mt-0.5 break-words text-ink">{c.contact_address}</dd>
          </div>
        )}
        {techs.length > 0 && (
          <div className="min-w-0">
            <Term icon={Cpu}>Tecnología</Term>
            <dd className="mt-0.5 text-ink">{techs.slice(0, 6).join(', ')}</dd>
          </div>
        )}
      </dl>
      <div className="flex flex-col gap-2 md:col-span-3 md:items-stretch">
        {c.slug && (
          <Button asChild variant="outline">
            <Link to={`/${countrySlug}/${c.slug}`}>Ver ficha</Link>
          </Button>
        )}
        {link && (
          <Button asChild className="h-auto min-h-11 whitespace-normal py-2 text-center">
            <a href={link.href} target="_blank" rel={link.rel} referrerPolicy="no-referrer">
              Ir al sitio de {c.name} <ExternalLink aria-hidden />
            </a>
          </Button>
        )}
      </div>
    </li>
  );
};

export default DirectoryRow;

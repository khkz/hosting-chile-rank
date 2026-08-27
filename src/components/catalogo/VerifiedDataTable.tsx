import React from 'react';
import { formatUptime } from '@/lib/uptime';
import { getProviderLink } from '@/lib/providerLinks';
import { track } from '@/lib/track';

interface VerifiedDataTableProps {
  yearFounded?: number | null;
  corporateGroup?: string | null;
  datacenter?: string | null;
  minPrice?: number | null;
  technologies?: string[] | null;
  uptimeGuarantee?: number | string | null;
  hasSslFree?: boolean | null;
  hasMigrationFree?: boolean | null;
  officialWebsite?: string | null;
  slug?: string;
}

const formatOfficialUrl = (raw: string) => {
  try {
    const u = new URL(raw);
    return { href: `${u.protocol}//${u.host}/`, label: u.host.replace(/^www\./, '') };
  } catch {
    const cleaned = raw.replace(/^https?:\/\//, '').replace(/\/$/, '');
    return { href: `https://${cleaned}/`, label: cleaned.replace(/^www\./, '') };
  }
}

const fmtPrice = (_p?: number | null) => 'Consultar en el sitio oficial';

const VerifiedDataTable: React.FC<VerifiedDataTableProps> = (props) => {
  const officialLink = props.officialWebsite
    ? (() => {
        const { label } = formatOfficialUrl(props.officialWebsite!);
        const link = getProviderLink(props.slug, props.officialWebsite);
        return (
          <a
            href={link.href}
            target="_blank"
            rel={link.rel}
            onClick={() => track('click_visitar_sitio', { slug: props.slug, location: 'ficha_verified_table' })}
            className="text-primary underline underline-offset-2 hover:opacity-80 break-all"
          >
            {label}
          </a>
        );
      })()
    : '—';

  const rows: Array<[string, React.ReactNode]> = [
    ['Sitio oficial', officialLink],
    ['Año de fundación', props.yearFounded ?? '—'],
    ['Grupo corporativo', props.corporateGroup ?? 'No declarado'],
    ['Ubicación datacenter', props.datacenter && props.datacenter.trim() ? props.datacenter : '—'],
    ['Precio desde', fmtPrice(props.minPrice)],
    [
      'Tecnologías declaradas',
      props.technologies && props.technologies.length > 0 ? props.technologies.join(', ') : '—',
    ],
    ['Garantía de uptime', formatUptime(props.uptimeGuarantee) ?? '—'],
    ['SSL gratis', props.hasSslFree ? 'Sí' : 'No declarado'],
    ['Migración gratis', props.hasMigrationFree ? 'Sí' : 'No declarado'],
  ];

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold mb-4">
        Datos declarados por el proveedor
      </h2>
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <tbody>
            {rows.map(([label, value]) => (
              <tr key={label} className="border-b last:border-0 odd:bg-muted/30">
                <th className="text-left font-medium px-4 py-3 w-1/2 md:w-1/3 align-top">{label}</th>
                <td className="px-4 py-3 text-muted-foreground align-top">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Datos declarados por el proveedor en su sitio oficial. Las fuentes concretas de cada ficha están al final de esta página.
      </p>
    </section>
  );
};

export default VerifiedDataTable;

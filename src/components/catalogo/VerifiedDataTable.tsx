import React from 'react';
import { ExternalLink } from 'lucide-react';
import { formatUptime } from '@/lib/uptime';
import { getProviderLink } from '@/lib/providerLinks';
import { track } from '@/lib/track';
import { formatCorporateGroup } from '@/lib/formatGroup';
import { formatDataDate, isoDate } from '@/lib/format';
import Callout from '@/components/system/Callout';

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
  /** Nombre del proveedor para el enlace «Ir al sitio de…». */
  name?: string;
  datacenterCertifications?: string | null;
  datacenterCertificationsSources?: string[] | null;
  correctionNote?: string | null;
  correctionDate?: string | null;
}

const hostLabel = (raw: string) => {
  try {
    return new URL(raw).host.replace(/^www\./, '');
  } catch {
    return raw.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');
  }
};

// El precio no se publica en la ficha: la base no lo trae verificado.
const PRICE_TEXT = 'Consultar en el sitio oficial';
const NOT_DECLARED = 'No declarado';

/**
 * Tabla «Datos declarados»: lo que el proveedor publica sobre su servicio.
 * La sección que la contiene lleva la etiqueta de procedencia Declarado.
 */
const VerifiedDataTable: React.FC<VerifiedDataTableProps> = (props) => {
  const officialLink = props.officialWebsite
    ? (() => {
        const link = getProviderLink(props.slug, props.officialWebsite);
        return (
          <a
            href={link.href}
            target="_blank"
            rel={link.rel}
            referrerPolicy="no-referrer"
            onClick={() => track('click_visitar_sitio', { slug: props.slug, location: 'ficha_verified_table' })}
            className="inline-flex items-center gap-1 break-all font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
          >
            {hostLabel(props.officialWebsite)}
            <ExternalLink className="h-3.5 w-3.5 shrink-0 text-ink-2" aria-hidden />
            <span className="sr-only">(ir al sitio de {props.name ?? 'este proveedor'})</span>
          </a>
        );
      })()
    : NOT_DECLARED;

  const triState = (v?: boolean | null) => (v === true ? 'Sí' : v === false ? 'No' : NOT_DECLARED);

  const certSources = (props.datacenterCertificationsSources ?? []).filter(Boolean);
  const certCell: React.ReactNode =
    props.datacenterCertifications && certSources.length > 0 ? (
      <>
        {props.datacenterCertifications}
        <span className="mt-1 block t-meta">
          Fuente:{' '}
          {certSources.map((u, i) => (
            <React.Fragment key={u}>
              {i > 0 && ', '}
              <a href={u} target="_blank" rel="nofollow noopener" className="break-all underline underline-offset-2">
                {u.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            </React.Fragment>
          ))}
        </span>
      </>
    ) : (
      'No publicada en su sitio'
    );

  const rows: Array<[string, React.ReactNode]> = [
    ['Sitio oficial', officialLink],
    ['Año de fundación', props.yearFounded ?? NOT_DECLARED],
    ['Grupo corporativo', props.corporateGroup ? formatCorporateGroup(props.corporateGroup) : NOT_DECLARED],
    ['Ubicación del datacenter', props.datacenter && props.datacenter.trim() ? props.datacenter : NOT_DECLARED],
    ['Certificaciones del datacenter', certCell],
    ['Precio desde', PRICE_TEXT],
    [
      'Tecnologías declaradas',
      props.technologies && props.technologies.length > 0 ? props.technologies.join(', ') : NOT_DECLARED,
    ],
    ['Garantía de uptime', formatUptime(props.uptimeGuarantee) ?? NOT_DECLARED],
    ['SSL gratis', triState(props.hasSslFree)],
    ['Migración gratis', triState(props.hasMigrationFree)],
  ];

  return (
    <div>
      {props.correctionNote && (
        <Callout tone="caution" title="Nota de corrección" className="mt-0">
          <p>
            {props.correctionDate && (
              <>
                <time dateTime={isoDate(props.correctionDate)}>{formatDataDate(props.correctionDate)}</time>.{' '}
              </>
            )}
            {props.correctionNote}
          </p>
        </Callout>
      )}
      <table className="w-full border-t-2 border-ink text-left t-small">
        <caption className="sr-only">Datos que declara el proveedor</caption>
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label} className="border-b border-rule align-top">
              <th scope="row" className="w-[42%] py-3 pr-4 font-normal text-ink-2 md:w-1/3">
                {label}
              </th>
              <td className="py-3 text-ink [overflow-wrap:anywhere]">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VerifiedDataTable;

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { getProviderLink } from '@/lib/providerLinks';
import { formatCorporateGroup } from '@/lib/formatGroup';
import { formatDataDate, formatInteger, formatMs, isoDate } from '@/lib/format';

/**
 * Bloques de la ficha de proveedor por país (/pe/:slug y demás ediciones).
 * Separados de CountryProviderDetail para mantener cada archivo bajo 400 líneas.
 */

const linkClass = 'font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink';

/** Tabla clave-valor del sistema: regla de 2 px arriba y filas con regla. */
export const KeyValueTable: React.FC<{ caption: string; rows: Array<[string, React.ReactNode]> }> = ({ caption, rows }) => (
  <table className="w-full border-t-2 border-ink text-left t-small">
    <caption className="sr-only">{caption}</caption>
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
);

interface CountryCompany {
  slug: string;
  name: string;
  website: string | null;
  legal_name?: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  contact_address: string | null;
  contact_hours: string | null;
  datacenter_location?: string | null;
  year_founded?: number | null;
  corporate_group: string | null;
}

/** «Datos declarados»: lo que el proveedor publica sobre sí mismo. */
export const DeclaredData: React.FC<{ company: CountryCompany; idFiscal: string | null; techs: string[] }> = ({
  company,
  idFiscal,
  techs,
}) => {
  const link = getProviderLink(company.slug, company.website);
  const rows: Array<[string, React.ReactNode]> = [];
  if (company.legal_name) rows.push(['Razón social', company.legal_name]);
  if (idFiscal) rows.push(['Identificador fiscal', <span className="tabular">{idFiscal}</span>]);
  if (company.website)
    rows.push([
      'Sitio web',
      <a href={link.href} target="_blank" rel={link.rel} referrerPolicy="no-referrer" className={`inline-flex items-center gap-1 ${linkClass}`}>
        {company.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-ink-2" aria-hidden />
        <span className="sr-only">(ir al sitio de {company.name})</span>
      </a>,
    ]);
  if (company.contact_phone)
    rows.push(['Teléfono', <a className={linkClass} href={`tel:${company.contact_phone}`}>{company.contact_phone}</a>]);
  if (company.contact_email)
    rows.push(['Correo', <a className={`break-all ${linkClass}`} href={`mailto:${company.contact_email}`}>{company.contact_email}</a>]);
  if (company.contact_address) rows.push(['Dirección', company.contact_address]);
  if (company.contact_hours) rows.push(['Horario', company.contact_hours]);
  rows.push(['Datacenter', company.datacenter_location || 'No lo declara']);
  rows.push(['Año de fundación', company.year_founded ? <span className="tabular">{company.year_founded}</span> : 'No lo declara']);
  if (company.corporate_group) rows.push(['Grupo corporativo', formatCorporateGroup(company.corporate_group)]);
  if (techs.length > 0) rows.push(['Tecnologías', techs.join(', ')]);
  return <KeyValueTable caption={`Datos que declara ${company.name}`} rows={rows} />;
};

export interface SiteCheck {
  resolved_ip?: string | null;
  asn?: string | number | null;
  asn_org?: string | null;
  ssl_issuer?: string | null;
  ssl_valid_to?: string | null;
  ttfb_ms?: number | null;
  http_status?: number | null;
  checked_at?: string | null;
}

/** «Verificación técnica»: lo que medimos nosotros desde el sitio oficial. */
export const TechnicalCheck: React.FC<{ check: SiteCheck }> = ({ check }) => {
  const rows: Array<[string, React.ReactNode]> = [];
  if (check.resolved_ip) rows.push(['IP del sitio', <span className="tabular">{check.resolved_ip}</span>]);
  if (check.asn) rows.push(['ASN', `${check.asn}${check.asn_org ? ` (${check.asn_org})` : ''}`]);
  if (check.ssl_issuer) rows.push(['Certificado SSL', `Emitido por ${check.ssl_issuer}`]);
  if (check.ssl_valid_to)
    rows.push(['SSL vigente hasta', <time dateTime={isoDate(check.ssl_valid_to)}>{formatDataDate(check.ssl_valid_to)}</time>]);
  if (typeof check.ttfb_ms === 'number') rows.push(['TTFB medido', <span className="tabular">{formatMs(check.ttfb_ms)}</span>]);
  if (typeof check.http_status === 'number') rows.push(['Estado HTTP', <span className="tabular">{check.http_status}</span>]);
  return (
    <div>
      {rows.length > 0 ? (
        <KeyValueTable caption="Mediciones técnicas del sitio oficial" rows={rows} />
      ) : (
        <p className="t-small text-ink-2">La última medición no devolvió datos técnicos.</p>
      )}
      <p className="mt-3 max-w-[62ch] t-meta">
        {check.checked_at ? (
          <>
            Medición automática del <time dateTime={isoDate(check.checked_at)}>{formatDataDate(check.checked_at)}</time>, hecha
            desde el sitio oficial del proveedor.
          </>
        ) : (
          'Medición automática hecha desde el sitio oficial del proveedor.'
        )}
      </p>
    </div>
  );
};

/** Reclamos verificados desde la fecha de inicio del registro público. */
export const Complaints: React.FC<{ name: string; count: number; since: string }> = ({ name, count, since }) => (
  <div className="max-w-[62ch]">
    <p className="t-body text-ink">
      <strong className="tabular font-semibold">{formatInteger(count)}</strong>{' '}
      {count === 1 ? 'reclamo verificado' : 'reclamos verificados'} sobre {name} desde el{' '}
      <time dateTime={isoDate(since)}>{formatDataDate(since)}</time>.
    </p>
    <p className="mt-2 t-small text-ink-2">
      Los reclamos se verifican por correo antes de publicarse.{' '}
      <Link to="/reclamos" className={linkClass}>
        Reportar un problema
      </Link>
    </p>
  </div>
);

/** Preguntas frecuentes: los mismos textos que el JSON-LD FAQPage de la página. */
export const FaqList: React.FC<{ items: Array<{ q: string; a: string }> }> = ({ items }) => (
  <dl className="max-w-[72ch] divide-y divide-rule border-y-2 border-y-ink [&>div:last-child]:border-b-0">
    {items.map((f) => (
      <div key={f.q} className="py-4">
        <dt className="font-semibold text-ink">{f.q}</dt>
        <dd className="mt-1.5 t-body text-ink-2">{f.a}</dd>
      </div>
    ))}
  </dl>
);

interface Alternative {
  slug: string;
  name: string;
  datacenter_location: string | null;
}

/** Alternativas del mismo país, con el enlace a la comparación directa. */
export const Alternatives: React.FC<{
  company: { slug: string; name: string };
  items: Alternative[];
  countrySlug: string;
  isLocalDc: (loc?: string | null) => boolean;
}> = ({ company, items, countrySlug, isLocalDc }) => (
  <ul className="grid gap-4 md:grid-cols-2">
    {items.map((a) => {
      const pair = company.slug < a.slug ? `${company.slug}-vs-${a.slug}` : `${a.slug}-vs-${company.slug}`;
      return (
        <li key={a.slug} className="rounded-xl border border-rule bg-white p-5">
          <Link to={`/${countrySlug}/${a.slug}`} className={`text-base ${linkClass}`}>
            {a.name}
          </Link>
          <p className="mt-1 t-small text-ink-2">
            {isLocalDc(a.datacenter_location)
              ? `Datacenter local (${a.datacenter_location})`
              : a.datacenter_location || 'Datacenter no publicado'}
          </p>
          <Link
            to={`/${countrySlug}/comparativa/${pair}`}
            className="mt-3 inline-flex min-h-[44px] items-center gap-1.5 t-small font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink md:min-h-0"
          >
            Comparar {company.name} vs {a.name}
            <ArrowRight className="h-4 w-4 shrink-0 text-ink-2" aria-hidden />
          </Link>
        </li>
      );
    })}
  </ul>
);

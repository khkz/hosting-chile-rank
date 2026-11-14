import React from 'react';
import { Link } from 'react-router-dom';
import { ProvenanceTag } from '@/components/data/Provenance';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatShortDate, isoDate } from '@/lib/format';

export interface DcProvider {
  id: string;
  slug: string;
  name: string;
  legal_name?: string | null;
  datacenter_location?: string | null;
  year_founded?: number | null;
}

export interface SiteCheck {
  asn?: string | null;
  asn_org?: string | null;
  resolved_ip?: string | null;
  checked_at?: string | null;
}

const MeasuredOn: React.FC<{ at?: string | null }> = ({ at }) =>
  at ? (
    <span className="t-meta block">
      Medido el{' '}
      <time dateTime={isoDate(at)} className="whitespace-nowrap">
        {formatShortDate(at)}
      </time>
    </span>
  ) : null;

/**
 * ASN medido de la IP del sitio oficial, con su fecha. Si hubo medición sin
 * ASN, se dice así (no «sin medir»); sin medición, «Sin medir».
 */
const AsnValue: React.FC<{ check?: SiteCheck }> = ({ check }) =>
  check?.asn ? (
    <span className="min-w-0">
      <span className="block font-medium text-ink">
        {check.asn}
        {check.asn_org ? <span className="font-normal text-ink-2"> {check.asn_org}</span> : null}
      </span>
      {check.resolved_ip && <span className="t-meta block break-all">IP {check.resolved_ip}</span>}
      <MeasuredOn at={check.checked_at} />
    </span>
  ) : check ? (
    <span className="min-w-0">
      <span className="block text-ink-2">Sin ASN detectado</span>
      <MeasuredOn at={check.checked_at} />
    </span>
  ) : (
    <span className="text-ink-3">Sin medir</span>
  );

const Since: React.FC<{ year?: number | null }> = ({ year }) =>
  year ? <span className="tabular">{year}</span> : <span className="text-ink-3">Sin dato</span>;

/**
 * Proveedores que declaran datacenter en el país: tabla del sistema desde
 * 1024 px y lista apilada antes. El datacenter es Declarado; el ASN, Medido.
 */
const DcLocalList: React.FC<{ providers: DcProvider[]; checks?: Map<string, SiteCheck>; countrySlug: string }> = ({
  providers,
  checks,
  countrySlug,
}) => (
  <>
    <div className="hidden lg:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-0">Proveedor</TableHead>
            <TableHead>
              <span className="inline-flex flex-wrap items-center gap-2">
                Datacenter declarado <ProvenanceTag kind="declared" />
              </span>
            </TableHead>
            <TableHead>
              <span className="inline-flex flex-wrap items-center gap-2">
                ASN de su sitio <ProvenanceTag kind="measured" />
              </span>
            </TableHead>
            <TableHead className="text-right">Desde</TableHead>
            <TableHead className="pr-0">
              <span className="sr-only">Ficha</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {providers.map((p) => (
            <TableRow key={p.id} className="align-top">
              <TableCell className="w-[22%] pl-0 align-top">
                <Link to={`/${countrySlug}/${p.slug}`} className="font-semibold text-ink underline-offset-4 hover:underline">
                  {p.name}
                </Link>
                {p.legal_name && <span className="t-meta block">{p.legal_name}</span>}
              </TableCell>
              <TableCell className="w-[38%] align-top text-ink-2">{p.datacenter_location}</TableCell>
              <TableCell className="align-top">
                <AsnValue check={checks?.get(p.id)} />
              </TableCell>
              <TableCell className="text-right align-top">
                <Since year={p.year_founded} />
              </TableCell>
              <TableCell className="pr-0 text-right align-top">
                <Button asChild variant="outline" size="sm">
                  <Link to={`/${countrySlug}/${p.slug}`}>
                    Ver ficha<span className="sr-only"> de {p.name}</span>
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

    <ul className="divide-y divide-rule border-y-2 border-ink lg:hidden">
      {providers.map((p) => (
        <li key={p.id} className="py-5">
          <h3 className="t-h3 text-ink">{p.name}</h3>
          {p.legal_name && <p className="t-meta">{p.legal_name}</p>}
          <dl className="t-small mt-3 grid gap-3 sm:grid-cols-2">
            <div className="min-w-0 sm:col-span-2">
              <dt className="t-meta flex items-center gap-1.5">
                Datacenter <ProvenanceTag kind="declared" variant="glyph" />
              </dt>
              <dd className="text-ink">{p.datacenter_location}</dd>
            </div>
            <div className="min-w-0">
              <dt className="t-meta flex items-center gap-1.5">
                ASN de su sitio <ProvenanceTag kind="measured" variant="glyph" />
              </dt>
              <dd>
                <AsnValue check={checks?.get(p.id)} />
              </dd>
            </div>
            <div>
              <dt className="t-meta">Desde</dt>
              <dd className="text-ink">
                <Since year={p.year_founded} />
              </dd>
            </div>
          </dl>
          <Button asChild variant="outline" className="mt-4 w-full sm:w-auto">
            <Link to={`/${countrySlug}/${p.slug}`}>
              Ver ficha<span className="sr-only"> de {p.name}</span>
            </Link>
          </Button>
        </li>
      ))}
    </ul>
  </>
);

export default DcLocalList;

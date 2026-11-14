import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProvenanceLegend, ProvenanceTag } from '@/components/data/Provenance';
import { ASN_CHECKED_AT, DC_QUALITY_TEXT, classifyDc, dcIssuer, dcLocationView, type DcClass } from '@/lib/dcTier';
import { formatDataDate } from '@/lib/format';

type CountrySlug = 'pe' | 'mx' | 'co' | 'ar';

export interface CountryRow {
  id: string;
  slug: string;
  name: string;
  legal_name?: string | null;
  datacenter_location?: string | null;
  year_founded?: number | null;
}

interface CountryDcTableProps {
  rows: CountryRow[];
  slug: CountrySlug;
  countryName: string;
}

/** Ubicación: resumen, lo que declara el proveedor y lo que medimos de su IP. */
const LocationCell: React.FC<{ dc: DcClass; countryName: string }> = ({ dc, countryName }) => {
  const v = dcLocationView(dc, countryName);
  return (
    <div className="min-w-0">
      <p className="font-semibold text-ink">{v.status}</p>
      {v.declared ? (
        <p className="mt-1 flex gap-2 text-sm leading-snug text-ink-2">
          <ProvenanceTag kind="declared" variant="glyph" className="mt-[5px] self-start" />
          <span className="min-w-0">{v.declared}</span>
        </p>
      ) : (
        <p className="mt-1 text-sm text-ink-3">No lo declara</p>
      )}
      {v.measured && (
        <p className="mt-1 flex gap-2 text-sm leading-snug text-ink-2">
          <ProvenanceTag kind="measured" variant="glyph" className="mt-[5px] self-start" />
          <span className="min-w-0">{v.measured}</span>
        </p>
      )}
    </div>
  );
};

/**
 * Certificación como texto: las cuatro categorías que explican el orden y,
 * en toda afirmación de certificación, el emisor solo si la declaración lo nombra.
 */
const CertCell: React.FC<{ dc: DcClass }> = ({ dc }) => {
  const claims = dc.quality === 'tier_certified' || dc.quality === 'self_declared';
  const issuer = dcIssuer(dc);
  return (
    <div>
      <p className="font-semibold text-ink">{DC_QUALITY_TEXT[dc.quality]}</p>
      {claims && <p className="mt-1 text-sm text-ink-2">{issuer ? `Emisor: ${issuer}` : 'Emisor sin dato'}</p>}
    </div>
  );
};

const FichaLink: React.FC<{ to: string; name: string; className?: string }> = ({ to, name, className }) => (
  <Button asChild variant="outline" size="sm" className={className}>
    <Link to={to} aria-label={`Ver ficha de ${name}`}>
      Ver ficha
    </Link>
  </Button>
);

/**
 * Tabla de un país sin notas: datacenter (con procedencia) y certificación
 * en columnas separadas. En móvil pasa a lista. No cambia el orden recibido.
 */
const CountryDcTable: React.FC<CountryDcTableProps> = ({ rows, slug, countryName }) => {
  const items = rows.map((p) => ({ p, dc: classifyDc(p, slug) }));
  const hasYears = rows.some((p) => p.year_founded);

  return (
    <>
      {/* Escritorio: tabla */}
      <table className="hidden w-full border-collapse text-left text-[15px] md:table">
        <caption className="sr-only">
          Proveedores de {countryName} en el orden del ranking, con datacenter, certificación y enlace a su ficha
        </caption>
        <thead>
          <tr className="border-b-2 border-ink text-[13px] text-ink-2">
            <th scope="col" className="w-16 py-2.5 pr-3 font-semibold">Puesto</th>
            <th scope="col" className="py-2.5 pr-4 font-semibold">Proveedor</th>
            <th scope="col" className="py-2.5 pr-4 font-semibold">Datacenter</th>
            <th scope="col" className="py-2.5 pr-4 font-semibold">Certificación</th>
            {hasYears && <th scope="col" className="py-2.5 pr-4 font-semibold">Antigüedad</th>}
            <th scope="col" className="py-2.5 font-semibold">
              <span className="sr-only">Ficha</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map(({ p, dc }, i) => (
            <tr key={p.id} className="border-b border-rule align-top">
              <td className="py-4 pr-3 text-xl font-bold text-ink-3 tabular">{i + 1}</td>
              <th scope="row" className="py-4 pr-4 text-left font-semibold text-ink md:w-[24%]">
                <Link to={`/${slug}/${p.slug}`} className="underline-offset-4 hover:underline">
                  {p.name}
                </Link>
                <span className="mt-1 block text-sm font-normal leading-snug text-ink-2">
                  {p.legal_name || 'Razón social sin dato'}
                </span>
              </th>
              <td className="py-4 pr-4 md:w-[36%]">
                <LocationCell dc={dc} countryName={countryName} />
              </td>
              <td className="py-4 pr-4">
                <CertCell dc={dc} />
              </td>
              {hasYears && <td className="py-4 pr-4 tabular text-ink">{p.year_founded ?? 'Sin dato'}</td>}
              <td className="py-4 text-right">
                <FichaLink to={`/${slug}/${p.slug}`} name={p.name} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Móvil: lista */}
      <ol className="divide-y divide-rule border-y-2 border-ink md:hidden">
        {items.map(({ p, dc }, i) => (
          <li key={p.id} className="py-5">
            <div className="flex items-baseline gap-3">
              <span className="w-7 shrink-0 text-xl font-bold text-ink-3 tabular">{i + 1}</span>
              <div className="min-w-0">
                <p className="font-semibold text-ink">{p.name}</p>
                <p className="mt-0.5 text-sm leading-snug text-ink-2">{p.legal_name || 'Razón social sin dato'}</p>
              </div>
            </div>
            <dl className="ml-10 mt-3 space-y-3">
              <div>
                <dt className="t-label">Datacenter</dt>
                <dd className="mt-1">
                  <LocationCell dc={dc} countryName={countryName} />
                </dd>
              </div>
              <div>
                <dt className="t-label">Certificación</dt>
                <dd className="mt-1">
                  <CertCell dc={dc} />
                </dd>
              </div>
              {hasYears && (
                <div>
                  <dt className="t-label">Antigüedad</dt>
                  <dd className="mt-1 tabular text-ink">{p.year_founded ?? 'Sin dato'}</dd>
                </div>
              )}
            </dl>
            <div className="ml-10 mt-4">
              <FichaLink to={`/${slug}/${p.slug}`} name={p.name} className="h-11 w-full" />
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-8 border-t border-rule pt-6">
        <ProvenanceLegend compact />
        <p className="t-meta mt-5 measure">
          La IP de cada sitio se cruzó con su red (ASN)
          {ASN_CHECKED_AT ? ` el ${formatDataDate(ASN_CHECKED_AT)}` : ''}. Si la IP es de una CDN, no muestra
          dónde está el servidor de origen. La certificación lleva emisor solo cuando la declaración del proveedor lo
          nombra.
        </p>
      </div>
    </>
  );
};

export default CountryDcTable;

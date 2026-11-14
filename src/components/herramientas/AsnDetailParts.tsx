import React from 'react';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ProvenanceTag } from '@/components/data/Provenance';
import { ReverseIpLookup } from '@/components/ReverseIpLookup';
import { formatInteger, formatScore } from '@/lib/format';
import type { ASNPrefix } from '@/services/asnApi';
import type { HostingASNMapping } from '@/services/hostingASNService';
import { fixMojibake } from './asnText';

const linkClass = 'text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink';

/** Tabla de prefijos (primeros 100) con «Ver sitios» en rangos /24 o menores. */
export const AsnPrefixTable: React.FC<{ prefixes: ASNPrefix[]; label: string }> = ({ prefixes, label }) => (
  <div>
    <Table>
      <caption className="sr-only">{label}</caption>
      <TableHeader>
        <TableRow>
          <TableHead>Prefijo</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead>País</TableHead>
          <TableHead>Sitios web</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {prefixes.slice(0, 100).map((p, idx) => {
          const desc = fixMojibake(p.description);
          return (
            <TableRow key={`${p.prefix}-${idx}`}>
              <TableCell className="whitespace-nowrap font-semibold">{p.prefix}</TableCell>
              <TableCell className="max-w-[480px] truncate text-ink-2" title={desc}>{desc || 'Sin descripción'}</TableCell>
              <TableCell>{p.country_code || 'Sin dato'}</TableCell>
              <TableCell><ReverseIpLookup prefix={p.prefix} /></TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
    {prefixes.length > 100 && <p className="t-meta mt-2">Mostrando los primeros 100 prefijos.</p>}
    {prefixes.length === 0 && <p className="t-small mt-3 text-ink-2">Este ASN no anuncia prefijos de este tipo.</p>}
  </div>
);

/** Los 10 rangos IPv4 más grandes. Barras en tinta: el rojo es solo del puesto 1. */
export const AsnPrefixChart: React.FC<{ data: { prefix: string; size: number }[] }> = ({ data }) => (
  <div className="h-80 text-ink [&_.recharts-cartesian-axis-tick_text]:fill-ink-3 [&_.recharts-cartesian-grid_line]:stroke-rule">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="prefix" hide />
        <YAxis tickFormatter={(v) => formatInteger(v)} width={80} />
        <Tooltip formatter={(v: number) => [`${formatInteger(v)} IP`, 'Tamaño']} labelFormatter={(l) => `Prefijo ${l}`} />
        <Bar dataKey="size" name="IP" fill="currentColor" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

/** Panel del proveedor de hosting asociado al ASN (nota escrita a mano: Editorial). */
export const AsnProviderPanel: React.FC<{
  asn: number;
  company: HostingASNMapping | null;
  isHostingClass: boolean;
  onReview: (slug: string) => void;
}> = ({ asn, company, isHostingClass, onReview }) => {
  if (company) {
    return (
      <div className="flex flex-col gap-4 rounded-xl border border-rule bg-white p-5 md:flex-row md:items-center">
        {company.companyLogo && <img src={company.companyLogo} alt={`Logo de ${company.hostingCompany}`} className="h-12 w-auto self-start object-contain" />}
        <div className="min-w-0 flex-1">
          <p className="t-label flex items-center gap-2"><Building aria-hidden className="h-4 w-4 text-ink-2" />Panel del proveedor</p>
          <h2 className="t-h3 mt-1 text-ink">{company.hostingCompany}</h2>
          {company.companyRating && (
            <p className="t-small mt-1 flex flex-wrap items-center gap-2 text-ink-2">
              <span className="tabular font-semibold text-ink">{formatScore(company.companyRating)}/5</span>
              <ProvenanceTag kind="editorial" />
              <span>Proveedor verificado</span>
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          {company.companySlug && (
            <Button variant="default" onClick={() => onReview(company.companySlug!)}>Ver reseña</Button>
          )}
          <Button asChild variant="outline">
            <Link to={`/cotiza-hosting?utm_source=asn&utm_campaign=${asn}&provider=${company.companySlug || company.hostingCompany}`}>Cotizar hosting</Link>
          </Button>
        </div>
      </div>
    );
  }
  if (!isHostingClass) return null;
  return (
    <div className="rounded-xl border border-rule bg-paper p-5">
      <h2 className="t-h3 text-ink">¿Buscas hosting?</h2>
      <p className="t-small mt-1 text-ink-2">Este ASN pertenece a un proveedor de hosting. Encuentra la mejor opción para tu proyecto.</p>
      <Button asChild variant="outline" size="sm" className="mt-3 h-11 sm:h-9">
        <Link to={`/cotiza-hosting?utm_source=asn&utm_campaign=${asn}`}>Cotiza gratis</Link>
      </Button>
    </div>
  );
};

/** Enlaces internos al pie de la ficha de ASN. */
export const AsnRelatedLinks: React.FC<{ isChilean: boolean }> = ({ isChilean }) => {
  const links = [
    { to: '/ranking', label: 'Ver el ranking de hosting en Chile' },
    { to: '/wiki/asn', label: '¿Qué es un ASN?' },
    { to: '/mejor-hosting-chile-2025', label: 'Mejor hosting en Chile' },
    ...(isChilean ? [{ to: '/asn/chile', label: 'Ver todos los ASN chilenos' }] : []),
    { to: '/guia-elegir-hosting', label: 'Guía para elegir hosting' },
    { to: '/wiki', label: 'Wiki de términos técnicos' },
  ];
  return (
    <section aria-labelledby="aprende-mas" className="border-t border-rule pt-10">
      <h2 id="aprende-mas" className="t-h2 text-ink">Aprende más sobre hosting en Chile</h2>
      <p className="t-body mt-3 text-ink-2">Descubre las mejores opciones de hosting y aprende conceptos clave para optimizar tu presencia web.</p>
      <ul className="mt-5 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((l) => (
          <li key={l.to}><Link to={l.to} className={`${linkClass} inline-flex min-h-11 items-center`}>{l.label}</Link></li>
        ))}
      </ul>
    </section>
  );
};

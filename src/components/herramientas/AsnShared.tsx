import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ProvenanceTag } from '@/components/data/Provenance';
import type { ASNSearchResult } from '@/services/asnApi';
import { fixMojibake, isChileanResult } from './asnText';

/**
 * Fuente y vigencia de los datos de ASN. asnApi no devuelve la fecha exacta
 * de la copia guardada: se informa la fuente y cuánto puede durar esa copia.
 */
export const AsnSourceLine: React.FC<{ cacheDays: number }> = ({ cacheDays }) => (
  <>
    <ProvenanceTag kind="measured" />
    <span>
      Fuente: BGPView (registro público de rutas BGP). Se consulta al abrir la página; la copia guardada dura hasta {cacheDays} días.
    </span>
  </>
);

const linkClass = 'font-semibold text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink';

/** Resultados de ASN: lista en móvil, tabla en escritorio. */
export const AsnResultsTable: React.FC<{ results: ASNSearchResult[]; caption: string }> = ({ results, caption }) => (
  <>
    <ul className="divide-y divide-rule border-y border-rule md:hidden">
      {results.map((r) => (
        <li key={r.asn} className="py-3">
          <Link to={`/asn/AS${r.asn}`} className={`${linkClass} inline-flex min-h-11 items-center`}>
            AS{r.asn} {fixMojibake(r.name)}
          </Link>
          <p className="t-small text-ink-2">{fixMojibake(r.description) || 'Proveedor de red'}</p>
          <div className="t-meta mt-1 flex flex-wrap items-center gap-2">
            {r.country_code && <span>País: {r.country_code}</span>}
            {isChileanResult(r) && <Badge variant="outline">Chile</Badge>}
          </div>
        </li>
      ))}
    </ul>
    <div className="hidden md:block">
      <Table>
        <caption className="sr-only">{caption}</caption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-28">ASN</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead className="w-24">País</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((r) => (
            <TableRow key={r.asn}>
              <TableCell>
                <Link to={`/asn/AS${r.asn}`} className={linkClass}>
                  AS{r.asn}
                </Link>
              </TableCell>
              <TableCell className="font-semibold">{fixMojibake(r.name) || 'Sin nombre'}</TableCell>
              <TableCell className="text-ink-2">{fixMojibake(r.description) || 'Proveedor de red'}</TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-2">
                  {r.country_code || 'Sin dato'}
                  {isChileanResult(r) && r.country_code !== 'CL' && <Badge variant="outline">Chile</Badge>}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </>
);

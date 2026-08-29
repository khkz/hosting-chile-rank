import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Server } from 'lucide-react';
import { PROVIDERS } from '@/data/estudio2026';
import { PRICING_FOOTNOTE } from '@/data/verified2026';

/** Fichas detalladas de los 11 proveedores del estudio. */
export const EstudioFichas: React.FC = () => (
  <div className="space-y-6">
    {PROVIDERS.map((p) => (
      <Card key={p.rank} className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="text-xl font-bold">
              <span className="text-muted-foreground mr-2">#{p.rank}</span>
              {p.name}
            </h3>
            {p.legal && (
              <p className="text-sm text-muted-foreground mt-1">
                {p.legal}
                {p.rut && ` · RUT ${p.rut}`}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {p.type === 'cl-asn' && (
              <Badge className="bg-green-600 hover:bg-green-700">
                <Server className="w-3 h-3 mr-1" /> ASN chileno asignado
              </Badge>
            )}
            {p.type === 'cl-no-asn' && <Badge variant="destructive">Sin ASN propio</Badge>}
            {p.type === 'intl' && <Badge variant="secondary">Internacional</Badge>}
          </div>
        </div>

        <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm mb-4">
          {p.asn && (
            <>
              <dt className="font-semibold">ASN</dt>
              <dd className="font-mono text-xs">
                {p.asn} {p.asnPrefixes && `· ${p.asnPrefixes}`}
              </dd>
            </>
          )}
          <dt className="font-semibold">Instalación</dt>
          <dd>{p.dc}</dd>
          {p.panel && (
            <>
              <dt className="font-semibold">Panel</dt>
              <dd>{p.panel}</dd>
            </>
          )}
          {p.shared && (
            <>
              <dt className="font-semibold">Precio de entrada (anualizado)</dt>
              <dd>
                {p.shared}
                {p.sharedNote && (
                  <span className="block text-xs text-muted-foreground mt-0.5">{p.sharedNote}</span>
                )}
              </dd>
            </>
          )}
          {p.phone && (
            <>
              <dt className="font-semibold">Soporte</dt>
              <dd>{p.phone}</dd>
            </>
          )}
          <dt className="font-semibold">Diferenciadores</dt>
          <dd>{p.diff}</dd>
          <dt className="font-semibold">Reputación pública</dt>
          <dd>{p.reputation}</dd>
        </dl>

        {p.affiliateNote && (
          <div className="mb-3 p-3 bg-amber-50 dark:bg-amber-950/30 border-l-4 border-l-amber-500 rounded-r text-sm">
            <strong className="text-amber-700 dark:text-amber-400">⚠ Canal afiliado relacionado:</strong>{' '}
            {p.affiliateNote}
          </div>
        )}

        {p.innovations && (
          <div className="mb-3 p-3 bg-primary/5 border-l-4 border-l-primary rounded-r text-sm">
            <strong className="text-primary">{p.innovations.title}:</strong>
            <ul className="mt-2 space-y-1.5">
              {p.innovations.items.map((it) => (
                <li key={it.label}>
                  <a href={it.url} target="_blank" rel="noopener noreferrer nofollow" className="font-semibold underline">
                    {it.label}
                  </a>{' '}
                  — {it.desc}
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-sm italic text-muted-foreground border-t pt-3">
          <strong className="not-italic text-foreground">Nota crítica:</strong> {p.critical}
        </p>
      </Card>
    ))}
    <p className="text-xs text-muted-foreground">{PRICING_FOOTNOTE}</p>
  </div>
);

/** Tabla comparativa general del estudio. */
export const EstudioTablaGeneral: React.FC = () => (
  <>
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-muted">
          <tr>
            <th className="text-left p-3 border-b">#</th>
            <th className="text-left p-3 border-b">Proveedor</th>
            <th className="text-left p-3 border-b">ASN</th>
            <th className="text-left p-3 border-b">Instalación en Chile</th>
            <th className="text-left p-3 border-b">Precio de entrada (anualizado)</th>
            <th className="text-left p-3 border-b">Tipo</th>
          </tr>
        </thead>
        <tbody className="[&>tr:nth-child(even)]:bg-muted/30">
          {PROVIDERS.map((p) => (
            <tr key={p.rank}>
              <td className="p-3">{p.rank}</td>
              <td className="p-3 font-medium">{p.name}</td>
              <td className="p-3 font-mono text-xs">{p.asn ?? '—'}</td>
              <td className="p-3">
                {p.dcTenancy === 'propio'
                  ? 'Propio'
                  : p.dcTenancy === 'colocation'
                  ? 'Colocation (terceros)'
                  : p.dcTenancy === 'declarado'
                  ? 'Declarada por el proveedor'
                  : 'No (extranjero)'}
              </td>
              <td className="p-3">{p.shared ?? '—'}</td>
              <td className="p-3 text-xs">
                {p.type === 'cl-asn' ? 'Chileno c/ASN' : p.type === 'cl-no-asn' ? 'Chileno s/ASN' : 'Internacional'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p className="text-xs text-muted-foreground mt-3">{PRICING_FOOTNOTE}</p>
  </>
);

export default EstudioFichas;

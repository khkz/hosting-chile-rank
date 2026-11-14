import React from 'react';
import { Server } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Callout from '@/components/system/Callout';
import { ProvenanceTag } from '@/components/data/Provenance';
import { PROVIDERS, type Provider } from '@/data/estudio2026';
import { PRICING_FOOTNOTE } from '@/data/verified2026';

const TYPE_LABEL: Record<Provider['type'], string> = {
  'cl-asn': 'ASN chileno asignado',
  'cl-no-asn': 'Sin ASN propio',
  intl: 'Internacional',
};

const TENANCY_LABEL = (t: Provider['dcTenancy']) =>
  t === 'propio' ? 'Propio' : t === 'colocation' ? 'Colocation (terceros)' : t === 'declarado' ? 'Declarada por el proveedor' : 'No (extranjero)';

const SHORT_TYPE: Record<Provider['type'], string> = {
  'cl-asn': 'Chileno c/ASN',
  'cl-no-asn': 'Chileno s/ASN',
  intl: 'Internacional',
};

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="grid gap-1 py-2.5 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-4">
    <dt className="t-label">{label}</dt>
    <dd className="t-small min-w-0 text-ink">{children}</dd>
  </div>
);

/** Fichas detalladas de los 11 proveedores del estudio. */
export const EstudioFichas: React.FC = () => (
  <div className="space-y-6">
    <p className="t-meta flex flex-wrap items-center gap-x-4 gap-y-1">
      <span className="inline-flex items-center gap-1.5">
        ASN y prefijos <ProvenanceTag kind="measured" />
      </span>
      <span className="inline-flex items-center gap-1.5">
        Precio de entrada <ProvenanceTag kind="declared" />
      </span>
    </p>
    {PROVIDERS.map((p) => (
      <article key={p.rank} className="rounded-xl border border-rule bg-white p-5 md:p-6">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="t-h3 text-ink">
              <span className="tabular mr-2 text-ink-3">#{p.rank}</span>
              {p.name}
            </h3>
            {p.legal && (
              <p className="t-meta mt-1">
                {p.legal}
                {p.rut && <span className="ml-3">RUT {p.rut}</span>}
              </p>
            )}
          </div>
          <Badge variant="outline">
            {p.type === 'cl-asn' && <Server className="h-3.5 w-3.5" aria-hidden />}
            {TYPE_LABEL[p.type]}
          </Badge>
        </header>

        <dl className="mt-4 divide-y divide-rule border-y border-rule">
          {p.asn && (
            <Row label="ASN">
              <span className="inline-flex items-center gap-1.5 tabular">
                {p.asn}
                <ProvenanceTag kind="measured" variant="glyph" />
              </span>
              {p.asnPrefixes && <span className="mt-0.5 block text-ink-2">{p.asnPrefixes}</span>}
            </Row>
          )}
          <Row label="Instalación">{p.dc}</Row>
          {p.panel && <Row label="Panel">{p.panel}</Row>}
          {p.shared && (
            <Row label="Precio de entrada (anualizado)">
              <span className="inline-flex items-center gap-1.5">
                {p.shared}
                <ProvenanceTag kind="declared" variant="glyph" />
              </span>
              {p.sharedNote && <span className="t-meta mt-0.5 block">{p.sharedNote}</span>}
            </Row>
          )}
          {p.phone && <Row label="Soporte">{p.phone}</Row>}
          <Row label="Diferenciadores">{p.diff}</Row>
          <Row label="Reputación pública">{p.reputation}</Row>
        </dl>

        {p.affiliateNote && (
          <Callout tone="caution" title="Canal afiliado relacionado">
            <p>{p.affiliateNote}</p>
          </Callout>
        )}

        {p.innovations && (
          <Callout tone="note" title={p.innovations.title}>
            <ul className="space-y-1.5">
              {p.innovations.items.map((it) => (
                <li key={it.label}>
                  <a
                    href={it.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="font-semibold text-ink underline underline-offset-2"
                  >
                    {it.label}
                  </a>{' '}
                  — {it.desc}
                </li>
              ))}
            </ul>
          </Callout>
        )}

        <p className="t-small mt-4 text-ink-2">
          <strong className="text-ink">Nota crítica:</strong> {p.critical}
        </p>
      </article>
    ))}
    <p className="t-meta">{PRICING_FOOTNOTE}</p>
  </div>
);

/** Tabla comparativa general del estudio (lista en móvil, tabla en escritorio). */
export const EstudioTablaGeneral: React.FC = () => (
  <>
    <table className="hidden w-full border-collapse text-left text-[15px] lg:table">
      <thead>
        <tr className="border-b-2 border-ink text-[13px] text-ink-2">
          <th scope="col" className="w-10 py-2.5 pr-3 font-semibold">#</th>
          <th scope="col" className="py-2.5 pr-3 font-semibold">Proveedor</th>
          <th scope="col" className="py-2.5 pr-3 font-semibold">ASN</th>
          <th scope="col" className="py-2.5 pr-3 font-semibold">Instalación en Chile</th>
          <th scope="col" className="py-2.5 pr-3 font-semibold">Precio de entrada (anualizado)</th>
          <th scope="col" className="py-2.5 font-semibold">Tipo</th>
        </tr>
      </thead>
      <tbody>
        {PROVIDERS.map((p) => (
          <tr key={p.rank} className="border-b border-rule align-top">
            <td className="tabular py-3 pr-3 text-ink-3">{p.rank}</td>
            <th scope="row" className="py-3 pr-3 font-semibold text-ink">{p.name}</th>
            <td className="tabular py-3 pr-3 text-ink">{p.asn ?? 'sin ASN'}</td>
            <td className="py-3 pr-3 text-ink-2">{TENANCY_LABEL(p.dcTenancy)}</td>
            <td className="py-3 pr-3 text-ink">{p.shared ?? 'sin dato'}</td>
            <td className="py-3 text-ink-2">{SHORT_TYPE[p.type]}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <ol className="divide-y divide-rule border-y-2 border-ink lg:hidden">
      {PROVIDERS.map((p) => (
        <li key={p.rank} className="py-4">
          <p className="flex items-baseline gap-3">
            <span className="tabular w-6 text-ink-3">{p.rank}</span>
            <span className="font-semibold text-ink">{p.name}</span>
          </p>
          <dl className="t-small ml-9 mt-2 grid grid-cols-[8rem_minmax(0,1fr)] gap-x-3 gap-y-1">
            <dt className="text-ink-3">ASN</dt>
            <dd className="tabular text-ink">{p.asn ?? 'sin ASN'}</dd>
            <dt className="text-ink-3">Instalación</dt>
            <dd className="text-ink">{TENANCY_LABEL(p.dcTenancy)}</dd>
            <dt className="text-ink-3">Precio de entrada</dt>
            <dd className="text-ink">{p.shared ?? 'sin dato'}</dd>
            <dt className="text-ink-3">Tipo</dt>
            <dd className="text-ink">{SHORT_TYPE[p.type]}</dd>
          </dl>
        </li>
      ))}
    </ol>
    <p className="t-meta mt-3">{PRICING_FOOTNOTE}</p>
  </>
);

export default EstudioFichas;

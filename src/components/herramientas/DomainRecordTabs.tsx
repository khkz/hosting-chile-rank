import React from 'react';
import { ExternalLink } from 'lucide-react';
import Callout from '@/components/system/Callout';
import { ProvenanceTag } from '@/components/data/Provenance';
import { formatDataDate } from '@/lib/format';
import type { DomainAnalysisResult } from '@/services/domainAnalysis';
import FactList, { type Fact } from './FactList';
import { formatToolDate, formatToolDateTime, isoDateTime } from './dataTime';
import { hasRealOwner, isIsoLike, isKnown, probeOf } from './domainFacts';

const linkClass = 'inline-flex items-center gap-1 text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink';

const RecordList: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
  <div className="min-w-0">
    <h3 className="t-label">{title}</h3>
    {items.length > 0 ? (
      <ul className="mt-2 divide-y divide-rule border-y border-rule">
        {items.map((r, i) => (
          <li key={`${r}-${i}`} className="t-small break-all py-2 text-ink">
            {r}
          </li>
        ))}
      </ul>
    ) : (
      <p className="t-meta mt-2">Sin registros de este tipo.</p>
    )}
  </div>
);

const Stamp: React.FC<{ date: string | null; label: string }> = ({ date, label }) =>
  date ? (
    <p className="t-meta flex flex-wrap items-center gap-2">
      <ProvenanceTag kind="measured" />
      <span>
        {label} <time dateTime={isoDateTime(date)}>{formatToolDateTime(date)}</time>
      </span>
    </p>
  ) : null;

/** Registros DNS (consulta a dns.google desde el navegador). */
export const DomainDnsTab: React.FC<{ data: DomainAnalysisResult }> = ({ data }) => {
  const dns = probeOf(data, 'dns');
  if (!dns.answered) {
    return (
      <Callout title="No pudimos consultar el DNS" className="my-0">
        <p>La consulta a dns.google no respondió, así que no mostramos registros. Prueba con «Actualizar análisis» en unos minutos.</p>
      </Callout>
    );
  }
  const { a_records, ns_records, mx_records, txt_records } = data.dns;
  return (
    <div className="space-y-6">
      <Stamp date={dns.checked_at} label="DNS consultado en dns.google el" />
      <div className="grid gap-6 md:grid-cols-2">
        <RecordList title="Registros A (IPv4)" items={a_records} />
        <RecordList title="Registros NS (nameservers)" items={ns_records} />
        <RecordList title="Registros MX (correo)" items={mx_records.map((r) => `${r.priority} ${r.exchange}`)} />
        <RecordList title="Registros TXT" items={txt_records} />
      </div>
    </div>
  );
};

const showDate = (v: string) => (isIsoLike(v) ? formatDataDate(v) : v);

/** WHOIS público de NIC Chile. */
export const DomainWhoisTab: React.FC<{ data: DomainAnalysisResult }> = ({ data }) => {
  const whois = probeOf(data, 'whois');
  const nicChileLink = `https://nic.cl/registry/Whois.do?d=${data.basic.domain}`;
  const official = (
    <p>
      <a href={nicChileLink} target="_blank" rel="noopener noreferrer" className={linkClass}>
        Consultar en NIC Chile
        <ExternalLink aria-hidden className="h-3.5 w-3.5" />
      </a>
    </p>
  );

  if (!whois.answered) {
    return (
      <Callout title="No pudimos consultar el WHOIS de NIC Chile" className="my-0">
        <p>La consulta no respondió, así que no mostramos titular ni fechas. Puedes verlos en el registro oficial.</p>
        {official}
      </Callout>
    );
  }

  const w = data.whois;
  const facts: Fact[] = [{ label: 'Dominio', value: data.basic.domain }];
  if (hasRealOwner(w.owner_name)) facts.push({ label: 'Titular', value: w.owner_name });
  if (hasRealOwner(w.organization)) facts.push({ label: 'Organización', value: w.organization });
  facts.push(
    { label: 'Fecha de creación', value: isKnown(w.created_date) ? showDate(w.created_date) : 'Sin dato' },
    { label: 'Fecha de expiración', value: isKnown(w.expires_date) ? showDate(w.expires_date) : 'Sin dato' },
    { label: 'Registrador', value: isKnown(w.registrar) ? w.registrar : 'Sin dato' },
  );

  return (
    <div className="space-y-6">
      {whois.checked_at && (
        <p className="t-meta">
          Fuente: WHOIS de NIC Chile, leído el <time dateTime={isoDateTime(whois.checked_at)}>{formatToolDateTime(whois.checked_at)}</time>.
        </p>
      )}
      <FactList facts={facts} />
      <div className="t-small space-y-2 text-ink-2">
        <p>Para información completa y actualizada, consulta el registro oficial de NIC Chile.</p>
        {official}
      </div>
      <aside className="rounded-xl border border-rule bg-paper p-4">
        <h3 className="t-label text-ink">Aviso legal</h3>
        <p className="t-meta mt-1">
          Datos obtenidos el {whois.checked_at ? formatToolDate(whois.checked_at) : 'día de la consulta'} desde WHOIS de NIC Chile; uso exclusivo para fines
          informativos vinculados a la gestión del nombre de dominio. La información mostrada
          corresponde únicamente a los datos públicos disponibles. Para información completa
          y verificación oficial, consulte directamente el registro de NIC Chile.
        </p>
      </aside>
    </div>
  );
};

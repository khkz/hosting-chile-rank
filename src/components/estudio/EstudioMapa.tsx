import React from 'react';
import { MinusCircle, Network } from 'lucide-react';
import { ProvenanceTag } from '@/components/data/Provenance';
import { TIER1_ROWS } from '@/data/estudio2026';
import { hasPitChile, pitChileLabel, VERIFICATION_DATE_HUMAN } from '@/data/verified2026';

const RESELLERS = ['PlanetaHosting.cl', 'SolucionHost.cl', 'WebHosting.cl', 'Microhost', 'Cinetic', 'Sered Chile (operador español)'];

const pit = (asn: string) => {
  const first = asn.split(' ')[0];
  return hasPitChile(first) ? pitChileLabel(first) : 'No';
};

/** Sección 3 del estudio: hosting con ASN asignado y revendedores sin ASN propio. */
const EstudioMapa: React.FC = () => (
  <section aria-labelledby="mapa" className="scroll-mt-24">
    <div className="prose">
      <h2 id="mapa" className="scroll-mt-24">3. Mapa del mercado: ASN asignado vs revendedores</h2>
      <h3 className="flex items-center gap-2">
        <Network className="h-5 w-5 text-ink-2" aria-hidden />
        Hosting chileno con ASN asignado en LACNIC
      </h3>
      <p>
        La columna «PIT Chile» refleja presencia efectiva en el IXP según PeeringDB (netixlan) y el listado de miembros
        de bgp.tools. Solo <strong>PowerHost</strong> y <strong>Hostname.cl</strong> están conectados; el resto no aparece
        como miembro.
      </p>
    </div>

    <p className="t-meta mt-6 flex flex-wrap items-center gap-x-3 gap-y-1">
      <span className="inline-flex items-center gap-1.5">
        ASN, prefijos y PIT <ProvenanceTag kind="measured" />
      </span>
      <span>Datos revisados el {VERIFICATION_DATE_HUMAN}</span>
    </p>

    {/* Escritorio: tabla */}
    <table className="mt-3 hidden w-full border-collapse text-left text-[15px] md:table">
      <thead>
        <tr className="border-b-2 border-ink text-[13px] text-ink-2">
          <th scope="col" className="py-2.5 pr-3 font-semibold">Proveedor</th>
          <th scope="col" className="py-2.5 pr-3 font-semibold">ASN</th>
          <th scope="col" className="py-2.5 pr-3 font-semibold">Razón social / holder</th>
          <th scope="col" className="py-2.5 pr-3 font-semibold">Prefijos v4 originados</th>
          <th scope="col" className="py-2.5 font-semibold">PIT Chile</th>
        </tr>
      </thead>
      <tbody>
        {TIER1_ROWS.map((r) => (
          <tr key={r.asn} className="border-b border-rule align-top">
            <th scope="row" className="py-3 pr-3 font-semibold text-ink">{r.name}</th>
            <td className="tabular py-3 pr-3 text-ink">{r.asn}</td>
            <td className="py-3 pr-3 text-ink-2">{r.legal}</td>
            <td className="tabular py-3 pr-3 text-ink">{r.prefixes}</td>
            <td className="py-3 text-ink">{pit(r.asn)}</td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Móvil: filas apiladas */}
    <ul className="mt-3 divide-y divide-rule border-y-2 border-ink md:hidden">
      {TIER1_ROWS.map((r) => (
        <li key={r.asn} className="py-4">
          <p className="font-semibold text-ink">{r.name}</p>
          <p className="t-small mt-0.5 text-ink-2">{r.legal}</p>
          <dl className="t-small mt-2 grid grid-cols-[7.5rem_minmax(0,1fr)] gap-x-3 gap-y-1">
            <dt className="text-ink-3">ASN</dt>
            <dd className="tabular text-ink">{r.asn}</dd>
            <dt className="text-ink-3">Prefijos v4</dt>
            <dd className="tabular text-ink">{r.prefixes}</dd>
            <dt className="text-ink-3">PIT Chile</dt>
            <dd className="text-ink">{pit(r.asn)}</dd>
          </dl>
        </li>
      ))}
    </ul>

    <div className="prose mt-10">
      <h3>Sin ASN propio — revendedores / arrendadores de datacenter</h3>
      <p>
        Estos proveedores tienen marca y presencia comercial, pero no figuran en LACNIC con ASN propio. Operan sobre IPs y
        tránsito de un upstream — no los hace malos por defecto, pero implica una dependencia técnica que conviene
        transparentar.
      </p>
    </div>
    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
      {RESELLERS.map((p) => (
        <li key={p} className="flex items-center gap-2 rounded-lg border border-rule px-3 py-2.5 text-sm text-ink">
          <MinusCircle className="h-4 w-4 shrink-0 text-ink-3" aria-hidden />
          {p}
        </li>
      ))}
    </ul>
  </section>
);

export default EstudioMapa;

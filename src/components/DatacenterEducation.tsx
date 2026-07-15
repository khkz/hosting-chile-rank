import React from 'react';
import { ShieldCheck, AlertTriangle, ExternalLink, CheckCircle2, XCircle, HelpCircle, Globe2 } from 'lucide-react';
import {
  certifiedOperators,
  rankingHosts,
  type DcStatus,
  type CertificationBody,
} from '@/data/datacenters';

/**
 * P4-DC2 block for the LATAM Hub page.
 * Renders 6 sub-sections built entirely from src/data/datacenters.ts.
 * Nothing invented — every fact comes with its fuente_url.
 */

const ORG_LABEL: Record<CertificationBody, string> = {
  uptime: 'Uptime Institute',
  tuv_tr3: 'TÜV Rheinland TR3',
  icrea: 'ICREA',
};

const STATUS_LABEL: Record<DcStatus, { text: string; className: string; Icon: React.ComponentType<{ className?: string }> }> = {
  certificado: {
    text: 'Certificado por tercero',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Icon: CheckCircle2,
  },
  autodeclarado: {
    text: 'Autodeclarado (sin auditoría)',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
    Icon: AlertTriangle,
  },
  extranjero: {
    text: 'Infraestructura extranjera',
    className: 'bg-slate-50 text-slate-700 border-slate-200',
    Icon: Globe2,
  },
  no_divulga: {
    text: 'No divulga',
    className: 'bg-slate-50 text-slate-500 border-slate-200',
    Icon: HelpCircle,
  },
};

// Ranking objetivo de operadores certificados:
// 1) Uptime Tier IV > Tier III; 2) presencia de "Constructed Facility"; 3) sustentabilidad Gold.
function operatorScore(nivel: string): number {
  let s = 0;
  if (/tier\s*iv/i.test(nivel)) s += 40;
  else if (/tier\s*iii/i.test(nivel)) s += 30;
  if (/constructed\s+facility/i.test(nivel)) s += 15;
  if (/design/i.test(nivel)) s += 5;
  if (/gold\s+sustainability/i.test(nivel)) s += 10;
  if (/m&o/i.test(nivel)) s += 5;
  return s;
}

const rankedOperators = [...certifiedOperators].sort(
  (a, b) => operatorScore(b.nivel) - operatorScore(a.nivel)
);

const DatacenterEducation: React.FC = () => {
  return (
    <section
      aria-labelledby="dc-education-heading"
      className="mt-20 text-left"
    >
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2B2D42]/5 text-[#2B2D42] text-sm font-medium mb-4">
            <ShieldCheck className="h-4 w-4" />
            Infraestructura verificada
          </div>
          <h2
            id="dc-education-heading"
            className="text-3xl md:text-4xl font-bold text-[#2B2D42] mb-3"
          >
            ¿Dónde vive realmente tu sitio?
          </h2>
          <p className="text-[#2B2D42]/70 max-w-2xl mx-auto">
            No todo lo que se llama "datacenter" lo es. Acá te mostramos qué operadores están
            auditados por terceros en Chile y qué proveedor de hosting usa cada uno.
          </p>
        </div>

        {/* 1) ¿Qué es un datacenter real? */}
        <div className="grid md:grid-cols-2 gap-6 mb-14">
          <article className="bg-white border-2 border-emerald-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-700" />
              </div>
              <h3 className="font-semibold text-[#2B2D42]">Un datacenter real</h3>
            </div>
            <div
              role="img"
              aria-label="Ilustración de datacenter certificado: pasillos frescos, racks alineados y sistemas redundantes"
              className="aspect-video rounded-lg bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 mb-4 relative overflow-hidden"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-6 gap-1 w-4/5">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-8 rounded-sm bg-gradient-to-b from-slate-700 to-slate-950 border-t border-emerald-400/40"
                    >
                      <div className="h-0.5 w-1 mt-1 ml-1 bg-emerald-400/80 rounded" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute bottom-2 right-2 text-[10px] text-emerald-300/80 font-mono">
                TIER III · N+1 · 24/7
              </div>
            </div>
            <ul className="space-y-1.5 text-sm text-[#2B2D42]/80">
              <li>Auditado por Uptime Institute, TÜV o ICREA.</li>
              <li>Redundancia N+1 en energía y enfriamiento.</li>
              <li>Control de acceso biométrico y CCTV.</li>
              <li>Documentación pública de tier y certificaciones.</li>
            </ul>
          </article>

          <article className="bg-white border-2 border-amber-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-amber-700" />
              </div>
              <h3 className="font-semibold text-[#2B2D42]">Una sala adaptada</h3>
            </div>
            <div
              role="img"
              aria-label="Ilustración de sala de servidores no certificada, con racks sueltos y sin control ambiental documentado"
              className="aspect-video rounded-lg bg-gradient-to-br from-amber-50 via-slate-100 to-amber-50 mb-4 relative overflow-hidden border border-amber-200/60"
            >
              <div className="absolute inset-0 flex items-center justify-center gap-2">
                <div className="w-10 h-16 rounded-sm bg-slate-300 rotate-2" />
                <div className="w-10 h-20 rounded-sm bg-slate-400 -rotate-3" />
                <div className="w-10 h-14 rounded-sm bg-slate-300 rotate-1" />
                <div className="w-10 h-18 rounded-sm bg-slate-400 -rotate-2" />
              </div>
              <div className="absolute bottom-2 right-2 text-[10px] text-amber-700/70 font-mono">
                Sin certificación pública
              </div>
            </div>
            <ul className="space-y-1.5 text-sm text-[#2B2D42]/80">
              <li>Oficina o bodega con aire acondicionado doméstico.</li>
              <li>Sin auditoría de terceros ni tier declarado.</li>
              <li>UPS y generación no siempre redundantes.</li>
              <li>"Tier III homologable" ≠ Tier III certificado.</li>
            </ul>
          </article>
        </div>

        {/* 2) Ranking de operadores por criterios objetivos */}
        <div className="mb-14">
          <h3 className="text-2xl font-bold text-[#2B2D42] mb-2">
            Operadores certificados en Chile
          </h3>
          <p className="text-sm text-[#2B2D42]/60 mb-5">
            Ordenados por criterios objetivos: nivel Tier declarado, evidencia de instalación
            construida ("Constructed Facility") y sustentabilidad Gold. Solo incluye operadores
            con certificación pública verificable.
          </p>
          <div className="bg-white rounded-xl border border-[#2B2D42]/10 divide-y divide-[#2B2D42]/10">
            {rankedOperators.map((op, i) => (
              <div key={op.nombre} className="p-4 flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#EF233C]/10 text-[#EF233C] font-semibold flex items-center justify-center text-sm shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="font-semibold text-[#2B2D42]">{op.nombre}</h4>
                    <span className="text-[11px] uppercase tracking-wide px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {ORG_LABEL[op.organismo]}
                    </span>
                  </div>
                  <p className="text-sm text-[#2B2D42]/80 leading-snug">{op.nivel}</p>
                  <p className="text-xs text-[#2B2D42]/50 mt-1">{op.ubicacion}</p>
                </div>
                <a
                  href={op.fuente_url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-xs text-[#EF233C] hover:underline inline-flex items-center gap-1 shrink-0"
                  aria-label={`Fuente de la certificación de ${op.nombre}`}
                >
                  Fuente <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* 3) Tabla host -> datacenter */}
        <div className="mb-14">
          <h3 className="text-2xl font-bold text-[#2B2D42] mb-2">
            ¿Qué datacenter usa cada proveedor?
          </h3>
          <p className="text-sm text-[#2B2D42]/60 mb-5">
            Estado según fuentes públicas del propio proveedor. Cuando el proveedor no
            transparenta operador o certificación, lo marcamos como autodeclarado o "no divulga".
          </p>
          <div className="overflow-x-auto bg-white rounded-xl border border-[#2B2D42]/10">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-[#2B2D42]">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Proveedor</th>
                  <th className="text-left px-4 py-3 font-semibold">Datacenter declarado</th>
                  <th className="text-left px-4 py-3 font-semibold">Operador</th>
                  <th className="text-left px-4 py-3 font-semibold">Estado</th>
                  <th className="text-left px-4 py-3 font-semibold">Fuente</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2B2D42]/10">
                {rankingHosts.map((h) => {
                  const s = STATUS_LABEL[h.estado];
                  return (
                    <tr key={h.nombre} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3 font-medium text-[#2B2D42] whitespace-nowrap">
                        {h.nombre}
                      </td>
                      <td className="px-4 py-3 text-[#2B2D42]/80">
                        {h.dc_declarado ?? <span className="text-[#2B2D42]/40">—</span>}
                      </td>
                      <td className="px-4 py-3 text-[#2B2D42]/80">
                        {h.operador ?? <span className="text-[#2B2D42]/40">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${s.className}`}
                        >
                          <s.Icon className="h-3 w-3" />
                          {s.text}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={h.fuente_url}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="text-xs text-[#EF233C] hover:underline inline-flex items-center gap-1"
                          aria-label={`Fuente pública de ${h.nombre}`}
                        >
                          Ver <ExternalLink className="h-3 w-3" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4) Checklist del comprador */}
        <div className="mb-14 bg-white border border-[#2B2D42]/10 rounded-xl p-6">
          <h3 className="text-2xl font-bold text-[#2B2D42] mb-4">
            Checklist antes de contratar
          </h3>
          <ul className="grid md:grid-cols-2 gap-x-8 gap-y-3 text-sm text-[#2B2D42]/85">
            {[
              '¿En qué datacenter físico está alojado? (nombre y ciudad)',
              '¿Quién opera ese datacenter y qué certificación tiene?',
              '¿La certificación es "Design", "Constructed Facility" u "Operational Sustainability"?',
              '¿El proveedor es dueño del datacenter o hace colocation?',
              '¿Puede compartir el enlace público a la certificación?',
              '¿Qué SLA de disponibilidad ofrece y cómo se compensa?',
              '¿Tiene entidad legal local para emitir factura?',
              '¿Publica métricas reales de uptime y latencia?',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 5) Metodología + fuentes */}
        <div className="mb-10 bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-[#2B2D42] mb-3">Metodología y fuentes</h3>
          <ul className="space-y-2 text-sm text-[#2B2D42]/80">
            <li>
              <strong>Certificaciones:</strong> Uptime Institute Awards Chile (
              <a
                className="text-[#EF233C] hover:underline"
                href="https://uptimeinstitute.com/uptime-institute-awards/country/id/CL"
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                lista oficial pública
              </a>
              ), página pública de certificaciones de Ascenty (TÜV Rheinland TR3).
            </li>
            <li>
              <strong>Datacenter declarado por host:</strong> únicamente lo declarado en el
              sitio oficial del proveedor a la fecha de última revisión.
            </li>
            <li>
              <strong>Regla dura:</strong> sin fuente pública verificable, el estado queda
              como "no divulga". "Tier III homologable" u otras autodeclaraciones sin
              auditoría de tercero se marcan como <em>autodeclarado</em>.
            </li>
            <li>
              <strong>HostingPlus:</strong> se lista como colocation dentro de Ascenty SCL2
              (TÜV TR3), no como datacenter propio.
            </li>
            <li>
              Última revisión de fuentes: julio 2026. Si detectas un cambio, escribinos a
              contacto@eligetuhosting.cl y lo corregimos con evidencia.
            </li>
          </ul>
        </div>

        {/* 6) Divulgación de comisión */}
        <div className="text-xs text-[#2B2D42]/60 border-t border-[#2B2D42]/10 pt-4">
          <strong className="text-[#2B2D42]/80">Divulgación:</strong> algunos enlaces a
          proveedores pueden generar comisión si contratas por nuestra recomendación. Eso
          no cambia el estado de certificación declarado en esta tabla: el estado depende
          únicamente de fuentes públicas del operador o del proveedor, no de acuerdos
          comerciales con nosotros.
        </div>
      </div>
    </section>
  );
};

export default DatacenterEducation;

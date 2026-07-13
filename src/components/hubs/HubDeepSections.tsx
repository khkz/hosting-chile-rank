import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ShieldCheck, ArrowRight, Info } from 'lucide-react';
import type { HubKey } from '@/lib/segmentHubs';
import { HUB_DEEP } from '@/lib/hubDeepContent';

const HubDeepSections: React.FC<{ hubKey: HubKey }> = ({ hubKey }) => {
  const d = HUB_DEEP[hubKey];
  if (!d) return null;

  return (
    <>
      {/* Divulgación de comisión */}
      <section className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-start gap-2 text-xs bg-amber-50 border border-amber-200 text-amber-900 rounded-md p-3">
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
          <p>
            <strong>Divulgación:</strong> algunos enlaces "Visitar sitio" son de afiliados; la comisión no afecta el orden del ranking. El orden depende únicamente de datos verificables (ASN, TTFB medido, uptime, reclamos, reputación). Precios verificados a julio 2026.
          </p>
        </div>
      </section>

      {/* Protagonista */}
      <section className="container mx-auto px-4 pt-8 pb-4 max-w-3xl">
        <p className="text-lg md:text-xl text-[#2B2D42] leading-relaxed">{d.protagonist}</p>
      </section>

      {/* Problema */}
      <section className="container mx-auto px-4 py-6 max-w-3xl">
        <h2 className="text-xl md:text-2xl font-semibold text-[#2B2D42] mb-3 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-[#EF233C]" aria-hidden="true" />
          {d.problem.title}
        </h2>
        <p className="text-[#444] leading-relaxed mb-4">{d.problem.body}</p>
        <ul className="space-y-2">
          {d.problem.pains.map((p, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-700">
              <span className="text-[#EF233C] font-bold" aria-hidden="true">✗</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Guía */}
      <section className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="rounded-xl border border-gray-200 bg-white p-5 md:p-6">
          <h2 className="text-xl md:text-2xl font-semibold text-[#2B2D42] mb-2 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" aria-hidden="true" />
            {d.guide.title}
          </h2>
          <p className="text-[#444] leading-relaxed mb-4">{d.guide.body}</p>
          <div className="grid md:grid-cols-3 gap-4">
            {d.guide.pillars.map((pi, i) => (
              <div key={i} className="rounded-lg bg-[#F7F9FC] p-4">
                <div className="font-semibold text-[#2B2D42] mb-1">{pi.h}</div>
                <div className="text-sm text-gray-600">{pi.p}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Datos que verificamos: {d.criteria.join(' · ')}.
          </div>
        </div>
      </section>

      {/* Plan */}
      <section className="container mx-auto px-4 py-6 max-w-3xl">
        <h2 className="text-xl md:text-2xl font-semibold text-[#2B2D42] mb-3">{d.plan.title}</h2>
        <ol className="space-y-2 list-decimal list-inside text-[#444]">
          {d.plan.steps.map((s, i) => (
            <li key={i} className="leading-relaxed">{s}</li>
          ))}
        </ol>
      </section>

      {/* Buyer journeys */}
      <section className="container mx-auto px-4 py-6 max-w-5xl">
        <h2 className="text-xl md:text-2xl font-semibold text-[#2B2D42] mb-4">¿En qué caso estás?</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {d.journeys.map((j, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col">
              <div className="font-semibold text-[#2B2D42] mb-1">{j.persona}</div>
              <p className="text-sm text-gray-600 mb-3 flex-1">{j.scenario}</p>
              <div className="text-sm mb-3">
                <span className="text-gray-500">Recomendado: </span>
                <span className="font-medium text-[#2B2D42]">{j.recommendation}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-auto">
                <Link
                  to={`/catalogo/${j.slug}`}
                  className="text-xs px-3 py-2 rounded border border-[#EF233C] text-[#EF233C] hover:bg-[#EF233C] hover:text-white transition inline-flex items-center gap-1"
                >
                  Ver ficha <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </Link>
                {j.guide && (
                  <Link
                    to={j.guide.href}
                    className="text-xs px-3 py-2 rounded border border-gray-300 text-gray-700 hover:border-gray-500 transition"
                  >
                    {j.guide.label}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Objeciones */}
      <section className="container mx-auto px-4 py-6 max-w-3xl">
        <h2 className="text-xl md:text-2xl font-semibold text-[#2B2D42] mb-4">Objeciones frecuentes (respondidas con datos)</h2>
        <div className="space-y-3">
          {d.objections.map((o, i) => (
            <details key={i} className="border rounded-lg p-4 bg-white">
              <summary className="font-medium cursor-pointer text-[#2B2D42]">{o.q}</summary>
              <p className="mt-2 text-sm text-gray-700 leading-relaxed">{o.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Interlinking */}
      <section className="container mx-auto px-4 py-6 max-w-5xl">
        <h2 className="text-xl md:text-2xl font-semibold text-[#2B2D42] mb-3">Sigue investigando</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {d.internalLinks.map((l, i) => (
            <Link
              key={i}
              to={l.href}
              className="text-sm px-3 py-2 rounded border border-gray-200 hover:border-[#EF233C] hover:text-[#EF233C] transition"
            >
              {l.label} →
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default HubDeepSections;

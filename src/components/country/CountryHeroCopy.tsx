import React from 'react';
import { COUNTRY_CONTENT, type CountryCopy } from '@/data/countryContent';

const MES_ANIO = new Date().toLocaleDateString('es-CL', { month: 'long', year: 'numeric' });

type Props = { slug: 'pe' | 'mx' | 'co' | 'ar' };

export const CountryHeroCopy: React.FC<Props> = ({ slug }) => {
  const c: CountryCopy = COUNTRY_CONTENT[slug];
  if (!c) return null;
  return (
    <>
      <section
        className="rounded-xl text-white p-6 md:p-8 mb-6 shadow-lg"
        style={{ background: 'linear-gradient(135deg,#2B2D42,#3a3d5c)' }}
      >
        <div className="text-xs uppercase tracking-wide text-white/85 mb-2">{c.kicker}</div>
        <h1 className="text-2xl md:text-3xl font-bold leading-tight text-white">{c.title}</h1>
        <p className="mt-3 text-white/85 max-w-3xl leading-relaxed">{c.subtitle}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {c.chips.map((ch) => (
            <span
              key={ch}
              className="text-xs bg-white/10 border border-white/25 text-white rounded-full px-3 py-1"
            >
              {ch}
            </span>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a
            href="#tabla"
            className="inline-flex items-center gap-2 bg-[#EF233C] hover:bg-[#c41e3a] text-white font-semibold px-4 py-2 rounded-md text-sm"
          >
            Ver ranking ↓
          </a>
          <span className="text-xs text-white/70">
            Verificado por el equipo editorial de EligeTuHosting · Metodología pública · Actualizado {MES_ANIO}
          </span>
        </div>
      </section>

      <section className="prose prose-slate max-w-none mb-6">
        {c.intro.map((p, i) => (
          <p key={i} className="text-[#2B2D42]/85 leading-relaxed">{p}</p>
        ))}
      </section>
    </>
  );
};

export const CountryFaqCopy: React.FC<Props> = ({ slug }) => {
  const c = COUNTRY_CONTENT[slug];
  if (!c) return null;
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-3 text-[#2B2D42]">Preguntas frecuentes</h2>
      <div className="space-y-3">
        {c.faq.map((f, i) => (
          <div key={i} className="border rounded-lg p-4 bg-white">
            <h3 className="font-semibold text-[#2B2D42] mb-1">{f.q}</h3>
            <p className="text-sm text-[#2B2D42]/80 leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CountryHeroCopy;

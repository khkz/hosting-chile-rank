import React from 'react';
import { Star } from 'lucide-react';
import { ProvenanceTag } from '@/components/data/Provenance';
import { formatScore } from '@/lib/format';

/*
 * Testimonios, cifras comerciales y notas escritas a mano de /cotiza-hosting.
 * Son las decisiones pendientes 9 y 10: el contenido no cambia, solo el estilo
 * (neutro, sin degradados ni amarillos). Únicos cambios de formato: coma
 * decimal, punto de miles y «98 %».
 */

const TESTIMONIOS = [
  {
    texto: 'Encontraron exactamente lo que necesitaba para mi tienda online. El proceso fue muy fácil y transparente.',
    nombre: 'María González',
    rol: 'Dueña de Mi Tienda Online',
  },
  {
    texto: 'Me ahorraron horas de investigación. La recomendación fue perfecta y conseguí un descuento que no habría obtenido solo.',
    nombre: 'Carlos Mendoza',
    rol: 'Desarrollador Web',
  },
  {
    texto: 'Excelente servicio post-contratación. Cuando tuve problemas técnicos me ayudaron a resolverlos rápidamente.',
    nombre: 'Ana Silva',
    rol: 'Emprendedora Digital',
  },
];

const RECOMENDADOS = [
  { nombre: 'HostingPlus', logo: '/logo-hostingplus-official.png', lema: 'Líder en velocidad y soporte técnico', nota: 9.8 },
  { nombre: 'HostGator', logo: '/logo-hostgator.svg', lema: 'Mejor relación calidad/precio', nota: 9.2 },
  { nombre: 'Bluehost', logo: '/logo-bluehost.svg', lema: 'Especialista en WordPress', nota: 9.0 },
  { nombre: 'GoDaddy', logo: '/logo-godaddy.svg', lema: 'Solución integral con dominios', nota: 8.8 },
];

const CIFRAS = [
  { valor: '98 %', rotulo: 'Satisfacción' },
  { valor: '24 h', rotulo: 'Respuesta promedio' },
  { valor: '30 %', rotulo: 'Ahorro promedio' },
];

const CotizaPrueba: React.FC = () => (
  <>
    <section aria-labelledby="cotiza-testimonios" className="mt-16">
      <h2 id="cotiza-testimonios" className="t-h2 text-ink">Lo que dicen nuestros clientes</h2>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {TESTIMONIOS.map((t) => (
          <figure key={t.nombre} className="flex flex-col rounded-xl border border-rule bg-white p-5 md:p-6">
            <div className="flex gap-0.5 text-ink-3">
              <span className="sr-only">Calificación: 5 de 5</span>
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} aria-hidden className="h-4 w-4 fill-current" />
              ))}
            </div>
            <blockquote className="t-body mt-3 text-ink-2">«{t.texto}»</blockquote>
            <figcaption className="mt-auto pt-4">
              <span className="block font-semibold text-ink">{t.nombre}</span>
              <span className="t-meta block">{t.rol}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>

    <section aria-labelledby="cotiza-recomendados" className="mt-16">
      <div className="flex flex-wrap items-center gap-3">
        <h2 id="cotiza-recomendados" className="t-h2 text-ink">Proveedores que recomendamos</h2>
        <ProvenanceTag kind="editorial" />
      </div>
      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {RECOMENDADOS.map((p) => (
          <li key={p.nombre} className="rounded-xl border border-rule bg-white p-5">
            <img src={p.logo} alt={p.nombre} className="h-10 w-auto max-w-[160px] object-contain" loading="lazy" />
            <h3 className="t-h3 mt-4 text-ink">{p.nombre}</h3>
            <p className="t-small mt-1 text-ink-2">{p.lema}</p>
            <dl className="t-small mt-4 divide-y divide-rule border-t border-rule">
              <div className="flex items-baseline justify-between gap-3 py-2">
                <dt className="text-ink-2">Puntuación</dt>
                <dd className="tabular font-semibold text-ink">{formatScore(p.nota)}/10</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3 py-2">
                <dt className="text-ink-2">Planes</dt>
                <dd className="font-semibold text-ink">a consultar</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </section>

    <section aria-labelledby="cotiza-listo" className="mt-16 rounded-xl border border-rule bg-paper p-6 md:p-10">
      <h2 id="cotiza-listo" className="t-h2 text-ink">¿Listo para encontrar tu hosting ideal?</h2>
      <p className="t-lead mt-3">Más de 2.500 empresas han confiado en nosotros</p>
      <dl className="mt-8 grid gap-6 sm:grid-cols-3">
        {CIFRAS.map((c) => (
          <div key={c.rotulo} className="border-t border-ink pt-3">
            <dt className="t-small text-ink-2">{c.rotulo}</dt>
            <dd className="tabular mt-1 text-3xl font-bold text-ink">{c.valor}</dd>
          </div>
        ))}
      </dl>
    </section>
  </>
);

export default CotizaPrueba;

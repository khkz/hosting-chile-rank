import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Objeciones frecuentes respondidas con datos verificables ya publicados en el sitio
 * (ranking, fichas, reclamos, metodología). Sin testimonios ni cifras inventadas.
 */
const objections: { q: string; a: React.ReactNode }[] = [
  {
    q: '"¿No serán todos iguales? Marketing puro."',
    a: (
      <>
        No. Entre los 20 proveedores auditados, los TTFB desde Santiago varían de menos de 200 ms
        a más de 1,5 s en el mismo test. La diferencia sale de tener datacenter en Chile, tecnología
        LiteSpeed y capacidad real — no del logo. Ver{' '}
        <Link to="/nuestro-metodo" className="text-primary font-medium hover:underline">metodología completa</Link>{' '}
        y{' '}
        <Link to="/benchmark" className="text-primary font-medium hover:underline">benchmarks abiertos</Link>.
      </>
    ),
  },
  {
    q: '"¿Y si el que recomiendan me da mal soporte?"',
    a: (
      <>
        Cruzamos cada proveedor con Reclamos.cl y con reseñas verificadas. HostingPlus tiene 0
        reclamos activos en los últimos 12 meses; EcoHosting y HN.cl también aparecen limpios.
        Los que acumulan reclamos aparecen listados en{' '}
        <Link to="/reclamos" className="text-primary font-medium hover:underline">reclamos verificados</Link>{' '}
        con el detalle, no barridos bajo la alfombra.
      </>
    ),
  },
  {
    q: '"El precio bajo del primer año, ¿es trampa?"',
    a: (
      <>
        A veces sí. Publicamos precio promocional <em>y</em> precio de renovación cuando el
        proveedor lo declara. HostingPlus: $4.219/mes. EcoHosting: $3.325/mes. Precios verificados
        a julio 2026 e incluyen IVA. Todos los detalles en cada{' '}
        <Link to="/catalogo" className="text-primary font-medium hover:underline">ficha del catálogo</Link>.
      </>
    ),
  },
  {
    q: '"Ya tengo hosting. Migrar suena a caos."',
    a: (
      <>
        Casi todos los proveedores chilenos verificados ofrecen migración gratuita en 24-48 horas
        y la ejecuta el equipo de soporte. Paso a paso, checklist DNS y qué preguntar antes de
        firmar en la{' '}
        <Link to="/guia-migrar-hosting" className="text-primary font-medium hover:underline">
          guía de migración
        </Link>.
      </>
    ),
  },
  {
    q: '"¿Ustedes ganan comisión? Entonces no son neutrales."',
    a: (
      <>
        Sí ganamos comisión de algunos proveedores. Y sí somos independientes: el puntaje sale
        de mediciones técnicas y de reclamos públicos, no de cuánto paga cada uno. Proveedores
        con reclamos altos aparecen igual — con reclamos y todo. Nuestra política y quiénes
        somos: <Link to="/quienes-somos" className="text-primary font-medium hover:underline">/quienes-somos</Link>.
      </>
    ),
  },
];

const Objections: React.FC = () => {
  return (
    <section
      aria-labelledby="objections-title"
      className="py-14 bg-warm-cream/30"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-red mb-2">
            Lo que probablemente estás pensando
          </p>
          <h2 id="objections-title" className="font-poppins text-2xl md:text-3xl font-bold text-[#2B2D42] mb-3">
            Objeciones legítimas, respuestas verificables
          </h2>
          <p className="text-base text-gray-700 leading-relaxed">
            Todas estas dudas nos las escriben cada semana. Las contestamos con datos que puedes
            revisar tú mismo — no con promesas.
          </p>
        </div>

        <ul className="space-y-4">
          {objections.map((o, i) => (
            <li
              key={i}
              className="bg-white rounded-xl p-5 border border-border shadow-sm"
            >
              <p className="font-semibold text-[#2B2D42] mb-2">{o.q}</p>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed">{o.a}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Objections;

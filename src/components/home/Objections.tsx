import React from 'react';
import { Link } from 'react-router-dom';
import Section from '@/components/system/Section';
import { ProvenanceTag } from '@/components/data/Provenance';

/**
 * Objeciones frecuentes respondidas con lo que ya está publicado en el sitio
 * (ranking, fichas, reclamos, benchmark, metodología). Sin testimonios ni
 * cifras escritas a mano: las mediciones viven en /benchmark con su fecha y
 * los reclamos, en el registro de /reclamos.
 */
const textLink = 'font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink';

const objections: { q: string; a: React.ReactNode }[] = [
  {
    q: '¿No serán todos iguales? Marketing puro.',
    a: (
      <>
        No. En el mismo test, el tiempo de respuesta (TTFB) cambia mucho de un proveedor a otro. La diferencia sale de
        tener datacenter en Chile, tecnología LiteSpeed y capacidad real, no del logo. Revisa las{' '}
        <Link to="/benchmark" className={textLink}>
          mediciones del benchmark
        </Link>{' '}
        <ProvenanceTag kind="measured" variant="glyph" className="mx-0.5 align-middle" /> con su fecha, y los criterios
        en la{' '}
        <Link to="/metodologia" className={textLink}>
          metodología completa
        </Link>
        .
      </>
    ),
  },
  {
    q: '¿Y si el que recomiendan me da mal soporte?',
    a: (
      <>
        Cruzamos cada proveedor con Reclamos.cl y con reseñas verificadas. Si un proveedor del ranking tiene reclamos
        verificados, los ves en su fila y, con el detalle, en{' '}
        <Link to="/reclamos" className={textLink}>
          reclamos verificados
        </Link>
        : no se barren bajo la alfombra.
      </>
    ),
  },
  {
    q: 'El precio bajo del primer año, ¿es trampa?',
    a: (
      <>
        A veces sí. Publicamos precio promocional <em>y</em> precio de renovación cuando el proveedor lo declara. Los
        valores vigentes se consultan en el sitio de cada proveedor (habitualmente con IVA aparte). Todos los detalles en
        cada{' '}
        <Link to="/catalogo" className={textLink}>
          ficha del catálogo
        </Link>
        .
      </>
    ),
  },
  {
    q: 'Ya tengo hosting. Migrar suena a caos.',
    a: (
      <>
        Muchos proveedores chilenos ofrecen migración gratuita y la hace su equipo de soporte; los plazos y condiciones
        cambian según el proveedor. Paso a paso, checklist DNS y qué preguntar antes de firmar en la{' '}
        <Link to="/guia-migrar-hosting" className={textLink}>
          guía de migración
        </Link>
        .
      </>
    ),
  },
  {
    q: '¿Ustedes ganan comisión? Entonces, ¿cómo confío en el orden?',
    a: (
      <>
        Sí: algunos enlaces son de afiliado y el editor mantiene relación comercial con algunos de los proveedores
        listados. Por eso el ranking es editorial con pesos publicados, y cada dato indica si lo medimos nosotros, si lo
        declara el proveedor o si es criterio editorial. Los proveedores con reclamos aparecen igual, con sus reclamos a
        la vista. Más contexto en{' '}
        <Link to="/quienes-somos" className={textLink}>
          Quiénes somos
        </Link>
        .
      </>
    ),
  },
];

const Objections: React.FC = () => (
  <Section
    id="objeciones"
    tone="paper"
    title="Objeciones legítimas, respuestas verificables"
    lead="Las dudas más comunes antes de contratar, con respuestas que puedes revisar tú mismo, no con promesas."
  >
    <dl className="border-b border-rule">
      {objections.map((o) => (
        <div key={o.q} className="grid gap-2 border-t border-rule py-5 md:grid-cols-12 md:gap-8">
          <dt className="t-h3 text-ink md:col-span-4">{o.q}</dt>
          <dd className="measure text-base leading-relaxed text-ink-2 md:col-span-8 md:text-[15px]">{o.a}</dd>
        </div>
      ))}
    </dl>
  </Section>
);

export default Objections;

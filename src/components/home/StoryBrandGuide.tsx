import React from 'react';
import { Link } from 'react-router-dom';
import Section from '@/components/system/Section';

/**
 * StoryBrand honesto: la pyme chilena es la protagonista, nosotros somos la guía.
 * Solo afirma lo que el sitio puede respaldar: cada dato lleva su procedencia y
 * la nota es editorial, con pesos publicados.
 */
const textLink = 'font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink';

const STEPS: { title: string; body: React.ReactNode }[] = [
  {
    title: '1. Entiende tu caso',
    body: (
      <>
        Un blog personal necesita algo muy distinto a una tienda con carrito. Tenemos rutas para blog, pyme y
        e-commerce, sin empujarte a un plan que no necesitas.
      </>
    ),
  },
  {
    title: '2. Compara con datos que puedes revisar',
    body: (
      <>
        Datacenter, antigüedad, dominios .CL alojados, mediciones de uptime y velocidad, y reclamos públicos. Los
        criterios y sus pesos están en la{' '}
        <Link to="/metodologia" className={textLink}>
          metodología
        </Link>
        .
      </>
    ),
  },
  {
    title: '3. Decide sin arrepentirte',
    body: (
      <>
        Cada ficha reúne datacenter, antigüedad, ASN y reclamos. Si te equivocas, muchos proveedores ayudan con la
        migración: revisa sus condiciones y nuestra{' '}
        <Link to="/guia-migrar-hosting" className={textLink}>
          guía de migración
        </Link>
        .
      </>
    ),
  },
];

const StoryBrandGuide: React.FC = () => (
  <Section
    id="como-te-ayudamos"
    title="Tú tienes un proyecto que crecer. Nosotros hicimos la tarea aburrida."
    lead={
      <>
        Sabemos lo que se siente elegir hosting a ciegas: decenas de planes que parecen iguales, promesas de «ilimitado»
        que no lo son y el miedo a migrar el sitio de tu pyme justo cuando llega un cliente. Por eso revisamos los
        proveedores chilenos del directorio y marcamos de dónde sale cada dato: medido por nosotros, declarado por el
        proveedor o editorial.
      </>
    }
  >
    <ol className="grid gap-8 md:grid-cols-3">
      {STEPS.map((s) => (
        <li key={s.title} className="border-t-2 border-ink pt-4">
          <h3 className="t-h3 text-ink">{s.title}</h3>
          <p className="mt-2 text-base leading-relaxed text-ink-2 md:text-[15px]">{s.body}</p>
        </li>
      ))}
    </ol>

    <p className="measure mt-10 border-t border-rule pt-4 text-base leading-relaxed text-ink-2 md:text-sm">
      <strong className="font-semibold text-ink">Divulgación:</strong> la nota de cada proveedor es editorial, con pesos
      publicados en la metodología. El editor mantiene relación comercial con algunos de los proveedores listados, y
      podemos recibir una comisión si contratas por sus enlaces, sin costo adicional para ti. Más detalle en{' '}
      <Link to="/quienes-somos" className={textLink}>
        Quiénes somos
      </Link>
      .
    </p>
  </Section>
);

export default StoryBrandGuide;

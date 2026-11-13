import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Target, ShieldCheck } from 'lucide-react';

/**
 * StoryBrand honesto: la pyme chilena es la protagonista, nosotros somos la guía.
 * Solo afirma lo que el sitio puede respaldar: cada dato lleva su procedencia y
 * la nota es editorial, con pesos publicados.
 */
const StoryBrandGuide: React.FC = () => {
  return (
    <section aria-labelledby="storybrand-title" className="border-y border-rule bg-paper py-14">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-8 max-w-3xl">
          <h2 id="storybrand-title" className="mb-3 text-2xl font-bold text-ink md:text-3xl">
            Tú tienes un proyecto que crecer. Nosotros hicimos la tarea aburrida.
          </h2>
          <p className="text-base leading-relaxed text-ink-2 md:text-lg">
            Sabemos lo que se siente elegir hosting a ciegas: decenas de planes que parecen iguales, promesas de
            "ilimitado" que no lo son y el miedo a migrar el sitio de tu pyme justo cuando llega un cliente. Por eso
            revisamos los proveedores chilenos del directorio y marcamos de dónde sale cada dato: medido por nosotros,
            declarado por el proveedor o editorial.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-xl border border-rule bg-white p-5">
            <Compass className="mb-3 h-6 w-6 text-brand" aria-hidden />
            <h3 className="mb-2 font-semibold text-ink">1. Entiende tu caso</h3>
            <p className="text-sm leading-relaxed text-ink-2">
              Un blog personal necesita algo muy distinto a una tienda con carrito. Tenemos rutas para blog, pyme y
              e-commerce, sin empujarte a un plan que no necesitas.
            </p>
          </div>

          <div className="rounded-xl border border-rule bg-white p-5">
            <Target className="mb-3 h-6 w-6 text-brand" aria-hidden />
            <h3 className="mb-2 font-semibold text-ink">2. Compara con datos que puedes revisar</h3>
            <p className="text-sm leading-relaxed text-ink-2">
              Datacenter, antigüedad, dominios .CL alojados, mediciones de uptime y velocidad, y reclamos públicos.
              Los criterios y sus pesos están en la{' '}
              <Link to="/metodologia" className="font-medium text-ink underline decoration-ink/30 underline-offset-2">
                metodología
              </Link>
              .
            </p>
          </div>

          <div className="rounded-xl border border-rule bg-white p-5">
            <ShieldCheck className="mb-3 h-6 w-6 text-brand" aria-hidden />
            <h3 className="mb-2 font-semibold text-ink">3. Decide sin arrepentirte</h3>
            <p className="text-sm leading-relaxed text-ink-2">
              Cada ficha reúne datacenter, antigüedad, ASN y reclamos. Si te equivocas, muchos proveedores ayudan con la
              migración: revisa sus condiciones y nuestra{' '}
              <Link
                to="/guia-migrar-hosting"
                className="font-medium text-ink underline decoration-ink/30 underline-offset-2"
              >
                guía de migración
              </Link>
              .
            </p>
          </div>
        </div>

        <p className="mt-6 max-w-3xl text-xs leading-relaxed text-ink-3">
          <strong className="font-semibold text-ink-2">Divulgación:</strong> la nota de cada proveedor es editorial, con
          pesos publicados en la metodología. El editor mantiene relación comercial con algunos de los proveedores
          listados, y podemos recibir una comisión si contratas por sus enlaces, sin costo adicional para ti. Más detalle
          en{' '}
          <Link to="/quienes-somos" className="underline underline-offset-2 hover:text-ink">
            Quiénes somos
          </Link>
          .
        </p>
      </div>
    </section>
  );
};

export default StoryBrandGuide;

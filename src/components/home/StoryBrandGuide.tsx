import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Target, ShieldCheck } from 'lucide-react';

/**
 * StoryBrand honesto: la pyme chilena es la protagonista, nosotros somos la guía.
 * Nada inventado: solo la promesa editorial verificable del sitio.
 */
const StoryBrandGuide: React.FC = () => {
  return (
    <section
      aria-labelledby="storybrand-title"
      className="py-14 bg-gradient-to-b from-white to-warm-cream/40 border-y border-border/50"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="max-w-3xl mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-red mb-2">
            Cómo te ayudamos a decidir
          </p>
          <h2 id="storybrand-title" className="font-poppins text-2xl md:text-3xl font-bold text-[#2B2D42] mb-3">
            Tú tienes un proyecto que crecer. Nosotros hicimos la tarea aburrida.
          </h2>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            Sabemos lo que se siente elegir hosting a ciegas: 20 planes que parecen iguales,
            promesas de "ilimitado" que no lo son, y el miedo a migrar el sitio de tu pyme y
            que se caiga justo cuando llega un cliente. Por eso auditamos <strong>20 proveedores
            chilenos</strong> con métricas reales — no con reviews compradas.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <div className="bg-white rounded-xl p-5 border border-border shadow-sm">
            <Compass className="h-6 w-6 text-brand-red mb-3" aria-hidden />
            <h3 className="font-semibold text-[#2B2D42] mb-2">1. Entiende tu caso</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Un blog personal necesita algo muy distinto a una tienda con carrito. Tenemos rutas
              claras para blog, pyme y e-commerce — sin venderte "el plan enterprise" si no lo necesitas.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-border shadow-sm">
            <Target className="h-6 w-6 text-brand-red mb-3" aria-hidden />
            <h3 className="font-semibold text-[#2B2D42] mb-2">2. Compara con datos reales</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              +5.700 dominios analizados, ping desde Santiago, uptime medido y reclamos verificados
              en Reclamos.cl. Toda la metodología está publicada en{' '}
              <Link to="/nuestro-metodo" className="text-primary font-medium hover:underline">
                /nuestro-metodo
              </Link>.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-border shadow-sm">
            <ShieldCheck className="h-6 w-6 text-brand-red mb-3" aria-hidden />
            <h3 className="font-semibold text-[#2B2D42] mb-2">3. Decide sin arrepentirte</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Cada ficha muestra precio real vigente, datacenter, antigüedad, ASN y reclamos.
              Si te equivocas, casi todos ofrecen migración gratis — mira nuestra{' '}
              <Link to="/guia-migrar-hosting" className="text-primary font-medium hover:underline">
                guía de migración
              </Link>.
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-6 max-w-3xl leading-relaxed">
          <strong>Divulgación honesta:</strong> algunos enlaces a proveedores son afiliados y podemos
          recibir una comisión sin costo adicional para ti. Eso <em>no</em> altera el ranking:
          los puntajes salen de mediciones técnicas, no de comisiones. Detalle en{' '}
          <Link to="/acerca-de" className="underline hover:text-foreground">acerca-de</Link>.
        </p>
      </div>
    </section>
  );
};

export default StoryBrandGuide;

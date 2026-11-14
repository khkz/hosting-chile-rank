import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/system/PageHeader';
import CotizaForm from '@/components/formularios/CotizaForm';
import CotizaAside from '@/components/formularios/CotizaAside';
import CotizaPrueba from '@/components/formularios/CotizaPrueba';

const FAQS = [
  {
    q: '¿Es gratuito solicitar una cotización?',
    a: 'Sí, completamente gratuito. Nuestro servicio de asesoría no tiene costo y solo cobramos comisiones a los proveedores, nunca al cliente final.',
  },
  {
    q: '¿En cuánto tiempo recibo la cotización?',
    a: 'Normalmente respondemos en menos de 24 horas con opciones personalizadas. En casos urgentes podemos responder el mismo día.',
  },
  {
    q: '¿Qué incluye la asesoría?',
    a: 'Incluye comparativa de proveedores, recomendación personalizada, negociación de descuentos exclusivos y soporte post-contratación sin costo adicional.',
  },
  {
    q: '¿Puedo cambiar de proveedor después?',
    a: 'Sí, te ayudamos con migraciones gratuitas si no estás conforme con tu proveedor actual. Tenemos acuerdos especiales para facilitar el proceso.',
  },
];

const CotizaHosting = () => {
  useEffect(() => {
    document.title = "Cotiza tu hosting ideal | eligetuhosting.cl";
  }, []);

  return (
    <>
      <Helmet>
        <title>Cotizador Hosting Chile | EligeTuHosting.cl</title>
        <meta
          name="description"
          content="Solicita una cotización personalizada de hosting para tu proyecto web. Compara las mejores opciones del mercado chileno adaptadas a tus necesidades."
        />
      </Helmet>

      <Navbar />

      <main>
        <PageHeader
          title="Cotiza tu hosting ideal"
          lead="Cuéntanos qué vas a publicar y cuánto quieres gastar. Te enviamos por email una cotización personalizada, con opciones que se ajusten a tu proyecto."
        />

        <div className="bg-paper">
          <div className="container py-10 md:py-14">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10">
              <section
                id="solicitud"
                aria-labelledby="cotiza-solicitud"
                className="min-w-0 rounded-xl border border-rule bg-white p-5 md:p-8"
              >
                <h2 id="cotiza-solicitud" className="t-h3 text-ink">Solicitud de cotización</h2>
                <p className="t-small mt-1 text-ink-2">
                  Cuéntanos sobre tu proyecto para recomendarte el mejor servicio de hosting
                </p>
                <div className="mt-6">
                  <CotizaForm />
                </div>
              </section>
              <CotizaAside />
            </div>

            <CotizaPrueba />

            <section aria-labelledby="cotiza-preguntas" className="mt-16">
              <h2 id="cotiza-preguntas" className="t-h2 text-ink">Preguntas frecuentes</h2>
              <dl className="mt-8 max-w-3xl divide-y divide-rule border-y border-rule">
                {FAQS.map((f) => (
                  <div key={f.q} className="py-5">
                    <dt className="font-semibold text-ink">{f.q}</dt>
                    <dd className="t-body measure mt-2 text-ink-2">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default CotizaHosting;

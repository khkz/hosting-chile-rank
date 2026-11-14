import React from 'react';
import { Facebook, Instagram, Linkedin, Mail, Twitter } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DynamicMetaTags from '@/components/SEO/DynamicMetaTags';
import { Helmet } from 'react-helmet-async';
import PageHeader from '@/components/system/PageHeader';
import ContactoForm from '@/components/formularios/ContactoForm';
import { CONTACT_EMAIL, CONTACT_RESPONSE_TIME } from '@/components/formularios/contacto';

const REDES = [
  { href: 'https://twitter.com/eligetuhosting', label: 'X (Twitter)', Icon: Twitter },
  { href: 'https://facebook.com/eligetuhosting', label: 'Facebook', Icon: Facebook },
  { href: 'https://linkedin.com/company/eligetuhosting', label: 'LinkedIn', Icon: Linkedin },
  { href: 'https://instagram.com/eligetuhosting', label: 'Instagram', Icon: Instagram },
];

const PREGUNTAS = [
  {
    q: '¿Cuánto tiempo tardan en responder?',
    a: `Respondemos todas las consultas en un plazo de ${CONTACT_RESPONSE_TIME}.`,
  },
  {
    q: '¿Ofrecen asesoría técnica personalizada?',
    a: 'Sí, contamos con un equipo técnico especializado que puede ayudarte con consultas específicas sobre hosting y dominios.',
  },
  {
    q: '¿Cómo puedo colaborar con el sitio?',
    a: 'Estamos abiertos a colaboraciones. Envíanos tu propuesta a través del formulario seleccionando «Propuesta de colaboración».',
  },
];

const panel = 'rounded-xl border border-rule bg-white p-5 md:p-6';

const Contacto = () => (
  <>
    <DynamicMetaTags
      title="Contacto"
      description="Contáctanos para resolver tus dudas sobre hosting en Chile. Estamos aquí para ayudarte a encontrar el mejor servicio para tu sitio web."
    />
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "mainEntity": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "email": "contacto@eligetuhosting.cl",
            "areaServed": "CL",
            "availableLanguage": ["Spanish"]
          }
        })}
      </script>
    </Helmet>

    <Navbar />

    <main>
      <PageHeader
        title="Contacto"
        lead={`¿Tienes una duda sobre hosting, un dato que corregir o una propuesta? Escríbenos: te respondemos en ${CONTACT_RESPONSE_TIME}.`}
      />

      <div className="bg-paper">
        <div className="container grid gap-8 py-10 md:py-14 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10">
          <section aria-labelledby="contacto-mensaje" className={`${panel} min-w-0 md:p-8`}>
            <h2 id="contacto-mensaje" className="t-h3 text-ink">Envíanos un mensaje</h2>
            <p className="t-small mt-1 text-ink-2">Te respondemos en un plazo de {CONTACT_RESPONSE_TIME}.</p>
            <div className="mt-6">
              <ContactoForm />
            </div>
          </section>

          <div className="space-y-6">
            <section aria-labelledby="contacto-info" className={panel}>
              <h2 id="contacto-info" className="t-h3 text-ink">Información de contacto</h2>
              <div className="mt-4 flex items-start gap-3">
                <Mail aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-ink-2" />
                <div className="min-w-0">
                  <h3 className="font-semibold text-ink">Email</h3>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="break-words text-ink-2 underline decoration-ink/30 underline-offset-4 hover:text-ink hover:decoration-ink"
                  >
                    {CONTACT_EMAIL}
                  </a>
                  <p className="t-meta mt-1">Respuesta en {CONTACT_RESPONSE_TIME}</p>
                </div>
              </div>
            </section>

            <section aria-labelledby="contacto-preguntas" className={panel}>
              <h2 id="contacto-preguntas" className="t-h3 text-ink">Preguntas frecuentes</h2>
              <div className="mt-4 space-y-4">
                {PREGUNTAS.map((p) => (
                  <div key={p.q}>
                    <h3 className="font-semibold text-ink">{p.q}</h3>
                    <p className="t-small mt-1 text-ink-2">{p.a}</p>
                  </div>
                ))}
              </div>
            </section>

            <section aria-labelledby="contacto-redes" className={panel}>
              <h2 id="contacto-redes" className="t-h3 text-ink">Síguenos</h2>
              <ul className="mt-4 grid grid-cols-2 gap-2">
                {REDES.map(({ href, label, Icon }) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${label} de EligeTuHosting (se abre en otra pestaña)`}
                      className="flex min-h-11 items-center gap-2.5 rounded-lg border border-rule px-3 text-[15px] font-medium text-ink hover:border-ink"
                    >
                      <Icon aria-hidden className="h-5 w-5 shrink-0 text-ink-2" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </>
);

export default Contacto;


import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqItems = [
  {
    question: "¿Cómo medimos la velocidad?",
    answer: "Usamos ping desde Santiago y GTmetrix con servidores locales. También realizamos pruebas de carga con herramientas como LoadImpact y Pingdom para medir el tiempo de respuesta bajo diferentes condiciones."
  },
  {
    question: "¿Cada cuánto actualizamos el ranking?",
    answer: "El ranking se actualiza mensualmente con nuevos tests. Realizamos pruebas continuas para asegurarnos que la información sea lo más actual posible."
  },
  {
    question: "¿Influyen las comisiones en el ranking?",
    answer: "No, los puntajes son objetivos e independientes de afiliaciones. Nuestra metodología se basa estrictamente en el rendimiento técnico y la experiencia del usuario."
  },
  {
    question: "¿Por qué HostingPlus lidera el ranking?",
    answer: "Combina datacenter local en Chile, tecnologías premium como LiteSpeed Enterprise y BitNinja, un historial de 0 reclamos en Reclamos.cl en los últimos años, y un soporte técnico disponible 24/7 con tiempos de respuesta excepcionales."
  }
];

const FAQ = () => {
  return (
    <section id="faq" className="py-16 container mx-auto px-4">
      <h2 className="text-3xl font-semibold text-center mb-8">Preguntas frecuentes</h2>
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="space-y-4">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-white p-4 rounded-lg shadow">
              <AccordionTrigger className="font-medium text-left">{item.question}</AccordionTrigger>
              <AccordionContent className="pt-2 text-[#555]">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        {/* Schema.org FAQPage markup */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": ${JSON.stringify(faqItems.map(item => ({
              "@type": "Question",
              "name": item.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
              }
            })))}
          }
        `}} />
      </div>
    </section>
  );
};

export default FAQ;

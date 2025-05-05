
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqItems = [
  {
    question: "¿Cómo medimos la velocidad?",
    answer: "Ping desde Santiago y GTmetrix con servidores locales."
  },
  {
    question: "¿Cada cuánto actualizamos el ranking?",
    answer: "Mensualmente, con pruebas continuas para mantener la información actualizada."
  },
  {
    question: "¿Influyen las comisiones en el ranking?",
    answer: "Algunos enlaces son afiliados, pero los puntajes se basan estrictamente en datos objetivos y experiencia de usuario."
  }
];

const SimpleFAQ = () => {
  return (
    <section id="faq" className="bg-white py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold text-center mb-8 text-[#2B2D42]">Preguntas frecuentes</h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-[#F7F9FC] p-4 rounded-lg">
                <AccordionTrigger className="font-medium">{item.question}</AccordionTrigger>
                <AccordionContent className="pt-2 text-[#555]">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default SimpleFAQ;

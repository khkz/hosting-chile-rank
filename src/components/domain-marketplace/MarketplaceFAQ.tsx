import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "¿Cómo comprar un dominio premium?",
    answer:
      "Es muy sencillo: elige el dominio que te interesa, haz clic en 'Comprar' o 'Hacer Oferta', completa el formulario de contacto y nos pondremos en contacto contigo para coordinar el pago y la transferencia.",
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer:
      "Aceptamos transferencia bancaria, WebPay, y tarjetas de crédito. Para montos mayores, también ofrecemos planes de pago en cuotas sin interés.",
  },
  {
    question: "¿Cuánto demora la transferencia del dominio?",
    answer:
      "Una vez confirmado el pago, la transferencia se realiza en 24-48 horas para dominios .cl. Para dominios .com y otras extensiones, puede tomar entre 5-7 días hábiles.",
  },
  {
    question: "¿Qué incluye la compra?",
    answer:
      "La compra incluye la transferencia completa del dominio a tu nombre, incluyendo el primer año de renovación. También te ayudamos a configurar los DNS si lo necesitas.",
  },
  {
    question: "¿Puedo negociar el precio?",
    answer:
      "¡Por supuesto! Los precios publicados son orientativos. Si tienes un presupuesto diferente, envíanos tu oferta y evaluaremos cada caso de forma individual.",
  },
  {
    question: "¿Ofrecen garantía?",
    answer:
      "Sí, garantizamos que todos los dominios están libres de problemas legales y son transferibles. Si por algún motivo la transferencia no se puede completar, te devolvemos el 100% de tu dinero.",
  },
];

export function MarketplaceFAQ() {
  return (
    <div className="measure">
      <h2 className="t-h2 text-ink">Preguntas frecuentes</h2>
      <p className="t-lead mt-3">Todo lo que necesitas saber sobre la compra de dominios</p>
      <Accordion type="single" collapsible className="mt-6 w-full border-t border-rule">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border-rule">
            <AccordionTrigger className="min-h-11 text-left font-semibold text-ink">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="t-body text-ink-2">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

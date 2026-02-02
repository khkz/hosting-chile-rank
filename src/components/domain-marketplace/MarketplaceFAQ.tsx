import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

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
    <Card className="p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <HelpCircle className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Preguntas Frecuentes</h2>
          <p className="text-muted-foreground">
            Todo lo que necesitas saber sobre la compra de dominios
          </p>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
}

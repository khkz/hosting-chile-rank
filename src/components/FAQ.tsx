
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "¿Cada cuánto se actualiza el ranking?",
    answer: "Actualizamos nuestro ranking cada 3 meses para reflejar cambios en el rendimiento, tecnología y servicio de los proveedores. La última actualización fue realizada en mayo 2025."
  },
  {
    question: "¿Cómo miden la velocidad real?",
    answer: "Utilizamos servidores de prueba en cada proveedor con sitios WordPress idénticos. Medimos tiempo de carga (LCP), TTFB y velocidad de respuesta desde diferentes ubicaciones en Chile mediante GTmetrix y WebPageTest."
  },
  {
    question: "¿Ganan comisión por los enlaces?",
    answer: "Sí, algunos enlaces del ranking son de afiliados, lo que significa que podemos recibir una comisión si contratas a través de ellos. Sin embargo, esto no influye en nuestras evaluaciones ni en las posiciones del ranking."
  },
  {
    question: "¿Por qué HostingPlus lidera el ranking?",
    answer: "HostingPlus lidera el ranking principalmente por su excelente balance entre rendimiento y precio. Su datacenter propio en Chile garantiza velocidades superiores, mientras que su historial de cero reclamos formales desde 2020 confirma la calidad de su servicio al cliente."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <section className="py-12 bg-white" id="faq">
      {/* <!-- section 4: FAQ --> */}
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-primary">
          Preguntas Frecuentes
        </h2>
        <div className="max-w-3xl mx-auto">
          {faqItems.map((item, index) => (
            <div 
              key={index} 
              className="mb-4 border border-gray-200 rounded-lg overflow-hidden shadow-sm"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="flex justify-between items-center w-full p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none"
              >
                <span className="font-medium text-primary">{item.question}</span>
                <svg 
                  className={cn(
                    "w-5 h-5 transition-transform duration-300", 
                    openIndex === index ? "transform rotate-180" : ""
                  )}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              <div 
                className={cn(
                  "transition-all duration-300 overflow-hidden",
                  openIndex === index ? "max-h-96 p-4" : "max-h-0"
                )}
              >
                <p className="text-primary/80">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

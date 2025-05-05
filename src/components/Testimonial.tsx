
import React from 'react';
import { Card } from '@/components/ui/card';
import { Star, Quote, CheckCircle } from 'lucide-react';

const Testimonial = () => {
  const testimonials = [
    {
      name: "Carolina Méndez",
      company: "Diseñadora Web",
      text: "Desde que migré a HostingPlus mi sitio carga 3 veces más rápido. Los clientes lo notan y mis conversiones aumentaron un 27% el primer mes. El soporte técnico siempre responde en minutos.",
      rating: 5,
      verified: true
    },
    {
      name: "Rodrigo Valenzuela",
      company: "Agencia de Marketing Digital",
      text: "EcoHosting ha revolucionado nuestro negocio. Su combinación de velocidad, seguridad y compromiso medioambiental nos permite ofrecer un mejor servicio a nuestros clientes. 100% recomendado.",
      rating: 5,
      verified: true
    },
    {
      name: "María José Soto",
      company: "Tienda Online",
      text: "Probé varios proveedores de hosting antes de encontrar HostingPlus. La diferencia es notable: mejor rendimiento SEO, menos tiempo de carga y un equipo de soporte que realmente entiende de e-commerce.",
      rating: 5,
      verified: true
    }
  ];

  return (
    <section className="container mx-auto py-16 px-4">
      <h2 className="text-2xl md:text-3xl font-semibold text-center mb-2 text-[#2B2D42]">Lo que dicen nuestros usuarios</h2>
      <p className="text-center mb-8 text-gray-600 max-w-2xl mx-auto">
        Testimonios verificados de clientes reales que han mejorado su presencia online con los mejores servicios de hosting en Chile.
      </p>
      
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              ))}
            </div>
            <div className="mb-4 relative">
              <Quote className="w-8 h-8 text-gray-200 absolute -top-2 -left-2" />
              <p className="text-gray-700 italic relative z-10 pl-2">"{testimonial.text}"</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#2B2D42]">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.company}</p>
              </div>
              {testimonial.verified && (
                <div className="flex items-center text-green-600 text-xs">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Verificado
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-6 grayscale opacity-80 hover:opacity-100 transition">
        <img src="/logo-hostingplus-new.svg" className="h-8" alt="HostingPlus" />
        <img src="/logo-ecohosting-new.svg" className="h-8" alt="EcoHosting" />
        <img src="/logo-hostgator.svg" className="h-8" alt="HostGator" />
        <img src="/logo-godaddy.svg" className="h-8" alt="GoDaddy" />
      </div>
    </section>
  );
};

export default Testimonial;

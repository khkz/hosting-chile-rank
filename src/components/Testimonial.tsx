
import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonial = () => {
  const testimonials = [
    {
      name: "Valentina R.",
      company: "TiendaEco.cl",
      quote: "Me cambié a EcoHosting y mi web carga 38% más rápido. El soporte es excepcional.",
      rating: 5,
      avatar: "VR"
    },
    {
      name: "Jorge L.",
      company: "StartApp",
      quote: "Con HostingPlus llevamos más de un año sin caídas; el chat 24/7 es real y efectivo.",
      rating: 5,
      avatar: "JL"
    },
    {
      name: "Camila S.",
      company: "Diseñadora freelance",
      quote: "Probé varios hostings; ninguno tan sencillo como EcoHosting para crear correos ilimitados.",
      rating: 5,
      avatar: "CS"
    },
    {
      name: "Rodrigo M.",
      company: "RopaPro",
      quote: "En Black Friday duplicamos visitas y HostingPlus aguantó sin problemas. Increíble.",
      rating: 5,
      avatar: "RM"
    }
  ];

  return (
    <section className="bg-gradient-to-b from-[#F7F9FC] to-white py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2B2D42] mb-4">
            Lo que dicen nuestros usuarios
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Miles de empresas ya confiaron en nuestras recomendaciones
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#EF233C] to-pink-400 mx-auto mt-6 rounded-full"></div>
        </div>
        
        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="group relative bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-[#EF233C]/20 transition-all duration-500 transform hover:-translate-y-2">
              {/* Quote Icon */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[#EF233C] to-[#c41e3a] rounded-full flex items-center justify-center shadow-lg">
                <Quote className="w-6 h-6 text-white" />
              </div>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              {/* Quote */}
              <p className="text-[#2B2D42] text-lg mb-6 italic leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                "{testimonial.quote}"
              </p>
              
              {/* Author */}
              <div className="flex items-center">
                <div className="w-14 h-14 bg-gradient-to-br from-[#EDF2F4] to-gray-200 rounded-full flex items-center justify-center text-[#2B2D42] font-bold text-lg shadow-sm">
                  {testimonial.avatar}
                </div>
                <div className="ml-4">
                  <p className="font-bold text-[#2B2D42] text-lg">{testimonial.name}</p>
                  <p className="text-gray-600">{testimonial.company}</p>
                </div>
              </div>
              
              {/* Hover accent */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#EF233C] to-pink-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>
          ))}
        </div>
        
        {/* Partners Section */}
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-[#2B2D42] mb-8">
            Proveedores que recomendamos
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-70 hover:opacity-100 transition-opacity duration-300">
            <div className="group">
              <img src="/lovable-uploads/528891ff-3b55-486e-a927-e4f6d373a3c5.png" className="h-10 grayscale group-hover:grayscale-0 transition-all duration-300" alt="HostingPlus" />
            </div>
            <div className="group">
              <img src="/logo-ecohosting-new.svg" className="h-10 grayscale group-hover:grayscale-0 transition-all duration-300" alt="EcoHosting" />
            </div>
            <div className="group">
              <img src="/logo-hostgator.svg" className="h-10 grayscale group-hover:grayscale-0 transition-all duration-300" alt="HostGator" />
            </div>
            <div className="group">
              <img src="/logo-godaddy.svg" className="h-10 grayscale group-hover:grayscale-0 transition-all duration-300" alt="GoDaddy" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;

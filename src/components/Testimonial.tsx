
import React from 'react';

const Testimonial = () => {
  const testimonials = [
    {
      name: "Valentina R.",
      company: "TiendaEco.cl",
      quote: "Me cambié a EcoHosting y mi web carga 38 % más rápido."
    },
    {
      name: "Jorge L.",
      company: "StartApp",
      quote: "Con HostingPlus llevamos más de un año sin caídas; el chat 24/7 es real."
    },
    {
      name: "Camila S.",
      company: "Diseñadora freelance",
      quote: "Probé varios hostings; ninguno tan sencillo como EcoHosting para crear correos ilimitados."
    },
    {
      name: "Rodrigo M.",
      company: "RopaPro",
      quote: "En Black Friday duplicamos visitas y HostingPlus aguantó sin problemas."
    }
  ];

  return (
    <section className="container mx-auto py-16 flex flex-col items-center gap-8 px-4">
      <h2 className="text-2xl font-semibold text-center text-[#2B2D42]">Testimonios</h2>
      
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <p className="text-[#2B2D42] mb-4 italic">"{testimonial.quote}"</p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-[#EDF2F4] rounded-full flex items-center justify-center text-[#2B2D42] font-semibold">
                {testimonial.name.charAt(0)}
              </div>
              <div className="ml-3">
                <p className="font-semibold text-[#2B2D42]">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.company}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex flex-wrap justify-center gap-6 grayscale opacity-80 hover:opacity-100 transition">
        <img src="/logo-hostingplus.png" className="h-8" alt="HostingPlus" />
        <img src="/logo-ecohosting.png" className="h-8" alt="EcoHosting" />
        <img src="/logo-hostgator.svg" className="h-8" alt="HostGator" />
        <img src="/logo-godaddy.svg" className="h-8" alt="GoDaddy" />
      </div>
    </section>
  );
};

export default Testimonial;

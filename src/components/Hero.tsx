import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Star, Users, Award, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

// Dynamic Activity Counter Component
const DynamicActivityCounter = () => {
  const [activity, setActivity] = useState({
    count: 8,
    city: 'Santiago',
    provider: 'HostingPlus'
  });

  const cities = ['Santiago', 'Valparaíso', 'Concepción', 'La Serena', 'Temuco', 'Antofagasta'];
  const providers = ['HostingPlus', 'EcoHosting', 'HostGator'];

  useEffect(() => {
    const updateActivity = () => {
      setActivity({
        count: Math.floor(Math.random() * 8) + 8, // 8-15
        city: cities[Math.floor(Math.random() * cities.length)],
        provider: providers[Math.floor(Math.random() * providers.length)]
      });
    };

    // Update every 30 seconds
    const interval = setInterval(updateActivity, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
      <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full animate-pulse-subtle">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-ping-slow"></div>
        <span className="text-sm font-medium text-green-700">
          {activity.count} usuarios de {activity.city} eligieron {activity.provider} esta semana
        </span>
      </div>
    </div>
  );
};

const Hero = () => {
  return (
    <section className="relative py-20 md:py-28 lg:py-32 bg-gradient-to-br from-warm-cream via-white to-warm-peach overflow-hidden">
      {/* Mobile background image */}
      <div className="absolute inset-0 md:hidden">
        <img 
          src="/images/hero-people.png"
          alt="Personas eligiendo hosting"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/90 to-white/85"></div>
      </div>
      
      {/* Imagen de fondo grande con degradados - Solo desktop */}
      <div className="absolute inset-0 hidden md:block">
        {/* Imagen hero */}
        <img 
          src="/images/hero-person.png"
          alt="Persona eligiendo el mejor hosting para su proyecto"
          className="absolute right-0 top-0 bottom-0 w-[70%] lg:w-[60%] h-full object-cover object-[70%_center]"
          loading="eager"
        />
        
        {/* Degradado principal - Izquierda a Derecha */}
        <div className="absolute inset-0 bg-gradient-to-r from-white from-35% via-white/95 via-55% to-transparent to-85%"></div>
        
        {/* Degradado secundario - Tonalidad cálida sutil */}
        <div className="absolute inset-0 bg-gradient-to-b from-warm-cream/20 via-transparent to-warm-peach/10"></div>
      </div>
      
      {/* Contenido - Encima de todo */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          
          {/* Columna Contenido */}
          <div className="text-center md:text-left">
            
            {/* Emotional Pre-Headline */}
            <div className="mb-4">
              <p className="text-brand-red font-semibold text-sm md:text-base animate-fade-in">
                ¿Cansado de hosting lento que frustra a tus clientes?
              </p>
            </div>
            
            {/* Trust Badges - Minimalistas */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-8">
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                <span className="text-sm font-medium">5 años evaluando hosting</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                <span className="text-sm font-medium">+22.000 sitios analizados</span>
              </div>
            </div>

            {/* Headline - Moderado, sin subrayado animado */}
            <h1 className="font-poppins text-3xl md:text-5xl lg:text-6xl font-bold text-[#2B2D42] mb-6 leading-tight">
              Encuentra el{' '}
              <span className="text-brand-red">
                mejor hosting
              </span>
              <br />
              para tu proyecto
            </h1>
            
            {/* Descripción - Tamaño moderado */}
            <p className="mt-4 text-base md:text-lg text-gray-600 leading-relaxed">
              Te ayudamos a elegir entre los{' '}
              <Link to="/directorio-hosting-chile" className="text-brand-red font-semibold hover:underline">
                mejores proveedores certificados de Chile
              </Link>.
              <br />
              Comparamos velocidad, seguridad y precios para que tú no tengas que hacerlo.
              <br />
              <span className="text-sm text-gray-700 font-medium">
                Servidores en Santiago y soporte 24/7 en Chile
              </span>
            </p>
            
            {/* Social Proof - Alineado a la izquierda en desktop */}
            <div className="flex items-center justify-center md:justify-start gap-2 mt-6 mb-8">
              <div className="flex">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-warm-yellow text-warm-yellow" />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">
                Más de 500 usuarios satisfechos nos recomiendan
              </span>
            </div>
            
            {/* CTA Button */}
            <div className="mt-8">
              <Button 
                asChild 
                className="cta-primary px-10 py-5 text-lg rounded-xl font-poppins font-semibold shadow-lg hover:shadow-xl animate-pulse-subtle hover:animate-none min-h-[44px] touch-manipulation"
              >
                <Link to="/cotiza-hosting">
                  Empieza ahora gratis
                  <span className="ml-2">→</span>
                </Link>
              </Button>
              <p className="text-sm text-gray-600 mt-3">
                ✓ Gratis y sin compromiso ✓ Análisis honesto
              </p>
            </div>
            
            {/* Trust Indicators - Alineados a la izquierda en desktop */}
            <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-12">
              <div className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-brand-red" />
                <span className="text-sm font-medium">Sin sesgos, sin favoritismo</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-brand-red" />
                <span className="text-sm font-medium">Te decimos la verdad</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-brand-red" />
                <span className="text-sm font-medium">Todo verificado por nosotros</span>
              </div>
            </div>
            
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Hero;

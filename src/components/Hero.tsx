import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative py-20 md:py-28 lg:py-32 bg-gradient-to-br from-warm-cream via-white to-warm-peach overflow-hidden">
      {/* Mobile background image */}
      <div className="absolute inset-0 md:hidden">
        <img 
          src="/images/hero-people.png"
          alt="Personas eligiendo hosting"
          className="w-full h-full object-cover"
          width={800}
          height={600}
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/90 to-white/85"></div>
      </div>
      
      {/* Imagen de fondo grande con degradados - Solo desktop */}
      <div className="absolute inset-0 hidden md:block">
        <img 
          src="/images/hero-person.png"
          alt="Persona eligiendo el mejor hosting para su proyecto"
          className="absolute right-0 top-0 bottom-0 w-[70%] lg:w-[60%] h-full object-cover object-[70%_center]"
          width={1200}
          height={800}
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white from-35% via-white/95 via-55% to-transparent to-85%"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-warm-cream/20 via-transparent to-warm-peach/10"></div>
      </div>
      
      {/* Contenido - Encima de todo */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <div className="text-center md:text-left">
            
            <div className="mb-4">
              <p className="text-brand-red font-semibold text-sm md:text-base animate-fade-in">
                ¿Cansado de hosting lento que frustra a tus clientes?
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-8">
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                <span className="text-sm font-medium">5 años evaluando hosting</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                <span className="text-sm font-medium">+5.700 dominios .CL analizados</span>
              </div>
            </div>

            <h1 className="font-poppins text-3xl md:text-5xl lg:text-6xl font-bold text-[#2B2D42] mb-6 leading-tight">
              Encuentra el{' '}
              <span className="text-brand-red">
                mejor hosting
              </span>
              <br />
              para tu proyecto
            </h1>
            
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
            
            <div className="flex items-center justify-center md:justify-start gap-2 mt-6 mb-8">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Check className="w-4 h-4 text-brand-red" />
                <span>20 proveedores verificados</span>
              </div>
              <span className="text-gray-300">·</span>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Check className="w-4 h-4 text-brand-red" />
                <span>+5.700 dominios analizados</span>
              </div>
            </div>
            
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

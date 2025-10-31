
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Star, Users, Award, Shield } from 'lucide-react';
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
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/90 to-white/85"></div>
      </div>
      
      {/* Círculos decorativos de fondo */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-brand-red rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-[60%] w-48 h-48 bg-brand-red rounded-full blur-3xl"></div>
      </div>
      
      {/* Imagen de fondo grande con degradados - Solo desktop */}
      <div className="absolute inset-0 hidden md:block">
        {/* Imagen hero */}
        <img 
          src="/images/hero-person.png"
          alt="Persona eligiendo el mejor hosting para su proyecto"
          className="absolute right-0 top-0 bottom-0 w-[60%] h-full object-cover object-[70%_center]"
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

            {/* Dynamic Social Proof Counter */}
            <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full animate-pulse-subtle">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping-slow"></div>
                <span className="text-sm font-medium text-green-700">
                  12 usuarios eligieron su hosting hoy
                </span>
              </div>
            </div>
            
            {/* Trust Badges - Alineados a la izquierda en desktop */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-8">
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-brand-red/20">
                <Award className="w-4 h-4 text-brand-red" />
                <span className="text-sm font-medium text-[#2B2D42]">5 años de experiencia</span>
              </div>
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-brand-red/20">
                <Users className="w-4 h-4 text-brand-red" />
                <span className="text-sm font-medium text-[#2B2D42]">+22,000 sitios evaluados</span>
              </div>
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-brand-red/20">
                <Shield className="w-4 h-4 text-brand-red" />
                <span className="text-sm font-medium text-[#2B2D42]">100% independiente</span>
              </div>
            </div>

            {/* Headline - Grande, alineado a la izquierda en desktop */}
            <h1 className="font-poppins text-4xl md:text-6xl lg:text-7xl font-bold text-[#2B2D42] mb-8 leading-tight">
              Encuentra el{' '}
              <span className="text-brand-red relative inline-block">
                mejor hosting
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-brand-red to-brand-red-light rounded-full"></div>
              </span>
              <br />
              para tu proyecto
            </h1>
            
            {/* Descripción - Alineada a la izquierda en desktop */}
            <p className="mt-6 text-lg md:text-xl text-[#555] leading-relaxed">
              Te ayudamos a elegir entre los{' '}
              <Link to="/directorio-hosting-chile" className="text-brand-red font-semibold hover:underline">
                mejores proveedores certificados de Chile
              </Link>.
              <br />
              Comparamos velocidad, seguridad y precios para que tú no tengas que hacerlo.
              <br />
              <span className="text-base text-brand-red-dark font-medium">
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
            
            {/* CTA Button - Alineado a la izquierda en desktop */}
            <div className="mt-10">
              <Button 
                asChild 
                className="bg-gradient-to-r from-brand-red to-brand-red-dark 
                           hover:from-brand-red-dark hover:to-brand-red-dark 
                           text-white px-12 py-6 text-xl rounded-2xl 
                           shadow-xl shadow-brand-red/30 
                           hover:shadow-2xl hover:shadow-brand-red/40 
                           transform hover:scale-105 transition-all duration-300 
                           font-poppins font-semibold"
              >
                <Link to="/cotiza-hosting">
                  Empieza ahora gratis
                  <span className="ml-2">→</span>
                </Link>
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                ✓ Gratis y sin compromiso ✓ Te respondemos en 24h ✓ Análisis honesto
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

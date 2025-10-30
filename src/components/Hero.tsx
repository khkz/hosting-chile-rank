
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Star, Users, Award, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-br from-warm-cream via-white to-warm-peach overflow-hidden">
      {/* Background Pattern - Círculos rojos sutiles */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-40 h-40 bg-brand-red rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-brand-red rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-[60%_40%] gap-12 items-center">
          
          {/* Columna Izquierda - Contenido */}
          <div className="text-center md:text-left">
            
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
            <h1 className="font-poppins text-4xl md:text-5xl lg:text-6xl font-bold text-[#2B2D42] mb-8 leading-tight">
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
              <strong className="text-brand-red">mejores proveedores chilenos</strong>.
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
          
          {/* Columna Derecha - Imagen */}
          <div className="relative hidden md:block">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-brand-red/10">
              <img 
                src="/images/hero-people.png"
                alt="Personas eligiendo el mejor hosting para su proyecto juntas"
                className="w-full h-auto object-cover"
                loading="eager"
              />
            </div>
            {/* Elemento decorativo */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand-red/20 rounded-full blur-3xl"></div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Hero;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Star, Users, Award, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative py-12 md:py-20 bg-gradient-to-br from-warm-cream via-white to-warm-peach overflow-hidden">
      {/* Background Pattern - Círculos cálidos */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-warm-orange rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-warm-orange-dark rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          
          {/* COLUMNA IZQUIERDA - Contenido */}
          <div className="text-left md:text-left text-center">
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3 mb-6 justify-center md:justify-start">
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-warm-orange/20">
                <Award className="w-4 h-4 text-warm-orange" />
                <span className="text-sm font-medium text-[#2B2D42]">5 años de experiencia</span>
              </div>
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-warm-orange/20">
                <Users className="w-4 h-4 text-warm-orange" />
                <span className="text-sm font-medium text-[#2B2D42]">+22,000 sitios evaluados</span>
              </div>
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-warm-orange/20">
                <Shield className="w-4 h-4 text-warm-orange" />
                <span className="text-sm font-medium text-[#2B2D42]">100% independiente</span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="font-poppins text-3xl md:text-5xl lg:text-6xl font-bold text-[#2B2D42] mb-6 leading-tight">
              Encuentra el{' '}
              <span className="text-warm-orange relative inline-block">
                mejor hosting
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-warm-orange to-warm-orange-light rounded-full"></div>
              </span>
              <br />
              para tu proyecto
            </h1>
            
            {/* Descripción */}
            <p className="mt-6 text-base md:text-lg text-[#555] leading-relaxed">
              Te ayudamos a elegir entre los{' '}
              <strong className="text-warm-orange">mejores proveedores chilenos</strong>.
              <br />
              Comparamos velocidad, seguridad y precios para que tú no tengas que hacerlo.
              <br />
              <span className="text-sm md:text-base text-warm-orange-dark font-medium">
                Servidores en Santiago y soporte 24/7 en Chile
              </span>
            </p>
            
            {/* Social Proof */}
            <div className="flex items-center gap-2 mt-6 mb-8 justify-center md:justify-start">
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
                className="bg-gradient-to-r from-warm-orange to-warm-orange-dark 
                           hover:from-warm-orange-dark hover:to-warm-orange-dark 
                           text-white px-8 md:px-10 py-3 md:py-6 text-base md:text-lg rounded-2xl 
                           shadow-xl shadow-warm-orange/30 
                           hover:shadow-2xl hover:shadow-warm-orange/40 
                           transform hover:scale-105 transition-all duration-300 
                           font-poppins font-semibold"
              >
                <Link to="/cotiza-hosting">
                  Empieza ahora gratis
                  <span className="ml-2">→</span>
                </Link>
              </Button>
              <p className="text-sm text-gray-500 mt-3">
                ✓ Gratis y sin compromiso ✓ Te respondemos en 24h ✓ Análisis honesto
              </p>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex items-center flex-wrap gap-6 mt-8 justify-center md:justify-start">
              <div className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-warm-orange" />
                <span className="text-sm font-medium">Sin sesgos, sin favoritismo</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-warm-orange" />
                <span className="text-sm font-medium">Te decimos la verdad</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-warm-orange" />
                <span className="text-sm font-medium">Todo verificado por nosotros</span>
              </div>
            </div>
          </div>
          
          {/* COLUMNA DERECHA - Imagen Hero */}
          <div className="relative hidden md:block">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-warm-orange/20">
              {/* Placeholder - El usuario puede reemplazar con su imagen */}
              <div className="aspect-[4/3] bg-gradient-to-br from-warm-peach to-warm-cream flex items-center justify-center">
                <div className="text-center p-8">
                  <Users className="w-24 h-24 text-warm-orange mx-auto mb-4 opacity-50" />
                  <p className="text-gray-500 font-poppins text-lg font-medium">
                    Personas eligiendo hosting
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    (Puedes reemplazar esta imagen)
                  </p>
                </div>
              </div>
            </div>
            
            {/* Elemento decorativo */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-warm-orange rounded-full blur-3xl opacity-20"></div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Hero;

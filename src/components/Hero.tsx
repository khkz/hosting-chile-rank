
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Star, Users, Award, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative py-20 text-center bg-gradient-to-br from-[#F7F9FC] via-white to-[#EDF2F4] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#EF233C] rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#2B2D42] rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Trust Badges */}
        <div className="flex justify-center items-center gap-6 mb-8 flex-wrap">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-100">
            <Award className="w-4 h-4 text-[#EF233C]" />
            <span className="text-sm font-medium text-[#2B2D42]">5 años de experiencia</span>
          </div>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-100">
            <Users className="w-4 h-4 text-[#EF233C]" />
            <span className="text-sm font-medium text-[#2B2D42]">+22,000 sitios evaluados</span>
          </div>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-100">
            <Shield className="w-4 h-4 text-[#EF233C]" />
            <span className="text-sm font-medium text-[#2B2D42]">Análisis independiente</span>
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-[#2B2D42] mb-6 leading-tight">
          Elige el <span className="text-[#EF233C] relative">
            Mejor Hosting
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#EF233C] to-pink-400 rounded-full"></div>
          </span><br />
          Chileno <span className="text-2xl md:text-4xl text-gray-600">2025</span>
        </h1>
        
        <p className="mt-6 text-xl text-[#555] max-w-3xl mx-auto leading-relaxed">
          Obtén una <strong>cotización personalizada</strong> para tu proyecto web con los 
          <strong className="text-[#EF233C]"> mejores proveedores de Chile</strong>.
          <br />
          <span className="text-lg text-gray-500">Comparamos velocidad, seguridad y precios por ti.</span>
        </p>
        
        {/* Social Proof */}
        <div className="flex justify-center items-center gap-2 mt-4 mb-8">
          <div className="flex">
            {[1,2,3,4,5].map((star) => (
              <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">4.9/5 basado en +500 reseñas</span>
        </div>
        
        {/* Main CTA */}
        <div className="mt-10">
          <Button asChild className="bg-gradient-to-r from-[#EF233C] to-[#c41e3a] hover:from-[#b3001b] hover:to-[#8b0000] text-white px-10 py-6 text-xl rounded-xl shadow-2xl hover:shadow-[#EF233C]/25 transform hover:scale-105 transition-all duration-300 font-semibold">
            <Link to="/cotiza-hosting">
              Cotiza tu hosting gratis
              <span className="ml-2">→</span>
            </Link>
          </Button>
          <p className="text-sm text-gray-500 mt-3">✓ Sin compromiso ✓ Respuesta en 24h ✓ Comparación gratuita</p>
        </div>
        
        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-8 mt-12 flex-wrap">
          <div className="flex items-center gap-2 text-gray-600">
            <Check className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium">100% Independiente</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Check className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium">Análisis Objetivo</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Check className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium">Datos Verificados</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

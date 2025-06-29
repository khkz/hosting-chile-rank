
import React from 'react';
import BenefitCard from './BenefitCard';
import { Rocket, ShieldCheck, RefreshCw, Headphones } from 'lucide-react';

const Benefits = () => {
  return (
    <section className="bg-gradient-to-b from-white to-[#F7F9FC] py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2B2D42] mb-4">
            ¿Por qué elegirnos?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Analizamos cada detalle para que tomes la mejor decisión para tu proyecto web
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#EF233C] to-pink-400 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <BenefitCard 
            icon={Rocket} 
            title="Velocidad SSD 9×" 
            description="LiteSpeed Enterprise en HostingPlus y EcoHosting para máximo rendimiento" 
          />
          <BenefitCard 
            icon={ShieldCheck} 
            title="Seguridad AI" 
            description="BitNinja WAF y MagicSpam para protección avanzada contra amenazas" 
          />
          <BenefitCard 
            icon={RefreshCw} 
            title="Backups 24h" 
            description="JetBackup con restauraciones de un clic para tranquilidad total" 
          />
          <BenefitCard 
            icon={Headphones} 
            title="Soporte 24/7" 
            description="Equipo local en Chile disponible en español las 24 horas" 
          />
        </div>

        {/* Additional Trust Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-[#2B2D42] to-gray-800 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-6">Más de 22,000 sitios confían en nuestras recomendaciones</h3>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#EF233C] mb-2">99.9%</div>
                <div className="text-gray-300">Uptime garantizado</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#EF233C] mb-2">< 200ms</div>
                <div className="text-gray-300">Tiempo de respuesta</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#EF233C] mb-2">24/7</div>
                <div className="text-gray-300">Soporte técnico</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;

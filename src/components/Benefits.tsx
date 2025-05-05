
import React from 'react';
import BenefitCard from './BenefitCard';
import { Rocket, ShieldCheck, RefreshCw, Headphones } from 'lucide-react';

const Benefits = () => {
  return (
    <section className="bg-white py-12">
      <div className="container mx-auto grid md:grid-cols-4 gap-8 text-center px-4">
        <BenefitCard 
          icon={Rocket} 
          title="Velocidad SSD 9×" 
          description="LiteSpeed Enterprise en HostingPlus y EcoHosting" 
        />
        <BenefitCard 
          icon={ShieldCheck} 
          title="Seguridad AI" 
          description="BitNinja WAF y MagicSpam" 
        />
        <BenefitCard 
          icon={RefreshCw} 
          title="Backups 24 h" 
          description="JetBackup restauraciones un clic" 
        />
        <BenefitCard 
          icon={Headphones} 
          title="Soporte 24/7" 
          description="Equipo local Chile en español" 
        />
      </div>
    </section>
  );
};

export default Benefits;


import React from 'react';
import { LucideIcon } from 'lucide-react';

interface BenefitCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="group relative bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#EF233C]/20 transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#EF233C]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Icon Container */}
      <div className="relative mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#EF233C] to-[#c41e3a] rounded-2xl shadow-lg group-hover:shadow-[#EF233C]/30 transition-all duration-300 group-hover:scale-110">
          <Icon size={28} className="text-white" />
        </div>
        {/* Decorative circle */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-[#EF233C]/20 to-transparent rounded-full group-hover:scale-150 transition-transform duration-500"></div>
      </div>
      
      <div className="relative">
        <h3 className="font-bold text-xl text-[#2B2D42] mb-3 group-hover:text-[#EF233C] transition-colors duration-300">
          {title}
        </h3>
        <p className="text-[#555] leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
          {description}
        </p>
      </div>
      
      {/* Hover accent line */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#EF233C] to-pink-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
    </div>
  );
};

export default BenefitCard;

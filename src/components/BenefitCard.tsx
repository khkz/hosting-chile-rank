
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface BenefitCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200">
      {/* Icon Container */}
      <div className="mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-100 rounded-xl">
          <Icon size={24} className="text-gray-700" />
        </div>
      </div>
      
      <div>
        <h3 className="font-bold text-xl text-gray-900 mb-3">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default BenefitCard;

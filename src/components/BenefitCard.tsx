
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface BenefitCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center p-4">
      <div className="text-[#EF233C] mb-3">
        <Icon size={32} />
      </div>
      <h3 className="font-semibold text-lg text-[#2B2D42]">{title}</h3>
      <p className="mt-2 text-sm text-[#555]">{description}</p>
    </div>
  );
};

export default BenefitCard;

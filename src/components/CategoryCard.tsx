
import React from 'react';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface CategoryCardProps {
  title: string;
  imageSrc: string;
  href: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, imageSrc, href }) => {
  return (
    <Link to={href}>
      <Card className="p-6 text-center hover:shadow-lg transition-shadow">
        <div className="w-16 h-16 mx-auto mb-4 bg-[#F7F9FC] rounded-full flex items-center justify-center">
          <img src={imageSrc} alt={title} className="w-8 h-8" />
        </div>
        <h3 className="font-semibold text-[#2B2D42]">{title}</h3>
      </Card>
    </Link>
  );
};

export default CategoryCard;

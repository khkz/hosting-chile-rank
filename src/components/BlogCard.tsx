
import React from 'react';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface BlogCardProps {
  title: string;
  href: string;
  imageSrc: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ title, href, imageSrc }) => {
  return (
    <Link to={href}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-video bg-gray-200 relative">
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            Imagen del artículo
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-medium text-[#2B2D42] hover:text-[#EF233C]">{title}</h3>
          <p className="mt-2 text-sm text-[#555]">Leer más →</p>
        </div>
      </Card>
    </Link>
  );
};

export default BlogCard;

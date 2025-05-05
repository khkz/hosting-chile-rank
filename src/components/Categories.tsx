
import React from 'react';
import CategoryCard from './CategoryCard';
import { Server, Database, Globe, Users } from 'lucide-react';

const Categories = () => {
  const categories = [
    {
      title: "Web Hosting",
      icon: <Globe className="w-8 h-8 text-blue-600" />,
      href: "/web-hosting"
    },
    {
      title: "VPS",
      icon: <Server className="w-8 h-8 text-green-600" />,
      href: "/vps-hosting"
    },
    {
      title: "Dedicados",
      icon: <Database className="w-8 h-8 text-purple-600" />,
      href: "/servidores-dedicados"
    },
    {
      title: "Reseller",
      icon: <Users className="w-8 h-8 text-orange-600" />,
      href: "/reseller-hosting"
    }
  ];

  return (
    <section className="container mx-auto py-16 px-4">
      <h2 className="text-2xl font-semibold text-center mb-8 text-[#2B2D42]">Explora por tipo de servicio</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <CategoryCard 
            key={index}
            title={category.title} 
            icon={category.icon}
            href={category.href} 
          />
        ))}
      </div>
    </section>
  );
};

export default Categories;

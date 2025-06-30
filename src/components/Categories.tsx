
import React from 'react';
import { House, Cpu, Server, Shield, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';

const Categories = () => {
  const categoryData = [
    {
      title: "Mejor Hosting 2025",
      icon: <Star className="h-8 w-8 text-yellow-600" />,
      href: "/mejor-hosting-chile-2025",
      featured: true
    },
    {
      title: "Web Hosting",
      icon: <House className="h-8 w-8 text-blue-600" />,
      href: "/guia-elegir-hosting"
    },
    {
      title: "VPS",
      icon: <Cpu className="h-8 w-8 text-green-600" />,
      href: "/guia-elegir-vps"
    },
    {
      title: "Dedicados",
      icon: <Server className="h-8 w-8 text-red-600" />,
      href: "/guia-elegir-servidor-dedicado"
    },
    {
      title: "SSL",
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      href: "/guia-elegir-ssl"
    }
  ];

  return (
    <section className="container mx-auto py-16 px-4">
      <h2 className="text-2xl font-semibold text-center mb-8 text-[#2B2D42]">Explora por tipo de servicio</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-6">
        {categoryData.map((category, index) => (
          <Link key={index} to={category.href}>
            <Card className={`p-6 text-center hover:shadow-lg transition-shadow ${
              category.featured ? 'border-2 border-[#EF233C] bg-gradient-to-b from-[#EF233C]/5 to-white' : ''
            }`}>
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                category.featured ? 'bg-[#EF233C]/10' : 'bg-[#F7F9FC]'
              }`}>
                {category.icon}
              </div>
              <h3 className={`font-semibold ${category.featured ? 'text-[#EF233C]' : 'text-[#2B2D42]'}`}>
                {category.title}
              </h3>
              {category.featured && (
                <p className="text-xs text-[#EF233C] mt-1 font-medium">Guía actualizada 2025</p>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;

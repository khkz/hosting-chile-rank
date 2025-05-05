
import React from 'react';
import { House, Cpu, Server, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';

const Categories = () => {
  const categoryData = [
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
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
        {categoryData.map((category, index) => (
          <Link key={index} to={category.href}>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#F7F9FC] rounded-full flex items-center justify-center">
                {category.icon}
              </div>
              <h3 className="font-semibold text-[#2B2D42]">{category.title}</h3>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;

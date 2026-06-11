import React from 'react';
import { House, ShoppingBag, Building2, Cpu, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';

const Categories = () => {
  const categoryData = [
    {
      title: 'Mejor Hosting 2026',
      icon: <Star className="h-8 w-8 text-yellow-600" />,
      href: '/mejor-hosting-chile-2026',
      featured: true,
      caption: 'Ranking general',
    },
    {
      title: 'Hosting WordPress',
      icon: <House className="h-8 w-8 text-blue-600" />,
      href: '/mejor-hosting-wordpress-chile',
      caption: 'Mejor hosting WP',
    },
    {
      title: 'Hosting Ecommerce',
      icon: <ShoppingBag className="h-8 w-8 text-green-600" />,
      href: '/mejor-hosting-ecommerce-chile',
      caption: 'WooCommerce y tienda',
    },
    {
      title: 'Hosting PYMES',
      icon: <Building2 className="h-8 w-8 text-red-600" />,
      href: '/mejor-hosting-pymes-chile',
      caption: 'Email + sitio empresa',
    },
    {
      title: 'VPS Chile',
      icon: <Cpu className="h-8 w-8 text-purple-600" />,
      href: '/mejor-vps-chile',
      caption: 'KVM + NVMe + root',
    },
  ];

  return (
    <section className="container mx-auto py-16 px-4">
      <h2 className="text-2xl font-semibold text-center mb-8 text-[#2B2D42]">Explora por tipo de servicio</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-6">
        {categoryData.map((category, index) => (
          <Link key={index} to={category.href}>
            <Card className={`p-6 text-center hover:shadow-lg transition-shadow min-h-[180px] ${
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
              <p className="text-xs text-muted-foreground mt-1">{category.caption}</p>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;


import React from 'react';
import CategoryCard from './CategoryCard';

const Categories = () => {
  return (
    <section className="container mx-auto py-16 px-4">
      <h2 className="text-2xl font-semibold text-center mb-8 text-[#2B2D42]">Explora por tipo de servicio</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
        <CategoryCard 
          title="Web Hosting" 
          imageSrc="/logo-hostingplus-new.svg" 
          href="/catalogo#web" 
        />
        <CategoryCard 
          title="VPS" 
          imageSrc="/logo-webhosting.svg" 
          href="/catalogo#vps" 
        />
        <CategoryCard 
          title="Dedicados" 
          imageSrc="/logo-smarthost.svg" 
          href="/catalogo#dedicado" 
        />
        <CategoryCard 
          title="Reseller" 
          imageSrc="/logo-prohosting.svg" 
          href="/catalogo#reseller" 
        />
      </div>
    </section>
  );
};

export default Categories;

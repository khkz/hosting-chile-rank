import React, { useState, useMemo } from 'react';
import HostingCard from './HostingCard';
import { Trophy, Check, Star, Shield, Zap, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import ItemListSchema from '@/components/SEO/ItemListSchema';
import AvailabilityBadge from './AvailabilityBadge';

const hostingData = [
  {
    position: 1,
    name: "HostingPlus.cl",
    displayName: { first: "Hosting", second: "Plus", firstColor: "text-[#2B2D42]", secondColor: "text-[#EF233C]" },
    logo: "/logo-hostingplus-official.png",
    rating: 9.9,
    speedRating: 9.8,
    priceRating: 9.5,
    features: [
      "Carga más rápida en Chile (servidores en Santiago)",
      "Tu sitio protegido 24/7 (bloqueo automático de ataques)",
      "Recupera tu web con un clic (backups automáticos)",
      "Email que llega sin ir a spam (SPF, DKIM y DMARC)"
    ],
    specs: [
      "LiteSpeed Enterprise",
      "BitNinja WAF",
      "IP Chile",
      "JetBackup"
    ],
    url: "https://www.hostingplus.cl/",
    isRecommended: true,
    buttonColor: "bg-gradient-to-r from-[#EF233C] to-[#c41e3a]",
    borderColor: "border-[#EF233C]",
    badges: ["Más Popular", "Hecho en Chile", "0 Reclamos"],
    ctaText: "Probar 30 días gratis",
    ctaMicroCopy: "✓ Sin tarjeta ✓ Cancela cuando quieras",
    price: {
      current: 3469,
      original: 19900,
      period: "mensual"
    }
  },
  {
    position: 2,
    name: "EcoHosting.cl",
    displayName: { first: "Eco", second: "Hosting", firstColor: "text-green-600", secondColor: "text-[#2B2D42]" },
    logo: "/logo-ecohosting.png",
    rating: 9.6,
    speedRating: 9.6,
    priceRating: 9.7,
    features: [
      "Servidores en Chile, energía 100% renovable",
      "MagicSpam y backups JetBackup incluidos",
      "Soporte local 24/7",
      "Dominio .CL gratis 1 año"
    ],
    specs: [
      "Apache Optimizado",
      "MagicSpam",
      "IP Chile",
      "JetBackup"
    ],
    url: "https://www.ecohosting.cl/",
    buttonColor: "bg-gradient-to-r from-green-600 to-green-700",
    borderColor: "border-green-200",
    badges: ["Eco-Friendly", "Mejor Precio"],
    ctaText: "Ver planes desde $1.658/mes",
    ctaMicroCopy: "✓ Dominio .CL gratis",
    price: {
      current: 1658,
      original: 4990,
      period: "mensual"
    }
  },
  {
    position: 3,
    name: "HostGator.cl",
    displayName: { first: "Host", second: "Gator", firstColor: "text-orange-500", secondColor: "text-[#2B2D42]" },
    logo: "/logo-hostgator.svg",
    rating: 9.2,
    speedRating: 8.9,
    priceRating: 9.4,
    features: [
      "12 años de experiencia en Chile",
      "Panel de control personalizado",
      "Soporte técnico por chat y teléfono",
      "Garantía de uptime 99.9%"
    ],
    specs: [
      "Apache Standard",
      "ModSecurity",
      "IP Chile",
      "Backups diarios"
    ],
    url: "https://www.hostgator.cl/",
    buttonColor: "bg-gradient-to-r from-orange-500 to-orange-600",
    borderColor: "border-orange-200",
    badges: ["Experiencia", "Confiable"],
    ctaText: "Migración gratis incluida",
    ctaMicroCopy: "✓ 99.9% uptime garantizado",
    price: {
      current: 3490,
      original: null,
      period: "mensual"
    }
  }
];

const HostingRanking = () => {
  const [sortCriteria, setSortCriteria] = useState('overall');
  
  // Sort hosting data based on selected criteria
  const sortedHostingData = useMemo(() => {
    let sortedData = [...hostingData];
    
    switch (sortCriteria) {
      case 'speed':
        sortedData.sort((a, b) => b.speedRating - a.speedRating);
        break;
      case 'price':
        sortedData.sort((a, b) => b.priceRating - a.priceRating);
        break;
      default: // 'overall'
        sortedData.sort((a, b) => b.rating - a.rating);
        break;
    }
    
    return sortedData.map((provider, index) => ({
      ...provider,
      sortPosition: index + 1
    }));
  }, [sortCriteria]);
  
  const getRatingLabel = (provider) => {
    switch (sortCriteria) {
      case 'speed':
        return `${provider.speedRating}/10`;
      case 'price':
        return `${provider.priceRating}/10`;
      default:
        return `${provider.rating}/10`;
    }
  };
  
  const getSchemaItems = () => {
    return sortedHostingData.map(provider => ({
      name: provider.name,
      description: provider.features.join(". "),
      url: provider.url,
      image: `https://eligetuhosting.cl${provider.logo}`,
      brand: provider.name,
      rating: sortCriteria === 'speed' ? provider.speedRating : 
              (sortCriteria === 'price' ? provider.priceRating : provider.rating),
      reviewCount: 150, // Número aproximado de reviews
      price: 3990,
      priceCurrency: "CLP"
    }));
  };
  
  return (
    <section id="ranking" className="py-12 md:py-20 bg-gradient-to-b from-white to-[#F7F9FC]">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#2B2D42] mb-4">
            Top 3 Mejores Hostings Chile
          </h2>
          <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto">
            Ranking independiente basado en pruebas técnicas reales de velocidad, uptime y soporte
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#EF233C] to-pink-400 mx-auto mt-6 rounded-full"></div>
        </div>
        
        <ItemListSchema 
          name="Ranking Mejores Hosting Chile 2026"
          description="Ranking independiente de los mejores proveedores de hosting en Chile basado en pruebas técnicas de velocidad, uptime y soporte"
          items={getSchemaItems()}
          listType="ranking"
        />
        
        {/* Sort Controls - Mobile UX fix (Sprint 1) */}
        <div className="flex justify-center mb-8 md:mb-12">
          <ToggleGroup type="single" value={sortCriteria} onValueChange={(value) => value && setSortCriteria(value)} className="bg-white rounded-2xl p-1.5 md:p-2 shadow-lg border border-gray-100">
            <ToggleGroupItem value="overall" variant="outline" className={`px-6 md:px-6 py-3 md:py-3 rounded-xl text-sm md:text-base font-medium transition-all duration-300 ${sortCriteria === 'overall' ? 'bg-[#2B2D42] text-white shadow-lg' : 'hover:bg-gray-50'} min-h-[44px] touch-manipulation`}>
              <Award className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">General</span>
              <span className="sm:hidden">★</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="speed" variant="outline" className={`px-6 md:px-6 py-3 md:py-3 rounded-xl text-sm md:text-base font-medium transition-all duration-300 ${sortCriteria === 'speed' ? 'bg-[#2B2D42] text-white shadow-lg' : 'hover:bg-gray-50'} min-h-[44px] touch-manipulation`}>
              <Zap className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Velocidad</span>
              <span className="sm:hidden">⚡</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="price" variant="outline" className={`px-6 md:px-6 py-3 md:py-3 rounded-xl text-sm md:text-base font-medium transition-all duration-300 ${sortCriteria === 'price' ? 'bg-[#2B2D42] text-white shadow-lg' : 'hover:bg-gray-50'} min-h-[44px] touch-manipulation`}>
              <Shield className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Precio</span>
              <span className="sm:hidden">$</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        {/* Podium Layout */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row w-full justify-center items-end gap-6 md:gap-8 max-w-6xl mx-auto">
            
            {/* Second Place */}
            <div className="order-2 md:order-1 w-full md:w-1/3">
              <div className="relative text-center pb-6">
                <div className="inline-flex items-center justify-center">
                  <div className="relative">
                    <span className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 text-white rounded-full shadow-2xl font-black text-2xl border-4 border-white">
                      {sortedHostingData[1].sortPosition}
                    </span>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <div className="relative bg-white border-2 border-gray-200 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                {/* Badges */}
                <div className="absolute top-3 md:top-4 left-3 md:left-4 flex flex-wrap gap-1.5 md:gap-2 z-10">
                  {sortedHostingData[1].badges?.map((badge, idx) => (
                    <span key={idx} className="px-2 py-0.5 md:py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-[10px] md:text-xs font-medium rounded-full">
                      {badge}
                    </span>
                  ))}
                </div>
                
                <div className="p-4 md:p-6 lg:p-8 pt-12 md:pt-16">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">
                      <span className={sortedHostingData[1].displayName.firstColor}>{sortedHostingData[1].displayName.first}</span>
                      <span className={sortedHostingData[1].displayName.secondColor}>{sortedHostingData[1].displayName.second}</span>
                    </h3>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-2xl font-bold text-gray-600">{getRatingLabel(sortedHostingData[1])}</span>
                    </div>
                  </div>
                  
                  {/* Features */}
                  <ul className="space-y-3 mb-8 text-sm">
                    {sortedHostingData[1].features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Pricing */}
                  {sortedHostingData[1].price && (
                    <div className="mb-4 text-center">
                      <div className="flex items-baseline justify-center gap-2">
                        {sortedHostingData[1].price.original && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${sortedHostingData[1].price.original.toLocaleString('es-CL')}
                          </span>
                        )}
                        <span className="text-3xl font-bold text-foreground">
                          ${sortedHostingData[1].price.current.toLocaleString('es-CL')}
                        </span>
                        <span className="text-sm text-muted-foreground">/{sortedHostingData[1].price.period}</span>
                      </div>
                      {sortedHostingData[1].price.original && (
                        <p className="text-xs font-semibold text-green-600 mt-1">
                          Ahorras {Math.round((1 - sortedHostingData[1].price.current / sortedHostingData[1].price.original) * 100)}%
                        </p>
                      )}
                    </div>
                  )}
                  
                  {/* CTA */}
                  <div className="space-y-2">
                    <Button asChild className={`w-full ${sortedHostingData[1].buttonColor} hover:opacity-90 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300`}>
                      <a href={sortedHostingData[1].url} target="_blank" rel="noopener noreferrer">
                        {sortedHostingData[1].ctaText || "Ver Hosting"}
                      </a>
                    </Button>
                    {sortedHostingData[1].ctaMicroCopy && (
                      <p className="text-xs text-center text-muted-foreground">
                        {sortedHostingData[1].ctaMicroCopy}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* First Place - Winner */}
            <div className="order-1 md:order-2 w-full md:w-1/3 z-10">
              <div className="relative text-center pb-6">
                <div className="inline-flex items-center justify-center">
                  <div className="relative">
                    <span className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-full shadow-2xl font-black text-3xl border-4 border-white">
                      {sortedHostingData[0].sortPosition}
                    </span>
                    <Trophy className="w-8 h-8 ml-2 text-yellow-500 absolute -top-2 -right-8" />
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                {sortedHostingData[0].isRecommended && (
                  <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <div className="bg-gradient-to-r from-[#EF233C] to-pink-500 text-white text-sm px-6 py-2 rounded-full flex items-center whitespace-nowrap shadow-lg">
                      <Check size={16} className="mr-2" /> 
                      Más Recomendado
                    </div>
                  </div>
                )}
              </div>
              
              <div className={`relative bg-white border-4 ${sortedHostingData[0].borderColor} rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500`}>
                {/* Winner Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#EF233C]/5 to-transparent"></div>
                
                {/* Badges */}
                <div className="absolute top-3 md:top-4 left-3 md:left-4 flex flex-wrap gap-1.5 md:gap-2 z-10">
                  {sortedHostingData[0].badges?.map((badge, idx) => (
                    <span key={idx} className="px-2 md:px-3 py-0.5 md:py-1 bg-gradient-to-r from-[#EF233C] to-pink-500 text-white text-[10px] md:text-xs font-medium rounded-full shadow-lg">
                      {badge}
                    </span>
                  ))}
                </div>
                
                {/* Availability Badge */}
                <div className="absolute top-14 md:top-16 left-3 md:left-4 z-10">
                  <AvailabilityBadge providerName={sortedHostingData[0].name} offerType="trial" />
                </div>
                
                <div className="p-4 md:p-6 lg:p-8 pt-24 md:pt-28 relative">
                  {/* Header */}
                  <div className="text-center mb-4 md:mb-6">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3">
                      <span className={sortedHostingData[0].displayName.firstColor}>{sortedHostingData[0].displayName.first}</span>
                      <span className={sortedHostingData[0].displayName.secondColor}>{sortedHostingData[0].displayName.second}</span>
                    </h3>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-2xl md:text-3xl font-bold text-[#EF233C]">{getRatingLabel(sortedHostingData[0])}</span>
                    </div>
                  </div>
                  
                  {/* Features */}
                  <ul className="space-y-2 md:space-y-3 mb-4 md:mb-6 text-sm md:text-base">
                    {sortedHostingData[0].features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 md:gap-3">
                        <Check className="w-4 md:w-5 h-4 md:h-5 text-[#EF233C] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Pricing */}
                  {sortedHostingData[0].price && (
                    <div className="mb-6 text-center">
                      <div className="flex items-baseline justify-center gap-2">
                        {sortedHostingData[0].price.original && (
                          <span className="text-base text-muted-foreground line-through">
                            ${sortedHostingData[0].price.original.toLocaleString('es-CL')}
                          </span>
                        )}
                        <span className="text-4xl font-bold text-[#EF233C]">
                          ${sortedHostingData[0].price.current.toLocaleString('es-CL')}
                        </span>
                        <span className="text-sm text-muted-foreground">/{sortedHostingData[0].price.period}</span>
                      </div>
                      {sortedHostingData[0].price.original && (
                        <p className="text-sm font-semibold text-green-600 mt-1">
                          Ahorras {Math.round((1 - sortedHostingData[0].price.current / sortedHostingData[0].price.original) * 100)}%
                        </p>
                      )}
                    </div>
                  )}
                  
                  {/* CTA */}
                  <div className="space-y-2">
                    <Button asChild className={`w-full ${sortedHostingData[0].buttonColor} hover:opacity-90 text-white py-3 md:py-4 rounded-xl font-bold text-base md:text-lg shadow-2xl hover:shadow-[#EF233C]/30 transition-all duration-300 transform hover:scale-105`}>
                      <a href={sortedHostingData[0].url} target="_blank" rel="noopener noreferrer">
                        {sortedHostingData[0].ctaText || "Elegir HostingPlus"}
                      </a>
                    </Button>
                    {sortedHostingData[0].ctaMicroCopy && (
                      <p className="text-xs text-center text-white/80">
                        {sortedHostingData[0].ctaMicroCopy}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Third Place */}
            <div className="order-3 w-full md:w-1/3">
              <div className="relative text-center pb-6">
                <div className="inline-flex items-center justify-center">
                  <div className="relative">
                    <span className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-700 text-white rounded-full shadow-2xl font-black text-2xl border-4 border-white">
                      {sortedHostingData[2].sortPosition}
                    </span>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <div className="relative bg-white border-2 border-amber-200 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                {/* Badges */}
                <div className="absolute top-3 md:top-4 left-3 md:left-4 flex flex-wrap gap-1.5 md:gap-2 z-10">
                  {sortedHostingData[2].badges?.map((badge, idx) => (
                    <span key={idx} className="px-2 py-0.5 md:py-1 bg-gradient-to-r from-amber-100 to-orange-200 text-amber-700 text-[10px] md:text-xs font-medium rounded-full">
                      {badge}
                    </span>
                  ))}
                </div>
                
                {/* Availability Badge */}
                <div className="absolute top-14 md:top-16 left-3 md:left-4 z-10">
                  <AvailabilityBadge providerName={sortedHostingData[2].name} offerType="migration" />
                </div>
                
                <div className="p-4 md:p-6 lg:p-8 pt-12 md:pt-16">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">
                      <span className={sortedHostingData[2].displayName.firstColor}>{sortedHostingData[2].displayName.first}</span>
                      <span className={sortedHostingData[2].displayName.secondColor}>{sortedHostingData[2].displayName.second}</span>
                    </h3>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-2xl font-bold text-amber-600">{getRatingLabel(sortedHostingData[2])}</span>
                    </div>
                  </div>
                  
                  {/* Features */}
                  <ul className="space-y-3 mb-4 text-sm">
                    {sortedHostingData[2].features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Pricing */}
                  {sortedHostingData[2].price && (
                    <div className="mb-4 text-center">
                      <div className="flex items-baseline justify-center gap-2">
                        {sortedHostingData[2].price.original && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${sortedHostingData[2].price.original.toLocaleString('es-CL')}
                          </span>
                        )}
                        <span className="text-3xl font-bold text-foreground">
                          ${sortedHostingData[2].price.current.toLocaleString('es-CL')}
                        </span>
                        <span className="text-sm text-muted-foreground">/{sortedHostingData[2].price.period}</span>
                      </div>
                      {sortedHostingData[2].price.original && (
                        <p className="text-xs font-semibold text-green-600 mt-1">
                          Ahorras {Math.round((1 - sortedHostingData[2].price.current / sortedHostingData[2].price.original) * 100)}%
                        </p>
                      )}
                    </div>
                  )}
                  
                  {/* CTA */}
                  <div className="space-y-2">
                    <Button asChild className={`w-full ${sortedHostingData[2].buttonColor} hover:opacity-90 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300`}>
                      <a href={sortedHostingData[2].url} target="_blank" rel="noopener noreferrer">
                        {sortedHostingData[2].ctaText || "Ver Hosting"}
                      </a>
                    </Button>
                    {sortedHostingData[2].ctaMicroCopy && (
                      <p className="text-xs text-center text-muted-foreground">
                        {sortedHostingData[2].ctaMicroCopy}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* More Providers Link */}
        <div className="text-center">
          <div className="inline-block bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold text-[#2B2D42] mb-4">
              ¿Necesitas más opciones?
            </h3>
            <p className="text-gray-600 mb-6">
              Revisa nuestro ranking completo con 9 proveedores analizados
            </p>
            <Link to="/ranking" className="inline-flex items-center gap-2 text-[#EF233C] hover:text-[#b3001b] font-semibold text-lg transition-colors duration-300 group">
              Ver ranking completo 
              <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HostingRanking;

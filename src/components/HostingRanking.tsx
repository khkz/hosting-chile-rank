
import React, { useState, useMemo } from 'react';
import HostingCard from './HostingCard';
import { Trophy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const hostingData = [
  {
    position: 1,
    name: "HostingPlus.cl",
    displayName: { first: "Hosting", second: "Plus", firstColor: "text-[#2B2D42]", secondColor: "text-[#EF233C]" },
    logo: "/logo-hostingplus.png",
    rating: 9.9,
    speedRating: 9.8,
    priceRating: 9.5,
    features: [
      "Datacenter propio en Santiago (IP CL)",
      "LiteSpeed Enterprise + BitNinja + JetBackup",
      "0 reclamos en Reclamos.cl (2020-2025)",
      "Soporte 24/7 y creador web IA gratis"
    ],
    specs: [
      "LiteSpeed Enterprise",
      "BitNinja WAF",
      "IP Chile",
      "JetBackup"
    ],
    url: "https://www.hostingplus.cl/",
    isRecommended: true,
    buttonColor: "bg-[#EF233C]",
    borderColor: "border-[#EF233C]"
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
      "Servidores en Chile, energía 100 % renovable",
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
    buttonColor: "bg-[#2B2D42]",
    borderColor: "border-gray-200"
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
    buttonColor: "bg-[#2B2D42]",
    borderColor: "border-gray-200"
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
    
    // Update position based on sort order
    return sortedData.map((provider, index) => ({
      ...provider,
      sortPosition: index + 1
    }));
  }, [sortCriteria]);
  
  // Get rating label based on sort criteria
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
  
  // Generate structured data for Schema.org
  const generateSchemaData = () => {
    const items = sortedHostingData.map((provider, index) => ({
      "@type": "Product",
      "name": provider.name,
      "description": provider.features.join(". "),
      "url": provider.url,
      "image": provider.logo,
      "brand": {
        "@type": "Brand",
        "name": provider.name
      },
      "offers": {
        "@type": "Offer",
        "price": "3990",
        "priceCurrency": "CLP",
        "url": provider.url,
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": sortCriteria === 'speed' ? provider.speedRating : 
                       (sortCriteria === 'price' ? provider.priceRating : provider.rating),
        "bestRating": "10",
        "worstRating": "0",
        "ratingCount": "1"
      },
      "position": index + 1
    }));
    
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": item
      })),
      "numberOfItems": items.length
    };
    
    return JSON.stringify(schemaData);
  };
  
  return (
    <section id="ranking" className="py-16 container mx-auto px-4">
      <h2 className="text-3xl font-semibold text-center mb-6">Top 3 Proveedores de Hosting</h2>
      
      <script type="application/ld+json">{generateSchemaData()}</script>
      
      <div className="flex justify-center mb-8">
        <ToggleGroup type="single" value={sortCriteria} onValueChange={(value) => value && setSortCriteria(value)}>
          <ToggleGroupItem value="overall" variant="outline" className={sortCriteria === 'overall' ? 'bg-[#2B2D42] text-white' : ''}>
            General
          </ToggleGroupItem>
          <ToggleGroupItem value="speed" variant="outline" className={sortCriteria === 'speed' ? 'bg-[#2B2D42] text-white' : ''}>
            Velocidad
          </ToggleGroupItem>
          <ToggleGroupItem value="price" variant="outline" className={sortCriteria === 'price' ? 'bg-[#2B2D42] text-white' : ''}>
            Precio
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      {/* Podium layout for top 3 */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row w-full justify-center items-end gap-4 md:gap-8">
          {/* Second place - left */}
          <div className="order-2 md:order-1 w-full md:w-1/3">
            <div className="relative text-center pb-4">
              <div className="inline-flex items-center justify-center">
                <span className="inline-flex items-center justify-center w-14 h-14 bg-gray-300 text-white rounded-full shadow-lg font-black text-2xl">
                  {sortedHostingData[1].sortPosition}
                </span>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden bg-white h-full">
              <div className="p-6 flex flex-col h-full">
                <div className="mb-2">
                  <h3 className="text-2xl font-bold">
                    <span className={sortedHostingData[1].displayName.firstColor}>{sortedHostingData[1].displayName.first}</span>
                    <span className={sortedHostingData[1].displayName.secondColor}>{sortedHostingData[1].displayName.second}</span>
                  </h3>
                </div>
                <ul className="list-disc list-inside mb-6 text-sm text-gray-700 space-y-2 flex-grow">
                  {sortedHostingData[1].features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById(`specs-${sortedHostingData[1].position}`)?.classList.toggle('hidden')} 
                  className="w-full mb-4 text-sm justify-between border-gray-300"
                >
                  Ver especificaciones
                  <span>⌄</span>
                </Button>
                <div id={`specs-${sortedHostingData[1].position}`} className="hidden mb-4 p-3 bg-gray-50 rounded-lg">
                  <ul className="space-y-2">
                    {sortedHostingData[1].specs.map((spec, index) => (
                      <li key={index} className="text-sm flex items-center">
                        <Check size={16} className="text-green-600 mr-2" /> {spec}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button asChild className={`${sortedHostingData[1].buttonColor} hover:opacity-90`}>
                  <a href={sortedHostingData[1].url} target="_blank" rel="noopener noreferrer">Visitar Hosting</a>
                </Button>
              </div>
            </div>
          </div>
          
          {/* First place - center */}
          <div className="order-1 md:order-2 w-full md:w-1/3 z-10">
            <div className="relative text-center pb-4">
              <div className="inline-flex items-center justify-center">
                <span className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400 text-white rounded-full shadow-lg font-black text-3xl">
                  {sortedHostingData[0].sortPosition}
                </span>
                <Trophy className="w-8 h-8 ml-2 text-yellow-400" />
              </div>
              {sortedHostingData[0].isRecommended && (
                <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                  <div className="bg-[#EF233C] text-white text-xs px-4 py-1 rounded-full flex items-center whitespace-nowrap">
                    <Check size={12} className="mr-1" /> Recomendado
                  </div>
                </div>
              )}
            </div>
            <div className={`border-2 ${sortedHostingData[0].borderColor} rounded-lg overflow-hidden bg-white shadow-lg transform md:scale-105 h-full`}>
              <div className="p-6 flex flex-col h-full">
                <div className="mb-2">
                  <h3 className="text-2xl font-bold">
                    <span className={sortedHostingData[0].displayName.firstColor}>{sortedHostingData[0].displayName.first}</span>
                    <span className={sortedHostingData[0].displayName.secondColor}>{sortedHostingData[0].displayName.second}</span>
                  </h3>
                </div>
                <ul className="list-disc list-inside mb-6 text-sm text-gray-700 space-y-2 flex-grow">
                  {sortedHostingData[0].features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById(`specs-${sortedHostingData[0].position}`)?.classList.toggle('hidden')} 
                  className="w-full mb-4 text-sm justify-between border-gray-300"
                >
                  Ver especificaciones
                  <span>⌄</span>
                </Button>
                <div id={`specs-${sortedHostingData[0].position}`} className="hidden mb-4 p-3 bg-gray-50 rounded-lg">
                  <ul className="space-y-2">
                    {sortedHostingData[0].specs.map((spec, index) => (
                      <li key={index} className="text-sm flex items-center">
                        <Check size={16} className="text-[#EF233C] mr-2" /> {spec}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button asChild className={`${sortedHostingData[0].buttonColor} hover:opacity-90`}>
                  <a href={sortedHostingData[0].url} target="_blank" rel="noopener noreferrer">Visitar Hosting</a>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Third place - right */}
          <div className="order-3 w-full md:w-1/3">
            <div className="relative text-center pb-4">
              <div className="inline-flex items-center justify-center">
                <span className="inline-flex items-center justify-center w-14 h-14 bg-amber-700 text-white rounded-full shadow-lg font-black text-2xl">
                  {sortedHostingData[2].sortPosition}
                </span>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden bg-white h-full">
              <div className="p-6 flex flex-col h-full">
                <div className="mb-2">
                  <h3 className="text-2xl font-bold">
                    <span className={sortedHostingData[2].displayName.firstColor}>{sortedHostingData[2].displayName.first}</span>
                    <span className={sortedHostingData[2].displayName.secondColor}>{sortedHostingData[2].displayName.second}</span>
                  </h3>
                </div>
                <ul className="list-disc list-inside mb-6 text-sm text-gray-700 space-y-2 flex-grow">
                  {sortedHostingData[2].features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById(`specs-${sortedHostingData[2].position}`)?.classList.toggle('hidden')} 
                  className="w-full mb-4 text-sm justify-between border-gray-300"
                >
                  Ver especificaciones
                  <span>⌄</span>
                </Button>
                <div id={`specs-${sortedHostingData[2].position}`} className="hidden mb-4 p-3 bg-gray-50 rounded-lg">
                  <ul className="space-y-2">
                    {sortedHostingData[2].specs.map((spec, index) => (
                      <li key={index} className="text-sm flex items-center">
                        <Check size={16} className="text-amber-700 mr-2" /> {spec}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button asChild className={`${sortedHostingData[2].buttonColor} hover:opacity-90`}>
                  <a href={sortedHostingData[2].url} target="_blank" rel="noopener noreferrer">Visitar Hosting</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <Link to="/ranking" className="text-[#2B2D42] underline hover:text-[#EF233C] font-medium">
          Ver los 6 proveedores restantes →
        </Link>
      </div>
    </section>
  );
};

export default HostingRanking;

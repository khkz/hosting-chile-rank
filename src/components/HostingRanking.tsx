
import React, { useState, useMemo } from 'react';
import HostingCard from './HostingCard';
import { Trophy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const hostingData = [
  {
    position: 1,
    name: "HostingPlus.cl",
    logo: "/logo-hostingplus-new.svg",
    rating: 9.9,
    speedRating: 9.8, // Added speed rating
    priceRating: 9.5, // Added price rating
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
    isRecommended: true
  },
  {
    position: 2,
    name: "EcoHosting.cl",
    logo: "/logo-ecohosting-new.svg",
    rating: 9.6,
    speedRating: 9.6, // Added speed rating
    priceRating: 9.7, // Added price rating
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
    url: "https://www.ecohosting.cl/"
  },
  {
    position: 3,
    name: "HostGator.cl",
    logo: "/logo-hostgator.svg",
    rating: 9.2,
    speedRating: 8.9, // Added speed rating
    priceRating: 9.4, // Added price rating
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
    url: "https://www.hostgator.cl/"
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
  
  return (
    <section id="ranking" className="py-16 container mx-auto px-4">
      <h2 className="text-3xl font-semibold text-center mb-6">Top 3 Proveedores de Hosting</h2>
      
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-md shadow-sm">
          <Button 
            variant={sortCriteria === 'overall' ? 'default' : 'outline'} 
            onClick={() => setSortCriteria('overall')}
            className="rounded-r-none"
          >
            General
          </Button>
          <Button 
            variant={sortCriteria === 'speed' ? 'default' : 'outline'} 
            onClick={() => setSortCriteria('speed')}
            className="rounded-none border-x-0"
          >
            Velocidad
          </Button>
          <Button 
            variant={sortCriteria === 'price' ? 'default' : 'outline'} 
            onClick={() => setSortCriteria('price')}
            className="rounded-l-none"
          >
            Precio
          </Button>
        </div>
      </div>
      
      {/* Podium layout for top 3 */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row w-full justify-center items-end gap-4 md:gap-8">
          {/* Second place - left */}
          <div className="order-2 md:order-1 w-full md:w-1/3 transform transition-all duration-300 hover:scale-105">
            <div className="relative">
              <div className="absolute -top-7 left-0 right-0 mx-auto w-full text-center">
                <span className="inline-flex items-center justify-center w-14 h-14 bg-[#C0C0C0] text-white rounded-full shadow-lg font-black text-2xl">2</span>
              </div>
              <div className="pt-10">
                <HostingCard
                  key={sortedHostingData[1].position}
                  position={sortedHostingData[1].sortPosition}
                  name={sortedHostingData[1].name}
                  logo={sortedHostingData[1].logo}
                  rating={parseFloat(getRatingLabel(sortedHostingData[1]))}
                  features={sortedHostingData[1].features}
                  specs={sortedHostingData[1].specs}
                  url={sortedHostingData[1].url}
                  isPodium={true}
                />
              </div>
            </div>
          </div>
          
          {/* First place - center */}
          <div className="order-1 md:order-2 w-full md:w-1/3 transform transition-all duration-300 hover:scale-105 z-10">
            <div className="relative">
              <div className="absolute -top-12 left-0 right-0 mx-auto w-full text-center">
                <div className="inline-flex items-center justify-center">
                  <span className="inline-flex items-center justify-center w-16 h-16 bg-[#FFD700] text-white rounded-full shadow-lg font-black text-3xl">1</span>
                  <Trophy className="w-8 h-8 ml-2 text-[#FFD700]" />
                </div>
              </div>
              <div className="absolute -top-3 right-5">
                {sortedHostingData[0].isRecommended && (
                  <div className="bg-[#EF233C] text-white text-xs px-3 py-1 rounded-full flex items-center">
                    <Check size={12} className="mr-1" /> Recomendado
                  </div>
                )}
              </div>
              <div className="pt-10 transform md:scale-110">
                <HostingCard
                  key={sortedHostingData[0].position}
                  position={sortedHostingData[0].sortPosition}
                  name={sortedHostingData[0].name}
                  logo={sortedHostingData[0].logo}
                  rating={parseFloat(getRatingLabel(sortedHostingData[0]))}
                  features={sortedHostingData[0].features}
                  specs={sortedHostingData[0].specs}
                  url={sortedHostingData[0].url}
                  isPodium={true}
                  isTopRated={true}
                  isRecommended={sortedHostingData[0].isRecommended}
                />
              </div>
            </div>
          </div>
          
          {/* Third place - right */}
          <div className="order-3 w-full md:w-1/3 transform transition-all duration-300 hover:scale-105">
            <div className="relative">
              <div className="absolute -top-7 left-0 right-0 mx-auto w-full text-center">
                <span className="inline-flex items-center justify-center w-14 h-14 bg-[#CD7F32] text-white rounded-full shadow-lg font-black text-2xl">3</span>
              </div>
              <div className="pt-10">
                <HostingCard
                  key={sortedHostingData[2].position}
                  position={sortedHostingData[2].sortPosition}
                  name={sortedHostingData[2].name}
                  logo={sortedHostingData[2].logo}
                  rating={parseFloat(getRatingLabel(sortedHostingData[2]))}
                  features={sortedHostingData[2].features}
                  specs={sortedHostingData[2].specs}
                  url={sortedHostingData[2].url}
                  isPodium={true}
                />
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

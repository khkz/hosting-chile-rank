
import React, { useEffect, useState } from 'react';
import { TrendingUp, Zap, Shield, Users } from 'lucide-react';

const StatsTicker = () => {
  const [pingValue, setPingValue] = useState('5-8 ms ping');
  
  useEffect(() => {
    const simulatedPing = Math.floor(Math.random() * 4) + 5;
    setTimeout(() => {
      setPingValue(`${simulatedPing} ms ping`);
    }, 1500);
  }, []);
  
  const stats = [
    { icon: Users, text: "+22,000 sitios evaluados", color: "text-blue-400" },
    { icon: Zap, text: pingValue, color: "text-yellow-400" },
    { icon: Shield, text: "0 reclamos HostingPlus", color: "text-green-400" },
    { icon: TrendingUp, text: "99.9% uptime verificado", color: "text-purple-400" },
  ];

  // Duplicate stats for seamless loop
  const duplicatedStats = [...stats, ...stats];
  
  return (
    <section className="relative bg-gradient-to-r from-[#2B2D42] via-gray-800 to-[#2B2D42] py-4 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-[#EF233C] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-blue-500 rounded-full blur-2xl"></div>
      </div>

      {/* Animated Content */}
      <div className="relative">
        <div className="animate-marquee whitespace-nowrap flex items-center">
          {duplicatedStats.map((stat, index) => (
            <div key={index} className="inline-flex items-center mx-8">
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <stat.icon className={`w-4 h-4 mr-2 ${stat.color}`} />
                <span className="text-white font-medium text-sm">{stat.text}</span>
              </div>
              {index < duplicatedStats.length - 1 && (
                <div className="w-2 h-2 bg-gradient-to-r from-[#EF233C] to-pink-400 rounded-full mx-6"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Gradient Overlays for seamless loop */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#2B2D42] to-transparent pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#2B2D42] to-transparent pointer-events-none"></div>
    </section>
  );
};

export default StatsTicker;

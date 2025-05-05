
import React, { useEffect, useState } from 'react';

const StatsTicker = () => {
  const [pingValue, setPingValue] = useState('5-8 ms ping');
  
  // Simulate ping fetch (would be replaced with actual API call)
  useEffect(() => {
    // Simulate API fetch with random ping between 5-8ms
    const simulatedPing = Math.floor(Math.random() * 4) + 5;
    setTimeout(() => {
      setPingValue(`${simulatedPing} ms ping`);
    }, 1500);
  }, []);
  
  return (
    <section className="bg-[#2B2D42] py-3 overflow-hidden text-white">
      <div className="animate-marquee whitespace-nowrap">
        <span className="mx-4">+22 000 sitios evaluados</span>
        <span className="mx-4">•</span>
        <span className="mx-4" id="pingVal">{pingValue}</span>
        <span className="mx-4">•</span>
        <span className="mx-4">0 reclamos HostingPlus</span>
        <span className="mx-4">•</span>
        <span className="mx-4">+22 000 sitios evaluados</span>
        <span className="mx-4">•</span>
        <span className="mx-4">{pingValue}</span>
        <span className="mx-4">•</span>
        <span className="mx-4">0 reclamos HostingPlus</span>
      </div>
    </section>
  );
};

export default StatsTicker;

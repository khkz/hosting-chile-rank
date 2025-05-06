import React, { useState, useEffect } from 'react';
const MiniNav = () => {
  const [visible, setVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('ranking');
  useEffect(() => {
    const handleScroll = () => {
      // Show mini nav after scrolling past 70% of viewport height
      if (window.scrollY > window.innerHeight * 0.7) {
        setVisible(true);
      } else {
        setVisible(false);
      }

      // Determine active section based on scroll position
      const sections = ['ranking', 'faq', 'blog'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return <>
      <nav className={`hidden md:flex flex-col gap-3 fixed right-6 top-1/3 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        
        
        
      </nav>
      
      <a href="https://www.hostingplus.cl/" target="_blank" rel="noopener noreferrer" className={`hidden md:block fixed bottom-6 right-6 bg-[#EF233C] text-white px-6 py-3 rounded-full shadow-lg transition-opacity duration-300 hover:bg-[#b3001b] ${visible ? 'opacity-100' : 'opacity-0'}`}>
        Contratar HostingPlus
      </a>
    </>;
};
export default MiniNav;
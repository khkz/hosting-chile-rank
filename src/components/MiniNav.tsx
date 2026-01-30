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
      <nav className={`hidden md:flex flex-col gap-3 fixed right-6 top-1/3 transition-opacity duration-300 z-40 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <a 
          href="#ranking" 
          aria-label="Ir a ranking"
          className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${activeSection === 'ranking' ? 'bg-primary scale-110' : 'bg-gray-300 hover:bg-gray-400'}`} 
        />
        <a 
          href="#faq" 
          aria-label="Ir a preguntas frecuentes"
          className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${activeSection === 'faq' ? 'bg-primary scale-110' : 'bg-gray-300 hover:bg-gray-400'}`} 
        />
        <a 
          href="#blog" 
          aria-label="Ir a blog"
          className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${activeSection === 'blog' ? 'bg-primary scale-110' : 'bg-gray-300 hover:bg-gray-400'}`} 
        />
      </nav>
      
      <a 
        href="https://www.hostingplus.cl/" 
        target="_blank" 
        rel="noopener noreferrer" 
        className={`hidden md:block fixed bottom-6 right-6 bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-xl hover:scale-105 z-40 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        Contratar HostingPlus
      </a>
    </>;
};
export default MiniNav;
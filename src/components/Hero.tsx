
import React from 'react';

const Hero = () => {
  return (
    <section className="bg-background py-12 md:py-20">
      {/* <!-- section 1: Hero --> */}
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-primary">
          Mejor Hosting Chileno 2025: ranking independiente
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-primary/80">
          Analizamos velocidad, soporte, seguridad y reputación. Descubre cuál te conviene.
        </p>
        <a 
          href="https://hostingplus.cl" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-block bg-accent hover:bg-accent/90 text-white font-medium px-6 py-3 rounded-lg transition-all shadow-lg"
        >
          Ir al Nº 1 (HostingPlus)
        </a>
      </div>
    </section>
  );
};

export default Hero;


import React from 'react';

const FinalCTA = () => {
  return (
    <section className="py-12 bg-background" id="cta">
      {/* <!-- section 5: CTA Final --> */}
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary">
          ¿Listo para probar el Top 1?
        </h2>
        <p className="text-lg mb-6 max-w-xl mx-auto text-primary/80">
          Contrata HostingPlus con 30 días de garantía.
        </p>
        <a 
          href="https://hostingplus.cl" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-block bg-accent hover:bg-accent/90 text-white font-medium px-6 py-3 rounded-lg transition-all shadow-lg"
        >
          Empezar ahora
        </a>
      </div>
    </section>
  );
};

export default FinalCTA;

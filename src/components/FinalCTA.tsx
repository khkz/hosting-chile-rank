
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface FinalCTAProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ 
  title = "¿Listo para despegar tu web?",
  subtitle = "Contrata HostingPlus con 30 días de garantía.",
  buttonText = "Ir al Nº 1 Ahora",
  buttonLink = "https://www.hostingplus.cl/"
}) => {
  return (
    <section className="bg-[#2B2D42] text-white text-center py-12">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl font-semibold">{title}</h3>
        <p className="mt-2">{subtitle}</p>
        <Button 
          asChild
          className="mt-4 bg-gradient-to-r from-brand-red to-brand-red-dark hover:from-brand-red-dark hover:to-brand-red-dark text-white px-8 py-3 rounded-xl font-poppins font-semibold shadow-lg shadow-brand-red/30 hover:shadow-xl hover:shadow-brand-red/40 transform hover:scale-105 transition-all duration-300"
        >
          {buttonLink.startsWith('http') ? (
            <a href={buttonLink} target="_blank" rel="noopener noreferrer">
              {buttonText}
            </a>
          ) : (
            <Link to={buttonLink}>
              {buttonText}
            </Link>
          )}
        </Button>
      </div>
    </section>
  );
};

export default FinalCTA;

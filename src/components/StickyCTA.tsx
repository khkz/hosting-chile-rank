
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const StickyCTA = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 bg-background p-3 shadow-lg border-t border-border transform transition-transform duration-300 md:hidden ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
      <Button
        asChild
        className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90"
      >
        <Link to="/cotiza-hosting">
          Cotiza tu hosting
        </Link>
      </Button>
    </div>
  );
};

export default StickyCTA;

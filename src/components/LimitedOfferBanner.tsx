import React, { useState, useEffect } from 'react';
import { X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LimitedOfferBanner = () => {
  const [visible, setVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user already dismissed today
    const dismissedDate = localStorage.getItem('offerBannerDismissed');
    const today = new Date().toDateString();
    
    if (dismissedDate === today) {
      return;
    }

    // Show banner after 5 seconds initially
    const initialTimer = setTimeout(() => setVisible(true), 5000);

    // Cycle: Show for 15s, hide for 45s
    const cycleInterval = setInterval(() => {
      setVisible(prev => !prev);
    }, 15000); // Toggle every 15 seconds (15s visible, then 15s hidden pattern)

    // Better pattern: Show 15s, hide 45s
    let showTimer: NodeJS.Timeout;
    const startCycle = () => {
      setVisible(true);
      showTimer = setTimeout(() => {
        setVisible(false);
        setTimeout(startCycle, 45000); // Hide for 45 seconds before showing again
      }, 15000); // Show for 15 seconds
    };

    const cycleTimer = setTimeout(startCycle, 5000);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(cycleTimer);
      clearTimeout(showTimer);
      clearInterval(cycleInterval);
    };
  }, []);

  useEffect(() => {
    if (!visible || dismissed) return;

    const countdown = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [visible, dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
    setVisible(false);
    localStorage.setItem('offerBannerDismissed', new Date().toDateString());
  };

  if (!visible || dismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground shadow-lg animate-fade-in">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Clock className="w-5 h-5 animate-pulse-subtle" />
            <div className="flex-1">
              <p className="font-semibold text-sm md:text-base">
                🎁 Solo 12 slots de migración gratis disponibles este mes
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs md:text-sm opacity-90">
                  Termina en:
                </span>
                <div className="flex gap-1 font-mono text-xs md:text-sm font-bold">
                  <span className="bg-white/20 px-2 py-0.5 rounded">
                    {String(timeLeft.hours).padStart(2, '0')}h
                  </span>
                  <span className="bg-white/20 px-2 py-0.5 rounded">
                    {String(timeLeft.minutes).padStart(2, '0')}m
                  </span>
                  <span className="bg-white/20 px-2 py-0.5 rounded">
                    {String(timeLeft.seconds).padStart(2, '0')}s
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="hidden md:inline-flex"
          >
            <a 
              href="https://www.hostingplus.cl/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Reservar ahora
            </a>
          </Button>

          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            aria-label="Cerrar banner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LimitedOfferBanner;

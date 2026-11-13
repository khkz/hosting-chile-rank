import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { track } from '@/lib/track';
import { openAdvisor } from '@/components/advisor/events';

/**
 * Barra fija móvil. Mientras está visible, el botón flotante del asesor se
 * oculta (regla .advisor-fab en index.css) y el asesor se abre desde aquí:
 * un solo elemento fijo en pantalla.
 */
const StickyCTA = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 600);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isVisible) root.dataset.stickyCta = 'on';
    else delete root.dataset.stickyCta;
    return () => {
      delete root.dataset.stickyCta;
    };
  }, [isVisible]);

  return (
    <div
      aria-hidden={!isVisible}
      className={`fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background p-3 shadow-lg transition-transform duration-300 md:hidden ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex gap-2">
        <Button asChild className="flex-1 rounded-lg bg-primary py-3 text-primary-foreground hover:bg-primary/90">
          <Link
            to="/cotiza-hosting"
            tabIndex={isVisible ? undefined : -1}
            onClick={() => track('cta_cotizar', { location: 'sticky_mobile' })}
          >
            Cotiza tu hosting
          </Link>
        </Button>
        <button
          type="button"
          data-advisor-open
          tabIndex={isVisible ? undefined : -1}
          onClick={openAdvisor}
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-ink/20 bg-white px-3.5 text-sm font-medium text-ink"
        >
          <MessageCircle className="h-4 w-4" aria-hidden />
          Asesor IA
        </button>
      </div>
    </div>
  );
};

export default StickyCTA;

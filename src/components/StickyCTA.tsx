import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { track } from '@/lib/track';
import { MOBILE_FIXED_UI_OFFSET, openAdvisor } from '@/components/advisor/events';

/**
 * Barra fija móvil (bajo 768 px), visible después de la primera pantalla.
 * Mientras está visible, el botón flotante del asesor se oculta (regla
 * .advisor-fab en index.css y HostingAdvisorFab) y el asesor se abre desde
 * aquí: un solo elemento fijo en pantalla. El pie reserva su alto
 * (html[data-sticky-cta='on'] [data-site-footer] en index.css).
 * Botón en tinta: la acción roja de cada página es la suya, no esta.
 */
const StickyCTA = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > MOBILE_FIXED_UI_OFFSET);
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
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-white p-3 transition-transform duration-300 md:hidden print:hidden ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex gap-2">
        <Button asChild className="flex-1">
          <Link
            to="/cotiza-hosting"
            tabIndex={isVisible ? undefined : -1}
            onClick={() => track('cta_cotizar', { location: 'sticky_mobile' })}
          >
            Cotizar hosting
          </Link>
        </Button>
        <Button
          type="button"
          variant="outline"
          data-advisor-open
          tabIndex={isVisible ? undefined : -1}
          onClick={openAdvisor}
          className="shrink-0 px-4"
        >
          <MessageCircle aria-hidden />
          Asesor con IA
        </Button>
      </div>
    </div>
  );
};

export default StickyCTA;

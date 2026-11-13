import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, X } from 'lucide-react';
import AdvisorChat from './AdvisorChat';
import { ADVISOR_OPEN_EVENT } from './events';
import { useEdition } from '@/hooks/useEdition';

/**
 * Asesor con IA: botón flotante global (.cl y .com) y su panel.
 * - Se reduce al ícono al bajar y se aparta al llegar al pie, para no tapar enlaces.
 * - En móvil, con la barra fija "Cotiza tu hosting" visible, se abre desde esa
 *   barra (ver StickyCTA y la regla .advisor-fab en index.css).
 * - Esc o un clic fuera lo cierran; la conversación se conserva.
 */
const HostingAdvisorFab = () => {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [overFooter, setOverFooter] = useState(false);
  const fabRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { pathname } = useLocation();
  const { label } = useEdition();

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(ADVISOR_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(ADVISOR_OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setCompact(window.scrollY > 480);
        const footer = document.querySelector('[data-site-footer]');
        setOverFooter(!!footer && footer.getBoundingClientRect().top < window.innerHeight - 8);
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [pathname]);

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) fabRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    // Teclado y mouse: foco al campo. Pantallas táctiles: al panel, sin abrir el teclado.
    const fine = window.matchMedia?.('(pointer: fine)').matches;
    const raf = requestAnimationFrame(() => (fine ? inputRef.current : panelRef.current)?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    const onPointer = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (!t || panelRef.current?.contains(t) || fabRef.current?.contains(t)) return;
      if (t.closest?.('[data-advisor-open]')) return;
      close(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open, close]);

  const hidden = overFooter && !open;

  return (
    <>
      <button
        ref={fabRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="asesor-hosting"
        aria-label={open ? 'Cerrar el asesor con IA' : 'Abrir el asesor con IA'}
        tabIndex={hidden ? -1 : undefined}
        className={`advisor-fab fixed bottom-4 right-4 z-40 inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-full bg-ink px-3.5 text-sm font-medium text-white shadow-lg transition-[transform,opacity] duration-200 hover:bg-ink-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand print:hidden ${
          hidden ? 'pointer-events-none translate-y-4 opacity-0' : ''
        }`}
      >
        {open ? <X className="h-4 w-4" aria-hidden /> : <MessageCircle className="h-4 w-4" aria-hidden />}
        <span className={compact || open ? 'sr-only' : 'max-sm:sr-only'}>Asesor con IA</span>
      </button>

      {open && (
        <div
          ref={panelRef}
          id="asesor-hosting"
          role="dialog"
          aria-modal="false"
          aria-labelledby="asesor-hosting-titulo"
          tabIndex={-1}
          className="fixed bottom-[4.5rem] right-4 z-[45] flex max-h-[min(70vh,560px)] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-ink/15 bg-white shadow-2xl focus:outline-none print:hidden"
        >
          <div className="flex items-start justify-between gap-3 bg-ink px-4 py-3 text-white">
            <div>
              <p id="asesor-hosting-titulo" className="text-sm font-semibold">
                Asesor con IA
              </p>
              <p className="text-xs text-white/70">Edición {label}</p>
            </div>
            <button
              type="button"
              onClick={() => close()}
              aria-label="Cerrar el asesor"
              className="-mr-1.5 rounded p-1.5 hover:bg-white/10"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
          <AdvisorChat variant="panel" inputRef={inputRef} />
        </div>
      )}
    </>
  );
};

export default HostingAdvisorFab;

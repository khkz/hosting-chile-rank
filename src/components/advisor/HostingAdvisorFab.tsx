import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, X } from 'lucide-react';
import AdvisorChat from './AdvisorChat';
import { ADVISOR_OPEN_EVENT, MOBILE_FIXED_UI_OFFSET, MOBILE_QUERY } from './events';
import { useEdition } from '@/hooks/useEdition';

const isNarrow = () => typeof window !== 'undefined' && !!window.matchMedia?.(MOBILE_QUERY).matches;
const isPastFirstScreen = () => typeof window !== 'undefined' && window.scrollY > MOBILE_FIXED_UI_OFFSET;
const isStickyBarOn = () => typeof document !== 'undefined' && document.documentElement.dataset.stickyCta === 'on';

/** Anillo de foco blanco hacia adentro, para botones sobre tinta. */
const FOCUS_ON_INK =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white focus-visible:ring-offset-0';

/**
 * Asesor con IA: botón flotante global (.cl y .com) y su panel.
 * - Va al final del documento: es la última parada de Tab (ver App.tsx).
 * - En móvil no tapa la primera pantalla: aparece después de bajar
 *   MOBILE_FIXED_UI_OFFSET px; si la página tiene la barra fija «Cotizar hosting»,
 *   el asesor se abre desde esa barra (ver StickyCTA y .advisor-fab en index.css).
 * - Se reduce al ícono al bajar y se aparta al llegar al pie, para no tapar enlaces.
 * - Cuando no se ve, sale del orden de Tab y de los lectores de pantalla.
 * - Esc o un clic fuera lo cierran; la conversación se conserva y el foco
 *   vuelve al botón que lo abrió.
 */
const HostingAdvisorFab = () => {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [overFooter, setOverFooter] = useState(false);
  // Estado inicial calculado al montar: en móvil empieza oculto, sin parpadear sobre el hero.
  const [narrow, setNarrow] = useState(isNarrow);
  const [pastFirstScreen, setPastFirstScreen] = useState(isPastFirstScreen);
  const [barOn, setBarOn] = useState(isStickyBarOn);
  const fabRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const { pathname } = useLocation();
  const { label } = useEdition();

  useEffect(() => {
    const onOpen = () => {
      returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setOpen(true);
    };
    window.addEventListener(ADVISOR_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(ADVISOR_OPEN_EVENT, onOpen);
  }, []);

  // Ancho de pantalla y barra fija (StickyCTA marca <html data-sticky-cta="on">).
  useEffect(() => {
    const mq = window.matchMedia?.(MOBILE_QUERY);
    const onMq = () => setNarrow(!!mq?.matches);
    mq?.addEventListener?.('change', onMq);
    const mo = new MutationObserver(() => setBarOn(isStickyBarOn()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-sticky-cta'] });
    return () => {
      mq?.removeEventListener?.('change', onMq);
      mo.disconnect();
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setCompact(window.scrollY > 480);
        setPastFirstScreen(isPastFirstScreen());
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
    const back = returnFocusRef.current;
    returnFocusRef.current = null;
    if (!returnFocus) return;
    if (back && back.isConnected && back !== document.body && back.getClientRects().length > 0) back.focus();
    else fabRef.current?.focus();
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

  // Con la barra fija visible en móvil, el asesor vive en la barra (incluso abierto).
  const hidden = (narrow && barOn) || (!open && (overFooter || (narrow && !pastFirstScreen)));

  return (
    <>
      <button
        ref={fabRef}
        type="button"
        onClick={() => {
          returnFocusRef.current = null;
          setOpen((v) => !v);
        }}
        aria-expanded={open}
        aria-controls="asesor-hosting"
        aria-label={open ? 'Cerrar el asesor con IA' : 'Abrir el asesor con IA'}
        aria-hidden={hidden || undefined}
        tabIndex={hidden ? -1 : undefined}
        className={`advisor-fab fixed bottom-4 right-4 z-40 inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-lg bg-ink px-3.5 text-sm font-medium text-white shadow-overlay transition-[transform,opacity] duration-200 hover:bg-ink-soft print:hidden ${
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
          className="fixed bottom-20 right-4 z-[45] flex max-h-[min(70vh,560px)] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-rule bg-white shadow-overlay focus:outline-none print:hidden"
        >
          <div className="flex items-center justify-between gap-3 bg-ink py-1.5 pl-4 pr-1.5 text-white">
            <div>
              <p id="asesor-hosting-titulo" className="text-[15px] font-semibold">
                Asesor con IA
              </p>
              <p className="text-[13px] text-white/75">Edición {label}</p>
            </div>
            <button
              type="button"
              onClick={() => close()}
              aria-label="Cerrar el asesor"
              className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg hover:bg-white/10 ${FOCUS_ON_INK}`}
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
          <AdvisorChat variant="panel" inputRef={inputRef} />
        </div>
      )}
    </>
  );
};

export default HostingAdvisorFab;

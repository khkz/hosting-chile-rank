import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, X } from 'lucide-react';
import AdvisorChat from './AdvisorChat';
import { ADVISOR_OPEN_EVENT, MOBILE_QUERY, STICKY_PAGE_ATTR } from './events';
import { useEdition } from '@/hooks/useEdition';

const isNarrow = () => typeof window !== 'undefined' && !!window.matchMedia?.(MOBILE_QUERY).matches;
const isStickyBarOn = () => typeof document !== 'undefined' && document.documentElement.dataset.stickyCta === 'on';
const isStickyBarPage = () => typeof document !== 'undefined' && document.documentElement.hasAttribute(STICKY_PAGE_ATTR);

/** Espera tras cada cambio de ruta: la barra fija y el contenido de algunas páginas cargan diferidos. */
const SETTLE_MS = 1000;
/** Pausa que se considera «terminó de desplazar». */
const SCROLL_END_MS = 160;
/** Ancho del botón compacto (solo el ícono). */
const COMPACT_WIDTH = 44;

const INTERACTIVE = 'a[href], button, input, select, textarea, label, [role="button"], [role="link"], [tabindex]:not([tabindex="-1"])';

type Zone = { left: number; top: number; right: number; bottom: number };

/**
 * Zona de reposo del botón, sin la animación de salida (para que no parpadee).
 * clientWidth/clientHeight descuentan la barra de desplazamiento.
 */
const restZone = (fab: HTMLElement, width = fab.offsetWidth): Zone => {
  const cs = getComputedStyle(fab);
  const right = document.documentElement.clientWidth - (parseFloat(cs.right) || 16);
  const bottom = document.documentElement.clientHeight - (parseFloat(cs.bottom) || 16);
  return { left: right - width, top: bottom - fab.offsetHeight, right, bottom };
};

const intersects = (r: DOMRect | Zone, z: Zone) =>
  r.right - r.left > 1 && r.bottom - r.top > 1 && r.left < z.right && r.right > z.left && r.top < z.bottom && r.bottom > z.top;

/** true si algún renglón de texto propio del elemento cae dentro de la zona (ignora textos ocultos de 1 px). */
const textInZone = (el: Element, z: Zone): boolean =>
  Array.from(el.childNodes).some((node) => {
    if (node.nodeType !== Node.TEXT_NODE || !node.textContent?.trim()) return false;
    const range = document.createRange();
    range.selectNodeContents(node);
    return Array.from(range.getClientRects()).some((r) => intersects(r, z));
  });

/**
 * true si en la zona del botón (con el ancho dado) hay texto o un control de
 * la página: el botón no debe tapar datos como la nota de un puesto del ranking.
 * Una grilla de 10 px encuentra los elementos bajo la zona; luego se cruza el
 * rectángulo exacto de su texto o del control con la zona.
 */
const coversContent = (fab: HTMLElement, width?: number): boolean => {
  const z = restZone(fab, width);
  const found = new Set<Element>();
  for (let x = z.left + 1; x < z.right; x += 10) {
    for (let y = z.top + 1; y < z.bottom; y += 10) {
      document.elementsFromPoint(x, y).slice(0, 8).forEach((el) => found.add(el));
    }
  }
  return Array.from(found).some(
    (el) =>
      el !== fab &&
      !fab.contains(el) &&
      !el.closest('#asesor-hosting') &&
      ((el.matches(INTERACTIVE) && intersects(el.getBoundingClientRect(), z)) || textInZone(el, z))
  );
};

/** true si la zona del botón cae sobre un bloque marcado con `data-fab-avoid`. */
const overAvoidZone = (fab: HTMLElement): boolean => {
  const z = restZone(fab);
  return Array.from(document.querySelectorAll('[data-fab-avoid]')).some((el) => {
    const r = el.getBoundingClientRect();
    return r.top < z.bottom && r.bottom > z.top && r.left < z.right && r.right > z.left;
  });
};

/** Anillo de foco blanco hacia adentro, para botones sobre tinta. */
const FOCUS_ON_INK =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white focus-visible:ring-offset-0';

/** Cómo cabe en su esquina: con rótulo, solo el ícono o no cabe (se aparta). */
type Fit = 'label' | 'icon' | 'none';

/**
 * Asesor con IA: botón flotante global (.cl y .com) y su panel.
 * - Va al final del documento: es la última parada de Tab (ver App.tsx).
 * - No tapa contenido: se aparta al llegar al pie, sobre bloques con
 *   `data-fab-avoid` y si en su esquina hay texto o un control (por ejemplo,
 *   la nota del puesto 1 en la portada); si cabe como ícono, se compacta en vez
 *   de apartarse. Se evalúa al terminar de desplazar. En móvil, solo el ícono.
 * - Apartado sigue en el orden de Tab: al recibir el foco vuelve a verse.
 * - En móvil, en las páginas con la barra fija «Cotizar hosting» no se muestra
 *   (la primera pantalla queda libre) y el asesor se abre desde esa barra.
 * - Esc o un clic fuera lo cierran; la conversación se conserva y el foco
 *   vuelve al botón que lo abrió.
 */
const HostingAdvisorFab = () => {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [stepAside, setStepAside] = useState(false);
  const [fit, setFit] = useState<Fit>('label');
  // Empieza apartado y espera un instante: así no aparece sobre un hero que
  // todavía se está cargando ni antes de saber si la página tiene barra fija.
  const [settled, setSettled] = useState(false);
  const [narrow, setNarrow] = useState(isNarrow);
  const [barOn, setBarOn] = useState(isStickyBarOn);
  const [barPage, setBarPage] = useState(isStickyBarPage);
  const fabRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  /** Ancho con rótulo, medido cuando se ve (para no oscilar entre rótulo e ícono). */
  const labelWidthRef = useRef(140);
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

  // Ancho de pantalla y barra fija (StickyCTA marca <html data-sticky-cta…>).
  useEffect(() => {
    const mq = window.matchMedia?.(MOBILE_QUERY);
    const onMq = () => setNarrow(!!mq?.matches);
    mq?.addEventListener?.('change', onMq);
    const mo = new MutationObserver(() => {
      setBarOn(isStickyBarOn());
      setBarPage(isStickyBarPage());
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-sticky-cta', STICKY_PAGE_ATTR] });
    return () => {
      mq?.removeEventListener?.('change', onMq);
      mo.disconnect();
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    let endTimer = 0;
    // ¿Cabe en su esquina sin tapar contenido? Primero con rótulo, luego como ícono.
    const measureFit = () => {
      const fab = fabRef.current;
      if (!fab) return;
      if (fab.offsetWidth > COMPACT_WIDTH) labelWidthRef.current = fab.offsetWidth;
      // En móvil y al bajar ya se muestra solo el ícono.
      const iconAnyway = isNarrow() || window.scrollY > 480;
      if (!iconAnyway && !coversContent(fab, labelWidthRef.current)) return setFit('label');
      setFit(coversContent(fab, COMPACT_WIDTH) ? 'none' : iconAnyway ? 'label' : 'icon');
    };
    const measurePosition = () => {
      setCompact(window.scrollY > 480);
      const fab = fabRef.current;
      const footer = document.querySelector('[data-site-footer]');
      const overFooter = !!footer && footer.getBoundingClientRect().top < window.innerHeight - 8;
      setStepAside(overFooter || (!!fab && overAvoidZone(fab)));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measurePosition);
      window.clearTimeout(endTimer);
      endTimer = window.setTimeout(measureFit, SCROLL_END_MS);
    };
    setSettled(false);
    onScroll();
    // Al asentarse, mide en el mismo instante en que se deja ver: sin parpadeo.
    const settle = window.setTimeout(() => {
      measurePosition();
      measureFit();
      setSettled(true);
    }, SETTLE_MS);
    // El contenido que llega tarde cambia lo que hay bajo el botón.
    const ro = new ResizeObserver(() => {
      window.clearTimeout(endTimer);
      endTimer = window.setTimeout(measureFit, SCROLL_END_MS);
    });
    ro.observe(document.body);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(endTimer);
      window.clearTimeout(settle);
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
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

  // En móvil, con barra fija en la página, el asesor vive en la barra (incluso abierto): sin botón.
  const gone = narrow && (barOn || barPage);
  // Apartado: invisible pero enfocable; con el foco del teclado vuelve a verse.
  const tucked = !gone && !open && (!settled || stepAside || fit === 'none');
  const iconOnly = narrow || compact || open || fit === 'icon';

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
        aria-hidden={gone || undefined}
        tabIndex={gone ? -1 : undefined}
        className={`advisor-fab fixed bottom-4 right-4 z-40 inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-lg bg-ink px-3.5 text-sm font-medium text-white shadow-overlay transition-[transform,opacity] duration-200 hover:bg-ink-soft print:hidden ${
          gone ? 'pointer-events-none translate-y-4 opacity-0' : ''
        } ${
          tucked
            ? 'pointer-events-none translate-y-4 opacity-0 focus-visible:pointer-events-auto focus-visible:translate-y-0 focus-visible:opacity-100'
            : ''
        }`}
      >
        {open ? <X className="h-4 w-4" aria-hidden /> : <MessageCircle className="h-4 w-4" aria-hidden />}
        <span className={iconOnly ? 'sr-only' : undefined}>Asesor con IA</span>
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

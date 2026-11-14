import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Cuánto tiempo se sigue al ancla mientras la página crece (contenido diferido). */
const FOLLOW_MS = 2000;
/** Hasta cuándo se espera a que el ancla exista (secciones diferidas): 30 × 100 ms. */
const FIND_TRIES = 30;
/** Si la persona interactúa, se deja de seguir el ancla: nunca se le quita el control. */
const USER_EVENTS = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;

/** Salto sin animación: respeta prefers-reduced-motion y no pelea con el crecimiento de la página. */
const INSTANT = 'instant' as ScrollBehavior;

/**
 * Al cambiar de ruta vuelve arriba. Si la URL trae un ancla (#directorio,
 * #como-ordenamos…), baja hasta ella cuando la sección existe y la sigue
 * mientras la página siga creciendo por contenido que carga diferido (hasta
 * FOLLOW_MS), para que no quede desplazada. scrollIntoView respeta el
 * scroll-padding-top de la cabecera fija (index.css).
 */
const ScrollToTop = () => {
  const { pathname, hash, key } = useLocation();
  // Con ancla, un segundo clic al mismo enlace (misma URL, nueva entrada) vuelve a bajar.
  // Sin ancla, un cambio de query no sube la página.
  const anchorVisit = hash ? key : null;

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: INSTANT });
      return;
    }
    let id = '';
    try {
      id = decodeURIComponent(hash.slice(1));
    } catch {
      id = hash.slice(1);
    }
    if (!id) return;

    let done = false;
    let tries = 0;
    let timer = 0;
    let raf = 0;
    let ro: ResizeObserver | null = null;

    const stop = () => {
      done = true;
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
      ro?.disconnect();
      USER_EVENTS.forEach((ev) => window.removeEventListener(ev, stop));
    };
    // Desde ya: si la persona se mueve mientras se espera el ancla, no se la arrastra.
    USER_EVENTS.forEach((ev) => window.addEventListener(ev, stop, { passive: true }));

    const jump = (el: HTMLElement) => {
      if (!done && el.isConnected) el.scrollIntoView({ block: 'start', behavior: INSTANT });
    };

    const follow = (el: HTMLElement) => {
      jump(el);
      // Cada vez que la página cambia de alto, vuelve al ancla (una vez por cuadro).
      ro = new ResizeObserver(() => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => jump(el));
      });
      ro.observe(document.body);
      timer = window.setTimeout(stop, FOLLOW_MS);
    };

    const find = () => {
      if (done) return;
      const el = document.getElementById(id);
      if (el) {
        follow(el);
        return;
      }
      if (tries++ < FIND_TRIES) timer = window.setTimeout(find, 100);
    };
    find();
    return stop;
  }, [pathname, hash, anchorVisit]);

  return null;
};

export default ScrollToTop;

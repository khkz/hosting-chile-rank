import { useSyncExternalStore } from 'react';
import { useEdition } from '@/hooks/useEdition';
import { editionHref, getEdition, type EditionKey } from '@/lib/countries';

export const MAX_MESSAGES = 10;
/** Si el asesor no empieza a responder en este plazo, se corta y se ofrece reintentar. */
const FIRST_TOKEN_TIMEOUT_MS = 30_000;
const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/hosting-advisor`;
const ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export type ChatMsg = { role: 'user' | 'assistant'; content: string };

/** Errores que la interfaz sabe explicar. */
export type AdvisorError = 'rate_limited' | 'session_limit' | 'timeout' | 'stopped' | 'failed';

export const QUICK_CHIPS: { key: string; label: string; prompt: string }[] = [
  { key: 'wp', label: 'WordPress / blog', prompt: 'Necesito hosting para un sitio en WordPress.' },
  { key: 'tienda', label: 'Tienda online', prompt: 'Quiero montar una tienda online (WooCommerce o similar).' },
  { key: 'email', label: 'Email corporativo', prompt: 'Busco hosting con email corporativo profesional.' },
  { key: 'web', label: 'Sitio de empresa', prompt: 'Necesito hosting para el sitio web de mi empresa.' },
];

// ── Estado compartido ─────────────────────────────────────────────────
// Un solo estado para todo el sitio: el bloque incrustado de las páginas de
// país y el botón flotante muestran la misma conversación.

interface AdvisorState {
  messages: ChatMsg[];
  streaming: boolean;
  error: AdvisorError | null;
  /** Conversación borrada con "Nueva conversación", para poder deshacer. */
  undo: ChatMsg[] | null;
}

let state: AdvisorState = { messages: [], streaming: false, error: null, undo: null };
const listeners = new Set<() => void>();

const setState = (patch: Partial<AdvisorState> | ((s: AdvisorState) => Partial<AdvisorState>)) => {
  state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) };
  listeners.forEach((l) => l());
};

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};
const getSnapshot = () => state;

const userTurnsOf = (msgs: ChatMsg[]) => msgs.filter((m) => m.role === 'user').length;

const toError = (code: string): AdvisorError =>
  code === 'rate_limited' ? 'rate_limited' : code === 'session_limit' ? 'session_limit' : 'failed';

/** Respuesta en curso; `reason` distingue el corte por tiempo del botón Detener. */
let active: { ctrl: AbortController; reason: 'timeout' | 'stopped' | null } | null = null;
/** Sube con cada "Nueva conversación" para descartar respuestas de la anterior. */
let generation = 0;

async function sendMessage(text: string, edition: EditionKey) {
  const clean = text.trim();
  if (!clean || state.streaming || userTurnsOf(state.messages) >= MAX_MESSAGES) return;

  const gen = generation;
  const history: ChatMsg[] = [...state.messages, { role: 'user', content: clean }];
  setState({ messages: [...history, { role: 'assistant', content: '' }], streaming: true, error: null, undo: null });

  const run: { ctrl: AbortController; reason: 'timeout' | 'stopped' | null } = {
    ctrl: new AbortController(),
    reason: null,
  };
  active = run;
  const timer = window.setTimeout(() => {
    run.reason = 'timeout';
    run.ctrl.abort();
  }, FIRST_TOKEN_TIMEOUT_MS);

  let acc = '';
  try {
    const res = await fetch(FN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: ANON,
        Authorization: `Bearer ${ANON}`,
      },
      // El servidor recibe la edición (CL, PE… o LATAM y países en verificación)
      // para no recomendar una marca de Chile en páginas de otros países.
      body: JSON.stringify({ country: edition, messages: history }),
      signal: run.ctrl.signal,
    });

    if (!res.ok || !res.body) {
      const j = await res.json().catch(() => ({}));
      throw new Error(typeof j?.error === 'string' ? j.error : `http_${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      window.clearTimeout(timer);
      acc += decoder.decode(value, { stream: true });
      if (gen !== generation) continue;
      const content = acc;
      setState((s) => {
        const msgs = s.messages.slice();
        msgs[msgs.length - 1] = { role: 'assistant', content };
        return { messages: msgs };
      });
    }
    if (!acc.trim()) throw new Error('empty_response');
  } catch (e) {
    if (gen === generation) {
      const code = run.reason ?? toError(e instanceof Error ? e.message : '');
      // El aviso de error vive fuera de la conversación: nunca se envía al modelo
      // como si fuera una respuesta suya.
      setState((s) => {
        const msgs = s.messages.slice();
        const last = msgs[msgs.length - 1];
        if (last?.role === 'assistant' && !last.content.trim()) msgs.pop();
        return { messages: msgs, error: code };
      });
    }
  } finally {
    window.clearTimeout(timer);
    if (active === run) active = null;
    if (gen === generation) setState({ streaming: false });
  }
}

function stopAdvisor() {
  if (!active) return;
  active.reason = 'stopped';
  active.ctrl.abort();
}

/** Repite la última pregunta: borra lo que vino después y la envía de nuevo. */
function retryLast(edition: EditionKey) {
  if (state.streaming) return;
  let idx = -1;
  for (let i = state.messages.length - 1; i >= 0; i--) {
    if (state.messages[i].role === 'user') {
      idx = i;
      break;
    }
  }
  if (idx < 0) return;
  const text = state.messages[idx].content;
  setState({ messages: state.messages.slice(0, idx), error: null });
  void sendMessage(text, edition);
}

function resetAdvisor() {
  stopAdvisor();
  generation += 1;
  setState((s) => ({
    messages: [],
    streaming: false,
    error: null,
    undo: s.messages.length ? s.messages : s.undo,
  }));
}

function undoReset() {
  if (!state.undo || state.streaming) return;
  setState({ messages: state.undo, undo: null, error: null });
}

/** Dónde ver todas las alternativas desde la edición actual. */
const allProvidersLink = (key: EditionKey): { href: string; label: string } => {
  if (key !== 'LATAM') {
    const e = getEdition(key);
    if (e.status === 'published') {
      return {
        href: editionHref(e.code, e.code === 'CL' ? '/catalogo' : undefined),
        label: `Ver todos los proveedores de ${e.name}`,
      };
    }
  }
  return { href: editionHref('LATAM'), label: 'Ver el índice por país' };
};

export function useHostingAdvisor() {
  const s = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const { key, label } = useEdition();
  const userTurns = userTurnsOf(s.messages);
  return {
    messages: s.messages,
    streaming: s.streaming,
    error: s.error,
    userTurns,
    atLimit: userTurns >= MAX_MESSAGES,
    canUndo: s.undo !== null && s.messages.length === 0,
    editionKey: key,
    placeLabel: label,
    allLink: allProvidersLink(key),
    send: (text: string) => void sendMessage(text, key),
    retry: () => retryLast(key),
    stop: stopAdvisor,
    reset: resetAdvisor,
    undo: undoReset,
  };
}

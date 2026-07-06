import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getActiveCountryCode } from '@/lib/country';

const MAX_MESSAGES = 10;
const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/hosting-advisor`;
const ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export type ChatMsg = { role: 'user' | 'assistant'; content: string };

export const QUICK_CHIPS: { key: string; label: string; prompt: string }[] = [
  { key: 'wp', label: 'WordPress / blog', prompt: 'Necesito hosting para un sitio en WordPress.' },
  { key: 'tienda', label: 'Tienda online', prompt: 'Quiero montar una tienda online (WooCommerce o similar).' },
  { key: 'email', label: 'Email corporativo', prompt: 'Busco hosting con email corporativo profesional.' },
  { key: 'web', label: 'Sitio de empresa', prompt: 'Necesito hosting para el sitio web de mi empresa.' },
];

export function useHostingAdvisor() {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const country = useMemo(() => getActiveCountryCode(), []);
  const userTurns = messages.filter((m) => m.role === 'user').length;
  const atLimit = userTurns >= MAX_MESSAGES;

  const send = useCallback(async (text: string) => {
    const clean = text.trim();
    if (!clean || streaming || atLimit) return;
    setError(null);

    const next: ChatMsg[] = [...messages, { role: 'user', content: clean }];
    setMessages([...next, { role: 'assistant', content: '' }]);
    setStreaming(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch(FN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: ANON,
          Authorization: `Bearer ${ANON}`,
        },
        body: JSON.stringify({ country, messages: next }),
        signal: ctrl.signal,
      });

      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        const code = j?.error || `http_${res.status}`;
        throw new Error(code);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = prev.slice();
          copy[copy.length - 1] = { role: 'assistant', content: acc };
          return copy;
        });
      }
    } catch (e: any) {
      const msg = e?.message || 'network_error';
      setError(msg);
      setMessages((prev) => {
        const copy = prev.slice();
        // Reemplaza el placeholder vacío con fallback claro
        if (copy.length && copy[copy.length - 1].role === 'assistant' && !copy[copy.length - 1].content) {
          copy[copy.length - 1] = {
            role: 'assistant',
            content:
              'Uy, tuve un problema para responderte ahora. Puedes escribirnos por el formulario y te asesoramos manualmente: /contacto',
          };
        }
        return copy;
      });
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }, [messages, streaming, atLimit, country]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const reset = useCallback(() => {
    stop();
    setMessages([]);
    setError(null);
  }, [stop]);

  return { messages, send, stop, reset, streaming, error, country, userTurns, atLimit };
}

export { MAX_MESSAGES };

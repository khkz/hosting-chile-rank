import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, X, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHostingAdvisor, QUICK_CHIPS, MAX_MESSAGES } from './useHostingAdvisor';

/**
 * Asesor de hosting IA — botón flotante global (todo el sitio, .cl y .com).
 * Discreto, lazy, sin CLS. No modifica ningún otro layout.
 */
const HostingAdvisorFab = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, send, streaming, error, reset, userTurns, atLimit, country } = useHostingAdvisor();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    send(input);
    setInput('');
  };

  const dirLink =
    country === 'CL' ? '/catalogo' : `/${country.toLowerCase()}`;

  return (
    <>
      {/* Botón flotante */}
      <button
        type="button"
        aria-label="Abrir asesor de hosting"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-4 right-4 z-[60] inline-flex items-center gap-2 rounded-full bg-[#2B2D42] text-white shadow-lg px-4 py-3 text-sm font-medium hover:bg-[#2B2D42]/90 transition print:hidden"
        style={{ minHeight: 44 }}
      >
        <MessageCircle className="h-4 w-4" aria-hidden />
        <span className="hidden sm:inline">Asesor de hosting</span>
        <span className="sm:hidden">Asesor</span>
      </button>

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Asesor de hosting"
          className="fixed z-[70] bottom-20 right-4 w-[min(380px,calc(100vw-2rem))] max-h-[70vh] bg-white rounded-xl border border-[#2B2D42]/15 shadow-2xl flex flex-col overflow-hidden print:hidden"
        >
          <div className="flex items-center justify-between px-4 py-2.5 border-b bg-[#2B2D42] text-white">
            <div className="text-sm font-semibold">Asesor de hosting</div>
            <div className="flex items-center gap-1">
              <button
                onClick={reset}
                aria-label="Reiniciar conversación"
                className="p-1.5 rounded hover:bg-white/10"
                title="Reiniciar"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="p-1.5 rounded hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3 text-sm bg-[#F7F9FC]">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-[#2B2D42]/80 leading-snug">
                  Hola 👋 Cuéntame qué tipo de proyecto quieres alojar y en 3-4 preguntas te
                  sugiero un hosting recomendado según datos verificables.
                </p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_CHIPS.map((c) => (
                    <button
                      key={c.key}
                      onClick={() => send(c.prompt)}
                      className="text-xs px-3 py-1.5 rounded-full border border-[#2B2D42]/20 bg-white hover:bg-[#2B2D42]/5"
                      disabled={streaming}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === 'user'
                    ? 'ml-auto max-w-[85%] bg-[#EF233C] text-white rounded-lg px-3 py-2 whitespace-pre-wrap'
                    : 'mr-auto max-w-[92%] bg-white border border-[#2B2D42]/10 rounded-lg px-3 py-2 whitespace-pre-wrap text-[#2B2D42]'
                }
              >
                {m.content || (streaming && i === messages.length - 1 ? '…' : '')}
              </div>
            ))}

            {atLimit && (
              <div className="text-xs text-[#2B2D42]/70 text-center py-2">
                Alcanzaste el límite de {MAX_MESSAGES} mensajes. Si quieres asesoría personalizada,{' '}
                <Link to="/contacto" className="underline font-medium">
                  escríbenos aquí
                </Link>.
              </div>
            )}

            {error && !atLimit && (
              <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
                {error === 'rate_limited'
                  ? 'Estás enviando muchas preguntas. Espera unos segundos.'
                  : error === 'session_limit'
                  ? 'Se alcanzó el límite de la sesión.'
                  : 'No pude responder ahora. '}
                {' '}
                <Link to="/contacto" className="underline">Ir al formulario de cotización</Link>.
              </div>
            )}
          </div>

          <form onSubmit={onSubmit} className="border-t bg-white p-2 flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onSubmit(e as any);
                }
              }}
              disabled={streaming || atLimit}
              rows={1}
              placeholder="Cuéntame tu proyecto…"
              className="flex-1 resize-none text-sm rounded-md border border-[#2B2D42]/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#EF233C]/30 max-h-28"
              aria-label="Escribe tu mensaje"
            />
            <button
              type="submit"
              disabled={streaming || atLimit || !input.trim()}
              aria-label="Enviar"
              className="inline-flex items-center justify-center h-10 w-10 rounded-md bg-[#EF233C] text-white disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

          <div className="px-3 py-2 bg-white text-[10px] text-[#2B2D42]/60 border-t leading-snug">
            Divulgación: podemos recibir una comisión si contratas por los enlaces recomendados. La
            recomendación se basa en datos verificables.{' '}
            <Link to={dirLink} className="underline">Ver todas las alternativas</Link>.
            <span className="ml-1">{userTurns}/{MAX_MESSAGES}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default HostingAdvisorFab;

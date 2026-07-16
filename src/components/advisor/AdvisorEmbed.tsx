import { useEffect, useRef, useState } from 'react';
import { Sparkles, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHostingAdvisor, QUICK_CHIPS, MAX_MESSAGES } from './useHostingAdvisor';

/**
 * Bloque embebido "Te ayudamos a elegir" para landings de país y /latam.
 * NO se monta en el home de Chile (allí solo el FAB flotante es lo nuevo).
 */
const AdvisorEmbed = () => {
  const [input, setInput] = useState('');
  const { messages, send, streaming, error, userTurns, atLimit, country } = useHostingAdvisor();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    send(input);
    setInput('');
  };

  const LONG: Record<string, string> = { pe: 'peru', mx: 'mexico', co: 'colombia', ar: 'argentina' };
  const dirLink = country === 'CL'
    ? '/catalogo'
    : `/${country.toLowerCase()}/mejor-hosting-${LONG[country.toLowerCase()] ?? country.toLowerCase()}-2026`;

  return (
    <section className="my-10 bg-white border border-[#2B2D42]/10 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b bg-[#F7F9FC] flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-[#EF233C]" aria-hidden />
        <h2 className="text-xl font-bold text-[#2B2D42]">Te ayudamos a elegir</h2>
      </div>

      <div className="p-5 space-y-4">
        <p className="text-sm text-[#2B2D42]/80">
          Responde 3-4 preguntas y te recomendamos un hosting según datos verificables (proveedor,
          datacenter, entidad legal, stack técnico).
        </p>

        <div ref={scrollRef} className="max-h-[360px] overflow-y-auto space-y-3 text-sm">
          {messages.length === 0 && (
            <div className="flex flex-wrap gap-2">
              {QUICK_CHIPS.map((c) => (
                <button
                  key={c.key}
                  onClick={() => send(c.prompt)}
                  disabled={streaming}
                  className="text-xs px-3 py-1.5 rounded-full border border-[#2B2D42]/20 bg-white hover:bg-[#2B2D42]/5"
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.role === 'user'
                  ? 'ml-auto max-w-[85%] bg-[#EF233C] text-white rounded-lg px-3 py-2 whitespace-pre-wrap'
                  : 'mr-auto max-w-[92%] bg-[#F7F9FC] border border-[#2B2D42]/10 rounded-lg px-3 py-2 whitespace-pre-wrap text-[#2B2D42]'
              }
            >
              {m.content || (streaming && i === messages.length - 1 ? '…' : '')}
            </div>
          ))}

          {atLimit && (
            <div className="text-xs text-[#2B2D42]/70 text-center py-2">
              Alcanzaste el límite de {MAX_MESSAGES} mensajes.{' '}
              <Link to="/contacto" className="underline font-medium">Ir al formulario</Link>.
            </div>
          )}

          {error && !atLimit && (
            <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
              No pude responder ahora.{' '}
              <Link to="/contacto" className="underline">Ir al formulario de cotización</Link>.
            </div>
          )}
        </div>

        <form onSubmit={onSubmit} className="flex items-end gap-2">
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

        <p className="text-[11px] text-[#2B2D42]/60 leading-snug">
          Divulgación: podemos recibir una comisión si contratas por los enlaces recomendados. La
          recomendación se basa en datos verificables y no altera el resto del directorio.{' '}
          <Link to={dirLink} className="underline">Ver todas las alternativas</Link>.
        </p>
      </div>
    </section>
  );
};

export default AdvisorEmbed;

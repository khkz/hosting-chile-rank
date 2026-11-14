import React, { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, Send, Square } from 'lucide-react';
import AdvisorMessage from './AdvisorMessage';
import { MAX_MESSAGES, QUICK_CHIPS, useHostingAdvisor, type AdvisorError } from './useHostingAdvisor';

const ERROR_TEXT: Record<Exclude<AdvisorError, 'session_limit'>, string> = {
  rate_limited: 'Llegaron muchas preguntas seguidas. Espera un minuto y vuelve a intentarlo.',
  timeout: 'El asesor tardó demasiado en responder.',
  stopped: 'Detuviste la respuesta.',
  failed: 'El asesor no pudo responder.',
};

const linkClass = 'font-medium text-ink underline decoration-ink/30 underline-offset-2 hover:decoration-ink';

const SmartLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) =>
  href.startsWith('/') ? (
    <Link to={href} className={linkClass}>
      {children}
    </Link>
  ) : (
    <a href={href} className={linkClass}>
      {children}
    </a>
  );

interface AdvisorChatProps {
  /** "panel": dentro del botón flotante. "embed": bloque en la página. */
  variant: 'panel' | 'embed';
  /** El panel lleva el foco a este campo al abrirse. */
  inputRef?: React.RefObject<HTMLTextAreaElement>;
}

/** Conversación del asesor; la misma en el panel flotante y en el bloque incrustado. */
const AdvisorChat: React.FC<AdvisorChatProps> = ({ variant, inputRef }) => {
  const a = useHostingAdvisor();
  const [input, setInput] = useState('');
  const logRef = useRef<HTMLDivElement>(null);
  const inputId = useId();
  const isPanel = variant === 'panel';

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [a.messages, a.error, a.streaming]);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || a.streaming || a.atLimit) return;
    a.send(input);
    setInput('');
  };

  const last = a.messages[a.messages.length - 1];
  const waiting = a.streaming && last?.role === 'assistant' && !last.content;
  const showLimit = !a.streaming && (a.atLimit || a.error === 'session_limit');
  const errorText = a.error && a.error !== 'session_limit' && !a.streaming ? ERROR_TEXT[a.error] : null;

  return (
    <div className={isPanel ? 'flex min-h-0 flex-1 flex-col' : 'flex flex-col'}>
      <div
        ref={logRef}
        role="log"
        aria-label="Conversación con el asesor"
        aria-busy={a.streaming}
        className={
          isPanel
            ? 'min-h-0 flex-1 space-y-3 overflow-y-auto bg-paper px-3 py-3 text-base md:text-[15px]'
            : 'max-h-[380px] space-y-3 overflow-y-auto text-base md:text-[15px]'
        }
      >
        {a.messages.length === 0 && (
          <div className="space-y-3 text-ink-2">
            <p className="leading-snug">
              Cuéntame qué quieres alojar y te sugiero un hosting
              {a.editionKey === 'LATAM' ? '' : ` en ${a.placeLabel}`}. Respondo con inteligencia artificial y puedo
              equivocarme: confirma precios y condiciones con el proveedor.
            </p>
            {a.canUndo && (
              <p className="text-sm">
                Borraste la conversación.{' '}
                <button type="button" onClick={a.undo} className={linkClass}>
                  Deshacer
                </button>
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {QUICK_CHIPS.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => a.send(c.prompt)}
                  disabled={a.streaming}
                  className="inline-flex min-h-11 items-center rounded-lg border border-input bg-white px-3 text-sm text-ink hover:border-ink hover:bg-paper disabled:opacity-50 sm:min-h-9"
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {a.messages.map((m, i) =>
          m.role === 'user' ? (
            <div key={i} className="ml-auto max-w-[85%] whitespace-pre-wrap rounded-lg bg-ink px-3 py-2 text-white">
              {m.content}
            </div>
          ) : m.content ? (
            <div
              key={i}
              className={`mr-auto max-w-[92%] rounded-lg border border-rule px-3 py-2 text-ink ${
                isPanel ? 'bg-white' : 'bg-paper'
              }`}
            >
              <AdvisorMessage content={m.content} />
            </div>
          ) : null
        )}

        {waiting && <p className="t-meta">El asesor está escribiendo…</p>}

        {showLimit && (
          <div className="rounded-lg border border-rule bg-white px-3 py-2 text-sm text-ink-2">
            Esta conversación llegó al límite de {MAX_MESSAGES} mensajes. Puedes{' '}
            <button type="button" onClick={a.reset} className={linkClass}>
              empezar otra
            </button>{' '}
            o <SmartLink href="/contacto">escribirnos por el formulario de contacto</SmartLink>.
          </div>
        )}

        {errorText && (
          <div role="alert" className="rounded-lg border border-rule border-l-4 border-l-ink bg-white px-3 py-2 text-sm text-ink">
            <p>{errorText}</p>
            <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
              <button type="button" onClick={a.retry} className="font-semibold text-ink underline underline-offset-2">
                Reintentar
              </button>
              <SmartLink href="/contacto">Escribirnos por el formulario de contacto</SmartLink>
            </p>
          </div>
        )}
      </div>

      <form
        onSubmit={submit}
        className={isPanel ? 'flex items-end gap-2 border-t border-rule bg-white p-2' : 'mt-4 flex items-end gap-2'}
      >
        <label htmlFor={inputId} className="sr-only">
          Escribe tu mensaje
        </label>
        <textarea
          id={inputId}
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          disabled={a.atLimit}
          rows={1}
          placeholder={a.atLimit ? 'Llegaste al límite de mensajes' : 'Cuéntame tu proyecto…'}
          className="max-h-28 min-h-11 flex-1 resize-none rounded-lg border border-input bg-white px-3 py-2.5 text-base text-ink placeholder:text-ink-3 focus-visible:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-0 disabled:bg-paper md:text-[15px]"
        />
        {a.streaming ? (
          <button
            type="button"
            onClick={a.stop}
            className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-ink/25 bg-white px-3 text-sm font-medium text-ink hover:border-ink hover:bg-paper"
          >
            <Square className="h-3.5 w-3.5" aria-hidden />
            Detener
          </button>
        ) : (
          <button
            type="submit"
            disabled={a.atLimit || !input.trim()}
            aria-label="Enviar"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-ink text-white hover:bg-ink-soft disabled:opacity-40"
          >
            <Send className="h-4 w-4" aria-hidden />
          </button>
        )}
      </form>

      <div
        className={
          isPanel
            ? 'border-t border-rule bg-white px-3 py-2 text-xs leading-snug text-ink-3'
            : 'mt-3 text-[13px] leading-snug text-ink-3'
        }
      >
        <p>
          La recomendación principal es editorial. EligeTuHosting mantiene relación comercial con algunos proveedores
          y puede recibir una comisión si contratas por sus enlaces.{' '}
          <SmartLink href={a.allLink.href}>{a.allLink.label}</SmartLink>.
        </p>
        <p className="mt-1.5 flex items-center justify-between gap-3">
          <span>
            {a.userTurns === 0
              ? `Hasta ${MAX_MESSAGES} mensajes por conversación`
              : `Mensajes: ${a.userTurns} de ${MAX_MESSAGES}`}
          </span>
          {a.messages.length > 0 && (
            <button
              type="button"
              onClick={a.reset}
              className="inline-flex min-h-11 items-center gap-1 rounded-sm font-medium text-ink-2 hover:text-ink sm:min-h-8"
            >
              <RotateCcw className="h-3 w-3" aria-hidden />
              Nueva conversación
            </button>
          )}
        </p>
      </div>
    </div>
  );
};

export default AdvisorChat;

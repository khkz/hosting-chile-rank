import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

/**
 * Texto de una respuesta del asesor con el Markdown mínimo que usa el modelo:
 * **negritas**, [texto](url), URLs sueltas, rutas internas (/catalogo) y
 * viñetas con "- ". Liviano a propósito: el asesor se carga en todas las
 * páginas y react-markdown pesa ~170 KB.
 *
 * Solo se enlazan http(s) y rutas que empiezan con "/", nunca otros esquemas.
 * Sin lookbehind en la expresión regular: Safari anterior a 16.4 no lo admite
 * y el módulo entero fallaría al cargarse.
 */

const TOKEN_RE =
  /(\*\*[^*]+\*\*)|(\[[^\]]+\]\((?:https?:\/\/|\/)[^)\s]+\))|(https?:\/\/[^\s)<]+)|(^|[\s(])(\/[a-z0-9][a-z0-9\-/#]*)/gi;

const linkClass = 'font-medium text-ink underline decoration-ink/30 underline-offset-2 hover:decoration-ink';

const renderLink = (href: string, label: string, key: string) =>
  href.startsWith('/') ? (
    <Link key={key} to={href} className={linkClass}>
      {label}
    </Link>
  ) : (
    <a key={key} href={href} target="_blank" rel="noopener" className={linkClass}>
      {label}
      <ExternalLink className="ml-0.5 inline h-3 w-3 align-[-1px]" aria-hidden />
      <span className="sr-only"> (se abre en otra pestaña)</span>
    </a>
  );

const renderInline = (text: string, keyPrefix: string): React.ReactNode[] => {
  const out: React.ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(TOKEN_RE)) {
    const lead = m[4] ?? '';
    const start = (m.index ?? 0) + lead.length;
    const tok = m[0].slice(lead.length);
    if (start > last) out.push(text.slice(last, start));
    const key = `${keyPrefix}-${i++}`;
    if (m[1]) {
      out.push(
        <strong key={key} className="font-semibold">
          {renderInline(tok.slice(2, -2), key)}
        </strong>
      );
    } else if (m[2]) {
      const mm = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(tok);
      out.push(mm ? renderLink(mm[2], mm[1], key) : tok);
    } else {
      // URL o ruta suelta: el punto final de la frase no es parte del enlace.
      const clean = tok.replace(/[.,;:]+$/, '');
      out.push(renderLink(clean, clean.replace(/^https?:\/\/(www\.)?/, ''), key));
      if (clean.length < tok.length) out.push(tok.slice(clean.length));
    }
    last = start + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
};

const AdvisorMessage: React.FC<{ content: string }> = ({ content }) => {
  // Une "**Nombre** ([url](url))" en un solo enlace con el nombre.
  const normalized = content.replace(/\*\*([^*]+)\*\*\s*\(\[(https?:\/\/[^\]]+)\]\(\2\)\)/g, '[$1]($2)');
  const blocks = normalized.split(/\n{2,}/);
  return (
    <div className="space-y-2 leading-relaxed">
      {blocks.map((block, bi) => {
        const lines = block.split('\n').filter((l) => l.trim() !== '');
        if (lines.length === 0) return null;
        const isList = lines.every((l) => /^\s*[-•*]\s+/.test(l));
        if (isList) {
          return (
            <ul key={bi} className="list-disc space-y-1 pl-4">
              {lines.map((l, li) => (
                <li key={li}>{renderInline(l.replace(/^\s*[-•*]\s+/, ''), `${bi}-${li}`)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={bi}>
            {lines.map((l, li) => (
              <React.Fragment key={li}>
                {li > 0 && <br />}
                {renderInline(l.replace(/^\s*[-•*]\s+/, '• '), `${bi}-${li}`)}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
};

export default AdvisorMessage;

import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ExternalLink, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Section from '@/components/system/Section';
import { formatToolDateTime, isoDateTime } from './dataTime';

interface FaqItem {
  question: string;
  answer: string;
}

interface UltimosDominiosInfoProps {
  faqItems: FaqItem[];
  updated: string | null;
}

const GUIDES = [
  { title: 'Hosting', path: '/guia-elegir-hosting' },
  { title: 'VPS', path: '/guia-elegir-vps' },
  { title: 'Servidor dedicado', path: '/guia-elegir-servidor-dedicado' },
  { title: 'Certificado SSL', path: '/guia-elegir-ssl' },
];

/**
 * Bloques de texto de /ultimos-dominios. Conserva los id «geo-editorial» y
 * «geo-faq»: los cita el JSON-LD (speakable) de la página.
 */
const UltimosDominiosInfo: React.FC<UltimosDominiosInfoProps> = ({ faqItems, updated }) => (
  <>
    <Section tone="paper" id="geo-editorial" title="Registro de dominios .cl en Chile: de dónde salen estos datos">
      <div className="prose">
        <p>
          Chile cuenta con más de <strong>600.000 dominios .cl activos</strong>, administrados por NIC Chile, el organismo
          dependiente de la Universidad de Chile que gestiona el registro de nombres de dominio del país desde 1987. En promedio, se
          registran entre <strong>300 y 600 nuevos dominios .cl cada día hábil</strong>, con picos de actividad los lunes y martes.
        </p>
        <p>
          Esta página muestra los últimos dominios inscritos en NIC Chile. Se actualiza automáticamente cada hora mediante un sistema
          de scraping que procesa el registro público de{' '}
          <a href="https://www.nic.cl/registry/Ultimos.do?t=1d" target="_blank" rel="noopener noreferrer">
            nic.cl
          </a>
          , así que lo que ves puede tener hasta una hora de atraso. Los datos están disponibles como <strong>Open Data</strong> en
          formato JSON y RSS para investigadores, desarrolladores y analistas del ecosistema digital chileno.
        </p>
        <p>
          <strong>Fuente:</strong> datos obtenidos del registro público de NIC Chile (nic.cl). Última lectura:{' '}
          {updated ? <time dateTime={isoDateTime(updated)}>{formatToolDateTime(updated)}</time> : 'sin dato'}. Frecuencia: cada hora
          vía GitHub Actions.
        </p>
      </div>
    </Section>

    <Section id="geo-faq" title="Preguntas frecuentes sobre dominios .cl">
      <div className="measure divide-y divide-rule border-y border-rule">
        {faqItems.map((item) => (
          <details key={item.question} className="group">
            <summary className="flex min-h-11 cursor-pointer list-none items-start justify-between gap-4 py-4 font-semibold text-ink [&::-webkit-details-marker]:hidden">
              <span>{item.question}</span>
              <ChevronDown aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-ink-2 transition-transform group-open:rotate-180" />
            </summary>
            <p className="t-body pb-4 text-ink-2">{item.answer}</p>
          </details>
        ))}
      </div>
    </Section>

    <Section tone="ink" title="¿Quieres registrar tu propio dominio .cl?">
      {/* Bajada propia: .t-lead fija ink-2 y no se ve sobre la banda oscura. */}
      <p className="-mt-4 mb-6 max-w-[62ch] text-lg leading-relaxed text-white/75 md:-mt-6">
        Registra tu dominio con los mejores proveedores de hosting en Chile
      </p>
      <Button asChild variant="secondary" size="lg">
        <a href="https://www.hostingplus.cl/dominios" target="_blank" rel="noopener noreferrer">
          <Globe aria-hidden />
          Registrar un dominio
          <ExternalLink aria-hidden />
        </a>
      </Button>
      <nav aria-label="Guías para elegir" className="mt-8">
        <p className="t-small text-white/75">Antes de contratar, revisa nuestras guías para elegir:</p>
        <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
          {GUIDES.map((g) => (
            <li key={g.path}>
              <Link to={g.path} className="inline-flex min-h-11 items-center font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">
                {g.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Section>
  </>
);

export default UltimosDominiosInfo;

import React from 'react';
import { Link } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

interface RankingAuthorityBlockProps {
  /** Se mantiene por compatibilidad; la fecha del ranking la muestra cada página. */
  lastUpdated?: string | Date | null;
  className?: string;
}

const linkClass = 'font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink';

/** Divulgación del ranking en una línea, con enlace a los pesos publicados. */
export const RankingDisclosure: React.FC<{ className?: string }> = ({ className }) => (
  <p className={cn('text-base leading-relaxed text-ink-2 md:text-sm', className)}>
    <strong className="font-semibold text-ink">Divulgación:</strong> el editor mantiene relación comercial con algunos
    de los proveedores listados y algunos enlaces pueden generar una comisión, sin costo para ti.{' '}
    <Link to="/metodologia" className={linkClass}>
      Pesos publicados
    </Link>
    {' y '}
    <Link to="/transparencia-hosting-chile" className={linkClass}>
      transparencia
    </Link>
    .
  </p>
);

/** «¿Por qué HostingPlus es #1?»: texto sin cambios (decisión pendiente 3), con el estilo del sistema. */
export const WhyFirstAccordion: React.FC<{ className?: string }> = ({ className }) => (
  <Accordion type="single" collapsible className={cn('border-y border-rule', className)}>
    <AccordionItem value="por-que-hp" className="border-0">
      <AccordionTrigger className="min-h-[44px] py-3 text-left text-base font-semibold text-ink hover:no-underline">
        ¿Por qué HostingPlus es #1?
      </AccordionTrigger>
      <AccordionContent className="measure space-y-3 text-base leading-relaxed text-ink-2 md:text-[15px]">
        <p>
          Nuestro ranking ordena por <strong className="text-ink">valor general para la pyme chilena</strong>: combina
          precio justo, soporte local 24/7 en español, infraestructura en Chile (baja latencia e IP local)
          y reputación verificable. HostingPlus lidera porque cumple en los cuatro frentes y mantiene
          <strong className="text-ink"> 0 reclamos abiertos</strong> en los registros públicos que monitoreamos.
        </p>
        <p>
          Reconocemos con transparencia que <strong className="text-ink">según otros criterios hay otros líderes</strong>.
          Por ejemplo, si se mide por <strong className="text-ink">tamaño de red propia / ASN</strong>, el líder técnico en
          Chile es <Link to="/catalogo/powerhost" className={linkClass}>PowerHost</Link>
          {' '}con su AS263237 y datacenter propio. Para criterios como sostenibilidad o precio mínimo,
          también pueden destacar otros proveedores del Top 10.
        </p>
        <p>
          Consulta el detalle completo en{' '}
          <Link to="/estudio-hosting-chile-2026" className={linkClass}>
            Estudio Hosting Chile 2026
          </Link>{' '}
          y la fórmula de puntuación en{' '}
          <Link to="/metodologia" className={linkClass}>
            la metodología
          </Link>.
        </p>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);

/**
 * Divulgación y «¿Por qué…?» juntos, para las páginas que los muestran antes
 * de la lista (/ranking). La portada usa las piezas por separado: la
 * divulgación arriba y el acordeón bajo los tres primeros.
 */
const RankingAuthorityBlock: React.FC<RankingAuthorityBlockProps> = ({ className = '' }) => (
  <div className={className}>
    <RankingDisclosure />
    <WhyFirstAccordion className="mt-4" />
  </div>
);

export default RankingAuthorityBlock;

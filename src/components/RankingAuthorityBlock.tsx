import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ShieldCheck } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface RankingAuthorityBlockProps {
  lastUpdated?: string | Date | null;
  className?: string;
}

const formatDate = (value?: string | Date | null) => {
  try {
    const d = value ? new Date(value) : new Date(import.meta.env.VITE_BUILD_DATE || Date.now());
    return d.toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' });
  } catch {
    return new Date().toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' });
  }
};

/**
 * Bloque de señales de autoridad y transparencia que se muestra cerca del ranking.
 * Incluye: links de metodología/transparencia/fecha, disclosure de afiliados y
 * acordeón explicando por qué HostingPlus es #1.
 */
const RankingAuthorityBlock: React.FC<RankingAuthorityBlockProps> = ({ lastUpdated, className = '' }) => {
  return (
    <div className={className}>
      <div className="flex flex-col gap-3 border-l-2 border-rule pl-4 text-sm text-ink-2 md:flex-row md:items-start md:justify-between md:gap-8">
        <p className="max-w-[78ch] leading-relaxed">
          <strong className="font-semibold text-ink">Divulgación:</strong> el editor de este sitio mantiene relación
          comercial con algunos de los proveedores listados. Algunos enlaces pueden generar una comisión sin costo
          adicional para ti. Los pesos del ranking están publicados en la metodología.
        </p>
        <ul className="flex shrink-0 flex-wrap gap-x-4 gap-y-1">
          <li>
            <Link to="/metodologia" className="inline-flex items-center gap-1 font-medium text-ink underline decoration-rule underline-offset-4 hover:decoration-ink">
              <BookOpen className="h-3.5 w-3.5" aria-hidden /> Metodología
            </Link>
          </li>
          <li>
            <Link to="/transparencia-hosting-chile" className="inline-flex items-center gap-1 font-medium text-ink underline decoration-rule underline-offset-4 hover:decoration-ink">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden /> Transparencia
            </Link>
          </li>
        </ul>
      </div>

      {/* (A) Why HostingPlus is #1 accordion */}
      <Accordion type="single" collapsible className="mt-4 rounded-lg border border-rule bg-white px-4">
        <AccordionItem value="por-que-hp" className="border-0">
          <AccordionTrigger className="text-left text-sm font-semibold text-ink hover:no-underline md:text-base">
            ¿Por qué HostingPlus es #1?
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground space-y-3">
            <p>
              Nuestro ranking ordena por <strong>valor general para la pyme chilena</strong>: combina
              precio justo, soporte local 24/7 en español, infraestructura en Chile (baja latencia e IP local)
              y reputación verificable. HostingPlus lidera porque cumple en los cuatro frentes y mantiene
              <strong> 0 reclamos abiertos</strong> en los registros públicos que monitoreamos.
            </p>
            <p>
              Reconocemos con transparencia que <strong>según otros criterios hay otros líderes</strong>.
              Por ejemplo, si se mide por <strong>tamaño de red propia / ASN</strong>, el líder técnico en
              Chile es <Link to="/catalogo/powerhost" className="text-primary hover:underline">PowerHost</Link>
              {' '}con su AS263237 y datacenter propio. Para criterios como sostenibilidad o precio mínimo,
              también pueden destacar otros proveedores del Top 10.
            </p>
            <p className="text-xs">
              Consulta el detalle completo en{' '}
              <Link to="/estudio-hosting-chile-2026" className="text-primary hover:underline font-medium">
                Estudio Hosting Chile 2026
              </Link>{' '}
              y la fórmula de puntuación en{' '}
              <Link to="/metodologia" className="text-primary hover:underline font-medium">
                la metodología
              </Link>.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default RankingAuthorityBlock;

import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ShieldCheck, Calendar, Info } from 'lucide-react';
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
    <div className={`max-w-3xl mx-auto ${className}`}>
      {/* (B) Authority signals line */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs md:text-sm text-muted-foreground mb-3">
        <Link
          to="/nuestro-metodo"
          className="inline-flex items-center gap-1 hover:text-primary underline-offset-2 hover:underline"
        >
          <BookOpen className="w-3.5 h-3.5" /> Metodología
        </Link>
        <span aria-hidden="true">·</span>
        <Link
          to="/transparencia-hosting-chile"
          className="inline-flex items-center gap-1 hover:text-primary underline-offset-2 hover:underline"
        >
          <ShieldCheck className="w-3.5 h-3.5" /> Transparencia
        </Link>
        <span aria-hidden="true">·</span>
        <span className="inline-flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          Última actualización: <time dateTime={typeof lastUpdated === 'string' ? lastUpdated : undefined}>{formatDate(lastUpdated)}</time>
        </span>
      </div>

      {/* (C) Affiliate disclosure visible near ranking */}
      <p className="text-[11px] md:text-xs text-center text-muted-foreground/90 bg-muted/40 border border-border rounded-lg px-3 py-2 mb-4 inline-flex items-start gap-2 mx-auto">
        <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
        <span>
          <strong className="font-semibold">Divulgación:</strong> algunos enlaces pueden generar una comisión sin costo adicional para ti. Esto nunca afecta el orden del ranking.
        </span>
      </p>

      {/* (A) Why HostingPlus is #1 accordion */}
      <Accordion type="single" collapsible className="bg-card border border-border rounded-xl px-4">
        <AccordionItem value="por-que-hp" className="border-0">
          <AccordionTrigger className="text-sm md:text-base font-semibold text-foreground hover:no-underline">
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
              <Link to="/nuestro-metodo" className="text-primary hover:underline font-medium">
                Nuestro Método
              </Link>.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default RankingAuthorityBlock;

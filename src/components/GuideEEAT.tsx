import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { BookOpen, Calendar, FlaskConical, Users, ExternalLink } from 'lucide-react';

export interface GuideSource {
  label: string;
  url: string;
}

interface GuideEEATProps {
  reviewedAt: string; // ISO date
  reviewer?: string;
  expertise: string;
  sources: GuideSource[];
}

/**
 * Bloque de señales E-E-A-T para guías: experiencia del equipo,
 * fecha de revisión, metodología verificable y fuentes citadas.
 * Pensado para que LLMs y buscadores identifiquen autoría y evidencia.
 */
const GuideEEAT: React.FC<GuideEEATProps> = ({
  reviewedAt,
  reviewer = 'Equipo Editorial de EligeTuHosting',
  expertise,
  sources,
}) => {
  const date = new Date(reviewedAt).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Card className="my-10 p-6 border-l-4 border-l-primary bg-muted/30" aria-labelledby="guide-eeat-heading">
      <h2 id="guide-eeat-heading" className="sr-only">
        Cómo verificamos este contenido
      </h2>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="flex items-start gap-3">
          <Users className="w-5 h-5 text-primary mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Autoría y experiencia</p>
            <p className="text-sm text-foreground">
              <Link to="/sobre-nosotros" className="font-semibold text-primary underline">
                {reviewer}
              </Link>
            </p>
            <p className="text-xs text-muted-foreground mt-1">{expertise}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-primary mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Última revisión</p>
            <p className="text-sm text-foreground font-semibold">{date}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Actualizamos cuando cambian las condiciones del mercado.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <FlaskConical className="w-5 h-5 text-primary mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Metodología</p>
            <p className="text-sm text-foreground">
              Datos cuantitativos provienen de nuestros{' '}
              <Link to="/metodologia-benchmark" className="text-primary underline">
                benchmarks reproducibles
              </Link>{' '}
              y de la{' '}
              <Link to="/metodologia" className="text-primary underline">
                curación manual
              </Link>{' '}
              de proveedores verificados.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-primary mt-0.5 shrink-0" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Fuentes citadas</p>
            <ul className="text-sm space-y-1 mt-1">
              {sources.map((s) => (
                <li key={s.url} className="truncate">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-primary underline inline-flex items-center gap-1"
                  >
                    <span className="truncate">{s.label}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GuideEEAT;

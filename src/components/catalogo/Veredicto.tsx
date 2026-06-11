import React from 'react';
import { Card } from '@/components/ui/card';
import { Sparkles, ThumbsUp, ThumbsDown } from 'lucide-react';

interface VeredictoProps {
  name: string;
  rating: number;
  editorial?: string | null;
  pros?: string[] | null;
  cons?: string[] | null;
}

/** Genera pros/contras fallback cuando la DB no los trae. */
function fallbackPros(name: string): string[] {
  return [
    `${name} aparece en el catálogo verificado de EligeTuHosting.cl 2026.`,
    'Datos de contacto y operación contrastables públicamente.',
    'Cubre planes estándar de hosting compartido para usuarios chilenos.',
  ];
}
function fallbackCons(name: string): string[] {
  return [
    `${name} no publica algunos datos técnicos (SLA, datacenter exacto) en su web.`,
    'Catálogo de planes y precios sujeto a cambios sin aviso por parte del proveedor.',
  ];
}

const Veredicto: React.FC<VeredictoProps> = ({ name, rating, editorial, pros, cons }) => {
  const finalPros = (pros && pros.length >= 3 ? pros.slice(0, 3) : fallbackPros(name));
  const finalCons = (cons && cons.length >= 2 ? cons.slice(0, 2) : fallbackCons(name));

  const veredictoText = editorial && editorial.trim().length > 0
    ? editorial
    : `${name} obtiene una nota editorial de ${rating.toFixed(1)}/10 en nuestra evaluación 2026. La nota refleja el balance entre transparencia, infraestructura declarada y posicionamiento dentro del mercado chileno de hosting.`;

  return (
    <section className="mt-10">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Veredicto editorial
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-6">{veredictoText}</p>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-green-700">
              <ThumbsUp className="w-4 h-4" /> A favor
            </h3>
            <ul className="space-y-2 text-sm">
              {finalPros.map((p, i) => (
                <li key={i} className="flex gap-2"><span className="text-green-600">+</span>{p}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-red-700">
              <ThumbsDown className="w-4 h-4" /> En contra
            </h3>
            <ul className="space-y-2 text-sm">
              {finalCons.map((c, i) => (
                <li key={i} className="flex gap-2"><span className="text-red-600">−</span>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </section>
  );
};

export default Veredicto;

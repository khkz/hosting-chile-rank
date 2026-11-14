import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GlossaryTerm {
  term: string;
  definition: string;
  /** Consejo práctico. Sin cifras de rendimiento: no hay medición propia que las respalde. */
  tip?: string;
}

const glossaryTerms: GlossaryTerm[] = [
  {
    term: 'SSD',
    definition: 'Disco de estado sólido. Almacenamiento más rápido que los discos HDD tradicionales, mejora la velocidad de carga.',
    tip: 'Si el plan dice NVMe, es la variante más rápida de SSD.',
  },
  {
    term: 'RAM',
    definition: 'Memoria de acceso aleatorio. Determina cuántos procesos simultáneos puede manejar tu hosting.',
    tip: 'Si usas WordPress con muchos plugins, revisa cuánta RAM incluye el plan.',
  },
  {
    term: 'cPanel',
    definition: 'Panel de control web para gestionar tu hosting: archivos, correos y bases de datos desde una interfaz gráfica.',
    tip: 'Es el panel más común en hosting compartido; pregunta cuál usa el plan antes de contratar.',
  },
  {
    term: 'SSL/TLS',
    definition: 'Certificado de seguridad que cifra la comunicación entre el navegador y el servidor. Google lo exige para no marcar tu sitio como inseguro.',
    tip: 'Cambia HTTP a HTTPS en tu URL.',
  },
  {
    term: 'CDN',
    definition: 'Red de distribución de contenido. Copia los archivos de tu sitio en servidores de varias regiones para que carguen desde el más cercano.',
    tip: 'Sirve sobre todo si tienes visitas desde varios países.',
  },
  {
    term: 'Ancho de banda',
    definition: 'Cantidad de datos que tu sitio puede transferir cada mes. Afecta cuántas visitas puedes recibir.',
    tip: 'Revisa si es ilimitado o tiene un tope mensual, y qué pasa si lo superas.',
  },
  {
    term: 'Uptime',
    definition: 'Porcentaje de tiempo que tu sitio está disponible. Un 99,9 % equivale a unas 8,8 horas sin servicio al año.',
    tip: 'Busca una garantía de al menos 99,9 % por escrito.',
  },
  {
    term: 'LiteSpeed',
    definition: 'Servidor web alternativo a Apache, con caché integrado y optimizaciones para WordPress.',
    tip: 'En WordPress se aprovecha con el plugin LiteSpeed Cache.',
  },
];

const INITIAL = 4;

/** Glosario técnico corto. La sección que lo contiene pone el título. */
const TechnicalGlossary: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayedTerms = isExpanded ? glossaryTerms : glossaryTerms.slice(0, INITIAL);

  return (
    <div>
      <dl id="glosario-terminos" className="grid gap-x-10 gap-y-6 md:grid-cols-2">
        {displayedTerms.map((item) => (
          <div key={item.term} className="max-w-[62ch] border-t border-rule pt-4">
            <dt className="t-h3 text-ink">{item.term}</dt>
            <dd className="mt-1.5 t-body text-ink-2">
              {item.definition}
              {item.tip && <span className="mt-2 block t-small text-ink">{item.tip}</span>}
            </dd>
          </div>
        ))}
      </dl>

      {glossaryTerms.length > INITIAL && (
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-controls="glosario-terminos"
          className="mt-8"
        >
          {isExpanded ? (
            <>
              Ver menos <ChevronUp aria-hidden />
            </>
          ) : (
            <>
              Ver {glossaryTerms.length - INITIAL} términos más <ChevronDown aria-hidden />
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default TechnicalGlossary;

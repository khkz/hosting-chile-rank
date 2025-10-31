import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GlossaryTerm {
  term: string;
  definition: string;
  example?: string;
}

const glossaryTerms: GlossaryTerm[] = [
  {
    term: "SSD",
    definition: "Disco de Estado Sólido. Almacenamiento más rápido que los discos HDD tradicionales, mejora significativamente la velocidad de carga.",
    example: "Un sitio en SSD carga 3-5x más rápido que en HDD"
  },
  {
    term: "RAM",
    definition: "Memoria de Acceso Aleatorio. Determina cuántos procesos simultáneos puede manejar tu hosting.",
    example: "2GB RAM = 500-1000 visitas/día aprox."
  },
  {
    term: "cPanel",
    definition: "Panel de control web más popular para gestionar hosting. Interfaz gráfica fácil para administrar archivos, emails, bases de datos.",
    example: "99% de los hostings chilenos usan cPanel"
  },
  {
    term: "SSL/TLS",
    definition: "Certificado de seguridad que encripta la comunicación entre el navegador y el servidor. Obligatorio para Google.",
    example: "Cambia HTTP a HTTPS en tu URL"
  },
  {
    term: "CDN",
    definition: "Red de Distribución de Contenido. Copia tu sitio en servidores mundiales para acelerar la carga global.",
    example: "Cloudflare CDN reduce latencia 40-60%"
  },
  {
    term: "Ancho de Banda",
    definition: "Cantidad de datos que tu sitio puede transferir mensualmente. Afecta cuántas visitas puedes recibir.",
    example: "10GB = ~2,500 visitas/mes (sitio promedio)"
  },
  {
    term: "Uptime",
    definition: "Porcentaje de tiempo que tu sitio está disponible. 99.9% = 8.7 horas offline por año.",
    example: "Busca mínimo 99.9% de uptime garantizado"
  },
  {
    term: "LiteSpeed",
    definition: "Servidor web moderno más rápido que Apache. Optimización automática para WordPress y caché integrado.",
    example: "40% más rápido que Apache en benchmarks"
  },
];

const TechnicalGlossary: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayedTerms = isExpanded ? glossaryTerms : glossaryTerms.slice(0, 4);

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Info className="h-6 w-6 text-primary" />
          Glosario Técnico Interactivo
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Entiende las especificaciones técnicas antes de comparar planes
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          <TooltipProvider>
            {displayedTerms.map((item, index) => (
              <div key={index} className="bg-background p-4 rounded-lg shadow-sm">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <h4 className="font-semibold text-foreground flex items-center gap-2 cursor-help">
                      {item.term}
                      <Info className="h-4 w-4 text-primary" />
                    </h4>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm">{item.definition}</p>
                    {item.example && (
                      <p className="text-xs text-muted-foreground mt-2 italic">
                        💡 {item.example}
                      </p>
                    )}
                  </TooltipContent>
                </Tooltip>
                <p className="text-sm text-muted-foreground mt-2">
                  {item.definition}
                </p>
                {item.example && (
                  <p className="text-xs text-primary mt-2 font-medium">
                    💡 {item.example}
                  </p>
                )}
              </div>
            ))}
          </TooltipProvider>
        </div>
        
        {glossaryTerms.length > 4 && (
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
              className="gap-2"
            >
              {isExpanded ? (
                <>
                  Ver menos <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Ver más términos ({glossaryTerms.length - 4} más) <ChevronDown className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TechnicalGlossary;

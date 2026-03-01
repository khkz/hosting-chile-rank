import React from 'react';
import { FlaskConical, Clock, Globe, PhoneCall, Receipt } from 'lucide-react';

const MethodologySection: React.FC = () => {
  return (
    <section className="py-16 bg-muted/30 border-t border-border" aria-labelledby="methodology-heading">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2
          id="methodology-heading"
          className="text-2xl font-semibold text-foreground mb-2"
        >
          Nuestra Metodología de Evaluación
        </h2>
        <p className="text-sm text-muted-foreground mb-8">
          Proceso técnico utilizado para generar las calificaciones y rankings publicados en este sitio.
        </p>

        <ul className="space-y-6 text-sm text-foreground/90 leading-relaxed list-none p-0 m-0">
          <li className="flex gap-3 items-start">
            <Clock className="w-5 h-5 mt-0.5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <div>
              <strong className="block text-foreground mb-0.5">Monitoreo de Uptime</strong>
              Registramos la disponibilidad de cada servidor mediante pings automatizados cada 5 minutos, las 24 horas del día, los 365 días del año. El porcentaje de uptime publicado refleja la media de los últimos 30 días.
            </div>
          </li>

          <li className="flex gap-3 items-start">
            <Globe className="w-5 h-5 mt-0.5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <div>
              <strong className="block text-foreground mb-0.5">Medición de Latencia (Ping)</strong>
              Simulamos conexiones TCP desde un punto de presencia en Santiago de Chile hacia cada proveedor. El valor reportado corresponde a la mediana de latencia (ms) en las últimas 24 horas, excluyendo valores atípicos.
            </div>
          </li>

          <li className="flex gap-3 items-start">
            <FlaskConical className="w-5 h-5 mt-0.5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <div>
              <strong className="block text-foreground mb-0.5">Pruebas de Rendimiento</strong>
              Ejecutamos benchmarks periódicos que miden el tiempo de respuesta del servidor (TTFB), velocidad de entrega de archivos estáticos y rendimiento bajo carga concurrente. Los resultados alimentan la puntuación de velocidad.
            </div>
          </li>

          <li className="flex gap-3 items-start">
            <PhoneCall className="w-5 h-5 mt-0.5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <div>
              <strong className="block text-foreground mb-0.5">Verificación de Soporte Técnico</strong>
              Un evaluador contacta al equipo de soporte de cada proveedor mediante chat, teléfono o ticket. Se evalúa: tiempo de primera respuesta, dominio técnico del agente, disponibilidad del servicio en español y horario de atención declarado versus real.
            </div>
          </li>

          <li className="flex gap-3 items-start">
            <Receipt className="w-5 h-5 mt-0.5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <div>
              <strong className="block text-foreground mb-0.5">Facturación Local</strong>
              Confirmamos si el proveedor emite boleta o factura electrónica válida ante el Servicio de Impuestos Internos (SII) de Chile, y si los precios publicados incluyen IVA. Los proveedores que facturan en pesos chilenos (CLP) reciben la etiqueta correspondiente.
            </div>
          </li>
        </ul>

        <p className="mt-8 text-xs text-muted-foreground border-t border-border pt-4">
          Las evaluaciones se actualizan de forma continua. La última revisión completa de proveedores se realizó en enero de 2026. Para consultas sobre nuestra metodología, escribe a contacto@eligetuhosting.cl.
        </p>
      </div>
    </section>
  );
};

export default MethodologySection;

import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ExternalLink } from 'lucide-react';
import Section from '@/components/system/Section';
import Callout from '@/components/system/Callout';
import { Button } from '@/components/ui/button';

/**
 * Análisis del primer puesto, cierre y enlace a Perú de
 * /mejor-hosting-chile-2026. Contenido intacto; sin emojis, sin rojo fuera del
 * puesto 1 y sin degradados. Las cifras del texto usan coma decimal.
 */

const linkClass = 'font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink';

const CheckList: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="mt-3 space-y-2 text-ink">
    {items.map((item) => (
      <li key={item} className="flex items-start gap-2">
        <Check className="mt-1 h-4 w-4 shrink-0 text-ink-3" aria-hidden />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

export const ChileWinnerAnalysis: React.FC<{ year: number }> = ({ year }) => (
  <Section id="analisis" tone="paper" title={`¿Por qué HostingPlus.cl es el mejor hosting de Chile en ${year}?`}>
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-rule bg-white p-5 md:p-6">
        <h3 className="t-h3 text-ink">Rendimiento superior</h3>
        <CheckList
          items={[
            'LiteSpeed Enterprise (hasta 6x más rápido que Apache)',
            'Discos SSD NVMe de alta velocidad',
            'CDN integrado para mayor velocidad global',
            'Tiempo de carga promedio: 1,2 segundos',
          ]}
        />
      </div>
      <div className="rounded-xl border border-rule bg-white p-5 md:p-6">
        <h3 className="t-h3 text-ink">Transparencia en precios</h3>
        <CheckList
          items={[
            'Precio estable: sin cambios en la renovación',
            'Sin precios trampa ni aumentos sorpresa',
            'Más económico que Hosting.cl en el mismo tipo de plan',
            'Mejor valor real a largo plazo',
          ]}
        />
      </div>
    </div>

    <div className="max-w-[78ch]">
      <Callout title="¿Por qué EcoHosting.cl es segundo lugar?" className="bg-white">
        <p>
          Ofrece la mejor promoción de entrada, pero el precio sube en la renovación. Aún así, mantiene excelente calidad
          y 0 reclamos registrados.{' '}
          <strong className="font-semibold text-ink">Ideal para proyectos nuevos que buscan ahorrar el primer año</strong>.
        </p>
      </Callout>
      <Callout tone="caution" title="Cuidado con precios trampa" className="bg-white">
        <p>
          HostGator promociona un valor bajo de entrada pero{' '}
          <strong className="font-semibold text-ink">lo sube fuertemente en la renovación</strong>. Hosting.cl se mantiene{' '}
          <strong className="font-semibold text-ink">como el más caro del grupo incluso con descuentos</strong>. Revisa
          siempre el valor de renovación en el sitio oficial.
        </p>
      </Callout>
      <Callout title="Dato verificado" className="bg-white">
        <p>
          Según el monitoreo independiente realizado por{' '}
          <a href="https://uptimerobot.com" target="_blank" rel="nofollow" className={linkClass}>
            UptimeRobot
          </a>{' '}
          durante {year - 1}, HostingPlus.cl registró solo 1,7 horas de downtime en todo el año, estableciendo un nuevo
          récord para proveedores chilenos.
        </p>
      </Callout>
    </div>
  </Section>
);

export const ChileClosing: React.FC<{ year: number }> = ({ year }) => (
  <>
    <Section id="contratar" tone="ink" title={`¿Listo para contratar el mejor hosting de Chile en ${year}?`}>
      <p className="max-w-[62ch] text-lg leading-relaxed text-white/75">
        Únete a miles de empresas que confían en HostingPlus.cl para su presencia web.{' '}
        <strong className="font-semibold text-white">Precio estable, sin sorpresas en la renovación.</strong> Garantía de
        devolución de 30 días sin preguntas.
      </p>
      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <Button asChild variant="brand" size="lg">
          <a href="https://www.hostingplus.cl/" target="_blank" rel="nofollow sponsored noopener noreferrer">
            Ir al sitio de HostingPlus
            <ExternalLink aria-hidden />
          </a>
        </Button>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link to="/ranking" className="inline-flex min-h-[44px] items-center font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">
            Ver el ranking
          </Link>
          <Link to="/comparativa" className="inline-flex min-h-[44px] items-center font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">
            Comparar proveedores
          </Link>
        </div>
      </div>
    </Section>

    <Section id="peru" density="tight" aria-label="Ranking de Perú">
      <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-rule bg-paper p-5 sm:flex-row sm:items-center">
        <div>
          <p className="font-semibold text-ink">¿Buscas hosting en Perú?</p>
          <p className="t-small mt-1 text-ink-2">
            Revisa nuestro ranking auditado para el mercado peruano: precios en soles, factura local y LiteSpeed.
          </p>
        </div>
        <Button asChild variant="outline" className="shrink-0">
          <a href="https://eligetuhosting.com/pe/mejor-hosting-peru-2026" rel="noopener">
            Ver el ranking de Perú
          </a>
        </Button>
      </div>
    </Section>
  </>
);

import React from 'react';
import { Link } from 'react-router-dom';
import Section from '@/components/system/Section';
import type { ChileCriterion } from './chileGuideData';

/**
 * Resumen, criterios y fuentes de /mejor-hosting-chile-2026. Mismo contenido
 * que antes, con el sistema: secciones a la izquierda, texto a medida de
 * lectura, íconos en tinta y enlaces subrayados (sin flechas ni emojis).
 */

const linkClass = 'font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink';

export const ChileSummary: React.FC<{ year: number }> = ({ year }) => (
  <Section id="resumen" title="Resumen">
    <div className="prose">
      <p>
        Después de analizar exhaustivamente <strong>más de 15 proveedores de hosting en Chile</strong> durante 2025-{year},
        evaluando criterios como uptime, velocidad de carga, calidad del soporte y <strong>transparencia en precios</strong>,{' '}
        <strong>HostingPlus.cl emerge como el mejor hosting Chile {year}</strong>.
      </p>
      <p>
        Con un impresionante <strong>99,98 % de uptime verificado</strong>, tecnología LiteSpeed Enterprise, servidores
        propios en Santiago y <strong>precios que se mantienen en la renovación</strong>, HostingPlus establece el estándar
        para el hosting rápido SSD en Chile.
      </p>
      <p>
        <strong>EcoHosting.cl ocupa el segundo lugar</strong> con una buena promoción de entrada, aunque el valor sube al
        renovar. Ambos superan ampliamente a proveedores con «precios trampa» como HostGator (que sube fuertemente en la
        renovación) o Hosting.cl (el más caro del grupo). No publicamos cifras: consulta el precio vigente en el sitio de
        cada proveedor.
      </p>
    </div>
  </Section>
);

export const ChileCriteria: React.FC<{ criteria: ChileCriterion[]; guides: { to: string; label: string }[] }> = ({
  criteria,
  guides,
}) => (
  <Section id="criterios" tone="paper" title="Criterios para determinar el mejor hosting en Chile">
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {criteria.map((criterio) => {
        const Icon = criterio.icon;
        return (
          <li key={criterio.title} className="rounded-xl border border-rule bg-white p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-paper">
                <Icon className="h-5 w-5 text-ink-2" aria-hidden />
              </span>
              <h3 className="t-h3 text-ink">{criterio.title}</h3>
            </div>
            <p className="t-small mt-3 text-ink-2">{criterio.description}</p>
          </li>
        );
      })}
    </ul>

    <div className="mt-8 rounded-xl border border-rule bg-white p-5 md:p-6">
      <h3 className="t-h3 text-ink">Profundiza en nuestras guías especializadas</h3>
      <ul className="mt-3 grid gap-x-8 gap-y-2 sm:grid-cols-2">
        {guides.map((guide) => (
          <li key={guide.to}>
            <Link to={guide.to} className={`${linkClass} inline-flex min-h-[44px] items-center`}>
              {guide.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </Section>
);

export const ChileSources: React.FC = () => (
  <Section id="fuentes" tone="paper" density="tight" title="Datos y fuentes" lead="De dónde sale cada dato del estudio.">
    <div className="t-body max-w-[62ch] space-y-4 text-ink-2">
      <p>
        Consulta nuestro dataset público con los factores y pesos usados en el estudio:{' '}
        <a href="/data/estudio-2026.json" className={linkClass} target="_blank" rel="noopener noreferrer">
          estudio-2026.json
        </a>
      </p>
      <ul className="list-disc space-y-1 pl-5 marker:text-ink-3">
        <li>
          Reclamos y reputación:{' '}
          <a href="https://www.reclamos.cl" className={linkClass} target="_blank" rel="noopener noreferrer">
            Reclamos.cl
          </a>
        </li>
        <li>Uptime y disponibilidad: UptimeRobot/Pingdom (paneles públicos cuando aplica)</li>
        <li>Precios y condiciones: páginas oficiales de cada proveedor</li>
      </ul>
      <p className="t-small text-ink-3">
        Divulgación: Algunos enlaces pueden ser afiliados. Esto no altera nuestra metodología ni el ranking.
      </p>
    </div>
  </Section>
);

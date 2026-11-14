import React from 'react';
import { Link } from 'react-router-dom';
import { Download, ExternalLink } from 'lucide-react';
import RankingFormulaBlock from '@/components/RankingFormulaBlock';

interface Props {
  /** «Última revisión» ya resuelta (fecha, cargando o sin dato). */
  lastReviewed: React.ReactNode;
  exportUrl: string;
}

interface Fuente {
  source: string;
  purpose: string;
  link: { label: string; href?: string; to?: string; icon?: 'external' | 'download' };
}

const linkClass = 'inline-flex items-center gap-1 font-medium text-ink underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink';

const FuenteLink: React.FC<{ link: Fuente['link'] }> = ({ link }) => {
  if (link.to) {
    return (
      <Link to={link.to} className={linkClass}>
        {link.label}
      </Link>
    );
  }
  const external = link.icon === 'external';
  return (
    <a
      href={link.href}
      className={linkClass}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {link.label}
      {external && <ExternalLink className="h-3.5 w-3.5" aria-hidden />}
      {link.icon === 'download' && <Download className="h-3.5 w-3.5" aria-hidden />}
      {external && <span className="sr-only">(se abre en otra pestaña)</span>}
    </a>
  );
};

/** Secciones 1 a 4 de /metodologia: resumen, autoría, fuentes y cálculo. */
const MetodologiaSecciones: React.FC<Props> = ({ lastReviewed, exportUrl }) => {
  const fuentes: Fuente[] = [
    { source: 'Reclamos.cl', purpose: 'Reputación / reclamos', link: { label: 'reclamos.cl', href: 'https://www.reclamos.cl', icon: 'external' } },
    { source: 'uptime_pings', purpose: 'Disponibilidad cada hora', link: { label: 'Exportar JSON', href: exportUrl, icon: 'download' } },
    { source: 'benchmark_results', purpose: 'TTFB, Lighthouse y cabeceras HTTP', link: { label: 'Metodología del benchmark', to: '/metodologia-benchmark' } },
    { source: 'Curaduría OSINT', purpose: 'Verificación legal y técnica', link: { label: 'Política de transparencia', to: '/transparencia-hosting-chile' } },
    { source: 'NIC Chile / WHOIS', purpose: 'Antigüedad de dominio', link: { label: 'nic.cl', href: 'https://www.nic.cl', icon: 'external' } },
  ];

  return (
    <>
      <h2 id="resumen" className="scroll-mt-24">1. Resumen ejecutivo</h2>
      <p>
        Evaluamos proveedores de hosting en Chile combinando <strong>mediciones automatizadas</strong> (uptime cada
        hora, benchmarks Lighthouse mensuales), <strong>reputación pública</strong> (Reclamos.cl, reseñas verificadas)
        y <strong>curaduría editorial</strong> (verificación legal, soporte, transparencia). El ranking solo muestra
        empresas marcadas como verificadas y curadas, con un score de 7,0 o más.
      </p>

      <h2 id="autoria" className="scroll-mt-24">2. Autoría y responsabilidad editorial</h2>
      <dl className="not-prose divide-y divide-rule border-y border-rule">
        <div className="grid gap-1 py-3 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-4">
          <dt className="t-label">Editor responsable</dt>
          <dd className="text-ink">Equipo Elige Tu Hosting</dd>
        </div>
        <div className="grid gap-1 py-3 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-4">
          <dt className="t-label">Contacto editorial</dt>
          <dd>
            <Link to="/contacto" className={linkClass}>
              Formulario de contacto
            </Link>
          </dd>
        </div>
        <div className="grid gap-1 py-3 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-4">
          <dt className="t-label">Última revisión</dt>
          <dd className="text-ink">{lastReviewed}</dd>
        </div>
        <div className="grid gap-1 py-3 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-4">
          <dt className="t-label">Independencia</dt>
          <dd className="text-ink-2">
            No aceptamos pagos por posiciones del ranking. Algunos enlaces a proveedores pueden ser de afiliado; esto se
            declara en cada ficha y <strong className="text-ink">nunca</strong> influye en la posición.
          </dd>
        </div>
      </dl>

      <h2 id="fuentes" className="scroll-mt-24">3. Fuentes de datos y evidencias</h2>
      <p>Cada dato del ranking sale de una de estas fuentes, y cada una se puede revisar por fuera.</p>
      <table className="hidden sm:table">
        <thead>
          <tr>
            <th scope="col">Fuente</th>
            <th scope="col">Para qué</th>
            <th scope="col">Verificable en</th>
          </tr>
        </thead>
        <tbody>
          {fuentes.map((f) => (
            <tr key={f.source}>
              <th scope="row" className="font-semibold text-ink">{f.source}</th>
              <td>{f.purpose}</td>
              <td>
                <FuenteLink link={f.link} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="not-prose divide-y divide-rule border-y-2 border-y-ink sm:hidden">
        {fuentes.map((f) => (
          <li key={f.source} className="py-3">
            <p className="font-semibold text-ink">{f.source}</p>
            <p className="t-small mt-0.5 text-ink-2">{f.purpose}</p>
            <p className="t-small mt-1.5">
              <FuenteLink link={f.link} />
            </p>
          </li>
        ))}
      </ul>

      <h3 id="reputacion" className="scroll-mt-24">Criterios de reputación verificada</h3>
      <ul>
        <li>
          <strong>Reseña verificada:</strong> usuario autenticado + email confirmado + marcado{' '}
          <code>is_verified_customer</code> con prueba (factura, captura del panel o dominio activo).
        </li>
        <li>
          <strong>Reclamo interno verificado:</strong> envío con email confirmado vía token de 48 h y aprobación
          editorial (estado <code>verified</code> o <code>resolved</code>).
        </li>
        <li>
          <strong>Reclamo externo:</strong> resultados de Google <code>site:reclamos.cl &quot;proveedor&quot;</code>; las
          URLs exactas se citan en cada ficha.
        </li>
        <li>
          <strong>Score reputacional:</strong> análisis automatizado mensual del texto de Reclamos.cl ponderado con la
          cuenta de reclamos internos verificados (1 = pésimo, 10 = excelente).
        </li>
      </ul>

      <h2 id="calculo" className="scroll-mt-24">4. Cómo se calcula el ranking</h2>
      <RankingFormulaBlock variant="full" />
    </>
  );
};

export default MetodologiaSecciones;

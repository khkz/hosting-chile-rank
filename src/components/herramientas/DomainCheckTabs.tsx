import React from 'react';
import { Check, ExternalLink, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Callout from '@/components/system/Callout';
import type { DomainAnalysisResult } from '@/services/domainAnalysis';
import FactList, { type Fact } from './FactList';
import { hasValidNameservers, isKnown, placeName, probeOf } from './domainFacts';

const linkClass = 'inline-flex items-center gap-1 text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink';
const yesNo = (v: boolean) => (v ? 'Sí' : 'No');

/** Seguridad SSL/TLS: solo afirma algo si la prueba desde el navegador respondió. */
export const DomainSecurityTab: React.FC<{ data: DomainAnalysisResult }> = ({ data }) => {
  const ssl = probeOf(data, 'ssl');
  const sslLabs = `https://www.ssllabs.com/ssltest/analyze.html?d=${encodeURIComponent(data.basic.domain)}`;

  if (!ssl.answered) {
    return (
      <Callout title="No pudimos comprobar el SSL" className="my-0">
        <p>
          El sitio no respondió a la prueba que hacemos desde tu navegador (muchos servidores la bloquean). Eso no significa que no
          tenga SSL: revisa el candado al abrir https://{data.basic.domain} o haz la prueba completa en SSL Labs.
        </p>
        <p>
          <a href={sslLabs} target="_blank" rel="noopener noreferrer" className={linkClass}>
            Probar en SSL Labs
            <ExternalLink aria-hidden className="h-3.5 w-3.5" />
          </a>
        </p>
      </Callout>
    );
  }

  const s = data.ssl;
  const facts: Fact[] = [
    { label: 'SSL habilitado', value: yesNo(s.ssl_enabled), kind: 'measured', date: ssl.checked_at },
    { label: 'Redirección a HTTPS', value: yesNo(s.https_redirect), kind: 'measured', date: ssl.checked_at },
    { label: 'Emisor SSL', value: isKnown(s.ssl_issuer) ? s.ssl_issuer : 'Sin dato' },
    { label: 'Grado SSL', value: isKnown(s.ssl_grade) ? s.ssl_grade : 'Sin dato' },
  ];
  const headers = Object.entries(s.security_headers || {});

  return (
    <div className="space-y-6">
      <FactList facts={facts} />

      {!s.ssl_enabled && hasValidNameservers(data.basic.nameservers) && (
        <Callout tone="caution" title="Tu sitio web no tiene SSL" className="my-0">
          <p>Los navegadores marcan tu sitio como «No seguro». Esto afecta la confianza de tus visitantes y tu posicionamiento en Google.</p>
          <ul className="mt-3 space-y-1.5">
            {['Protege los datos de tus usuarios', 'Mejora el ranking en buscadores', 'Aumenta la confianza del cliente', 'Instalación gratuita incluida'].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-ink-2" />
                {t}
              </li>
            ))}
          </ul>
          <Button asChild variant="default" className="mt-4">
            <a href="https://clientes.hostingplus.cl/cart.php?gid=7" target="_blank" rel="noopener noreferrer">
              <Shield aria-hidden />
              Comprar SSL en HostingPlus
              <ExternalLink aria-hidden />
            </a>
          </Button>
        </Callout>
      )}

      {headers.length > 0 && (
        <div>
          <h3 className="t-label">Encabezados de seguridad</h3>
          <dl className="mt-2 divide-y divide-rule border-y border-rule">
            {headers.map(([header, value]) => (
              <div key={header} className="grid gap-1 py-2 sm:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] sm:gap-6">
                <dt className="t-small font-semibold text-ink">{header}</dt>
                <dd className="t-small break-all text-ink-2">{String(value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {s.ssl_enabled && (
        <p className="t-small text-ink-2">Tu sitio respondió por HTTPS: cuenta con un certificado que cifra las comunicaciones.</p>
      )}
    </div>
  );
};

/** Rendimiento: esta herramienta no lo mide, así que no muestra cifras. */
export const DomainPerformanceTab: React.FC = () => (
  <div className="rounded-xl border border-rule bg-paper p-5">
    <Badge variant="outline">Sin medir</Badge>
    <p className="t-body mt-3 text-ink">Esta herramienta no mide el rendimiento. Usa PageSpeed Insights para medirlo.</p>
    <p className="t-small mt-2">
      <a href="https://pagespeed.web.dev/" target="_blank" rel="noopener noreferrer" className={linkClass}>
        Abrir PageSpeed Insights
        <ExternalLink aria-hidden className="h-3.5 w-3.5" />
      </a>
    </p>
  </div>
);

/** Tecnología detectada al leer el HTML del sitio. */
export const DomainTechTab: React.FC<{ data: DomainAnalysisResult }> = ({ data }) => {
  const site = probeOf(data, 'site');
  const t = data.tech_stack;
  const hosting: Fact[] = [];
  if (isKnown(t.hosting_provider)) hosting.push({ label: 'Proveedor de hosting', value: t.hosting_provider });
  if (isKnown(t.country_location)) hosting.push({ label: 'Ubicación', value: placeName(t.country_location), kind: 'measured', date: probeOf(data, 'ip').checked_at });

  if (!site.answered) {
    return (
      <div className="space-y-6">
        <Callout title="No pudimos leer el sitio" className="my-0">
          <p>
            El sitio no permitió leer su página desde tu navegador, así que no detectamos su servidor, CMS ni herramientas de
            análisis.
          </p>
        </Callout>
        {hosting.length > 0 && <FactList facts={hosting} />}
      </div>
    );
  }

  const facts: Fact[] = [
    { label: 'Servidor web', value: isKnown(t.server_software) ? t.server_software : 'No detectado' },
    { label: 'CMS', value: isKnown(t.cms_detected) ? t.cms_detected : 'No detectado' },
    { label: 'Framework', value: isKnown(t.framework_detected) ? t.framework_detected : 'No detectado' },
    { label: 'CDN', value: isKnown(t.cdn_provider) ? t.cdn_provider : 'No detectado' },
    { label: 'Lenguaje', value: isKnown(t.programming_language) ? t.programming_language : 'No detectado' },
    ...hosting,
  ];
  return (
    <div className="space-y-6">
      <FactList facts={facts} />
      {t.analytics_tools.length > 0 && (
        <div>
          <h3 className="t-label">Herramientas de análisis</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {t.analytics_tools.map((tool) => (
              <Badge key={tool} variant="outline">
                {tool}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

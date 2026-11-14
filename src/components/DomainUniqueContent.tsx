import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Callout from '@/components/system/Callout';
import FactList, { type Fact } from '@/components/herramientas/FactList';
import { asnPath, hasRealOwner, hasValidNameservers, isIsoLike, isKnown, probeOf } from '@/components/herramientas/domainFacts';
import { formatDataDate, formatInteger, formatScore } from '@/lib/format';
import type { DomainAnalysisResult } from '@/services/domainAnalysis';

interface DomainUniqueContentProps {
  domainName: string;
  domainData: DomainAnalysisResult;
}

const linkClass = 'inline-flex items-center gap-1 text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink';

// Tipo de titular según su nombre (sufijo legal, sin importar mayúsculas, o nombre en mayúsculas).
const analyzeOwner = (ownerName: string) => {
  const isCompany = /\b(ltda|limitada|spa|s\.a\.|sociedad|eirl)(\b|$)/i.test(ownerName) || ownerName.toUpperCase() === ownerName;
  return { name: ownerName, isCompany };
};

const DAY = 1000 * 60 * 60 * 24;

// Antigüedad respecto de hoy (cálculo de la persona que mira, no una fecha de datos).
const calculateDomainAge = (createdDate: string) => {
  if (!isIsoLike(createdDate)) return { days: 0, years: 0, isNew: false, isEstablished: false };
  const ageInDays = Math.floor((Date.now() - new Date(createdDate).getTime()) / DAY);
  return { days: ageInDays, years: ageInDays / 365, isNew: ageInDays < 30, isEstablished: ageInDays > 365 };
};

const calculateExpirationDays = (expiresDate: string) => {
  if (!isIsoLike(expiresDate)) return { days: 0, isExpiringSoon: false };
  const days = Math.floor((new Date(expiresDate).getTime() - Date.now()) / DAY);
  return { days, isExpiringSoon: days < 90 };
};

// Descripción del proveedor según sus nameservers.
const analyzeNameservers = (nameservers: string[]) => {
  const ns = nameservers.join(' ').toLowerCase();
  if (ns.includes('cloudflare'))
    return { provider: 'Cloudflare', description: 'Cloudflare es una CDN y servicio de seguridad líder mundial que ofrece protección DDoS, SSL gratuito y optimización de rendimiento.' };
  if (ns.includes('hostgator'))
    return { provider: 'HostGator Chile', description: 'HostGator es un proveedor de hosting con presencia en Chile, ofreciendo planes compartidos y VPS con soporte en español.' };
  if (ns.includes('hostingplus'))
    return { provider: 'HostingPlus', description: 'HostingPlus es el proveedor líder en Chile con servidores locales, SSL gratuito y soporte 24/7 en español.' };
  if (ns.includes('ecohosting'))
    return { provider: 'EcoHosting', description: 'EcoHosting ofrece servicios de hosting ecológico en Chile con enfoque en sostenibilidad y energías renovables.' };
  if (ns.includes('nic.cl'))
    return { provider: 'NIC Chile', description: 'NIC Chile es el registro oficial de dominios .CL, gestionado por la Universidad de Chile.' };
  return { provider: 'Proveedor personalizado', description: '' };
};

const Block: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="border-t border-rule py-10">
    <h2 className="t-h2 text-ink">{title}</h2>
    <div className="mt-5 space-y-4">{children}</div>
  </section>
);

const Bullets: React.FC<{ items: React.ReactNode[] }> = ({ items }) => (
  <ul className="t-small list-disc space-y-1 pl-5 text-ink-2">
    {items.map((it, i) => (
      <li key={i}>{it}</li>
    ))}
  </ul>
);

export const DomainUniqueContent: React.FC<DomainUniqueContentProps> = ({ domainName, domainData }) => {
  const whoisOk = probeOf(domainData, 'whois').answered;
  const dnsOk = probeOf(domainData, 'dns').answered;
  const { whois } = domainData;
  const owner = hasRealOwner(whois.owner_name) ? analyzeOwner(whois.owner_name) : null;
  const age = calculateDomainAge(whois.created_date);
  const expiration = calculateExpirationDays(whois.expires_date);
  const nsConfigured = hasValidNameservers(domainData.dns.ns_records);
  const nsInfo = analyzeNameservers(domainData.dns.ns_records);
  const asnHref = asnPath(domainData.basic.asn);
  const internationalRegistrar = whoisOk && isKnown(whois.registrar) && whois.registrar !== 'NIC Chile';

  const timeFacts: Fact[] = [
    {
      label: 'Fecha de registro',
      value: isIsoLike(whois.created_date) ? formatDataDate(whois.created_date) : 'Sin dato',
    },
    {
      label: 'Antigüedad',
      value: age.days > 0 ? `${formatInteger(age.days)} días (${formatScore(age.years)} años)` : 'Sin dato',
    },
    {
      label: 'Fecha de expiración',
      value: isIsoLike(whois.expires_date) ? formatDataDate(whois.expires_date) : 'Sin dato',
    },
  ];
  if (expiration.days > 0) timeFacts.push({ label: 'Días para expirar', value: formatInteger(expiration.days) });
  if (isKnown(whois.registrar)) timeFacts.push({ label: 'Registrador', value: whois.registrar });

  const recommendations: { title: string; body: React.ReactNode }[] = [];
  if (age.isNew)
    recommendations.push({
      title: 'Dominio nuevo: considera estas prioridades',
      body: (
        <>
          <Bullets
            items={[
              'Configura SSL desde el primer día (mejora SEO y confianza)',
              'Elige hosting con buena velocidad para crear buena primera impresión',
              'Implementa redirects 301 correctamente si migras contenido',
            ]}
          />
          <Link to="/guia-elegir-hosting" className={`${linkClass} t-small mt-2`}>
            Ver guía completa
            <ArrowRight aria-hidden className="h-3.5 w-3.5" />
          </Link>
        </>
      ),
    });
  if (dnsOk && !nsConfigured)
    recommendations.push({
      title: 'Sin configuración: pasos a seguir',
      body: (
        <ol className="t-small list-decimal space-y-1 pl-5 text-ink-2">
          <li>
            <strong className="text-ink">Contrata hosting:</strong> recomendamos proveedores chilenos para mejor rendimiento local.{' '}
            <Link to="/ranking" className={linkClass}>
              Ver el ranking
            </Link>
          </li>
          <li>
            <strong className="text-ink">Configura nameservers:</strong> tu proveedor te dará 2 nameservers para configurar en NIC Chile.
          </li>
          <li>
            <strong className="text-ink">Espera la propagación:</strong> los cambios DNS toman 24-48 horas.
          </li>
        </ol>
      ),
    });
  if (internationalRegistrar)
    recommendations.push({
      title: 'Registrador internacional',
      body: (
        <>
          <p className="t-small text-ink-2">
            Tu dominio .CL está registrado a través de <strong className="text-ink">{whois.registrar}</strong>, un registrador
            internacional. Esto es totalmente válido, pero considera:
          </p>
          <Bullets
            items={[
              'Soporte técnico puede estar en otro idioma u horario',
              'Pagos en moneda extranjera (posibles comisiones)',
              'Transferir a NIC Chile es posible si prefieres gestión local',
            ]}
          />
        </>
      ),
    });

  return (
    <div className="mt-12">
      {whoisOk && (
        <Block title={`Información del propietario de ${domainName}`}>
          {owner ? (
            <>
              <p className="t-body measure text-ink-2">
                Este dominio está registrado a nombre de <strong className="text-ink">{owner.name}</strong>
                {owner.isCompany
                  ? ', una entidad empresarial chilena. Los dominios registrados por empresas suelen indicar proyectos comerciales profesionales, lo que puede reflejar mayor seriedad y permanencia en el tiempo.'
                  : ', una persona natural. Los dominios registrados por individuos pueden ser proyectos personales, emprendimientos o portafolios profesionales.'}
              </p>
              {owner.isCompany && (
                <div className="measure">
                  <h3 className="t-h3 text-ink">Características de dominios empresariales</h3>
                  <div className="mt-2">
                    <Bullets
                      items={[
                        'Mayor probabilidad de contar con hosting profesional',
                        'Usualmente incluyen SSL y medidas de seguridad',
                        'Proyectos de largo plazo con soporte técnico',
                        'Recomendable verificar en SII para confirmar actividad comercial',
                      ]}
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="t-body measure text-ink-2">
              El WHOIS público de NIC Chile no muestra el nombre del titular de este dominio, así que no sabemos si es una empresa o
              una persona.
            </p>
          )}
        </Block>
      )}

      {whoisOk && (
        <Block title={`Antigüedad y ciclo de vida de ${domainName}`}>
          <FactList facts={timeFacts} />
          <p className="t-body measure text-ink-2">
            {age.isNew
              ? 'Este es un dominio recién registrado (menos de 30 días). Los dominios nuevos suelen estar en fase de configuración o desarrollo. Es normal que aún no tengan contenido publicado o que estén configurando su infraestructura de hosting.'
              : age.isEstablished
                ? 'Este dominio tiene más de un año de antigüedad, lo que indica un proyecto establecido. Los dominios con mayor antigüedad suelen tener mejor posicionamiento en buscadores y mayor confianza por parte de los usuarios.'
                : age.days > 0
                  ? `Este dominio tiene ${formatInteger(age.days)} días de antigüedad. Está en fase intermedia donde probablemente ya cuenta con contenido activo y configuración completa.`
                  : 'No se pudo determinar la antigüedad del dominio.'}
          </p>
          {expiration.isExpiringSoon && expiration.days > 0 && (
            <Callout tone="caution" title="Este dominio expira en menos de 90 días" className="my-0 measure">
              <p>Si eres el propietario, recuerda renovarlo antes de la fecha de expiración para evitar perder el dominio.</p>
            </Callout>
          )}
        </Block>
      )}

      {dnsOk && (
        <Block title={`Configuración de nameservers de ${domainName}`}>
          {nsConfigured ? (
            <>
              <p className="t-body measure text-ink-2">
                Dominio configurado con nameservers activos. Proveedor detectado: <strong className="text-ink">{nsInfo.provider}</strong>.
              </p>
              <ul className="measure divide-y divide-rule border-y border-rule">
                {domainData.dns.ns_records.map((ns) => (
                  <li key={ns} className="t-small break-all py-2 text-ink">
                    {ns}
                  </li>
                ))}
              </ul>
              {nsInfo.description && (
                <div className="measure">
                  <h3 className="t-h3 text-ink">Sobre {nsInfo.provider}</h3>
                  <p className="t-small mt-1 text-ink-2">{nsInfo.description}</p>
                </div>
              )}
            </>
          ) : (
            <Callout tone="caution" title="Dominio sin nameservers configurados" className="my-0 measure">
              <p>
                Este dominio está registrado pero aún no tiene nameservers asignados. Esto significa que no está apuntando a ningún
                servidor de hosting y no puede mostrar un sitio web todavía.
              </p>
              <p className="font-semibold text-ink">Para activar este dominio necesitas:</p>
              <ol className="list-decimal space-y-1 pl-5">
                <li>Contratar un plan de hosting en Chile</li>
                <li>Configurar los nameservers proporcionados por tu hosting</li>
                <li>Esperar 24-48 horas para propagación DNS</li>
              </ol>
              <p>
                <Link to="/ranking" className={linkClass}>
                  Ver el ranking de hosting en Chile
                  <ArrowRight aria-hidden className="h-3.5 w-3.5" />
                </Link>
              </p>
            </Callout>
          )}
        </Block>
      )}

      {recommendations.length > 0 && (
        <Block title={`Recomendaciones específicas para ${domainName}`}>
          <div className="grid gap-4 md:grid-cols-2">
            {recommendations.map((r) => (
              <article key={r.title} className="rounded-xl border border-rule bg-white p-5">
                <h3 className="t-h3 text-ink">{r.title}</h3>
                <div className="mt-2 space-y-2">{r.body}</div>
              </article>
            ))}
          </div>
        </Block>
      )}

      <Block title="Recursos útiles">
        <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
          <li>
            <Link to="/ranking" className={linkClass}>Ranking de hosting en Chile</Link>
          </li>
          <li>
            <Link to="/wiki" className={linkClass}>Wiki de términos de hosting</Link>
          </li>
          {asnHref && (
            <li>
              <Link to={asnHref} className={linkClass}>Ver información del {domainData.basic.asn.split(' ')[0]}</Link>
            </li>
          )}
          <li>
            <Link to="/guia-elegir-hosting" className={linkClass}>Guía para elegir hosting</Link>
          </li>
        </ul>
      </Block>
    </div>
  );
};

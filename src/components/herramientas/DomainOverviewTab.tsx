import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ExternalLink, Server } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Callout from '@/components/system/Callout';
import { hasValidIP } from '@/lib/utils';
import { getComplaintBadge } from '@/services/hostingComplaints';
import type { DomainAnalysisResult } from '@/services/domainAnalysis';
import FactList, { type Fact } from './FactList';
import { countryName } from './dataTime';
import { asnPath, hasValidNameservers, isKnown, placeName, probeOf } from './domainFacts';

const NO_DNS = 'Sin dato: la consulta de DNS no respondió';

const DomainOverviewTab: React.FC<{ data: DomainAnalysisResult }> = ({ data }) => {
  const { basic } = data;
  const dns = probeOf(data, 'dns');
  const ipProbe = probeOf(data, 'ip');
  const country = basic.hosting_country;
  const validNs = hasValidNameservers(basic.nameservers);
  const asnHref = asnPath(basic.asn);
  const complaint = basic.complaintInfo;
  const complaintText = complaint ? getComplaintBadge(complaint.level).text : null;

  const facts: Fact[] = [
    { label: 'Dominio', value: basic.domain },
    {
      label: 'IP principal',
      value: hasValidIP(basic.ip) ? basic.ip : dns.answered ? 'Sin registro A' : NO_DNS,
      kind: hasValidIP(basic.ip) ? 'measured' : undefined,
      date: hasValidIP(basic.ip) ? dns.checked_at : null,
    },
    {
      label: 'País de la IP',
      value: country && country.status !== 'unknown' ? countryName(country.country_code) : 'Sin determinar',
      kind: country && country.status !== 'unknown' ? 'measured' : undefined,
      date: country && country.status !== 'unknown' ? country.checked_at : null,
    },
    {
      label: 'ASN',
      value: asnHref ? (
        <Link to={asnHref} className="text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
          {basic.asn}
        </Link>
      ) : (
        'Sin dato'
      ),
      kind: asnHref ? 'measured' : undefined,
      date: asnHref ? ipProbe.checked_at : null,
    },
    {
      label: 'Proveedor',
      value: (
        <div className="flex flex-wrap items-center gap-2">
          {isKnown(basic.provider) ? basic.provider : 'No identificado'}
          {complaintText && <Badge variant="outline">{complaintText}</Badge>}
        </div>
      ),
    },
  ];
  if (isKnown(basic.location)) facts.push({ label: 'Ubicación de la IP', value: placeName(basic.location), kind: 'measured', date: ipProbe.checked_at });
  if (isKnown(basic.isp) && basic.isp !== basic.provider) facts.push({ label: 'ISP', value: basic.isp });
  facts.push({
    label: 'Nameservers',
    value: !dns.answered ? NO_DNS : validNs ? (
      <ul className="space-y-0.5 font-normal">
        {basic.nameservers.map((ns) => (
          <li key={ns}>{ns}</li>
        ))}
      </ul>
    ) : (
      'Sin nameservers configurados'
    ),
    kind: dns.answered ? 'measured' : undefined,
    date: dns.answered ? dns.checked_at : null,
  });

  return (
    <div className="space-y-6">
      <FactList facts={facts} />

      {dns.answered && !validNs && (
        <Callout tone="caution" title="Tu dominio necesita hosting para funcionar" className="my-0">
          <p>Sin nameservers configurados, tu dominio no puede mostrar contenido web ni recibir emails corporativos.</p>
          <ul className="mt-3 space-y-1.5">
            {['Sitio web funcionando 24/7', `Emails corporativos @${basic.domain}`, 'Configuración completa incluida', 'Servidores en Chile para mejor velocidad'].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-ink-2" />
                {t}
              </li>
            ))}
          </ul>
          <Button asChild variant="default" className="mt-4">
            <a href="https://www.hostingplus.cl/hosting/" target="_blank" rel="noopener noreferrer">
              <Server aria-hidden />
              Contratar hosting en HostingPlus
              <ExternalLink aria-hidden />
            </a>
          </Button>
        </Callout>
      )}

      {complaint && (
        <Callout
          tone={complaint.level === 'critical' || complaint.level === 'high' ? 'caution' : 'note'}
          title={complaint.level === 'none' ? 'Proveedor confiable' : 'Reclamos del proveedor de hosting'}
          className="my-0"
        >
          <p>
            <strong className="text-ink">
              {complaint.count} reclamo{complaint.count !== 1 ? 's' : ''}
            </strong>
            {complaint.count > 0 && complaint.lastComplaint && <span> (último: {complaint.lastComplaint})</span>}
          </p>
          {complaint.description && <p>{complaint.description}</p>}
          {complaint.recommendation && <p className="font-semibold text-ink">{complaint.recommendation}</p>}
          {complaint.reclamosUrl && (
            <p>
              <a
                href={complaint.reclamosUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
              >
                Ver reclamos en reclamos.cl
                <ExternalLink aria-hidden className="h-3.5 w-3.5" />
              </a>
            </p>
          )}
        </Callout>
      )}
    </div>
  );
};

export default DomainOverviewTab;

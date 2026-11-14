import React from 'react';
import Callout from '@/components/system/Callout';
import { ProvenanceTag } from '@/components/data/Provenance';
import { hasValidIP } from '@/lib/utils';
import type { DomainAnalysisResult } from '@/services/domainAnalysis';
import { countryName, formatToolDateTime, isoDateTime } from './dataTime';
import { isKnown, probeOf } from './domainFacts';

/**
 * Nota única sobre el país del alojamiento. Solo afirma un país cuando la
 * consulta de la IP respondió; si no, lo dice sin adivinar.
 */
const HostingCountryNote: React.FC<{ data: DomainAnalysisResult }> = ({ data }) => {
  const { ip, asn } = data.basic;
  const country = data.basic.hosting_country;
  const dns = probeOf(data, 'dns');

  if (!hasValidIP(ip)) {
    return (
      <Callout title="Sin IP para revisar" className="my-0">
        <p>
          {dns.answered
            ? 'El DNS no devolvió una dirección IP (registro A) para este dominio, así que no sabemos dónde está alojado.'
            : 'La consulta de DNS no respondió, así que no tenemos la IP del sitio ni dónde está alojado. Prueba con «Actualizar análisis» en unos minutos.'}
        </p>
      </Callout>
    );
  }

  if (!country || country.status === 'unknown') {
    return (
      <Callout title="No pudimos determinar el país de esta IP" className="my-0">
        <p>
          La consulta del ASN de la IP {ip} no respondió. Sin esa respuesta no afirmamos si el sitio está
          en Chile o fuera. Prueba con «Actualizar análisis» en unos minutos.
        </p>
      </Callout>
    );
  }

  const inChile = country.status === 'chile';
  return (
    <Callout tone={inChile ? 'note' : 'caution'} title={inChile ? 'Alojamiento en Chile' : 'Alojamiento fuera de Chile'} className="my-0">
      <p>
        La IP {ip} está en {countryName(country.country_code)}
        {isKnown(asn) ? `, red ${asn}` : ''}, según su consulta en ipinfo.io.
        {!inChile &&
          ' Un servidor fuera de Chile puede responder más lento a visitas desde Chile y quedar sujeto a leyes de privacidad de otro país.'}
      </p>
      <p className="t-meta flex flex-wrap items-center gap-2">
        <ProvenanceTag kind="measured" />
        {country.checked_at && (
          <span>
            Consultado el <time dateTime={isoDateTime(country.checked_at)}>{formatToolDateTime(country.checked_at)}</time>
          </span>
        )}
      </p>
    </Callout>
  );
};

export default HostingCountryNote;

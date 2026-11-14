import type { CountryCode, CountryInfo } from '@/lib/country';
import type { Tables } from '@/integrations/supabase/types';
import { formatCorporateGroup } from '@/lib/formatGroup';

const COUNTRY_FULLNAME: Record<CountryCode, string> = { PE: 'Perú', MX: 'México', CO: 'Colombia', AR: 'Argentina', CL: 'Chile' };

/**
 * Títulos, descripción, JSON-LD y FAQ de la ficha de proveedor por país.
 * Movido sin cambios desde CountryProviderDetail para dejar la página bajo
 * 400 líneas: lo que se publica en SEO no cambia.
 */
export function buildCountryFichaSeo(company: Tables<'hosting_companies'>, info: CountryInfo, code: CountryCode, idFiscal: string | null, isGlobal: boolean) {
  const canonical = `https://eligetuhosting.com/${info.slug}/${company.slug}`;
  const title = `${company.name} — Hosting en ${info.name} | EligeTuHosting`;
  const descParts = [
    company.name,
    company.legal_name ? `(${company.legal_name})` : null,
    `— hosting en ${info.name}.`,
    company.datacenter_location ? `Datacenter: ${company.datacenter_location}.` : null,
    company.year_founded ? `Opera desde ${company.year_founded}.` : null,
    idFiscal ? `ID fiscal: ${idFiscal}.` : null,
  ].filter(Boolean).join(' ').slice(0, 158);

  const orgLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.name,
    url: canonical,
  };
  if (company.contact_phone) orgLd.telephone = company.contact_phone;
  if (company.contact_email) orgLd.email = company.contact_email;
  if (company.contact_address) {
    orgLd.address = {
      '@type': 'PostalAddress',
      streetAddress: company.contact_address,
      addressCountry: info.code,
    };
  }
  if (company.year_founded) orgLd.foundingDate = String(company.year_founded);
  if (company.corporate_group) {
    const g = String(company.corporate_group).trim();
    orgLd.parentOrganization = { '@type': 'Organization', name: /^grupo\s/i.test(g) ? g : `Grupo ${g}` };
  }
  if (company.legal_name) orgLd.legalName = company.legal_name;
  if (idFiscal) orgLd.taxID = idFiscal;

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://eligetuhosting.com/' },
      { '@type': 'ListItem', position: 2, name: `Hosting en ${info.name}`, item: `https://eligetuhosting.com/${info.slug}` },
      { '@type': 'ListItem', position: 3, name: company.name, item: canonical },
    ],
  };

  const rawUpdated = company.updated_at || company.created_at || null;
  const dateModified = rawUpdated ? new Date(rawUpdated).toISOString() : new Date().toISOString();
  orgLd.dateModified = dateModified;
  (breadcrumbLd as Record<string, unknown>).dateModified = dateModified;

  const techs: string[] = Array.isArray(company.technologies)
    ? company.technologies.filter((t: unknown) => typeof t === 'string') : [];

  const ogLocale = info.locale.replace('-', '_');
  const countryName = COUNTRY_FULLNAME[code!];
  const editorialSummary: string | null = company.editorial_summary || null;

  // FAQ dinámico desde datos verificables
  const hasLocalDc = company.datacenter_location && (
    (code === 'PE' && /per[uú]/i.test(company.datacenter_location)) ||
    (code === 'MX' && /m[eé]xico/i.test(company.datacenter_location)) ||
    (code === 'CO' && /colombia/i.test(company.datacenter_location)) ||
    (code === 'AR' && /argentina/i.test(company.datacenter_location))
  );
  const faq: Array<{ q: string; a: string }> = [
    {
      q: `¿${company.name} tiene datacenter en ${countryName}?`,
      a: hasLocalDc
        ? `Sí, declara datacenter en ${countryName} (${company.datacenter_location}), lo que reduce latencia para audiencias locales.`
        : company.datacenter_location
          ? `No. Su datacenter declarado está en ${company.datacenter_location}, es decir opera como revendedor internacional para clientes locales.`
          : `${company.name} no publica ubicación de datacenter en su sitio oficial. La latencia y jurisdicción de los datos deben verificarse antes de contratar.`,
    },
    {
      q: `¿Cuál es la razón social e ID fiscal de ${company.name}?`,
      a: [
        company.legal_name ? `Razón social registrada: ${company.legal_name}.` : `${company.name} no publica razón social en su sitio oficial.`,
        idFiscal ? `Identificador fiscal declarado: ${idFiscal}.` : null,
      ].filter(Boolean).join(' '),
    },
    {
      q: `¿Qué tecnologías declara ${company.name}?`,
      a: techs.length > 0
        ? `Tecnologías declaradas por el proveedor: ${techs.join(', ')}.`
        : `${company.name} no publica un stack técnico detallado en su sitio oficial.`,
    },
    {
      q: `¿${company.name} es una marca global o regional?`,
      a: isGlobal
        ? `Es una marca global con presencia comercial en ${countryName}.`
        : company.corporate_group
          ? `Forma parte del grupo ${formatCorporateGroup(company.corporate_group)}, con operación regional.`
          : `Opera principalmente en ${countryName} según los datos declarados.`,
    },
  ];

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    dateModified,
    mainEntity: faq.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return { canonical, title, descParts, orgLd, breadcrumbLd, rawUpdated, dateModified, techs, ogLocale, countryName, editorialSummary, faq, faqLd };
}

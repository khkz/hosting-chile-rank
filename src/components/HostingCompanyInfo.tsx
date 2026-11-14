import React from 'react';
import { Check, X } from 'lucide-react';
import Section from '@/components/system/Section';
import LogoTile from '@/components/LogoTile';
import SiteLink from '@/components/ficha/SiteLink';

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  hours: string;
}

interface PlanFeature {
  name: string;
  included: boolean;
}

interface PricingPeriod {
  monthly: number;
  sixMonths?: number;
  annual: number;
  biannual?: number;
  triannual: number;
  includesDomainFrom?: 'annual' | 'biannual' | 'triannual';
}

interface Plan {
  name: string;
  price: number;
  pricing?: PricingPeriod;
  storage: string;
  bandwidth: string;
  domains: number | string;
  features: PlanFeature[];
}

export interface HostingCompanyData {
  id: string;
  name: string;
  logo: string;
  description: string;
  descriptionEditorial?: string;
  rating: number;
  yearFounded?: number | null;
  datacenterLocation: string;
  website: string;
  contactInfo: ContactInfo;
  plans: Plan[];
  technologies?: string[];
  uptimeGuarantee?: string;
  hasSslFree?: boolean;
  hasMigrationFree?: boolean;
  paymentMethods?: string[];
  pros?: string[];
  cons?: string[];
  uniqueSellingPoint?: string;
  corporateGroup?: string;
  lastScrapedAt?: string;
}

interface HostingCompanyInfoProps {
  company: HostingCompanyData;
  tone?: 'white' | 'paper';
}

/**
 * «Sobre {marca}»: descripción, contacto, medios de pago y planes.
 * La nota, el datacenter y los pros y contras viven en la cabecera, la tabla de
 * datos declarados y el veredicto: aquí no se repiten. Sin contenido, no se dibuja.
 */
const HostingCompanyInfo: React.FC<HostingCompanyInfoProps> = ({ company, tone = 'white' }) => {
  // El texto editorial va en el veredicto; aquí, la descripción general (si es otra).
  const description =
    company.description && company.description.trim() !== (company.descriptionEditorial ?? '').trim()
      ? company.description.trim()
      : '';
  const contact = company.contactInfo;
  const contactItems: Array<[string, React.ReactNode]> = [];
  if (contact.phone)
    contactItems.push(['Teléfono', <a href={`tel:${contact.phone}`} className="underline decoration-ink/30 underline-offset-4 hover:decoration-ink">{contact.phone}</a>]);
  if (contact.email)
    contactItems.push(['Correo', <a href={`mailto:${contact.email}`} className="break-all underline decoration-ink/30 underline-offset-4 hover:decoration-ink">{contact.email}</a>]);
  if (contact.address) contactItems.push(['Dirección', contact.address]);
  if (contact.hours) contactItems.push(['Horario de atención', contact.hours]);
  if (company.paymentMethods && company.paymentMethods.length > 0)
    contactItems.push(['Medios de pago', company.paymentMethods.join(', ')]);

  const hasAbout = !!description || !!company.uniqueSellingPoint || !!company.logo;
  if (!hasAbout && contactItems.length === 0 && company.plans.length === 0) return null;

  return (
    <Section id="sobre" tone={tone} density="tight" title={`Sobre ${company.name}`}>
      {(hasAbout || contactItems.length > 0) && (
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-14">
          <div className="min-w-0">
            {company.logo && (
              <LogoTile name={company.name} logoUrl={company.logo} className="mb-5 h-16 w-40 justify-start border border-rule px-3" maxLogoHeight={40} />
            )}
            {description && <p className="t-body max-w-[62ch] whitespace-pre-line text-ink">{description}</p>}
            {company.uniqueSellingPoint && (
              <p className="t-body mt-4 max-w-[62ch] font-semibold text-ink">{company.uniqueSellingPoint}</p>
            )}
          </div>
          {contactItems.length > 0 && (
            <div className="min-w-0">
              <h3 className="t-h3 text-ink">Contacto</h3>
              <dl className="mt-3 divide-y divide-rule border-y border-rule t-small">
                {contactItems.map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)] gap-4 py-2.5">
                    <dt className="text-ink-2">{label}</dt>
                    <dd className="text-ink [overflow-wrap:anywhere]">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      )}

      {company.plans.length > 0 && (
        <div className={hasAbout || contactItems.length > 0 ? 'mt-12' : undefined}>
          <h3 className="t-h3 text-ink">Planes de hosting</h3>
          <ul className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {company.plans.map((plan) => (
              <li key={plan.name} className="flex flex-col rounded-xl border border-rule bg-white p-5">
                <h4 className="font-semibold text-ink">{plan.name}</h4>
                <p className="mt-1 t-small text-ink-2">Precio: consultar en el sitio oficial</p>
                <dl className="mt-4 space-y-2 t-small">
                  {([
                    ['Almacenamiento', plan.storage],
                    ['Transferencia', plan.bandwidth],
                    ['Dominios', plan.domains],
                  ] as Array<[string, React.ReactNode]>).map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4">
                      <dt className="text-ink-2">{label}</dt>
                      <dd className="text-right tabular text-ink">{value}</dd>
                    </div>
                  ))}
                </dl>
                {plan.features?.length > 0 && (
                  <ul className="mt-4 space-y-1.5 border-t border-rule pt-4 t-small">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-ink">
                        {feature.included ? (
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-ink-2" aria-hidden />
                        ) : (
                          <X className="mt-0.5 h-4 w-4 shrink-0 text-ink-3" aria-hidden />
                        )}
                        <span className={feature.included ? undefined : 'text-ink-3'}>
                          {feature.name}
                          <span className="sr-only">{feature.included ? ' (incluido)' : ' (no incluido)'}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-auto pt-5">
                  <SiteLink
                    slug={company.id}
                    website={company.website}
                    name={company.name}
                    location="ficha_plan"
                    variant="outline"
                    className="w-full"
                  />
                  <p className="mt-2 t-meta">
                    <span className="block">Enlace de afiliado</span>
                    <span className="block">Sin costo extra para ti</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  );
};

export default HostingCompanyInfo;

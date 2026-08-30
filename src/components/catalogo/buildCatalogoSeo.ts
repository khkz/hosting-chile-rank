import { buildBrandFAQ } from '@/components/catalogo/BrandFAQ';

const SITE = 'https://eligetuhosting.cl';

interface Params {
  company: any;
  slug: string | undefined;
  minPrice: number;
  userReviews: { count: number; avg: number } | null | undefined;
}

/**
 * Construye títulos, meta y JSON-LD de la ficha de proveedor.
 * Extraído de CatalogoDetalle para mantener el archivo bajo 400 líneas.
 */
export const buildCatalogoSeo = ({ company, slug, minPrice, userReviews }: Params) => {
  if (!company) return null;
  const name: string = company.name;
  const rating: number = company.overall_rating || 0;
  const dc: string = company.datacenter_location || '';
  const year: number | null = company.year_founded || null;
  const group: string | null = company.corporate_group || null;
  const priceTxt = 'planes a consultar';
  const dcShort = dc ? `, datacenter ${dc.split(',')[0]}` : '';
  const yrShort = year ? `, opera desde ${year}` : '';
  const grpShort = group ? `, ${group}` : '';

  const title = `${name}: Opiniones, Precios y Review 2026 ⭐ ${rating.toFixed(1)}/10 | EligeTuHosting.cl`;
  const description = `Review independiente de ${name} para Chile 2026: nota ${rating.toFixed(1)}/10, ${priceTxt}${dcShort}${yrShort}${grpShort}. Opiniones reales, pros, contras y datos verificados.`.slice(0, 158);

  const canonical = `${SITE}/catalogo/${slug}`;
  const ogImage = company.logo_url ? (company.logo_url.startsWith('http') ? company.logo_url : `${SITE}${company.logo_url}`) : `${SITE}/images/ranking-comparison.png`;

  // --- JSON-LD ---
  const productSchema: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Hosting ${name}`,
    description: (company as any).description_editorial || company.description || `Servicios de hosting de ${name} en Chile.`,
    brand: { '@type': 'Brand', name },
    url: canonical,
    datePublished: (company as any).created_at || '2026-01-01',
    dateModified: (company as any).updated_at || new Date().toISOString(),
  };
      if (company.logo_url) productSchema.image = ogImage;

  // Organization / LocalBusiness schema para TODAS las fichas — refuerza brand SEO
  // y permite a buscadores y LLMs vincular nombre + sitio + contacto + dirección.
  const hasLocalSignals = !!(company.contact_address || company.contact_phone || dc);
  const orgSchema: any = {
    '@context': 'https://schema.org',
    '@type': hasLocalSignals ? 'LocalBusiness' : 'Organization',
    name,
    url: canonical,
    areaServed: { '@type': 'Country', name: 'Chile' },
  };
  if (company.logo_url) orgSchema.logo = ogImage;
      if (company.contact_phone) orgSchema.telephone = company.contact_phone;
  if (company.contact_email) orgSchema.email = company.contact_email;
  if (company.contact_address) {
    orgSchema.address = {
      '@type': 'PostalAddress',
      streetAddress: company.contact_address,
      addressCountry: 'CL',
    };
  }
  if (year) orgSchema.foundingDate = String(year);
  if (group) {
    const g = String(group).trim();
    orgSchema.parentOrganization = {
      '@type': 'Organization',
      name: /^grupo\s/i.test(g) ? g : `Grupo ${g}`,
    };
  }


  // AggregateRating: combina nota editorial + reseñas aprobadas si existen
  const userCount = userReviews?.count || 0;
  const userAvg = userReviews?.avg || 0;
  const totalCount = 1 + userCount; // 1 = review editorial
  const weightedAvg = ((rating / 2) + (userAvg * userCount)) / totalCount; // rating /10 → /5 para AggregateRating estándar
  productSchema.aggregateRating = {
    '@type': 'AggregateRating',
    ratingValue: Number(weightedAvg.toFixed(2)),
    bestRating: 5,
    worstRating: 1,
    ratingCount: totalCount,
    reviewCount: totalCount,
  };

  const editorialReview = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: { '@type': 'Product', name: `Hosting ${name}` },
    author: { '@type': 'Organization', name: 'EligeTuHosting.cl' },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: Number((rating / 2).toFixed(2)),
      bestRating: 5,
      worstRating: 1,
    },
    reviewBody: (company as any).description_editorial || company.description || `Review editorial de ${name}.`,
    datePublished: (company as any).updated_at || new Date().toISOString().split('T')[0],
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Catálogo', item: `${SITE}/catalogo` },
      { '@type': 'ListItem', position: 3, name, item: canonical },
    ],
  };

  const faqItems = buildBrandFAQ({
    name,
    rating,
    minPrice: minPrice > 0 ? minPrice : null,
    datacenter: dc,
    yearFounded: year,
    corporateGroup: group,
    uptimeGuarantee: (company as any).uptime_guarantee || null,
  });

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return { title, description, canonical, ogImage, productSchema, orgSchema, editorialReview, breadcrumb, faqSchema, faqItems, name, rating };
};


/**
 * Service to connect ASN data with hosting company information
 */

export interface HostingASNMapping {
  asnNumber: string;
  hostingCompany: string;
  companyLogo?: string;
  companyRating?: number;
  companyUrl?: string;
  companySlug?: string;
}

// Known ASN mappings for Chilean hosting companies
const knownHostingASNs: HostingASNMapping[] = [
  {
    asnNumber: 'AS265839',
    hostingCompany: 'Grupo Hosting',
    companyLogo: '/logo-hostingcl.svg',
    companyRating: 4.2,
    companyUrl: 'https://www.hosting.cl',
    companySlug: 'hostingcl'
  },
  {
    asnNumber: 'AS52368',
    hostingCompany: 'BlueHosting.cl',
    companyLogo: '/logo-bluehosting.svg',
    companyRating: 4.0,
    companyUrl: 'https://www.bluehosting.cl',
    companySlug: 'bluehosting'
  },
  {
    asnNumber: 'AS266879',
    hostingCompany: 'HostingPlus',
    companyLogo: '/logo-hostingplus.svg',
    companyRating: 4.1,
    companyUrl: 'https://www.hostingplus.cl',
    companySlug: 'hostingplus'
  },
  {
    asnNumber: 'AS263702',
    hostingCompany: 'Grupo ZGH SPA',
    companyRating: 2.8
  },
  {
    asnNumber: 'AS270205',
    hostingCompany: 'EcoHosting',
    companyLogo: '/logo-ecohosting.svg',
    companyRating: 3.8,
    companyUrl: 'https://www.ecohosting.cl',
    companySlug: 'ecohosting'
  },
  {
    asnNumber: 'AS270206',
    hostingCompany: 'PlusChile',
    companyRating: 3.5,
    companyUrl: 'https://www.pluschile.cl'
  },
  {
    asnNumber: 'AS52512',
    hostingCompany: 'OPENCLOUD SpA',
    companyRating: 3.7,
    companyUrl: 'https://www.opencloud.cl'
  }
];

/**
 * Get hosting company information from ASN
 */
export const getHostingCompanyFromASN = (asn: string): HostingASNMapping | null => {
  const normalizedASN = asn.toUpperCase().replace(/^AS/, 'AS');
  return knownHostingASNs.find(mapping => mapping.asnNumber === normalizedASN) || null;
};

/**
 * Check if an ASN belongs to a hosting company
 */
export const isHostingASN = (asn: string): boolean => {
  return getHostingCompanyFromASN(asn) !== null;
};

/**
 * Get all known hosting ASNs
 */
export const getAllHostingASNs = (): HostingASNMapping[] => {
  return [...knownHostingASNs];
};

/**
 * Get ASN classification based on name and description
 */
export const classifyASN = (asnName: string, asnDescription?: string): 'telecom' | 'hosting' | 'isp' | 'enterprise' | 'academic' | 'government' | 'unknown' => {
  const text = `${asnName} ${asnDescription || ''}`.toLowerCase();
  
  // Telecom companies
  if (/claro|entel|movistar|vtr|wom|virgin|simple|telefonica|america movil/i.test(text)) {
    return 'telecom';
  }
  
  // Hosting companies
  if (/hosting|host|server|datacenter|data center|cloud|vps|dedicated/i.test(text)) {
    return 'hosting';
  }
  
  // ISPs
  if (/internet|isp|provider|gtd|mundo|tie|netline|broadband/i.test(text)) {
    return 'isp';
  }
  
  // Academic institutions
  if (/universidad|university|educacion|academic|research|uchile|puc|usach/i.test(text)) {
    return 'academic';
  }
  
  // Government
  if (/gobierno|government|ministerio|ministry|municipal|region/i.test(text)) {
    return 'government';
  }
  
  // Enterprise
  if (/bank|banco|retail|empresa|corporation|corp|ltd|spa|sa\b/i.test(text)) {
    return 'enterprise';
  }
  
  return 'unknown';
};


// Utilities for domain analysis and data enrichment

import { isChileanIP } from './ipDetection';

interface TechnologyDetection {
  name: string;
  confidence: number;
  icon?: string;
}

export const detectTechnologies = async (domain: string): Promise<TechnologyDetection[]> => {
  // In a real implementation, this would call an API like Wappalyzer
  // For now, we'll return mock data based on the domain name
  
  const mockTechnologies: {[key: string]: TechnologyDetection[]} = {
    'default': [
      { name: 'Apache', confidence: 85, icon: 'server' },
      { name: 'PHP', confidence: 90, icon: 'file-code' },
    ],
    'wordpress': [
      { name: 'WordPress', confidence: 99, icon: 'layout' },
      { name: 'MySQL', confidence: 90, icon: 'database' },
      { name: 'PHP', confidence: 95, icon: 'file-code' },
    ],
    'woocommerce': [
      { name: 'WordPress', confidence: 99, icon: 'layout' },
      { name: 'WooCommerce', confidence: 98, icon: 'shopping-cart' },
      { name: 'MySQL', confidence: 90, icon: 'database' },
      { name: 'PHP', confidence: 95, icon: 'file-code' },
    ],
  };
  
  // Determine which mock data to return based on domain keywords
  if (domain.includes('wordpress') || domain.includes('wp')) {
    return mockTechnologies.wordpress;
  } else if (domain.includes('shop') || domain.includes('store') || domain.includes('tienda')) {
    return mockTechnologies.woocommerce;
  }
  
  return mockTechnologies.default;
};

export const checkSSL = async (domain: string): Promise<{
  valid: boolean;
  issuer?: string;
  expiry?: Date;
  grade?: string;
}> => {
  // Mock SSL check - in a real implementation, this would call an SSL checking API
  return {
    valid: true,
    issuer: 'Let\'s Encrypt Authority X3',
    expiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
    grade: 'A',
  };
};

export const estimateLoadingSpeed = async (domain: string, ip: string): Promise<{
  score: number;
  estimated_time: string;
  location: string;
}> => {
  // Mock speed test - would use a real API in production
  const isChilean = isChileanIP(ip);
  
  return {
    score: isChilean ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 40) + 50,
    estimated_time: isChilean ? '0.8s - 1.2s' : '1.5s - 2.5s',
    location: isChilean ? 'Santiago, Chile' : 'Internacional'
  };
};

export const getDomainHistory = async (domain: string): Promise<{
  registrationDate: Date;
  expirationDate: Date;
  registrar: string;
  statusHistory?: Array<{date: Date, status: string}>;
}> => {
  // Mock domain history - would use WHOIS or domain history API in production
  return {
    registrationDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
    expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    registrar: 'NIC Chile',
    statusHistory: [
      {date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), status: 'Registered'},
      {date: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), status: 'Updated nameservers'}
    ]
  };
};

export const getSimilarDomains = (domain: string): {name: string, extension: string}[] => {
  const baseDomain = domain.split('.')[0];
  
  return [
    {name: baseDomain, extension: '.com'},
    {name: baseDomain, extension: '.org'},
    {name: baseDomain, extension: '.net'},
    {name: baseDomain, extension: '.cl'}
  ].filter(d => `${d.name}${d.extension}` !== domain);
};

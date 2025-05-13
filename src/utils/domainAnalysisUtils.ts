// Utilities for domain analysis and data enrichment

import { isChileanIP } from './ipDetection';
import { supabase } from "@/integrations/supabase/client";

interface TechnologyDetection {
  name: string;
  confidence: number;
  icon?: string;
}

// Store cache in memory to reduce duplicate API calls
const localCache = new Map();
const CACHE_TTL = 3600000; // 1 hour

/**
 * Helper function to call the DNSlytics Edge Function
 * @param endpoint The endpoint to call
 * @param domain The domain to analyze
 * @returns Promise with the API response
 */
const callDNSlyticsAPI = async (endpoint: string, domain: string) => {
  const cacheKey = `${endpoint}:${domain}`;
  
  // Check local cache first
  const cachedData = localCache.get(cacheKey);
  if (cachedData && (Date.now() - cachedData.timestamp < CACHE_TTL)) {
    console.log(`Using local cache for ${cacheKey}`);
    return cachedData.data;
  }
  
  try {
    console.log(`Calling DNSlytics API (${endpoint}) for domain: ${domain}`);
    const { data, error } = await supabase.functions.invoke('dnslytics', {
      body: { domain },
      query: { domain },
      method: 'GET',
      path: endpoint,
    });
    
    if (error) {
      console.error('Error calling DNSlytics API:', error);
      throw new Error(`Failed to get domain data: ${error.message}`);
    }
    
    // Cache the result locally
    localCache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    return data;
  } catch (error) {
    console.error(`Error in ${endpoint} for ${domain}:`, error);
    
    // If API call fails, return fallback data
    return getFallbackData(endpoint, domain);
  }
};

/**
 * Provide fallback data when API calls fail
 */
const getFallbackData = (endpoint: string, domain: string) => {
  console.log(`Using fallback data for ${endpoint}`);
  
  switch (endpoint) {
    case 'technologies':
      if (domain.includes('wordpress') || domain.includes('wp')) {
        return [
          { name: 'WordPress', confidence: 99, icon: 'layout' },
          { name: 'MySQL', confidence: 90, icon: 'database' },
          { name: 'PHP', confidence: 95, icon: 'file-code' },
        ];
      } else if (domain.includes('shop') || domain.includes('store') || domain.includes('tienda')) {
        return [
          { name: 'WordPress', confidence: 99, icon: 'layout' },
          { name: 'WooCommerce', confidence: 98, icon: 'shopping-cart' },
          { name: 'MySQL', confidence: 90, icon: 'database' },
          { name: 'PHP', confidence: 95, icon: 'file-code' },
        ];
      }
      return [
        { name: 'Apache', confidence: 85, icon: 'server' },
        { name: 'PHP', confidence: 90, icon: 'file-code' },
      ];
      
    case 'ssl':
      return {
        valid: true,
        issuer: 'Let\'s Encrypt Authority X3',
        expiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        grade: 'A',
      };
      
    case 'domain-history':
      return {
        registrationDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
        expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        registrar: 'NIC Chile',
        statusHistory: [
          {date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), status: 'Registered'},
          {date: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), status: 'Updated nameservers'}
        ]
      };
      
    case 'performance':
      const isChilean = domain.endsWith('.cl');
      return {
        score: isChilean ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 40) + 50,
        estimated_time: isChilean ? '0.8s - 1.2s' : '1.5s - 2.5s',
        location: isChilean ? 'Santiago, Chile' : 'Internacional'
      };
      
    default:
      return { error: 'No fallback data available' };
  }
};

/**
 * Transforms raw technology data from DNSlytics API to our format
 */
const transformTechnologiesData = (rawData: any[]): TechnologyDetection[] => {
  if (!rawData || !Array.isArray(rawData)) return [];
  
  return rawData.map(tech => ({
    name: tech.name || tech.technology || 'Unknown',
    confidence: tech.confidence || tech.certainty || 90,
    icon: mapTechnologyToIcon(tech.name || tech.technology)
  }));
};

/**
 * Maps technology names to icon names
 */
const mapTechnologyToIcon = (techName: string): string => {
  const lowerName = techName.toLowerCase();
  
  if (lowerName.includes('wordpress')) return 'layout';
  if (lowerName.includes('woocommerce')) return 'shopping-cart';
  if (lowerName.includes('php')) return 'file-code';
  if (lowerName.includes('mysql') || lowerName.includes('mariadb') || lowerName.includes('database')) return 'database';
  if (lowerName.includes('apache') || lowerName.includes('nginx') || lowerName.includes('server')) return 'server';
  if (lowerName.includes('cloudflare')) return 'cloud';
  if (lowerName.includes('google')) return 'search';
  if (lowerName.includes('analytics')) return 'bar-chart';
  if (lowerName.includes('jquery') || lowerName.includes('javascript')) return 'code';
  if (lowerName.includes('bootstrap') || lowerName.includes('tailwind')) return 'layout';
  
  // Default icon
  return 'code';
};

/**
 * Detect technologies used by a domain
 */
export const detectTechnologies = async (domain: string): Promise<TechnologyDetection[]> => {
  try {
    const data = await callDNSlyticsAPI('technologies', domain);
    return transformTechnologiesData(data);
  } catch (error) {
    console.error('Error detecting technologies:', error);
    
    // Return mock data as fallback
    if (domain.includes('wordpress') || domain.includes('wp')) {
      return [
        { name: 'WordPress', confidence: 99, icon: 'layout' },
        { name: 'MySQL', confidence: 90, icon: 'database' },
        { name: 'PHP', confidence: 95, icon: 'file-code' },
      ];
    } else if (domain.includes('shop') || domain.includes('store') || domain.includes('tienda')) {
      return [
        { name: 'WordPress', confidence: 99, icon: 'layout' },
        { name: 'WooCommerce', confidence: 98, icon: 'shopping-cart' },
        { name: 'MySQL', confidence: 90, icon: 'database' },
        { name: 'PHP', confidence: 95, icon: 'file-code' },
      ];
    }
    
    return [
      { name: 'Apache', confidence: 85, icon: 'server' },
      { name: 'PHP', confidence: 90, icon: 'file-code' },
    ];
  }
};

/**
 * Check SSL certificate information for a domain
 */
export const checkSSL = async (domain: string): Promise<{
  valid: boolean;
  issuer?: string;
  expiry?: Date;
  grade?: string;
}> => {
  try {
    const data = await callDNSlyticsAPI('ssl', domain);
    
    return {
      valid: data.valid || true,
      issuer: data.issuer || 'Unknown',
      expiry: data.expiry ? new Date(data.expiry) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      grade: data.grade || 'B',
    };
  } catch (error) {
    console.error('Error checking SSL:', error);
    
    // Return mock SSL data as fallback
    return {
      valid: true,
      issuer: 'Let\'s Encrypt Authority X3',
      expiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      grade: 'A',
    };
  }
};

/**
 * Estimate loading speed for a domain
 */
export const estimateLoadingSpeed = async (domain: string, ip: string): Promise<{
  score: number;
  estimated_time: string;
  location: string;
}> => {
  try {
    const data = await callDNSlyticsAPI('performance', domain);
    const isChilean = isChileanIP(ip);
    
    return {
      score: data.score || (isChilean ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 40) + 50),
      estimated_time: data.estimated_time || (isChilean ? '0.8s - 1.2s' : '1.5s - 2.5s'),
      location: data.location || (isChilean ? 'Santiago, Chile' : 'Internacional')
    };
  } catch (error) {
    console.error('Error estimating loading speed:', error);
    
    // Return mock speed data as fallback
    const isChilean = isChileanIP(ip);
    return {
      score: isChilean ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 40) + 50,
      estimated_time: isChilean ? '0.8s - 1.2s' : '1.5s - 2.5s',
      location: isChilean ? 'Santiago, Chile' : 'Internacional'
    };
  }
};

/**
 * Get domain history information
 */
export const getDomainHistory = async (domain: string): Promise<{
  registrationDate: Date;
  expirationDate: Date;
  registrar: string;
  statusHistory?: Array<{date: Date, status: string}>;
}> => {
  try {
    const data = await callDNSlyticsAPI('domain-history', domain);
    
    return {
      registrationDate: data.registrationDate ? new Date(data.registrationDate) : new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      expirationDate: data.expirationDate ? new Date(data.expirationDate) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      registrar: data.registrar || 'NIC Chile',
      statusHistory: data.statusHistory ? data.statusHistory.map((item: any) => ({
        date: new Date(item.date),
        status: item.status
      })) : [
        {date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), status: 'Registered'},
        {date: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), status: 'Updated nameservers'}
      ]
    };
  } catch (error) {
    console.error('Error getting domain history:', error);
    
    // Return mock history data as fallback
    return {
      registrationDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
      expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      registrar: 'NIC Chile',
      statusHistory: [
        {date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), status: 'Registered'},
        {date: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), status: 'Updated nameservers'}
      ]
    };
  }
};

/**
 * Get similar domains for a given domain
 */
export const getSimilarDomains = (domain: string): {name: string, extension: string}[] => {
  const baseDomain = domain.split('.')[0];
  
  // For now, we'll keep the simple implementation while the API integration is developed
  return [
    {name: baseDomain, extension: '.com'},
    {name: baseDomain, extension: '.org'},
    {name: baseDomain, extension: '.net'},
    {name: baseDomain, extension: '.cl'}
  ].filter(d => `${d.name}${d.extension}` !== domain);
};

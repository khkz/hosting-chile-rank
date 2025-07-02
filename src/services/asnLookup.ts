
/**
 * ASN and IP geolocation lookup service
 */

import { isChileanIP, isChileanASN } from '@/utils/ipDetection';
import { getComplaintInfo, detectProviderFromASN, type ComplaintInfo } from './hostingComplaints';

export interface ASNInfo {
  asn: string;
  isp: string;
  country: string;
  city: string;
  isChilean: boolean;
  complaintInfo?: ComplaintInfo | null;
  detectedProvider?: string | null;
}

/**
 * Lookup ASN and ISP information for an IP address
 */
export const lookupASN = async (ip: string): Promise<ASNInfo> => {
  console.log(`🔍 Looking up ASN for IP: ${ip}`);
  
  const fallback: ASNInfo = {
    asn: 'Desconocido',
    isp: 'Desconocido',
    country: 'Desconocido',
    city: 'Desconocido',
    isChilean: false,
    complaintInfo: null,
    detectedProvider: null
  };

  if (!ip || ip === '–' || ip === '-') {
    return fallback;
  }

  // Use official IP detection first
  const isChileanByIP = isChileanIP(ip);
  console.log(`🇨🇱 IP ${ip} is Chilean by official ranges: ${isChileanByIP}`);

  try {
    // Try using ipinfo.io first (free tier allows limited requests)
    const response = await fetch(`https://ipinfo.io/${ip}/json`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`📊 IPInfo response for ${ip}:`, data);
      
      const asnString = data.org ? data.org.split(' ')[0] : 'Desconocido';
      const ispName = data.org ? data.org.substring(data.org.indexOf(' ') + 1) : 'Desconocido';
      
      // Detect provider and get complaint info
      const detectedProvider = detectProviderFromASN(asnString, ispName);
      const complaintInfo = getComplaintInfo(asnString);
      
      const asnInfo: ASNInfo = {
        asn: asnString,
        isp: ispName,
        country: data.country || 'Desconocido',
        city: data.city || 'Desconocido',
        isChilean: isChileanByIP || data.country === 'CL' || isChileanASN(data.org || ''),
        complaintInfo,
        detectedProvider
      };
      
      console.log(`✅ ASN lookup successful:`, asnInfo);
      return asnInfo;
    }
  } catch (error) {
    console.error('❌ Error with ipinfo.io lookup:', error);
  }

  // Fallback: Try to determine based on known Chilean patterns with updated ASNs
  try {
    const knownChileanISPs = [
      { range: '201.148.104', asn: 'AS265839', isp: 'HOSTING.CL' },
      { range: '186.64.115', asn: 'AS52368', isp: 'ZAM LTDA (SolucionHost)' },
      { range: '200.27', asn: 'AS266879', isp: 'HostingPlus' },
      { range: '190.98', asn: 'AS22047', isp: 'VTR Banda Ancha' },
      { range: '200.54', asn: 'AS7418', isp: 'ENTEL Chile' },
      { range: '186.67', asn: 'AS28001', isp: 'Telmex Chile' },
      { range: '191.98', asn: 'AS27678', isp: 'NetUno' },
      { range: '138.117', asn: 'AS263702', isp: 'GRUPO ZGH SPA' },
      { range: '146.83', asn: 'AS263237', isp: 'Red Universitaria Nacional' },
      { range: '152.172', asn: 'AS52468', isp: 'GTD Internet' },
      { range: '109.72.119', asn: 'AS263702', isp: 'GRUPO ZGH SPA' }
    ];

    for (const provider of knownChileanISPs) {
      if (ip.startsWith(provider.range)) {
        console.log(`✅ Matched known Chilean ISP: ${provider.isp}`);
        
        const detectedProvider = detectProviderFromASN(provider.asn, provider.isp);
        const complaintInfo = getComplaintInfo(provider.asn);
        
        return {
          asn: provider.asn,
          isp: provider.isp,
          country: 'Chile',
          city: 'Santiago',
          isChilean: true,
          complaintInfo,
          detectedProvider
        };
      }
    }

    // If IP is Chilean by official ranges but no specific ISP match
    if (isChileanByIP) {
      console.log(`✅ IP is Chilean by official ranges but no specific ISP match`);
      return {
        asn: 'Desconocido',
        isp: 'Proveedor Chileno',
        country: 'Chile',
        city: 'Chile',
        isChilean: true,
        complaintInfo: null,
        detectedProvider: null
      };
    }
  } catch (error) {
    console.error('❌ Error in fallback ASN lookup:', error);
  }

  console.log(`❌ Could not determine ASN for IP: ${ip}`);
  return {
    ...fallback,
    isChilean: isChileanByIP
  };
};

/**
 * Enhanced Chilean IP detection using official CIDR ranges
 */
export const isChileanIPEnhanced = isChileanIP;

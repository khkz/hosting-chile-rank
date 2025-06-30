
/**
 * ASN and IP geolocation lookup service
 */

import { isChileanIP, isChileanASN } from '@/utils/ipDetection';

export interface ASNInfo {
  asn: string;
  isp: string;
  country: string;
  city: string;
  isChilean: boolean;
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
    isChilean: false
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
      
      const asnInfo: ASNInfo = {
        asn: data.org ? data.org.split(' ')[0] : 'Desconocido',
        isp: data.org ? data.org.substring(data.org.indexOf(' ') + 1) : 'Desconocido',
        country: data.country || 'Desconocido',
        city: data.city || 'Desconocido',
        isChilean: isChileanByIP || data.country === 'CL' || isChileanASN(data.org || '')
      };
      
      console.log(`✅ ASN lookup successful:`, asnInfo);
      return asnInfo;
    }
  } catch (error) {
    console.error('❌ Error with ipinfo.io lookup:', error);
  }

  // Fallback: Try to determine based on known Chilean patterns
  try {
    const knownChileanISPs = [
      { range: '201.148.104', asn: 'AS265839', isp: 'HOSTING.CL' },
      { range: '200.27', asn: 'AS61512', isp: 'HostingPlus' },
      { range: '190.98', asn: 'AS22047', isp: 'VTR Banda Ancha' },
      { range: '200.54', asn: 'AS7418', isp: 'ENTEL Chile' },
      { range: '186.67', asn: 'AS28001', isp: 'Telmex Chile' },
      { range: '191.98', asn: 'AS27678', isp: 'NetUno' },
      { range: '138.117', asn: 'AS263702', isp: 'Universidad de Chile' },
      { range: '146.83', asn: 'AS263237', isp: 'Red Universitaria Nacional' },
      { range: '152.172', asn: 'AS52468', isp: 'GTD Internet' }
    ];

    for (const provider of knownChileanISPs) {
      if (ip.startsWith(provider.range)) {
        console.log(`✅ Matched known Chilean ISP: ${provider.isp}`);
        return {
          asn: provider.asn,
          isp: provider.isp,
          country: 'Chile',
          city: 'Santiago',
          isChilean: true
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
        isChilean: true
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


/**
 * ASN and IP geolocation lookup service
 */

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
        isChilean: data.country === 'CL'
      };
      
      console.log(`✅ ASN lookup successful:`, asnInfo);
      return asnInfo;
    }
  } catch (error) {
    console.error('❌ Error with ipinfo.io lookup:', error);
  }

  // Fallback: Try to determine based on known patterns
  try {
    const knownChileanISPs = [
      { range: '201.148.104', asn: 'AS265839', isp: 'HOSTING.CL' },
      { range: '200.27', asn: 'AS61512', isp: 'HostingPlus' },
      { range: '190.98', asn: 'AS22047', isp: 'VTR Banda Ancha' },
      { range: '200.54', asn: 'AS7418', isp: 'ENTEL Chile' },
      { range: '186.67', asn: 'AS28001', isp: 'Telmex Chile' },
      { range: '191.98', asn: 'AS27678', isp: 'NetUno' }
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
  } catch (error) {
    console.error('❌ Error in fallback ASN lookup:', error);
  }

  console.log(`❌ Could not determine ASN for IP: ${ip}`);
  return fallback;
};

/**
 * Enhanced Chilean IP detection with more ranges
 */
export const isChileanIPEnhanced = (ip: string): boolean => {
  if (!ip || ip === '–' || ip === '-') return false;
  
  const chileanRanges = [
    // Original ranges
    '200.27', '200.6', '190.98', '200.14', '200.29', '200.54', '190.196', '186.67',
    '190.95', '190.114', '190.151', '190.160', '190.121', '190.110', '190.101', '190.82',
    '186.64', '186.10', '191.98', '191.101', '191.102', '152.139', '152.172', '152.231',
    '152.74', '181.43', '181.72', '181.162', '181.199', '186.9', '186.11', '186.20',
    '186.78', '201.214', '201.215', '201.220', '201.221', '201.222', '201.241', '201.239',
    '179.0', '179.1', '179.2', '179.3', '179.4', '179.5', '179.6',
    
    // New ranges including the one from the example
    '201.148.104', // HOSTING.CL range
    '201.148.105', '201.148.106', '201.148.107', '201.148.108',
    '138.117', '138.121', '138.186', '138.219', '138.255',
    '146.83', '152.230', '158.170', '158.251', '161.131',
    '163.247', '164.77', '166.110', '167.28', '168.231'
  ];
  
  return chileanRanges.some(range => ip.startsWith(range));
};

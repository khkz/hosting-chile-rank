
/**
 * Utility functions for IP detection and analysis using official Chilean IP ranges
 * Source: https://www.ipdeny.com/ipblocks/data/countries/cl.zone
 */

/**
 * Official Chilean IP ranges in CIDR notation
 * Updated from ipdeny.com official source
 */
export const chileanCIDRRanges = [
  '138.0.0.0/8',
  '146.83.0.0/16',
  '152.172.0.0/14',
  '158.170.0.0/15',
  '161.131.0.0/16',
  '163.247.0.0/16',
  '179.0.0.0/13',
  '181.40.0.0/14',
  '181.160.0.0/11',
  '186.64.0.0/14',
  '190.96.0.0/13',
  '190.110.0.0/15',
  '190.151.0.0/16',
  '190.196.0.0/14',
  '191.96.0.0/13',
  '200.6.0.0/15',
  '200.27.0.0/16',
  '200.54.0.0/15',
  '201.214.0.0/15',
  '201.238.0.0/15'
];

/**
 * Convert IP address to 32-bit integer
 */
const ipToInt = (ip: string): number => {
  const parts = ip.split('.').map(Number);
  return (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
};

/**
 * Check if an IP address is within a CIDR range
 */
const isIPInCIDR = (ip: string, cidr: string): boolean => {
  const [network, prefixLength] = cidr.split('/');
  const networkInt = ipToInt(network);
  const ipInt = ipToInt(ip);
  const mask = (0xffffffff << (32 - parseInt(prefixLength))) >>> 0;
  
  return (networkInt & mask) === (ipInt & mask);
};

/**
 * Checks if an IP address belongs to Chile using official CIDR ranges
 * @param ip The IP address to check
 * @returns boolean indicating if the IP is Chilean
 */
export const isChileanIP = (ip: string): boolean => {
  if (!ip || ip === '–' || ip === '-') return false;
  
  // Validate IP format
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipRegex.test(ip)) return false;
  
  // Check against official Chilean CIDR ranges
  return chileanCIDRRanges.some(cidr => isIPInCIDR(ip, cidr));
};

/**
 * Additional check using ASN info to help identify Chilean IPs
 * @param asn The ASN string from lookupASN function
 * @returns boolean indicating if the ASN suggests a Chilean provider
 */
export const isChileanASN = (asn: string): boolean => {
  if (!asn) return false;
  
  const chileanASNs = [
    'AS61512', 'AS27678', 'AS22047', 'AS7418', 'AS6429', 'AS28001', 
    'AS14259', 'AS263702', 'AS263237', 'AS52468', 'AS263726', 'AS265839'
  ];
  
  return chileanASNs.some(chileanAsn => asn.includes(chileanAsn)) || 
         asn.toLowerCase().includes('chile') ||
         asn.toLowerCase().includes('cl');
};

/**
 * Get the specific CIDR range that contains the given IP
 * @param ip The IP address to check
 * @returns The CIDR range that contains the IP, or null if not found
 */
export const getChileanCIDRRange = (ip: string): string | null => {
  if (!ip || ip === '–' || ip === '-') return null;
  
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipRegex.test(ip)) return null;
  
  return chileanCIDRRanges.find(cidr => isIPInCIDR(ip, cidr)) || null;
};


// Complaint levels for hosting providers
export type ComplaintLevel = 'none' | 'low' | 'medium' | 'high' | 'critical';

export interface ComplaintInfo {
  count: number;
  level: ComplaintLevel;
  reclamosUrl?: string;
  lastComplaint?: string;
  description?: string;
  recommendation?: string;
}

// Complaint data for hosting providers based on ASN
const complaintData: Record<string, ComplaintInfo> = {
  // HostingPlus.cl - AS266879
  "AS266879": {
    count: 0,
    level: 'none',
    reclamosUrl: "https://www.reclamos.cl/busqueda?concepto=hostingplus.cl"
  },
  
  // EcoHosting.cl - AS266855  
  "AS266855": {
    count: 0,
    level: 'none',
    reclamosUrl: "https://www.reclamos.cl/busqueda?concepto=ecohosting.cl"
  },
  
  // HostGator.cl - AS19871
  "AS19871": {
    count: 3,
    level: 'low',
    reclamosUrl: "https://www.reclamos.cl/busqueda?concepto=hostgator.cl"
  },
  
  // Hosting.cl - AS265839
  "AS265839": {
    count: 8,
    level: 'medium',
    reclamosUrl: "https://www.reclamos.cl/busqueda?concepto=hosting.cl"
  },
  
  // PlanetaHosting.cl - AS52368
  "AS52368": {
    count: 5,
    level: 'low',
    reclamosUrl: "https://www.reclamos.cl/busqueda?concepto=planetahosting.cl"
  },
  
  // GRUPO ZGH SPA - AS263702
  "AS263702": {
    count: 4,
    level: 'low',
    reclamosUrl: "https://www.reclamos.cl/busqueda?concepto=grupo%20zgh",
    description: "Reclamos relacionados con servicios de hosting y conectividad",
    recommendation: "Evaluar alternativas de hosting con mejor soporte al cliente"
  }
};

export const getComplaintInfo = (asn: string): ComplaintInfo | null => {
  return complaintData[asn] || null;
};

export const getComplaintBadge = (level: ComplaintLevel) => {
  const badges = {
    none: {
      icon: '✅',
      color: 'bg-green-100 text-green-800 border-green-300',
      text: 'Sin reclamos'
    },
    low: {
      icon: '⚠️',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      text: 'Pocos reclamos'
    },
    medium: {
      icon: '⚠️',
      color: 'bg-orange-100 text-orange-800 border-orange-300',
      text: 'Reclamos moderados'
    },
    high: {
      icon: '🚨',
      color: 'bg-red-100 text-red-800 border-red-300',
      text: 'Muchos reclamos'
    },
    critical: {
      icon: '🚨',
      color: 'bg-red-100 text-red-800 border-red-300',
      text: 'Reclamos críticos'
    }
  };
  
  return badges[level];
};

// Add the missing detectProviderFromASN function
export const detectProviderFromASN = (asn: string, ispName: string): string | null => {
  // Simple provider detection based on ASN or ISP name
  const providers = {
    'AS266879': 'HostingPlus',
    'AS266855': 'EcoHosting', 
    'AS19871': 'HostGator',
    'AS265839': 'Hosting.cl',
    'AS52368': 'PlanetaHosting',
    'AS263702': 'GRUPO ZGH SPA'
  };
  
  // Check ASN first
  if (providers[asn]) {
    return providers[asn];
  }
  
  // Check ISP name for partial matches
  const lowerIspName = ispName.toLowerCase();
  if (lowerIspName.includes('hostingplus')) return 'HostingPlus';
  if (lowerIspName.includes('ecohosting')) return 'EcoHosting';
  if (lowerIspName.includes('hostgator')) return 'HostGator';
  if (lowerIspName.includes('hosting.cl')) return 'Hosting.cl';
  if (lowerIspName.includes('planetahosting')) return 'PlanetaHosting';
  if (lowerIspName.includes('grupo zgh') || lowerIspName.includes('zgh spa')) return 'GRUPO ZGH SPA';
  
  return null;
};

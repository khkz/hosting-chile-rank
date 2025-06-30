
// Complaint levels for hosting providers
export type ComplaintLevel = 'none' | 'low' | 'medium' | 'high';

export interface ComplaintInfo {
  count: number;
  level: ComplaintLevel;
  reclamosUrl?: string;
}

// Complaint data for hosting providers based on ASN
const complaintData: Record<string, ComplaintInfo> = {
  // HostingPlus.cl - AS266879
  "AS266879": {
    count: 0,
    level: 'none',
    reclamosUrl: "https://www.reclamos.cl/empresa/hostingplus"
  },
  
  // EcoHosting.cl - AS266855  
  "AS266855": {
    count: 0,
    level: 'none',
    reclamosUrl: "https://www.reclamos.cl/empresa/ecohosting"
  },
  
  // HostGator.cl - AS19871
  "AS19871": {
    count: 3,
    level: 'low',
    reclamosUrl: "https://www.reclamos.cl/empresa/hostgator"
  },
  
  // Hosting.cl - AS265839
  "AS265839": {
    count: 8,
    level: 'medium',
    reclamosUrl: "https://www.reclamos.cl/empresa/hosting-cl"
  },
  
  // PlanetaHosting.cl - AS52368
  "AS52368": {
    count: 5,
    level: 'low',
    reclamosUrl: "https://www.reclamos.cl/empresa/planetahosting"
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
    }
  };
  
  return badges[level];
};


/**
 * Hosting complaints detection service
 * Data source: reclamos.cl (2020-2025)
 */

export interface ComplaintInfo {
  level: 'critical' | 'high' | 'medium' | 'low' | 'none';
  count: number;
  lastComplaint: string;
  description: string;
  recommendation: string;
  reclamosUrl?: string;
}

/**
 * ASN to complaint mapping with real data from reclamos.cl
 */
const asnComplaintMap: Record<string, ComplaintInfo> = {
  // Critical level (6+ complaints)
  'AS19871': {
    level: 'critical',
    count: 6,
    lastComplaint: '9-ene-2025',
    description: 'Triple cobro + IP extranjera (EE.UU.)',
    recommendation: 'Considerar migración urgente - Múltiples reclamos recientes',
    reclamosUrl: 'https://www.reclamos.cl/empresa/hostgator'
  },

  // High level (25+ complaints)
  'AS265839': {
    level: 'high',
    count: 40,
    lastComplaint: '2024',
    description: 'Caídas masivas del servicio, falta de respuesta',
    recommendation: 'Migración recomendada - Historial de problemas graves',
    reclamosUrl: 'https://www.reclamos.cl/empresa/hosting-cl'
  },

  'AS52368': {
    level: 'high',
    count: 27, // Includes SolucionHost (2) + Haulmer/Bluehosting (25+)
    lastComplaint: '7-abr-2024',
    description: 'Múltiples problemas: caídas prolongadas, soporte lento',
    recommendation: 'Migración recomendada - Múltiples proveedores con problemas',
    reclamosUrl: 'https://www.reclamos.cl/empresa/solucionhost'
  },

  // Medium level (2+ complaints)
  'AS27823': {
    level: 'medium',
    count: 2,
    lastComplaint: '28-ago-2024',
    description: 'Publicidad mentirosa + IP Argentina',
    recommendation: 'Evaluar alternativas - Problemas de transparencia',
    reclamosUrl: 'https://www.reclamos.cl/empresa/donweb'
  },

  // Low level (1 historical complaint)
  'AS263702': {
    level: 'low',
    count: 1,
    lastComplaint: '4-oct-2024',
    description: 'Baja de servicio sin reembolso',
    recommendation: 'Monitorear - Reclamo aislado reciente',
    reclamosUrl: 'https://www.reclamos.cl/empresa/v2-networks'
  },

  'AS265831': {
    level: 'low',
    count: 1,
    lastComplaint: 'dic-2018',
    description: 'Problemas con correo (histórico)',
    recommendation: 'Riesgo bajo - Sin incidentes recientes',
    reclamosUrl: 'https://www.reclamos.cl/empresa/cpanelhost'
  },

  // No complaints
  'AS266879': {
    level: 'none',
    count: 0,
    lastComplaint: 'Nunca',
    description: 'Servicio confiable sin reclamos',
    recommendation: 'Excelente elección - Proveedor sin reclamos',
    reclamosUrl: undefined
  },

  'AS266855': {
    level: 'none',
    count: 0,
    lastComplaint: 'Nunca',
    description: 'Servicio confiable sin reclamos',
    recommendation: 'Excelente elección - Proveedor sin reclamos',
    reclamosUrl: undefined
  }
};

/**
 * Get complaint information for a given ASN
 */
export const getComplaintInfo = (asn: string): ComplaintInfo | null => {
  // Clean ASN format (remove spaces, normalize)
  const cleanAsn = asn.replace(/\s+/g, '').toUpperCase();
  
  // Try exact match first
  if (asnComplaintMap[cleanAsn]) {
    return asnComplaintMap[cleanAsn];
  }

  // Try to extract ASN number from formatted string like "AS12345 (Provider Name)"
  const asnMatch = cleanAsn.match(/^AS(\d+)/);
  if (asnMatch) {
    const formattedAsn = `AS${asnMatch[1]}`;
    if (asnComplaintMap[formattedAsn]) {
      return asnComplaintMap[formattedAsn];
    }
  }

  return null;
};

/**
 * Get complaint badge color and text based on level
 */
export const getComplaintBadge = (level: ComplaintInfo['level']) => {
  switch (level) {
    case 'critical':
      return {
        color: 'bg-red-500 text-white',
        text: 'Crítico',
        icon: '🚨'
      };
    case 'high':
      return {
        color: 'bg-red-400 text-white',
        text: 'Alto',
        icon: '⚠️'
      };
    case 'medium':
      return {
        color: 'bg-yellow-500 text-white',
        text: 'Medio',
        icon: '⚡'
      };
    case 'low':
      return {
        color: 'bg-blue-500 text-white',
        text: 'Bajo',
        icon: 'ℹ️'
      };
    case 'none':
      return {
        color: 'bg-green-500 text-white',
        text: 'Sin reclamos',
        icon: '✅'
      };
    default:
      return {
        color: 'bg-gray-500 text-white',
        text: 'Desconocido',
        icon: '❓'
      };
  }
};

/**
 * Enhanced ISP/Provider name mapping for better detection
 */
export const knownProviders: Record<string, string[]> = {
  'HostGator': ['hostgator', 'AS19871'],
  'HOSTING.CL': ['hosting.cl', 'AS265839'],
  'ZAM LTDA': ['zam ltda', 'solucionhost', 'haulmer', 'bluehosting', 'AS52368'],
  'DonWeb': ['donweb', 'dattatec', 'AS27823'],
  'V2 Networks': ['v2 networks', 'grupo zgh', 'AS263702'],
  'cpanelhost.cl': ['cpanelhost', 'wirenet', 'AS265831'],
  'HostingPlus': ['hostingplus', 'AS266879', 'AS266855']
};

/**
 * Detect provider from ASN or ISP name
 */
export const detectProviderFromASN = (asn: string, isp: string = ''): string | null => {
  const searchText = `${asn} ${isp}`.toLowerCase();
  
  for (const [provider, keywords] of Object.entries(knownProviders)) {
    if (keywords.some(keyword => searchText.includes(keyword.toLowerCase()))) {
      return provider;
    }
  }
  
  return null;
};

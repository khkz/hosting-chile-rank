interface CTAParams {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
}

export const buildHostingPlusURL = (
  baseUrl: string, 
  params: CTAParams = {}
): string => {
  const defaultParams: CTAParams = {
    source: 'wiki',
    medium: 'internal',
    campaign: 'hp-wiki-2025',
    ...params
  };

  const url = new URL(baseUrl);
  
  if (defaultParams.source) url.searchParams.set('utm_source', defaultParams.source);
  if (defaultParams.medium) url.searchParams.set('utm_medium', defaultParams.medium);
  if (defaultParams.campaign) url.searchParams.set('utm_campaign', defaultParams.campaign);
  if (defaultParams.content) url.searchParams.set('utm_content', defaultParams.content);
  if (defaultParams.term) url.searchParams.set('utm_term', defaultParams.term);

  return url.toString();
};

export const getHostingPlusPlans = () => {
  return {
    'WordPress Básico': {
      price: '$2.990/mes',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=1',
      features: ['1 Sitio Web', 'SSL Gratis', 'Backup Diario', 'Soporte 24/7']
    },
    'WordPress Turbo': {
      price: '$4.990/mes',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=3',
      features: ['LiteSpeed Enterprise', 'HTTP/3 + QUIC', 'JetBackup', 'Staging']
    },
    'WordPress Pro': {
      price: '$7.990/mes', 
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=4',
      features: ['Redis Cache', 'WAF Premium', 'Sitios Ilimitados', 'Priority Support']
    },
    'WordPress E-commerce': {
      price: '$9.990/mes',
      url: 'https://clientes.hostingplus.cl/cart.php?a=add&pid=5',
      features: ['Optimizado WooCommerce', 'CDN Premium', 'SSL Wildcard', 'Resources Dedicados']
    },
    'VPS Cloud': {
      price: 'Desde $19.990/mes',
      url: 'https://clientes.hostingplus.cl/vps-cloud',
      features: ['CPU/RAM Dedicada', 'Root Access', 'IP Dedicada', 'Configuración Personalizada']
    }
  };
};

export const trackCTAClick = (termSlug: string, ctaType: 'primary' | 'secondary' = 'primary') => {
  // Analytics tracking
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'wiki_cta_click', {
      event_category: 'wiki',
      event_label: termSlug,
      cta_type: ctaType,
      value: 1
    });
  }
  
  // También podemos enviar a Supabase analytics si está configurado
  console.log('CTA Click:', { termSlug, ctaType, timestamp: new Date().toISOString() });
};
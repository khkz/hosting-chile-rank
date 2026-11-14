import { Clock, Zap, Headphones, Shield, MapPin, AlertTriangle, type LucideIcon } from 'lucide-react';
import { getComplaintInfo, type ComplaintInfo } from '@/services/hostingComplaints';
import { CURRENT_YEAR } from '@/utils/dateHelpers';

/**
 * Datos de la guía /mejor-hosting-chile-2026, movidos sin cambios desde la
 * página para dividirla en piezas de menos de 400 líneas.
 * Las notas (rating) y letras de velocidad están escritas a mano: es la
 * decisión de negocio pendiente 10. No cambies sus valores aquí.
 * `slug` solo enlaza a la ficha del catálogo.
 */
export interface ChileGuideProvider {
  name: string;
  slug: string;
  logo: string;
  rating: number;
  uptime: string;
  velocidad: string;
  precio: string;
  precioDestacado: string;
  datacenter: string;
  litespeed: boolean;
  waf: boolean;
  backups: boolean;
  ssl: boolean;
  garantia: string;
  destacado: boolean;
  url: string;
  asn: string;
  complaints: ComplaintInfo | null;
}

export const hostingProviders: ChileGuideProvider[] = [
  {
    name: "HostingPlus.cl",
    slug: "hostingplus",
    logo: "/logo-hostingplus.png",
    rating: 9.9,
    uptime: "99.98%",
    velocidad: "A+",
    precio: "Consultar",
    precioDestacado: "Consultar en el sitio oficial",
    datacenter: "Santiago, Chile",
    litespeed: true,
    waf: true,
    backups: true,
    ssl: true,
    garantia: "30 días",
    destacado: true,
    url: "https://www.hostingplus.cl/",
    asn: "AS266879",
    complaints: getComplaintInfo("AS266879")
  },
  {
    name: "EcoHosting.cl",
    slug: "ecohosting",
    logo: "/logo-ecohosting.png",
    rating: 9.6,
    uptime: "99.95%",
    velocidad: "A",
    precio: "Consultar",
    precioDestacado: "Consultar en el sitio oficial",
    datacenter: "Santiago, Chile",
    litespeed: true,
    waf: false,
    backups: true,
    ssl: true,
    garantia: "15 días",
    destacado: false,
    url: "https://www.ecohosting.cl/",
    asn: "AS266855",
    complaints: getComplaintInfo("AS266855")
  },
  {
    name: "HostGator.cl",
    slug: "hostgator",
    logo: "/logo-hostgator.svg",
    rating: 9.2,
    uptime: "99.93%",
    velocidad: "B+",
    precio: "Consultar",
    precioDestacado: "Consultar en el sitio oficial",
    datacenter: "Santiago, Chile",
    litespeed: false,
    waf: true,
    backups: true,
    ssl: true,
    garantia: "45 días",
    destacado: false,
    url: "https://www.hostgator.cl/",
    asn: "AS19871",
    complaints: getComplaintInfo("AS19871")
  },
  {
    name: "Hosting.cl",
    slug: "hostingcl",
    logo: "/logo-hostingcl.svg",
    rating: 8.9,
    uptime: "99.91%",
    velocidad: "B",
    precio: "Consultar",
    precioDestacado: "Consultar en el sitio oficial",
    datacenter: "Santiago, Chile",
    litespeed: false,
    waf: false,
    backups: true,
    ssl: true,
    garantia: "7 días",
    destacado: false,
    url: "https://www.hosting.cl/",
    asn: "AS265839",
    complaints: getComplaintInfo("AS265839")
  },
  {
    name: "PlanetaHosting.cl",
    slug: "planetahosting",
    logo: "/logo-planetahosting.svg",
    rating: 8.5,
    uptime: "99.89%",
    velocidad: "B",
    precio: "Consultar",
    precioDestacado: "Consultar en el sitio oficial",
    datacenter: "Santiago, Chile",
    litespeed: false,
    waf: false,
    backups: true,
    ssl: true,
    garantia: "15 días",
    destacado: false,
    url: "https://www.planetahosting.cl/",
    asn: "AS52368",
    complaints: getComplaintInfo("AS52368")
  }
];

export interface ChileCriterion {
  icon: LucideIcon;
  title: string;
  description: string;
}

// Títulos en minúscula de oración y cifras con coma decimal (texto visible, no va al JSON-LD).
export const criterios: ChileCriterion[] = [
  {
    icon: Clock,
    title: "Uptime y disponibilidad",
    description: `Un hosting confiable debe garantizar al menos 99,9 % de uptime. Analizamos el tiempo de actividad real de cada proveedor durante 2025-${CURRENT_YEAR}.`
  },
  {
    icon: Zap,
    title: "Velocidad de carga",
    description: "La velocidad impacta directamente en el SEO y experiencia del usuario. Evaluamos tiempos de respuesta, tecnologías como LiteSpeed y optimizaciones SSD."
  },
  {
    icon: Headphones,
    title: "Calidad del soporte",
    description: "Soporte técnico 24/7 en español, tiempos de respuesta rápidos y conocimiento especializado son fundamentales para resolver problemas críticos."
  },
  {
    icon: Shield,
    title: "Seguridad y backups",
    description: "Protección WAF, certificados SSL gratuitos, backups automáticos y medidas de seguridad avanzadas para proteger tu sitio web."
  },
  {
    icon: MapPin,
    title: "Infraestructura local",
    description: "Servidores ubicados en Chile garantizan menor latencia para visitantes locales y mejor posicionamiento en búsquedas geográficas."
  },
  {
    icon: AlertTriangle,
    title: "Historial de reclamos",
    description: "Análisis de reclamos verificados en Reclamos.cl para evaluar la confiabilidad real del proveedor según experiencias de usuarios chilenos."
  }
];

// Mismo texto que alimenta el JSON-LD FAQPage de la página: no lo edites solo aquí.
export const faqs = [
  {
    question: `¿Cuál es realmente el mejor hosting en Chile en ${CURRENT_YEAR}?`,
    answer: "Según nuestro análisis exhaustivo, HostingPlus.cl lidera el ranking con 9.9/10, ofreciendo 99.98% de uptime, tecnología LiteSpeed Enterprise, servidores propios en Santiago y 0 reclamos registrados en Reclamos.cl."
  },
  {
    question: "¿Por qué es importante elegir un hosting con servidores en Chile?",
    answer: "Los servidores locales reducen la latencia hasta en 200ms, mejoran el SEO local, cumplen con regulaciones de datos chilenas y ofrecen mejor velocidad para visitantes desde Chile."
  },
  {
    question: "¿Qué diferencia hay entre hosting compartido y hosting SSD rápido?",
    answer: "El hosting SSD es hasta 10x más rápido que los discos tradicionales. El hosting SSD rápido en Chile utiliza tecnologías como LiteSpeed y NVMe para optimizar aún más el rendimiento."
  },
  {
    question: "¿Cómo verificar el uptime real de un proveedor de hosting?",
    answer: "Utiliza herramientas como UptimeRobot, Pingdom o consulta sitios independientes de monitoreo. Desconfía de promesas de 100% uptime, el estándar industrial es 99.9%."
  },
  {
    question: "¿Qué incluye el mejor hosting Chile para WordPress?",
    answer: "Debe incluir: instalación automática de WordPress, LiteSpeed o tecnología de caché, SSL gratuito, backups automáticos, soporte especializado en WordPress y optimizaciones específicas."
  },
  {
    question: `¿Cuánto cuesta un hosting de calidad en Chile en ${CURRENT_YEAR}?`,
    answer: "El precio depende del proveedor, del plan y del periodo de contratación: la mayoría cobra de forma anual y con IVA aparte, y algunos suben el valor en la renovación. Estamos reverificando el catálogo, así que no publicamos cifras: consulta el precio vigente en el sitio oficial de cada proveedor antes de contratar."
  },
  {
    question: "¿Cómo verificar los reclamos de un proveedor de hosting?",
    answer: "Consulta Reclamos.cl para ver quejas verificadas de usuarios chilenos. Un proveedor con 0 reclamos demuestra excelente servicio al cliente y confiabilidad comprobada."
  }
];

export const guideLinks = [
  { to: '/guia-elegir-hosting', label: 'Guía completa para elegir hosting web' },
  { to: '/guia-elegir-vps', label: 'Cómo elegir el VPS perfecto' },
  { to: '/guia-elegir-servidor-dedicado', label: 'Guía para servidores dedicados' },
  { to: '/guia-elegir-ssl', label: 'Todo sobre certificados SSL' },
];

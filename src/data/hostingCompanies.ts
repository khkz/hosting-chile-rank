
import { HostingCompanyData } from "@/components/HostingCompanyInfo";

export const hostingCompanies: Record<string, HostingCompanyData> = {
  "hostingplus": {
    id: "hostingplus",
    name: "HostingPlus.cl",
    logo: "/logo-hostingplus-new.svg",
    description: "HostingPlus es uno de los proveedores líderes de hosting en Chile, con servidores propios ubicados en Santiago. Ofrecen una combinación de alta velocidad, seguridad avanzada y soporte técnico 24/7.",
    rating: 9.9,
    yearFounded: 2013,
    datacenterLocation: "Santiago, Chile",
    website: "https://www.hostingplus.cl/",
    contactInfo: {
      phone: "+56 2 2938 9540",
      email: "soporte@hostingplus.cl",
      address: "Av. Providencia 1208, Oficina 1603, Providencia, Santiago",
      hours: "Lunes a Viernes: 9:00 - 18:00"
    },
    plans: [
      {
        name: "Plan Starter",
        price: 3990,
        storage: "15 GB SSD",
        bandwidth: "Ilimitada",
        domains: 1,
        features: [
          { name: "LiteSpeed Enterprise", included: true },
          { name: "JetBackup", included: true },
          { name: "SSL Gratis", included: true },
          { name: "Instalador WordPress", included: true },
          { name: "Firewall WAF", included: true },
          { name: "Soporte 24/7", included: true }
        ]
      },
      {
        name: "Plan Business",
        price: 5990,
        storage: "30 GB SSD",
        bandwidth: "Ilimitada",
        domains: 5,
        features: [
          { name: "LiteSpeed Enterprise", included: true },
          { name: "JetBackup", included: true },
          { name: "SSL Gratis", included: true },
          { name: "Instalador WordPress", included: true },
          { name: "Firewall WAF", included: true },
          { name: "Soporte 24/7", included: true },
          { name: "IP Dedicada", included: true }
        ]
      },
      {
        name: "Plan Premium",
        price: 9990,
        storage: "50 GB SSD",
        bandwidth: "Ilimitada",
        domains: 10,
        features: [
          { name: "LiteSpeed Enterprise", included: true },
          { name: "JetBackup", included: true },
          { name: "SSL Gratis", included: true },
          { name: "Instalador WordPress", included: true },
          { name: "Firewall WAF", included: true },
          { name: "Soporte 24/7", included: true },
          { name: "IP Dedicada", included: true },
          { name: "CloudLinux", included: true },
          { name: "LiteSpeed Cache", included: true }
        ]
      }
    ]
  },
  "ecohosting": {
    id: "ecohosting",
    name: "EcoHosting.cl",
    logo: "/logo-ecohosting-new.svg",
    description: "EcoHosting es un proveedor chileno que destaca por su compromiso con el medio ambiente, utilizando energía 100% renovable para sus servidores y ofreciendo soluciones de hosting confiables y de alta calidad.",
    rating: 9.6,
    yearFounded: 2015,
    datacenterLocation: "Santiago, Chile",
    website: "https://www.ecohosting.cl/",
    contactInfo: {
      phone: "+56 2 2582 9350",
      email: "contacto@ecohosting.cl",
      address: "Los Militares 4620, Oficina 803, Las Condes, Santiago",
      hours: "Lunes a Viernes: 9:30 - 18:30"
    },
    plans: [
      {
        name: "Plan Web",
        price: 4990,
        storage: "20 GB SSD",
        bandwidth: "Ilimitada",
        domains: 1,
        features: [
          { name: "Energía 100% Renovable", included: true },
          { name: "LiteSpeed", included: true },
          { name: "SSL Gratis", included: true },
          { name: "Backups JetBackup", included: true },
          { name: "Dominio .CL gratis", included: true },
          { name: "Soporte 24/7", included: true }
        ]
      },
      {
        name: "Plan Empresas",
        price: 7990,
        storage: "40 GB SSD",
        bandwidth: "Ilimitada",
        domains: 3,
        features: [
          { name: "Energía 100% Renovable", included: true },
          { name: "LiteSpeed", included: true },
          { name: "SSL Gratis", included: true },
          { name: "Backups JetBackup", included: true },
          { name: "Dominio .CL gratis", included: true },
          { name: "Soporte 24/7", included: true },
          { name: "MagicSpam", included: true }
        ]
      },
      {
        name: "Plan Corporativo",
        price: 12990,
        storage: "60 GB SSD",
        bandwidth: "Ilimitada",
        domains: 10,
        features: [
          { name: "Energía 100% Renovable", included: true },
          { name: "LiteSpeed", included: true },
          { name: "SSL Gratis", included: true },
          { name: "Backups JetBackup", included: true },
          { name: "Dominio .CL gratis", included: true },
          { name: "Soporte 24/7", included: true },
          { name: "MagicSpam", included: true },
          { name: "IP Dedicada", included: true },
          { name: "Imunify360", included: true }
        ]
      }
    ]
  },
  "1hosting": {
    id: "1hosting",
    name: "1Hosting.cl",
    logo: "/logo-1hosting.svg",
    description: "1Hosting ofrece servicios de alojamiento web confiables a precios accesibles, ideal para pequeñas empresas y proyectos personales. Con servidores en Chile, garantizan una buena velocidad para sitios web locales.",
    rating: 8.8,
    yearFounded: 2010,
    datacenterLocation: "Santiago, Chile",
    website: "https://www.1hosting.cl/",
    contactInfo: {
      phone: "+56 2 2570 9380",
      email: "info@1hosting.cl",
      address: "Av. Apoquindo 6410, Oficina 605, Las Condes, Santiago",
      hours: "Lunes a Viernes: 9:00 - 18:00"
    },
    plans: [
      {
        name: "Plan Básico",
        price: 2990,
        storage: "10 GB SSD",
        bandwidth: "Ilimitada",
        domains: 1,
        features: [
          { name: "cPanel", included: true },
          { name: "SSL Gratis", included: true },
          { name: "Backups Semanales", included: true },
          { name: "Instalador WordPress", included: true },
          { name: "Firewall WAF", included: false },
          { name: "Soporte 24/7", included: false }
        ]
      },
      {
        name: "Plan Emprendedor",
        price: 4990,
        storage: "25 GB SSD",
        bandwidth: "Ilimitada",
        domains: 3,
        features: [
          { name: "cPanel", included: true },
          { name: "SSL Gratis", included: true },
          { name: "Backups Semanales", included: true },
          { name: "Instalador WordPress", included: true },
          { name: "Firewall WAF", included: true },
          { name: "Soporte 24/7", included: false }
        ]
      },
      {
        name: "Plan Profesional",
        price: 7990,
        storage: "50 GB SSD",
        bandwidth: "Ilimitada",
        domains: 5,
        features: [
          { name: "cPanel", included: true },
          { name: "SSL Gratis", included: true },
          { name: "Backups Semanales", included: true },
          { name: "Instalador WordPress", included: true },
          { name: "Firewall WAF", included: true },
          { name: "Soporte 24/7", included: true }
        ]
      }
    ]
  },
  "hostgator": {
    id: "hostgator",
    name: "HostGator.cl",
    logo: "https://logo.clearbit.com/hostgator.cl",
    description: "HostGator Chile es parte de una reconocida marca internacional con más de 12 años de experiencia en el mercado chileno, ofreciendo planes de hosting confiables con buen soporte técnico.",
    rating: 9.2,
    yearFounded: 2011,
    datacenterLocation: "Santiago, Chile",
    website: "https://www.hostgator.cl/",
    contactInfo: {
      phone: "+56 2 2594 9520",
      email: "soporte@hostgator.cl",
      address: "Av. El Bosque Norte 0123, Oficina 402, Las Condes, Santiago",
      hours: "24/7"
    },
    plans: [
      {
        name: "Plan Hatchling",
        price: 3490,
        storage: "25 GB SSD",
        bandwidth: "Ilimitada",
        domains: 1,
        features: [
          { name: "cPanel Personalizado", included: true },
          { name: "SSL Gratis", included: true },
          { name: "Backups Diarios", included: true },
          { name: "Instalador WordPress", included: true },
          { name: "Soporte Chat 24/7", included: true }
        ]
      },
      {
        name: "Plan Baby",
        price: 6490,
        storage: "50 GB SSD",
        bandwidth: "Ilimitada",
        domains: 3,
        features: [
          { name: "cPanel Personalizado", included: true },
          { name: "SSL Gratis", included: true },
          { name: "Backups Diarios", included: true },
          { name: "Instalador WordPress", included: true },
          { name: "Soporte Chat 24/7", included: true },
          { name: "Dominios Ilimitados", included: true }
        ]
      },
      {
        name: "Plan Business",
        price: 9990,
        storage: "100 GB SSD",
        bandwidth: "Ilimitada",
        domains: 5,
        features: [
          { name: "cPanel Personalizado", included: true },
          { name: "SSL Gratis", included: true },
          { name: "Backups Diarios", included: true },
          { name: "Instalador WordPress", included: true },
          { name: "Soporte Chat 24/7", included: true },
          { name: "Dominios Ilimitados", included: true },
          { name: "IP Dedicada", included: true },
          { name: "SEO Tools", included: true }
        ]
      }
    ]
  },
  "bluehost": {
    id: "bluehost",
    name: "BlueHost.cl",
    logo: "/logo-bluehost.svg",
    description: "BlueHost Chile ofrece soluciones de hosting recomendadas por WordPress.org, con un enfoque en rendimiento y facilidad de uso para sitios web basados en WordPress.",
    rating: 9.0,
    yearFounded: 2012,
    datacenterLocation: "Santiago, Chile",
    website: "https://www.bluehost.cl/",
    contactInfo: {
      phone: "+56 2 2405 4230",
      email: "contacto@bluehost.cl",
      address: "Isidora Goyenechea 2800, Oficina 501, Las Condes, Santiago",
      hours: "Lunes a Viernes: 9:00 - 19:00, Sábado: 10:00 - 14:00"
    },
    plans: [
      {
        name: "Plan Básico",
        price: 5990,
        storage: "30 GB SSD",
        bandwidth: "Ilimitada",
        domains: 1,
        features: [
          { name: "WordPress Optimizado", included: true },
          { name: "Certificado SSL", included: true },
          { name: "Backups Semanales", included: true },
          { name: "CDN Incluido", included: true },
          { name: "Soporte 24/7", included: true }
        ]
      },
      {
        name: "Plan Plus",
        price: 8990,
        storage: "60 GB SSD",
        bandwidth: "Ilimitada",
        domains: 5,
        features: [
          { name: "WordPress Optimizado", included: true },
          { name: "Certificado SSL", included: true },
          { name: "Backups Semanales", included: true },
          { name: "CDN Incluido", included: true },
          { name: "Soporte 24/7", included: true },
          { name: "Marketing Credits", included: true },
          { name: "Spam Protection", included: true }
        ]
      },
      {
        name: "Plan Choice Plus",
        price: 11990,
        storage: "100 GB SSD",
        bandwidth: "Ilimitada",
        domains: 10,
        features: [
          { name: "WordPress Optimizado", included: true },
          { name: "Certificado SSL", included: true },
          { name: "Backups Semanales", included: true },
          { name: "CDN Incluido", included: true },
          { name: "Soporte 24/7", included: true },
          { name: "Marketing Credits", included: true },
          { name: "Spam Protection", included: true },
          { name: "Domain Privacy", included: true },
          { name: "Backup Pro", included: true }
        ]
      }
    ]
  },
  "godaddy": {
    id: "godaddy",
    name: "GoDaddy.cl",
    logo: "/logo-godaddy.svg",
    description: "GoDaddy es uno de los registradores de dominios y proveedores de hosting más grandes del mundo, con presencia local en Chile. Ofrecen una amplia gama de servicios para la presencia web de empresas y particulares.",
    rating: 8.3,
    yearFounded: 2010,
    datacenterLocation: "Múltiples ubicaciones, incluyendo Santiago",
    website: "https://www.godaddy.cl/",
    contactInfo: {
      phone: "+56 2 2938 0940",
      email: "soporte@godaddycl.com",
      address: "Oficina virtual en Chile",
      hours: "24/7 (Soporte internacional)"
    },
    plans: [
      {
        name: "Economy",
        price: 3990,
        storage: "100 GB SSD",
        bandwidth: "Ilimitada",
        domains: 1,
        features: [
          { name: "Cpanel", included: true },
          { name: "SSL 1 año", included: true },
          { name: "Backups Mensuales", included: true },
          { name: "Email Profesional", included: true },
          { name: "Soporte 24/7", included: true }
        ]
      },
      {
        name: "Deluxe",
        price: 6990,
        storage: "Ilimitado",
        bandwidth: "Ilimitada",
        domains: 5,
        features: [
          { name: "Cpanel", included: true },
          { name: "SSL 1 año", included: true },
          { name: "Backups Mensuales", included: true },
          { name: "Email Profesional", included: true },
          { name: "Soporte 24/7", included: true },
          { name: "SEO Tools", included: true }
        ]
      },
      {
        name: "Ultimate",
        price: 9990,
        storage: "Ilimitado",
        bandwidth: "Ilimitada",
        domains: 10,
        features: [
          { name: "Cpanel", included: true },
          { name: "SSL 1 año", included: true },
          { name: "Backups Mensuales", included: true },
          { name: "Email Profesional", included: true },
          { name: "Soporte 24/7", included: true },
          { name: "SEO Tools", included: true },
          { name: "GoDaddy Website Builder", included: true },
          { name: "Premium DNS", included: true }
        ]
      }
    ]
  }
};

// This is a helper function to get a list of all hosting companies for catalog pages
export const getAllHostingCompanies = () => {
  return Object.values(hostingCompanies);
};

// This is a helper function to get a single hosting company by slug
export const getHostingCompanyBySlug = (slug: string) => {
  return hostingCompanies[slug] || null;
};

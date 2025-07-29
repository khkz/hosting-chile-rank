
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
        name: "Personal SSD",
        price: 4158, // Precio mensual efectivo con descuento anual ($49,900/año)
        storage: "15 GB SSD",
        bandwidth: "Ilimitada",
        domains: 1,
        features: [
          { name: "LiteSpeed Enterprise", included: true },
          { name: "JetBackup", included: true },
          { name: "SSL Gratis", included: true },
          { name: "Instalador WordPress", included: true },
          { name: "Firewall WAF", included: true },
          { name: "Soporte 24/7", included: true },
          { name: "Correos ilimitados", included: true }
        ]
      },
      {
        name: "Emprendedor SSD",
        price: 5575, // Precio mensual efectivo con descuento anual ($66,900/año)
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
          { name: "Correos ilimitados", included: true },
          { name: "IP Dedicada", included: true }
        ]
      },
      {
        name: "WordPress",
        price: 6992, // Precio mensual efectivo con descuento anual ($83,900/año)
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
          { name: "Correos ilimitados", included: true },
          { name: "IP Dedicada", included: true },
          { name: "CloudLinux", included: true },
          { name: "LiteSpeed Cache", included: true }
        ]
      },
      {
        name: "E-commerce",
        price: 11242, // Precio mensual efectivo con descuento anual ($134,900/año)
        storage: "100 GB SSD",
        bandwidth: "Ilimitada",
        domains: 25,
        features: [
          { name: "LiteSpeed Enterprise", included: true },
          { name: "JetBackup", included: true },
          { name: "SSL Gratis", included: true },
          { name: "Instalador WordPress", included: true },
          { name: "Firewall WAF", included: true },
          { name: "Soporte 24/7", included: true },
          { name: "Correos ilimitados", included: true },
          { name: "IP Dedicada", included: true },
          { name: "CloudLinux", included: true },
          { name: "LiteSpeed Cache", included: true },
          { name: "WooCommerce optimizado", included: true },
          { name: "CDN incluido", included: true }
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
    logo: "/logo-hostgator.svg",
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
  },
  "planetahosting": {
    id: "planetahosting",
    name: "PlanetaHosting.cl",
    logo: "/logo-planetahosting.svg",
    description: "PlanetaHosting es un proveedor chileno con más de 15 años de experiencia, especializado en soluciones de hosting para empresas y profesionales con alta demanda de recursos.",
    rating: 8.5,
    yearFounded: 2008,
    datacenterLocation: "Santiago, Chile",
    website: "https://www.planetahosting.cl/",
    contactInfo: {
      phone: "+56 2 2840 5600",
      email: "ventas@planetahosting.cl",
      address: "Av. Apoquindo 4700, Oficina 1101, Las Condes, Santiago",
      hours: "Lunes a Viernes: 9:00 - 18:00"
    },
    plans: [
      {
        name: "Plan Básico",
        price: 4490,
        storage: "20 GB SSD",
        bandwidth: "Ilimitada",
        domains: 1,
        features: [
          { name: "cPanel", included: true },
          { name: "SSL Gratis", included: true },
          { name: "Backups Diarios", included: true },
          { name: "Correos ilimitados", included: true },
          { name: "Soporte 24/7", included: false }
        ]
      },
      {
        name: "Plan Avanzado",
        price: 7990,
        storage: "50 GB SSD",
        bandwidth: "Ilimitada",
        domains: 5,
        features: [
          { name: "cPanel", included: true },
          { name: "SSL Gratis", included: true },
          { name: "Backups Diarios", included: true },
          { name: "Correos ilimitados", included: true },
          { name: "Soporte 24/7", included: true },
          { name: "Optimización WordPress", included: true }
        ]
      },
      {
        name: "Plan Corporativo",
        price: 13990,
        storage: "100 GB SSD",
        bandwidth: "Ilimitada",
        domains: 10,
        features: [
          { name: "cPanel", included: true },
          { name: "SSL Gratis", included: true },
          { name: "Backups Diarios", included: true },
          { name: "Correos ilimitados", included: true },
          { name: "Soporte 24/7", included: true },
          { name: "Optimización WordPress", included: true },
          { name: "IP Dedicada", included: true },
          { name: "Servidor VIP", included: true }
        ]
      }
    ]
  },
  "hostingcl": {
    id: "hostingcl",
    name: "Hosting.cl",
    logo: "/logo-hostingcl.svg",
    description: "Hosting.cl es uno de los proveedores más antiguos de Chile, con más de 20 años de experiencia ofreciendo soluciones de alojamiento web y dominios para todo tipo de proyectos.",
    rating: 8.9,
    yearFounded: 2000,
    datacenterLocation: "Santiago, Chile",
    website: "https://www.hosting.cl/",
    contactInfo: {
      phone: "+56 2 2411 5800",
      email: "contacto@hosting.cl",
      address: "Av. Kennedy 5735, Oficina 706, Las Condes, Santiago",
      hours: "Lunes a Viernes: 9:00 - 18:30"
    },
    plans: [
      {
        name: "Plan Start",
        price: 3990,
        storage: "15 GB SSD",
        bandwidth: "Ilimitada",
        domains: 1,
        features: [
          { name: "Panel cPanel", included: true },
          { name: "SSL Gratis", included: true },
          { name: "Constructor de Sitios", included: true },
          { name: "Soporte técnico", included: true }
        ]
      },
      {
        name: "Plan Pro",
        price: 6990,
        storage: "40 GB SSD",
        bandwidth: "Ilimitada",
        domains: 5,
        features: [
          { name: "Panel cPanel", included: true },
          { name: "SSL Gratis", included: true },
          { name: "Constructor de Sitios", included: true },
          { name: "Soporte técnico", included: true },
          { name: "IP dedicada", included: true }
        ]
      },
      {
        name: "Plan Business",
        price: 12990,
        storage: "80 GB SSD",
        bandwidth: "Ilimitada",
        domains: 10,
        features: [
          { name: "Panel cPanel", included: true },
          { name: "SSL Gratis", included: true },
          { name: "Constructor de Sitios", included: true },
          { name: "Soporte técnico", included: true },
          { name: "IP dedicada", included: true },
          { name: "Servidor optimizado", included: true }
        ]
      }
    ]
  },
  "fullhosting": {
    id: "fullhosting",
    name: "FullHosting.cl",
    logo: "/logo-fullhosting.svg",
    description: "FullHosting ofrece soluciones de hosting y dominios enfocadas en la alta disponibilidad y rendimiento, con un equipo de soporte técnico especializado disponible 24/7.",
    rating: 8.7,
    yearFounded: 2009,
    datacenterLocation: "Santiago, Chile",
    website: "https://www.fullhosting.cl/",
    contactInfo: {
      phone: "+56 2 2979 8500",
      email: "soporte@fullhosting.cl",
      address: "Av. Vitacura 2939, Piso 10, Las Condes, Santiago",
      hours: "24/7"
    },
    plans: [
      {
        name: "Web Start",
        price: 2990,
        storage: "10 GB SSD",
        bandwidth: "Ilimitada",
        domains: 1,
        features: [
          { name: "cPanel Personalizado", included: true },
          { name: "SSL Gratis", included: true },
          { name: "50 cuentas de email", included: true },
          { name: "Soporte 24/7", included: true }
        ]
      },
      {
        name: "Web Plus",
        price: 5490,
        storage: "30 GB SSD",
        bandwidth: "Ilimitada",
        domains: 3,
        features: [
          { name: "cPanel Personalizado", included: true },
          { name: "SSL Gratis", included: true },
          { name: "100 cuentas de email", included: true },
          { name: "Soporte 24/7", included: true },
          { name: "Copia de seguridad diaria", included: true }
        ]
      },
      {
        name: "Web Pro",
        price: 9990,
        storage: "60 GB SSD",
        bandwidth: "Ilimitada",
        domains: 10,
        features: [
          { name: "cPanel Personalizado", included: true },
          { name: "SSL Gratis", included: true },
          { name: "Emails ilimitados", included: true },
          { name: "Soporte 24/7", included: true },
          { name: "Copia de seguridad diaria", included: true },
          { name: "IP Dedicada", included: true }
        ]
      }
    ]
  },
  "hosting24": {
    id: "hosting24",
    name: "Hosting24.cl",
    logo: "/logo-hosting24.svg",
    description: "Hosting24 se especializa en ofrecer soluciones de hosting de alta disponibilidad con soporte técnico 24/7 y garantía de uptime del 99.9%.",
    rating: 8.6,
    yearFounded: 2012,
    datacenterLocation: "Santiago, Chile",
    website: "https://www.hosting24.cl/",
    contactInfo: {
      phone: "+56 2 2656 8400",
      email: "info@hosting24.cl",
      address: "Av. Las Condes 9460, Oficina 804, Las Condes, Santiago",
      hours: "24/7"
    },
    plans: [
      {
        name: "Plan Inicio",
        price: 3490,
        storage: "15 GB SSD",
        bandwidth: "Ilimitada",
        domains: 1,
        features: [
          { name: "cPanel", included: true },
          { name: "SSL Gratis", included: true },
          { name: "50 cuentas de email", included: true },
          { name: "Soporte 24/7", included: true }
        ]
      },
      {
        name: "Plan Negocio",
        price: 5990,
        storage: "35 GB SSD",
        bandwidth: "Ilimitada",
        domains: 3,
        features: [
          { name: "cPanel", included: true },
          { name: "SSL Gratis", included: true },
          { name: "100 cuentas de email", included: true },
          { name: "Soporte 24/7", included: true },
          { name: "Backup diario", included: true }
        ]
      },
      {
        name: "Plan Empresa",
        price: 11990,
        storage: "75 GB SSD",
        bandwidth: "Ilimitada",
        domains: 10,
        features: [
          { name: "cPanel", included: true },
          { name: "SSL Gratis", included: true },
          { name: "Cuentas email ilimitadas", included: true },
          { name: "Soporte 24/7", included: true },
          { name: "Backup diario", included: true },
          { name: "IP Dedicada", included: true }
        ]
      }
    ]
  },
  "nethosting": {
    id: "nethosting",
    name: "NetHosting.cl",
    logo: "/logo-nethosting.svg",
    description: "NetHosting ofrece soluciones de alojamiento web para emprendedores y pequeñas empresas, con una excelente relación calidad-precio y atención personalizada.",
    rating: 8.2,
    yearFounded: 2011,
    datacenterLocation: "Santiago, Chile",
    website: "https://www.nethosting.cl/",
    contactInfo: {
      phone: "+56 2 2246 4200",
      email: "contacto@nethosting.cl",
      address: "San Antonio 385, Oficina 902, Santiago Centro",
      hours: "Lunes a Viernes: 9:30 - 18:00"
    },
    plans: [
      {
        name: "Plan Básico",
        price: 2490,
        storage: "10 GB SSD",
        bandwidth: "100 GB",
        domains: 1,
        features: [
          { name: "cPanel", included: true },
          { name: "SSL Gratis", included: true },
          { name: "10 cuentas email", included: true },
          { name: "Soporte por ticket", included: true }
        ]
      },
      {
        name: "Plan Estándar",
        price: 4990,
        storage: "25 GB SSD",
        bandwidth: "200 GB",
        domains: 3,
        features: [
          { name: "cPanel", included: true },
          { name: "SSL Gratis", included: true },
          { name: "30 cuentas email", included: true },
          { name: "Soporte por ticket y teléfono", included: true }
        ]
      },
      {
        name: "Plan Premium",
        price: 8990,
        storage: "50 GB SSD",
        bandwidth: "500 GB",
        domains: 5,
        features: [
          { name: "cPanel", included: true },
          { name: "SSL Gratis", included: true },
          { name: "100 cuentas email", included: true },
          { name: "Soporte por ticket y teléfono", included: true },
          { name: "Backup semanal", included: true }
        ]
      }
    ]
  },
  "webhosting": {
    id: "webhosting",
    name: "WebHosting.cl",
    logo: "/logo-webhosting.svg",
    description: "WebHosting.cl ofrece soluciones de hosting confiables con servidores optimizados para sitios WordPress, WooCommerce y aplicaciones web empresariales.",
    rating: 8.4,
    yearFounded: 2010,
    datacenterLocation: "Santiago, Chile",
    website: "https://www.webhosting.cl/",
    contactInfo: {
      phone: "+56 2 2712 5000",
      email: "ventas@webhosting.cl",
      address: "Av. Providencia 1760, Oficina 1201, Providencia, Santiago",
      hours: "Lunes a Viernes: 9:00 - 18:00"
    },
    plans: [
      {
        name: "Plan Personal",
        price: 3890,
        storage: "15 GB SSD",
        bandwidth: "Ilimitada",
        domains: 1,
        features: [
          { name: "cPanel", included: true },
          { name: "SSL Gratis", included: true },
          { name: "25 cuentas email", included: true },
          { name: "Soporte técnico", included: true }
        ]
      },
      {
        name: "Plan PyME",
        price: 6790,
        storage: "40 GB SSD",
        bandwidth: "Ilimitada",
        domains: 3,
        features: [
          { name: "cPanel", included: true },
          { name: "SSL Gratis", included: true },
          { name: "50 cuentas email", included: true },
          { name: "Soporte técnico", included: true },
          { name: "WordPress optimizado", included: true }
        ]
      },
      {
        name: "Plan Corporativo",
        price: 12490,
        storage: "80 GB SSD",
        bandwidth: "Ilimitada",
        domains: 10,
        features: [
          { name: "cPanel", included: true },
          { name: "SSL Gratis", included: true },
          { name: "Cuentas email ilimitadas", included: true },
          { name: "Soporte técnico", included: true },
          { name: "WordPress optimizado", included: true },
          { name: "IP Dedicada", included: true }
        ]
      }
    ]
  },
  "ziphosting": {
    id: "ziphosting",
    name: "ZipHosting.cl",
    logo: "/logo-ziphosting.svg",
    description: "ZipHosting ofrece planes de hosting optimizados para velocidad, con servidores SSD de alto rendimiento y planes flexibles para proyectos de todos los tamaños.",
    rating: 8.1,
    yearFounded: 2014,
    datacenterLocation: "Santiago, Chile",
    website: "https://www.ziphosting.cl/",
    contactInfo: {
      phone: "+56 2 2887 3600",
      email: "info@ziphosting.cl",
      address: "Nueva Costanera 3698, Oficina 503, Vitacura, Santiago",
      hours: "Lunes a Viernes: 9:00 - 18:00"
    },
    plans: [
      {
        name: "Plan Speed",
        price: 3190,
        storage: "10 GB SSD",
        bandwidth: "Ilimitada",
        domains: 1,
        features: [
          { name: "cPanel", included: true },
          { name: "SSL Gratis", included: true },
          { name: "15 cuentas email", included: true },
          { name: "Soporte por email", included: true }
        ]
      },
      {
        name: "Plan Turbo",
        price: 5990,
        storage: "30 GB SSD",
        bandwidth: "Ilimitada",
        domains: 3,
        features: [
          { name: "cPanel", included: true },
          { name: "SSL Gratis", included: true },
          { name: "40 cuentas email", included: true },
          { name: "Soporte por email y chat", included: true },
          { name: "Caché optimizada", included: true }
        ]
      },
      {
        name: "Plan Nitro",
        price: 10990,
        storage: "60 GB SSD",
        bandwidth: "Ilimitada",
        domains: 10,
        features: [
          { name: "cPanel", included: true },
          { name: "SSL Gratis", included: true },
          { name: "100 cuentas email", included: true },
          { name: "Soporte por email, chat y teléfono", included: true },
          { name: "Caché optimizada", included: true },
          { name: "Servidores de alta velocidad", included: true }
        ]
      }
    ]
  },
  "prohosting": {
    id: "prohosting",
    name: "ProHosting.cl",
    logo: "/logo-prohosting.svg",
    description: "ProHosting se especializa en hosting profesional para empresas y desarrolladores, con servidores optimizados para aplicaciones PHP, Node.js y otros lenguajes de programación.",
    rating: 8.7,
    yearFounded: 2013,
    datacenterLocation: "Santiago, Chile",
    website: "https://www.prohosting.cl/",
    contactInfo: {
      phone: "+56 2 2948 7100",
      email: "contacto@prohosting.cl",
      address: "Av. Nueva Tajamar 481, Oficina 701, Las Condes, Santiago",
      hours: "Lunes a Viernes: 9:00 - 19:00"
    },
    plans: [
      {
        name: "Plan Developer",
        price: 4490,
        storage: "20 GB SSD",
        bandwidth: "Ilimitada",
        domains: 1,
        features: [
          { name: "Panel Plesk", included: true },
          { name: "SSL Gratis", included: true },
          { name: "Git integrado", included: true },
          { name: "PHP, Node.js, Python", included: true },
          { name: "Soporte técnico", included: true }
        ]
      },
      {
        name: "Plan Business",
        price: 8990,
        storage: "50 GB SSD",
        bandwidth: "Ilimitada",
        domains: 5,
        features: [
          { name: "Panel Plesk", included: true },
          { name: "SSL Gratis", included: true },
          { name: "Git integrado", included: true },
          { name: "PHP, Node.js, Python", included: true },
          { name: "Soporte técnico", included: true },
          { name: "Redis y Memcached", included: true }
        ]
      },
      {
        name: "Plan Enterprise",
        price: 15990,
        storage: "100 GB SSD",
        bandwidth: "Ilimitada",
        domains: 10,
        features: [
          { name: "Panel Plesk", included: true },
          { name: "SSL Gratis", included: true },
          { name: "Git integrado", included: true },
          { name: "PHP, Node.js, Python", included: true },
          { name: "Soporte técnico", included: true },
          { name: "Redis y Memcached", included: true },
          { name: "IP Dedicada", included: true },
          { name: "Servidor optimizado", included: true }
        ]
      }
    ]
  },
  "smarthost": {
    id: "smarthost",
    name: "SmartHost.cl",
    logo: "/logo-smarthost.svg",
    description: "SmartHost ofrece soluciones de hosting inteligente con tecnología de autoscaling, ideal para sitios con tráfico variable y negocios de ecommerce.",
    rating: 8.3,
    yearFounded: 2015,
    datacenterLocation: "Santiago, Chile",
    website: "https://www.smarthost.cl/",
    contactInfo: {
      phone: "+56 2 2636 5200",
      email: "info@smarthost.cl",
      address: "Av. Vicuña Mackenna 4860, Oficina 402, La Florida, Santiago",
      hours: "Lunes a Viernes: 9:00 - 18:00"
    },
    plans: [
      {
        name: "Plan Smart Start",
        price: 3990,
        storage: "15 GB SSD",
        bandwidth: "Ilimitada",
        domains: 1,
        features: [
          { name: "Panel personalizado", included: true },
          { name: "SSL Gratis", included: true },
          { name: "Email profesional", included: true },
          { name: "Auto-scaling básico", included: true }
        ]
      },
      {
        name: "Plan Smart Business",
        price: 7490,
        storage: "40 GB SSD",
        bandwidth: "Ilimitada",
        domains: 5,
        features: [
          { name: "Panel personalizado", included: true },
          { name: "SSL Gratis", included: true },
          { name: "Email profesional", included: true },
          { name: "Auto-scaling avanzado", included: true },
          { name: "CDN incluida", included: true }
        ]
      },
      {
        name: "Plan Smart Enterprise",
        price: 13990,
        storage: "80 GB SSD",
        bandwidth: "Ilimitada",
        domains: 10,
        features: [
          { name: "Panel personalizado", included: true },
          { name: "SSL Gratis", included: true },
          { name: "Email profesional", included: true },
          { name: "Auto-scaling avanzado", included: true },
          { name: "CDN incluida", included: true },
          { name: "IP Dedicada", included: true },
          { name: "Balanceo de carga", included: true }
        ]
      }
    ]
  },
  "hostingchile": {
    id: "hostingchile",
    name: "HostingChile.cl",
    logo: "/logo-hostingchile.svg",
    description: "HostingChile ofrece servicios de alojamiento web confiable con servidores en Chile, ideal para sitios personales y pequeñas empresas que buscan una buena relación calidad-precio.",
    rating: 8.0,
    yearFounded: 2008,
    datacenterLocation: "Santiago, Chile",
    website: "https://www.hostingchile.cl/",
    contactInfo: {
      phone: "+56 2 2896 7400",
      email: "soporte@hostingchile.cl",
      address: "Av. Manquehue Sur 520, Oficina 205, Las Condes, Santiago",
      hours: "Lunes a Viernes: 9:00 - 18:00"
    },
    plans: [
      {
        name: "Plan Inicial",
        price: 2990,
        storage: "10 GB SSD",
        bandwidth: "100 GB",
        domains: 1,
        features: [
          { name: "cPanel", included: true },
          { name: "SSL Gratis", included: true },
          { name: "5 cuentas email", included: true },
          { name: "Soporte por tickets", included: true }
        ]
      },
      {
        name: "Plan Emprendedor",
        price: 4990,
        storage: "25 GB SSD",
        bandwidth: "250 GB",
        domains: 2,
        features: [
          { name: "cPanel", included: true },
          { name: "SSL Gratis", included: true },
          { name: "20 cuentas email", included: true },
          { name: "Soporte por tickets y email", included: true }
        ]
      },
      {
        name: "Plan Empresarial",
        price: 8990,
        storage: "50 GB SSD",
        bandwidth: "500 GB",
        domains: 5,
        features: [
          { name: "cPanel", included: true },
          { name: "SSL Gratis", included: true },
          { name: "50 cuentas email", included: true },
          { name: "Soporte por tickets, email y teléfono", included: true },
          { name: "Backup semanal", included: true }
        ]
      }
    ]
  },
  "fasthosting": {
    id: "fasthosting",
    name: "FastHosting.cl",
    logo: "/logo-fasthosting.svg",
    description: "FastHosting se especializa en hosting de alta velocidad con tecnología de caché avanzada y optimización para WordPress, ideal para sitios que necesitan un rendimiento superior.",
    rating: 8.6,
    yearFounded: 2014,
    datacenterLocation: "Santiago, Chile",
    website: "https://www.fasthosting.cl/",
    contactInfo: {
      phone: "+56 2 2736 9100",
      email: "ventas@fasthosting.cl",
      address: "Av. Andrés Bello 2711, Oficina 1403, Las Condes, Santiago",
      hours: "Lunes a Viernes: 9:00 - 18:30"
    },
    plans: [
      {
        name: "Plan Fast",
        price: 3990,
        storage: "15 GB NVMe",
        bandwidth: "Ilimitada",
        domains: 1,
        features: [
          { name: "LiteSpeed", included: true },
          { name: "SSL Gratis", included: true },
          { name: "Caché avanzada", included: true },
          { name: "WordPress optimizado", included: true }
        ]
      },
      {
        name: "Plan Faster",
        price: 6990,
        storage: "40 GB NVMe",
        bandwidth: "Ilimitada",
        domains: 3,
        features: [
          { name: "LiteSpeed", included: true },
          { name: "SSL Gratis", included: true },
          { name: "Caché avanzada", included: true },
          { name: "WordPress optimizado", included: true },
          { name: "CDN integrada", included: true }
        ]
      },
      {
        name: "Plan Fastest",
        price: 12990,
        storage: "80 GB NVMe",
        bandwidth: "Ilimitada",
        domains: 10,
        features: [
          { name: "LiteSpeed", included: true },
          { name: "SSL Gratis", included: true },
          { name: "Caché avanzada", included: true },
          { name: "WordPress optimizado", included: true },
          { name: "CDN integrada", included: true },
          { name: "IP Dedicada", included: true },
          { name: "Servidor premium", included: true }
        ]
      }
    ]
  },
  "cloudhosting": {
    id: "cloudhosting",
    name: "CloudHosting.cl",
    logo: "/logo-cloudhosting.svg",
    description: "CloudHosting ofrece soluciones de alojamiento web en la nube con alta disponibilidad y escalabilidad automática para sitios web y aplicaciones con requisitos de rendimiento exigentes.",
    rating: 8.8,
    yearFounded: 2016,
    datacenterLocation: "Santiago, Chile",
    website: "https://www.cloudhosting.cl/",
    contactInfo: {
      phone: "+56 2 2820 4300",
      email: "contacto@cloudhosting.cl",
      address: "Av. Apoquindo 5555, Oficina 1201, Las Condes, Santiago",
      hours: "Lunes a Viernes: 9:00 - 18:00"
    },
    plans: [
      {
        name: "Plan Cloud Start",
        price: 4990,
        storage: "20 GB SSD",
        bandwidth: "Ilimitada",
        domains: 1,
        features: [
          { name: "Infraestructura cloud", included: true },
          { name: "SSL Gratis", included: true },
          { name: "Auto-scaling", included: true },
          { name: "Alta disponibilidad", included: true }
        ]
      },
      {
        name: "Plan Cloud Pro",
        price: 8990,
        storage: "50 GB SSD",
        bandwidth: "Ilimitada",
        domains: 5,
        features: [
          { name: "Infraestructura cloud", included: true },
          { name: "SSL Gratis", included: true },
          { name: "Auto-scaling", included: true },
          { name: "Alta disponibilidad", included: true },
          { name: "CDN incluida", included: true },
          { name: "Backup diario", included: true }
        ]
      },
      {
        name: "Plan Cloud Business",
        price: 15990,
        storage: "100 GB SSD",
        bandwidth: "Ilimitada",
        domains: 10,
        features: [
          { name: "Infraestructura cloud", included: true },
          { name: "SSL Gratis", included: true },
          { name: "Auto-scaling", included: true },
          { name: "Alta disponibilidad", included: true },
          { name: "CDN incluida", included: true },
          { name: "Backup diario", included: true },
          { name: "IP Dedicada", included: true },
          { name: "Recursos dedicados", included: true }
        ]
      }
    ]
  },
  "besthosting": {
    id: "besthosting",
    name: "BestHosting.cl",
    logo: "/logo-besthosting.svg",
    description: "BestHosting ofrece soluciones de hosting premium con soporte técnico especializado y servidores de alto rendimiento para sitios web y aplicaciones exigentes.",
    rating: 8.7,
    yearFounded: 2013,
    datacenterLocation: "Santiago, Chile",
    website: "https://www.besthosting.cl/",
    contactInfo: {
      phone: "+56 2 2568 7200",
      email: "info@besthosting.cl",
      address: "Av. El Bosque Norte 0177, Oficina 801, Las Condes, Santiago",
      hours: "Lunes a Viernes: 9:00 - 18:00"
    },
    plans: [
      {
        name: "Plan Premium",
        price: 5990,
        storage: "25 GB SSD",
        bandwidth: "Ilimitada",
        domains: 1,
        features: [
          { name: "cPanel Premium", included: true },
          { name: "SSL Wildcard", included: true },
          { name: "Backups diarios", included: true },
          { name: "Soporte prioritario", included: true }
        ]
      },
      {
        name: "Plan Elite",
        price: 9990,
        storage: "60 GB SSD",
        bandwidth: "Ilimitada",
        domains: 5,
        features: [
          { name: "cPanel Premium", included: true },
          { name: "SSL Wildcard", included: true },
          { name: "Backups diarios", included: true },
          { name: "Soporte prioritario", included: true },
          { name: "Servidor optimizado", included: true },
          { name: "IP Dedicada", included: true }
        ]
      },
      {
        name: "Plan Ultimate",
        price: 17990,
        storage: "120 GB SSD",
        bandwidth: "Ilimitada",
        domains: 10,
        features: [
          { name: "cPanel Premium", included: true },
          { name: "SSL Wildcard", included: true },
          { name: "Backups diarios", included: true },
          { name: "Soporte prioritario", included: true },
          { name: "Servidor optimizado", included: true },
          { name: "IP Dedicada", included: true },
          { name: "Recursos garantizados", included: true },
          { name: "Asesoría técnica", included: true }
        ]
      }
    ]
  },
};

// This is a helper function to get a list of all hosting companies for catalog pages
export const getAllHostingCompanies = () => {
  return Object.values(hostingCompanies);
};

// This is a helper function to get a single hosting company by slug
export const getHostingCompanyBySlug = (slug: string) => {
  return hostingCompanies[slug] || null;
};

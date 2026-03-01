export interface RankingProvider {
  position: number;
  name: string;
  displayName: {
    first: string;
    second: string;
    firstColor: string;
    secondColor: string;
  };
  logo: string;
  rating: number;
  speedRating: number;
  priceRating: number;
  features: string[];
  specs: string[];
  url: string;
  isRecommended?: boolean;
  buttonColor: string;
  borderColor: string;
  badges: string[];
  ctaText: string;
  ctaMicroCopy: string;
  price: {
    current: number;
    original: number | null;
    period: string;
  };
}

export const rankingProviders: RankingProvider[] = [
  {
    position: 1,
    name: "HostingPlus.cl",
    displayName: { first: "Hosting", second: "Plus", firstColor: "text-[#2B2D42]", secondColor: "text-[#EF233C]" },
    logo: "/logo-hostingplus-official.png",
    rating: 9.9,
    speedRating: 9.8,
    priceRating: 9.5,
    features: [
      "Carga más rápida en Chile (servidores en Santiago)",
      "Tu sitio protegido 24/7 (bloqueo automático de ataques)",
      "Recupera tu web con un clic (backups automáticos)",
      "Email que llega sin ir a spam (SPF, DKIM y DMARC)"
    ],
    specs: [
      "LiteSpeed Enterprise",
      "BitNinja WAF",
      "IP Chile",
      "JetBackup"
    ],
    url: "https://www.hostingplus.cl/",
    isRecommended: true,
    buttonColor: "bg-gradient-to-r from-[#EF233C] to-[#c41e3a]",
    borderColor: "border-[#EF233C]",
    badges: ["Más Popular", "Hecho en Chile", "0 Reclamos"],
    ctaText: "Probar 30 días gratis",
    ctaMicroCopy: "✓ Sin tarjeta ✓ Cancela cuando quieras",
    price: {
      current: 3469,
      original: 19900,
      period: "mensual"
    }
  },
  {
    position: 2,
    name: "EcoHosting.cl",
    displayName: { first: "Eco", second: "Hosting", firstColor: "text-green-600", secondColor: "text-[#2B2D42]" },
    logo: "/logo-ecohosting.png",
    rating: 9.6,
    speedRating: 9.6,
    priceRating: 9.7,
    features: [
      "Servidores en Chile, energía 100% renovable",
      "MagicSpam y backups JetBackup incluidos",
      "Soporte local 24/7",
      "Dominio .CL gratis 1 año"
    ],
    specs: [
      "Apache Optimizado",
      "MagicSpam",
      "IP Chile",
      "JetBackup"
    ],
    url: "https://www.ecohosting.cl/",
    buttonColor: "bg-gradient-to-r from-green-600 to-green-700",
    borderColor: "border-green-200",
    badges: ["Eco-Friendly", "Mejor Precio"],
    ctaText: "Ver planes desde $1.658/mes",
    ctaMicroCopy: "✓ Dominio .CL gratis",
    price: {
      current: 1658,
      original: 4990,
      period: "mensual"
    }
  },
  {
    position: 3,
    name: "HostGator.cl",
    displayName: { first: "Host", second: "Gator", firstColor: "text-orange-500", secondColor: "text-[#2B2D42]" },
    logo: "/logo-hostgator.svg",
    rating: 9.2,
    speedRating: 8.9,
    priceRating: 9.4,
    features: [
      "12 años de experiencia en Chile",
      "Panel de control personalizado",
      "Soporte técnico por chat y teléfono",
      "Garantía de uptime 99.9%"
    ],
    specs: [
      "Apache Standard",
      "ModSecurity",
      "IP Chile",
      "Backups diarios"
    ],
    url: "https://www.hostgator.cl/",
    buttonColor: "bg-gradient-to-r from-orange-500 to-orange-600",
    borderColor: "border-orange-200",
    badges: ["Experiencia", "Confiable"],
    ctaText: "Migración gratis incluida",
    ctaMicroCopy: "✓ 99.9% uptime garantizado",
    price: {
      current: 3490,
      original: null,
      period: "mensual"
    }
  }
];

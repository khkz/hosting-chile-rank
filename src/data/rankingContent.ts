/** Contenido editorial estático de la página de ranking (testimonios y FAQ). */

export interface Testimonial {
  quote: string;
  author: string;
}

export const RANKING_TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Migré mi tienda desde GoDaddy y la velocidad mejoró un 300%. El soporte es increíblemente rápido y eficiente.',
    author: 'Carolina Pérez, Tienda Online',
  },
  {
    quote:
      'La diferencia de tener mi sitio en un servidor con IP chilena es notable. Mi posicionamiento en Google mejoró notablemente.',
    author: 'Sebastián Muñoz, Blog de Viajes',
  },
  {
    quote:
      'Llevo 3 años con ellos y nunca he tenido caídas. El panel de control es intuitivo y el soporte siempre responde en minutos.',
    author: 'Andrea Soto, Agencia Marketing',
  },
  {
    quote:
      'La migración fue gratuita y sin complicaciones. Me sorprendió lo fácil que fue el proceso completo.',
    author: 'Rodrigo Vega, Desarrollador',
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const RANKING_FAQ: FaqItem[] = [
  {
    question: '¿Cómo se elabora el ranking?',
    answer:
      'El orden sale de una fórmula sobre datos medidos: reputación (30%), uptime (25%), velocidad (20%), soporte (15%) y precio (10%). Cada ficha publica sus subpuntajes y marca como "sin medir" lo que todavía no tiene medición propia. El TTFB se mide desde us-east-1 (EE. UU.), no desde Chile.',
  },
  {
    question: '¿Qué ventaja tiene un hosting con IP chilena?',
    answer:
      'Un hosting con IP chilena ofrece menor latencia para visitantes locales, mejor posicionamiento SEO en búsquedas geográficas de Chile, y mayor protección legal al estar bajo jurisdicción chilena (Ley 19.628).',
  },
  {
    question: '¿Incluyen migración gratuita?',
    answer:
      'Depende del proveedor: cada ficha declara si la migración gratuita está confirmada, si no la ofrece o si el dato no está declarado.',
  },
  {
    question: '¿Cómo se calcula la nota de cada proveedor?',
    answer:
      'Con la fórmula publicada en /metodologia aplicada a los datos de la base (benchmark_results y hosting_companies). La ficha de cada proveedor muestra el detalle de los cinco subcriterios y qué porcentaje del peso total está efectivamente medido.',
  },
];

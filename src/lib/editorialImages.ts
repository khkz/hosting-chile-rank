/**
 * Imágenes editoriales del sitio (generadas con IA, ilustrativas).
 * Cada imagen vive en /img/editorial/<clave>-<ancho>.webp.
 * `available` pasa a true solo cuando los archivos existen en public/:
 * mientras sea false, <EditorialImage> muestra su respaldo (o nada).
 *
 * Reglas: nunca se usan como foto de «nuestro equipo» ni junto a testimonios
 * o nombres; son escenas ilustrativas. El pie del sitio lo declara.
 */

export type EditorialImageKey =
  | 'home-hero'
  | 'latam-hero'
  | 'cl-edition'
  | 'pe-edition'
  | 'mx-edition'
  | 'co-edition'
  | 'ar-edition'
  | 'datacenter'
  | 'soporte'
  | 'metodologia'
  | 'migracion'
  | 'comparar'
  | 'ecommerce'
  | 'wordpress'
  | 'vps'
  | 'guias'
  | 'sin-resultados';

export interface EditorialImageMeta {
  alt: string;
  /** Proporción del archivo original (ancho / alto). */
  ratio: number;
  /** Anchos disponibles en /img/editorial/<clave>-<ancho>.webp */
  widths: number[];
  /** object-position para recortes en móvil. */
  position?: string;
  available: boolean;
}

const W = [640, 1024, 1600];

export const EDITORIAL_IMAGES: Record<EditorialImageKey, EditorialImageMeta> = {
  'home-hero': {
    alt: 'Dueña de una panadería de barrio en Valparaíso revisa en su notebook el estado de su sitio web, junto al mostrador.',
    ratio: 16 / 9, widths: W, position: '60% 50%', available: false,
  },
  'latam-hero': {
    alt: 'Puertas de colores en una calle de casco antiguo latinoamericano, una de ellas entreabierta.',
    ratio: 16 / 9, widths: W, available: false,
  },
  'cl-edition': {
    alt: 'Mostrador de una ferretería de barrio en Santiago con un notebook abierto y la cordillera al fondo.',
    ratio: 16 / 9, widths: W, available: false,
  },
  'pe-edition': {
    alt: 'Café de barrio en Barranco, Lima, con la dueña ordenando tazas junto a un notebook.',
    ratio: 16 / 9, widths: W, available: false,
  },
  'mx-edition': {
    alt: 'Papelería en Coyoacán, Ciudad de México, con un notebook sobre el mesón de corte.',
    ratio: 16 / 9, widths: W, available: false,
  },
  'co-edition': {
    alt: 'Taller de un tostador de café en Bogotá: manos pesando granos junto a un notebook con gráficos.',
    ratio: 16 / 9, widths: W, available: false,
  },
  'ar-edition': {
    alt: 'Librería de barrio en Buenos Aires vista desde el mostrador, con un notebook abierto.',
    ratio: 16 / 9, widths: W, available: false,
  },
  datacenter: {
    alt: 'Pasillo de un datacenter con racks de servidores y un técnico revisando una tablet.',
    ratio: 16 / 9, widths: W, available: false,
  },
  soporte: {
    alt: 'Persona de soporte técnico con audífonos atendiendo una consulta en su escritorio.',
    ratio: 16 / 9, widths: W, available: false,
  },
  metodologia: {
    alt: 'Escritorio visto desde arriba con cuaderno de notas, cronómetro y un notebook con gráficos de líneas.',
    ratio: 16 / 9, widths: W, available: false,
  },
  migracion: {
    alt: 'Manos cargando una caja con un notebook y una planta hacia una oficina nueva.',
    ratio: 16 / 9, widths: W, available: false,
  },
  comparar: {
    alt: 'Dos notebooks lado a lado sobre una mesa de madera mostrando gráficos distintos.',
    ratio: 16 / 9, widths: W, available: false,
  },
  ecommerce: {
    alt: 'Manos empacando un pedido en una caja de cartón junto a un notebook con la tienda en línea.',
    ratio: 16 / 9, widths: W, available: false,
  },
  wordpress: {
    alt: 'Escritorio de una persona que escribe un blog, con borradores impresos y un notebook.',
    ratio: 16 / 9, widths: W, available: false,
  },
  vps: {
    alt: 'Escritorio de desarrollo con teclado mecánico y un monitor con líneas de código abstractas.',
    ratio: 16 / 9, widths: W, available: false,
  },
  guias: {
    alt: 'Mesa con libreta, café y notebook abierto, lista para estudiar opciones de hosting.',
    ratio: 16 / 9, widths: W, available: false,
  },
  'sin-resultados': {
    alt: 'Calle tranquila con luz de tarde y una puerta abierta.',
    ratio: 16 / 9, widths: W, available: false,
  },
};

export const editorialSrc = (key: EditorialImageKey, width: number) => `/img/editorial/${key}-${width}.webp`;

/** true si la imagen está publicada en public/img/editorial. */
export const isEditorialAvailable = (key: EditorialImageKey): boolean => Boolean(EDITORIAL_IMAGES[key]?.available);

/** true si al menos una imagen editorial está publicada (para la nota del pie). */
export const hasEditorialImages = (): boolean => Object.values(EDITORIAL_IMAGES).some((i) => i.available);

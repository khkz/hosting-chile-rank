/** Proveedor de la tabla del hub /comparativa (datos revisados a mano el 28-08-2026). */
export interface HubProvider {
  /** Id propio del hub: lo usan el JSON-LD ItemList y VERIFIED_PRICING. */
  id: string;
  /** Slug de la ficha en /catalogo/:slug (el hub usa ids propios: hostname es hn). */
  catalogSlug: string;
  name: string;
  logo: string;
  asn: string;
  /** Datacenter o modalidad, tal como se revisó. */
  datacenter: string;
  /** Ubicación del datacenter. */
  datacenterPlace: string;
  /** Lo que se anotó sobre respaldos, tal cual. */
  backups: string;
  /** Frecuencia de respaldo declarada, si el dato la dice; si no, null. */
  backupFreq: string | null;
  hasLiteSpeed: boolean;
  hasWAF: boolean;
  hasBackups: boolean;
  priceLabel: string;
  /** Anual neto en CLP; null si no hay precio comparable. */
  priceCLP: number | null;
  /** Solo para el JSON-LD ItemList; el enlace visible va a la ficha del catálogo. */
  reseñaUrl: string;
}

/** Categorías de reclamo (mismos valores que valida la función submit-complaint). */
export const CATEGORIES: { value: string; label: string }[] = [
  { value: 'service_quality', label: 'Calidad del servicio' },
  { value: 'support', label: 'Soporte técnico' },
  { value: 'billing', label: 'Facturación / cobros' },
  { value: 'downtime', label: 'Caídas / downtime' },
  { value: 'cancellation', label: 'Problemas de cancelación' },
  { value: 'misleading_advertising', label: 'Publicidad engañosa' },
  { value: 'other', label: 'Otro' },
];

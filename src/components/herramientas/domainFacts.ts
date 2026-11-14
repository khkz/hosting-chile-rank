/**
 * Ayudas de lectura para la ficha de dominio (/domain/*). No consultan nada:
 * solo interpretan lo que devolvió services/domainAnalysis.
 */
import type { DomainAnalysisResult, ProbeKey, ProbeStatus } from '@/services/domainAnalysis';
import { normalizeASN } from '@/services/asnApi';
import { countryName } from './dataTime';

/** Estado de una consulta. Si falta (dato antiguo), se asume que respondió. */
export function probeOf(data: DomainAnalysisResult, key: ProbeKey): ProbeStatus {
  return data.probes?.[key] ?? { answered: true, checked_at: null };
}

const UNKNOWN_VALUES = new Set([
  '',
  '-',
  '–',
  'no disponible',
  'no detectado',
  'desconocido',
  'asn no disponible',
  'ninguno',
  'no configurado',
]);

/** true si el valor es un dato real y no un texto de relleno («No detectado»). */
export function isKnown(value: string | null | undefined): value is string {
  return !!value && !UNKNOWN_VALUES.has(value.trim().toLowerCase());
}

export function hasValidNameservers(nameservers: string[] | undefined): boolean {
  return !!nameservers && nameservers.some((ns) => isKnown(ns));
}

/** «AS27651 (ENTEL CHILE S.A.)» → «/asn/AS27651». */
export function asnPath(basicAsn: string | undefined): string | null {
  const n = normalizeASN(basicAsn || '');
  return n ? `/asn/AS${n}` : null;
}

/** El titular es un nombre real (no «Información privada» ni vacío). */
export function hasRealOwner(owner: string | undefined): owner is string {
  return isKnown(owner) && !owner!.toLowerCase().includes('información privada');
}

/** «2010-05-12» o ISO → fecha; cualquier otro formato se muestra tal cual. */
export function isIsoLike(value: string | undefined): boolean {
  return !!value && /^\d{4}-\d{2}-\d{2}/.test(value.trim());
}

/** «Santiago, CL» → «Santiago, Chile». */
export function placeName(value: string): string {
  return value.replace(/, ([A-Z]{2})$/, (_m, code: string) => `, ${countryName(code)}`);
}

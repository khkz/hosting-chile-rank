import type { EvidenceRow } from '@/components/system/EvidenceCard';
import type { LatestBenchmarkRow } from '@/hooks/useProviderScore';
import { formatCorporateGroup } from '@/lib/formatGroup';
import { formatMs, formatPercent } from '@/lib/format';

/** Filas de medición propia (sonda en EE. UU.): con fecha, o «sin medir». */
export function benchmarkRows(bench: LatestBenchmarkRow | null | undefined): EvidenceRow[] {
  const date = bench?.measured_at ?? null;
  const ttfb = bench?.ttfb_median_ms;
  const uptime = bench?.uptime_30d_pct;
  return [
    ttfb != null && date
      ? { label: 'TTFB desde EE. UU.', value: formatMs(ttfb), kind: 'measured', date }
      : { label: 'TTFB desde EE. UU.', value: 'sin medir' },
    uptime != null && date
      ? { label: 'Uptime en 30 días', value: formatPercent(uptime, 2), kind: 'measured', date }
      : { label: 'Uptime en 30 días', value: 'sin medir' },
  ];
}

/** Datos que publica el proveedor: datacenter, año y grupo. Sin dato, lo dice. */
export function declaredRows(opts: {
  datacenter?: string | null;
  yearFounded?: number | null;
  corporateGroup?: string | null;
  date?: string | null;
}): EvidenceRow[] {
  const date = opts.date ?? null;
  const dc = opts.datacenter?.trim();
  const rows: EvidenceRow[] = [
    dc ? { label: 'Datacenter', value: dc, kind: 'declared', date } : { label: 'Datacenter', value: 'No lo declara' },
    opts.yearFounded
      ? { label: 'Opera desde', value: String(opts.yearFounded), kind: 'declared', date }
      : { label: 'Opera desde', value: 'No lo declara' },
  ];
  if (opts.corporateGroup) {
    rows.push({ label: 'Grupo', value: formatCorporateGroup(opts.corporateGroup), kind: 'declared', date });
  }
  return rows;
}

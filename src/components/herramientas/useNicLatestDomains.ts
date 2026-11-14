import { useCallback, useEffect, useState } from 'react';
import { formatInteger } from '@/lib/format';
import { formatToolDateTime } from './dataTime';

export interface NicDomain {
  d: string;
  date: string;
}

type Status = 'loading' | 'ready' | 'error';

/** Lee /data/latest.json: la lista pública de NIC Chile que guardamos cada hora. */
async function fetchLatest(): Promise<{ domains: NicDomain[]; updated: string | null }> {
  const response = await fetch('/data/latest.json', { headers: { 'Cache-Control': 'no-cache' } });
  if (!response.ok) throw new Error(`No se pudieron cargar los dominios: ${response.status}`);
  const data = await response.json();
  if (!Array.isArray(data?.domains) || data.domains.length === 0) throw new Error('Datos de dominios inválidos o vacíos');
  const domains = [...data.domains].sort((a: NicDomain, b: NicDomain) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return { domains, updated: typeof data.updated === 'string' ? data.updated : null };
}

/**
 * Últimos dominios .cl. Distingue «cargando», «listo» y «error» (sin lista de
 * relleno) y, al actualizar a mano, dice si la lectura cambió o no.
 */
export function useNicLatestDomains() {
  const [domains, setDomains] = useState<NicDomain[]>([]);
  const [updated, setUpdated] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [refreshing, setRefreshing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    setStatus('loading');
    setNotice(null);
    try {
      const r = await fetchLatest();
      setDomains(r.domains);
      setUpdated(r.updated);
      setStatus('ready');
    } catch (error) {
      console.error('Error loading domains:', error);
      setStatus('error');
    }
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setNotice(null);
    try {
      const r = await fetchLatest();
      if (r.updated && r.updated === updated) {
        setNotice(`Sin cambios desde la lectura del ${formatToolDateTime(updated)}.`);
      } else {
        setDomains(r.domains);
        setUpdated(r.updated);
        setStatus('ready');
        setNotice(`Se han cargado ${formatInteger(r.domains.length)} dominios de la lectura del ${formatToolDateTime(r.updated)}.`);
      }
    } catch (error) {
      console.error('Error refreshing domains:', error);
      setNotice('No pudimos leer la lista en este momento. Inténtalo de nuevo en unos minutos.');
    } finally {
      setRefreshing(false);
    }
  }, [updated]);

  useEffect(() => {
    load();
  }, [load]);

  return { domains, updated, status, refreshing, notice, refresh, retry: load };
}

import { useEffect, useState } from 'react';

export interface OpenDataMeta {
  status: 'loading' | 'ok' | 'missing';
  /** fecha_generacion del archivo (ISO). */
  date: string | null;
  /** total_proveedores del archivo, si lo trae. */
  total: number | null;
}

/**
 * Lee la fecha de generación y el total de cada archivo de datos abiertos,
 * después de pintar la página. Si un archivo no responde o no es JSON,
 * queda como «missing»: nunca se usa la hora de quien visita.
 */
export function useOpenDataMeta(paths: string[]): Record<string, OpenDataMeta> {
  const [meta, setMeta] = useState<Record<string, OpenDataMeta>>(() =>
    Object.fromEntries(paths.map((p) => [p, { status: 'loading', date: null, total: null }])),
  );

  useEffect(() => {
    let alive = true;
    paths.forEach(async (path) => {
      let next: OpenDataMeta = { status: 'missing', date: null, total: null };
      try {
        const res = await fetch(path);
        const type = res.headers.get('content-type') || '';
        if (res.ok && type.includes('json')) {
          const json = await res.json();
          next = {
            status: 'ok',
            date: typeof json?.fecha_generacion === 'string' ? json.fecha_generacion : null,
            total: typeof json?.total_proveedores === 'number' ? json.total_proveedores : null,
          };
        }
      } catch (error) {
        console.warn(`No se pudo leer ${path}:`, error);
      }
      if (alive) setMeta((m) => ({ ...m, [path]: next }));
    });
    return () => {
      alive = false;
    };
    // Las rutas son constantes de la página.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return meta;
}

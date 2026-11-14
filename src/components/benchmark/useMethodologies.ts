import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Todas las versiones publicadas de la metodología del benchmark, de la más
 * nueva a la más antigua. Un error queda en `isError` (no es «sin metodología»).
 * Pendiente: mover a src/hooks/useBenchmark.ts (sesión principal).
 */
export const useBenchmarkMethodologies = () =>
  useQuery({
    queryKey: ['benchmark-methodologies-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('benchmark_methodology')
        .select('*')
        .order('published_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

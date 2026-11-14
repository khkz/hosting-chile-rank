import React from 'react';
import { CalendarCheck, MessageSquareWarning } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getLastUpdatedText } from '@/utils/dateHelpers';

interface TrustSignalBadgeProps {
  companyId?: string;
  className?: string;
}

/**
 * Señales reales del proveedor, en tinta (el verde y el ámbar son solo de procedencia):
 *  - Mes de la última verificación de los datos (centralizada).
 *  - Reclamos verificados del registro público, solo si hay alguno. Si la consulta
 *    falla no se muestra nada: un error de lectura no es un cero.
 */
const TrustSignalBadge: React.FC<TrustSignalBadgeProps> = ({ companyId, className = '' }) => {
  const { data: complaints } = useQuery({
    queryKey: ['trust-complaints', companyId],
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { count, error } = await supabase
        .from('public_complaints_public')
        .select('id', { count: 'exact', head: true })
        .eq('company_id', companyId!)
        .in('status', ['verified', 'resolved']);
      if (error || count == null) throw error ?? new Error('sin conteo');
      return count;
    },
  });

  return (
    <span className={`inline-flex flex-wrap items-center gap-x-4 gap-y-1 ${className}`}>
      <span className="inline-flex items-center gap-1.5">
        <CalendarCheck className="h-4 w-4 text-ink-3" aria-hidden />
        {getLastUpdatedText()}
      </span>
      {typeof complaints === 'number' && complaints > 0 && (
        <Link
          to="/reclamos"
          className="inline-flex items-center gap-1.5 font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
        >
          <MessageSquareWarning className="h-4 w-4 text-ink-2" aria-hidden />
          {complaints} {complaints === 1 ? 'reclamo verificado' : 'reclamos verificados'}
        </Link>
      )}
    </span>
  );
};

export default TrustSignalBadge;

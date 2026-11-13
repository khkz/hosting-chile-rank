import React from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getLastUpdatedText } from '@/utils/dateHelpers';

interface TrustSignalBadgeProps {
  companyId?: string;
  className?: string;
}

/**
 * Reemplaza el badge de escasez ficticia por señales reales:
 *  - Fecha de última verificación (mes/año, centralizada).
 *  - Reclamos verificados (count real desde public_complaints_public).
 */
const TrustSignalBadge: React.FC<TrustSignalBadgeProps> = ({ companyId, className = '' }) => {
  const { data: complaints } = useQuery({
    queryKey: ['trust-complaints', companyId],
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { count } = await supabase
        .from('public_complaints_public')
        .select('id', { count: 'exact', head: true })
        .eq('company_id', companyId!)
        .in('status', ['verified', 'resolved']);
      return count ?? 0;
    },
  });

  return (
    <span className={`inline-flex flex-wrap items-center gap-x-3 gap-y-1 ${className}`}>
      <span className="inline-flex items-center gap-1">
        <ShieldCheck className="h-3.5 w-3.5 text-ok" aria-hidden />
        {getLastUpdatedText()}
      </span>
      {typeof complaints === 'number' && complaints > 0 && (
        <Link
          to="/reclamos"
          className="inline-flex items-center gap-1 text-signal-declared underline-offset-4 hover:underline"
          aria-label={`${complaints} reclamos verificados`}
        >
          <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
          {complaints} {complaints === 1 ? 'reclamo verificado' : 'reclamos verificados'}
        </Link>
      )}
    </span>
  );
};

export default TrustSignalBadge;

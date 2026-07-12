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
    <div className={`inline-flex items-center gap-2 flex-wrap justify-center ${className}`}>
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
        <ShieldCheck className="w-3 h-3" aria-hidden />
        {getLastUpdatedText()}
      </span>
      {typeof complaints === 'number' && complaints > 0 && (
        <Link
          to="/reclamos"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium hover:bg-amber-100 transition-colors"
          aria-label={`${complaints} reclamos verificados`}
        >
          <AlertTriangle className="w-3 h-3" aria-hidden />
          {complaints} {complaints === 1 ? 'reclamo verificado' : 'reclamos verificados'}
        </Link>
      )}
    </div>
  );
};

export default TrustSignalBadge;

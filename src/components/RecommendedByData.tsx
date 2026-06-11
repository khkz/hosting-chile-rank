import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const RecommendedByData: React.FC<{ className?: string }> = ({ className = '' }) => (
  <aside
    className={`rounded-xl border-2 border-[#EF233C]/30 bg-gradient-to-br from-[#EF233C]/5 to-white p-5 md:p-6 ${className}`}
    aria-label="Recomendado por datos"
  >
    <div className="flex items-start gap-3">
      <ShieldCheck className="h-6 w-6 text-[#EF233C] flex-shrink-0 mt-0.5" aria-hidden />
      <div className="text-sm md:text-base">
        <strong className="block text-[#2B2D42] mb-1">Recomendado por datos:</strong>
        <p className="text-gray-700">
          <Link to="/catalogo/hostingplus" className="font-semibold text-[#EF233C] hover:underline">HostingPlus.cl</Link>
          <span className="text-gray-500"> 9.9/10</span>
          <span className="mx-2 text-gray-400">·</span>
          <Link to="/catalogo/ecohosting" className="font-semibold text-[#EF233C] hover:underline">EcoHosting.cl</Link>
          <span className="text-gray-500"> 9.6/10</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Basado en mediciones verificables (ASN, benchmark, reputación pública). Sin patrocinios.
        </p>
      </div>
    </div>
  </aside>
);

export default RecommendedByData;

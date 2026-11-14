import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Scale, Award, ChevronRight } from 'lucide-react';

interface CompanyPresenceProps {
  companySlug: string;
  companyName: string;
  rankingPosition?: number;
  hasCertifications?: boolean;
  inComparison?: boolean;
}

/** Enlaces a las otras secciones donde aparece el proveedor. Va al final de la ficha. */
const CompanyPresence: React.FC<CompanyPresenceProps> = ({
  companyName,
  rankingPosition,
  hasCertifications,
  inComparison,
}) => {
  const sections: Array<{ icon: typeof Trophy; label: string; description: string; href: string }> = [];

  if (rankingPosition) {
    sections.push({ icon: Trophy, label: 'Ver el ranking', description: `Puesto ${rankingPosition}`, href: '/ranking' });
  }
  if (inComparison) {
    sections.push({ icon: Scale, label: 'Ver en la comparativa', description: 'Compara sus características con otros proveedores', href: '/comparativa' });
  }
  if (hasCertifications) {
    sections.push({ icon: Award, label: 'Ver certificaciones', description: 'Sellos que otorga EligeTuHosting', href: '/certificaciones' });
  }

  if (sections.length === 0) return null;

  return (
    <div>
      <h3 className="t-h3 text-ink">{companyName} en otras secciones</h3>
      <ul className="mt-3 divide-y divide-rule border-y border-rule">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <li key={section.href}>
              <Link to={section.href} className="group flex min-h-[44px] items-center gap-3 py-3 text-ink">
                <Icon className="h-5 w-5 shrink-0 text-ink-2" aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold underline-offset-4 group-hover:underline">{section.label}</span>
                  <span className="block t-small text-ink-2">{section.description}</span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-ink-3" aria-hidden />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CompanyPresence;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Scale, Award, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Navegación secundaria entre secciones del ranking. Ya no se usa en
 * /certificaciones (el menú de tarjetas se retiró); queda con el estilo del
 * sistema por si otra página la necesita: enlaces en fila, sin tarjetas ni
 * degradados, y la sección activa marcada con una regla en tinta.
 */
const sections = [
  { path: '/ranking', label: 'Ranking', icon: Trophy },
  { path: '/comparativa', label: 'Comparativa', icon: Scale },
  { path: '/certificaciones', label: 'Certificaciones', icon: Award },
  { path: '/catalogo', label: 'Catálogo completo', icon: Building2 },
];

const HostingSectionsNav: React.FC = () => {
  const location = useLocation();

  return (
    <nav aria-label="Secciones del ranking" className="border-b border-rule bg-white">
      <ul className="container flex gap-6 overflow-x-auto">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = location.pathname.startsWith(section.path);
          return (
            <li key={section.path} className="shrink-0">
              <Link
                to={section.path}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex min-h-[48px] items-center gap-2 border-b-2 text-sm font-semibold transition-colors',
                  isActive ? 'border-ink text-ink' : 'border-transparent text-ink-2 hover:text-ink',
                )}
              >
                <Icon className="h-4 w-4 text-ink-3" aria-hidden />
                {section.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default HostingSectionsNav;

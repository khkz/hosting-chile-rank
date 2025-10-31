import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Scale, Award, Building2 } from 'lucide-react';

const HostingSectionsNav: React.FC = () => {
  const location = useLocation();
  
  const sections = [
    {
      path: '/ranking',
      label: 'Ranking',
      icon: Trophy,
      description: 'Top hosting evaluados'
    },
    {
      path: '/comparativa',
      label: 'Comparativa',
      icon: Scale,
      description: 'Compara características'
    },
    {
      path: '/certificaciones',
      label: 'Certificaciones',
      icon: Award,
      description: 'Empresas certificadas'
    },
    {
      path: '/catalogo',
      label: 'Catálogo Completo',
      icon: Building2,
      description: 'Todas las empresas'
    }
  ];
  
  return (
    <nav className="bg-gradient-to-r from-primary/5 to-primary/10 border-y border-border/50 mb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 py-4">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = location.pathname.startsWith(section.path);
            
            return (
              <Link
                key={section.path}
                to={section.path}
                className={`
                  flex flex-col items-center justify-center p-4 rounded-lg
                  transition-all duration-200 group
                  ${isActive 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'bg-card hover:bg-accent hover:shadow-sm'
                  }
                `}
              >
                <Icon className={`w-6 h-6 mb-2 ${isActive ? '' : 'text-primary'}`} />
                <span className="font-semibold text-sm text-center">{section.label}</span>
                <span className={`text-xs text-center mt-1 ${isActive ? 'opacity-90' : 'text-muted-foreground'}`}>
                  {section.description}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default HostingSectionsNav;

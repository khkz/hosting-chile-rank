import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Trophy, Scale, Award, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CompanyPresenceProps {
  companySlug: string;
  companyName: string;
  rankingPosition?: number;
  hasCertifications?: boolean;
  inComparison?: boolean;
}

const CompanyPresence: React.FC<CompanyPresenceProps> = ({
  companySlug,
  companyName,
  rankingPosition,
  hasCertifications,
  inComparison
}) => {
  const sections = [];
  
  if (rankingPosition) {
    sections.push({
      icon: Trophy,
      label: 'Ver en Ranking',
      description: `Posición #${rankingPosition}`,
      href: '/ranking',
      color: 'text-yellow-600'
    });
  }
  
  if (inComparison) {
    sections.push({
      icon: Scale,
      label: 'Ver en Comparativa',
      description: 'Comparar características',
      href: '/comparativa',
      color: 'text-blue-600'
    });
  }
  
  if (hasCertifications) {
    sections.push({
      icon: Award,
      label: 'Ver Certificaciones',
      description: 'Sellos de calidad',
      href: '/certificaciones',
      color: 'text-green-600'
    });
  }
  
  if (sections.length === 0) return null;
  
  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <ExternalLink className="w-5 h-5 text-primary" />
        {companyName} en otras secciones
      </h3>
      <div className="grid md:grid-cols-3 gap-4">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <Button
              key={index}
              asChild
              variant="outline"
              className="h-auto flex-col items-start p-4 hover:bg-primary/10 hover:border-primary/40 transition-all"
            >
              <Link to={section.href}>
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${section.color}`} />
                  <span className="font-semibold">{section.label}</span>
                </div>
                <span className="text-sm text-muted-foreground">{section.description}</span>
              </Link>
            </Button>
          );
        })}
      </div>
    </Card>
  );
};

export default CompanyPresence;

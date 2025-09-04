import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { WikiTerm, wikiCategories } from '@/data/wiki/terms';
import { buildHostingPlusURL, trackCTAClick } from '@/utils/cta';

interface TermCardProps {
  term: WikiTerm;
  variant?: 'default' | 'compact';
}

const TermCard: React.FC<TermCardProps> = ({ term, variant = 'default' }) => {
  const category = wikiCategories.find(c => c.id === term.category);
  
  const handleCTAClick = (type: 'primary' | 'secondary' = 'primary') => {
    trackCTAClick(term.slug, type);
  };

  const ctaUrl = buildHostingPlusURL(term.cta.url, {
    content: term.slug,
    term: term.title.toLowerCase()
  });

  if (variant === 'compact') {
    return (
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <Link 
                to={`/wiki/${term.slug}`}
                className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2"
              >
                {term.title}
              </Link>
              <div className="flex items-center gap-1 flex-shrink-0">
                {category && (
                  <span className="text-xs opacity-60">{category.icon}</span>
                )}
                <Badge variant="outline" className="text-xs capitalize">
                  {term.level}
                </Badge>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2">
              {term.shortDefinition}
            </p>
            
            <div className="flex items-center justify-between gap-2">
              <Badge variant="secondary" className="text-xs capitalize">
                {term.cms}
              </Badge>
              <Link 
                to={`/wiki/${term.slug}`}
                className="text-xs text-primary hover:text-primary/80 inline-flex items-center gap-1"
              >
                Ver más <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 flex-1">
            <Link 
              to={`/wiki/${term.slug}`}
              className="font-bold text-xl text-foreground hover:text-primary transition-colors"
            >
              {term.title}
            </Link>
            <div className="flex items-center gap-2">
              {category && (
                <Badge variant="outline" className="text-xs">
                  {category.icon} {category.name}
                </Badge>
              )}
              <Badge variant="secondary" className="text-xs capitalize">
                {term.cms}
              </Badge>
              <Badge 
                variant={term.level === 'basico' ? 'default' : term.level === 'medio' ? 'secondary' : 'destructive'} 
                className="text-xs capitalize"
              >
                {term.level}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          {term.shortDefinition}
        </p>

        {term.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {term.tags.slice(0, 4).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {term.tags.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{term.tags.length - 4}
              </Badge>
            )}
          </div>
        )}

        {/* CTA Block - Recomendado HostingPlus */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="font-semibold text-sm text-primary">
                Recomendado: HostingPlus
              </span>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-foreground/90">
                {term.cta.copy}
              </p>
              
              {term.proofPoints.length > 0 && (
                <ul className="text-xs text-muted-foreground space-y-1">
                  {term.proofPoints.slice(0, 3).map((point, idx) => (
                    <li key={idx} className="flex items-center gap-1">
                      <span className="w-1 h-1 bg-primary rounded-full flex-shrink-0"></span>
                      {point}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="flex-1"
                onClick={() => {
                  handleCTAClick('primary');
                  window.open(ctaUrl, '_blank');
                }}
              >
                Contratar {term.cta.plan}
                <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  handleCTAClick('secondary');
                  window.open(buildHostingPlusURL('https://clientes.hostingplus.cl/submitticket.php?step=2&deptid=4', { content: `${term.slug}-secondary` }), '_blank');
                }}
              >
                Cotizar
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-muted-foreground">
            {term.hostingRequirements && term.hostingRequirements.length > 0 && (
              <span>
                Requiere: {term.hostingRequirements.slice(0, 2).join(', ')}
                {term.hostingRequirements.length > 2 && '...'}
              </span>
            )}
          </div>
          <Link 
            to={`/wiki/${term.slug}`}
            className="text-sm text-primary hover:text-primary/80 inline-flex items-center gap-1"
          >
            Leer más <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default TermCard;
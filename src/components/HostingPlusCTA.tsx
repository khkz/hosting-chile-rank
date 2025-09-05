import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { buildHostingPlusURL, trackCTAClick } from '@/utils/cta';

interface HostingPlusCTAProps {
  termSlug: string;
  termTitle: string;
  plan: string;
  copy: string;
  url: string;
  proofPoints: string[];
  className?: string;
  variant?: 'default' | 'compact';
}

const HostingPlusCTA: React.FC<HostingPlusCTAProps> = ({
  termSlug,
  termTitle,
  plan,
  copy,
  url,
  proofPoints,
  className = '',
  variant = 'default'
}) => {
  const handleCTAClick = (type: 'primary' | 'secondary' = 'primary') => {
    trackCTAClick(termSlug, type);
  };

  const primaryUrl = buildHostingPlusURL(url, {
    content: termSlug,
    term: termTitle.toLowerCase()
  });

  const secondaryUrl = buildHostingPlusURL(
    'https://clientes.hostingplus.cl/submitticket.php?step=2&deptid=4',
    { content: `${termSlug}-secondary` }
  );

  if (variant === 'compact') {
    return (
      <Card className={`bg-primary/5 border-primary/20 ${className}`}>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="font-semibold text-sm text-primary">
                Recomendado: HostingPlus
              </span>
            </div>
            
            <p className="text-sm text-foreground/90">{copy}</p>
            
            {proofPoints.length > 0 && (
              <ul className="text-xs text-muted-foreground space-y-1">
                {proofPoints.slice(0, 3).map((point, idx) => (
                  <li key={idx} className="flex items-center gap-1">
                    <span className="w-1 h-1 bg-primary rounded-full flex-shrink-0"></span>
                    {point}
                  </li>
                ))}
              </ul>
            )}

            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="flex-1"
                onClick={() => {
                  handleCTAClick('primary');
                  window.open(primaryUrl, '_blank');
                }}
              >
                Contratar {plan}
                <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  handleCTAClick('secondary');
                  window.open(secondaryUrl, '_blank');
                }}
              >
                Cotizar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-primary/5 border-primary/20 ${className}`}>
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-4">
              ⭐ Recomendado: HostingPlus
            </div>
            <h3 className="text-2xl font-bold mb-2">
              Hosting Optimizado para {termTitle}
            </h3>
            <p className="text-lg text-muted-foreground">{copy}</p>
          </div>

          {proofPoints.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {proofPoints.map((point, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">{point}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              size="lg"
              onClick={() => {
                handleCTAClick('primary');
                window.open(primaryUrl, '_blank');
              }}
            >
              Contratar {plan}
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => {
                handleCTAClick('secondary');
                window.open(secondaryUrl, '_blank');
              }}
            >
              Cotizar mi proyecto
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            ⭐ 4.8/5 en Google Reviews • +10,000 clientes • Soporte 24/7
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HostingPlusCTA;
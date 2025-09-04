import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Star, Shield, Zap } from 'lucide-react';
import { buildHostingPlusURL, trackCTAClick } from '@/utils/cta';

interface RightRailOfferProps {
  termSlug?: string;
  compact?: boolean;
}

const RightRailOffer: React.FC<RightRailOfferProps> = ({ 
  termSlug = 'wiki-sidebar', 
  compact = false 
}) => {
  const handleCTAClick = (type: 'primary' | 'secondary' = 'primary') => {
    trackCTAClick(termSlug, type);
  };

  const primaryUrl = buildHostingPlusURL(
    'https://clientes.hostingplus.cl/cart.php?a=add&pid=3',
    { content: `${termSlug}-sidebar`, term: 'wordpress-turbo' }
  );

  const secondaryUrl = buildHostingPlusURL(
    'https://clientes.hostingplus.cl/cotiza-hosting',
    { content: `${termSlug}-sidebar`, term: 'cotizacion' }
  );

  if (compact) {
    return (
      <Card className="sticky top-6">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="text-center">
              <Badge variant="default" className="mb-2">
                #1 Hosting Chile
              </Badge>
              <h3 className="font-bold text-lg">WordPress Turbo</h3>
              <p className="text-primary font-bold text-xl">$4.990/mes</p>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>LiteSpeed + HTTP/3</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span>JetBackup + WAF</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-blue-500" />
                <span>Staging automático</span>
              </div>
            </div>

            <Button 
              className="w-full"
              onClick={() => {
                handleCTAClick('primary');
                window.open(primaryUrl, '_blank');
              }}
            >
              Contratar ahora
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Oferta principal */}
      <Card className="sticky top-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader className="text-center pb-3">
          <Badge variant="default" className="self-center mb-2">
            #1 Ranking Hosting Chile 2025
          </Badge>
          <CardTitle className="text-xl">¿Necesitas hosting rápido?</CardTitle>
          <div className="text-3xl font-bold text-primary">WordPress Turbo</div>
          <div className="text-lg text-muted-foreground">desde $4.990/mes</div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Zap className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <div className="font-semibold text-sm">LiteSpeed Enterprise</div>
                <div className="text-xs text-muted-foreground">HTTP/3 + QUIC nativo</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="font-semibold text-sm">Seguridad Premium</div>
                <div className="text-xs text-muted-foreground">WAF + JetBackup cada 4h</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Star className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold text-sm">Staging Automático</div>
                <div className="text-xs text-muted-foreground">Prueba sin riesgos</div>
              </div>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <Button 
              className="w-full"
              onClick={() => {
                handleCTAClick('primary');
                window.open(primaryUrl, '_blank');
              }}
            >
              Contratar WordPress Turbo
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                handleCTAClick('secondary');
                window.open(secondaryUrl, '_blank');
              }}
            >
              Cotizar mi proyecto
            </Button>
          </div>

          <div className="text-center pt-2">
            <div className="text-xs text-muted-foreground">
              ⭐ 4.8/5 en Google Reviews • +10,000 clientes
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testimonial o proof adicional */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <blockquote className="text-sm italic">
              "Migré de otro hosting y la diferencia de velocidad es brutal. LiteSpeed realmente funciona."
            </blockquote>
            <div className="text-xs text-muted-foreground">
              - Cliente WordPress Turbo
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RightRailOffer;
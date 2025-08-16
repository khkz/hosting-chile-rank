import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Globe, ExternalLink } from 'lucide-react';
import { getReverseIpData, classifyDomain } from '@/services/reverseIpService';

interface ReverseIpLookupProps {
  prefix: string;
}

interface ReverseIpResult {
  domain: string;
  ip: string;
  type?: string;
}

export function ReverseIpLookup({ prefix }: ReverseIpLookupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [domains, setDomains] = useState<ReverseIpResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleToggle = async () => {
    if (!isOpen && !loaded) {
      setLoading(true);
      try {
        const result = await getReverseIpData(prefix);
        if (result) {
          setDomains(result.domains);
        }
        setLoaded(true);
      } catch (error) {
        console.error('Error loading reverse IP data:', error);
      } finally {
        setLoading(false);
      }
    }
    setIsOpen(!isOpen);
  };

  // Don't show for large prefixes
  const [, mask] = prefix.split('/');
  const maskNum = parseInt(mask);
  if (maskNum < 24) {
    return null;
  }

  return (
    <Collapsible open={isOpen} onOpenChange={handleToggle}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="p-1 h-auto text-xs text-muted-foreground hover:text-foreground"
        >
          <Globe className="h-3 w-3 mr-1" />
          {loading ? 'Cargando...' : 'Ver sitios'}
          {isOpen ? <ChevronDown className="h-3 w-3 ml-1" /> : <ChevronRight className="h-3 w-3 ml-1" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        {loading ? (
          <div className="text-xs text-muted-foreground">Buscando sitios web en este rango...</div>
        ) : domains.length > 0 ? (
          <Card className="border-l-4 border-l-primary/20">
            <CardContent className="p-3">
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  {domains.length} sitio{domains.length !== 1 ? 's' : ''} encontrado{domains.length !== 1 ? 's' : ''}
                </div>
                {domains.slice(0, 10).map((domain, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <a
                        href={`/whois/${domain.domain}`}
                        className="text-primary hover:underline truncate"
                        title={domain.domain}
                      >
                        {domain.domain}
                      </a>
                      <Badge variant="secondary" className="text-xs px-1 py-0 h-5 shrink-0">
                        {classifyDomain(domain.domain)}
                      </Badge>
                    </div>
                    <a
                      href={`https://${domain.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground ml-2 shrink-0"
                      title="Visitar sitio"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                ))}
                {domains.length > 10 && (
                  <div className="text-xs text-muted-foreground text-center pt-2 border-t">
                    +{domains.length - 10} sitios más
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-xs text-muted-foreground space-y-1">
            <div>No se encontraron sitios web en este rango de IPs</div>
            <div className="text-xs opacity-75">
              Es posible que estas IPs no tengan sitios web activos o sean utilizadas para otros servicios de red.
            </div>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
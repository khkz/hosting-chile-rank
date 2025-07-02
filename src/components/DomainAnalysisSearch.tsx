import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const DomainAnalysisSearch = () => {
  const [domainInput, setDomainInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Simple domain validation
  const validateDomain = (domain: string): boolean => {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
    return domainRegex.test(domain.trim());
  };

  const handleAnalyzeDomain = () => {
    const trimmedDomain = domainInput.trim().toLowerCase();
    
    if (!trimmedDomain) {
      setError('Por favor ingresa un dominio');
      return;
    }

    if (!validateDomain(trimmedDomain)) {
      setError('Por favor ingresa un dominio válido (ej: ejemplo.cl)');
      return;
    }

    setError(null);
    // Convert domain to slug format for URL (replace dots with hyphens)
    const domainSlug = trimmedDomain.replace(/\./g, '-');
    navigate(`/domain/${domainSlug}/`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyzeDomain();
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Search className="h-5 w-5" />
          Analizar cualquier dominio
        </CardTitle>
        <p className="text-gray-600 text-sm">
          Ingresa cualquier dominio .cl para obtener información completa: WHOIS, DNS, SSL y más
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Ingresa un dominio (ej: ejemplo.cl)"
              value={domainInput}
              onChange={(e) => {
                setDomainInput(e.target.value);
                setError(null);
              }}
              onKeyPress={handleKeyPress}
              className={error ? 'border-red-500' : ''}
            />
          </div>
          <Button 
            onClick={handleAnalyzeDomain}
            className="px-6 bg-[#2B2D42] text-white hover:bg-[#2B2D42]/90"
          >
            <Search className="h-4 w-4 mr-2" />
            Analizar
          </Button>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="mt-3 text-xs text-gray-500">
          Ejemplos: google.cl, mercadolibre.cl, github.cl
        </div>
      </CardContent>
    </Card>
  );
};

export default DomainAnalysisSearch;

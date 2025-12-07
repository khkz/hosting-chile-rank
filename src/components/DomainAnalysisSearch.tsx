import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, AlertCircle, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const DomainAnalysisSearch = () => {
  const [domainInput, setDomainInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
    const domainSlug = trimmedDomain.replace(/\./g, '-');
    navigate(`/domain/${domainSlug}/`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyzeDomain();
    }
  };

  const exampleDomains = ['google.cl', 'mercadolibre.cl', 'falabella.cl'];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 text-white">
          <Search className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Analizar cualquier dominio</h2>
          <p className="text-sm text-slate-500">Obtén información WHOIS, DNS, SSL y más</p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Ingresa un dominio (ej: ejemplo.cl)"
            value={domainInput}
            onChange={(e) => {
              setDomainInput(e.target.value);
              setError(null);
            }}
            onKeyPress={handleKeyPress}
            className={`h-12 text-base bg-slate-50 border-slate-200 focus:bg-white transition-colors ${error ? 'border-red-300 focus:border-red-500' : ''}`}
          />
        </div>
        <Button 
          onClick={handleAnalyzeDomain}
          size="lg"
          className="h-12 px-6 bg-slate-900 hover:bg-slate-800 text-white font-medium"
        >
          Analizar
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mt-3">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <span className="text-xs text-slate-400">Ejemplos:</span>
        {exampleDomains.map((domain) => (
          <button
            key={domain}
            onClick={() => {
              setDomainInput(domain);
              setError(null);
            }}
            className="text-xs px-2 py-1 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            {domain}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DomainAnalysisSearch;

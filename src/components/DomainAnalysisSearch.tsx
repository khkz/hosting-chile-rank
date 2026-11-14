import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const EXAMPLES = ['google.cl', 'mercadolibre.cl', 'falabella.cl'];

/** Formulario «Analizar cualquier dominio»: lleva a la ficha /domain/{slug}/. */
const DomainAnalysisSearch = () => {
  const [domainInput, setDomainInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const validateDomain = (domain: string): boolean =>
    /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/.test(domain.trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedDomain = domainInput.trim().toLowerCase();
    if (!trimmedDomain) {
      setError('Escribe un dominio, por ejemplo ejemplo.cl.');
      return;
    }
    if (!validateDomain(trimmedDomain)) {
      setError('Ese dominio no parece válido: escríbelo sin https:// ni barras, por ejemplo ejemplo.cl.');
      return;
    }
    setError(null);
    navigate(`/domain/${trimmedDomain.replace(/\./g, '-')}/`);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-2xl">
      <label htmlFor="analizar-dominio" className="t-label">
        Dominio
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <Input
          id="analizar-dominio"
          type="text"
          inputMode="url"
          autoComplete="off"
          spellCheck={false}
          placeholder="ejemplo.cl"
          value={domainInput}
          aria-invalid={!!error}
          aria-describedby={error ? 'analizar-dominio-error' : undefined}
          onChange={(e) => {
            setDomainInput(e.target.value);
            setError(null);
          }}
          className="sm:flex-1"
        />
        <Button type="submit" variant="default">
          Analizar
          <ArrowRight aria-hidden />
        </Button>
      </div>
      {error && (
        <p id="analizar-dominio-error" role="alert" className="t-small mt-2 flex items-start gap-2 text-ink">
          <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-ink-2" />
          {error}
        </p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="t-meta">Prueba con:</span>
        {EXAMPLES.map((domain) => (
          <Button
            key={domain}
            type="button"
            variant="outline"
            size="sm"
            className="h-11 sm:h-9"
            onClick={() => {
              setDomainInput(domain);
              setError(null);
            }}
          >
            {domain}
          </Button>
        ))}
      </div>
    </form>
  );
};

export default DomainAnalysisSearch;

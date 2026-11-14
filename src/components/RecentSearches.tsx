import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * Últimos dominios .cl de la lista pública de NIC Chile (archivo /data/latest.json).
 * Si el archivo no responde, no se muestra nada: nunca una lista inventada.
 */
const RecentSearches = () => {
  const [domains, setDomains] = useState<string[]>([]);

  useEffect(() => {
    let alive = true;
    const loadDomains = async () => {
      try {
        const response = await fetch('/data/latest.json', { headers: { 'Cache-Control': 'no-cache' } });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data?.domains)) throw new Error('Formato inesperado');
        const latest = [...data.domains]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 10)
          .map((item) => item.d as string);
        if (alive) setDomains(latest);
      } catch (error) {
        console.error('Error loading domains:', error);
      }
    };
    loadDomains();
    return () => {
      alive = false;
    };
  }, []);

  if (domains.length === 0) return null;

  return (
    <section aria-labelledby="recien-inscritos-titulo" className="rounded-xl border border-rule bg-white p-5">
      <h2 id="recien-inscritos-titulo" className="t-h3 text-ink">
        Dominios .cl recién inscritos
      </h2>
      <p className="t-meta mt-1">De la lista pública de NIC Chile.</p>
      <ul className="mt-3 divide-y divide-rule border-y border-rule">
        {domains.map((domain) => (
          <li key={domain}>
            <Link
              to={`/domain/${domain.replace(/\./g, '-')}/`}
              className="t-small flex min-h-11 items-center break-all py-2 text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink"
            >
              {domain}
            </Link>
          </li>
        ))}
      </ul>
      <Link
        to="/ultimos-dominios/"
        className="t-small mt-3 inline-flex min-h-11 items-center gap-1 font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
      >
        Ver los últimos dominios
        <ArrowRight aria-hidden className="h-3.5 w-3.5" />
      </Link>
    </section>
  );
};

export default RecentSearches;

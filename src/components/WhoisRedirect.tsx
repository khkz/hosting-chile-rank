
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const WhoisRedirect = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      // Normalizar: el formato canónico interno usa guiones, no puntos.
      const normalized = slug.replace(/\./g, '-').toLowerCase();
      navigate(`/domain/${normalized}/`, { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }, [slug, navigate]);

  // Mostrar un mensaje mientras se hace la redirección
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <p className="t-small flex items-center gap-2 text-ink-2" role="status">
        <Loader2 aria-hidden className="h-5 w-5 animate-spin text-ink-3" />
        Abriendo la ficha del dominio…
      </p>
    </div>
  );
};

export default WhoisRedirect;

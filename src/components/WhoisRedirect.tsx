
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirigiendo...</p>
      </div>
    </div>
  );
};

export default WhoisRedirect;

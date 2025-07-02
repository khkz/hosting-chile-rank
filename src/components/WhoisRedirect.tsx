
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const WhoisRedirect = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      // Redirigir de /whois/:slug a /domain/:slug/
      navigate(`/domain/${slug}/`, { replace: true });
    } else {
      // Si no hay slug, redirigir a la página principal
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


import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';

const Sitemap = () => {
  const [xmlContent, setXmlContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchSitemap = async () => {
      try {
        const response = await fetch('/sitemap.xml');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const content = await response.text();
        setXmlContent(content);
      } catch (err) {
        setError('Error loading sitemap: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchSitemap();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando sitemap...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Sitemap | EligeTuHosting.cl</title>
        <meta name="description" content="Sitemap completo de Elige tu Hosting con todas las páginas y URLs disponibles." />
        <meta name="robots" content="index, follow" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Sitemap - Elige tu Hosting
            </h1>
            
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Nota:</strong> Este sitemap contiene todas las URLs disponibles en nuestro sitio. 
                Para uso programático, accede directamente a{' '}
                <a 
                  href="/sitemap.xml" 
                  className="underline hover:text-blue-600"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  /sitemap.xml
                </a>
              </p>
            </div>

            <div className="bg-gray-100 rounded-lg p-4 overflow-auto">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
                {xmlContent}
              </pre>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>
                Sitemap generado automáticamente • Última actualización: {new Date().toLocaleDateString('es-CL')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sitemap;


import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Check, RefreshCw, Globe, AlertTriangle, CloudOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Helmet } from 'react-helmet';
import RecentSearches from '@/components/RecentSearches';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import WhoisTabs from '@/components/WhoisTabs';
import { analyzeDomain, loadCachedAnalysis, type DomainAnalysisResult } from '@/services/domainAnalysis';

// Function to capitalize the first letter of a string
const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const WhoisDomain = () => {
  const { slug } = useParams<{ slug: string }>();
  const [domainData, setDomainData] = useState<DomainAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [previewLoaded, setPreviewLoaded] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const [usingLiveData, setUsingLiveData] = useState(false);
  const { toast } = useToast();

  // Format domain name from slug
  const domainName = slug ? slug.replace(/-/g, '.') : '';
  const capitalizedDomainName = capitalizeFirstLetter(domainName);

  // Generate structured data for Schema.org
  const generateSchemaData = () => {
    if (!domainData) return null;
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": `${capitalizedDomainName} - Análisis completo de dominio`,
      "description": `Análisis técnico completo de ${domainName}: DNS, WHOIS, SSL, rendimiento, tecnología y más información para optimizar tu presencia en línea.`,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://eligetuhosting.cl/whois/${slug}/`
      },
      "author": {
        "@type": "Organization",
        "name": "eligetuhosting.cl"
      },
      "publisher": {
        "@type": "Organization",
        "name": "eligetuhosting.cl",
        "logo": {
          "@type": "ImageObject",
          "url": "https://eligetuhosting.cl/logo.png"
        }
      },
      "datePublished": new Date().toISOString(),
      "dateModified": new Date().toISOString(),
      "about": {
        "@type": "WebSite",
        "name": domainName,
        "url": `https://${domainName}`
      },
      "technicalSpecifications": {
        "ip": domainData.basic.ip,
        "nameservers": domainData.basic.nameservers.join(", "),
        "provider": domainData.basic.provider,
        "location": domainData.basic.ip_chile ? "Chile" : "Internacional",
        "ssl": domainData.ssl.ssl_enabled ? "Habilitado" : "Deshabilitado"
      }
    };
    return JSON.stringify(schemaData);
  };

  // Function to perform comprehensive domain analysis
  const performAnalysis = async (domain: string, forceRefresh = false) => {
    setRefreshing(forceRefresh);
    setPreviewLoaded(false);
    setPreviewError(false);
    
    try {
      let analysisResult: DomainAnalysisResult | null = null;

      // Try to load cached data first unless forcing refresh
      if (!forceRefresh) {
        analysisResult = await loadCachedAnalysis(domain);
        if (analysisResult) {
          console.log('Using cached analysis data');
          setDomainData(analysisResult);
          setUsingLiveData(false);
          setIsLoading(false);
          return;
        }
      }

      // Perform live analysis
      console.log('Performing live domain analysis');
      analysisResult = await analyzeDomain(domain);
      setDomainData(analysisResult);
      setUsingLiveData(true);

      toast({
        title: "Análisis completado",
        description: "Se ha realizado un análisis completo del dominio.",
        variant: "default"
      });

    } catch (error) {
      console.error('Error performing domain analysis:', error);
      setError('No se pudo completar el análisis del dominio');
      toast({
        title: "Error en el análisis",
        description: "No se pudo obtener información completa para este dominio.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!slug) {
      setError('No se encontró información para este dominio');
      setIsLoading(false);
      return;
    }

    performAnalysis(domainName);
  }, [slug, domainName]);

  // Add page-specific SEO metadata
  React.useEffect(() => {
    if (domainName) {
      document.title = `${capitalizedDomainName} - Análisis completo de dominio — eligetuhosting.cl`;

      // Create meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', `Análisis completo de ${domainName}: DNS, WHOIS, SSL, rendimiento, tecnología y más información para optimizar tu presencia en línea.`);
    }
  }, [domainName, capitalizedDomainName]);

  // Prepare breadcrumbs for this page
  const breadcrumbItems = [
    {
      label: 'Dominios',
      href: '/ultimos-dominios/'
    },
    {
      label: capitalizedDomainName
    }
  ];

  const handleRefresh = () => {
    if (domainName) {
      performAnalysis(domainName, true);
    }
  };

  const handleImageLoad = () => {
    setPreviewLoaded(true);
  };

  const handleImageError = () => {
    setPreviewError(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] font-montserrat text-[#333]">
      <Helmet>
        <title>{capitalizedDomainName} - Análisis completo de dominio — eligetuhosting.cl</title>
        <meta name="description" content={`Análisis técnico completo de ${domainName}: DNS, WHOIS, SSL, rendimiento, tecnología y más información para optimizar tu presencia en línea.`} />
        <meta property="og:title" content={`${capitalizedDomainName} - Análisis completo de dominio — eligetuhosting.cl`} />
        <meta property="og:description" content={`Análisis técnico completo de ${domainName}. Descubre DNS, WHOIS, SSL, rendimiento y tecnología.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://eligetuhosting.cl/whois/${slug}/`} />
        <link rel="canonical" href={`https://eligetuhosting.cl/whois/${slug}/`} />
        {domainData && <script type="application/ld+json">{generateSchemaData()}</script>}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${capitalizedDomainName} - Análisis completo de dominio — eligetuhosting.cl`} />
        <meta name="twitter:description" content={`Análisis técnico completo de ${domainName}. Descubre DNS, WHOIS, SSL, rendimiento y tecnología.`} />
        <meta name="robots" content="index, follow" />
        <meta property="article:modified_time" content={new Date().toISOString()} />
      </Helmet>
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        {/* Breadcrumbs */}
        {!isLoading && !error && domainData && <SEOBreadcrumbs items={breadcrumbItems} />}
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div className="space-y-4">
                <Skeleton className="h-40 w-full" />
              </div>
              <Skeleton className="h-60 w-full" />
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
            <p>{error}</p>
            <p className="mt-4">
              Puedes buscar información sobre este dominio utilizando nuestro buscador en la{' '}
              <Link to="/" className="text-blue-600 underline">
                página principal
              </Link>.
            </p>
          </div>
        ) : domainData ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">
                {capitalizedDomainName} <span className="text-blue-700">- Análisis completo</span>
              </h1>
              
              <Button 
                onClick={handleRefresh} 
                variant="outline" 
                disabled={refreshing} 
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Analizando...' : 'Actualizar análisis'}
              </Button>
            </div>
            
            {usingLiveData && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <Check className="inline-block h-4 w-4 mr-1 mb-1" />
                  Análisis en vivo completado. Esta información fue obtenida en tiempo real.
                </p>
              </div>
            )}
            
            {/* New warning for non-Chilean IPs */}
            {domainData.basic.ip && !domainData.basic.ip_chile && (
              <Alert variant="destructive" className="mb-6 bg-red-50 border-red-200">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <AlertTitle className="text-red-700">Alojamiento fuera de Chile</AlertTitle>
                <AlertDescription className="text-red-700">
                  Este sitio web tiene una IP extranjera, lo que puede representar riesgos para la soberanía de 
                  datos chilenos, afectar velocidad de carga en Chile y podría estar sujeto a leyes de privacidad 
                  diferentes. Se recomienda alojar contenido chileno en servidores locales.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="grid lg:grid-cols-3 gap-8 mt-8">
              {/* Main analysis tabs */}
              <div className="lg:col-span-2">
                <WhoisTabs data={domainData} isLoading={refreshing} />
              </div>
              
              {/* Sidebar with preview and recommendations */}
              <div className="space-y-6">
                {/* Website preview */}
                <Card className="border overflow-hidden shadow-md bg-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Globe className="h-5 w-5 text-blue-700" />
                      Vista previa del sitio
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-[200px] relative overflow-hidden bg-gray-100">
                      {!previewLoaded && !previewError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                          <div className="text-center">
                            <RefreshCw className="h-8 w-8 mx-auto animate-spin text-gray-400" />
                            <p className="mt-2 text-sm text-gray-500">Cargando vista previa...</p>
                          </div>
                        </div>
                      )}
                      
                      {previewError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                          <div className="text-center">
                            <p className="text-sm text-gray-500">No se pudo cargar la vista previa</p>
                          </div>
                        </div>
                      )}
                      
                      <img 
                        src={`https://image.thum.io/get/width/400/png/${domainName}`}
                        alt={`Vista previa de ${domainName}`} 
                        className={`w-full h-full object-cover transition-opacity duration-300 ${previewLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                      />
                    </div>
                    <div className="p-3 bg-white border-t">
                      <a 
                        href={`https://${domainName}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        <Globe className="h-3 w-3 mr-1" />
                        Visitar sitio
                      </a>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent searches */}
                <RecentSearches />
              </div>
            </div>
            
            {/* Recommendation section */}
            <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Recomendación de hosting</h2>
              <p className="mb-4">
                Para obtener el mejor rendimiento y soporte en Chile, te recomendamos:
              </p>
              <div className="flex items-center gap-4 border p-4 rounded-lg hover:border-blue-200 transition-all">
                <img 
                  alt="HostingPlus.cl" 
                  className="h-12" 
                  src="/lovable-uploads/4b9ad72f-ec68-4414-8b9f-5debe4d14d9f.png" 
                />
                <div className="flex-1">
                  <p className="font-medium text-lg">HostingPlus.cl - Nº1 en Chile</p>
                  <p className="text-sm text-gray-600">IP chilena, soporte 24/7 y LiteSpeed Enterprise</p>
                  <ul className="mt-2 text-sm space-y-1">
                    <li className="flex items-center gap-1">
                      <Check className="h-4 w-4 text-green-500" /> Mejor velocidad en sitios chilenos
                    </li>
                    <li className="flex items-center gap-1">
                      <Check className="h-4 w-4 text-green-500" /> Soporte técnico local 24/7
                    </li>
                    <li className="flex items-center gap-1">
                      <Check className="h-4 w-4 text-green-500" /> Migración gratuita
                    </li>
                  </ul>
                </div>
                <Button asChild className="bg-[#EF233C] hover:bg-[#b3001b] text-white px-6">
                  <a href="https://www.hostingplus.cl/" target="_blank" rel="noopener noreferrer">
                    Contratar
                  </a>
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </main>
      
      <Footer />
    </div>
  );
};

export default WhoisDomain;

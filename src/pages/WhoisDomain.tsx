import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Check, RefreshCw, Globe, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Helmet } from 'react-helmet';
import RecentSearches from '@/components/RecentSearches';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import WhoisTabs from '@/components/WhoisTabs';
import { useWhoisSSR, detectSSRData } from '@/hooks/useWhoisSSR';
import { hasValidIP } from '@/lib/utils';

// Function to capitalize the first letter of a string
const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const WhoisDomain = () => {
  const { slug } = useParams<{ slug: string }>();
  const [previewLoaded, setPreviewLoaded] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const { toast } = useToast();

  // Format domain name from slug - handle both formats
  const domainName = slug ? (
    slug.includes('.') ? slug : slug.replace(/-/g, '.')
  ) : '';
  
  const capitalizedDomainName = capitalizeFirstLetter(domainName);

  // Use the new SSR hook instead of the old domain analysis
  const { data: whoisData, isLoading, error, refetch, isFetching } = useWhoisSSR(domainName);

  // Detect SSR data on initial load
  const [ssrData, setSSRData] = useState<any>(null);
  
  useEffect(() => {
    const detectedSSR = detectSSRData();
    if (detectedSSR) {
      setSSRData(detectedSSR);
      console.log('🎯 SSR data detected and will be used for hydration');
    }
  }, []);

  // Convert WHOIS data to the expected domain analysis format for compatibility
  const domainData = whoisData ? {
    basic: {
      domain: domainName,
      ip: '–',
      ip_chile: false,
      provider: 'Desconocido',
      asn: 'No disponible',
      nameservers: []
    },
    dns: {
      a_records: [],
      aaaa_records: [],
      mx_records: [],
      txt_records: [],
      cname_records: [],
      ns_records: []
    },
    whois: {
      registrar: whoisData.registrar,
      created_date: whoisData.created_date,
      expires_date: whoisData.expires_date,
      status: whoisData.status,
      owner_name: whoisData.owner_name,
      organization: whoisData.organization,
      email: 'Información privada',
      dnssec_status: whoisData.dnssec_status
    },
    ssl: {
      ssl_enabled: false,
      ssl_issuer: 'Desconocido',
      ssl_expires_date: '',
      ssl_grade: 'Desconocido',
      https_redirect: false,
      security_headers: {}
    },
    performance: {
      load_time_ms: 0,
      page_size_kb: 0,
      pagespeed_score: 0,
      first_contentful_paint_ms: 0,
      largest_contentful_paint_ms: 0,
      cumulative_layout_shift: 0
    },
    tech_stack: {
      server_software: 'Desconocido',
      cms_detected: 'Desconocido',
      framework_detected: 'Desconocido',
      cdn_provider: 'Ninguno',
      analytics_tools: [],
      programming_language: 'Desconocido',
      database_type: 'Desconocido',
      hosting_provider: 'Desconocido',
      country_location: 'Desconocido'
    }
  } : null;

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
      console.log('🔄 Manual refresh triggered for SSR data');
      refetch();
      toast({
        title: "Actualizando datos",
        description: "Obteniendo información fresca del dominio...",
        variant: "default"
      });
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
        <meta property="og:url" content={`https://eligetuhosting.cl/domain/${slug}/`} />
        <link rel="canonical" href={`https://eligetuhosting.cl/domain/${slug}/`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${capitalizedDomainName} - Análisis completo de dominio — eligetuhosting.cl`} />
        <meta name="twitter:description" content={`Análisis técnico completo de ${domainName}. Descubre DNS, WHOIS, SSL, rendimiento y tecnología.`} />
        <meta name="robots" content="index, follow" />
        <meta property="article:modified_time" content={new Date().toISOString()} />
      </Helmet>
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        {!isLoading && !error && domainData && <SEOBreadcrumbs items={breadcrumbItems} />}
        
        {isLoading && !ssrData ? (
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
            <p>No se pudo obtener información del dominio</p>
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
                disabled={isFetching} 
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
                {isFetching ? 'Actualizando...' : 'Actualizar análisis'}
              </Button>
            </div>
            
            {/* SSR indicator */}
            {ssrData && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <Check className="inline-block h-4 w-4 mr-1 mb-1" />
                  Página cargada con renderizado server-side para mejor SEO.
                </p>
              </div>
            )}
            
            <div className="grid lg:grid-cols-3 gap-8 mt-8">
              {/* Main analysis tabs */}
              <div className="lg:col-span-2">
                <WhoisTabs data={domainData} isLoading={isFetching} />
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

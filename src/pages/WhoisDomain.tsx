import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Check, RefreshCw, Globe, Server, AlertTriangle, CloudOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Helmet } from 'react-helmet';
import RecentSearches from '@/components/RecentSearches';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { isChileanIP, isChileanASN } from '@/utils/ipDetection';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';

// Fallback domain data for when the actual data file doesn't exist
const getFallbackData = (domainName: string) => {
  return {
    ip: '200.27.162.162',
    ip_chile: true,
    provider: 'HostingPlus',
    asn: 'AS61512',
    nameservers: ['ns1.hostingplus.cl', 'ns2.hostingplus.cl'],
    screenshot: '/placeholder.svg'
  };
};

// Function to lookup ASN information
const lookupASN = async (ip: string): Promise<string> => {
  try {
    // Try to fetch ASN data from IPAPI
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();
    if (data && data.asn) {
      return `${data.asn} (${data.org || 'Desconocido'})`;
    }

    // Fallback if IPAPI doesn't return ASN
    return 'Consultando...';
  } catch (error) {
    console.error('Error fetching ASN information:', error);
    return 'No disponible';
  }
};

const WhoisDomain = () => {
  const {
    slug
  } = useParams<{
    slug: string;
  }>();
  const [domainData, setDomainData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [usingLiveData, setUsingLiveData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [previewLoaded, setPreviewLoaded] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const {
    toast
  } = useToast();

  // Format domain name from slug
  const domainName = slug ? slug.replace(/-/g, '.') : '';

  // Generate structured data for Schema.org
  const generateSchemaData = () => {
    if (!domainData) return null;
    
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": `Información de hosting para ${domainName}`,
      "description": `Análisis técnico de ${domainName}: IP, nameservers, proveedor de hosting, ASN y más información para mejorar tu presencia en línea.`,
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
        "ip": domainData.ip,
        "nameservers": domainData.nameservers?.join(", "),
        "provider": domainData.provider,
        "location": domainData.ip_chile ? "Chile" : "Internacional"
      }
    };
    
    return JSON.stringify(schemaData);
  };

  // Function to fetch live DNS data
  const fetchLiveDomainData = async (domain: string) => {
    setRefreshing(true);
    setPreviewLoaded(false);
    setPreviewError(false);
    try {
      // Fetch A record (IP address)
      const aRes = await fetch(`https://dns.google/resolve?name=${domain}&type=A`).then(r => r.json());
      const ip = aRes.Answer ? aRes.Answer[0].data : '–';

      // Fetch nameservers
      const nsRes = await fetch(`https://dns.google/resolve?name=${domain}&type=NS`).then(r => r.json());
      const nameservers = nsRes.Answer ? nsRes.Answer.map((x: any) => x.data) : [];

      // Use our enhanced Chilean IP detection
      const ip_chile = isChileanIP(ip);

      // Try to determine provider from nameservers (improved)
      let provider = 'Desconocido';
      if (nameservers.some((ns: string) => ns.includes('hostingplus'))) {
        provider = 'HostingPlus';
      } else if (nameservers.some((ns: string) => ns.includes('ecohosting'))) {
        provider = 'Ecohosting';
      } else if (nameservers.some((ns: string) => ns.includes('netlify'))) {
        provider = 'Netlify';
      } else if (nameservers.some((ns: string) => ns.includes('cloudflare'))) {
        provider = 'Cloudflare';
      } else if (nameservers.some((ns: string) => ns.includes('awsdns'))) {
        provider = 'Amazon AWS';
      } else if (nameservers.some((ns: string) => ns.includes('google'))) {
        provider = 'Google Cloud';
      } else if (nameservers.some((ns: string) => ns.includes('azure'))) {
        provider = 'Microsoft Azure';
      }

      // Initialize data with what we have
      const liveData = {
        ip,
        ip_chile,
        provider,
        asn: 'Consultando...',
        nameservers,
        screenshot: `/placeholder.svg`
      };
      setDomainData(liveData);
      setUsingLiveData(true);
      setUsingFallback(false);

      // Try to get ASN information
      lookupASN(ip).then(asnInfo => {
        // Update data with ASN info and double-check if it's Chilean using ASN
        const isChileanByASN = isChileanASN(asnInfo);
        setDomainData(prevData => ({
          ...prevData,
          asn: asnInfo,
          // If IP detection didn't identify as Chilean but ASN does, update the flag
          ip_chile: prevData.ip_chile || isChileanByASN
        }));
      });

      // Try to get a screenshot
      try {
        // Use multiple screenshot services for redundancy
        const screenshotServices = [`https://image.thum.io/get/width/600/png/${domain}`, `https://s.wordpress.com/mshots/v1/${encodeURIComponent(`https://${domain}`)}?w=600`, `https://api.urlbox.io/v1/screenshot?url=${domain}&width=600&format=png`];

        // Try the first service
        fetch(screenshotServices[0], {
          method: 'HEAD'
        }).then(response => {
          if (response.ok) {
            setDomainData(prevData => ({
              ...prevData,
              screenshot: screenshotServices[0]
            }));
            setPreviewLoaded(true);
          } else {
            // If first service fails, try second service
            console.log('First screenshot service failed, trying second service');
            setDomainData(prevData => ({
              ...prevData,
              screenshot: screenshotServices[1]
            }));
          }
        }).catch(err => {
          console.error('Error with first screenshot service:', err);
          setDomainData(prevData => ({
            ...prevData,
            screenshot: screenshotServices[1]
          }));
        });
      } catch (err) {
        console.error('Error fetching screenshot:', err);
        setPreviewError(true);
      }
      toast({
        title: "Datos en vivo",
        description: "Mostrando información actual del dominio.",
        variant: "default"
      });

      // Try calling the Supabase function to save this search for future reference
      try {
        const res = await fetch('https://oegvwjxrlmtwortyhsrv.functions.supabase.co/save-search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            domain,
            ip,
            ns: nameservers,
            provider,
            asn: '-'
          })
        });
        if (res.ok) {
          console.log('Domain data saved successfully');
        }
      } catch (error) {
        console.error('Error saving domain data:', error);
      }
    } catch (error) {
      console.error('Error fetching live domain data:', error);
      toast({
        title: "Error al obtener datos en vivo",
        description: "No pudimos obtener información actualizada para este dominio.",
        variant: "destructive"
      });
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!slug) {
      setError('No se encontró información para este dominio');
      setIsLoading(false);
      return;
    }

    // First try to load static data file
    fetch(`/content/domains/${slug}.json`).then(response => {
      if (!response.ok) {
        throw new Error('No se encontró información para este dominio');
      }

      // Check if the response is HTML (common error case)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error('El archivo de datos no existe o no está en formato JSON');
      }
      return response.json();
    }).then(data => {
      setDomainData(data);
      setIsLoading(false);
    }).catch(error => {
      console.error('Error loading domain data:', error);

      // If static file loading fails, try to fetch live data
      fetchLiveDomainData(domainName).catch(liveError => {
        console.error('Error fetching live data:', liveError);

        // If both static and live data fail, use fallback
        setDomainData(getFallbackData(domainName));
        setUsingFallback(true);
        toast({
          title: "Usando datos de ejemplo",
          description: "Se están mostrando datos estimados para este dominio.",
          variant: "default"
        });
      }).finally(() => {
        setIsLoading(false);
      });
    });
  }, [slug, toast, domainName]);

  // Add page-specific SEO metadata
  React.useEffect(() => {
    if (domainName) {
      document.title = `Información de hosting para ${domainName} — eligetuhosting.cl`;

      // Create meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', `Datos de hosting para ${domainName}: IP, nameservers, proveedor, ASN y más información para mejorar tu presencia en línea.`);
    }
  }, [domainName]);

  // Prepare breadcrumbs for this page
  const breadcrumbItems = [
    { label: 'Dominios', href: '/ultimos-dominios/' },
    { label: domainName }
  ];

  const handleRefresh = () => {
    if (domainName) {
      fetchLiveDomainData(domainName);
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
        <title>Información de hosting para {domainName} — eligetuhosting.cl</title>
        <meta name="description" content={`Análisis técnico de ${domainName}: IP, nameservers, proveedor de hosting, ASN y más información para mejorar tu presencia en línea.`} />
        <meta property="og:title" content={`Datos de hosting: ${domainName} — eligetuhosting.cl`} />
        <meta property="og:description" content={`Análisis técnico completo de ${domainName}. Descubre su proveedor de hosting, IP, nameservers y más.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://eligetuhosting.cl/whois/${slug}/`} />
        <link rel="canonical" href={`https://eligetuhosting.cl/whois/${slug}/`} />
        {domainData && <script type="application/ld+json">{generateSchemaData()}</script>}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Datos de hosting: ${domainName} — eligetuhosting.cl`} />
        <meta name="twitter:description" content={`Análisis técnico completo de ${domainName}. Descubre su proveedor de hosting, IP, nameservers y más.`} />
        {previewLoaded && !previewError && <meta name="twitter:image" content={domainData?.screenshot} />}
        <meta name="robots" content="index, follow" />
        <meta property="article:modified_time" content={new Date().toISOString()} />
      </Helmet>
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        {/* Breadcrumbs */}
        {!isLoading && !error && domainData && (
          <SEOBreadcrumbs items={breadcrumbItems} />
        )}
        
        {isLoading ? <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div className="space-y-4">
                <Skeleton className="h-40 w-full" />
              </div>
              <Skeleton className="h-60 w-full" />
            </div>
          </div> : error ? <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
            <p>{error}</p>
            <p className="mt-4">
              Puedes buscar información sobre este dominio utilizando nuestro buscador en la{' '}
              <Link to="/" className="text-blue-600 underline">
                página principal
              </Link>.
            </p>
          </div> : domainData ? <div>
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold mb-4">
                Información de hosting para <span className="text-blue-700">{domainName}</span>
              </h1>
              
              <Button onClick={handleRefresh} variant="outline" disabled={refreshing} className="flex items-center gap-2">
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Actualizando...' : 'Actualizar datos'}
              </Button>
            </div>
            
            {usingFallback && <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  Nota: Se están mostrando datos estimados para este dominio. 
                  Estos datos podrían no ser exactos.
                </p>
              </div>}
            
            {usingLiveData && <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <Check className="inline-block h-4 w-4 mr-1 mb-1" />
                  Se están mostrando datos en vivo para este dominio.
                  Esta información fue obtenida en tiempo real y podría variar.
                </p>
              </div>}
            
            {/* New warning for non-Chilean IPs */}
            {domainData.ip && !domainData.ip_chile && <Alert variant="destructive" className="mb-6 bg-red-50 border-red-200">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <AlertTitle className="text-red-700">Alojamiento fuera de Chile</AlertTitle>
                <AlertDescription className="text-red-700">
                  Este sitio web tiene una IP extranjera, lo que puede representar riesgos para la soberanía de 
                  datos chilenos, afectar velocidad de carga en Chile y podría estar sujeto a leyes de privacidad 
                  diferentes. Se recomienda alojar contenido chileno en servidores locales.
                </AlertDescription>
              </Alert>}
            
            {/* New intelligent call-out for domains without hosting */}
            {(!domainData.ip || domainData.ip === '–') && (!domainData.nameservers || domainData.nameservers.length === 0) && <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6 flex flex-col gap-3">
                <h3 className="text-lg font-semibold">¿Aún sin hosting?</h3>
                <p className="text-sm">
                  Te recomendamos <strong>HostingPlus</strong>, Nº 1 en nuestro ranking
                  por velocidad y soporte. ¡Contrátalo ahora con descuento!
                </p>
                <a href="https://clientes.hostingplus.cl/cart.php?gid=13&promocode=EXIT20" className="inline-flex items-center justify-center bg-[#EF233C] hover:bg-red-600 text-white text-sm font-medium rounded-md px-4 py-2 w-fit">
                  Contratar 20 % DSCTO
                </a>
              </div>}
            
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <Card className="shadow-md overflow-hidden">
                <CardHeader className="bg-white py-5">
                  <CardTitle className="flex items-center text-xl">
                    <Server className="h-5 w-5 mr-2 text-blue-700" />
                    Datos técnicos
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5">
                  <div className="space-y-4">
                    <div>
                      <span className="font-medium">Dirección IP:</span> 
                      <span className="ml-2">{domainData.ip}</span>
                      {domainData.ip_chile ? <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          🇨🇱 IP Chilena
                        </span> : <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <CloudOff className="h-3 w-3 mr-1" /> IP Extranjera
                        </span>}
                    </div>
                    
                    <div>
                      <span className="font-medium">Proveedor:</span> 
                      <span className="ml-2">{domainData.provider}</span>
                    </div>
                    
                    <div>
                      <span className="font-medium">ASN:</span> 
                      <span className="ml-2">{domainData.asn || 'Consultando...'}</span>
                    </div>
                    
                    <div>
                      <span className="font-medium">Nameservers:</span>
                      <ul className="ml-6 mt-1 list-disc">
                        {domainData.nameservers && domainData.nameservers.map((ns: string, index: number) => <li key={index} className="text-sm">{ns}</li>)}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-2">¿Tu IP no es chilena?</h3>
                    <p className="text-sm">
                      Mejora tu velocidad y SEO local 
                      <a href="/cotiza-hosting" className="text-red-600 underline ml-1">migrando gratis </a> 
                      a HostingPlus (30 días garantía).
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-blue-700" />
                  Vista previa del sitio
                </h2>
                <Card className="border overflow-hidden shadow-md bg-white">
                  <div className="h-[300px] relative overflow-hidden bg-gray-100">
                    {!previewLoaded && !previewError && <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="text-center">
                          <RefreshCw className="h-10 w-10 mx-auto animate-spin text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500">Cargando vista previa...</p>
                        </div>
                      </div>}
                    
                    {previewError && <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">No se pudo cargar la vista previa</p>
                          <Button variant="outline" size="sm" className="mt-2" onClick={() => {
                      setPreviewError(false);
                      setPreviewLoaded(false);
                      // Try to reload the image
                      setDomainData(prevData => ({
                        ...prevData,
                        screenshot: `https://image.thum.io/get/width/600/png/${domainName}?cache=${Date.now()}`
                      }));
                    }}>
                            Reintentar
                          </Button>
                        </div>
                      </div>}
                    
                    <img src={domainData.screenshot} alt={`Vista previa de ${domainName}`} className={`w-full h-full object-cover transition-opacity duration-300 ${previewLoaded ? 'opacity-100' : 'opacity-0'}`} onLoad={handleImageLoad} onError={handleImageError} />
                  </div>
                  <div className="p-3 bg-white border-t">
                    <a href={`https://${domainName}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center">
                      <Globe className="h-3 w-3 mr-1" />
                      Visitar sitio
                    </a>
                  </div>
                </Card>
                
                <div className="mt-6">
                  <RecentSearches />
                </div>
              </div>
            </div>
            
            {/* Recommendation section */}
            <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Recomendación de hosting</h2>
              <p className="mb-4">
                Para obtener el mejor rendimiento y soporte en Chile, te recomendamos:
              </p>
              <div className="flex items-center gap-4 border p-4 rounded-lg hover:border-blue-200 transition-all">
                <img src="/logo-hostingplus-new.svg" alt="HostingPlus.cl" className="h-10" />
                <div>
                  <p className="font-medium text-lg">HostingPlus.cl - Nº1 en Chile</p>
                  <p className="text-sm text-gray-600">IP chilena, soporte 24/7 y LiteSpeed Enterprise</p>
                  <ul className="mt-2 text-sm">
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
                <Button asChild className="ml-auto bg-[#EF233C] hover:bg-[#b3001b] text-white px-6">
                  <a href="https://www.hostingplus.cl/" target="_blank" rel="noopener noreferrer">
                    Contratar
                  </a>
                </Button>
              </div>
            </div>
          </div> : null}
      </main>
      
      <Footer />
    </div>
  );
};

export default WhoisDomain;

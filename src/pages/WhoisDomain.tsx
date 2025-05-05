
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Check, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Fallback domain data for when the actual data file doesn't exist
const getFallbackData = (domainName: string) => {
  return {
    ip: '200.27.162.162',
    ip_chile: true,
    provider: 'HostingPlus',
    asn: 'AS61512',
    nameservers: [
      'ns1.hostingplus.cl',
      'ns2.hostingplus.cl'
    ],
    screenshot: '/placeholder.svg'
  };
};

const WhoisDomain = () => {
  const { slug } = useParams<{ slug: string }>();
  const [domainData, setDomainData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [usingLiveData, setUsingLiveData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  // Format domain name from slug
  const domainName = slug ? slug.replace(/-/g, '.') : '';

  // Function to fetch live DNS data
  const fetchLiveDomainData = async (domain: string) => {
    setRefreshing(true);
    try {
      // Fetch A record (IP address)
      const aRes = await fetch(`https://dns.google/resolve?name=${domain}&type=A`).then(r => r.json());
      const ip = aRes.Answer ? aRes.Answer[0].data : '–';
      
      // Fetch nameservers
      const nsRes = await fetch(`https://dns.google/resolve?name=${domain}&type=NS`).then(r => r.json());
      const nameservers = nsRes.Answer ? nsRes.Answer.map((x: any) => x.data) : [];
      
      // Determine if it's a Chilean IP (simplified check)
      // This is a simplified check and should be improved with a more comprehensive IP database
      const ip_chile = ip.startsWith('200.27') || ip.startsWith('200.6') || ip.startsWith('190.98');
      
      // Try to determine provider from nameservers (simplified)
      let provider = 'Desconocido';
      if (nameservers.some((ns: string) => ns.includes('hostingplus'))) {
        provider = 'HostingPlus';
      } else if (nameservers.some((ns: string) => ns.includes('ecohosting'))) {
        provider = 'Ecohosting';
      } else if (nameservers.some((ns: string) => ns.includes('netlify'))) {
        provider = 'Netlify';
      }
      
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
      
      // Try to get a screenshot
      try {
        // Use thum.io for live screenshots
        const screenshotUrl = `https://image.thum.io/get/width/600/png/${domain}`;
        // Check if screenshot is available by making a HEAD request
        const screenshotRes = await fetch(screenshotUrl, { method: 'HEAD' });
        if (screenshotRes.ok) {
          setDomainData(prevData => ({
            ...prevData,
            screenshot: screenshotUrl
          }));
        }
      } catch (err) {
        console.error('Error fetching screenshot:', err);
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
          headers: { 'Content-Type': 'application/json' },
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
    fetch(`/content/domains/${slug}.json`)
      .then(response => {
        if (!response.ok) {
          throw new Error('No se encontró información para este dominio');
        }
        
        // Check if the response is HTML (common error case)
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          throw new Error('El archivo de datos no existe o no está en formato JSON');
        }
        
        return response.json();
      })
      .then(data => {
        setDomainData(data);
        setIsLoading(false);
      })
      .catch(error => {
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
      metaDescription.setAttribute('content', 
        `Datos de hosting para ${domainName}: IP, nameservers, proveedor, ASN y recomendaciones de hosting chileno.`
      );
    }
  }, [domainName]);

  const handleRefresh = () => {
    if (domainName) {
      fetchLiveDomainData(domainName);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] font-montserrat text-[#333]">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
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
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold mb-4">
                Información de hosting para <span className="text-blue-700">{domainName}</span>
              </h1>
              
              <Button 
                onClick={handleRefresh} 
                variant="outline" 
                disabled={refreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Actualizando...' : 'Actualizar datos'}
              </Button>
            </div>
            
            {usingFallback && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  Nota: Se están mostrando datos estimados para este dominio. 
                  Estos datos podrían no ser exactos.
                </p>
              </div>
            )}
            
            {usingLiveData && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  Nota: Se están mostrando datos en vivo para este dominio.
                  Esta información fue obtenida en tiempo real y podría variar.
                </p>
              </div>
            )}
            
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-bold mb-4">Datos técnicos</h2>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Dirección IP:</span> 
                      <span className="ml-2">{domainData.ip}</span>
                      {domainData.ip_chile && (
                        <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          🇨🇱 IP Chilena
                        </span>
                      )}
                    </div>
                    
                    <div>
                      <span className="font-medium">Proveedor:</span> 
                      <span className="ml-2">{domainData.provider}</span>
                    </div>
                    
                    <div>
                      <span className="font-medium">ASN:</span> 
                      <span className="ml-2">{domainData.asn}</span>
                    </div>
                    
                    <div>
                      <span className="font-medium">Nameservers:</span>
                      <ul className="ml-6 mt-1 list-disc">
                        {domainData.nameservers && domainData.nameservers.map((ns: string, index: number) => (
                          <li key={index}>{ns}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-2">¿Tu IP no es chilena?</h3>
                    <p className="text-sm">
                      Mejora tu velocidad y SEO local 
                      <a href="/cotiza-hosting" className="text-red-600 underline ml-1">
                        migrando gratis
                      </a> 
                      a HostingPlus (30 días garantía).
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-bold mb-4">Vista previa del sitio</h2>
                <div className="bg-white p-2 border rounded-lg shadow-md">
                  <img 
                    src={domainData.screenshot} 
                    alt={`Vista previa de ${domainName}`}
                    className="w-full rounded"
                  />
                </div>
              </div>
            </div>
            
            {/* Recommendation section */}
            <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Recomendación de hosting</h2>
              <p className="mb-4">
                Para obtener el mejor rendimiento y soporte en Chile, te recomendamos:
              </p>
              <div className="flex items-center gap-4 border p-4 rounded-lg">
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
                <Button 
                  asChild 
                  className="ml-auto bg-[#EF233C] hover:bg-[#b3001b] text-white px-6"
                >
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

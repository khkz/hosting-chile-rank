import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import { searchASN, ASNSearchResult } from '@/services/asnApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin, Network, Building } from 'lucide-react';
import UltimasBusquedas from '@/components/UltimasBusquedas';
import { isChileanASN } from '@/utils/ipDetection';

const ASNChile: React.FC = () => {
  const [chileanASNs, setChileanASNs] = useState<ASNSearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChileanASNs = async () => {
      setLoading(true);
      try {
        // Search for common Chilean providers with parallel requests for better performance
        const chileanProviders = [
          'chile', 'claro', 'entel', 'movistar', 'vtr', 'gtd', 'mundo', 'tie', 'netline',
          'hosting.cl', 'netuno', 'rdc', 'redvoiss', 'solucionhost', 'hostingplus',
          'ecohosting', 'pluschile', 'webhost', 'gigas'
        ];
        
        console.log('🚀 Starting ASN search with caching...');
        const startTime = Date.now();
        
        // Make all searches in parallel for much better performance
        const searchPromises = chileanProviders.map(async (provider) => {
          try {
            const results = await searchASN(provider);
            // Filter Chilean ASNs with more inclusive criteria
            const filtered = results.filter(r => 
              r.country_code === 'CL' || 
              isChileanASN(`AS${r.asn}`) ||
              (r.name && /chile|claro|entel|movistar|vtr|gtd|ecohosting|pluschile|hosting\.cl/i.test(r.name)) ||
              (r.description && /chile|claro|entel|movistar|vtr|gtd|ecohosting|pluschile/i.test(r.description))
            );
            return filtered;
          } catch (e) {
            console.warn(`Error searching for ${provider}:`, e);
            return [];
          }
        });
        
        const allResultArrays = await Promise.all(searchPromises);
        const allResults: ASNSearchResult[] = allResultArrays.flat();
        
        console.log(`✅ ASN searches completed in ${Date.now() - startTime}ms`);

        // Remove duplicates and sort by ASN
        const uniqueASNs = allResults.filter((asn, index, arr) => 
          arr.findIndex(a => a.asn === asn.asn) === index
        ).sort((a, b) => a.asn - b.asn);

        setChileanASNs(uniqueASNs);
        console.log(`📊 Total unique Chilean ASNs found: ${uniqueASNs.length}`);
      } catch (e) {
        console.error('Error loading Chilean ASNs:', e);
      } finally {
        setLoading(false);
      }
    };

    loadChileanASNs();
  }, []);

  // Categorize ASNs by type with more inclusive patterns
  const categorizedASNs = {
    telecom: chileanASNs.filter(asn => 
      asn.name && /claro|entel|movistar|vtr|wom|virgin|simple|telefon|telecom|movil/i.test(asn.name)
    ),
    hosting: chileanASNs.filter(asn => 
      asn.name && /hosting|host|server|datacenter|cloud|netuno|solucion|eco.*host|plus.*chile|webhost|gigas/i.test(asn.name)
    ),
    isp: chileanASNs.filter(asn => 
      asn.name && /gtd|mundo|tie|netline|rdc|redvoiss|internet|isp|provider|banda|fibra/i.test(asn.name) &&
      !/hosting|host|server|datacenter|cloud/i.test(asn.name)
    ),
    others: chileanASNs.filter(asn => {
      const name = asn.name || '';
      const desc = asn.description || '';
      return !(
        /claro|entel|movistar|vtr|wom|virgin|simple|telefon|telecom|movil/i.test(name) ||
        /hosting|host|server|datacenter|cloud|netuno|solucion|eco.*host|plus.*chile|webhost|gigas/i.test(name) ||
        (/gtd|mundo|tie|netline|rdc|redvoiss|internet|isp|provider|banda|fibra/i.test(name) && !/hosting|host|server|datacenter|cloud/i.test(name))
      ) && (name.includes('chile') || desc.includes('chile') || asn.country_code === 'CL');
    })
  };

  const renderASNCard = (asn: ASNSearchResult) => (
    <Card key={asn.asn} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Link to={`/asn/AS${asn.asn}`} className="hover:underline">
            AS{asn.asn}
          </Link>
          <Badge variant="secondary" className="gap-1">
            <MapPin className="h-3 w-3" />
            🇨🇱
          </Badge>
        </CardTitle>
        <p className="text-sm font-medium text-foreground">{asn.name || 'Sin nombre'}</p>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-3">{asn.description || 'Proveedor chileno'}</p>
        <div className="flex flex-wrap gap-2 text-xs">
          {asn.country_code && (
            <Badge variant="outline">País: {asn.country_code}</Badge>
          )}
          <Badge variant="outline">ASN: {asn.asn}</Badge>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
      <Helmet>
        <title>ASN Chile: Sistemas Autónomos | EligeTuHosting.cl</title>
        <meta name="description" content="Directorio completo de ASNs chilenos: Claro, Entel, Movistar, VTR, GTD, empresas de hosting y más proveedores de internet de Chile." />
        <link rel="canonical" href={`${window.location.origin}/asn/chile`} />
        <meta httpEquiv="content-language" content="es-CL" />
        <link rel="alternate" hrefLang="es-cl" href={`${window.location.origin}/asn/chile`} />
        <meta property="og:title" content="ASN Chile: Sistemas Autónomos de Proveedores Chilenos" />
        <meta property="og:description" content="Directorio completo de ASNs chilenos: Claro, Entel, Movistar, VTR, GTD y más." />
        <meta property="og:url" content={`${window.location.origin}/asn/chile`} />
      </Helmet>

      <SEOBreadcrumbs 
        items={[{ name: 'ASN', href: '/asn' }]} 
        pageName="Chile" 
      />

      <header className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <MapPin className="h-8 w-8 text-blue-600" />
          ASN Chile
        </h1>
        <p className="text-muted-foreground mt-2">
          Directorio de sistemas autónomos (ASN) de proveedores chilenos: telecomunicaciones, hosting, ISPs y más.
        </p>
      </header>

      {loading && (
        <div className="flex items-center gap-2 text-sm mb-8">
          <Loader2 className="h-4 w-4 animate-spin" /> 
          Cargando ASNs chilenos…
        </div>
      )}

      {!loading && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{chileanASNs.length}</p>
              <p className="text-muted-foreground">Total ASNs</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{categorizedASNs.telecom.length}</p>
              <p className="text-muted-foreground">Telecomunicaciones</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{categorizedASNs.hosting.length}</p>
              <p className="text-muted-foreground">Hosting</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{categorizedASNs.isp.length}</p>
              <p className="text-muted-foreground">ISPs</p>
            </div>
          </div>
        </div>
      )}

      {/* Telecomunicaciones */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Network className="h-6 w-6 text-green-600" />
          Telecomunicaciones
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categorizedASNs.telecom.slice(0, 24).map(renderASNCard)}
        </div>
      </section>

      {/* Hosting */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Building className="h-6 w-6 text-purple-600" />
          Hosting y Servidores
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categorizedASNs.hosting.slice(0, 24).map(renderASNCard)}
        </div>
      </section>

      {/* ISPs */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Network className="h-6 w-6 text-orange-600" />
          Proveedores de Internet (ISP)
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categorizedASNs.isp.slice(0, 24).map(renderASNCard)}
        </div>
      </section>

      {/* Otros */}
      {categorizedASNs.others.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Otros Proveedores</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categorizedASNs.others.slice(0, 24).map(renderASNCard)}
          </div>
        </section>
      )}

      {chileanASNs.length > 0 && (
        <div className="text-center py-4">
          <p className="text-muted-foreground mb-4">
            ¿Buscas un ASN específico? Usa el{' '}
            <Link to="/asn" className="text-blue-600 hover:underline">directorio general de ASN</Link>
          </p>
        </div>
      )}

      {/* Últimas búsquedas para SEO */}
      <div className="mt-12">
        <UltimasBusquedas />
      </div>
    </main>
    <StickyCTA />
    <Footer />
    </>
  );
};

export default ASNChile;
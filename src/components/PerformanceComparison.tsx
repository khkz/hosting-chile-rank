
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InfoIcon, BarChart3, Zap, Globe, Server, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PerformanceComparisonProps {
  domainName: string;
  ipChile: boolean;
}

const PerformanceComparison: React.FC<PerformanceComparisonProps> = ({ 
  domainName,
  ipChile
}) => {
  const [selectedProvider, setSelectedProvider] = useState<string>('hostingplus');

  // Mock performance data
  const performanceData = {
    speedComparison: [
      { name: 'Actual', ttfb: ipChile ? 280 : 850, loadTime: ipChile ? 1.8 : 3.5 },
      { name: 'HostingPlus', ttfb: 120, loadTime: 0.9 },
      { name: 'EcoHosting', ttfb: 180, loadTime: 1.2 },
      { name: '1Hosting', ttfb: 220, loadTime: 1.4 }
    ],
    uptime: [
      { name: 'Actual', score: ipChile ? 99.8 : 99.2 },
      { name: 'HostingPlus', score: 99.98 },
      { name: 'EcoHosting', score: 99.95 },
      { name: '1Hosting', score: 99.9 }
    ],
    pagespeed: {
      mobile: [
        { name: 'Actual', score: ipChile ? 75 : 60 },
        { name: 'HostingPlus', score: 90 },
        { name: 'EcoHosting', score: 85 },
        { name: '1Hosting', score: 82 }
      ],
      desktop: [
        { name: 'Actual', score: ipChile ? 82 : 70 },
        { name: 'HostingPlus', score: 95 },
        { name: 'EcoHosting', score: 92 },
        { name: '1Hosting', score: 88 }
      ]
    }
  };

  // Hosting provider details
  const providers = {
    hostingplus: {
      name: 'HostingPlus',
      features: [
        'LiteSpeed Enterprise',
        'IP chilena',
        'Datacenter en Santiago',
        'Certificado SSL gratis',
        'Migración gratuita',
        'Soporte 24/7 local'
      ],
      url: 'https://clientes.hostingplus.cl/cart.php?gid=13'
    },
    ecohosting: {
      name: 'EcoHosting',
      features: [
        'Apache optimizado',
        'IP chilena',
        'Datacenter en Providencia',
        'Certificado SSL gratis',
        'Migración gratuita',
        'Energía 100% renovable'
      ],
      url: 'https://www.ecohosting.cl/'
    },
    onehosting: {
      name: '1Hosting',
      features: [
        'SSD NVMe',
        'IP chilena',
        'Datacenter en Las Condes',
        'Certificado SSL gratis',
        'Backups diarios',
        'Soporte técnico 24/7'
      ],
      url: 'https://1hosting.cl/'
    }
  };

  const getSelectedProviderDetails = () => {
    if (selectedProvider === 'hostingplus') return providers.hostingplus;
    if (selectedProvider === 'ecohosting') return providers.ecohosting;
    if (selectedProvider === 'onehosting') return providers.onehosting;
    return providers.hostingplus; // Default
  };

  const calculateImprovement = (current: number, improved: number, type: 'loadTime' | 'ttfb' | 'uptime' | 'score') => {
    if (type === 'loadTime' || type === 'ttfb') {
      // Lower is better
      const percentage = ((current - improved) / current * 100).toFixed(0);
      return percentage;
    } else {
      // Higher is better
      const percentage = ((improved - current) / current * 100).toFixed(1);
      return percentage;
    }
  };

  const providerDetails = getSelectedProviderDetails();
  
  // Get actual performance data
  const actualTTFB = performanceData.speedComparison[0].ttfb;
  const actualLoadTime = performanceData.speedComparison[0].loadTime;
  const selectedProviderData = performanceData.speedComparison.find(
    item => item.name.toLowerCase() === providerDetails.name.toLowerCase()
  );
  
  const ttfbImprovement = selectedProviderData ? 
    calculateImprovement(actualTTFB, selectedProviderData.ttfb, 'ttfb') : '0';
  
  const loadTimeImprovement = selectedProviderData ? 
    calculateImprovement(actualLoadTime, selectedProviderData.loadTime, 'loadTime') : '0';

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Comparativa de rendimiento</h2>
      
      <Card className="shadow-sm">
        <CardHeader className="bg-white py-4">
          <CardTitle className="flex items-center text-lg">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-700" />
            Comparación con otros proveedores
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Tabs defaultValue="speed" className="w-full">
            <TabsList className="mb-4 w-full grid grid-cols-3">
              <TabsTrigger value="speed" className="flex items-center gap-1">
                <Zap className="h-4 w-4" /> Velocidad
              </TabsTrigger>
              <TabsTrigger value="uptime" className="flex items-center gap-1">
                <Server className="h-4 w-4" /> Uptime
              </TabsTrigger>
              <TabsTrigger value="pagespeed" className="flex items-center gap-1">
                <Globe className="h-4 w-4" /> PageSpeed
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="speed" className="pt-2">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={performanceData.speedComparison}
                    margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                    barGap={0}
                    barCategoryGap="15%"
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" label={{ value: 'TTFB (ms)', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" label={{ value: 'Tiempo carga (s)', angle: 90, position: 'insideRight' }} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" name="TTFB (ms)" dataKey="ttfb" fill="#8884d8" />
                    <Bar yAxisId="right" name="Tiempo carga (s)" dataKey="loadTime" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                <p className="flex items-center">
                  <InfoIcon className="h-4 w-4 mr-1" />
                  TTFB = Time to First Byte (menor es mejor). Tiempo carga = Tiempo hasta contenido principal (menor es mejor).
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="uptime" className="pt-2">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={performanceData.uptime}
                    margin={{ top: 20, right: 30, left: 30, bottom: 30 }}
                    barCategoryGap="20%"
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis domain={[99, 100]} label={{ value: 'Uptime (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar name="Uptime %" dataKey="score" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                <p className="flex items-center">
                  <InfoIcon className="h-4 w-4 mr-1" />
                  Uptime = Disponibilidad del servicio. Cada 0.1% representa aproximadamente 9 horas de downtime al año.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="pagespeed" className="pt-2">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[...performanceData.pagespeed.mobile, ...performanceData.pagespeed.desktop.map(item => ({...item, name: `${item.name} (Desktop)`}))]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    barCategoryGap="10%"
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} />
                    <YAxis domain={[0, 100]} label={{ value: 'PageSpeed Score', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar name="PageSpeed Score" dataKey="score" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                <p className="flex items-center">
                  <InfoIcon className="h-4 w-4 mr-1" />
                  PageSpeed Insights: Puntaje de rendimiento de Google (mayor es mejor). Un mejor hosting puede mejorar significativamente este puntaje.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Provider Selection */}
      <Card className="shadow-sm">
        <CardHeader className="bg-white py-4">
          <CardTitle className="flex items-center text-lg">
            <Server className="h-5 w-5 mr-2 text-blue-700" />
            Mejora estimada con hosting recomendado
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <Button 
                onClick={() => setSelectedProvider('hostingplus')}
                variant={selectedProvider === 'hostingplus' ? 'default' : 'outline'}
                className={`flex-1 ${selectedProvider === 'hostingplus' ? 'bg-blue-600' : ''}`}
              >
                HostingPlus
              </Button>
              <Button 
                onClick={() => setSelectedProvider('ecohosting')}
                variant={selectedProvider === 'ecohosting' ? 'default' : 'outline'}
                className={`flex-1 ${selectedProvider === 'ecohosting' ? 'bg-blue-600' : ''}`}
              >
                EcoHosting
              </Button>
              <Button 
                onClick={() => setSelectedProvider('onehosting')}
                variant={selectedProvider === 'onehosting' ? 'default' : 'outline'}
                className={`flex-1 ${selectedProvider === 'onehosting' ? 'bg-blue-600' : ''}`}
              >
                1Hosting
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Card className="shadow-sm bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Mejora en TTFB</p>
                      <div className="text-2xl font-bold text-blue-700 flex items-baseline">
                        {ttfbImprovement}% 
                        <span className="text-sm ml-1 text-green-600">más rápido</span>
                      </div>
                    </div>
                    <Clock className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Mejora en carga</p>
                      <div className="text-2xl font-bold text-blue-700 flex items-baseline">
                        {loadTimeImprovement}% 
                        <span className="text-sm ml-1 text-green-600">más rápido</span>
                      </div>
                    </div>
                    <Zap className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Mejor ranking SEO</p>
                      <div className="text-2xl font-bold text-blue-700 flex items-baseline">
                        Significativo
                        <span className="text-sm ml-1 text-green-600">en Chile</span>
                      </div>
                    </div>
                    <Globe className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-stretch mt-4 p-4 border rounded-md">
              <div className="md:w-1/2">
                <h3 className="font-bold text-lg">{providerDetails.name}</h3>
                <ul className="mt-3 space-y-1.5">
                  {providerDetails.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-4 bg-[#EF233C] hover:bg-[#d01d34] text-white">
                  <a href={providerDetails.url} target="_blank" rel="noopener noreferrer">
                    Ver planes
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                  </a>
                </Button>
              </div>
              
              <div className="md:w-1/2 bg-blue-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Impacto estimado para {domainName}</h4>
                <p className="text-sm text-gray-700 mb-3">
                  La migración a {providerDetails.name} podría mejorar significativamente la experiencia de los usuarios y el posicionamiento SEO de tu sitio.
                </p>
                <div className="text-sm space-y-2">
                  <div className="flex items-start">
                    <svg className="w-4 h-4 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>Usuarios satisfechos = Menor tasa de rebote e incremento en conversiones.</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-4 h-4 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>IP chilena = Mejor posicionamiento en Google.cl y búsquedas locales.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceComparison;

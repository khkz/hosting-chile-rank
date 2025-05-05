
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Helmet } from 'react-helmet';
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Legend, 
  ResponsiveContainer, 
  Tooltip, 
  TooltipProps, 
  XAxis, 
  YAxis 
} from 'recharts';

// Datos para los benchmarks
const benchmarkData = {
  velocidad: [
    { name: 'HostingPlus', valor: 98, color: '#EF233C' },
    { name: 'EcoHosting', valor: 95, color: '#329933' },
    { name: 'HostGator', valor: 92, color: '#FF9933' },
    { name: 'BlueHost', valor: 90, color: '#3366CC' },
    { name: 'DonWeb', valor: 87, color: '#663399' },
    { name: 'GoDaddy', valor: 83, color: '#FF6600' },
  ],
  tiempoCarga: [
    { name: 'HostingPlus', valor: 0.42, color: '#EF233C' },
    { name: 'EcoHosting', valor: 0.55, color: '#329933' },
    { name: 'HostGator', valor: 0.58, color: '#FF9933' },
    { name: 'BlueHost', valor: 0.62, color: '#3366CC' },
    { name: 'DonWeb', valor: 0.68, color: '#663399' },
    { name: 'GoDaddy', valor: 0.73, color: '#FF6600' },
  ],
  tiempoRespuestaServidor: [
    { name: 'HostingPlus', valor: 187, color: '#EF233C' },
    { name: 'EcoHosting', valor: 212, color: '#329933' },
    { name: 'HostGator', valor: 224, color: '#FF9933' },
    { name: 'BlueHost', valor: 231, color: '#3366CC' },
    { name: 'DonWeb', valor: 253, color: '#663399' },
    { name: 'GoDaddy', valor: 278, color: '#FF6600' },
  ],
  uptime: [
    { name: 'HostingPlus', valor: 99.98, color: '#EF233C' },
    { name: 'EcoHosting', valor: 99.95, color: '#329933' },
    { name: 'HostGator', valor: 99.93, color: '#FF9933' },
    { name: 'BlueHost', valor: 99.91, color: '#3366CC' },
    { name: 'DonWeb', valor: 99.89, color: '#663399' },
    { name: 'GoDaddy', valor: 99.85, color: '#FF6600' },
  ]
};

// Custom tooltip para los gráficos
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  unit: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, unit }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded">
        <p className="font-medium">{label}</p>
        <p className="text-[#EF233C]">
          {`${payload[0].value} ${unit}`}
        </p>
      </div>
    );
  }
  return null;
};

const Benchmark = () => {
  useEffect(() => {
    document.title = "Benchmark de Hosting Chile 2025 | eligetuhosting.cl";
  }, []);

  return (
    <>
      <Helmet>
        <title>Benchmark de Hosting Chile 2025 | eligetuhosting.cl</title>
        <meta 
          name="description" 
          content="Comparativa técnica y benchmark de los principales proveedores de hosting en Chile. Analizamos velocidad, uptime, seguridad y más." 
        />
      </Helmet>
      
      <Navbar />
      
      <main className="bg-[#F7F9FC]">
        {/* Hero section */}
        <section className="py-16 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-[#2B2D42] mb-4">
              Benchmark de Hosting Chile 2025
            </h1>
            <p className="text-lg text-[#555] max-w-2xl mx-auto">
              Análisis técnico detallado de los principales proveedores de hosting en Chile. 
              Mediciones reales de velocidad, rendimiento y disponibilidad.
            </p>
          </div>
        </section>
        
        {/* Metodología */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Metodología de pruebas</h2>
            <div className="max-w-3xl mx-auto">
              <p className="mb-4">
                Nuestro benchmark se basa en mediciones reales realizadas durante un período de 3 meses 
                (Enero - Marzo 2025) utilizando sitios web idénticos alojados en cada proveedor.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="bg-gray-50 p-5 rounded-lg">
                  <h3 className="font-bold mb-2">Herramientas utilizadas:</h3>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Google PageSpeed Insights</li>
                    <li>Pingdom Tools</li>
                    <li>GTmetrix</li>
                    <li>WebPageTest</li>
                    <li>UptimeRobot</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-5 rounded-lg">
                  <h3 className="font-bold mb-2">Sitio de prueba:</h3>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>WordPress 6.4</li>
                    <li>Tema liviano optimizado</li>
                    <li>WooCommerce con 50 productos</li>
                    <li>Base de datos con 500 publicaciones</li>
                    <li>Imágenes optimizadas (3MB en total)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Gráficos de benchmark */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">Resultados del benchmark</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Gráfico de velocidad */}
              <Card>
                <CardHeader>
                  <CardTitle>Índice de Velocidad (mayor es mejor)</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={benchmarkData.velocidad}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis type="category" dataKey="name" width={100} />
                      <Tooltip content={(props) => <CustomTooltip {...props as any} unit="/100" />} />
                      <Legend />
                      <Bar dataKey="valor" fill="#EF233C" name="Velocidad" radius={[0, 4, 4, 0]}>
                        {benchmarkData.velocidad.map((entry, index) => (
                          <rect key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              {/* Gráfico de tiempo de carga */}
              <Card>
                <CardHeader>
                  <CardTitle>Tiempo de carga promedio (menor es mejor)</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={benchmarkData.tiempoCarga}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 1]} />
                      <YAxis type="category" dataKey="name" width={100} />
                      <Tooltip content={(props) => <CustomTooltip {...props as any} unit="segundos" />} />
                      <Legend />
                      <Bar dataKey="valor" fill="#3366CC" name="Tiempo" radius={[0, 4, 4, 0]}>
                        {benchmarkData.tiempoCarga.map((entry, index) => (
                          <rect key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              {/* Gráfico de tiempo de respuesta del servidor */}
              <Card>
                <CardHeader>
                  <CardTitle>Tiempo de respuesta del servidor (menor es mejor)</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={benchmarkData.tiempoRespuestaServidor}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 350]} />
                      <YAxis type="category" dataKey="name" width={100} />
                      <Tooltip content={(props) => <CustomTooltip {...props as any} unit="ms" />} />
                      <Legend />
                      <Bar dataKey="valor" fill="#329933" name="TTFB" radius={[0, 4, 4, 0]}>
                        {benchmarkData.tiempoRespuestaServidor.map((entry, index) => (
                          <rect key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              {/* Gráfico de uptime */}
              <Card>
                <CardHeader>
                  <CardTitle>Uptime en 90 días (mayor es mejor)</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={benchmarkData.uptime}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[99.8, 100]} />
                      <YAxis type="category" dataKey="name" width={100} />
                      <Tooltip content={(props) => <CustomTooltip {...props as any} unit="%" />} />
                      <Legend />
                      <Bar dataKey="valor" fill="#FF9933" name="Uptime" radius={[0, 4, 4, 0]}>
                        {benchmarkData.uptime.map((entry, index) => (
                          <rect key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Conclusiones */}
        <section className="py-12 bg-[#F7F9FC]">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold mb-6 text-center">Conclusiones del Benchmark</h2>
            
            <div className="prose max-w-none">
              <p>
                Después de tres meses de pruebas exhaustivas, los resultados de nuestro benchmark muestran 
                diferencias significativas entre los proveedores de hosting analizados:
              </p>
              
              <ul>
                <li>
                  <strong>HostingPlus</strong> obtiene los mejores resultados en velocidad y tiempo de carga, 
                  destacando especialmente en el tiempo de respuesta del servidor con una media de 187ms.
                </li>
                <li>
                  <strong>EcoHosting</strong> muestra un rendimiento muy sólido en todas las pruebas, especialmente 
                  en uptime, donde alcanza un 99.95% de disponibilidad.
                </li>
                <li>
                  <strong>HostGator</strong> ofrece un buen equilibrio en todas las métricas, destacando en la relación 
                  rendimiento/precio como una de las opciones más económicas.
                </li>
                <li>
                  Los servidores con <strong>LiteSpeed</strong> (HostingPlus y EcoHosting) muestran una clara 
                  ventaja en tiempo de carga frente a los que utilizan Apache tradicional.
                </li>
                <li>
                  La presencia de <strong>Datacenter en Chile</strong> (como en el caso de HostingPlus) reduce 
                  significativamente la latencia para usuarios locales.
                </li>
              </ul>
              
              <p>
                Basándonos en estos resultados técnicos, nuestra recomendación se inclina hacia HostingPlus 
                para proyectos que requieran máximo rendimiento, mientras que HostGator representa una excelente 
                alternativa para proyectos con presupuesto limitado.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <StickyCTA />
      <Footer />
    </>
  );
};

export default Benchmark;


import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  Server, 
  Shield, 
  Zap, 
  Code, 
  FileText,
  Check,
  X,
  AlertTriangle,
  CloudOff
} from 'lucide-react';
import type { DomainAnalysisResult } from '@/services/domainAnalysis';

interface WhoisTabsProps {
  data: DomainAnalysisResult;
  isLoading?: boolean;
}

const WhoisTabs: React.FC<WhoisTabsProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return <div className="text-center py-8">Cargando análisis completo...</div>;
  }

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Resumen
        </TabsTrigger>
        <TabsTrigger value="dns" className="flex items-center gap-2">
          <Server className="h-4 w-4" />
          DNS
        </TabsTrigger>
        <TabsTrigger value="whois" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          WHOIS
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Seguridad
        </TabsTrigger>
        <TabsTrigger value="performance" className="flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Rendimiento
        </TabsTrigger>
        <TabsTrigger value="technology" className="flex items-center gap-2">
          <Code className="h-4 w-4" />
          Tecnología
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Información General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Dominio:</span>
                <span className="ml-2">{data.basic.domain}</span>
              </div>
              <div>
                <span className="font-medium">IP Principal:</span>
                <span className="ml-2">{data.basic.ip}</span>
                {data.basic.ip_chile ? (
                  <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                    🇨🇱 IP Chilena
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="ml-2">
                    <CloudOff className="h-3 w-3 mr-1" />
                    IP Extranjera
                  </Badge>
                )}
              </div>
              <div>
                <span className="font-medium">Proveedor:</span>
                <span className="ml-2">{data.basic.provider}</span>
              </div>
              <div>
                <span className="font-medium">ASN:</span>
                <span className="ml-2">{data.basic.asn}</span>
              </div>
            </div>
            
            <div>
              <span className="font-medium">Nameservers:</span>
              <ul className="ml-6 mt-1 list-disc">
                {data.basic.nameservers.map((ns, index) => (
                  <li key={index} className="text-sm">{ns}</li>
                ))}
              </ul>
            </div>

            {!data.basic.ip_chile && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800">Alojamiento fuera de Chile</h4>
                    <p className="text-sm text-red-700 mt-1">
                      Este sitio web tiene una IP extranjera, lo que puede afectar la velocidad 
                      de carga en Chile y estar sujeto a leyes de privacidad diferentes.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="dns" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Registros DNS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Registros A (IPv4)</h4>
                <ul className="space-y-1">
                  {data.dns.a_records.map((record, index) => (
                    <li key={index} className="text-sm font-mono bg-gray-50 p-2 rounded">
                      {record}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Registros NS (Nameservers)</h4>
                <ul className="space-y-1">
                  {data.dns.ns_records.map((record, index) => (
                    <li key={index} className="text-sm font-mono bg-gray-50 p-2 rounded">
                      {record}
                    </li>
                  ))}
                </ul>
              </div>

              {data.dns.mx_records.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Registros MX (Email)</h4>
                  <ul className="space-y-1">
                    {data.dns.mx_records.map((record, index) => (
                      <li key={index} className="text-sm font-mono bg-gray-50 p-2 rounded">
                        {record.priority} {record.exchange}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {data.dns.txt_records.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Registros TXT</h4>
                  <ul className="space-y-1">
                    {data.dns.txt_records.map((record, index) => (
                      <li key={index} className="text-sm font-mono bg-gray-50 p-2 rounded break-all">
                        {record}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="whois" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Información WHOIS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Registrador:</span>
                <span className="ml-2">{data.whois.registrar}</span>
              </div>
              <div>
                <span className="font-medium">Estado:</span>
                <span className="ml-2">{data.whois.status}</span>
              </div>
              <div>
                <span className="font-medium">Fecha de creación:</span>
                <span className="ml-2">{data.whois.created_date}</span>
              </div>
              <div>
                <span className="font-medium">Fecha de expiración:</span>
                <span className="ml-2">{data.whois.expires_date}</span>
              </div>
              <div>
                <span className="font-medium">DNSSEC:</span>
                <span className="ml-2">{data.whois.dnssec_status}</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Información del Propietario</h4>
              <p className="text-sm text-blue-700">
                La información del propietario está protegida por las políticas de privacidad de NIC Chile.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Seguridad SSL/TLS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">SSL Habilitado:</span>
                {data.ssl.ssl_enabled ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Check className="h-3 w-3 mr-1" />
                    Sí
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <X className="h-3 w-3 mr-1" />
                    No
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium">Redirección HTTPS:</span>
                {data.ssl.https_redirect ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Check className="h-3 w-3 mr-1" />
                    Sí
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <X className="h-3 w-3 mr-1" />
                    No
                  </Badge>
                )}
              </div>

              <div>
                <span className="font-medium">Emisor SSL:</span>
                <span className="ml-2">{data.ssl.ssl_issuer}</span>
              </div>

              <div>
                <span className="font-medium">Grado SSL:</span>
                <span className="ml-2">{data.ssl.ssl_grade}</span>
              </div>
            </div>

            {Object.keys(data.ssl.security_headers).length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Headers de Seguridad</h4>
                <div className="space-y-2">
                  {Object.entries(data.ssl.security_headers).map(([header, value]) => (
                    <div key={header} className="text-sm">
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">{header}</span>
                      <span className="ml-2">{value as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="performance" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Métricas de Rendimiento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Tiempo de carga:</span>
                <span className="ml-2">{data.performance.load_time_ms}ms</span>
              </div>
              <div>
                <span className="font-medium">Tamaño de página:</span>
                <span className="ml-2">{data.performance.page_size_kb}KB</span>
              </div>
              <div>
                <span className="font-medium">PageSpeed Score:</span>
                <span className="ml-2">{data.performance.pagespeed_score}/100</span>
              </div>
              <div>
                <span className="font-medium">First Contentful Paint:</span>
                <span className="ml-2">{data.performance.first_contentful_paint_ms}ms</span>
              </div>
              <div>
                <span className="font-medium">Largest Contentful Paint:</span>
                <span className="ml-2">{data.performance.largest_contentful_paint_ms}ms</span>
              </div>
              <div>
                <span className="font-medium">Cumulative Layout Shift:</span>
                <span className="ml-2">{data.performance.cumulative_layout_shift.toFixed(3)}</span>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Nota sobre las métricas</h4>
              <p className="text-sm text-yellow-700">
                Las métricas de rendimiento son estimaciones basadas en análisis automático. 
                Para datos precisos, se recomienda usar herramientas especializadas como Google PageSpeed Insights.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="technology" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Stack Tecnológico
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Servidor Web:</span>
                <span className="ml-2">{data.tech_stack.server_software}</span>
              </div>
              <div>
                <span className="font-medium">CMS Detectado:</span>
                <span className="ml-2">{data.tech_stack.cms_detected}</span>
              </div>
              <div>
                <span className="font-medium">Framework:</span>
                <span className="ml-2">{data.tech_stack.framework_detected}</span>
              </div>
              <div>
                <span className="font-medium">CDN:</span>
                <span className="ml-2">{data.tech_stack.cdn_provider}</span>
              </div>
              <div>
                <span className="font-medium">Lenguaje:</span>
                <span className="ml-2">{data.tech_stack.programming_language}</span>
              </div>
              <div>
                <span className="font-medium">Base de Datos:</span>
                <span className="ml-2">{data.tech_stack.database_type}</span>
              </div>
              <div>
                <span className="font-medium">Proveedor de Hosting:</span>
                <span className="ml-2">{data.tech_stack.hosting_provider}</span>
              </div>
              <div>
                <span className="font-medium">Ubicación:</span>
                <span className="ml-2">{data.tech_stack.country_location}</span>
              </div>
            </div>

            {data.tech_stack.analytics_tools.length > 0 && (
              <div>
                <span className="font-medium">Herramientas de Análisis:</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {data.tech_stack.analytics_tools.map((tool, index) => (
                    <Badge key={index} variant="outline">{tool}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default WhoisTabs;

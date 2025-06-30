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
  CloudOff,
  ExternalLink,
  Calendar,
  User,
  Building,
  MapPin,
  AlertCircle
} from 'lucide-react';
import type { DomainAnalysisResult } from '@/services/domainAnalysis';
import { getComplaintBadge } from '@/services/hostingComplaints';

interface WhoisTabsProps {
  data: DomainAnalysisResult;
  isLoading?: boolean;
}

const WhoisTabs: React.FC<WhoisTabsProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return <div className="text-center py-8">Cargando análisis completo...</div>;
  }

  // Helper function to check if we have real WHOIS data
  const hasRealWhoisData = (whoisData: any) => {
    return whoisData.owner_name && 
           whoisData.owner_name !== 'No disponible' && 
           whoisData.owner_name !== 'Información privada' &&
           !whoisData.owner_name.includes('Información privada');
  };

  // Format current date for disclaimer
  const currentDate = new Date().toLocaleDateString('es-CL');
  
  // Generate NIC Chile official link
  const nicChileLink = `https://nic.cl/registry/Whois.do?d=${data.basic.domain}`;

  // Get complaint info if available
  const complaintInfo = data.basic.complaintInfo;
  const complaintBadge = complaintInfo ? getComplaintBadge(complaintInfo.level) : null;

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
                {complaintBadge && (
                  <Badge className={`ml-2 ${complaintBadge.color}`}>
                    {complaintBadge.icon} {complaintBadge.text}
                  </Badge>
                )}
              </div>
              <div>
                <span className="font-medium">ASN:</span>
                <span className="ml-2">{data.basic.asn}</span>
              </div>
              {data.basic.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Ubicación:</span>
                  <span className="ml-2">{data.basic.location}</span>
                </div>
              )}
              {data.basic.isp && data.basic.isp !== data.basic.provider && (
                <div>
                  <span className="font-medium">ISP:</span>
                  <span className="ml-2">{data.basic.isp}</span>
                </div>
              )}
            </div>
            
            <div>
              <span className="font-medium">Nameservers:</span>
              <ul className="ml-6 mt-1 list-disc">
                {data.basic.nameservers.map((ns, index) => (
                  <li key={index} className="text-sm">{ns}</li>
                ))}
              </ul>
            </div>

            {/* Complaint Alert Section */}
            {complaintInfo && (
              <div className={`border rounded-lg p-4 ${
                complaintInfo.level === 'critical' ? 'bg-red-50 border-red-200' :
                complaintInfo.level === 'high' ? 'bg-red-50 border-red-200' :
                complaintInfo.level === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                complaintInfo.level === 'low' ? 'bg-blue-50 border-blue-200' :
                'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-start gap-3">
                  <AlertCircle className={`h-5 w-5 mt-0.5 ${
                    complaintInfo.level === 'critical' || complaintInfo.level === 'high' ? 'text-red-600' :
                    complaintInfo.level === 'medium' ? 'text-yellow-600' :
                    complaintInfo.level === 'low' ? 'text-blue-600' :
                    'text-green-600'
                  }`} />
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      complaintInfo.level === 'critical' || complaintInfo.level === 'high' ? 'text-red-800' :
                      complaintInfo.level === 'medium' ? 'text-yellow-800' :
                      complaintInfo.level === 'low' ? 'text-blue-800' :
                      'text-green-800'
                    }`}>
                      {complaintInfo.level === 'none' ? 'Proveedor Confiable' : 'Alerta de Reclamos'}
                    </h4>
                    <p className={`text-sm mt-1 ${
                      complaintInfo.level === 'critical' || complaintInfo.level === 'high' ? 'text-red-700' :
                      complaintInfo.level === 'medium' ? 'text-yellow-700' :
                      complaintInfo.level === 'low' ? 'text-blue-700' :
                      'text-green-700'
                    }`}>
                      <strong>{complaintInfo.count} reclamo{complaintInfo.count !== 1 ? 's' : ''}</strong>
                      {complaintInfo.count > 0 && (
                        <span> (último: {complaintInfo.lastComplaint})</span>
                      )}
                    </p>
                    <p className={`text-sm mt-2 ${
                      complaintInfo.level === 'critical' || complaintInfo.level === 'high' ? 'text-red-700' :
                      complaintInfo.level === 'medium' ? 'text-yellow-700' :
                      complaintInfo.level === 'low' ? 'text-blue-700' :
                      'text-green-700'
                    }`}>
                      {complaintInfo.description}
                    </p>
                    <p className={`text-sm mt-2 font-medium ${
                      complaintInfo.level === 'critical' || complaintInfo.level === 'high' ? 'text-red-700' :
                      complaintInfo.level === 'medium' ? 'text-yellow-700' :
                      complaintInfo.level === 'low' ? 'text-blue-700' :
                      'text-green-700'
                    }`}>
                      {complaintInfo.recommendation}
                    </p>
                    {complaintInfo.reclamosUrl && (
                      <a 
                        href={complaintInfo.reclamosUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1 text-sm mt-2 hover:underline ${
                          complaintInfo.level === 'critical' || complaintInfo.level === 'high' ? 'text-red-600' :
                          complaintInfo.level === 'medium' ? 'text-yellow-600' :
                          complaintInfo.level === 'low' ? 'text-blue-600' :
                          'text-green-600'
                        }`}
                      >
                        Ver reclamos en reclamos.cl
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

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
              Información WHOIS Pública
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Datos Públicos Disponibles */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                <Check className="h-4 w-4" />
                Datos Públicos Disponibles
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-green-600" />
                  <div>
                    <span className="font-medium text-sm">Dominio:</span>
                    <div className="font-mono text-sm">{data.basic.domain}</div>
                  </div>
                </div>

                {hasRealWhoisData(data.whois) && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-green-600" />
                    <div>
                      <span className="font-medium text-sm">Titular:</span>
                      <div className="text-sm">{data.whois.owner_name}</div>
                    </div>
                  </div>
                )}

                {data.whois.organization && data.whois.organization !== 'No disponible' && (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-green-600" />
                    <div>
                      <span className="font-medium text-sm">Organización:</span>
                      <div className="text-sm">{data.whois.organization}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <div>
                    <span className="font-medium text-sm">Fecha de creación:</span>
                    <div className="text-sm">{data.whois.created_date}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <div>
                    <span className="font-medium text-sm">Fecha de expiración:</span>
                    <div className="text-sm">{data.whois.expires_date}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-green-600" />
                  <div>
                    <span className="font-medium text-sm">Registrador:</span>
                    <div className="text-sm">{data.whois.registrar}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Nameservers */}
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Server className="h-4 w-4" />
                Servidores DNS
              </h4>
              <ul className="space-y-1">
                {data.basic.nameservers.map((ns, index) => (
                  <li key={index} className="text-sm font-mono bg-gray-50 p-2 rounded">
                    {ns}
                  </li>
                ))}
              </ul>
            </div>

            {/* Enlace al registro oficial */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Registro Oficial
              </h4>
              <p className="text-sm text-blue-700 mb-3">
                Para información completa y actualizada, consulte el registro oficial de NIC Chile:
              </p>
              <a 
                href={nicChileLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 underline text-sm font-medium"
              >
                Consultar en NIC Chile
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Disclaimer legal */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Aviso Legal</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Datos obtenidos el {currentDate} desde WHOIS de NIC Chile; uso exclusivo para fines 
                informativos vinculados a la gestión del nombre de dominio. La información mostrada 
                corresponde únicamente a los datos públicos disponibles. Para información completa 
                y verificación oficial, consulte directamente el registro de NIC Chile.
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

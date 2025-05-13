
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon, Server, Globe, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { detectTechnologies, checkSSL, estimateLoadingSpeed, verifyAPIAccount } from '@/utils/domainAnalysisUtils';
import { toast } from '@/components/ui/use-toast';

interface DomainTechnicalAnalysisProps {
  domainName: string;
  ip: string;
  nameservers: string[];
}

const DomainTechnicalAnalysis: React.FC<DomainTechnicalAnalysisProps> = ({ 
  domainName, 
  ip,
  nameservers 
}) => {
  const [technologies, setTechnologies] = useState<any[]>([]);
  const [sslInfo, setSSLInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [speedInfo, setSpeedInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEstimatedData, setIsEstimatedData] = useState(false);
  const [apiStatus, setApiStatus] = useState<{active: boolean, credits: number} | null>(null);
  
  const checkApiStatus = async () => {
    try {
      const status = await verifyAPIAccount();
      setApiStatus(status);
      return status.active;
    } catch (error) {
      console.error('Error checking API status:', error);
      return false;
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Check API status first
        const apiActive = await checkApiStatus();
        
        if (!apiActive) {
          toast({
            title: "API no disponible",
            description: "Usando datos técnicos estimados ya que la API de DNSlytics no está disponible.",
            variant: "warning"
          });
          setIsEstimatedData(true);
        }
        
        // Fetch all the technical data in parallel
        const [techData, sslData, speedData] = await Promise.all([
          detectTechnologies(domainName),
          checkSSL(domainName),
          estimateLoadingSpeed(domainName, ip)
        ]);
        
        setTechnologies(techData);
        setSSLInfo(sslData);
        setSpeedInfo(speedData);
        
        // Check if we're using estimated data
        const usingEstimatedData = !apiActive || 
                                  technologies.length <= 2 || 
                                  (technologies.some(t => t.name === 'Apache' && t.name === 'PHP'));
        
        setIsEstimatedData(usingEstimatedData);
        
        if (usingEstimatedData && apiActive) {
          toast({
            title: "Datos parcialmente estimados",
            description: "Algunos datos técnicos son aproximados debido a limitaciones de la API.",
            variant: "default"
          });
        }
      } catch (error) {
        console.error('Error fetching technical data:', error);
        setError('No se pudieron cargar los datos técnicos. Por favor, inténtalo de nuevo más tarde.');
        toast({
          title: "Error al cargar datos técnicos",
          description: "No se pudieron obtener los detalles técnicos del dominio.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (domainName) {
      fetchData();
    }
  }, [domainName, ip]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Análisis técnico avanzado</h2>
        
        {apiStatus && (
          <div className="text-sm text-gray-500 flex items-center">
            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${apiStatus.active ? 'bg-green-500' : 'bg-amber-500'}`}></span>
            API DNSlytics: {apiStatus.active ? 'Activa' : 'Limitada'}
            {apiStatus.active && (
              <span className="ml-2">({apiStatus.credits} créditos disponibles)</span>
            )}
          </div>
        )}
      </div>
      
      {isEstimatedData && !loading && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800 text-sm font-medium">Datos estimados</AlertTitle>
          <AlertDescription className="text-amber-700 text-xs">
            Los datos técnicos mostrados son aproximados ya que no se pudieron obtener 
            registros completos para este dominio.
          </AlertDescription>
        </Alert>
      )}
      
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="shadow-sm">
              <CardHeader className="bg-white py-4">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="shadow-sm">
          <CardContent className="pt-4 flex flex-col items-center justify-center py-10">
            <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
            <p className="text-center text-gray-700">{error}</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Technologies Card */}
            <Card className="shadow-sm">
              <CardHeader className="bg-white py-4">
                <CardTitle className="flex items-center text-lg">
                  <Server className="h-5 w-5 mr-2 text-blue-700" />
                  Tecnologías detectadas
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {technologies.length > 0 ? (
                  <div className="space-y-4">
                    {technologies.map((tech, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <span>{tech.name}</span>
                          <span className="text-sm text-gray-600">{tech.confidence}%</span>
                        </div>
                        <Progress value={tech.confidence} className="h-2" />
                        {tech.details && (
                          <p className="text-xs text-gray-500 mt-1">{tech.details}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No se detectaron tecnologías</p>
                )}
              </CardContent>
            </Card>

            {/* SSL Certificate Card */}
            <Card className="shadow-sm">
              <CardHeader className="bg-white py-4">
                <CardTitle className="flex items-center text-lg">
                  <Shield className="h-5 w-5 mr-2 text-blue-700" />
                  Certificado SSL
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {sslInfo ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Estado:</span>
                      {sslInfo.valid ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" /> Válido
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                          <AlertTriangle className="h-3 w-3 mr-1" /> No válido
                        </Badge>
                      )}
                    </div>
                    
                    <div>
                      <span className="font-medium">Emisor:</span> 
                      <span className="ml-2">{sslInfo.issuer}</span>
                    </div>
                    
                    <div>
                      <span className="font-medium">Expira:</span> 
                      <span className="ml-2">{sslInfo.expiry?.toLocaleDateString()}</span>
                    </div>
                    
                    <div>
                      <span className="font-medium">Calificación:</span> 
                      <span className="ml-2 font-bold">{sslInfo.grade}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <AlertTriangle className="h-10 w-10 mx-auto text-gray-400" />
                    <p className="mt-2 text-gray-500">No se pudo obtener información de SSL</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Speed Analysis Card */}
            <Card className="shadow-sm">
              <CardHeader className="bg-white py-4">
                <CardTitle className="flex items-center text-lg">
                  <Globe className="h-5 w-5 mr-2 text-blue-700" />
                  Análisis de velocidad
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {speedInfo ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Rendimiento:</span>
                        <span className="font-medium">{speedInfo.score}/100</span>
                      </div>
                      <Progress 
                        value={speedInfo.score} 
                        className="h-2" 
                        // @ts-ignore - the Progress component may not have indicatorClassName in its types
                        indicatorClassName={`${
                          speedInfo.score > 75 ? 'bg-green-500' : 
                          speedInfo.score > 50 ? 'bg-yellow-500' : 
                          'bg-red-500'
                        }`}
                      />
                    </div>
                    
                    <div>
                      <span className="font-medium">Tiempo estimado de carga:</span> 
                      <span className="ml-2">{speedInfo.estimated_time}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className="h-4 w-4 inline-block ml-1 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Tiempo estimado para el primer contenido visible</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    
                    <div>
                      <span className="font-medium">Medido desde:</span> 
                      <span className="ml-2">{speedInfo.location}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No se pudo obtener información de velocidad</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Nameserver Analysis */}
          <Card className="shadow-sm">
            <CardHeader className="bg-white py-4">
              <CardTitle className="flex items-center text-lg">
                <Server className="h-5 w-5 mr-2 text-blue-700" />
                Análisis de nameservers
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {nameservers && nameservers.length > 0 ? (
                <div>
                  <p className="mb-3">El dominio utiliza {nameservers.length} nameservers:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    {nameservers.map((ns, index) => (
                      <li key={index}>{ns}</li>
                    ))}
                  </ul>
                  <div className="mt-4 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-800">
                      <InfoIcon className="h-4 w-4 inline-block mr-1" />
                      Se recomienda tener al menos 2 nameservers distribuidos para garantizar la disponibilidad.
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">No se encontraron nameservers para este dominio</p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default DomainTechnicalAnalysis;

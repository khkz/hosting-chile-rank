
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon, Server, Globe, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { detectTechnologies, checkSSL, estimateLoadingSpeed } from '@/utils/domainAnalysisUtils';

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
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all the technical data in parallel
        const [techData, sslData, speedData] = await Promise.all([
          detectTechnologies(domainName),
          checkSSL(domainName),
          estimateLoadingSpeed(domainName, ip)
        ]);
        
        setTechnologies(techData);
        setSSLInfo(sslData);
        setSpeedInfo(speedData);
      } catch (error) {
        console.error('Error fetching technical data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [domainName, ip]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Análisis técnico avanzado</h2>
      
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

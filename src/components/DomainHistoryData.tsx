
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { History, Calendar, User, AlertTriangle, Mail, Globe, Info, RefreshCw } from 'lucide-react';
import { getDomainHistory, getSimilarDomains } from '@/utils/domainAnalysisUtils';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

interface DomainHistoryDataProps {
  domainName: string;
}

const DomainHistoryData: React.FC<DomainHistoryDataProps> = ({ domainName }) => {
  const [historyData, setHistoryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [similarDomains, setSimilarDomains] = useState<any[]>([]);
  const [isEstimatedData, setIsEstimatedData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Mock WHOIS data - would come from an API in production
  const mockWhoisData = {
    owner: {
      name: "Información protegida",
      organization: "Organización no disponible",
      email: "contacto@privado.com",
      address: "Dirección protegida por privacidad",
      phone: "Teléfono no disponible"
    },
    privacy: true,
    available: false
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setRefreshing(true);
    
    try {
      // Get domain history data
      const history = await getDomainHistory(domainName);
      setHistoryData(history);
      
      // Check if this is estimated data (we'd know from internal flags, timestamps, etc.)
      // For now, we'll assume it's estimated if data matches certain patterns
      const isEstimated = !history.registrar || 
                         history.statusHistory?.length <= 2 || 
                         history.statusHistory?.some(s => s.status.includes('nameserver'));
      
      setIsEstimatedData(isEstimated);
      
      // Get similar domains
      const similar = getSimilarDomains(domainName);
      setSimilarDomains(similar);
      
      if (isEstimated) {
        toast({
          title: "Datos estimados",
          description: "La información histórica del dominio es aproximada.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error fetching domain history:', error);
      setError('No se pudieron cargar los datos históricos del dominio.');
      toast({
        title: "Error al cargar datos históricos",
        description: "No se pudieron obtener los detalles históricos del dominio.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    if (domainName) {
      fetchData();
    }
  }, [domainName]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-CL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const handleRefresh = () => {
    if (domainName) {
      fetchData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Historial y datos WHOIS</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={loading || refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Actualizando...' : 'Actualizar datos'}
        </Button>
      </div>
      
      {isEstimatedData && !loading && (
        <Alert variant="warning" className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800 text-sm font-medium">Datos estimados</AlertTitle>
          <AlertDescription className="text-amber-700 text-xs">
            Los datos históricos mostrados son aproximados ya que no se pudieron obtener 
            registros oficiales completos para este dominio.
          </AlertDescription>
        </Alert>
      )}
      
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-60 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : error ? (
        <Card className="shadow-sm">
          <CardContent className="pt-4 flex flex-col items-center justify-center py-10">
            <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
            <p className="text-center text-gray-700">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh} 
              className="mt-4"
            >
              Reintentar
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Domain Registration Info */}
          <Card className="shadow-sm">
            <CardHeader className="bg-white py-4">
              <CardTitle className="flex items-center text-lg">
                <Calendar className="h-5 w-5 mr-2 text-blue-700" />
                Información de registro
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {historyData ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Fecha de registro:</span> 
                      <span className="ml-2">{formatDate(historyData.registrationDate)}</span>
                    </div>
                    
                    <div>
                      <span className="font-medium">Fecha de expiración:</span> 
                      <span className="ml-2">{formatDate(historyData.expirationDate)}</span>
                    </div>
                    
                    <div>
                      <span className="font-medium">Registrador:</span> 
                      <span className="ml-2">{historyData.registrar}</span>
                    </div>
                    
                    <div>
                      <span className="font-medium">Estado:</span> 
                      <Badge className="ml-2 bg-green-100 text-green-800">Activo</Badge>
                    </div>
                  </div>

                  {/* Domain age calculation */}
                  <div className="mt-4 p-4 bg-blue-50 rounded-md">
                    <p>
                      <span className="font-medium">Antigüedad del dominio:</span> 
                      <span className="ml-2">
                        {Math.floor((new Date().getTime() - historyData.registrationDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000))} años
                      </span>
                    </p>
                    <p className="text-sm text-blue-800 mt-2">
                      <Info className="h-4 w-4 inline mr-1" />
                      Los dominios con mayor antigüedad suelen tener mejor posicionamiento SEO.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <AlertTriangle className="h-10 w-10 mx-auto text-gray-400" />
                  <p className="mt-2 text-gray-500">No se pudo obtener información histórica</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* WHOIS Data */}
          <Card className="shadow-sm">
            <CardHeader className="bg-white py-4">
              <CardTitle className="flex items-center text-lg">
                <User className="h-5 w-5 mr-2 text-blue-700" />
                Datos de contacto (WHOIS)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {mockWhoisData.privacy ? (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Este dominio utiliza protección de privacidad. Los datos de contacto no están disponibles públicamente.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">Propietario:</span> 
                    <span className="ml-2">{mockWhoisData.owner.name}</span>
                  </div>
                  
                  {mockWhoisData.owner.organization && (
                    <div>
                      <span className="font-medium">Organización:</span> 
                      <span className="ml-2">{mockWhoisData.owner.organization}</span>
                    </div>
                  )}
                  
                  <div>
                    <span className="font-medium">Email:</span> 
                    <span className="ml-2">
                      <a href={`mailto:${mockWhoisData.owner.email}`} className="text-blue-600 hover:underline flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {mockWhoisData.owner.email}
                      </a>
                    </span>
                  </div>
                  
                  <div>
                    <span className="font-medium">Dirección:</span> 
                    <span className="ml-2">{mockWhoisData.owner.address}</span>
                  </div>
                  
                  <div>
                    <span className="font-medium">Teléfono:</span> 
                    <span className="ml-2">{mockWhoisData.owner.phone}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status History */}
          {historyData?.statusHistory && historyData.statusHistory.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="bg-white py-4">
                <CardTitle className="flex items-center text-lg">
                  <History className="h-5 w-5 mr-2 text-blue-700" />
                  Historial de cambios
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Cambio</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historyData.statusHistory.map((item: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{formatDate(item.date)}</TableCell>
                        <TableCell>{item.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Similar Domains */}
          <Card className="shadow-sm">
            <CardHeader className="bg-white py-4">
              <CardTitle className="flex items-center text-lg">
                <Globe className="h-5 w-5 mr-2 text-blue-700" />
                Dominios similares
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {similarDomains.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {similarDomains.map((domain, index) => (
                    <div key={index} className="p-2 border rounded-md text-center">
                      <a 
                        href={`/whois/${domain.name}${domain.extension.replace('.', '-')}`} 
                        className="text-blue-600 hover:underline"
                      >
                        {domain.name}<span className="font-bold">{domain.extension}</span>
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No se encontraron dominios similares</p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default DomainHistoryData;

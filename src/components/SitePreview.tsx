
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, RefreshCw, ExternalLink, AlertCircle, Wifi } from 'lucide-react';
import { screenshotService, type ScreenshotResult } from '@/services/screenshotService';

interface SitePreviewProps {
  domain: string;
  className?: string;
}

const SitePreview: React.FC<SitePreviewProps> = ({ domain, className = '' }) => {
  const [previewState, setPreviewState] = useState<{
    loading: boolean;
    loaded: boolean;
    error: boolean;
    imageUrl?: string;
    provider?: string;
    isDomainAccessible?: boolean;
  }>({
    loading: true,
    loaded: false,
    error: false
  });

  const [retryCount, setRetryCount] = useState(0);

  const loadPreview = async () => {
    setPreviewState(prev => ({ ...prev, loading: true, error: false }));
    
    try {
      // First check if domain is accessible
      const isAccessible = await screenshotService.isDomainAccessible(domain);
      
      if (!isAccessible) {
        setPreviewState({
          loading: false,
          loaded: false,
          error: true,
          isDomainAccessible: false
        });
        return;
      }

      // Try to capture screenshot
      const result: ScreenshotResult = await screenshotService.captureScreenshot(domain);
      
      if (result.success && result.imageUrl) {
        setPreviewState({
          loading: false,
          loaded: true,
          error: false,
          imageUrl: result.imageUrl,
          provider: result.provider,
          isDomainAccessible: true
        });
      } else {
        setPreviewState({
          loading: false,
          loaded: false,
          error: true,
          isDomainAccessible: true
        });
      }
    } catch (error) {
      console.error('Preview error:', error);
      setPreviewState({
        loading: false,
        loaded: false,
        error: true,
        isDomainAccessible: true
      });
    }
  };

  useEffect(() => {
    loadPreview();
  }, [domain]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    loadPreview();
  };

  const renderPreviewContent = () => {
    if (previewState.loading) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 mx-auto animate-spin text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">Capturando vista previa...</p>
          </div>
        </div>
      );
    }

    if (previewState.error) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="text-center px-4">
            {previewState.isDomainAccessible === false ? (
              <>
                <Wifi className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-3">
                  El dominio no está configurado o no es accesible
                </p>
              </>
            ) : (
              <>
                <AlertCircle className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-3">
                  No se pudo capturar la vista previa
                </p>
              </>
            )}
            <Button 
              onClick={handleRetry} 
              variant="outline" 
              size="sm"
              className="text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Reintentar
            </Button>
          </div>
        </div>
      );
    }

    if (previewState.loaded && previewState.imageUrl) {
      return (
        <>
          <img 
            src={previewState.imageUrl}
            alt={`Vista previa de ${domain}`} 
            className="w-full h-full object-cover"
            onError={() => setPreviewState(prev => ({ ...prev, error: true, loaded: false }))}
          />
          {previewState.provider && (
            <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded">
              {previewState.provider}
            </div>
          )}
        </>
      );
    }

    return null;
  };

  return (
    <Card className={`border overflow-hidden shadow-md bg-white ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-700" />
          Vista previa del sitio
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[200px] relative overflow-hidden bg-gray-100">
          {renderPreviewContent()}
        </div>
        <div className="p-3 bg-white border-t">
          <a 
            href={`https://${domain}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm text-blue-600 hover:underline flex items-center"
          >
            <Globe className="h-3 w-3 mr-1" />
            Visitar sitio
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default SitePreview;

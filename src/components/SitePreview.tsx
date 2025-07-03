
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, RefreshCw, ExternalLink, AlertCircle, Wifi, Image as ImageIcon } from 'lucide-react';
import { screenshotService, type ScreenshotResult } from '@/services/screenshotService';

interface SitePreviewProps {
  domain: string;
  className?: string;
}

const SitePreview: React.FC<SitePreviewProps> = ({ domain, className = '' }) => {
  const [previewState, setPreviewState] = useState<{
    loading: boolean;
    result?: ScreenshotResult;
  }>({
    loading: true
  });

  const [retryCount, setRetryCount] = useState(0);

  const loadPreview = async () => {
    setPreviewState({ loading: true });
    
    try {
      const result = await screenshotService.captureScreenshot(domain);
      setPreviewState({
        loading: false,
        result
      });
    } catch (error) {
      console.error('Preview error:', error);
      setPreviewState({
        loading: false,
        result: {
          success: false,
          error: 'Error al cargar la vista previa'
        }
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

    const { result } = previewState;
    if (!result) return null;

    if (result.success && result.imageUrl) {
      return (
        <>
          <img 
            src={result.imageUrl}
            alt={`Vista previa de ${domain}`} 
            className="w-full h-full object-cover"
            onError={() => setPreviewState(prev => ({
              ...prev,
              result: {
                success: false,
                error: 'Error al cargar la imagen'
              }
            }))}
          />
          {result.provider && (
            <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded">
              {result.provider}
            </div>
          )}
        </>
      );
    }

    // Fallback content
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="text-center px-4">
          {result.fallbackData?.favicon ? (
            <div className="mb-4">
              <img 
                src={result.fallbackData.favicon} 
                alt={`Favicon de ${domain}`}
                className="h-12 w-12 mx-auto rounded-lg shadow-sm"
              />
            </div>
          ) : (
            <div className="mb-4">
              <div className="h-12 w-12 mx-auto bg-blue-100 rounded-lg flex items-center justify-center">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          )}
          
          <h3 className="font-medium text-gray-800 mb-1">{domain}</h3>
          <p className="text-xs text-gray-600 mb-3">
            {result.fallbackData?.description || 'Vista previa no disponible'}
          </p>
          
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-3">
            <ImageIcon className="h-3 w-3" />
            <span>Captura no disponible</span>
          </div>
          
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

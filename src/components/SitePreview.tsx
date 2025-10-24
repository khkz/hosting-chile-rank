
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
        <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-muted/50 to-muted/30 bg-[length:200%_200%] animate-gradient overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/50 to-transparent animate-shimmer" />
          <div className="flex items-center justify-center h-full relative z-10">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 mx-auto animate-spin text-primary" />
              <p className="mt-2 text-sm text-muted-foreground font-medium">Capturando vista previa...</p>
            </div>
          </div>
        </div>
      );
    }

    const { result } = previewState;
    if (!result) return null;

    if (result.success && result.imageUrl) {
      return (
        <div className="relative w-full h-full group overflow-hidden">
          <img 
            src={result.imageUrl}
            alt={`Vista previa de ${domain}`} 
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
            onError={() => setPreviewState(prev => ({
              ...prev,
              result: {
                success: false,
                error: 'Error al cargar la imagen'
              }
            }))}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {result.provider && (
            <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg">
              {result.provider}
            </div>
          )}
        </div>
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
    <Card variant="hover-lift" className={`overflow-hidden ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg group-hover:scale-110 transition-transform">
            <Globe className="h-5 w-5 text-primary" />
          </div>
          Vista previa del sitio
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[200px] relative overflow-hidden bg-muted">
          {renderPreviewContent()}
        </div>
        <div className="p-4 bg-card border-t">
          <a 
            href={`https://${domain}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium"
          >
            <Globe className="h-4 w-4" />
            <span className="relative">
              Visitar sitio
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </span>
            <ExternalLink className="h-3 w-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default SitePreview;

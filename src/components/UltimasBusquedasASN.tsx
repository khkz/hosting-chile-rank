import React from 'react';
import { Link } from 'react-router-dom';
import { History, Trash2, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useASNSearchHistory } from '@/hooks/useASNSearchHistory';
import { isChileanASN } from '@/utils/ipDetection';

const UltimasBusquedasASN: React.FC = () => {
  const { history, clearHistory } = useASNSearchHistory();

  if (history.length === 0) {
    return null;
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const searchDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - searchDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'hace un momento';
    if (diffInMinutes < 60) return `hace ${diffInMinutes}m`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `hace ${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `hace ${diffInDays}d`;
    
    return searchDate.toLocaleDateString('es-CL');
  };

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <History className="h-5 w-5 text-muted-foreground" />
          Últimas búsquedas ASN
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearHistory}
          className="text-muted-foreground hover:text-foreground"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {history.map((item) => {
            const isChilean = isChileanASN(item.asn.toString());
            
            return (
              <Link
                key={item.asn}
                to={`/asn/AS${item.asn}`}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-medium text-foreground">
                      AS{item.asn}
                    </span>
                    {isChilean && (
                      <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-md border">
                        🇨🇱 Chile
                      </span>
                    )}
                    {item.countryCode && !isChilean && (
                      <span className="text-xs px-1.5 py-0.5 bg-muted text-muted-foreground rounded-md">
                        {item.countryCode}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground truncate max-w-xs">
                    {item.name}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatTimeAgo(item.searchedAt)}
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default UltimasBusquedasASN;
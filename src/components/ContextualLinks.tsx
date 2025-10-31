import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, GitCompare, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContextualLinksProps {
  companySlug: string;
  companyName: string;
  showComparison?: boolean;
  showReview?: boolean;
  showWordPress?: boolean;
}

const ContextualLinks: React.FC<ContextualLinksProps> = ({
  companySlug,
  companyName,
  showComparison = true,
  showReview = true,
  showWordPress = true,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border/40">
      {showComparison && (
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8 text-xs hover:bg-primary/10 hover:text-primary"
        >
          <Link to="/comparativa" className="flex items-center gap-1">
            <GitCompare className="h-3 w-3" />
            Comparar con otros
          </Link>
        </Button>
      )}
      
      {showReview && (
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8 text-xs hover:bg-primary/10 hover:text-primary"
        >
          <Link to={`/catalogo/${companySlug}`} className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            Review completa
          </Link>
        </Button>
      )}
      
      {showWordPress && (
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8 text-xs hover:bg-primary/10 hover:text-primary"
        >
          <Link to="/mejor-hosting-wordpress-chile" className="flex items-center gap-1">
            <ArrowRight className="h-3 w-3" />
            Mejor para WordPress
          </Link>
        </Button>
      )}
    </div>
  );
};

export default ContextualLinks;

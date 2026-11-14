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

/** Enlaces de contexto bajo una ficha de proveedor, con los rótulos únicos del sitio. */
const ContextualLinks: React.FC<ContextualLinksProps> = ({
  companySlug,
  companyName,
  showComparison = true,
  showReview = true,
  showWordPress = true,
}) => {
  return (
    <div className="mt-3 flex flex-wrap gap-2 border-t border-rule pt-3">
      {showComparison && (
        <Button asChild variant="ghost" size="sm">
          <Link to="/comparativa">
            <GitCompare aria-hidden />
            Comparar
          </Link>
        </Button>
      )}

      {showReview && (
        <Button asChild variant="ghost" size="sm">
          <Link to={`/catalogo/${companySlug}`} aria-label={`Ver ficha de ${companyName}`}>
            <FileText aria-hidden />
            Ver ficha
          </Link>
        </Button>
      )}

      {showWordPress && (
        <Button asChild variant="ghost" size="sm">
          <Link to="/mejor-hosting-wordpress-chile">
            <ArrowRight aria-hidden />
            Mejor para WordPress
          </Link>
        </Button>
      )}
    </div>
  );
};

export default ContextualLinks;

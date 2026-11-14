import MedalBadge from '@/components/MedalBadge';
import { Badge } from '@/components/ui/badge';
import { useCompanyCertifications } from '@/components/ficha/providerQueries';

interface CertificationBadgesProps {
  companySlug: string;
  variant?: 'horizontal' | 'grid';
  size?: 'small' | 'medium' | 'large';
}

export default function CertificationBadges({ companySlug, size = 'small' }: CertificationBadgesProps) {
  const { data: certifications, isLoading } = useCompanyCertifications(companySlug);

  if (isLoading || !certifications || certifications.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="t-h3 text-ink">Certificaciones</h3>
      <ul className="mt-3 flex flex-wrap gap-2.5">
        {certifications.map((cert) =>
          cert.certification_categories ? (
            <li key={cert.id} className="flex items-center gap-2">
              <MedalBadge position={cert.position} categoryName={cert.certification_categories.name} size={size === 'large' ? 'medium' : 'small'} />
              {cert.tier === 'premium' && <Badge variant="outline">Premium</Badge>}
            </li>
          ) : null,
        )}
      </ul>
    </div>
  );
}

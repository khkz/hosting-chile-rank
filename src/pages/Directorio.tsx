import React, { useMemo } from 'react';
import { formatCorporateGroup } from '@/lib/formatGroup';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Phone, MapPin, Clock, Server, Building2, FileText, Cpu, Star } from 'lucide-react';
import DynamicMetaTags from '@/components/SEO/DynamicMetaTags';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import { getProviderLink, isHiddenProvider } from '@/lib/providerLinks';

const CURRENT_YEAR = new Date().getFullYear();

const Directorio: React.FC = () => {
  const { data: companies, isLoading } = useQuery({
    queryKey: ['directorio-completo-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hosting_companies')
        .select('id, slug, name, website, overall_rating, is_curated, is_verified, contact_phone, contact_address, contact_hours, datacenter_location, corporate_group, legal_name, technologies')
        .range(0, 999);
      if (error) throw error;
      return data || [];
    },
  });

  const sorted = useMemo(() => {
    const list = (companies || []).filter((c: any) => !isHiddenProvider(c.slug, c.website));
    const curated = list
      .filter((c: any) => c.is_curated === true && (c.overall_rating ?? 0) > 0)
      .sort((a: any, b: any) => (b.overall_rating || 0) - (a.overall_rating || 0));
    const rest = list
      .filter((c: any) => !(c.is_curated === true && (c.overall_rating ?? 0) > 0))
      .sort((a: any, b: any) => a.name.localeCompare(b.name, 'es'));
    return [...curated, ...rest];
  }, [companies]);

  return (
    <>
      <DynamicMetaTags
        title={`Directorio completo de hosting Chile ${CURRENT_YEAR} | EligeTuHosting`}
        description="Listado completo de proveedores de hosting en Chile con datos verificables: contacto, dirección, datacenter, grupo corporativo y tecnologías."
        canonical="https://eligetuhosting.cl/directorio"
      />
      <Navbar />
      <div className="container mx-auto px-4 pt-8">
        <SEOBreadcrumbs items={[{ name: 'Directorio completo', href: '/directorio' }]} />
      </div>

      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-12 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Directorio completo de hosting en Chile
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {sorted.length} proveedores listados. Primero los curados con nota, luego el resto en orden alfabético con sus datos verificables.
          </p>
        </div>
      </section>

      <section className="py-10 bg-background">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <p className="text-center text-muted-foreground">Cargando proveedores…</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {sorted.map((c: any) => {
                const hasRating = c.is_curated === true && (c.overall_rating ?? 0) > 0;
                const link = c.slug && c.website ? getProviderLink(c.slug, c.website) : null;
                const techs: string[] = Array.isArray(c.technologies)
                  ? c.technologies.filter((t: any) => typeof t === 'string')
                  : [];
                return (
                  <Card key={c.id} className="flex flex-col hover:shadow-md transition-shadow">
                    <CardContent className="pt-5 flex-grow space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="text-lg font-semibold leading-tight">
                          <Link to={`/catalogo/${c.slug}`} className="hover:text-primary">
                            {c.name}
                          </Link>
                        </h2>
                        {hasRating ? (
                          <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-medium shrink-0">
                            <Star className="h-3 w-3 fill-current" />
                            {Number(c.overall_rating).toFixed(1)}/10
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-[10px] shrink-0">
                            Datos verificables
                          </Badge>
                        )}
                      </div>

                      <ul className="text-sm text-muted-foreground space-y-1.5">
                        {c.legal_name && (
                          <li className="flex items-start gap-2">
                            <FileText className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                            <span>{c.legal_name}</span>
                          </li>
                        )}
                        {c.corporate_group && (
                          <li className="flex items-start gap-2">
                            <Building2 className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                            <span>{formatCorporateGroup(c.corporate_group)}</span>
                          </li>
                        )}
                        {c.datacenter_location && (
                          <li className="flex items-start gap-2">
                            <Server className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                            <span>{c.datacenter_location}</span>
                          </li>
                        )}
                        {c.contact_phone && (
                          <li className="flex items-start gap-2">
                            <Phone className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                            <span>{c.contact_phone}</span>
                          </li>
                        )}
                        {c.contact_address && (
                          <li className="flex items-start gap-2">
                            <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                            <span>{c.contact_address}</span>
                          </li>
                        )}
                        {c.contact_hours && (
                          <li className="flex items-start gap-2">
                            <Clock className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                            <span>{c.contact_hours}</span>
                          </li>
                        )}
                        {techs.length > 0 && (
                          <li className="flex items-start gap-2">
                            <Cpu className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                            <span>{techs.slice(0, 6).join(', ')}</span>
                          </li>
                        )}
                      </ul>
                    </CardContent>
                    <div className="border-t bg-muted/40 p-3 flex flex-col sm:flex-row gap-2">
                      <Button asChild size="sm" variant="default" className="w-full sm:w-auto">
                        <Link to={`/catalogo/${c.slug}`}>Ver ficha</Link>
                      </Button>
                      {link && (
                        <Button asChild size="sm" variant="outline" className="w-full sm:w-auto gap-1">
                          <a href={link.href} target="_blank" rel={link.rel} referrerPolicy="no-referrer">
                            Visitar sitio <ExternalLink size={14} />
                          </a>
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Directorio;

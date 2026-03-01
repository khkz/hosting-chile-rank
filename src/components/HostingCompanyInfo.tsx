
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, CheckCircle, XCircle, Shield, CreditCard, Clock } from 'lucide-react';

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  hours: string;
}

interface PlanFeature {
  name: string;
  included: boolean;
}

interface PricingPeriod {
  monthly: number;
  sixMonths?: number;
  annual: number;
  biannual?: number;
  triannual: number;
  includesDomainFrom?: 'annual' | 'biannual' | 'triannual';
}

interface Plan {
  name: string;
  price: number;
  pricing?: PricingPeriod;
  storage: string;
  bandwidth: string;
  domains: number;
  features: PlanFeature[];
}

export interface HostingCompanyData {
  id: string;
  name: string;
  logo: string;
  description: string;
  descriptionEditorial?: string;
  rating: number;
  yearFounded: number;
  datacenterLocation: string;
  website: string;
  contactInfo: ContactInfo;
  plans: Plan[];
  technologies?: string[];
  uptimeGuarantee?: string;
  hasSslFree?: boolean;
  hasMigrationFree?: boolean;
  paymentMethods?: string[];
  pros?: string[];
  cons?: string[];
  uniqueSellingPoint?: string;
  corporateGroup?: string;
  lastScrapedAt?: string;
}

interface HostingCompanyInfoProps {
  company: HostingCompanyData;
}

const HostingCompanyInfo: React.FC<HostingCompanyInfoProps> = ({ company }) => {
  const displayDescription = company.descriptionEditorial || company.description;

  return (
    <div className="space-y-8">
      {/* Company Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
        <div className="w-40 h-32 flex items-center justify-center bg-white p-4 rounded-lg shadow-sm">
          <img 
            src={company.logo} 
            alt={`Logo de ${company.name}`}
            className="max-w-full max-h-full object-contain"
            loading="lazy" 
          />
        </div>
        
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">{company.name}</h1>
            <div className="bg-muted text-foreground px-3 py-1 rounded-full text-sm font-medium">
              {company.rating}/10 puntos
            </div>
            {company.corporateGroup && (
              <Badge variant="outline" className="text-xs">Grupo {company.corporateGroup}</Badge>
            )}
          </div>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-muted-foreground">
            {company.yearFounded > 0 && <div>Fundado en {company.yearFounded}</div>}
            {company.datacenterLocation && <div>Datacenter en {company.datacenterLocation}</div>}
          </div>
          
          <p className="mt-3 text-muted-foreground">{displayDescription}</p>

          {company.uniqueSellingPoint && (
            <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm font-medium text-primary">💡 {company.uniqueSellingPoint}</p>
            </div>
          )}
          
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild variant="outline" className="gap-2">
              <a href={company.website} target="_blank" rel="noopener noreferrer">
                Visitar Sitio Web <ExternalLink size={16} />
              </a>
            </Button>
            {company.hasSslFree && (
              <Badge className="bg-green-100 text-green-800"><Shield className="w-3 h-3 mr-1" />SSL Gratis</Badge>
            )}
            {company.hasMigrationFree && (
              <Badge className="bg-blue-100 text-blue-800">Migración Gratis</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Pros / Cons */}
      {(company.pros?.length || company.cons?.length) ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {company.pros && company.pros.length > 0 && (
            <Card className="border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" /> Ventajas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {company.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          {company.cons && company.cons.length > 0 && (
            <Card className="border-red-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500" /> Desventajas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {company.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-red-500 mt-0.5">✗</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      ) : null}
      
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información de Contacto</CardTitle>
          <CardDescription>Detalles para contactar a {company.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {company.contactInfo.phone && (
              <div>
                <h3 className="font-medium mb-1">Teléfono</h3>
                <p><a href={`tel:${company.contactInfo.phone}`} className="text-primary hover:underline">{company.contactInfo.phone}</a></p>
              </div>
            )}
            {company.contactInfo.email && (
              <div>
                <h3 className="font-medium mb-1">Email</h3>
                <p><a href={`mailto:${company.contactInfo.email}`} className="text-primary hover:underline">{company.contactInfo.email}</a></p>
              </div>
            )}
            {company.contactInfo.address && (
              <div>
                <h3 className="font-medium mb-1">Dirección</h3>
                <p>{company.contactInfo.address}</p>
              </div>
            )}
            {company.contactInfo.hours && (
              <div>
                <h3 className="font-medium mb-1">Horario de Atención</h3>
                <p>{company.contactInfo.hours}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Plans */}
      {company.plans.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Planes de Hosting</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {company.plans.map((plan) => (
              <Card key={plan.name} className="overflow-hidden">
                <CardHeader className="bg-muted">
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="mt-2 text-2xl font-bold text-foreground">
                    ${plan.price.toLocaleString('es-CL')}/mes
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Almacenamiento</div>
                      <div className="font-medium">{plan.storage}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Transferencia</div>
                      <div className="font-medium">{plan.bandwidth}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Dominios</div>
                      <div className="font-medium">{plan.domains}</div>
                    </div>
                    
                    {plan.features?.length > 0 && (
                      <div className="pt-2 border-t">
                        <div className="text-sm font-medium text-muted-foreground mb-2">Características</div>
                        <ul className="space-y-1">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              {feature.included ? (
                                <span className="text-green-500">✓</span>
                              ) : (
                                <span className="text-red-500">✗</span>
                              )}
                              {feature.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <Button className="w-full mt-6" asChild>
                    <a href={company.website} target="_blank" rel="noopener noreferrer">
                      Contratar Plan
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Technical Details - Dynamic from DB data */}
      <Card>
        <CardHeader>
          <CardTitle>Detalles Técnicos</CardTitle>
          <CardDescription>Especificaciones técnicas de {company.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Característica</TableHead>
                <TableHead>Detalles</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {company.technologies && company.technologies.length > 0 && (
                <TableRow>
                  <TableCell className="font-medium">Tecnologías</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {company.technologies.map((tech, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{tech}</Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {company.uptimeGuarantee && (
                <TableRow>
                  <TableCell className="font-medium">Uptime garantizado</TableCell>
                  <TableCell>{company.uptimeGuarantee}</TableCell>
                </TableRow>
              )}
              {company.datacenterLocation && (
                <TableRow>
                  <TableCell className="font-medium">Ubicación Datacenter</TableCell>
                  <TableCell>{company.datacenterLocation}</TableCell>
                </TableRow>
              )}
              {company.paymentMethods && company.paymentMethods.length > 0 && (
                <TableRow>
                  <TableCell className="font-medium">
                    <span className="flex items-center gap-1"><CreditCard className="w-4 h-4" /> Medios de Pago</span>
                  </TableCell>
                  <TableCell>{company.paymentMethods.join(', ')}</TableCell>
                </TableRow>
              )}
              {company.hasSslFree !== undefined && (
                <TableRow>
                  <TableCell className="font-medium">SSL Gratuito</TableCell>
                  <TableCell>{company.hasSslFree ? '✅ Incluido' : '❌ No incluido'}</TableCell>
                </TableRow>
              )}
              {company.hasMigrationFree !== undefined && (
                <TableRow>
                  <TableCell className="font-medium">Migración Gratuita</TableCell>
                  <TableCell>{company.hasMigrationFree ? '✅ Incluida' : '❌ No incluida'}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {company.lastScrapedAt && (
            <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Datos actualizados: {new Date(company.lastScrapedAt).toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HostingCompanyInfo;


import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

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

interface Plan {
  name: string;
  price: number;
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
  rating: number;
  yearFounded: number;
  datacenterLocation: string;
  website: string;
  contactInfo: ContactInfo;
  plans: Plan[];
}

interface HostingCompanyInfoProps {
  company: HostingCompanyData;
}

const HostingCompanyInfo: React.FC<HostingCompanyInfoProps> = ({ company }) => {
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
            <h1 className="text-3xl font-bold text-[#2B2D42]">{company.name}</h1>
            <div className="bg-[#EDF2F4] text-[#2B2D42] px-3 py-1 rounded-full text-sm font-medium">
              {company.rating}/10 puntos
            </div>
          </div>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-gray-600">
            <div>Fundado en {company.yearFounded}</div>
            <div>Datacenter en {company.datacenterLocation}</div>
          </div>
          
          <p className="mt-3 text-gray-700">{company.description}</p>
          
          <div className="mt-4">
            <Button asChild variant="outline" className="gap-2">
              <a href={company.website} target="_blank" rel="noopener noreferrer">
                Visitar Sitio Web <ExternalLink size={16} />
              </a>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información de Contacto</CardTitle>
          <CardDescription>Detalles para contactar a {company.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-1">Teléfono</h3>
              <p><a href={`tel:${company.contactInfo.phone}`} className="text-[#EF233C] hover:underline">{company.contactInfo.phone}</a></p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Email</h3>
              <p><a href={`mailto:${company.contactInfo.email}`} className="text-[#EF233C] hover:underline">{company.contactInfo.email}</a></p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Dirección</h3>
              <p>{company.contactInfo.address}</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Horario de Atención</h3>
              <p>{company.contactInfo.hours}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Plans */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Planes de Hosting</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {company.plans.map((plan) => (
            <Card key={plan.name} className="overflow-hidden">
              <CardHeader className="bg-[#EDF2F4]">
                <CardTitle>{plan.name}</CardTitle>
                <div className="mt-2 text-2xl font-bold text-[#2B2D42]">
                  ${plan.price.toLocaleString('es-CL')}/mes
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Almacenamiento</div>
                    <div className="font-medium">{plan.storage}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Transferencia</div>
                    <div className="font-medium">{plan.bandwidth}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Dominios</div>
                    <div className="font-medium">{plan.domains}</div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="text-sm font-medium text-gray-500 mb-2">Características</div>
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
                </div>
                
                <Button className="w-full mt-6 bg-[#EF233C] hover:bg-red-700">
                  Contratar Plan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Technical Details */}
      <Card>
        <CardHeader>
          <CardTitle>Detalles Técnicos</CardTitle>
          <CardDescription>Especificaciones técnicas de los servidores de {company.name}</CardDescription>
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
              <TableRow>
                <TableCell className="font-medium">Panel de Control</TableCell>
                <TableCell>cPanel / WHM</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Servidor Web</TableCell>
                <TableCell>LiteSpeed Enterprise / Apache</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Versiones PHP</TableCell>
                <TableCell>5.6, 7.4, 8.0, 8.1, 8.2</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Base de Datos</TableCell>
                <TableCell>MySQL 8.0, MariaDB</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Backups</TableCell>
                <TableCell>Diarios con JetBackup</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Uptime garantizado</TableCell>
                <TableCell>99.9%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Soporte técnico</TableCell>
                <TableCell>24/7 por teléfono, email y tickets</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default HostingCompanyInfo;
